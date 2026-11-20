import assert from 'node:assert/strict'
import test from 'node:test'
import { botEventTitle, botEventTitles } from '../src/utils/botEventCatalog.ts'

test('all known events have readable Russian titles', () => {
  assert.ok(Object.keys(botEventTitles).length >= 39)
  for (const [type, title] of Object.entries(botEventTitles)) {
    assert.ok(title.length > 6, type)
    assert.notEqual(title, type)
  }
})

test('localize room member join in subscriptions and replay journal', () => {
  assert.equal(botEventTitle('room.member.joined', 'Room member joined'), 'Подключение участника к комнате')
  assert.equal(botEventTitle('message.created', 'Message created'), 'Создание сообщения')
})

test('unknown future events use backend label and preserve raw code if unknown', () => {
  assert.equal(botEventTitle('custom.event', 'Custom event'), 'Custom event')
  assert.equal(botEventTitle('custom.event', ''), 'custom.event')
})
