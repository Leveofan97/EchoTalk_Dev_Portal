import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const view = readFileSync(new URL('../src/views/DocumentationView.vue', import.meta.url), 'utf8')

function example(name) {
  const prefix = `const ${name} = ` + '`'
  const start = view.indexOf(prefix)
  assert.notEqual(start, -1, `missing example ${name}`)
  const end = view.indexOf('`\n', start + prefix.length)
  assert.notEqual(end, -1, `unterminated example ${name}`)
  return view.slice(start + prefix.length, end)
}

test('Quick Start is a connected chain from OAuth to real server and room IDs', () => {
  assert.match(view, /id="quickstart"/)
  assert.match(view, /id="installation-model"/)
  assert.match(view, /GET \/bot\/me/)
  assert.match(view, /GET \/bot\/servers\/\{serverID\}\/rooms/)
  assert.match(view, /POST \/bot\/rooms\/\{roomID\}\/messages/)
  assert.match(view, /из ответа.*server_id|server_id<\/code> из ответа/)
  assert.match(view, /<code>room_id<\/code>/)
  assert.match(view, /не возвращает ID установки/)
  assert.match(view, /токен не даёт доступа/)
})

test('Identity response examples match the installed runtime contracts', () => {
  const bot = JSON.parse(example('botMeResponseExample'))
  assert.equal(typeof bot.bot_app_id, 'number')
  assert.equal(typeof bot.installation_id, 'number')
  assert.equal(typeof bot.server_id, 'number')
  assert.ok(Array.isArray(bot.granted_scopes))
  const rooms = JSON.parse(example('botRoomsResponseExample'))
  assert.ok(Array.isArray(rooms.data))
  assert.equal(rooms.data[0].server_id, bot.server_id)
  const message = JSON.parse(example('firstMessageResponseExample'))
  assert.equal(message.data.room_id, rooms.data[0].id)
})

test('OAuth routes have the correct caller and do not expose user session credentials to bot authors', () => {
  assert.match(view, /Сайт Dev Portal от имени владельца бота/)
  assert.match(view, /<code>\/bot\/\*<\/code>/)
  assert.match(view, /пользовательский токен разработчику бота не нужен/)
  assert.doesNotMatch(example('authorizeExample'), /CLIENT_SECRET|USER_SESSION_TOKEN/)
  assert.match(view, /<code>409<\/code>/)
  assert.match(view, /не возвращает ID установки/)
})

test('OAuth errors are documented as the real API error field, not Voice/Media envelope', () => {
  assert.match(view, /<code>error<\/code>/)
  assert.match(view, /redirect_uri mismatch/)
  for (const status of [400, 401, 403, 404, 409, 500]) {
    assert.ok(view.includes(`<code>${status}</code>`), `missing HTTP ${status}`)
  }
  assert.match(view, /refresh token у бота уже истёк/)
})

test('Gateway guide includes each frame and separates access from session tokens', () => {
  const frames = example('gatewayFramesExample')
  for (const type of ['hello', 'resume', 'event', 'ack', 'heartbeat']) {
    assert.ok(frames.includes(`"type":"${type}"`), `missing ${type}`)
  }
  assert.match(view, /Bearer &lt;GATEWAY_SESSION_TOKEN&gt;/)
  assert.match(view, /последним надёжно сохранённым/)
  assert.match(view, /после успешной обработки/)
  assert.match(view, /серверный клиент/)
})

test('Webhook guidance validates the original body and timestamp with HMAC and timing-safe comparison', () => {
  const code = example('webhookSignatureExample')
  assert.match(code, /createHmac\('sha256', secret\)/)
  assert.match(code, /update\(rawBody\)/)
  assert.match(code, /timingSafeEqual/)
  assert.match(code, /Date\.now\(\)/)
  assert.match(code, /\{64\}/)
  assert.match(view, /X-EchoTalk-Timestamp/)
  assert.match(view, /X-EchoTalk-Signature/)
  assert.match(view, /идемпотентным ключом/)
})

test('Security guidance never teaches putting OAuth secrets in browser or logging callback codes', () => {
  assert.match(view, /не передаются/)
  assert.match(view, /не следует записывать целиком в access-логи/)
  assert.match(view, /Cache-Control: no-store/)
  assert.match(view, /Referrer-Policy: no-referrer/)
  assert.match(view, /Для установки бота другими пользователями нужен <strong>публичный HTTPS<\/strong>/)
  assert.match(view, /отдельного режима установки приватного бота/)
  assert.doesNotMatch(view, /client_secret.*localStorage/i)
})
