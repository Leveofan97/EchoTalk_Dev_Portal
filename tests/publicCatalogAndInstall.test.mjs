import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { filterPublicBots } from '../src/utils/publicBotCatalog.ts'
import { scopeTitle, updateBotScopes } from '../src/utils/botScopeCatalog.ts'

const catalog = [
  { id: '1', name: 'Модератор', description: 'Правила сервера', owner_name: 'Алексей' },
  { id: '2', name: 'Музыка', description: 'Плейлист', owner_name: 'Ольга' },
  { id: '3', name: 'InfoBot', description: null, owner_name: null },
]

test('catalog search is case-insensitive and searches name, description, author', () => {
  assert.deepEqual(filterPublicBots(catalog, '  МОдеР ' ).map((b) => b.id), ['1'])
  assert.deepEqual(filterPublicBots(catalog, 'плейлист').map((b) => b.id), ['2'])
  assert.deepEqual(filterPublicBots(catalog, 'алексей').map((b) => b.id), ['1'])
  assert.deepEqual(filterPublicBots(catalog, '  ').map((b) => b.id), ['1', '2', '3'])
  assert.deepEqual(filterPublicBots(catalog, 'Несуществующий'), [])
  assert.equal(catalog.length, 3)
})

test('catalog search does not crash on optional empty public fields', () => {
  assert.deepEqual(filterPublicBots(catalog, 'infobot').map((b) => b.id), ['3'])
})

test('installation keeps the base scope and dependent voice scopes consistent', () => {
  const available = ['bot', 'voice.view', 'voice.connect', 'voice.listen']
  const catalogScopes = available.map((name) => ({ name, label: name, required: name === 'bot', assignable: true, group: 'installation', description: '' }))
  const selected = updateBotScopes(available, 'voice.connect', false, catalogScopes).filter((s) => available.includes(s))
  assert.deepEqual(selected, ['bot', 'voice.view'])
  assert.equal(scopeTitle({ name: 'server.roles.view', label: 'server.roles.view' }), 'Просмотр ролей')
})

const catalogView = readFileSync(new URL('../src/views/ExploreBotsView.vue', import.meta.url), 'utf8')
const publicView = readFileSync(new URL('../src/views/BotPublicView.vue', import.meta.url), 'utf8')

test('bot cards are accessible router links and do not depend on mouse clicks', () => {
  assert.match(catalogView, /<RouterLink\s+v-for="bot in filteredBots"/)
  assert.match(catalogView, /:aria-label="`Посмотреть бота/)
  assert.match(catalogView, /v-model="searchQuery"/)
})

test('server load errors are not displayed as empty server lists', () => {
  assert.match(publicView, /v-if="serversLoading"/)
  assert.match(publicView, /v-else-if="serversError"/)
  assert.match(publicView, /@click="loadInstallServers"/)
  assert.match(publicView, /:disabled="server\.has_bot"/)
  assert.doesNotMatch(publicView, /v-if="botsStore\.isLoading"/)
})

test('public scope titles are localized and public install has no client secret panel', () => {
  assert.match(publicView, /scopeTitle\(\{ name: scope, label: scope \}\)/)
  assert.match(publicView, /onScopeChange\(scope, \$event\)/)
  assert.doesNotMatch(publicView, /debugClientSecret|showBotDebugPanel|installStep === 'code-issued'/)
  assert.match(publicView, /window.location.assign\(callback\)/)
  assert.match(publicView, /bot\.value\?\.oauth_start_url/)
  assert.match(publicView, /redirect_uri: request.redirectUri/)
})
