import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const view = readFileSync(new URL('../src/views/DocumentationView.vue', import.meta.url), 'utf8')
const source = readFileSync(new URL('../public/examples/oauth-demo/main.go', import.meta.url), 'utf8')

test('Dev Portal links directly to a public downloadable example, not private sources', () => {
  const local = view.split('<section id="oauth-local-test"')[1].split('<section id="first-request"')[0]
  assert.match(local, /href="\/examples\/oauth-demo\/main.go"/)
  assert.match(local, /download="echotalk-oauth-demo.go"/)
  assert.match(view, /Invoke-WebRequest -Uri "\$\(\$env:ECHOTALK_PORTAL_URL\)\/examples\/oauth-demo\/main.go"/)
  assert.match(view, /go run/)
  assert.doesNotMatch(local, /backend\/examples|github\.com\/.*EchoTalk/)
})

test('Public example is self-contained and does not disclose credentials', () => {
  assert.match(source, /package main/)
  assert.match(source, /"crypto\/rand"/)
  assert.match(source, /"crypto\/subtle"/)
  assert.match(source, /"ECHOTALK_CLIENT_SECRET"/)
  assert.match(source, /"ECHOTALK_CLIENT_ID"/)
  assert.match(source, /"127\.0\.0\.1:3001"/)
  assert.match(source, /"\/oauth\/start"/)
  assert.match(source, /"\/oauth\/callback"/)
  assert.match(source, /"\/bot\/me"/)
  assert.match(source, /http\.SameSiteLaxMode/)
  assert.match(source, /http\.ErrUseLastResponse/)
  assert.doesNotMatch(source, /client_secret\s*[:=]\s*"[a-z0-9-]{12,}/i)
  assert.doesNotMatch(source, /fmt\.Print(?:f|ln)?\(.*(?:AccessToken|RefreshToken|ClientSecret)/)
})

test('Production contract section stays HTTPS-only; local addresses stay isolated', () => {
  const prod = view.split('<section id="oauth-install"')[1].split('<section id="oauth-local-test"')[0]
  assert.doesNotMatch(prod, /127\.0\.0\.1:3001|localhost:3000/)
  assert.match(view, /https:\/\/mybot\.ru\/oauth\/callback/)
})
