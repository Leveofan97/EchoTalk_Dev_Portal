// A public TEST-ONLY EchoTalk OAuth example. No credentials are embedded in this source.
// It deliberately does not persist tokens.
// Review this file before running it. For production, use HTTPS callbacks,
// a database-backed session/state store, encrypted tokens and refresh rotation.
package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

type config struct {
	APIURL, PortalURL, ClientID, ClientSecret, RedirectURI, BotID string
}

type tokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func getenv(name string) string {
	value := strings.TrimSpace(os.Getenv(name))
	if value == "" {
		log.Fatalf("required environment variable %s is missing", name)
	}
	return value
}

func randomState() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func main() {
	cfg := config{
		APIURL:       getenv("ECHOTALK_API_URL"),
		PortalURL:    getenv("ECHOTALK_PORTAL_URL"),
		ClientID:     getenv("ECHOTALK_CLIENT_ID"),
		ClientSecret: getenv("ECHOTALK_CLIENT_SECRET"),
		RedirectURI:  getenv("ECHOTALK_REDIRECT_URI"),
		BotID:        getenv("ECHOTALK_BOT_ID"),
	}
	if _, err := strconv.ParseUint(cfg.BotID, 10, 32); err != nil {
		log.Fatal("invalid bot ID")
	}
	redirect, err := url.Parse(cfg.RedirectURI)
	if err != nil || redirect.Scheme != "http" || redirect.Host != "127.0.0.1:3001" ||
		redirect.Path != "/oauth/callback" || redirect.RawQuery != "" || redirect.Fragment != "" || redirect.User != nil {
		log.Fatal("this TEST-ONLY example requires http://127.0.0.1:3001/oauth/callback")
	}
	portal, err := url.Parse(cfg.PortalURL)
	if err != nil || portal.Scheme != "https" || portal.Host == "" || portal.User != nil ||
		portal.RawQuery != "" || portal.Fragment != "" || portal.Path != "" {
		log.Fatal("ECHOTALK_PORTAL_URL must be the HTTPS origin of the public Dev Portal, e.g. https://portal.example")
	}
	api, err := url.Parse(cfg.APIURL)
	if err != nil || api.Scheme != "https" || api.Host == "" || api.User != nil ||
		api.RawQuery != "" || api.Fragment != "" || api.Path != "" {
		log.Fatal("ECHOTALK_API_URL must be an HTTPS origin")
	}

	// Never forward credentials to another host via HTTP redirects.
	httpClient := &http.Client{
		Timeout:       12 * time.Second,
		CheckRedirect: func(_ *http.Request, _ []*http.Request) error { return http.ErrUseLastResponse },
	}
	mux := http.NewServeMux()
	mux.HandleFunc("/oauth/start", func(w http.ResponseWriter, r *http.Request) {
		setNoStore(w)
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		state, err := randomState()
		if err != nil {
			http.Error(w, "internal error", 500)
			return
		}
		// The browser carries this first-party cookie back on the top-level callback.
		http.SetCookie(w, &http.Cookie{
			Name: "et_oauth_state", Value: state, Path: "/oauth", MaxAge: 600,
			HttpOnly: true, SameSite: http.SameSiteLaxMode, Secure: redirect.Scheme == "https",
		})
		target := *portal
		target.Path = strings.TrimRight(target.Path, "/") + "/explore/" + cfg.BotID
		query := target.Query()
		query.Set("state", state)
		query.Set("redirect_uri", cfg.RedirectURI)
		target.RawQuery = query.Encode()
		http.Redirect(w, r, target.String(), http.StatusSeeOther)
	})
	mux.HandleFunc("/oauth/callback", func(w http.ResponseWriter, r *http.Request) {
		setNoStore(w)
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		if errText := r.URL.Query().Get("error"); errText != "" {
			http.Error(w, "authorization was denied", http.StatusBadRequest)
			return
		}
		cookie, err := r.Cookie("et_oauth_state")
		if err != nil || len(cookie.Value) != 43 || subtle.ConstantTimeCompare([]byte(r.URL.Query().Get("state")), []byte(cookie.Value)) != 1 ||
			len(r.URL.Query()["state"]) != 1 || len(r.URL.Query()["code"]) != 1 {
			http.Error(w, "invalid OAuth state", http.StatusBadRequest)
			return
		}
		http.SetCookie(w, &http.Cookie{
			Name: "et_oauth_state", Path: "/oauth", MaxAge: -1,
			HttpOnly: true, SameSite: http.SameSiteLaxMode, Secure: redirect.Scheme == "https",
		})
		code := r.URL.Query().Get("code")
		if code == "" {
			http.Error(w, "missing code", http.StatusBadRequest)
			return
		}
		ctx, cancel := context.WithTimeout(r.Context(), 12*time.Second)
		defer cancel()
		body, err := json.Marshal(map[string]string{
			"grant_type": "authorization_code", "code": code,
			"client_id": cfg.ClientID, "client_secret": cfg.ClientSecret,
			"redirect_uri": cfg.RedirectURI,
		})
		if err != nil {
			http.Error(w, "internal error", 500)
			return
		}
		tokenReq, err := http.NewRequestWithContext(ctx, http.MethodPost,
			strings.TrimRight(cfg.APIURL, "/")+"/oauth/token", bytes.NewReader(body))
		if err != nil {
			http.Error(w, "internal error", 500)
			return
		}
		tokenReq.Header.Set("Content-Type", "application/json")
		resp, err := httpClient.Do(tokenReq)
		if err != nil {
			http.Error(w, "token exchange unavailable", http.StatusBadGateway)
			return
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			// Do not forward upstream error bodies that might contain secrets.
			http.Error(w, "authorization exchange failed", http.StatusBadGateway)
			return
		}
		var tokens tokenResponse
		if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&tokens); err != nil ||
			tokens.AccessToken == "" || tokens.RefreshToken == "" {
			http.Error(w, "invalid token response", http.StatusBadGateway)
			return
		}
		// Test-only proof: use the token once without printing or persisting it.
		meReq, err := http.NewRequestWithContext(ctx, http.MethodGet,
			strings.TrimRight(cfg.APIURL, "/")+"/bot/me", nil)
		if err != nil {
			http.Error(w, "internal error", 500)
			return
		}
		meReq.Header.Set("Authorization", "Bearer "+tokens.AccessToken)
		meResp, err := httpClient.Do(meReq)
		if err != nil {
			http.Error(w, "runtime unavailable", http.StatusBadGateway)
			return
		}
		defer meResp.Body.Close()
		if meResp.StatusCode != http.StatusOK {
			http.Error(w, "runtime authorization failed", http.StatusBadGateway)
			return
		}
		// Production implementation must persist both tokens securely, associated with installation ID.
		// In this example both tokens become inaccessible after this request ends.
		http.Redirect(w, r, "/oauth/success", http.StatusSeeOther)
	})
	mux.HandleFunc("/oauth/success", func(w http.ResponseWriter, r *http.Request) {
		setNoStore(w)
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		_, _ = io.WriteString(w, "EchoTalk: OAuth callback and /bot/me succeeded. (TEST ONLY: tokens not stored.)")
	})

	server := &http.Server{
		Addr: "127.0.0.1:3001", Handler: mux,
		ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 15 * time.Second,
		WriteTimeout: 20 * time.Second, IdleTimeout: 60 * time.Second,
		MaxHeaderBytes: 1 << 16,
	}
	log.Print("OAuth test bot ready on http://127.0.0.1:3001/oauth/start")
	if err := server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(fmt.Errorf("oauth test server: %w", err))
	}
}

func setNoStore(w http.ResponseWriter) {
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("Referrer-Policy", "no-referrer")
	w.Header().Set("X-Content-Type-Options", "nosniff")
}
