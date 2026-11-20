import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { revokeBotInstallationPath } from '../src/utils/installationRoutes.ts'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const api = read('../src/api/bots.ts')
const store = read('../src/stores/bots.ts')
const view = read('../src/views/BotDetailView.vue')
const card = read('../src/components/bots/InstallationCard.vue')

test('revoke targets the route registered by the Go router, including server ID', () => {
  assert.match(api, /revokeInstallation: \(installation: Pick<BotInstallation, 'id' \| 'server_id'>\)/)
  assert.match(api, /api\.delete\(revokeBotInstallationPath\(installation\)\)/)
  assert.doesNotMatch(api, /api\.delete\(`\/bot-installations\//)
  assert.match(store, /botsApi\.revokeInstallation\(installation\)/)
})

test('revoke confirmation waits for success and does not delete installation history locally', () => {
  assert.match(view, /pendingRevokeInstallation/)
  assert.match(view, /isRevokingInstallation/)
  assert.match(view, /await botsStore\.revokeInstallation\(installation\)/)
  assert.match(view, /item\.id === installation\.id \? \{ \.\.\.item, status: 'revoked' \}/)
  assert.match(view, /await refreshInstallations\(\)/)
  assert.doesNotMatch(card, /\bconfirm\s*\(/)
})

test('only active installation can be configured or revoked', () => {
  assert.match(card, /v-if="installation\.status === 'active'"/)
  assert.match(card, /:disabled="busy"/)
  assert.match(view, /handleConfigureInstallation/)
  assert.match(view, /selectTab\('connection'\)/)
  assert.match(view, /activeInstallationsList\.value\.some/)
})

test('filter and refresh preserve full server history, including revoked rows', () => {
  assert.match(view, /installationFilter === 'active'/)
  assert.match(view, /installationFilter === 'inactive'/)
  assert.match(view, /visibleInstallations/)
  assert.match(view, /:loading="isRefreshingInstallations"/)
  assert.match(store, /throw err\n    }\n  }\n\n  const publishBot/)
})

test('missing installation scopes are not treated as an empty permission grant', () => {
  assert.match(api, /granted_scopes\?: string\[\]/)
  assert.match(card, /v-if="installation\.granted_scopes !== undefined"/)
  assert.match(card, /Сведения о выданных разрешениях недоступны/)
})

test('public install link only appears when the bot is active and public', () => {
  assert.match(view, /bot\?\.is_public && bot\.status === 'active'/)
  assert.match(view, /name: 'bot-public', params: \{ id: botId \}/)
})

test('revoke path builder rejects malformed installation identifiers', () => {
  assert.equal(revokeBotInstallationPath({ id: 17, server_id: 42 }), '/servers/42/bots/17')
  assert.throws(() => revokeBotInstallationPath({ id: -1, server_id: 42 }), TypeError)
  assert.throws(() => revokeBotInstallationPath({ id: 17, server_id: 0 }), TypeError)
  assert.throws(() => revokeBotInstallationPath({ id: 1.1, server_id: 42 }), TypeError)
})
