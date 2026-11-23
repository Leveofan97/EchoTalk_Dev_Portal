// Frontend safety checks complement, but never replace, backend's exact URI registration.
export interface OAuthStartRequest {
  state: string
  redirectUri: string
}

export interface OAuthAuthorizationResult {
  code: string
  state: string
  redirect_uri: string
  redirect_to: string
}

export function isSafeBotOAuthURL(raw: string): boolean {
  try {
    const url = new URL(raw)
    if (url.username || url.password || url.hash || !url.hostname) return false
    if (url.protocol === 'https:') return true
    if (url.protocol !== 'http:') return false
    const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
    return hostname === 'localhost' || /^127(?:\.\d{1,3}){3}$/.test(hostname) || hostname === '::1'
  } catch { return false }
}

export function parseOAuthStartRequest(
  stateValue: unknown,
  redirectValue: unknown,
): OAuthStartRequest | null {
  if (typeof stateValue !== 'string' || typeof redirectValue !== 'string') return null
  if (!/^[A-Za-z0-9._~-]{16,256}$/.test(stateValue)) return null
  if (!isSafeBotOAuthURL(redirectValue)) return null
  return { state: stateValue, redirectUri: redirectValue }
}

/** Accept only the server-generated callback for the original, bot-initiated request. */
export function validateOAuthCallback(
  result: OAuthAuthorizationResult,
  expected: OAuthStartRequest,
): string {
  if (!result || result.state !== expected.state || result.redirect_uri !== expected.redirectUri) {
    throw new Error('OAuth: state или Redirect URI не совпадают с запросом')
  }
  if (typeof result.code !== 'string' || !result.code) {
    throw new Error('OAuth: сервер не вернул authorization code')
  }
  if (typeof result.redirect_to !== 'string' || !isSafeBotOAuthURL(result.redirect_to)) {
    throw new Error('OAuth: недопустимый адрес callback')
  }
  const target = new URL(result.redirect_to)
  const registered = new URL(expected.redirectUri)
  if (target.origin !== registered.origin || target.pathname !== registered.pathname || target.hash) {
    throw new Error('OAuth: callback не совпадает с зарегистрированным адресом')
  }
  if (target.searchParams.get('code') !== result.code || target.searchParams.get('state') !== expected.state ||
      target.searchParams.getAll('code').length !== 1 || target.searchParams.getAll('state').length !== 1) {
    throw new Error('OAuth: callback содержит некорректные параметры')
  }
  // The backend may only replace code and state, never other callback query parameters.
  const before = new URLSearchParams(registered.search)
  before.delete('code')
  before.delete('state')
  const after = new URLSearchParams(target.search)
  after.delete('code')
  after.delete('state')
  const normalize = (query: URLSearchParams) => [...query.entries()]
    .sort(([ka, va], [kb, vb]) => ka.localeCompare(kb) || va.localeCompare(vb))
  if (JSON.stringify(normalize(before)) !== JSON.stringify(normalize(after))) {
    throw new Error('OAuth: параметры зарегистрированного callback изменены')
  }
  return target.toString()
}
