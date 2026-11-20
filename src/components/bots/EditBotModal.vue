<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="edit-bot-title">
          <div class="modal-header">
            <h2 id="edit-bot-title">Настройки бота</h2>
            <button type="button" class="modal-close" aria-label="Закрыть окно" :disabled="isLoading" @click="close">×</button>
          </div>

          <form class="modal-body" @submit.prevent="handleSubmit">
            <div class="modal-scroll">
              <div v-if="localError" class="error-alert" role="alert">{{ localError }}</div>

              <div class="form-group">
                <Input v-model="form.name" label="Название бота" placeholder="Например: Бот-модератор" :disabled="isLoading" />
              </div>

              <div class="form-group">
                <label for="edit-bot-description">Описание</label>
                <textarea
                  id="edit-bot-description"
                  v-model="form.description"
                  rows="3"
                  class="form-textarea ui-control"
                  placeholder="Кратко опишите назначение бота"
                  :disabled="isLoading"
                ></textarea>
              </div>

              <div class="form-group">
                <Input v-model="form.avatar_url" label="Ссылка на аватар" placeholder="https://example.com/avatar.png" :disabled="isLoading" />
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input v-model="form.is_public" type="checkbox" class="ui-checkbox" :disabled="isLoading" />
                  <span>Показывать бота в публичном каталоге</span>
                </label>
                <p class="form-hint">Доступность установки по-прежнему определяется разрешениями и настройками сервера.</p>
              </div>

              <section class="form-group" aria-labelledby="edit-bot-scopes-title">
                <h3 id="edit-bot-scopes-title" class="scope-section-title">Разрешения бота</h3>
                <p class="scope-hint">
                  Выбирайте только необходимые доступы. Изменение разрешений может потребовать повторной авторизации уже установленных ботов.
                </p>

                <div v-if="scopesLoading" class="scope-loading" role="status">Загрузка разрешений…</div>
                <div v-else-if="scopesError" class="error-alert" role="alert">
                  {{ scopesError }}
                  <button type="button" class="retry-button" @click="loadScopes">Повторить</button>
                </div>
                <template v-else>
                  <div class="scope-toolbar">
                    <label class="scope-search-label" for="edit-bot-scope-search">Найти разрешение</label>
                    <input
                      id="edit-bot-scope-search"
                      v-model="scopeQuery"
                      type="search"
                      class="scope-search ui-control"
                      autocomplete="off"
                      placeholder="Название, описание или код: voice.listen"
                      :disabled="isLoading"
                    />
                    <div class="scope-toolbar-bottom">
                      <span class="scope-selection-count">
                        Выбрано дополнительных: <strong>{{ optionalSelectedCount }}</strong> из {{ optionalScopeCount }}
                      </span>
                      <div class="scope-toolbar-actions">
                        <label class="scope-switch">
                          <input v-model="selectedOnly" type="checkbox" class="ui-checkbox" :disabled="isLoading" />
                          Только выбранные
                        </label>
                        <label class="scope-switch">
                          <input v-model="showCodes" type="checkbox" class="ui-checkbox" />
                          Коды API
                        </label>
                        <button
                          v-if="optionalSelectedCount > 0"
                          type="button"
                          class="scope-reset"
                          :disabled="isLoading"
                          @click="clearOptionalScopes"
                        >
                          Оставить обязательные
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
                        <span v-if="group.hasSensitive" class="sensitive-pill">Повышенный доступ</span>
                      </div>

                      <div v-if="group.name === 'voice'" class="voice-warning">
                        Разрешение <strong>voice.listen</strong> позволяет боту получать аудио участников голосовой комнаты.
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
                            :disabled="isLoading || !scope.assignable || scope.required || scope.name === 'bot'"
                            @change="changeScope(scope.name, $event)"
                          />
                          <span class="scope-info">
                            <span class="scope-title-row">
                              <strong>{{ scopeTitle(scope) }}</strong>
                              <span v-if="scope.required || scope.name === 'bot'" class="scope-required-mark">Обязательно</span>
                              <span v-else-if="scope.sensitive" class="scope-sensitive-mark">Особый доступ</span>
                            </span>
                            <span>{{ scope.description }}</span>
                            <code v-if="showCodes" class="scope-code">{{ scope.name }}</code>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <p v-if="unknownSelectedScopes.length" class="scope-unknown" role="status">
                    Некоторые ранее выданные разрешения отсутствуют в текущем каталоге:
                    <code>{{ unknownSelectedScopes.join(', ') }}</code>.
                    Они сохранятся без изменений, если не нажимать «Оставить обязательные».
                  </p>
                </template>
              </section>
            </div>

            <div class="modal-actions">
              <Button variant="ghost" type="button" :disabled="isLoading" @click="close">Отмена</Button>
              <Button variant="primary" type="submit" :loading="isLoading" :disabled="scopesLoading || Boolean(scopesError) || !bot">
                Сохранить изменения
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { BotApp } from '@/types'
import type { BotAvailableScope } from '@/api/bots'
import { useBotsStore } from '@/stores/bots'
import { requiredBotScopes, scopeTitle, uniqueBotScopes, updateBotScopes } from '@/utils/botScopeCatalog'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

const props = defineProps<{
  isOpen: boolean
  bot: BotApp | null
  isLoading?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Partial<BotApp> & { scopes?: string[] }]
}>()

const botsStore = useBotsStore()
const { availableScopes } = storeToRefs(botsStore)
const uniqueScopes = computed(() => uniqueBotScopes(availableScopes.value))

const scopeGroupLabels: Record<string, { label: string; description: string }> = {
  core: { label: 'Базовые', description: 'Минимальные разрешения для работы бота.' },
  server: { label: 'Сервер', description: 'Сервер, участники, роли и модерация.' },
  room: { label: 'Комнаты', description: 'Комнаты и структура сервера.' },
  message: { label: 'Сообщения', description: 'Сообщения и их содержимое.' },
  voice: { label: 'Голосовые комнаты', description: 'Подключение и публикация медиа.' },
  other: { label: 'Дополнительно', description: 'Остальные разрешения бота.' },
}

const form = reactive({
  name: '',
  description: '',
  avatar_url: '',
  is_public: false,
  scopes: ['bot'] as string[],
})

const localError = ref('')
const scopesLoading = ref(false)
const scopesError = ref('')
const scopeQuery = ref('')
const selectedOnly = ref(false)
const showCodes = ref(false)

const optionalScopeCount = computed(() =>
  uniqueScopes.value.filter((scope) => !scope.required && scope.name !== 'bot' && scope.assignable).length,
)
const optionalSelectedCount = computed(() =>
  uniqueScopes.value.filter((scope) => !scope.required && scope.name !== 'bot' && scope.assignable && form.scopes.includes(scope.name)).length,
)
const unknownSelectedScopes = computed(() =>
  form.scopes.filter((name) => !uniqueScopes.value.some((scope) => scope.name === name)),
)

const groupedScopes = computed(() => {
  const query = scopeQuery.value.trim().toLocaleLowerCase('ru')
  const groups = new Map<string, BotAvailableScope[]>()
  for (const scope of uniqueScopes.value) {
    if (selectedOnly.value && !form.scopes.includes(scope.name)) continue
    const groupName = scope.group || 'other'
    const groupLabel = scopeGroupLabels[groupName]?.label ?? scopeGroupLabels.other!.label
    const search = [scope.name, scopeTitle(scope), scope.description, groupLabel].join(' ').toLocaleLowerCase('ru')
    if (query && !search.includes(query)) continue
    const list = groups.get(groupName) ?? []
    list.push(scope)
    groups.set(groupName, list)
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

const setFormFromBot = (bot: BotApp | null) => {
  if (!bot) return
  form.name = bot.name ?? ''
  form.description = bot.description ?? ''
  form.avatar_url = bot.avatar_url ?? ''
  form.is_public = bot.is_public ?? false
  form.scopes = updateBotScopes(bot.scopes?.length ? [...new Set(bot.scopes)] : ['bot'], null, false, uniqueScopes.value)
}

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

let loadRequestId = 0
const loadScopes = async () => {
  const requestId = ++loadRequestId
  scopesLoading.value = true
  scopesError.value = ''
  try {
    const scopes = await botsStore.fetchAvailableScopes()
    if (requestId !== loadRequestId || !props.isOpen) return
    if (scopes.length === 0) {
      scopesError.value = 'Не удалось загрузить каталог разрешений. Сохранение изменений временно недоступно.'
    } else {
      form.scopes = updateBotScopes(form.scopes, null, false, uniqueBotScopes(scopes))
    }
  } catch {
    if (requestId === loadRequestId && props.isOpen) {
      scopesError.value = 'Не удалось получить разрешения. Проверьте соединение и повторите попытку.'
    }
  } finally {
    if (requestId === loadRequestId) scopesLoading.value = false
  }
}

watch(
  () => props.bot,
  (bot) => {
    if (props.isOpen) setFormFromBot(bot)
  },
)

watch(
  () => props.isOpen,
  (open) => {
    if (!open) {
      loadRequestId++
      scopesLoading.value = false
      return
    }
    localError.value = ''
    scopeQuery.value = ''
    selectedOnly.value = false
    showCodes.value = false
    setFormFromBot(props.bot)
    void loadScopes()
  },
  { immediate: true },
)

const close = () => {
  if (props.isLoading) return
  localError.value = ''
  emit('close')
}

const handleSubmit = () => {
  localError.value = ''
  if (!props.bot || scopesLoading.value || scopesError.value) return

  const name = form.name.trim()
  if (!name) {
    localError.value = 'Введите название бота'
    return
  }
  if (name.length < 3) {
    localError.value = 'Название должно содержать минимум 3 символа'
    return
  }

  form.scopes = updateBotScopes(form.scopes, null, false, uniqueScopes.value)
  if (!form.scopes.includes('bot')) {
    localError.value = 'Необходимо базовое разрешение бота'
    return
  }

  emit('submit', {
    name,
    description: form.description.trim(),
    avatar_url: form.avatar_url.trim(),
    is_public: form.is_public,
    scopes: [...new Set(form.scopes)],
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
}
.modal-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 780px;
  max-height: calc(100vh - 2rem);
  max-height: calc(100dvh - 2rem);
  min-height: 0;
  overflow: hidden;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}
.modal-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}
.modal-header h2 { margin: 0; font-size: 1.25rem; color: var(--text-primary); }
.modal-close {
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.5rem;
}
.modal-close:hover { background: var(--bg-elevated); color: var(--text-primary); }
.modal-body { display: flex; flex: 1 1 auto; flex-direction: column; min-height: 0; overflow: hidden; }
.modal-scroll { flex: 1 1 auto; min-height: 0; padding: 1.5rem; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; }
.modal-actions {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}
.form-group { margin-bottom: 1.25rem; }
.form-group > label:not(.checkbox-label) { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); }
.checkbox-label { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; color: var(--text-primary); }
.checkbox-label input { width: 18px; height: 18px; accent-color: var(--accent-primary); }
.form-hint, .scope-hint { margin: 0.5rem 0 0; color: var(--text-secondary); font-size: 0.8rem; line-height: 1.5; }
.scope-section-title { margin: 0; color: var(--text-primary); font-size: 0.95rem; }
.scope-toolbar { padding: 0.9rem; margin: 0.75rem 0 1rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; }
.scope-search-label { display: block; color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 0.4rem; }
.scope-toolbar-bottom { display: flex; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin-top: 0.8rem; }
.scope-selection-count { color: var(--text-secondary); font-size: 0.8rem; }
.scope-selection-count strong { color: var(--text-primary); }
.scope-toolbar-actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.scope-switch { display: inline-flex; align-items: center; gap: 0.35rem; color: var(--text-secondary); font-size: 0.8rem; cursor: pointer; }
.scope-reset, .scope-empty button, .retry-button { color: var(--accent-primary); background: transparent; border: none; padding: 0.25rem; cursor: pointer; font: inherit; font-size: 0.8rem; font-weight: 600; }
.scope-empty { padding: 1rem; border: 1px dashed var(--border-color); border-radius: 8px; color: var(--text-secondary); font-size: 0.85rem; }
.scope-loading { color: var(--text-secondary); padding: 1rem 0; }
.scope-groups { display: flex; flex-direction: column; gap: 1rem; }
.scope-group { padding: 1rem; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-tertiary); }
.scope-group-sensitive { border-color: rgba(245, 158, 11, 0.45); background: rgba(245, 158, 11, 0.06); }
.scope-group-header { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem; }
.scope-group-header h4 { margin: 0; color: var(--text-primary); font-size: 0.95rem; }
.scope-group-header p { margin: 0.25rem 0 0; color: var(--text-secondary); font-size: 0.8rem; }
.sensitive-pill, .scope-sensitive-mark {
  display: inline-flex; align-items: center; border-radius: 999px; padding: 0.2rem 0.45rem;
  background: rgba(245, 158, 11, 0.16); color: #f59e0b; font-size: 0.68rem; font-weight: 700;
}
.voice-warning, .scope-unknown {
  margin-bottom: 0.75rem; padding: 0.75rem; border-radius: 10px;
  background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35);
  color: var(--text-primary); font-size: 0.8rem; line-height: 1.5;
}
.scope-unknown { margin-top: 1rem; overflow-wrap: anywhere; }
.scope-unknown code { font-size: 0.75rem; }
.scopes-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; }
.scope-checkbox {
  display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem;
  background: var(--glass); border: 1px solid var(--border-color); border-radius: 8px;
  cursor: pointer; transition: border-color 0.2s;
}
.scope-checkbox:hover, .scope-checked { border-color: var(--accent-primary); }
.scope-checkbox:focus-within { outline: 2px solid var(--accent-primary); outline-offset: 2px; }
.scope-checkbox input { margin-top: 0.25rem; flex-shrink: 0; }
.scope-info { display: flex; flex-direction: column; min-width: 0; gap: 0.25rem; }
.scope-info strong { color: var(--text-primary); font-size: 0.875rem; }
.scope-info > span:not(.scope-title-row) { color: var(--text-secondary); font-size: 0.75rem; }
.scope-title-row { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.scope-required-mark { color: var(--text-secondary); font-size: 0.66rem; font-weight: 700; }
.scope-code { color: var(--text-muted); font-size: 0.7rem; overflow-wrap: anywhere; }
.scope-disabled { opacity: 0.7; cursor: default; }
.error-alert { padding: 0.75rem 1rem; margin-bottom: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; color: #ef4444; font-size: 0.875rem; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
@media (max-width: 720px) { .scopes-list { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 520px) {
  .modal-overlay { padding: 0.5rem; }
  .modal-content { max-height: calc(100dvh - 1rem); }
  .modal-header, .modal-scroll, .modal-actions { padding: 1rem; }
  .scopes-list { grid-template-columns: minmax(0, 1fr); }
}
</style>
