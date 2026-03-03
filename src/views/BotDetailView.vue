<template>
  <div class="bot-detail">
    <ToastContainer />

    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <Button variant="ghost" @click="$router.back()" class="back-btn">
            ← Назад
          </Button>
          <div class="bot-title" v-if="bot">
            <div class="bot-avatar" :style="avatarStyle">
              {{ bot.name?.[0]?.toUpperCase() || '?' }}
            </div>
            <div class="bot-info">
              <h1>{{ bot.name }}</h1>
              <div class="bot-meta">
                <Badge :variant="bot.is_public ? 'success' : 'secondary'" size="sm">
                  {{ bot.is_public ? 'Публичный' : 'Приватный' }}
                </Badge>
                <Badge :variant="statusBadgeVariant" size="sm">
                  {{ statusLabel }}
                </Badge>
                <span class="bot-id">ID: {{ bot.id }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="header-actions" v-if="bot">
          <Button variant="secondary" @click="showEditModal = true">
            Редактировать
          </Button>
          <Button variant="primary" @click="showCreateCredential = true">
            + Новый Secret
          </Button>
          <Button
            v-if="bot.status === 'draft' || bot.status === 'inactive'"
            variant="success"
            :loading="isPublishing"
            @click="publishBot"
          >
            🚀 Опубликовать бота
          </Button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка информации о боте...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Ошибка загрузки</h3>
        <p>{{ error }}</p>
        <Button variant="primary" @click="loadBot">Повторить</Button>
      </div>

      <!-- Content -->
      <div v-else-if="bot" class="bot-content">
        <div class="content-grid">
          <!-- Left Column -->
          <div class="main-column">
            <!-- Credentials Section -->
            <Card class="section-card">
              <div class="section-header">
                <h2>🔐 Credentials</h2>
                <p class="section-desc">Client ID и Secret для OAuth авторизации</p>
              </div>

              <!-- Пустое состояние -->
              <div v-if="credentials.length === 0 && !freshlyCreatedSecret" class="empty-credentials">
                <p>Нет созданных credentials</p>
                <Button variant="primary" @click="showCreateCredential = true">
                  Создать первый Secret
                </Button>
              </div>

              <!-- Только что созданные (показываем один раз) -->
              <div v-else-if="freshlyCreatedSecret" class="fresh-secret-banner">
                <div class="secret-warning">
                  <strong>⚠️ Скопируйте эти данные сейчас!</strong>
                  <p>Они больше никогда не будут показаны.</p>
                </div>

                <!-- Client ID -->
                <CredentialCard
                  v-if="activeCredential"
                  title="Client ID"
                  :value="activeCredential.client_id"
                hint="Используйте этот ID в вашем приложении"
                />

                <!-- Client Secret -->
                <CredentialCard
                  title="Client Secret"
                  :value="freshlyCreatedSecret.client_secret"
                  :is-new="true"
                  show-reveal
                  hint="Скопируйте немедленно!"
                />

                <Button variant="secondary" @click="dismissFreshSecret">
                  Я сохранил credentials
                </Button>
              </div>

              <!-- Существующие credentials (после закрытия баннера) -->
              <div v-else class="credentials-list">
                <CredentialCard
                  v-if="activeCredential"
                  title="Client ID"
                  :value="activeCredential.client_id"
                  hint="Используйте этот ID в вашем приложении"
                />

                <div class="secret-placeholder">
                  <span>Client Secret скрыт для безопасности</span>
                  <Button variant="ghost" size="sm" @click="showCreateCredential = true">
                    Создать новый
                  </Button>
                </div>
              </div>
            </Card>

            <!-- OAuth Configuration -->
            <Card class="section-card">
              <div class="section-header">
                <h2>🔗 OAuth2 Configuration</h2>
                <p class="section-desc">Настройте URL для авторизации и callback</p>
              </div>

              <div class="oauth-section">
                <div class="redirect-urls">
                  <div class="redirect-header">
                    <label>Redirect URLs</label>
                    <Button variant="ghost" size="sm" @click="showAddRedirect = true">
                      + Добавить
                    </Button>
                  </div>

                  <div v-if="redirectUrls.length > 0" class="urls-list">
                    <div
                      v-for="(url, index) in redirectUrls"
                      :key="index"
                      class="url-item"
                    >
                      <span>{{ url }}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="delete-btn"
                        @click="removeRedirectUrl(index)"
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                  <div v-else class="empty-urls">
                    Нет настроенных redirect URLs
                  </div>
                </div>
              </div>
            </Card>

            <!-- Scopes & Events -->
            <Card class="section-card">
              <div class="section-header">
                <h2>⚡ Scopes & Events</h2>
                <p class="section-desc">Разрешения и события, доступные боту</p>
              </div>

              <div class="scopes-section">
                <div class="scopes-block">
                  <h4>Разрешенные Scopes</h4>
                  <div class="tags-list">
                    <Badge
                      v-for="scope in allowedScopes"
                      :key="scope"
                      variant="primary"
                      size="sm"
                    >
                      {{ scope }}
                    </Badge>
                    <span v-if="!allowedScopes.length" class="empty-tags">
                      Нет ограничений
                    </span>
                  </div>
                </div>

                <div class="events-block">
                  <h4>Разрешенные Events</h4>
                  <div class="tags-list">
                    <Badge
                      v-for="event in allowedEvents"
                      :key="event"
                      variant="secondary"
                      size="sm"
                    >
                      {{ event }}
                    </Badge>
                    <span v-if="!allowedEvents.length" class="empty-tags">
                      Нет ограничений
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- Right Column -->
          <div class="side-column">
            <!-- Installations -->
            <Card class="section-card">
              <div class="section-header">
                <h2>📦 Установки</h2>
                <p class="section-desc">Серверы, где установлен бот</p>
              </div>

              <div class="installations-list">
                <div v-if="installations.length > 0">
                  <InstallationCard
                    v-for="installation in installations"
                    :key="installation.id"
                    :installation="installation"
                    @revoke="handleRevokeInstallation"
                  />
                </div>
                <div v-else class="empty-installations">
                  <div class="empty-icon">📭</div>
                  <p>Бот еще не установлен ни на один сервер</p>
                  <p class="empty-hint">
                    Используйте OAuth flow для установки бота
                  </p>
                </div>
              </div>
            </Card>

            <!-- Quick Stats -->
            <Card class="section-card stats-card">
              <div class="quick-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ installations.length }}</span>
                  <span class="stat-label">Серверов</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ activeInstallations }}</span>
                  <span class="stat-label">Активных</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ credentials.length }}</span>
                  <span class="stat-label">Секретов</span>
                </div>
              </div>
            </Card>

            <!-- Danger Zone -->
            <Card class="section-card danger-card">
              <div class="section-header">
                <h2>🗑️ Опасная зона</h2>
              </div>
              <div class="danger-actions">
                <div class="danger-item">
                  <div>
                    <h4>Удалить бота</h4>
                    <p>Это действие нельзя отменить. Все данные будут удалены.</p>
                  </div>
                  <Button variant="error" @click="handleDeleteBot">
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EditBotModal
      :is-open="showEditModal"
      :bot="bot"
      :is-loading="isUpdating"
      @close="showEditModal = false"
      @submit="handleUpdateBot"
    />

    <AddRedirectModal
      :is-open="showAddRedirect"
      @close="showAddRedirect = false"
      @submit="handleAddRedirect"
    />

    <!-- Create Credential Confirmation -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateCredential" class="modal-overlay" @click.self="showCreateCredential = false">
          <div class="modal-content confirm-modal">
            <div class="modal-header">
              <h2>Создать новый Client Secret?</h2>
            </div>
            <div class="modal-body">
              <p>
                Создание нового секрета немедленно отзовет все существующие секреты.
                Все приложения, использующие старые секреты, перестанут работать.
              </p>
              <div class="modal-actions">
                <Button variant="ghost" @click="showCreateCredential = false">
                  Отмена
                </Button>
                <Button
                  variant="primary"
                  :loading="isCreatingCredential"
                  @click="handleCreateCredential"
                >
                  Подтвердить
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBotsStore } from '@/stores/bots'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import CredentialCard from '@/components/bots/CredentialCard.vue'
import InstallationCard from '@/components/bots/InstallationCard.vue'
import EditBotModal from '@/components/bots/EditBotModal.vue'
import AddRedirectModal from '@/components/bots/AddRedirectModal.vue'
import type { BotApp, BotCredential } from '@/types'
import type {BotInstallation} from "@/api/bots.ts";

const route = useRoute()
const router = useRouter()
const botsStore = useBotsStore()
const toastStore = useToastStore()

const botId = computed(() => route.params.id as string)
const statusBadgeVariant = computed(() => {
  switch (bot.value?.status) {
    case 'active': return 'success'
    case 'draft': return 'warning'
    case 'inactive': return 'secondary'
    case 'suspended': return 'error'
    default: return 'secondary'
  }
})

const statusLabel = computed(() => {
  switch (bot.value?.status) {
    case 'active': return bot.value?.is_public ? 'Публичный' : 'Активный'
    case 'draft': return 'Черновик'
    case 'inactive': return 'Неактивен'
    case 'suspended': return 'Приостановлен'
    default: return bot.value?.status
  }
})

// State
const bot = ref<BotApp | null>(null)
const installations = ref<BotInstallation[]>([])
const credentials = ref<BotCredential[]>([])
const redirectUrls = ref<string[]>([])
const isLoading = ref(true)
const isUpdating = ref(false)
const isCreatingCredential = ref(false)
const error = ref<string | null>(null)
const freshlyCreatedSecret = ref<{
  client_id: string,
  client_secret: string,
  createdAt: string
} | null>(null)
const isPublishing = ref(false)

// bot_1_xcnv9eqx
// j3tcKpvoL5Re_QSqHhsfurNsd8Qsiaiin0t-XsoRU1k=

// Modals
const showEditModal = ref(false)
const showAddRedirect = ref(false)
const showCreateCredential = ref(false)

// Computed
const avatarStyle = computed(() => {
  if (bot.value?.avatar_url) {
    return { backgroundImage: `url(${bot.value.avatar_url})`, backgroundSize: 'cover' }
  }
  return {}
})

const activeInstallations = computed(() => {
  return installations.value.filter(i => i.status === 'active').length
})

const allowedScopes = computed(() => {
  return bot.value?.scopes || []
})

const allowedEvents = computed(() => {
  return bot.value?.allowed_events || []
})

const activeCredential = computed(() => {
  return credentials.value.find(c => c.is_active) || null
})

// Methods
const loadBot = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Load bot details
    const botData = await botsStore.fetchBotDetails(botId.value)
    if (botData) {
      bot.value = botData
    } else {
      error.value = 'Бот не найден'
      return
    }

    // Load credentials
    const credsData = await botsStore.fetchBotCredentials(botId.value)
    credentials.value = credsData || []

    // Load installations
    const instData = await botsStore.fetchBotInstallations(botId.value)
    installations.value = instData || []

    redirectUrls.value = bot.value.redirect_uris || []
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки данных'
    toastStore.error('Не удалось загрузить данные бота')
  } finally {
    isLoading.value = false
  }
}

const handleUpdateBot = async (updates: Partial<BotApp>) => {
  isUpdating.value = true
  try {
    await botsStore.updateBot(botId.value, updates)
    bot.value = { ...bot.value!, ...updates }
    toastStore.success('Бот успешно обновлен')
    showEditModal.value = false
  } catch (err: any) {
    toastStore.error('Ошибка обновления: ' + err.message)
  } finally {
    isUpdating.value = false
  }
}

const handleCreateCredential = async () => {
  if (!confirm('Создать новый секрет? Старый перестанет работать.')) return

  isCreatingCredential.value = true
  try {
    // createCredential добавит в список новую запись (без секрета)
    const newCred = await botsStore.createCredential(botId.value, 'secret')

    // Сохраняем секрет отдельно, чтобы показать один раз
    freshlyCreatedSecret.value = {
      client_id: newCred.client_id,
      client_secret: newCred.client_secret,
      createdAt: newCred.created_at
    }

    await loadBot()

    toastStore.success('Новый Client Secret создан. Скопируйте его сейчас!')
    isCreatingCredential.value = false
  } catch (err: any) {
    toastStore.error('Ошибка создания секрета: ' + err.message)
  } finally {
    isCreatingCredential.value = false
  }
}

const handleRevokeInstallation = async (installationId: string) => {
  try {
    await botsStore.revokeInstallation(botId.value, installationId)
    installations.value = installations.value.filter(i => i.id !== installationId)
    toastStore.success('Доступ отозван')
  } catch (err: any) {
    toastStore.error('Ошибка отзыва доступа: ' + err.message)
  }
}

const handleAddRedirect = (url: string) => {
  redirectUrls.value.push(url)
  // TODO: API call to save
  toastStore.success('Redirect URL добавлен')
  showAddRedirect.value = false
}

const removeRedirectUrl = (index: number) => {
  redirectUrls.value.splice(index, 1)
  // TODO: API call to save
  toastStore.success('Redirect URL удален')
}

const handleDeleteBot = async () => {
  if (!confirm('Вы уверены? Это действие нельзя отменить. Бот будет удален навсегда.')) {
    return
  }

  try {
    await botsStore.deleteBot(botId.value)
    toastStore.success('Бот удален')
    router.push('/bots')
  } catch (err: any) {
    toastStore.error('Ошибка удаления: ' + err.message)
  }
}

const publishBot = async () => {
  if (!confirm('Опубликовать бота? Он станет доступен в каталоге публичных ботов.')) {
    return
  }

  isPublishing.value = true
  try {
    await botsStore.publishBot(botId.value)
    toastStore.success('Бот успешно опубликован и теперь виден в каталоге!')
  } catch (err: any) {
    toastStore.error('Ошибка публикации: ' + err.message)
  } finally {
    isPublishing.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU')
}

const dismissFreshSecret = () => {
  freshlyCreatedSecret.value = null
}

onMounted(() => {
  loadBot()
})
</script>

<style scoped>
.bot-detail {
  padding: 100px 0 60px;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.back-btn {
  padding: 0.5rem 1rem;
}

.bot-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bot-avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.bot-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  color: var(--text-primary);
}

.bot-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bot-id {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-family: monospace;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.section-card {
  margin-bottom: 1.5rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.section-desc {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Credentials */
.credentials-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-credentials {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

/* OAuth */
.oauth-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.oauth-url label,
.redirect-header label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.url-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.url-box code {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--text-primary);
  word-break: break-all;
}

.redirect-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.urls-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.url-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--glass);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.url-item span {
  font-size: 0.875rem;
  color: var(--text-primary);
  word-break: break-all;
}

.empty-urls {
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Scopes */
.scopes-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.scopes-block h4,
.events-block h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.empty-tags {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-style: italic;
}

/* Installations */
.empty-installations {
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-installations p {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.empty-hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Stats */
.stats-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
}

/* Danger Zone */
.danger-card {
  border-color: rgba(239, 68, 68, 0.3);
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.danger-item h4 {
  margin: 0 0 0.25rem 0;
  color: #ef4444;
  font-size: 0.875rem;
}

.danger-item p {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Loading & Error */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.error-state p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

/* Modal Styles */
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

.confirm-modal .modal-header {
  padding: 1.5rem 1.5rem 0;
}

.confirm-modal .modal-body {
  padding: 1rem 1.5rem 1.5rem;
}

.confirm-modal p {
  margin: 0 0 1.5rem 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
    justify-content: stretch;
  }

  .header-actions button {
    flex: 1;
  }

  .bot-title {
    flex-direction: column;
    text-align: center;
  }

  .danger-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
