<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal">
          <!-- Форма входа -->
          <div v-if="!show2FA" class="login-form">
            <div class="modal__header">
              <h3>Вход в Developer Portal</h3>
              <button class="modal__close" @click="close">×</button>
            </div>

            <form class="modal__body" @submit.prevent="handleLogin">
              <div v-if="authStore.error" class="error-alert">
                {{ authStore.error }}
              </div>

              <Input
                v-model="form.email"
                label="Email"
                type="email"
                placeholder="your@email.com"
                required
                :disabled="authStore.isLoading"
              />

              <Input
                v-model="form.password"
                label="Пароль"
                type="password"
                placeholder="••••••••"
                required
                :disabled="authStore.isLoading"
              />

              <label class="checkbox-label">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  :disabled="authStore.isLoading"
                />
                <span>Запомнить меня</span>
              </label>

              <div class="modal__actions">
                <Button
                  variant="primary"
                  type="submit"
                  :loading="authStore.isLoading"
                  class="full-width"
                >
                  Войти
                </Button>
              </div>

              <p class="login-hint">
                Используйте учётную запись EchoTalk
              </p>
            </form>
          </div>

          <!-- Форма 2FA -->
          <div v-else class="twofa-form">
            <div class="modal__header">
              <h3>Двухфакторная аутентификация</h3>
              <button class="modal__close" @click="close">×</button>
            </div>

            <form class="modal__body" @submit.prevent="handle2FA">
              <div class="twofa-info">
                <span class="twofa-icon">🔐</span>
                <p>Введите код из приложения-аутентификатора</p>
              </div>

              <div v-if="authStore.error" class="error-alert">
                {{ authStore.error }}
              </div>

              <Input
                v-model="twoFACode"
                label="Код 2FA"
                type="text"
                placeholder="000000"
                maxlength="6"
                required
                :disabled="authStore.isLoading"
              />

              <div class="backup-code-toggle">
                <button
                  type="button"
                  class="link-button"
                  @click="showBackupCode = !showBackupCode"
                >
                  {{ showBackupCode ? 'Использовать код 2FA' : 'Использовать резервный код' }}
                </button>
              </div>

              <Input
                v-if="showBackupCode"
                v-model="backupCode"
                label="Резервный код"
                type="text"
                placeholder="xxxx-xxxx-xxxx"
                :disabled="authStore.isLoading"
              />

              <div class="modal__actions">
                <Button
                  variant="secondary"
                  type="button"
                  :disabled="authStore.isLoading"
                  @click="handleCancel2FA"
                >
                  Назад
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  :loading="authStore.isLoading"
                >
                  Подтвердить
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  remember: true,
})

const show2FA = ref(false)
const twoFACode = ref('')
const backupCode = ref('')
const showBackupCode = ref(false)

// Сброс формы при открытии
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    authStore.clearError()
    // Проверяем, есть ли pending 2FA из предыдущей сессии
    if (authStore.pending2FA) {
      show2FA.value = true
      form.email = authStore.pending2FA.email
    } else {
      show2FA.value = false
      form.email = ''
      form.password = ''
      twoFACode.value = ''
      backupCode.value = ''
      showBackupCode.value = false
    }
  }
})

const close = () => {
  if (!authStore.isLoading) {
    emit('close')
  }
}

const handleLogin = async () => {
  console.log('Attempting login...')
  const result = await authStore.login({
    email: form.email,
    password: form.password,
    remember: form.remember,
  })

  console.log('Login result:', result)

  if (result.requires2FA) {
    show2FA.value = true
  } else if (result.success) {
    console.log('Login successful, closing modal')
    emit('success')
    emit('close')
    // Сброс формы
    form.email = ''
    form.password = ''
  }
  // Если ошибка - остаёмся на форме, ошибка отобразится из store
}

const handle2FA = async () => {
  const code = showBackupCode.value ? backupCode.value : twoFACode.value
  const result = await authStore.complete2FA(code, showBackupCode.value)

  if (result.success) {
    emit('success')
    emit('close')
    // Сброс
    show2FA.value = false
    twoFACode.value = ''
    backupCode.value = ''
    showBackupCode.value = false
  }
}

const handleCancel2FA = () => {
  authStore.cancel2FA()
  show2FA.value = false
  authStore.clearError()
}
</script>

<style scoped>
/* Стили без изменений */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
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
  max-width: 420px;
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
  font-size: 1.25rem;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--accent-primary);
}

.modal__actions {
  display: flex;
  gap: 0.75rem;
}

.modal__actions .full-width {
  width: 100%;
}

.login-hint {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.twofa-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: var(--border-radius);
}

.twofa-icon {
  font-size: 3rem;
}

.twofa-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

.backup-code-toggle {
  text-align: center;
}

.link-button {
  background: none;
  border: none;
  color: var(--accent-primary);
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.link-button:hover {
  opacity: 0.8;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
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
