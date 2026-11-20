import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { appIconNames, botEventIcon } from '../src/utils/appIcons.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../src')
const iconTemplate = readFileSync(resolve(root, 'components/ui/AppIcon.vue'), 'utf8')

test('every registered icon maps to an official Lucide component', () => {
  assert.equal(new Set(appIconNames).size, appIconNames.length)
  assert.match(iconTemplate, /from '@lucide\/vue'/)
  assert.doesNotMatch(iconTemplate, /<path|<circle|<rect|<svg/)
  for (const icon of appIconNames) {
    const escaped = icon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    assert.match(iconTemplate, new RegExp(`[\"']?${escaped}[\"']?\\s*:\\s*[A-Z]\\w+`), `Missing Lucide mapping: ${icon}`)
  }
})

test('icon size and stroke width can be overridden at the call site', () => {
  assert.match(iconTemplate, /:size="size"/)
  assert.match(iconTemplate, /:stroke-width="strokeWidth"/)
  assert.match(iconTemplate, /absoluteStrokeWidth\?: boolean/)
  assert.match(iconTemplate, /size: 22/)
})

test('event categories use registered icons, never emoji', () => {
  for (const type of [
    'message.created', 'message.reaction.added', 'message.pinned', 'server.role.assigned',
    'server.member.joined', 'room.member.left', 'server.room.created', 'server.category.deleted',
    'server.invite.revoked', 'server.updated', 'server.room_overrides.updated',
    'voice.track.published', 'custom.event',
  ]) {
    assert.ok(appIconNames.includes(botEventIcon(type)), type)
  }
})

test('manage page no longer embeds emoji icons and text arrows', () => {
  const source = readFileSync(resolve(root, 'views/BotDetailView.vue'), 'utf8')
  assert.doesNotMatch(source, /[\p{Extended_Pictographic}]/u)
  assert.doesNotMatch(source, /← Назад/)
  assert.match(source, /botEventIcon\(event.type\)/)
})
