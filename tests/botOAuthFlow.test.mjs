import assert from 'node:assert/strict'
import test from 'node:test'
import { isSafeBotOAuthURL, parseOAuthStartRequest, validateOAuthCallback } from '../src/utils/botOAuthFlow.ts'

const state = 'e4A_H2cXqNwghB9WQp17iz7N_bfF4m3e'
const redirectUri = 'https://bot.example.com/oauth/callback?tenant=22'

test('start request must contain valid bot-initiated state and safe HTTPS callback', () => {
  assert.deepEqual(parseOAuthStartRequest(state, redirectUri), { state, redirectUri })
  for (const uri of ['javascript:alert(1)', 'http://example.com/cb', 'https://user:pass@example.com', 'https://bot.example.com/cb#secret']) {
    assert.equal(isSafeBotOAuthURL(uri), false)
    assert.equal(parseOAuthStartRequest(state, uri), null)
  }
  assert.equal(parseOAuthStartRequest('short', redirectUri), null)
  assert.equal(parseOAuthStartRequest([state], redirectUri), null)
  assert.equal(isSafeBotOAuthURL('http://localhost:3000/oauth/start'), true)
})

test('server callback is verified against the original client-side request', () => {
  const result = { code:'abc+&x', state, redirect_uri: redirectUri,
    redirect_to:`https://bot.example.com/oauth/callback?tenant=22&code=abc%2B%26x&state=${state}` }
  assert.equal(validateOAuthCallback(result, {state, redirectUri}), new URL(result.redirect_to).toString())
  assert.throws(() => validateOAuthCallback({...result,state:'wrong'}, {state,redirectUri}))
  assert.throws(() => validateOAuthCallback({...result,redirect_to:'https://evil.example/oauth/callback?code=abc%2B%26x&state='+state}, {state,redirectUri}))
  assert.throws(() => validateOAuthCallback({...result,redirect_to:result.redirect_to+'&state=duplicated'}, {state,redirectUri}))
  assert.throws(() => validateOAuthCallback({...result,redirect_to:result.redirect_to+'&extra=evil'}, {state,redirectUri}))
})
