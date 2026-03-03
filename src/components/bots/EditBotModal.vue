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
            <div class="form-group">
              <label>Название бота *</label>
              <Input
                v-model="form.name"
                placeholder="Мой супер бот"
                required
              />
            </div>

            <div class="form-group">
              <label>Описание</label>
              <textarea
                v-model="form.description"
                placeholder="Краткое описание что делает ваш бот..."
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-group">
              <label>URL аватара</label>
              <Input
                v-model="form.avatar_url"
                placeholder="https://example.com/avatar.png"
              />
            </div>

            <div class="form-group form-checkbox">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="form.is_public"
                />
                <span>Публичный бот (виден в каталоге)</span>
              </label>
              <p class="form-hint">
                Публичные боты могут быть установлены любым пользователем без одобрения
              </p>
            </div>

            <div class="scopes-list">
              <label
                v-for="scope in AVAILABLE_SCOPES"
                :key="scope.value"
                class="scope-checkbox"
              >
                <input
                  type="checkbox"
                  v-model="form.scopes"
                  :value="scope.value"
                />
                <div class="scope-info">
                  <strong>{{ scope.label }}</strong>
                  <span>{{ scope.description }}</span>
                </div>
              </label>
            </div>

            <div class="modal-actions">
              <Button variant="ghost" type="button" @click="close">
                Отмена
              </Button>
              <Button
                variant="primary"
                type="submit"
                :loading="isLoading"
              >
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
import { reactive, watch, computed } from 'vue'
import { AVAILABLE_SCOPES, type BotApp } from '@/types'
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

const form = reactive({
  name: '',
  description: '',
  avatar_url: '',
  is_public: false,
  scopes: ['bot'] as string[]
})

// Загружаем данные бота при открытии
watch(() => props.bot, (newBot) => {
  if (newBot) {
    form.name = newBot.name || ''
    form.description = newBot.description || ''
    form.avatar_url = newBot.avatar_url || ''
    form.is_public = newBot.is_public || false
    form.scopes = (newBot as any).scopes?.length > 0 ? (newBot as any).scopes : ['bot']
  }
}, { immediate: true })

const hasValidScopes = computed(() => {
  return form.scopes.length > 0 && form.scopes.includes('bot')
})

const close = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!hasValidScopes.value) {
    alert('Необходимо выбрать хотя бы одно разрешение')
    return
  }

  emit('submit', {
    name: form.name,
    description: form.description,
    avatar_url: form.avatar_url,
    is_public: form.is_public,
    scopes: form.scopes
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

.checkbox-label input[type="checkbox"] {
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
  flex-direction: column;
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
</style>
