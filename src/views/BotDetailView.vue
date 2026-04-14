<template>
  <div class="bot-detail">
    <ToastContainer />

    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <Button variant="ghost" @click="$router.back()" class="back-btn"> ← Назад </Button>
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
          <Button variant="secondary" @click="showEditModal = true"> Редактировать </Button>
          <Button variant="primary" @click="showCreateCredential = true"> + Новый Secret </Button>
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
              <div
                v-if="credentials.length === 0 && !freshlyCreatedSecret"
                class="empty-credentials"
              >
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
                    <div v-for="(url, index) in redirectUrls" :key="index" class="url-item">
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
                  <div v-else class="empty-urls">Нет настроенных redirect URLs</div>
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
                    <Badge v-for="scope in allowedScopes" :key="scope" variant="primary" size="sm">
                      {{ scope }}
                    </Badge>
                    <span v-if="!allowedScopes.length" class="empty-tags"> Нет ограничений </span>
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
                    <span v-if="!allowedEvents.length" class="empty-tags"> Нет ограничений </span>
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
                  <p class="empty-hint">Используйте OAuth flow для установки бота</p>
                </div>
              </div>
            </Card>

            <Card v-if="installations.length > 0" class="section-card">
              <div class="section-header">
                <h2>🪝 Webhook Delivery</h2>
                <p class="section-desc">
                  Настройка webhook и история доставок по конкретной установке
                </p>
              </div>

              <div class="test-runtime-section">
                <div class="form-group">
                  <label>Установка</label>
                  <select
                    v-model="selectedWebhookInstallationId"
                    class="form-select"
                    @change="handleSelectWebhookInstallation"
                  >
                    <option value="">Выберите установку</option>
                    <option
                      v-for="installation in activeInstallationsList"
                      :key="installation.id"
                      :value="String(installation.id)"
                    >
                      #{{ installation.id }} —
                      {{ installation.server_name || `Server ${installation.server_id}` }}
                    </option>
                  </select>
                </div>

                <div v-if="selectedWebhookInstallation">
                  <div v-if="isLoadingWebhook" class="empty-installations">
                    <p>Загрузка webhook конфигурации...</p>
                  </div>

                  <template v-else>
                    <div class="form-group">
                      <label class="checkbox-line">
                        <input v-model="webhookForm.enabled" type="checkbox" />
                        <span>Включить webhook доставку</span>
                      </label>
                    </div>

                    <div class="form-group">
                      <label>Webhook URL</label>
                      <input
                        v-model.trim="webhookForm.webhook_url"
                        class="form-input"
                        type="text"
                        placeholder="https://your-bot.example.com/webhook"
                      />
                    </div>

                    <div class="form-group">
                      <label>События</label>
                      <div class="webhook-events-list">
                        <label
                          v-for="eventName in availableWebhookEvents"
                          :key="eventName"
                          class="checkbox-line"
                        >
                          <input
                            v-model="webhookForm.subscribed_events"
                            type="checkbox"
                            :value="eventName"
                          />
                          <span>{{ eventName }}</span>
                        </label>
                      </div>
                    </div>

                    <div class="test-actions">
                      <Button
                        variant="primary"
                        :loading="isSavingWebhook"
                        @click="handleSaveWebhook"
                      >
                        Сохранить webhook
                      </Button>

                      <Button
                        variant="secondary"
                        :loading="isRotatingWebhookSecret"
                        @click="handleRotateWebhookSecret"
                      >
                        Rotate Secret
                      </Button>

                      <Button
                        variant="ghost"
                        :loading="isLoadingDeliveries"
                        @click="loadInstallationDeliveries"
                      >
                        Обновить доставки
                      </Button>
                    </div>

                    <div v-if="revealedWebhookSecret" class="fresh-secret-banner">
                      <div class="secret-warning">
                        <strong>⚠️ Скопируйте webhook secret сейчас!</strong>
                        <p>Он показывается только один раз.</p>
                      </div>

                      <CredentialCard
                        title="Webhook Secret"
                        :value="revealedWebhookSecret"
                        :is-new="true"
                        show-reveal
                        hint="Используйте его для проверки X-EchoTalk-Signature"
                      />

                      <Button variant="secondary" @click="revealedWebhookSecret = null">
                        Я сохранил secret
                      </Button>
                    </div>

                    <div v-if="installationWebhook" class="field-hint">
                      <div>
                        Последняя ошибка:
                        <strong>{{ installationWebhook.last_delivery_error || 'нет' }}</strong>
                      </div>
                      <div>
                        Последняя доставка:
                        <strong>{{ installationWebhook.last_delivery_at || '—' }}</strong>
                      </div>
                    </div>

                    <div class="deliveries-block">
                      <h4>Последние доставки</h4>

                      <div v-if="isLoadingDeliveries" class="empty-urls">Загрузка доставок...</div>

                      <div v-else-if="installationDeliveries.length === 0" class="empty-urls">
                        Пока нет доставок
                      </div>

                      <div v-else class="deliveries-list">
                        <div
                          v-for="delivery in installationDeliveries"
                          :key="delivery.id"
                          class="delivery-item"
                        >
                          <div class="delivery-top">
                            <strong>{{ delivery.event_type }}</strong>
                            <Badge
                              :variant="
                                delivery.status === 'success'
                                  ? 'success'
                                  : delivery.status === 'failed'
                                    ? 'error'
                                    : 'warning'
                              "
                              size="sm"
                            >
                              {{ delivery.status }}
                            </Badge>
                          </div>

                          <div class="delivery-meta">
                            <span
                              >attempts: {{ delivery.attempt_count }}/{{
                                delivery.max_attempts
                              }}</span
                            >
                            <span>HTTP: {{ delivery.last_response_code ?? '—' }}</span>
                          </div>

                          <div v-if="delivery.last_error" class="delivery-error">
                            {{ delivery.last_error }}
                          </div>

                          <div class="delivery-dates">
                            <span>created: {{ delivery.created_at }}</span>
                            <span>next: {{ delivery.next_attempt_at }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </Card>

            <Card v-if="installations.length > 0" class="section-card">
              <div class="section-header">
                <h2>🧪 Bot Runtime Test</h2>
                <p class="section-desc">Тестовая отправка сообщения от имени установленного бота</p>
              </div>

              <div class="test-runtime-section">
                <div class="form-group">
                  <label>Установка</label>
                  <select
                    v-model="selectedInstallationId"
                    class="form-select"
                    @change="((selectedRoomId = ''), (testRooms = []))"
                  >
                    <option value="">Выберите установку</option>
                    <option
                      v-for="installation in activeInstallationsList"
                      :key="installation.id"
                      :value="String(installation.id)"
                    >
                      #{{ installation.id }} —
                      {{ installation.server_name || `Server ${installation.server_id}` }}
                    </option>
                  </select>
                </div>
                <div class="test-actions">
                  <Button
                    variant="secondary"
                    :loading="isLoadingTestRooms"
                    :disabled="!selectedInstallationId || !testBotToken"
                    @click="loadTestRooms"
                  >
                    Загрузить комнаты
                  </Button>

                  <Button
                    variant="secondary"
                    :loading="isRefreshingToken"
                    :disabled="!canRefreshToken"
                    @click="refreshToken"
                  >
                    Обновить токен
                  </Button>
                </div>
                <Button variant="secondary" @click="refreshToken"> Обновить токен </Button>
                <div class="form-group">
                  <label>Bot Access Token</label>
                  <textarea
                    v-model.trim="testBotToken"
                    class="form-textarea"
                    rows="3"
                    placeholder="Вставьте access token бота"
                  />
                  <p class="field-hint">
                    Токен хранится только в памяти страницы и не сохраняется.
                  </p>
                </div>

                <div class="form-group">
                  <label>Refresh Token</label>
                  <textarea
                    v-model.trim="testRefreshToken"
                    class="form-textarea"
                    rows="3"
                    placeholder="Вставьте refresh token бота"
                  />
                </div>

                <div class="form-group">
                  <label>Client ID</label>
                  <input
                    v-model.trim="testClientId"
                    class="form-input"
                    type="text"
                    placeholder="Введите client_id"
                  />
                </div>

                <div class="form-group">
                  <label>Client Secret</label>
                  <input
                    v-model.trim="testClientSecret"
                    class="form-input"
                    type="text"
                    placeholder="Введите client_secret"
                  />
                </div>

                <div class="form-group">
                  <label>Комната</label>
                  <select
                    v-model="selectedRoomId"
                    class="form-select"
                    :disabled="!selectedInstallationId || isLoadingTestRooms"
                  >
                    <option value="">Выберите комнату</option>
                    <option v-for="room in testRooms" :key="room.id" :value="String(room.id)">
                      {{ room.name }} (ID: {{ room.id }})
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Сообщение</label>
                  <textarea
                    v-model.trim="testMessage"
                    class="form-textarea"
                    rows="4"
                    placeholder="Введите тестовое сообщение"
                  />
                </div>

                <div class="test-actions">
                  <Button
                    variant="primary"
                    :loading="isSendingTestMessage"
                    :disabled="!canSendTestMessage"
                    @click="sendTestMessage"
                  >
                    Отправить тестовое сообщение
                  </Button>
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
                  <Button variant="error" @click="handleDeleteBot"> Удалить </Button>
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
        <div
          v-if="showCreateCredential"
          class="modal-overlay"
          @click.self="showCreateCredential = false"
        >
          <div class="modal-content confirm-modal">
            <div class="modal-header">
              <h2>Создать новый Client Secret?</h2>
            </div>
            <div class="modal-body">
              <p>
                Создание нового секрета немедленно отзовет все существующие секреты. Все приложения,
                использующие старые секреты, перестанут работать.
              </p>
              <div class="modal-actions">
                <Button variant="ghost" @click="showCreateCredential = false"> Отмена </Button>
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
import { type BotInstallation, botsApi } from '@/api/bots.ts'

const route = useRoute()
const router = useRouter()
const botsStore = useBotsStore()
const toastStore = useToastStore()

type BotRuntimeRoom = {
  id: number
  name: string
  type: string
  server_id: number
  category_id?: number | null
  position?: number
  is_dialog?: boolean
}

const selectedInstallationId = ref<string>('')
const selectedRoomId = ref<string>('')
const testBotToken = ref('')
const testMessage = ref('')
const testRooms = ref<BotRuntimeRoom[]>([])
const isLoadingTestRooms = ref(false)
const isSendingTestMessage = ref(false)

const testRefreshToken = ref('')
const testClientId = ref('')
const testClientSecret = ref('')
const isRefreshingToken = ref(false)

const selectedWebhookInstallationId = ref<string>('')
const installationWebhook = ref<InstallationWebhookConfig | null>(null)
const installationDeliveries = ref<BotEventDelivery[]>([])
const isLoadingWebhook = ref(false)
const isSavingWebhook = ref(false)
const isRotatingWebhookSecret = ref(false)
const isLoadingDeliveries = ref(false)
const revealedWebhookSecret = ref<string | null>(null)

const webhookForm = ref({
  enabled: false,
  webhook_url: '',
  subscribed_events: [] as string[],
})

const availableWebhookEvents = ['message.created', 'message.updated', 'message.deleted']

const selectedWebhookInstallation = computed(() => {
  return (
    installations.value.find((i) => String(i.id) === String(selectedWebhookInstallationId.value)) ||
    null
  )
})

const canRefreshToken = computed(() => {
  return !!testRefreshToken.value && !!testClientId.value && !!testClientSecret.value
})

const activeInstallationsList = computed(() => {
  return installations.value.filter((i) => i.status === 'active')
})

const selectedInstallation = computed(() => {
  return (
    activeInstallationsList.value.find(
      (i) => String(i.id) === String(selectedInstallationId.value),
    ) || null
  )
})

const canSendTestMessage = computed(() => {
  return (
    !!selectedInstallation.value &&
    !!selectedRoomId.value &&
    !!testBotToken.value &&
    !!testMessage.value
  )
})

const botId = computed(() => route.params.id as string)
const statusBadgeVariant = computed(() => {
  switch (bot.value?.status) {
    case 'active':
      return 'success'
    case 'draft':
      return 'warning'
    case 'inactive':
      return 'secondary'
    case 'suspended':
      return 'error'
    default:
      return 'secondary'
  }
})

const statusLabel = computed(() => {
  switch (bot.value?.status) {
    case 'active':
      return bot.value?.is_public ? 'Публичный' : 'Активный'
    case 'draft':
      return 'Черновик'
    case 'inactive':
      return 'Неактивен'
    case 'suspended':
      return 'Приостановлен'
    default:
      return bot.value?.status
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
  client_id: string
  client_secret: string
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
  return installations.value.filter((i) => i.status === 'active').length
})

const allowedScopes = computed(() => {
  return bot.value?.scopes || []
})

const allowedEvents = computed(() => {
  return bot.value?.allowed_events || []
})

const activeCredential = computed(() => {
  return credentials.value.find((c) => c.is_active) || null
})

// Methods
const loadInstallationWebhook = async () => {
  if (!selectedWebhookInstallationId.value) {
    installationWebhook.value = null
    installationDeliveries.value = []
    webhookForm.value = {
      enabled: false,
      webhook_url: '',
      subscribed_events: [],
    }
    return
  }

  isLoadingWebhook.value = true
  try {
    const data = await botsStore.fetchInstallationWebhook(selectedWebhookInstallationId.value)
    installationWebhook.value = data

    webhookForm.value = {
      enabled: !!data?.enabled,
      webhook_url: data?.webhook_url || '',
      subscribed_events: Array.isArray(data?.subscribed_events) ? [...data.subscribed_events] : [],
    }
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось загрузить webhook конфигурацию')
  } finally {
    isLoadingWebhook.value = false
  }
}

const loadInstallationDeliveries = async () => {
  if (!selectedWebhookInstallationId.value) {
    installationDeliveries.value = []
    return
  }

  isLoadingDeliveries.value = true
  try {
    const rows = await botsStore.fetchInstallationDeliveries(
      selectedWebhookInstallationId.value,
      20,
    )
    installationDeliveries.value = rows || []
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось загрузить доставки')
  } finally {
    isLoadingDeliveries.value = false
  }
}

const handleSelectWebhookInstallation = async () => {
  revealedWebhookSecret.value = null
  await loadInstallationWebhook()
  await loadInstallationDeliveries()
}

const handleSaveWebhook = async () => {
  if (!selectedWebhookInstallationId.value) {
    toastStore.error('Сначала выберите установку')
    return
  }

  isSavingWebhook.value = true
  try {
    await botsStore.updateInstallationWebhook(selectedWebhookInstallationId.value, {
      enabled: webhookForm.value.enabled,
      webhook_url: webhookForm.value.webhook_url,
      subscribed_events: webhookForm.value.subscribed_events,
    })

    await loadInstallationWebhook()
    await loadInstallationDeliveries()
    toastStore.success('Webhook конфигурация сохранена')
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось сохранить webhook конфигурацию')
  } finally {
    isSavingWebhook.value = false
  }
}

const handleRotateWebhookSecret = async () => {
  if (!selectedWebhookInstallationId.value) {
    toastStore.error('Сначала выберите установку')
    return
  }

  if (!confirm('Сгенерировать новый webhook secret? Старый перестанет работать.')) {
    return
  }

  isRotatingWebhookSecret.value = true
  try {
    const secret = await botsStore.rotateInstallationWebhookSecret(
      selectedWebhookInstallationId.value,
    )
    revealedWebhookSecret.value = secret || null
    toastStore.success('Новый webhook secret сгенерирован')
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось ротировать webhook secret')
  } finally {
    isRotatingWebhookSecret.value = false
  }
}

const refreshToken = async () => {
  if (!testRefreshToken.value) {
    toastStore.error('Введите refresh token')
    return
  }

  if (!testClientId.value) {
    toastStore.error('Введите client_id')
    return
  }

  if (!testClientSecret.value) {
    toastStore.error('Введите client_secret')
    return
  }

  isRefreshingToken.value = true

  try {
    const response = await botsApi.refreshBotToken({
      grant_type: 'refresh_token',
      refresh_token: testRefreshToken.value,
      client_id: testClientId.value,
      client_secret: testClientSecret.value,
    })

    testBotToken.value = response.access_token

    if (response.refresh_token) {
      testRefreshToken.value = response.refresh_token
    }

    toastStore.success('Токен успешно обновлен')
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось обновить токен')
  } finally {
    isRefreshingToken.value = false
  }
}

const loadTestRooms = async () => {
  if (!selectedInstallation.value) return
  if (!testBotToken.value) {
    toastStore.error('Сначала вставьте bot access token')
    return
  }

  isLoadingTestRooms.value = true
  try {
    const serverId = selectedInstallation.value.server_id
    const data = await botsApi.botRooms(testBotToken.value, serverId)
    testRooms.value = data.data || []
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось загрузить комнаты')
  } finally {
    isLoadingTestRooms.value = false
  }
}

const sendTestMessage = async () => {
  if (!selectedInstallation.value) {
    toastStore.error('Выберите установку')
    return
  }

  if (!selectedRoomId.value) {
    toastStore.error('Выберите комнату')
    return
  }

  if (!testBotToken.value) {
    toastStore.error('Введите bot access token')
    return
  }

  if (!testMessage.value) {
    toastStore.error('Введите сообщение')
    return
  }

  isSendingTestMessage.value = true

  try {
    await botsApi.botSendMessage(testBotToken.value, selectedRoomId.value, testMessage.value)

    toastStore.success('Тестовое сообщение успешно отправлено')
    testMessage.value = ''
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось отправить сообщение')
  } finally {
    isSendingTestMessage.value = false
  }
}

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

    if (!selectedWebhookInstallationId.value) {
      const firstActiveInstallation = (instData || []).find((i) => i.status === 'active')
      if (firstActiveInstallation) {
        selectedWebhookInstallationId.value = String(firstActiveInstallation.id)
        await loadInstallationWebhook()
        await loadInstallationDeliveries()
      }
    }

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
      createdAt: newCred.created_at,
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
    await botsStore.revokeInstallation(installationId)
    installations.value = installations.value.filter((i) => i.id !== installationId)
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
.test-runtime-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
}

.form-select,
.form-textarea {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
}

.form-textarea {
  resize: vertical;
  min-height: 90px;
}

.field-hint {
  font-size: 12px;
  color: #6b7280;
}

.test-actions {
  display: flex;
  justify-content: flex-start;
}

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
  to {
    transform: rotate(360deg);
  }
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

.form-input {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
}

.checkbox-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.webhook-events-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.deliveries-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deliveries-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.delivery-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}

.delivery-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.delivery-meta {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 13px;
  color: #6b7280;
}

.delivery-error {
  margin-top: 8px;
  color: #b91c1c;
  font-size: 13px;
  word-break: break-word;
}

.delivery-dates {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}
</style>
