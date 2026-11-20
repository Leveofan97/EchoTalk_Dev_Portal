import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const detail = readFileSync(new URL('../src/views/BotDetailView.vue', import.meta.url), 'utf8')
const card = readFileSync(new URL('../src/components/bots/CredentialCard.vue', import.meta.url), 'utf8')

test('credential issuance uses a single confirmation and waits for the API result', () => {
  const handler = detail.slice(detail.indexOf('const handleCreateCredential = async'), detail.indexOf('const refreshInstallations = async'))
  assert.doesNotMatch(handler, /\bconfirm\s*\(/)
  assert.match(handler, /await botsStore\.createCredential/)
  assert.match(handler, /showCreateCredential\.value = false/)
  assert.match(handler, /credentialRotationAcknowledged\.value/)
})

test('rotating a working secret requires explicit acknowledgment', () => {
  assert.match(detail, /v-model="credentialRotationAcknowledged"/)
  assert.match(detail, /:disabled="!!activeCredential && !credentialRotationAcknowledged"/)
})

test('public Client ID is shown by default; Client Secret stays masked', () => {
  assert.match(detail, /title="Client ID"\s+:value="freshlyCreatedSecret\.client_id"\s+:sensitive="false"/)
  assert.match(detail, /title="Client Secret"\s+:value="freshlyCreatedSecret\.client_secret"\s+:is-new="true"\s+:sensitive="true"/)
  assert.match(card, /\(!sensitive \|\| revealed\) && !revoked/)
  assert.match(card, /sensitive\?: boolean/)
})

test('authorization tab explains OAuth exchange and keeps secret on the bot server', () => {
  assert.match(detail, /POST \/oauth\/token/)
  assert.match(detail, /Секрет и токены храните только на сервере бота/)
  assert.match(detail, /:to="\{ name: 'docs' \}"/)
})
