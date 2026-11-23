<template>
  <div class="bot-public">
    <div class="container">
      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <h2 class="icon-heading"><AppIcon name="alert-triangle" :size="30" /> Бот не найден</h2>
        <p>{{ error }}</p>
        <Button variant="primary" @click="$router.push('/explore')"> К каталогу </Button>
      </div>

      <!-- Content -->
      <div v-else-if="bot" class="bot-profile">
        <!-- Hero -->
        <div class="bot-hero">
          <div class="bot-avatar-large">
            <img v-if="bot.avatar_url" :src="bot.avatar_url" :alt="bot.name" />
            <span v-else>{{ bot.name?.[0]?.toUpperCase() || 'B' }}</span>
          </div>

          <div class="bot-info">
            <h1>{{ bot.name }}</h1>
            <p class="description">{{ bot.description || 'Описание пока не добавлено' }}</p>

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
                <img v-if="bot.owner?.avatar_url" :src="bot.owner.avatar_url" alt="" />
                <span v-else>{{ bot.owner?.username?.[0]?.toUpperCase() || 'Р' }}</span>
                {{ bot.owner?.username }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="bot-actions">
            <Button v-if="!authReady" variant="primary" size="lg" disabled>
              Проверяем авторизацию...
            </Button>
            <Button
              v-else-if="isAuthenticated"
              variant="primary"
              size="lg"
              @click="startInstall"
              :disabled="serversLoading || botsStore.isInstalling"
            >
              Добавить на сервер
            </Button>
            <Button v-else variant="primary" size="lg" @click="redirectToLogin">
              Войти для установки
            </Button>

            <Button
              v-if="isOwner"
              variant="secondary"
              @click="$router.push(`/bots/${bot.id}/manage`)"
            >
              Управление
            </Button>
            <p v-if="!oauthStartRequest && bot.oauth_start_url" class="hint">Установка продолжится на сайте разработчика бота.</p>
            <p v-if="installLaunchError" class="install-oauth-error" role="alert">{{ installLaunchError }}</p>
          </div>
        </div>

        <!-- Extended description, rendered from sanitized Markdown, never raw HTML. -->
        <Card v-if="bot.readme_md?.trim()" class="readme-section">
          <h2 class="readme-title icon-heading"><AppIcon name="book-open" :size="24" /> О боте</h2>
          <BotMarkdown :source="bot.readme_md || ''" />
        </Card>

        <!-- Scopes -->
        <Card class="scopes-section">
          <h3 class="icon-heading"><AppIcon name="key-round" :size="24" /> Разрешения</h3>
          <p class="hint">Этот бот запрашивает следующие разрешения:</p>

          <div class="scopes-list">
            <div v-for="scope in bot.scopes || []" :key="scope" class="scope-item">
              <AppIcon name="check" class="scope-icon" :size="22" />
              <div class="scope-info">
                <strong>{{ scopeTitle({ name: scope, label: scope }) }}</strong>
                <code>{{ scope }}</code>
              </div>
            </div>
            <p v-if="!bot.scopes?.length" class="hint">Разрешения не указаны.</p>
          </div>
        </Card>

        <!-- How to use -->
        <Card class="help-section">
          <h3 class="icon-heading"><AppIcon name="book-open" :size="24" /> Как использовать</h3>
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
        <div
          v-if="installStep === 'select-server'"
          class="modal-overlay"
          @click.self="cancelInstall"
        >
          <div class="modal-content install-modal">
            <div class="modal-header">
              <h2>Выберите сервер</h2>
              <button class="modal-close" type="button" aria-label="Закрыть выбор сервера" @click="cancelInstall">
                <AppIcon name="x" :size="22" />
              </button>
            </div>

            <div class="modal-body">
              <p class="install-subtitle">
                Установка <strong>{{ bot?.name }}</strong>
              </p>

              <div v-if="serversLoading" class="loading-state" role="status">
                <div class="spinner"></div>
                <p>Загрузка серверов...</p>
              </div>

              <div v-else-if="serversError" class="empty-servers" role="alert">
                <AppIcon name="alert-triangle" class="empty-icon" :size="40" />
                <p>{{ serversError }}</p>
                <Button variant="secondary" @click="loadInstallServers">Повторить загрузку</Button>
              </div>

              <div v-else-if="botsStore.serversForInstall.length === 0" class="empty-servers">
                <AppIcon name="house" class="empty-icon" :size="40" />
                <p>У вас нет серверов где вы являетесь владельцем</p>
                <p class="hint">Создайте сервер в EchoTalk</p>
              </div>

              <div v-else class="servers-list">
                <button
                  v-for="server in botsStore.serversForInstall"
                  :key="server.id"
                  type="button"
                  class="server-card"
                  :class="{ 'has-bot': server.has_bot }"
                  :disabled="server.has_bot"
                  @click="selectServer(server)"
                >
                  <div class="server-avatar">
                    <img v-if="server.avatar_url" :src="server.avatar_url" alt="" />
                    <span v-else>{{ server.name?.[0]?.toUpperCase() || 'С' }}</span>
                  </div>
                  <div class="server-info">
                    <h4>{{ server.name }}</h4>
                    <p v-if="server.has_bot" class="has-bot-badge"><AppIcon name="check" :size="16" /> Уже установлен</p>
                    <p v-else class="server-select-hint">Выбрать сервер</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Модал выбора scopes (НОВЫЙ) -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="installStep === 'select-scopes'"
          class="modal-overlay"
          @click.self="backToServers"
        >
          <div class="modal-content install-modal">
            <div class="modal-header">
              <h2>Настройте разрешения</h2>
              <button class="modal-close" type="button" aria-label="Вернуться к выбору сервера" @click="backToServers">
                <AppIcon name="x" :size="22" />
              </button>
            </div>

            <div class="modal-body">
              <p class="install-subtitle">
                Выберите, какие функции бота <strong>{{ bot?.name }}</strong> будут разрешены на
                сервере <strong>{{ selectedServer?.name }}</strong>
              </p>

              <div class="scopes-selection">
                <div
                  v-for="scope in bot?.scopes"
                  :key="scope"
                  class="scope-toggle"
                  :class="{ disabled: scope === 'bot' }"
                >
                  <label class="scope-label">
                    <input
                      type="checkbox"
                      class="ui-checkbox"
                      :checked="selectedScopes.includes(scope)"
                      :disabled="scope === 'bot'"
                      @change="onScopeChange(scope, $event)"
                    />
                    <div class="scope-content">
                      <strong>{{ scopeTitle({ name: scope, label: scope }) }}</strong>
                      <code>{{ scope }}</code>
                      <span v-if="scope === 'bot'" class="scope-required">(обязательно)</span>
                    </div>
                  </label>
                </div>
              </div>

              <div class="scopes-warning" v-if="selectedScopes.length < (bot?.scopes?.length || 0)">
                <AppIcon name="alert-triangle" :size="22" />
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
                <h4>
                  Выданные разрешения ({{ selectedScopes.length }} из {{ bot?.scopes?.length }}):
                </h4>
                <ul class="scopes-list-confirm">
                  <li v-for="scope in selectedScopes" :key="scope">
                    <span>{{ scopeTitle({ name: scope, label: scope }) }}</span>
                    <code>{{ scope }}</code>
                  </li>
                </ul>
                <p v-if="selectedScopes.length < (bot?.scopes?.length || 0)" class="scopes-note">
                  Исключены:
                  {{ bot?.scopes?.filter((s) => !selectedScopes.includes(s)).map((s) => scopeTitle({ name: s, label: s })).join(', ') }}
                </p>
              </div>

              <p v-if="installAuthorizeError" class="install-oauth-error" role="alert">{{ installAuthorizeError }}</p>
              <div class="modal-actions">
                <Button variant="ghost" :disabled="botsStore.isInstalling" @click="backToScopes">Назад</Button>
                <Button variant="primary" :loading="botsStore.isInstalling" @click="confirmInstall">
                  Авторизовать
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBotsStore } from '@/stores/bots'
import { botsApi, type PublicBotDetail } from '@/api/bots'
import { parseOAuthStartRequest, isSafeBotOAuthURL, validateOAuthCallback } from '@/utils/botOAuthFlow'
import { scopeTitle, updateBotScopes } from '@/utils/botScopeCatalog'
import type { BotAvailableScope } from '@/api/bots'
import Button from '@/components/ui/Button.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import Card from '@/components/ui/Card.vue'
import BotMarkdown from '@/components/bots/BotMarkdown.vue'
import type { ServerForInstall } from '@/types'

const route = useRoute()
const authStore = useAuthStore()
const botsStore = useBotsStore()

const bot = ref<PublicBotDetail | null>(null)
const authReady = ref(false)
void authStore.initAuth().then(
  () => { authReady.value = true },
  () => { authReady.value = true },
)
const loading = ref(true)
const error = ref('')

const installStep = ref<'ready' | 'select-server' | 'select-scopes' | 'confirm'>('ready')
const selectedServer = ref<ServerForInstall | null>(null)
const selectedScopes = ref<string[]>([])
const installLaunchError = ref('')
const installAuthorizeError = ref('')
const serversLoading = ref(false)
const serversError = ref('')
// Стабильный набор разрешений из публичной карточки для зависимых scopes.
const installScopeCatalog = computed<BotAvailableScope[]>(() =>
  (bot.value?.scopes || []).map((name) => ({
    name,
    label: name,
    description: '',
    required: name === 'bot',
    assignable: true,
    group: 'installation',
  })),
)

const botId = computed(() => route.params.id as string)
const isAuthenticated = computed(() => !!authStore.token)
const isOwner = computed(() => {
  return isAuthenticated.value && bot.value?.owner?.id === authStore.user?.id
})

const loadBot = async () => {
  const requestedBotId = botId.value
  loading.value = true
  error.value = ''
  bot.value = null
  try {
    const response = await botsApi.getPublicBotInfo(requestedBotId)
    if (requestedBotId !== botId.value) return
    if (response.error) {
      error.value = response.status === 404 ? 'Бот не найден или не публичный' : response.error
    } else {
      bot.value = response.data || null
      if (!bot.value) error.value = 'Сервер не вернул данные бота'
    }
  } catch {
    if (requestedBotId === botId.value) error.value = 'Не удалось загрузить информацию о боте'
  } finally {
    if (requestedBotId === botId.value) loading.value = false
  }
}

const redirectToLogin = () => {
  localStorage.setItem('redirect_after_login', window.location.href)
  window.location.href = `https://echotalk.ru/login?redirect=${encodeURIComponent(window.location.href)}`
}

const loadInstallServers = async () => {
  serversLoading.value = true
  serversError.value = ''
  botsStore.error = null
  botsStore.serversForInstall = []
  try {
    await botsStore.fetchServersForInstall(botId.value)
    serversError.value = botsStore.error || ''
  } catch {
    serversError.value = 'Не удалось загрузить список серверов'
  } finally {
    serversLoading.value = false
  }
}

const oauthStartRequest = computed(() => parseOAuthStartRequest(route.query.state, route.query.redirect_uri))

const startInstall = async () => {
  installLaunchError.value = ''
  if (!isAuthenticated.value) {
    redirectToLogin()
    return
  }
  if (!oauthStartRequest.value) {
    // Marketplace installation must first visit the bot's backend so the client
    // can create an HttpOnly-cookie-bound state before returning to EchoTalk.
    if (route.query.state !== undefined || route.query.redirect_uri !== undefined) {
      installLaunchError.value = 'Неверные параметры начала OAuth. Повторите установку с сайта бота.'
      return
    }
    const startURL = bot.value?.oauth_start_url ?? ''
    if (!startURL || !isSafeBotOAuthURL(startURL)) {
      installLaunchError.value = 'Разработчик ещё не настроил OAuth Start URL для установки бота.'
      return
    }
    window.location.assign(startURL)
    return
  }
  installStep.value = 'select-server'
  await loadInstallServers()
}

const selectServer = (server: ServerForInstall) => {
  if (server.has_bot) return
  selectedServer.value = server
  // Инициализируем scopes - все включены по умолчанию
  selectedScopes.value = [...new Set(bot.value?.scopes || [])]
  installStep.value = 'select-scopes'
}

const onScopeChange = (name: string, event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  const allowed = new Set(bot.value?.scopes || [])
  selectedScopes.value = updateBotScopes(
    selectedScopes.value,
    name,
    checked,
    installScopeCatalog.value,
  ).filter((scope) => allowed.has(scope))
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
  installAuthorizeError.value = ''
  installStep.value = 'select-scopes'
}

const confirmInstall = async () => {
  if (botsStore.isInstalling || !selectedServer.value || !bot.value || !selectedScopes.value.length) return
  installAuthorizeError.value = ''
  const request = oauthStartRequest.value
  if (!request) {
    installAuthorizeError.value = 'OAuth-сессия не найдена. Начните установку заново.'
    return
  }
  const result = await botsStore.authorizeBotInstallation({
    bot_id: Number(botId.value),
    server_id: selectedServer.value.id,
    scopes: selectedScopes.value,
    state: request.state,
    redirect_uri: request.redirectUri,
  })
  if (!result) {
    installAuthorizeError.value = botsStore.error || 'Не удалось выполнить OAuth-авторизацию'
    return
  }
  try {
    const callback = validateOAuthCallback(result, request)
    // Browser top-level navigation (not fetch): bot backend receives GET code+state.
    window.location.assign(callback)
  } catch (err) {
    installAuthorizeError.value = err instanceof Error ? err.message : 'Недопустимый OAuth callback'
  }
}

const cancelInstall = () => {
  installStep.value = 'ready'
  selectedServer.value = null
  selectedScopes.value = []
  installAuthorizeError.value = ''
  serversError.value = ''
  botsStore.serversForInstall = []
}

watch(botId, () => {
  cancelInstall()
  loadBot()
}, { immediate: true })
</script>

<style scoped>
.icon-heading { display: inline-flex; align-items: center; gap: 10px; }
.icon-heading svg { color: var(--accent-primary); }
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
  to {
    transform: rotate(360deg);
  }
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
.readme-title { color: var(--text-primary); font-size: 1.25rem; margin: 0 0 1.25rem; }
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
  background: var(--bg-tertiary);
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
  background: var(--bg-secondary);
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
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.3rem;
  font-family: 'JetBrains Mono', monospace;
}

.scope-info strong { display: block; font-size: 0.925rem; color: var(--text-primary); }

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
  max-height: min(90dvh, 900px);
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
  max-height: calc(90dvh - 80px);
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
  width: 100%;
  text-align: left;
  color: var(--text-primary);
  font: inherit;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.server-card:hover:not(:disabled) {
  background: var(--bg-tertiary);
  border-color: var(--accent-primary);
}

.server-card.has-bot { opacity: 0.65; cursor: not-allowed; }
.server-card:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 3px; }
.server-select-hint { color: var(--text-secondary); font-size: 0.75rem; margin: 0; }

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
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.scope-toggle:hover {
  border-color: var(--border-color);
}

.scope-toggle.disabled { opacity: 0.85; }

.scope-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  margin: 0;
}

.scope-label input[type='checkbox'] {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  accent-color: var(--accent-primary);
  cursor: pointer;
}

.scope-label input[type='checkbox']:disabled {
  cursor: not-allowed;
}

.scope-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.scope-content strong { color: var(--text-primary); font-size: 0.95rem; }
.scope-content code {
  font-size: 0.75rem;
  color: var(--text-secondary);
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
  color: var(--text-primary);
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

@media (prefers-reduced-motion: reduce) {
  .server-card, .scope-toggle, .modal-enter-active, .modal-leave-active { transition: none; }
  .spinner { animation: none; }
}

</style>

<style scoped>
.install-oauth-error { color: var(--control-error, #e35d6a); border: 1px solid var(--control-error, #e35d6a); border-radius: var(--border-radius); padding: 0.75rem; margin: 1rem 0; font-size: 0.875rem; }
</style>
