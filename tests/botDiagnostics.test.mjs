import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import {
  diagnosticDate,
  diagnosticDuration,
  diagnosticNumber,
  diagnosticSequence,
  gatewayConnectionLabel,
  runtimeBlockReason,
  runtimeHealth,
} from '../src/utils/botDiagnostics.ts'

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')
const gateway = read('../src/components/bots/GatewayStatusCard.vue')
const protection = read('../src/components/bots/RuntimeProtectionCard.vue')
const detail = read('../src/views/BotDetailView.vue')

test('missing diagnostics data is not converted into zero', () => {
  assert.equal(diagnosticNumber(null), '—')
  assert.equal(diagnosticNumber(undefined), '—')
  assert.equal(diagnosticNumber(0), '0')
  assert.equal(diagnosticSequence(null), '—')
  assert.equal(diagnosticSequence(0), '#0')
  assert.equal(diagnosticDate(null), '—')
  assert.equal(diagnosticDate('invalid-date'), '—')
})

test('durations are readable and preserve real zero', () => {
  assert.equal(diagnosticDuration(undefined), '—')
  assert.equal(diagnosticDuration(0), '0 с')
  assert.equal(diagnosticDuration(65), '1 мин 5 с')
  assert.equal(diagnosticDuration(3600), '1 ч')
})

test('runtime summary distinguishes blocked, disabled and partially unavailable', () => {
  assert.equal(runtimeHealth(null, null), 'unknown')
  assert.equal(runtimeHealth({ enabled: true }, null), 'unknown')
  assert.equal(runtimeHealth({ enabled: true }, { blocked: false }), 'active')
  assert.equal(runtimeHealth({ enabled: false }, { blocked: false }), 'disabled')
  assert.equal(runtimeHealth(null, { blocked: true }), 'blocked')
  assert.equal(runtimeBlockReason('auto_block_runtime_abuse'), 'Автоматическая блокировка за превышение лимитов')
})

test('unknown gateway state is not labeled disconnected', () => {
  assert.equal(gatewayConnectionLabel('connected'), 'Подключён')
  assert.equal(gatewayConnectionLabel('disconnected'), 'Отключён')
  assert.equal(gatewayConnectionLabel('not_connected'), 'Подключений ещё не было')
  assert.equal(gatewayConnectionLabel('unexpected'), 'Неизвестное состояние')
})

test('diagnostics ignore stale results on new installation or repeat refresh', () => {
  for (const component of [gateway, protection]) {
    assert.match(component, /requestGeneration/)
    assert.match(component, /generation !== requestGeneration/)
    assert.match(component, /(?:requestedInstallationId|installationId) !== props\.installationId/)
    assert.match(component, /watch\(\(\) => props\.installationId, load, \{ immediate: true \}\)/)
    assert.doesNotMatch(component, /onMounted\(load\)/)
  }
  assert.match(protection, /Promise\.allSettled/)
})

test('gateway diagnostics is available independently of active transport', () => {
  const area = detail.slice(detail.indexOf('id="bot-protection"'), detail.indexOf('id="bot-panel-danger"'))
  assert.match(area, /<GatewayStatusCard/)
  assert.match(area, /:transport-active="deliveryMode === 'websocket'"/)
  assert.doesNotMatch(area, /v-if="deliveryMode === 'websocket'"/)
  assert.match(area, /class="diagnostics-panels"/)
})
