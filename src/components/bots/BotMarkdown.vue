<template>
  <!-- Only sanitized HTML from markdown-it + DOMPurify reaches v-html. -->
  <div class="bot-markdown" v-html="sanitizedHTML"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import { isSafeReadmeImage, isSafeReadmeLink } from '@/utils/botReadme'

const props = defineProps<{ source: string }>()

const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true, typographer: false })
markdown.validateLink = isSafeReadmeLink

const defaultLinkOpen = markdown.renderer.rules.link_open
markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  if (!token) return ''
  token.attrSet('target', '_blank')
  token.attrSet('rel', 'noopener noreferrer nofollow')
  return defaultLinkOpen?.(tokens, idx, options, env, self) ?? self.renderToken(tokens, idx, options)
}

const defaultImage = markdown.renderer.rules.image
markdown.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  if (!token) return ''
  if (!isSafeReadmeImage(token.attrGet('src') ?? '')) {
    return markdown.utils.escapeHtml(token.content)
  }
  token.attrSet('loading', 'lazy')
  token.attrSet('decoding', 'async')
  token.attrSet('referrerpolicy', 'no-referrer')
  return defaultImage?.(tokens, idx, options, env, self) ?? self.renderToken(tokens, idx, options)
}

const sanitizedHTML = computed(() => DOMPurify.sanitize(markdown.render(props.source || ''), {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['svg', 'math', 'style', 'iframe', 'object', 'embed', 'form', 'audio', 'video'],
  FORBID_ATTR: ['style', 'srcset'],
}))
</script>

<style scoped>
.bot-markdown { color: var(--text-primary); overflow-wrap: anywhere; line-height: 1.7; min-width: 0; }
.bot-markdown :deep(> :first-child) { margin-top: 0; }
.bot-markdown :deep(> :last-child) { margin-bottom: 0; }
.bot-markdown :deep(h1), .bot-markdown :deep(h2), .bot-markdown :deep(h3), .bot-markdown :deep(h4) {
  font-weight: 650; line-height: 1.35; margin: 1.5em 0 0.6em; color: var(--text-primary);
}
.bot-markdown :deep(h1) { font-size: 1.65rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color); }
.bot-markdown :deep(h2) { font-size: 1.35rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border-color); }
.bot-markdown :deep(h3) { font-size: 1.14rem; }
.bot-markdown :deep(p), .bot-markdown :deep(ul), .bot-markdown :deep(ol), .bot-markdown :deep(blockquote), .bot-markdown :deep(pre) { margin: 0.75rem 0 1.1rem; }
.bot-markdown :deep(ul), .bot-markdown :deep(ol) { padding-left: 1.7rem; }
.bot-markdown :deep(ul) { list-style-type: disc; }
.bot-markdown :deep(ol) { list-style-type: decimal; }
.bot-markdown :deep(li) { margin: 0.3rem 0; }
.bot-markdown :deep(a) { color: var(--accent-primary); text-decoration: underline; text-underline-offset: 3px; }
.bot-markdown :deep(a:hover) { text-decoration-thickness: 2px; }
.bot-markdown :deep(a:focus-visible) { outline: 2px solid var(--accent-primary); outline-offset: 3px; }
.bot-markdown :deep(img) { display: block; max-width: 100%; height: auto; border-radius: 12px; border: 1px solid var(--border-color); margin: 1rem 0; }
.bot-markdown :deep(code) { background: var(--bg-tertiary); color: var(--text-primary); padding: 0.15em 0.35em; border-radius: 5px; font-size: 0.9em; }
.bot-markdown :deep(pre) { background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem; overflow-x: auto; max-width: 100%; }
.bot-markdown :deep(pre code) { padding: 0; background: transparent; }
.bot-markdown :deep(blockquote) { border-left: 3px solid var(--accent-primary); padding: 0.5rem 1rem; color: var(--text-secondary); background: var(--bg-secondary); }
.bot-markdown :deep(hr) { border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0; }
.bot-markdown :deep(table) { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; margin: 1rem 0; }
.bot-markdown :deep(th), .bot-markdown :deep(td) { padding: 0.5rem 0.75rem; border: 1px solid var(--border-color); text-align: left; }
.bot-markdown :deep(th) { background: var(--bg-tertiary); }
</style>
