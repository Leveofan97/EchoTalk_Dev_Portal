<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="create-bot-title">
          <div class="modal__header">
            <h3 id="create-bot-title">Создание бота</h3>
            <button type="button" class="modal__close" aria-label="Закрыть окно" @click="close">×</button>
          </div>

          <form class="modal__body" @submit.prevent="handleSubmit">
            <div class="modal__scroll">
              <div v-if="localError || botsStore.error" class="error-alert">
                {{ localError || botsStore.error }}
              </div>

              <Input
                v-model="form.name"
                label="Название бота"
                placeholder="Например: Бот-модератор"
                :error="errors.name"
                required
                :disabled="isSubmitting"
              />

              <div class="input-wrapper">
                <label class="input-label" for="create-bot-description">Описание</label>
                <textarea
                  id="create-bot-description"
                  v-model="form.description"
                  class="textarea ui-control"
                  rows="3"
                  placeholder="Краткое описание функционала бота..."
                  :disabled="isSubmitting"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="scope-section-title">Разрешения бота</label>
                <p class="form-hint">
                  Выбирайте только необходимые доступы. При установке бота пользователь увидит
                  запрашиваемые разрешения; изменение доступов позднее может потребовать повторной авторизации.
                </p>

                <div v-if="scopesLoading" class="scope-loading" role="status">Загрузка разрешений…</div>
                <div v-else-if="scopesError" class="error-alert" role="alert">
                  {{ scopesError }}
                  <button type="button" class="retry-button" @click="loadScopes">Повторить</button>
                </div>
                <template v-else>
                  <div class="scope-toolbar">
                    <label class="scope-search-label" for="create-bot-scope-search">Найти разрешение</label>
                    <input
                      id="create-bot-scope-search"
                      v-model="scopeQuery"
                      type="search"
                      class="scope-search ui-control"
                      placeholder="Название, описание или код: voice.listen"
                      autocomplete="off"
                      :disabled="isSubmitting"
                    />
                    <div class="scope-toolbar-bottom">
                      <span class="scope-selection-count">
                        Выбрано дополнительных: <strong>{{ optionalSelectedCount }}</strong> из {{ optionalScopeCount }}
                      </span>
                      <div class="scope-toolbar-actions">
                        <label class="scope-switch">
                          <input v-model="selectedOnly" type="checkbox" class="ui-checkbox" />
                          Только выбранные
                        </label>
                        <label class="scope-switch">
                          <input v-model="showCodes" type="checkbox" class="ui-checkbox" />
                          Коды API
                        </label>
                        <button
                          v-if="optionalSelectedCount > 0"
                          class="scope-reset"
                          type="button"
                          :disabled="isSubmitting"
                          @click="clearOptionalScopes"
                        >
                          Сбросить выбор
                        </button>
                      </div>
                    </div>
                  </div>
                  <div v-if="groupedScopes.length === 0" class="scope-empty" role="status">
                    По вашему запросу разрешения не найдены.
                    <button type="button" @click="clearScopeFilters">Показать все</button>
                  </div>
                  <div v-else class="scope-groups">
                    <div
                      v-for="group in groupedScopes"
                      :key="group.name"
                      class="scope-group"
                      :class="{ 'scope-group-sensitive': group.hasSensitive }"
                    >
                    <div class="scope-group-header">
                      <div>
                        <h4>{{ group.label }}</h4>
                        <p>{{ group.description }}</p>
                      </div>

                      <span v-if="group.hasSensitive" class="sensitive-pill"> Повышенный доступ </span>
                    </div>

                    <div v-if="group.name === 'voice'" class="voice-warning">
                      Боты с voice-разрешениями могут подключаться к голосовым комнатам. Разрешение
                      <strong>voice.listen</strong> позволяет получать аудио участников.
                    </div>

                    <div class="scopes-list">
                      <label
                        v-for="scope in group.scopes"
                        :key="scope.name"
                        class="scope-checkbox"
                        :title="scope.name"
                        :class="{
                          'scope-disabled': !scope.assignable,
                          'scope-sensitive': scope.sensitive,
                          'scope-checked': form.scopes.includes(scope.name),
                        }"
                      >
                        <input
                          type="checkbox" class="ui-checkbox"
                          :checked="form.scopes.includes(scope.name)"
                          :disabled="isSubmitting || !scope.assignable || scope.required || scope.name === 'bot'"
                          @change="changeScope(scope.name, $event)"
                        />

                        <div class="scope-info">
                          <div class="scope-title-row">
                            <strong>{{ scopeTitle(scope) }}</strong>
                            <span v-if="scope.required || scope.name === 'bot'" class="scope-required-mark">Обязательно</span>
                            <span v-else-if="scope.sensitive" class="scope-sensitive-mark">Особый доступ</span>
                          </div>
                          <span>{{ scope.description }}</span>
                          <code v-if="showCodes" class="scope-code">{{ scope.name }}</code>
                        </div>
                      </label>
                    </div>
                  </div>
                  </div>
                </template>
              </div>
            </div>

            <div class="modal__actions">
              <Button variant="ghost" type="button" @click="close" :disabled="isSubmitting">
                Отмена
              </Button>
              <Button
                variant="primary"
                type="submit"
                :loading="isSubmitting"
                :disabled="scopesLoading || Boolean(scopesError)"
              >
                Создать бота
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useBotsStore } from '@/stores/bots'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { storeToRefs } from 'pinia'
import type { BotAvailableScope } from '@/api/bots'
import { requiredBotScopes, scopeTitle, uniqueBotScopes, updateBotScopes } from '@/utils/botScopeCatalog'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  created: [botId: number]
}>()

const botsStore = useBotsStore()

const { availableScopes } = storeToRefs(botsStore)

// Отображаем реальные scopes из каталога backend, не дублируем разрешения вручную.
const scopeGroupLabels: Record<string, { label: string; description: string }> = {
  core: { label: 'Базовые', description: 'Минимальные разрешения для работы бота.' },
  server: { label: 'Сервер', description: 'Сервер, участники, роли и модерация.' },
  room: { label: 'Комнаты', description: 'Комнаты и структура сервера.' },
  message: { label: 'Сообщения', description: 'Сообщения и их содержимое.' },
  voice: { label: 'Голосовые комнаты', description: 'Подключение и публикация медиа.' },
  other: { label: 'Дополнительно', description: 'Остальные разрешения бота.' },
}

const uniqueScopes = computed(() => uniqueBotScopes(availableScopes.value))
const scopeQuery = ref('')
const selectedOnly = ref(false)
const showCodes = ref(false)

const optionalScopeCount = computed(() => uniqueScopes.value.filter((scope) => !scope.required && scope.name !== 'bot' && scope.assignable).length)
const optionalSelectedCount = computed(() => form.scopes.filter((name) => name !== 'bot' && !uniqueScopes.value.some((scope) => scope.name === name && scope.required)).length)

const groupedScopes = computed(() => {
  const query = scopeQuery.value.trim().toLocaleLowerCase('ru')
  const groups = new Map<string, BotAvailableScope[]>()
  for (const scope of uniqueScopes.value) {
    if (selectedOnly.value && !form.scopes.includes(scope.name)) continue
    const groupName = scope.group || 'other'
    const groupLabel = scopeGroupLabels[groupName]?.label ?? scopeGroupLabels.other!.label
    const searchableText = [scope.name, scopeTitle(scope), scope.description, groupLabel].join(' ').toLocaleLowerCase('ru')
    if (query && !searchableText.includes(query)) continue
    const items = groups.get(groupName) ?? []
    items.push(scope)
    groups.set(groupName, items)
  }

  const order = ['core', 'server', 'room', 'message', 'voice', 'other']
  return [...groups.entries()]
    .sort(([a], [b]) => {
      const ai = order.indexOf(a)
      const bi = order.indexOf(b)
      return (ai < 0 ? order.length : ai) - (bi < 0 ? order.length : bi) || a.localeCompare(b)
    })
    .map(([name, scopes]) => {
      const meta = scopeGroupLabels[name] ?? scopeGroupLabels.other!
      return {
        name,
        label: meta.label,
        description: meta.description,
        hasSensitive: scopes.some((scope) => scope.sensitive === true),
        scopes: scopes.sort((a, b) => scopeTitle(a).localeCompare(scopeTitle(b), 'ru')),
      }
    })
})

const changeScope = (name: string, event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  form.scopes = updateBotScopes(form.scopes, name, checked, uniqueScopes.value)
}

const clearOptionalScopes = () => {
  form.scopes = requiredBotScopes(uniqueScopes.value)
}

const clearScopeFilters = () => {
  scopeQuery.value = ''
  selectedOnly.value = false
}

const hasValidScopes = computed(() => {
  return form.scopes.length > 0 && form.scopes.includes('bot')
})

const form = reactive({
  name: '',
  description: '',
  avatar_url: '',
  is_public: false,
  scopes: ['bot'] as string[],
})

const errors = reactive({
  name: '',
})

const isSubmitting = ref(false)
const localError = ref('')
const scopesLoading = ref(false)
const scopesError = ref('')

const resetForm = () => {
  // Сброс формы
  form.name = ''
  form.description = ''
  form.avatar_url = ''
  form.is_public = false
  form.scopes = requiredBotScopes(uniqueScopes.value)
  scopeQuery.value = ''
  selectedOnly.value = false
  showCodes.value = false
  errors.name = ''
  localError.value = ''
}

const close = () => {
  if (isSubmitting.value) return
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  // Сброс ошибок
  errors.name = ''
  localError.value = ''
  botsStore.clearError()

  // Валидация
  const name = form.name.trim()
  if (!name) {
    errors.name = 'Введите название бота'
    return
  }

  if (name.length < 3) {
    errors.name = 'Минимум 3 символа'
    return
  }

  form.scopes = updateBotScopes(form.scopes, null, false, uniqueScopes.value)

  // ✅ Проверка scopes
  if (!hasValidScopes.value) {
    localError.value = 'Необходимо выбрать хотя бы одно разрешение'
    return
  }

  isSubmitting.value = true

  const newBot = await botsStore.createBot({
    name: name,
    description: form.description.trim(),
    scopes: form.scopes,
  })

  isSubmitting.value = false

  if (newBot) {
    // Успех - закрываем и уведомляем родителя
    resetForm()
    emit('created', newBot.id)
  } else {
    // Ошибка - показываем
    localError.value = botsStore.error || 'Не удалось создать бота'
  }
}

const loadScopes = async () => {
  botsStore.clearError()
  scopesLoading.value = true
  scopesError.value = ''
  try {
    const scopes = await botsStore.fetchAvailableScopes()
    if (scopes.length === 0) {
      scopesError.value = 'Каталог разрешений недоступен. Без него нельзя проверить доступы бота.'
    } else {
      form.scopes = updateBotScopes(form.scopes, null, false, uniqueBotScopes(scopes))
    }
  } catch {
    scopesError.value = 'Не удалось получить разрешения. Проверьте соединение и повторите попытку.'
  } finally {
    scopesLoading.value = false
  }
}

onMounted(() => { void loadScopes() })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 780px;
  max-height: calc(100vh - 2rem);
  max-height: calc(100dvh - 2rem);
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow);
  animation: slideUp 0.3s ease-out;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.modal__header h3 {
  margin: 0;
}

.modal__close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.modal__close:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.modal__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.modal__scroll {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1.5rem;
  scrollbar-gutter: stable;
}

.error-alert {
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.875rem;
}


.modal__actions {
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.scopes-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.scope-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--glass);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.scope-checkbox.scope-checked {
  border-color: var(--accent-primary);
  background: var(--glass);
}

.scope-checkbox:focus-within {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

.scope-checkbox:hover {
  border-color: var(--accent-primary);
}

.scope-checkbox input {
  margin-top: 0.25rem;
}

.scope-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.scope-info strong {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.scope-info span {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.scope-disabled {
  opacity: 0.7;
  cursor: default;
}

.scope-groups {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.scope-group {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-tertiary);
}

.scope-group-sensitive {
  border-color: rgba(245, 158, 11, 0.45);
  background: rgba(245, 158, 11, 0.06);
}

.scope-group-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.scope-group-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.scope-group-header p {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.sensitive-pill,
.scope-sensitive-mark {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 0.5rem;
  border-radius: 999px;
  background: rgba(245, 158, 11, 0.16);
  color: #f59e0b;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.voice-warning {
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: var(--text-primary);
  font-size: 0.8rem;
  line-height: 1.45;
}

.scope-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.scope-sensitive {
  border-color: rgba(245, 158, 11, 0.35);
}

.scope-section-title { color: var(--text-primary); font-weight: 700; }
.scope-toolbar {
  padding: 0.9rem;
  margin: 0.75rem 0 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
}
.scope-search-label { display: block; color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 0.4rem; }
.scope-toolbar-bottom { display: flex; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin-top: 0.8rem; }
.scope-selection-count { color: var(--text-secondary); font-size: 0.8rem; }
.scope-selection-count strong { color: var(--text-primary); }
.scope-toolbar-actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.scope-switch { display: inline-flex; gap: 0.35rem; align-items: center; font-size: 0.8rem; cursor: pointer; color: var(--text-secondary); }
.scope-reset, .scope-empty button {
  color: var(--accent-primary);
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
}
.scope-empty { padding: 1rem; border: 1px dashed var(--border-color); border-radius: 8px; color: var(--text-secondary); font-size: 0.85rem; }
.scope-required-mark { font-size: 0.66rem; font-weight: 700; color: var(--text-secondary); }
.scope-code { font-size: 0.7rem; overflow-wrap: anywhere; color: var(--text-muted); }
.scope-loading { color: var(--text-secondary); padding: 1rem 0; }
.retry-button {
  display: block;
  margin-top: .5rem;
  border: 0;
  background: transparent;
  color: var(--accent-primary);
  cursor: pointer;
  font: inherit;
  font-weight: 600;
}
@media (max-width: 720px) {
  .scopes-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 520px) {
  .modal-overlay { padding: 0.5rem; }
  .modal { max-height: calc(100dvh - 1rem); }
  .modal__header, .modal__scroll, .modal__actions { padding: 1rem; }
  .scopes-list { grid-template-columns: minmax(0, 1fr); }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
