import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { filterSelectableEvents, showDeliveryRetryTime } from '../src/utils/webhookDelivery.ts'
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')
const view = read('../src/views/BotDetailView.vue')
const store = read('../src/stores/bots.ts')

test('fallback event list uses app scopes only when installation scopes are missing', () => {
 const events = [{ type:'msg', required_scopes:['messages.read'] }, {type:'role', required_scopes:['server.roles.view']}]
 assert.deepEqual(filterSelectableEvents(events, undefined, ['messages.read']).map(e=>e.type), ['msg'])
 assert.deepEqual(filterSelectableEvents(events, ['server.roles.view'], ['messages.read']).map(e=>e.type), ['role'])
 assert.deepEqual(filterSelectableEvents(events, [], ['messages.read']), [])
})
test('only queued deliveries show future retry times', () => {
 assert.equal(showDeliveryRetryTime('retry'), true)
 assert.equal(showDeliveryRetryTime('pending'), true)
 assert.equal(showDeliveryRetryTime('failed'), false)
 assert.equal(showDeliveryRetryTime('success'), false)
})
test('save does not silently delete subscriptions', () => {
 assert.doesNotMatch(view, /webhookForm\.value\.subscribed_events = webhookForm\.value\.subscribed_events\.filter/)
 assert.match(view, /installationScopesKnown\.value/)
})
test('historical deliveries visible even when transport disabled', () => {
 assert.match(view, /История предыдущих HTTP-доставок/)
 assert.doesNotMatch(view, /История HTTP-доставок доступна при включённом Webhook/)
})
test('webhook secret has explicit confirmation without native confirm', () => {
 assert.match(view, /showRotateWebhookSecretDialog/)
 assert.match(view, /rotationAcknowledged/)
 assert.doesNotMatch(view, /confirm\('Сгенерировать новый webhook secret/)
})
test('failed requests surface errors rather than returning empty lists', () => {
 for (const name of ['fetchInstallationWebhook', 'fetchInstallationDeliveries', 'fetchDeliveryAttempts']) {
  const start = store.indexOf('  const ' + name + ' = async'); const end = store.indexOf('  const '+ ({ fetchInstallationWebhook: 'updateInstallationWebhook', fetchInstallationDeliveries: 'fetchDeliveryAttempts', fetchDeliveryAttempts: 'updateBot' })[name] + ' = async', start + 3)
  assert.match(store.slice(start, end < 0 ? undefined : end), /throw err/)
 }
})

test('gateway ignores response from previously selected installation', () => {
  const gateway = read('../src/components/bots/GatewayStatusCard.vue')
  assert.match(gateway, /requestedInstallationId !== props\.installationId/)
  assert.match(gateway, /status\.value = null/)
})
