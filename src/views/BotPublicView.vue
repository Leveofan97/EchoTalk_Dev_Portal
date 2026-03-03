<template>
  <div class="bot-public">
    <div class="container">
      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <h2>😕 Бот не найден</h2>
        <p>{{ error }}</p>
        <Button variant="primary" @click="$router.push('/explore')">
          К каталогу
        </Button>
      </div>

      <!-- Content -->
      <div v-else-if="bot" class="bot-profile">
        <!-- Hero -->
        <div class="bot-hero">
          <div class="bot-avatar-large">
            <img v-if="bot.avatar_url" :src="bot.avatar_url" :alt="bot.name">
            <span v-else>{{ bot.name[0] }}</span>
          </div>

          <div class="bot-info">
            <h1>{{ bot.name }}</h1>
            <p class="description">{{ bot.description }}</p>

            <div class="bot-stats">
              <div class="stat">
                <span class="value">{{ bot.server_count }}</span>
                <span class="label">серверов</span>
              </div>
              <div class="stat">
                <span class="value">{{ bot.scopes?.length || 0 }}</span>
                <span class="label">разрешений</span>
              </div>
            </div>

            <div class="owner-info">
              <span>Создатель:</span>
              <div class="owner">
                <img v-if="bot.owner?.avatar_url" :src="bot.owner.avatar_url">
                <span v-else>{{ bot.owner?.username?.[0] }}</span>
                {{ bot.owner?.username }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="bot-actions">
            <Button
              v-if="isAuthenticated"
              variant="primary"
              size="lg"
              @click="startInstall"
              :loading="botsStore.isLoading"
            >
              Добавить на сервер
            </Button>
            <Button
              v-else
              variant="primary"
              size="lg"
              @click="redirectToLogin"
            >
              Войти для установки
            </Button>

            <Button
              v-if="isOwner"
              variant="secondary"
              @click="$router.push(`/bots/${bot.id}/manage`)"
            >
              Управление
            </Button>
          </div>
        </div>

        <!-- Scopes -->
        <Card class="scopes-section">
          <h3>🔐 Разрешения</h3>
          <p class="hint">Этот бот запрашивает следующие разрешения:</p>

          <div class="scopes-list">
            <div
              v-for="scope in bot.scopes"
              :key="scope"
              class="scope-item"
            >
              <span class="scope-icon">✓</span>
              <div class="scope-info">
                <code>{{ scope }}</code>
                <p>{{ getScopeDescription(scope) }}</p>
              </div>
            </div>
          </div>
        </Card>

        <!-- How to use -->
        <Card class="help-section">
          <h3>📖 Как использовать</h3>
          <ol>
            <li>Нажмите "Добавить на сервер"</li>
            <li>Выберите сервер из списка</li>
            <li>Выберите разрешения, которые вы хотите дать боту</li>
            <li>Подтвердите установку</li>
          </ol>
        </Card>
      </div>
    </div>

    <!-- Модал выбора сервера -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="installStep === 'select-server'" class="modal-overlay" @click.self="cancelInstall">
          <div class="modal-content install-modal">
            <div class="modal-header">
              <h2>Выберите сервер</h2>
              <button class="modal-close" @click="cancelInstall">×</button>
            </div>

            <div class="modal-body">
              <p class="install-subtitle">
                Установка <strong>{{ bot?.name }}</strong>
              </p>

              <div v-if="botsStore.isLoading" class="loading-state">
                <div class="spinner"></div>
                <p>Загрузка серверов...</p>
              </div>

              <div v-else-if="botsStore.serversForInstall.length === 0" class="empty-servers">
                <div class="empty-icon">🏠</div>
                <p>У вас нет серверов где вы являетесь владельцем</p>
                <p class="hint">Создайте сервер в EchoTalk</p>
              </div>

              <div v-else class="servers-list">
                <div
                  v-for="server in botsStore.serversForInstall"
                  :key="server.id"
                  class="server-card"
                  :class="{ 'has-bot': server.has_bot, 'disabled': server.has_bot }"
                  @click="!server.has_bot && selectServer(server)"
                >
                  <div class="server-avatar">
                    <img v-if="server.avatar_url" :src="server.avatar_url">
                    <span v-else>{{ server.name[0] }}</span>
                  </div>
                  <div class="server-info">
                    <h4>{{ server.name }}</h4>
                    <p v-if="server.has_bot" class="has-bot-badge">✓ Бот уже установлен</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Модал выбора scopes (НОВЫЙ) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="installStep === 'select-scopes'" class="modal-overlay" @click.self="backToServers">
          <div class="modal-content install-modal">
            <div class="modal-header">
              <h2>Настройте разрешения</h2>
              <button class="modal-close" @click="backToServers">×</button>
            </div>

            <div class="modal-body">
              <p class="install-subtitle">
                Выберите, какие функции бота <strong>{{ bot?.name }}</strong>
                будут разрешены на сервере <strong>{{ selectedServer?.name }}</strong>
              </p>

              <div class="scopes-selection">
                <div
                  v-for="scope in bot?.scopes"
                  :key="scope"
                  class="scope-toggle"
                  :class="{ 'disabled': scope === 'bot' }"
                >
                  <label class="scope-label">
                    <input
                      type="checkbox"
                      v-model="selectedScopes"
                      :value="scope"
                      :disabled="scope === 'bot'"
                    >
                    <div class="scope-content">
                      <code>{{ scope }}</code>
                      <span class="scope-desc">{{ getScopeDescription(scope) }}</span>
                      <span v-if="scope === 'bot'" class="scope-required">(обязательно)</span>
                    </div>
                  </label>
                </div>
              </div>

              <div class="scopes-warning" v-if="selectedScopes.length < (bot?.scopes?.length || 0)">
                <span>⚠️</span>
                <p>Вы ограничиваете функциональность бота. Некоторые функции могут не работать.</p>
              </div>

              <div class="modal-actions">
                <Button variant="ghost" @click="backToServers">Назад</Button>
                <Button
                  variant="primary"
                  @click="toConfirm"
                  :disabled="selectedScopes.length === 0"
                >
                  Продолжить
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Модал подтверждения -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="installStep === 'confirm'" class="modal-overlay" @click.self="backToScopes">
          <div class="modal-content install-modal">
            <div class="modal-header">
              <h2>Подтвердите установку</h2>
            </div>

            <div class="modal-body">
              <div class="confirm-info">
                <p>
                  Бот <strong>{{ bot?.name }}</strong> будет добавлен на сервер
                  <strong>{{ selectedServer?.name }}</strong>
                </p>
              </div>

              <div class="scopes-confirm">
                <h4>Выданные разрешения ({{ selectedScopes.length }} из {{ bot?.scopes?.length }}):</h4>
                <ul class="scopes-list-confirm">
                  <li v-for="scope in selectedScopes" :key="scope">
                    <code>{{ scope }}</code>
                    <span>{{ getScopeDescription(scope) }}</span>
                  </li>
                </ul>
                <p v-if="selectedScopes.length < (bot?.scopes?.length || 0)" class="scopes-note">
                  Исключены: {{ bot?.scopes?.filter(s => !selectedScopes.includes(s)).join(', ') }}
                </p>
              </div>

              <div class="modal-actions">
                <Button variant="ghost" @click="backToScopes">Назад</Button>
                <Button
                  variant="primary"
                  :loading="botsStore.isInstalling"
                  @click="confirmInstall"
                >
                  Авторизовать
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Модал: Код выдан -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="installStep === 'code-issued'" class="modal-overlay">
          <div class="modal-content success-modal">
            <div class="success-icon">🔑</div>
            <h2>Код авторизации выдан</h2>

            <div class="code-section">
              <label>Authorization Code:</label>
              <div class="code-block">
                <code>{{ botsStore.authCode }}</code>
                <Button variant="ghost" size="sm" @click="copyCode">
                  {{ copied ? '✓ Скопировано!' : 'Копировать' }}
                </Button>
              </div>
              <p class="code-hint">Действителен 10 минут</p>
            </div>

            <div class="install-details">
              <h4>Данные для бота:</h4>
              <div class="detail-row">
                <span>Client ID:</span>
                <code>{{ authResponse?.client_id }}</code>
              </div>
              <div class="detail-row">
                <span>Server ID:</span>
                <code>{{ selectedServer?.id }}</code>
              </div>
              <div class="detail-row">
                <span>Redirect URI:</span>
                <code>{{ authResponse?.redirect_uri }}</code>
              </div>
            </div>

            <div class="next-steps">
              <h4>Что дальше?</h4>
              <p>Бот должен обменять этот код на access token:</p>
              <pre>POST /oauth/token
{
  "grant_type": "authorization_code",
  "code": "{{ botsStore.authCode }}",
  "client_id": "{{ authResponse?.client_id }}",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "{{ authResponse?.redirect_uri }}"
}</pre>
            </div>

            <Button variant="primary" @click="finishInstall">Понятно</Button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBotsStore } from '@/stores/bots'
import { botsApi, type PublicBotDetail } from '@/api/bots'
import { useClipboard } from '@/composables/useClipboard'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import type { ServerForInstall } from "@/types"

const route = useRoute()
const authStore = useAuthStore()
const botsStore = useBotsStore()
const { copy, copied } = useClipboard()

const bot = ref<PublicBotDetail | null>(null)
const loading = ref(true)
const error = ref('')

// Исправленный тип - убран 'success', добавлен 'select-scopes' и 'code-issued'
const installStep = ref<'ready' | 'select-server' | 'select-scopes' | 'confirm' | 'code-issued'>('ready')
const selectedServer = ref<ServerForInstall | null>(null)
const selectedScopes = ref<string[]>([])
const authResponse = ref<{client_id: string, redirect_uri: string} | null>(null)

const botId = computed(() => route.params.id as string)
const isAuthenticated = computed(() => !!authStore.token)
const isOwner = computed(() => {
  return isAuthenticated.value && bot.value?.owner?.id === authStore.user?.id
})

const loadBot = async () => {
  loading.value = true
  error.value = ''
  const response = await botsApi.getPublicBotInfo(botId.value)
  if (response.error) {
    error.value = response.status === 404 ? 'Бот не найден или не публичный' : response.error
  } else {
    bot.value = response.data || null
  }
  loading.value = false
}

const redirectToLogin = () => {
  localStorage.setItem('redirect_after_login', window.location.href)
  window.location.href = `https://echotalk.ru/login?redirect=${encodeURIComponent(window.location.href)}`
}

const startInstall = async () => {
  if (!isAuthenticated.value) {
    redirectToLogin()
    return
  }
  installStep.value = 'select-server'
  await botsStore.fetchServersForInstall(botId.value)
}

const selectServer = (server: ServerForInstall) => {
  if (server.has_bot) return
  selectedServer.value = server
  // Инициализируем scopes - все включены по умолчанию
  selectedScopes.value = [...(bot.value?.scopes || [])]
  installStep.value = 'select-scopes'
}

const backToServers = () => {
  installStep.value = 'select-server'
  selectedServer.value = null
  selectedScopes.value = []
}

const toConfirm = () => {
  if (selectedScopes.value.length === 0) return
  installStep.value = 'confirm'
}

const backToScopes = () => {
  installStep.value = 'select-scopes'
}

const confirmInstall = async () => {
  if (!selectedServer.value || !bot.value || selectedScopes.value.length === 0) return

  const state = generateRandomState()

  // Исправлено: отправляем только bot_id, server_id, scopes, state
  const result = await botsStore.authorizeBotInstallation({
    bot_id: parseInt(botId.value),
    server_id: selectedServer.value.id,
    scopes: selectedScopes.value,
    state: state
  })

  if (result) {
    // Сохраняем ответ для отображения
    authResponse.value = {
      client_id: result.client_id,
      redirect_uri: result.redirect_uri
    }
    installStep.value = 'code-issued'
  }
}

const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const copyCode = () => {
  if (botsStore.authCode) {
    copy(botsStore.authCode)
  }
}

const finishInstall = () => {
  installStep.value = 'ready'
  selectedServer.value = null
  selectedScopes.value = []
  authResponse.value = null
  botsStore.clearAuthCode()
}

const cancelInstall = () => {
  installStep.value = 'ready'
  selectedServer.value = null
  selectedScopes.value = []
  botsStore.serversForInstall = []
}

const getScopeDescription = (scope: string) => {
  const descriptions: Record<string, string> = {
    'bot': 'Базовые функции бота',
    'messages:read': 'Читать сообщения в каналах',
    'messages:write': 'Отправлять сообщения',
    'members:read': 'Видеть список участников',
    'rooms:read': 'Просмотр комнат',
    'server:manage': 'Управление сервером'
  }
  return descriptions[scope] || scope
}

onMounted(() => {
  loadBot()
})
</script>

<style scoped>
/* ===== Основные стили страницы ===== */
.bot-public {
  min-height: 100vh;
  padding: 2rem 0;
  padding-top: calc(2rem + 80px); /* Отступ для фиксированного header (~80px) */
}

.container {
  max-width: 1200px;
  margin: auto auto;
  padding: 0 1rem;
}

/* ===== Loading & Error states ===== */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.error-state h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.error-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* ===== Bot Profile ===== */
.bot-profile {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ===== Hero Section ===== */
.bot-hero {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  align-items: flex-start;
  flex-wrap: wrap;
}

.bot-avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
}

.bot-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bot-info {
  flex: 1;
  min-width: 250px;
}

.bot-info h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

/* ===== Stats ===== */
.bot-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat .value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-primary);
}

.stat .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* ===== Owner Info ===== */
.owner-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.owner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
}

.owner img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

/* ===== Actions ===== */
.bot-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 200px;
}

/* ===== Scopes Section ===== */
.scopes-section {
  padding: 1.5rem;
}

.scopes-section h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.hint {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0 0 1.5rem 0;
}

.scopes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scope-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.scope-item:hover {
  border-color: var(--accent-primary);
  background: rgba(139, 92, 246, 0.05);
}

.scope-icon {
  width: 24px;
  height: 24px;
  background: var(--accent-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.scope-info {
  flex: 1;
}

.scope-info code {
  display: block;
  font-size: 0.875rem;
  color: var(--accent-primary);
  margin-bottom: 0.25rem;
  font-family: 'JetBrains Mono', monospace;
}

.scope-info p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* ===== Help Section ===== */
.help-section {
  padding: 1.5rem;
}

.help-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.help-section ol {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--text-secondary);
}

.help-section li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

/* ===== Modal Styles ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 100vh;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
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
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* ===== Install Modal Specific ===== */
.install-modal {
  max-width: 600px;
}

.install-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.install-subtitle strong {
  color: var(--text-primary);
}

/* ===== Servers List ===== */
.servers-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.server-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.server-card:hover:not(.disabled) {
  background: rgba(139, 92, 246, 0.1);
  border-color: var(--accent-primary);
  transform: translateX(4px);
}

.server-card.has-bot {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(34, 197, 94, 0.05);
}

.server-card.disabled {
  cursor: not-allowed;
}

.server-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  overflow: hidden;
}

.server-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.server-info {
  flex: 1;
}

.server-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.has-bot-badge {
  margin: 0;
  font-size: 0.75rem;
  color: #22c55e;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* ===== Empty State ===== */
.empty-servers {
  text-align: center;
  padding: 3rem 1.5rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-servers p {
  margin: 0 0 0.5rem 0;
  color: var(--text-secondary);
}

.empty-servers .hint {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

/* ===== Scopes Selection (NEW) ===== */
.scopes-selection {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.scope-toggle {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.scope-toggle:hover {
  border-color: var(--border-color);
}

.scope-toggle.disabled {
  opacity: 0.7;
  background: rgba(0, 0, 0, 0.1);
}

.scope-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  margin: 0;
}

.scope-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  accent-color: var(--accent-primary);
  cursor: pointer;
}

.scope-label input[type="checkbox"]:disabled {
  cursor: not-allowed;
}

.scope-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.scope-content code {
  font-size: 0.875rem;
  color: var(--accent-primary);
  font-family: 'JetBrains Mono', monospace;
}

.scope-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.scope-required {
  font-size: 0.75rem;
  color: var(--accent-primary);
  font-weight: 500;
}

/* ===== Scopes Warning ===== */
.scopes-warning {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.scopes-warning span {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.scopes-warning p {
  margin: 0;
  font-size: 0.875rem;
  color: #eab308;
  line-height: 1.5;
}

/* ===== Confirm Section ===== */
.confirm-info {
  text-align: center;
  padding: 1rem;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.confirm-info p {
  margin: 0;
  color: var(--text-secondary);
}

.confirm-info strong {
  color: var(--text-primary);
}

.scopes-confirm {
  margin-bottom: 1.5rem;
}

.scopes-confirm h4 {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.scopes-list-confirm {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.scopes-list-confirm li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.scopes-list-confirm li:last-child {
  border-bottom: none;
}

.scopes-list-confirm code {
  font-size: 0.75rem;
  color: var(--accent-primary);
  background: rgba(0, 0, 0, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}

.scopes-list-confirm span {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.scopes-note {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* ===== Success Modal ===== */
.success-modal {
  max-width: 600px;
  text-align: center;
  padding: 2rem;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-modal h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

/* ===== Code Section ===== */
.code-section {
  margin: 1.5rem 0;
  text-align: left;
}

.code-section label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.code-block {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

.code-block code {
  flex: 1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: var(--accent-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.code-hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

/* ===== Install Details ===== */
.install-details {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin: 1.5rem 0;
  text-align: left;
  border: 1px solid var(--border-color);
}

.install-details h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row span {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.detail-row code {
  font-size: 0.75rem;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--accent-primary);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}

/* ===== Next Steps ===== */
.next-steps {
  text-align: left;
  margin: 1.5rem 0;
}

.next-steps h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.next-steps p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.next-steps pre {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.75rem;
  overflow-x: auto;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.5;
}

/* ===== Modal Transitions ===== */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .bot-hero {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .bot-avatar-large {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }

  .bot-info h1 {
    font-size: 1.5rem;
  }

  .bot-stats {
    justify-content: center;
  }

  .owner-info {
    justify-content: center;
  }

  .bot-actions {
    width: 100%;
  }

  .modal-content {
    max-width: 100%;
    margin: 0.5rem;
  }
}
</style>
