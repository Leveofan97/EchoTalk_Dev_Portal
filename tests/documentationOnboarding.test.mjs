import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const view = readFileSync(new URL('../src/views/DocumentationView.vue', import.meta.url), 'utf8')
const stoplight = readFileSync(new URL('../src/components/docs/StoplightReference.ts', import.meta.url), 'utf8')

test('Quick Start follows the existing bot installation and token exchange contract', () => {
  for (const id of ['quickstart', 'oauth-install', 'first-request', 'delivery-setup', 'commands-setup', 'troubleshooting']) {
    assert.match(view, new RegExp(`id="${id}"`))
  }
  for (const endpoint of ['/oauth/authorize', '/oauth/token', '/bot/me', '/bot/servers/<SERVER_ID>/rooms', '/bot/rooms/<ROOM_ID>/messages']) {
    assert.ok(view.includes(endpoint), `missing ${endpoint}`)
  }
  for (const key of ['grant_type', 'authorization_code', 'client_id', 'client_secret', 'redirect_uri', 'room.sendMessage', 'state']) {
    assert.ok(view.includes(key), `missing ${key}`)
  }
})

test('Docs describe callback redirect and the bot-initiated CSRF state', () => {
  assert.match(view, /OAuth Start URL/)
  assert.match(view, /сайт Dev Portal меняет адрес текущей вкладки/)
  assert.match(view, /HttpOnly cookie на 10 минут/)
})

test('Guide mode does not import heavy Stoplight or Scalar SDKs synchronously', () => {
  assert.match(view, /defineAsyncComponent\(\(\) => import\('@\/components\/docs\/StoplightReference'\)\)/)
  assert.match(view, /defineAsyncComponent\(\(\) => import\('@\/views\/AsyncApiReference\.vue'\)\)/)
  assert.doesNotMatch(view, /^import .*@stoplight\/elements/m)
  assert.doesNotMatch(view, /^import .*@scalar\/api-reference/m)
  assert.match(stoplight, /import '@stoplight\/elements\/web-components\.min\.js'/)
})

test('Gateway link from guide switches both display and API reference', () => {
  assert.match(view, /async function setActiveApiReference\([^]*?activeView\.value = 'api'/)
  assert.match(view, /@click="setActiveApiReference\('gateway'\)"/)
})

test('Mobile guide navigation includes readable links to every section', () => {
  assert.match(view, /class="docs-mobile-nav"/)
  assert.match(view, /navigation\.flatMap\(\(group\) => group\.items\)/)
})

test('Docs do not present generic OAuth errors as voice error envelope', () => {
  assert.match(view, /Ответы OAuth и Dev Portal могут иметь другой формат/)
})

test('Query navigation stays synchronized when browser history changes', () => {
  assert.match(view, /watch\(\s*\(\) => \[route\.query\.view, route\.query\.api\]/)
  assert.match(view, /activeApiReference\.value = route\.query\.api === 'gateway'/)
})

test('OAuth guide distinguishes start/callback roles and documents actual browser navigation', () => {
  assert.match(view, /id="oauth-install"/)
  assert.match(view, /class="docs-oauth-addresses"/)
  assert.match(view, /OAuth Start URL/)
  assert.match(view, /Redirect URI \(Callback\)/)
  assert.match(view, /API возвращает <strong>HTTP 200 с JSON<\/strong>, а не перенаправляет браузер/)
  assert.match(view, /GET \/oauth\/start/)
  assert.match(view, /GET \/oauth\/callback/)
  assert.match(view, /Сервер бота → EchoTalk API: POST \/oauth\/token/)
  assert.match(view, /сам открывает новый адрес/)
  assert.doesNotMatch(view, /EchoTalk отправляет сюда браузер/)
  assert.match(view, /authorizeResponseExample/)
  assert.match(view, /POST \/oauth\/token/)
  assert.match(view, /После успешного обмена кода/)
  assert.match(view, /Не передавайте Client Secret, access token и refresh token в Dev Portal/)
  assert.match(view, /POST \/oauth\/token\/refresh/)
})

test('OAuth local E2E walkthrough is self-contained for external developers', () => {
  assert.match(view, /id="oauth-local-test"/)
  assert.match(view, /id: 'oauth-local-test', label: 'Проверка OAuth локально'/)
  assert.match(view, /http:\/\/127\.0\.0\.1:3001\/oauth\/start/)
  assert.match(view, /http:\/\/127\.0\.0\.1:3001\/oauth\/callback/)
  assert.match(view, /303 See Other/)
  assert.match(view, /GET \/bot\/me/)
  assert.match(view, /доступ к\s*исходникам EchoTalk не требуется/)
  assert.doesNotMatch(view, /examples\/oauth-test-bot\/main\.go/)
  assert.doesNotMatch(view, /backend-репозитории|backend-репозитория/)
  assert.match(view, /go run/)
})

test('OAuth guide gives exact start/callback HTTP contracts without invented input parameters', () => {
  assert.doesNotMatch(view, /<h3>Кто участвует в установке<\/h3>/)
  assert.match(view, /class="docs-oauth-journey"/)
  assert.match(view, /GET-запрос без тела и без обязательных URL-параметров/)
  assert.match(view, /const oauthStartRequestExample = `GET \/oauth\/start HTTP\/1\.1/)
  assert.match(view, /HTTP\/1\.1 303 See Other/)
  assert.match(view, /const tokenResponseExample = `HTTP\/1\.1 200 OK/)
  assert.match(view, /Set-Cookie: et_oauth_state=/)
  assert.match(view, /Location: https:\/\/portal\.example\/explore\/4\?state=/)
  assert.match(view, /const oauthCallbackRequestExample = `GET \/oauth\/callback\?code=/)
  assert.match(view, /параметра:/)
  assert.match(view, /при несовпадении.*не обменивайте код|не обменивайте код на токены/)
})

test('OAuth state documentation matches the server input rule and secure client generation', () => {
  assert.match(view, /Длина от 16 до 256 символов/)
  assert.match(view, /32 случайных байта/)
  assert.match(view, /43 символа/)
  assert.match(view, /base64.RawURLEncoding.EncodeToString\(b\)/)
  assert.match(view, /SameSite=Lax/)
  assert.match(view, /HttpOnly cookie на 10 минут/)
  assert.match(view, /при отзыве установки оба токена|При отзыве установки оба токена/)
})


test('OAuth production contract uses one HTTPS bot host and does not mix localhost with callback', () => {
  const section = view.split('<section id="oauth-install"')[1].split('<section id="oauth-local-test"')[0]
  assert.match(section, /https:\/\/mybot\.ru\/oauth\/start/)
  assert.match(section, /https:\/\/mybot\.ru\/oauth\/callback/)
  assert.match(section, /https:\/\/portal\.example\/explore\/4/)
  assert.doesNotMatch(section, /localhost:3000|127\.0\.0\.1:3001/)
  for (const name of ['oauthStartRequestExample','oauthStartResponseExample','authorizeExample','authorizeResponseExample','oauthCallbackRequestExample','tokenRequestExample']) {
    const start = view.indexOf('const ' + name + ' = `')
    const body = view.slice(start, view.indexOf('`\n', start + name.length + 9))
    assert.ok(start > -1, 'missing ' + name)
    assert.doesNotMatch(body, /localhost:3000|127\.0\.0\.1:3001/, name)
  }
})

test('Local-only instructions do not require private EchoTalk sources or a locally running Dev Portal', () => {
  const local = view.split('<section id="oauth-local-test"')[1].split('<section id="first-request"')[0]
  assert.match(local, /http:\/\/127\.0\.0\.1:3001\/oauth\/start/)
  assert.match(local, /http:\/\/127\.0\.0\.1:3001\/oauth\/callback/)
  assert.match(local, /запускать сайт EchoTalk на/)
  assert.doesNotMatch(local, /localhost:3000|examples\/oauth-test-bot/)
  assert.match(local, /oauthDemoPowerShellExample/)
})
