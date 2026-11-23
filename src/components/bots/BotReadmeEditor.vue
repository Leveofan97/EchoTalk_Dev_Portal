<template>
  <div class="readme-editor">
    <div class="editor-heading">
      <div>
        <h2>README бота</h2>
        <p>
          Полная инструкция для пользователей: возможности, команды, изображения и ссылки.
          Публикуется на странице бота.
        </p>
      </div>
      <Button
        variant="primary"
        :loading="isSaving"
        :disabled="!dirty || tooLarge || isSaving"
        @click="emit('save')"
      >
        Сохранить README
      </Button>
    </div>

    <div class="readme-toolbar" role="toolbar" aria-label="Форматирование Markdown">
      <button type="button" :disabled="isSaving" @click="insertText('## ', '', 'Заголовок')">
        Заголовок
      </button>
      <button type="button" :disabled="isSaving" @click="insertText('**', '**', 'жирный текст')">
        Жирный
      </button>
      <button type="button" :disabled="isSaving" @click="insertText('- ', '', 'элемент списка')">
        Список
      </button>
      <button
        type="button"
        :disabled="isSaving"
        @click="insertText('[', '](https://example.com)', 'текст ссылки')"
      >
        Ссылка
      </button>
      <button
        type="button"
        :disabled="isSaving"
        @click="insertText('![', '](https://example.com/image.png)', 'описание изображения')"
      >
        Изображение
      </button>
      <button
        type="button"
        :disabled="isSaving"
        @click="insertText('```', '```', 'команда или пример кода')"
      >
        Код
      </button>
    </div>

    <div class="editor-columns">
      <section class="editor-pane" aria-label="Исходный Markdown">
        <label for="bot-readme-input">Markdown</label>
        <textarea
          id="bot-readme-input"
          ref="textareaRef"
          v-model="draft"
          class="readme-textarea ui-control"
          spellcheck="true"
          placeholder="# Название бота

Описание функций, примеры команд и инструкция по использованию..."
          :disabled="isSaving"
        ></textarea>
      </section>
      <section class="preview-pane" aria-label="Предпросмотр README">
        <h3>Предпросмотр</h3>
        <BotMarkdown v-if="draft.trim()" :source="draft" />
        <p v-else class="empty-preview">Здесь появится форматированное описание бота.</p>
      </section>
    </div>

    <div class="editor-footer">
      <div>
        <p class="byte-counter" :class="{ 'counter-error': tooLarge }" aria-live="polite">
          {{ bytes.toLocaleString('ru-RU') }} /
          {{ MAX_BOT_README_BYTES.toLocaleString('ru-RU') }} байт
        </p>
        <p v-if="tooLarge" class="counter-error" role="alert">
          README превышает допустимый размер.
        </p>
        <p v-else-if="dirty" class="unsaved-note">Есть несохранённые изменения</p>
        <p v-else class="saved-note">Все изменения сохранены</p>
      </div>
      <Button variant="ghost" :disabled="!dirty || isSaving" @click="draft = savedValue"
        >Отменить изменения</Button
      >
    </div>
    <p class="editor-tip">
      HTML-теги не выполняются. Изображения подключаются по HTTPS и могут загружаться с внешних
      сайтов.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import BotMarkdown from '@/components/bots/BotMarkdown.vue'
import { MAX_BOT_README_BYTES, readmeByteLength } from '@/utils/botReadme'

const props = defineProps<{ modelValue: string; savedValue: string; isSaving: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string]; save: [] }>()
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const draft = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
const dirty = computed(() => draft.value !== props.savedValue)
const bytes = computed(() => readmeByteLength(draft.value))
const tooLarge = computed(() => bytes.value > MAX_BOT_README_BYTES)

const insertText = async (prefix: string, suffix: string, fallback: string) => {
  const element = textareaRef.value
  const current = draft.value
  const start = element?.selectionStart ?? current.length
  const end = element?.selectionEnd ?? current.length
  const selected = current.slice(start, end) || fallback
  draft.value = current.slice(0, start) + prefix + selected + suffix + current.slice(end)
  await nextTick()
  textareaRef.value?.focus()
  textareaRef.value?.setSelectionRange(
    start + prefix.length,
    start + prefix.length + selected.length,
  )
}
</script>

<style scoped>
.readme-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.editor-heading,
.editor-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}
.editor-heading h2 {
  font-size: 1.35rem;
  margin: 0 0 0.4rem;
  color: var(--text-primary);
}
.editor-heading p,
.editor-tip {
  font-size: 0.86rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}
.readme-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.readme-toolbar button {
  font: inherit;
  font-size: 0.85rem;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  background: var(--bg-secondary);
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background-color 150ms ease;
}
.readme-toolbar button:hover {
  border-color: var(--accent-primary);
  background: var(--bg-tertiary);
}
.readme-toolbar button:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
.readme-toolbar button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.editor-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  min-height: 450px;
}
.editor-pane,
.preview-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
}
.editor-pane label,
.preview-pane h3 {
  margin: 0;
  padding: 0.85rem 1rem;
  font-size: 0.88rem;
  font-weight: 650;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}
.readme-textarea {
  display: block;
  flex: 1;
  width: 100%;
  min-height: 380px;
  padding: 1rem;
  background: transparent;
  border: 0;
  border-radius: 0;
  color: var(--text-primary);
  resize: vertical;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.9rem;
  line-height: 1.65;
  tab-size: 2;
}
.readme-textarea:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: -3px;
}
.preview-pane {
  padding-bottom: 0.5rem;
}
.preview-pane :deep(.bot-markdown) {
  padding: 1rem;
  overflow: auto;
}
.empty-preview {
  padding: 1rem;
  color: var(--text-secondary);
}
.byte-counter,
.unsaved-note,
.saved-note {
  margin: 0.2rem 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
}
.counter-error {
  color: var(--danger, #d74c4c);
}
.unsaved-note {
  color: var(--accent-primary);
}
@media (max-width: 850px) {
  .editor-columns {
    grid-template-columns: minmax(0, 1fr);
  }
  .editor-heading {
    align-items: stretch;
    flex-direction: column;
  }
}
@media (prefers-reduced-motion: reduce) {
  .readme-toolbar button {
    transition: none;
  }
}
</style>
