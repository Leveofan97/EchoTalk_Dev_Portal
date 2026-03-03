<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal">
          <div class="modal__header">
            <h3>Создать нового бота</h3>
            <button class="modal__close" @click="close">×</button>
          </div>

          <form class="modal__body" @submit.prevent="handleSubmit">
            <div v-if="error" class="error-alert">
              {{ error }}
            </div>

            <Input
              v-model="form.name"
              label="Название бота"
              placeholder="Например: Moderator Bot"
              :error="errors.name"
              required
              :disabled="isSubmitting"
            />

            <div class="input-wrapper">
              <label class="input-label">Описание</label>
              <textarea
                v-model="form.description"
                class="textarea"
                rows="3"
                placeholder="Краткое описание функционала бота..."
                :disabled="isSubmitting"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Разрешения (Scopes)</label>
              <p class="form-hint">Выберите, к каким данным бот будет иметь доступ</p>

              <div class="scopes-list">
                <label
                  v-for="scope in AVAILABLE_SCOPES"
                  :key="scope.value"
                  class="scope-checkbox"
                  :class="{ 'scope-disabled': scope.value === 'bot' }"
                >
                  <input
                    type="checkbox"
                    v-model="form.scopes"
                    :value="scope.value"
                    :checked="scope.value === 'bot'"
                    :disabled="scope.value === 'bot'"
                  />
                  <div class="scope-info">
                    <strong>{{ scope.label }}</strong>
                    <span>{{ scope.description }}</span>
                  </div>
                </label>
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
import {computed, reactive, ref} from 'vue'
import { useBotsStore } from '@/stores/bots'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import {AVAILABLE_SCOPES} from "@/types";

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  created: []
}>()

const botsStore = useBotsStore()

const hasValidScopes = computed(() => {
  return form.scopes.length > 0 && form.scopes.includes('bot')
})

const form = reactive({
  name: '',
  description: '',
  avatar_url: '',
  is_public: false,
  scopes: ['bot'] as string[]
})

const errors = reactive({
  name: ''
})


const isSubmitting = ref(false)
const localError = ref('')

const close = () => {
  if (isSubmitting.value) return

  // Сброс формы
  form.name = ''
  form.description = ''
  form.avatar_url = ''
  form.is_public = false
  form.scopes = ['bot']
  errors.name = ''
  localError.value = ''

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

  // ✅ Проверка scopes
  if (!hasValidScopes.value) {
    localError.value = 'Необходимо выбрать хотя бы одно разрешение'
    return
  }

  isSubmitting.value = true

  console.log('Creating bot:', {
    name,
    description: form.description.trim(),
    scopes: form.scopes
  })

  console.log('Creating bot:', { name, description: form.description.trim() })

  const newBot = await botsStore.createBot({
    name: name,
    description: form.description.trim(),
    scopes: form.scopes
  })

  console.log('Create bot result:', newBot)

  isSubmitting.value = false

  if (newBot) {
    // Успех - закрываем и уведомляем родителя
    emit('created')
    close()
  } else {
    // Ошибка - показываем
    localError.value = botsStore.error || 'Не удалось создать бота'
  }
}
</script>

<style scoped>
/* Стили без изменений */
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
}

.modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 780px;
  box-shadow: var(--shadow);
  animation: slideUp 0.3s ease-out;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
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
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.error-alert {
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.875rem;
}

.textarea {
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  width: 100%;
  transition: var(--transition);
}

.textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
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
