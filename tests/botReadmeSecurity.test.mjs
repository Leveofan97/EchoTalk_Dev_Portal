import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isSafeReadmeLink, isSafeReadmeImage, readmeByteLength, MAX_BOT_README_BYTES } from '../src/utils/botReadme.ts'

test('safe documentation links', () => {
  for (const url of ['https://example.com/path', 'http://example.com', 'mailto:help@example.com', '#installation', '/docs']) {
    assert.equal(isSafeReadmeLink(url), true, url)
  }
})
test('unsafe documentation links are rejected', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html;base64,WA==', 'file:///etc/passwd', '//example.com', 'https://user:pass@example.com', '\u0000https://example.com', ' https://example.com', 'https://example.com\\@evil.com']) {
    assert.equal(isSafeReadmeLink(url), false, url)
  }
})
test('README images require HTTPS or same-origin root path', () => {
  assert.equal(isSafeReadmeImage('https://example.com/img.png'), true)
  assert.equal(isSafeReadmeImage('/images/preview.png'), true)
  for (const url of ['http://example.com/pixel.png', 'data:image/svg+xml,abc', 'blob:https://example.com/123', '//evil.test/img.png', 'javascript:alert(1)']) {
    assert.equal(isSafeReadmeImage(url), false, url)
  }
})
test('README length counts UTF-8 bytes', () => {
  assert.equal(readmeByteLength('я'), 2)
  assert.equal(readmeByteLength('a'.repeat(MAX_BOT_README_BYTES)), MAX_BOT_README_BYTES)
  assert.ok(readmeByteLength('я'.repeat(MAX_BOT_README_BYTES / 2 + 1)) > MAX_BOT_README_BYTES)
})
