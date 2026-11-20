import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('Input forwards native HTML input attributes instead of assigning them to the wrapper', () => {
  const input = read('src/components/ui/Input.vue')
  assert.match(input, /inheritAttrs:\s*false/)
  assert.match(input, /<input\s+v-bind="\$attrs"/)
  assert.match(input, /:for="controlId"/)
  assert.match(input, /:aria-invalid="error \? 'true' : undefined"/)
  assert.match(input, /:aria-describedby="describedBy"/)
})

test('Shared form controls use theme variables, not hardcoded white', () => {
  const css = read('src/assets/styles/controls.css')
  assert.match(css, /background-color:\s*var\(--bg-secondary\)/)
  assert.match(css, /color:\s*var\(--text-primary\)/)
  assert.match(css, /select\.ui-control option/)
  assert.match(css, /prefers-reduced-motion/)
  assert.doesNotMatch(css, /background:\s*(?:#fff|white)\b/)
})

test('Input, create/edit and main bot form controls share design-system classes', () => {
  for (const path of [
    'src/components/ui/Input.vue',
    'src/components/bots/CreateBotModal.vue',
    'src/components/bots/EditBotModal.vue',
    'src/views/BotDetailView.vue',
  ]) {
    assert.match(read(path), /ui-control/, path)
  }
  const detail = read('src/views/BotDetailView.vue')
  assert.doesNotMatch(detail, /background:\s*#fff;/)
  assert.match(detail, /ui-checkbox/)
})

test('Redirect URI and bot description fields expose associated labels', () => {
  assert.match(read('src/components/bots/AddRedirectModal.vue'), /label="URL \*"/)
  const create = read('src/components/bots/CreateBotModal.vue')
  assert.match(create, /for="create-bot-description"/)
  assert.match(create, /id="create-bot-description"/)
})
