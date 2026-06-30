<!-- components/bots/EditBotModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Редактировать бота</h2>
            <button class="modal-close" @click="close">×</button>
          </div>

          <form @submit.prevent="handleSubmit" class="modal-body">
            <div v-if="localError" class="error-alert">
              {{ localError }}
            </div>

            <div class="form-group">
              <label>Название бота *</label>
              <Input
                v-model="form.name"
                placeholder="Мой супер бот"
                required
                :disabled="isLoading"
              />
            </div>

            <div class="form-group">
              <label>Описание</label>
              <textarea
                v-model="form.description"
                placeholder="Краткое описание что делает ваш бот..."
                rows="3"
                class="form-textarea"
                :disabled="isLoading"
              ></textarea>
            </div>

            <div class="form-group">
              <label>URL аватара</label>
              <Input
                v-model="form.avatar_url"
                placeholder="https://example.com/avatar.png"
                :disabled="isLoading"
              />
            </div>

            <div class="form-group form-checkbox">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.is_public" :disabled="isLoading" />
                <span>Публичный бот (виден в каталоге)</span>
              </label>
              <p class="form-hint">
                Публичные боты могут быть установлены любым пользователем без одобрения
              </p>
            </div>

            <div class="form-group">
              <label>Разрешения (Scopes)</label>
              <p class="form-hint">Выберите, к каким данным бот будет иметь доступ</p>

              <div class="scope-groups">
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

                    <span v-if="group.hasSensitive" class="sensitive-pill"> sensitive </span>
                  </div>

                  <div v-if="group.name === 'voice'" class="voice-warning">
                    Боты с voice-разрешениями могут подключаться к голосовым комнатам. Разрешение
                    <strong>voice.listen</strong> позволяет получать аудио участников. EchoTalk не
                    выполняет транскрибацию автоматически, но разработчик бота может обрабатывать
                    аудио на своей стороне.
                  </div>

                  <div class="scopes-list">
                    <label
                      v-for="scope in group.scopes"
                      :key="scope.name"
                      class="scope-checkbox"
                      :class="{
                        'scope-disabled': !scope.assignable,
                        'scope-sensitive': scope.sensitive,
                      }"
                    >
                      <input
                        type="checkbox"
                        v-model="form.scopes"
                        :value="scope.name"
                        :disabled="isLoading || !scope.assignable"
                        @change="syncScopeDependencies(scope.name)"
                      />

                      <div class="scope-info">
                        <div class="scope-title-row">
                          <strong>{{ scope.label }}</strong>
                          <span v-if="scope.sensitive" class="scope-sensitive-mark"> важное </span>
                        </div>

                        <span>{{ scope.description }}</span>
                        <code>{{ scope.name }}</code>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <Button variant="ghost" type="button" @click="close" :disabled="isLoading">
                Отмена
              </Button>
              <Button variant="primary" type="submit" :loading="isLoading">
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
import { reactive, watch, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { BotApp } from '@/types'
import { useBotsStore } from '@/stores/bots'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

type AvailableScope = {
  name: string
  label: string
  description: string
  required: boolean
  assignable: boolean
  group: string
  sensitive?: boolean
}

const scopeGroupLabels: Record<string, { label: string; description: string }> = {
  core: {
    label: 'Базовые',
    description: 'Минимальные разрешения для работы Bot Runtime.',
  },
  server: {
    label: 'Сервер',
    description: 'Доступ к серверу, участникам, ролям и модерации.',
  },
  room: {
    label: 'Комнаты и сообщения',
    description: 'Доступ к комнатам, сообщениям и структуре сервера.',
  },
  message: {
    label: 'Сообщения',
    description: 'Доступ к содержимому и контексту сообщений.',
  },
  voice: {
    label: 'Voice / Media',
    description: 'Доступ к голосовым комнатам, участникам и audio tracks.',
  },
  other: {
    label: 'Дополнительно',
    description: 'Дополнительные разрешения бота.',
  },
}

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

const localError = ref('')

const form = reactive({
  name: '',
  description: '',
  avatar_url: '',
  is_public: false,
  scopes: ['bot'] as string[],
})

const hasValidScopes = computed(() => {
  return form.scopes.length > 0 && form.scopes.includes('bot')
})

const groupedScopes = computed(() => {
  const groups = new Map<string, AvailableScope[]>()

  for (const scope of availableScopes.value as AvailableScope[]) {
    const groupName = scope.group || 'other'
    const list = groups.get(groupName) || []

    list.push(scope)
    groups.set(groupName, list)
  }

  const order = ['core', 'server', 'room', 'message', 'voice', 'other']

  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      const aIndex = order.indexOf(a)
      const bIndex = order.indexOf(b)

      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b)
      }

      if (aIndex === -1) return 1
      if (bIndex === -1) return -1

      return aIndex - bIndex
    })
    .map(([name, scopes]) => {
      const meta = scopeGroupLabels[name] || scopeGroupLabels.other

      return {
        name,
        label: meta.label,
        description: meta.description,
        hasSensitive: scopes.some((scope) => Boolean(scope.sensitive)),
        scopes: scopes.sort((a, b) => a.name.localeCompare(b.name)),
      }
    })
})

const hasScope = (scope: string) => {
  return form.scopes.includes(scope)
}

const ensureScope = (scope: string) => {
  if (!hasScope(scope)) {
    form.scopes.push(scope)
  }
}

const removeScope = (scope: string) => {
  form.scopes = form.scopes.filter((item) => item !== scope)
}

const syncScopeDependencies = (changedScope: string) => {
  ensureScope('bot')

  // Пользователь снял voice.view:
  // значит нужно каскадно снять всё, что от него зависит.
  if (changedScope === 'voice.view' && !hasScope('voice.view')) {
    removeScope('voice.connect')
    removeScope('voice.listen')
    removeScope('voice.speak')
    return
  }

  // Пользователь снял voice.connect:
  // значит listen/speak больше невозможны.
  if (changedScope === 'voice.connect' && !hasScope('voice.connect')) {
    removeScope('voice.listen')
    removeScope('voice.speak')
    return
  }

  // Пользователь выбрал voice.listen:
  // автоматически добавляем родителей.
  if (changedScope === 'voice.listen' && hasScope('voice.listen')) {
    ensureScope('voice.view')
    ensureScope('voice.connect')
    return
  }

  // Пользователь выбрал voice.speak:
  // автоматически добавляем родителей.
  if (changedScope === 'voice.speak' && hasScope('voice.speak')) {
    ensureScope('voice.view')
    ensureScope('voice.connect')
    return
  }

  // Пользователь выбрал voice.connect:
  // автоматически добавляем voice.view.
  if (changedScope === 'voice.connect' && hasScope('voice.connect')) {
    ensureScope('voice.view')
    return
  }

  // Финальная нормализация для init / submit.
  if (hasScope('voice.listen') || hasScope('voice.speak')) {
    ensureScope('voice.view')
    ensureScope('voice.connect')
  }

  if (hasScope('voice.connect')) {
    ensureScope('voice.view')
  }

  if (!hasScope('voice.connect')) {
    removeScope('voice.listen')
    removeScope('voice.speak')
  }

  if (!hasScope('voice.view')) {
    removeScope('voice.connect')
    removeScope('voice.listen')
    removeScope('voice.speak')
  }
}

watch(
  () => props.isOpen,
  async (open) => {
    if (!open) return
    localError.value = ''
    await botsStore.fetchAvailableScopes()
  },
)

watch(
  () => props.bot,
  (newBot) => {
    if (!newBot) return

    form.name = newBot.name || ''
    form.description = newBot.description || ''
    form.avatar_url = newBot.avatar_url || ''
    form.is_public = newBot.is_public || false

    const botScopes = (newBot as any).scopes?.length > 0 ? [...(newBot as any).scopes] : ['bot']
    if (!botScopes.includes('bot')) {
      botScopes.unshift('bot')
    }

    form.scopes = [...new Set(botScopes)]
    syncScopeDependencies('init')
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

  const trimmedName = form.name.trim()
  if (!trimmedName) {
    localError.value = 'Введите название бота'
    return
  }

  if (trimmedName.length < 3) {
    localError.value = 'Минимум 3 символа'
    return
  }

  syncScopeDependencies('submit')

  if (!hasValidScopes.value) {
    localError.value = 'Необходимо выбрать хотя бы одно разрешение'
    return
  }

  emit('submit', {
    name: trimmedName,
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
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 780px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.875rem;
  resize: vertical;
  transition: border-color 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.form-checkbox {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: var(--text-primary) !important;
}

.checkbox-label input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: var(--accent-primary);
}

.form-hint {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
  padding-left: 1.65rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(10px);
}

.scopes-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(1, 1fr);
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
  white-space: nowrap;
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

.scope-info code {
  margin-top: 0.15rem;
  color: var(--text-tertiary);
  font-size: 0.7rem;
}
</style>
