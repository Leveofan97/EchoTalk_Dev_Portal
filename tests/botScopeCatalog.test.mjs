import assert from 'node:assert/strict'
import test from 'node:test'
import {
  requiredBotScopes,
  scopeTitle,
  uniqueBotScopes,
  updateBotScopes,
} from '../src/utils/botScopeCatalog.ts'

const scope = (name, opts = {}) => ({
  name,
  label: name,
  description: `${name}: описание`,
  group: 'server',
  required: false,
  assignable: true,
  ...opts,
})

test('scope catalog removes duplicate IDs and keeps restrictive flags', () => {
  const actual = uniqueBotScopes([
    scope('server.audit.view'),
    scope('server.audit.view', { assignable: false, sensitive: true }),
  ])
  assert.equal(actual.length, 1)
  assert.equal(actual[0].assignable, false)
  assert.equal(actual[0].sensitive, true)
})

test('human-readable title replaces raw scope ID without changing the ID', () => {
  assert.equal(scopeTitle(scope('server.audit.view')), 'Просмотр журнала действий')
  assert.equal(scopeTitle(scope('custom.scope', { label: 'Собственная функция' })), 'Собственная функция')
})

test('voice.listen automatically adds voice.connect and voice.view', () => {
  assert.deepEqual(
    updateBotScopes(['bot'], 'voice.listen', true, []),
    ['bot', 'voice.listen', 'voice.connect', 'voice.view'],
  )
})

test('removing voice.view cascades to all dependent permissions', () => {
  assert.deepEqual(
    updateBotScopes(['bot', 'voice.view', 'voice.connect', 'voice.listen', 'voice.speak'], 'voice.view', false, []),
    ['bot'],
  )
})

test('removing voice.connect keeps voice.view but removes listen and speak', () => {
  assert.deepEqual(
    updateBotScopes(['bot', 'voice.view', 'voice.connect', 'voice.listen'], 'voice.connect', false, []),
    ['bot', 'voice.view'],
  )
})

test('required scopes stay selected and optional scopes reset', () => {
  const catalog = [scope('bot', { required: true }), scope('server.view', { required: true }), scope('voice.speak')]
  assert.deepEqual(requiredBotScopes(catalog), ['bot', 'server.view'])
  assert.deepEqual(updateBotScopes(['bot', 'server.view'], 'server.view', false, catalog), ['bot', 'server.view'])
})

test('editing preserves selected unknown legacy scopes without adding privileges', () => {
  const catalog = [scope('bot', { required: true }), scope('server.audit.view')]
  const saved = ['bot', 'server.audit.view', 'legacy.custom.scope']
  const normalized = updateBotScopes(saved, null, false, catalog)
  assert.deepEqual(normalized, saved)
  assert.deepEqual(saved, ['bot', 'server.audit.view', 'legacy.custom.scope'])
})

test('editing with selected voice.speak restores required voice parents', () => {
  const normalized = updateBotScopes(['bot', 'voice.speak'], null, false, [])
  assert.deepEqual(normalized, ['bot', 'voice.speak', 'voice.connect', 'voice.view'])
})
