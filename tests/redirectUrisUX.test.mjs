import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const view = readFileSync(new URL('../src/views/BotDetailView.vue', import.meta.url), 'utf8')
const modal = readFileSync(new URL('../src/components/bots/AddRedirectModal.vue', import.meta.url), 'utf8')
const types = readFileSync(new URL('../src/types/index.ts', import.meta.url), 'utf8')
const publicView = readFileSync(new URL('../src/views/BotPublicView.vue', import.meta.url), 'utf8')

test('OAuth settings display registered redirect URIs from the API', () => {
  assert.match(types, /redirect_uris\?: string\[\]/)
  assert.match(view, /bot\.value\?\.redirect_uris \?\? \[\]/)
  assert.match(view, /v-for="\(uri, index\) in redirectURIs"/)
  assert.match(view, /<AddRedirectModal/)
})

test('saving redirects does not update other bot fields and refetches the saved list', () => {
  assert.match(view, /updateBot\(botId\.value, \{ redirect_uris: uris \}\)/)
  assert.match(view, /fetchBotDetails\(botId\.value\)/)
  assert.match(view, /pendingRedirectURIToRemove/)
})

test('Redirect URI dialog supports native URL validation and cannot close during save', () => {
  assert.match(modal, /type="url"/)
  assert.match(modal, /maxlength="500"/)
  assert.match(modal, /if \(props\.isLoading\) return/)
})

test('OAuth installation displays actionable errors instead of silently failing', () => {
  assert.match(publicView, /installAuthorizeError/)
  assert.match(publicView, /role="alert"/)
})
