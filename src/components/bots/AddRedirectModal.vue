<!-- components/bots/AddRedirectModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="oauth-url-modal-title">
          <div class="modal-header">
            <h2 id="oauth-url-modal-title">{{ mode === 'oauth-start' ? (initialValue ? 'Изменить OAuth Start URL' : 'Добавить OAuth Start URL') : 'Добавить Redirect URI' }}</h2>
            <button class="modal-close" type="button" aria-label="Закрыть" :disabled="isLoading" @click="close"><AppIcon name="x" :size="21" /></button>
          </div>

          <form @submit.prevent="handleSubmit" class="modal-body">
            <div class="form-group">
              <Input
                v-if="mode === 'redirect'"
                v-model="url"
                id="redirect-uri"
                label="URL *"
                placeholder="https://your-app.com/auth/callback"
                type="url"
                required
                maxlength="500"
              />
              <Input
                v-else
                v-model="url"
                id="oauth-start-url"
                label="OAuth Start URL *"
                placeholder="https://your-bot.example.com/oauth/start"
                type="url"
                required
                maxlength="500"
                :error="validationError"
              />
              <p class="form-hint">
                Допускается HTTPS или HTTP для localhost и loopback IP. Максимум 500 символов.
                <template v-if="mode === 'oauth-start'">
                  Адрес должен вести на backend бота, где создаётся OAuth state.
                </template>
              </p>
            </div>

            <div class="modal-actions">
              <Button variant="ghost" type="button" :disabled="isLoading" @click="close">
                Отмена
              </Button>
              <Button
                variant="primary"
                type="submit"
                :loading="isLoading"
              >
                {{ mode === 'oauth-start' ? 'Сохранить' : 'Добавить' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { isSafeBotOAuthURL } from '@/utils/botOAuthFlow'

const props = withDefaults(defineProps<{
  isOpen: boolean
  isLoading?: boolean
  mode?: 'redirect' | 'oauth-start'
  initialValue?: string
}>(), {
  mode: 'redirect',
  initialValue: '',
})

const emit = defineEmits<{
  close: []
  submit: [url: string]
}>()

const url = ref('')
const validationError = ref('')

// Opening the dialog must always show the current value, not an unsaved previous draft.
watch(() => props.isOpen, (open) => {
  if (open) {
    url.value = props.mode === 'oauth-start' ? props.initialValue : ''
    validationError.value = ''
  }
})
watch(url, () => { validationError.value = '' })

const close = () => {
  if (props.isLoading) return
  url.value = ''
  validationError.value = ''
  emit('close')
}

const handleSubmit = () => {
  if (props.isLoading) return
  const value = url.value.trim()
  if (!value) return
  if (props.mode === 'oauth-start' && !isSafeBotOAuthURL(value)) {
    validationError.value = 'Укажите HTTPS URL или HTTP для localhost/loopback без логина, пароля и фрагмента.'
    return
  }
  emit('submit', value)
}
</script>

<style scoped>
/* Используем те же стили что и в EditBotModal */
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
  max-width: 500px;
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

.form-hint {
  margin: 0.5rem 0 0 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
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
</style>
