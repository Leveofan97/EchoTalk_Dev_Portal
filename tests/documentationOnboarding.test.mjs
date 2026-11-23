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

test('Docs distinguish between code display and automatic browser redirect', () => {
  assert.match(view, /Автоматического HTTP-перехода/)
  assert.match(view, /первый зарегистрированный адрес/)
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
