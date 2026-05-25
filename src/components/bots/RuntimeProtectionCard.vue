<template>
  <div class="runtime-protection-card">
    <div class="runtime-protection-header">
      <div>
        <h4>Runtime Protection</h4>
        <p>Rate limiting, burst protection и auto-block для выбранной установки</p>
      </div>

      <Button variant="ghost" size="sm" :loading="loading" @click="load"> Обновить </Button>
    </div>

    <div v-if="error" class="runtime-error">
      {{ error }}
    </div>

    <div v-else-if="limits" class="runtime-grid">
      <div class="runtime-row">
        <span>Статус защиты</span>
        <Badge :variant="statusBadgeVariant" size="sm">
          {{ humanStatus }}
        </Badge>
      </div>

      <div class="runtime-row">
        <span>Нарушений в текущем окне</span>
        <strong
          >{{ stats?.violation_count ?? 0 }} /
          {{ stats?.violation_limit ?? limits.violation_limit ?? 0 }}</strong
        >
      </div>

      <div class="runtime-row">
        <span>Окно нарушений</span>
        <strong>{{ stats?.violation_window_sec ?? limits.violation_window_sec ?? 0 }} сек.</strong>
      </div>

      <div class="runtime-row">
        <span>Сброс окна нарушений</span>
        <strong>{{ formatDate(stats?.violation_reset_at) }}</strong>
      </div>

      <div class="runtime-row">
        <span>Повторить запрос через</span>
        <strong>{{ stats?.retry_after_sec ?? 0 }} сек.</strong>
      </div>

      <div class="runtime-row">
        <span>Причина блокировки</span>
        <strong>{{ stats?.block_reason || limits.block_reason || '—' }}</strong>
      </div>

      <div class="runtime-row">
        <span>Блокировка действует до</span>
        <strong>{{ formatDate(stats?.blocked_until || limits.blocked_until) }}</strong>
      </div>

      <div class="runtime-row">
        <span>Запросов в минуту</span>
        <strong>{{ limits.requests_per_minute ?? 0 }}</strong>
      </div>

      <div class="runtime-row">
        <span>Сообщений в минуту</span>
        <strong>{{ limits.messages_per_minute ?? 0 }}</strong>
      </div>

      <div class="runtime-row">
        <span>Взаимодействий в минуту</span>
        <strong>{{ limits.interactions_per_minute ?? 0 }}</strong>
      </div>

      <div class="runtime-row">
        <span>Создание gateway-сессий в минуту</span>
        <strong>{{ limits.gateway_sessions_per_minute ?? 0 }}</strong>
      </div>

      <div class="runtime-row">
        <span>WebSocket-подключений в минуту</span>
        <strong>{{ limits.gateway_connections_per_minute ?? 0 }}</strong>
      </div>

      <div class="runtime-row">
        <span>Быстрая отправка сообщений</span>
        <strong
          >{{ limits.burst_messages_limit ?? 0 }} /
          {{ limits.burst_messages_window_sec ?? 0 }} сек.</strong
        >
      </div>

      <div class="runtime-row">
        <span>Быстрые interaction-запросы</span>
        <strong
          >{{ limits.burst_interactions_limit ?? 0 }} /
          {{ limits.burst_interactions_window_sec ?? 0 }} сек.</strong
        >
      </div>

      <div class="runtime-row">
        <span>Длительность автоматической блокировки</span>
        <strong>{{ limits.auto_block_duration_sec ?? 0 }} сек.</strong>
      </div>

      <div class="runtime-note">
        <span>Примечание</span>
        <code
          >Лимиты доступны только для диагностики. Ручная разблокировка владельцем бота
          недоступна.</code
        >
      </div>
    </div>

    <div v-else class="empty-urls">Runtime Protection пока не настроен</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { botsApi, type BotRuntimeProtectionStats, type BotRuntimeLimits } from '@/api/bots'

const props = defineProps<{
  installationId: number | string
}>()

const loading = ref(false)
const error = ref('')
const limits = ref<BotRuntimeLimits | null>(null)
const stats = ref<BotRuntimeProtectionStats | null>(null)

const humanStatus = computed(() => {
  if (stats.value?.blocked) return 'Заблокирован'
  if (limits.value && !limits.value.enabled) return 'Отключено'
  return 'Активно'
})

const statusBadgeVariant = computed(() => {
  if (stats.value?.blocked) return 'danger'
  if (limits.value && !limits.value.enabled) return 'secondary'
  return 'success'
})

const unwrapData = <T,>(response: any): T => {
  return response?.data?.data ?? response?.data ?? response
}

const load = async () => {
  if (!props.installationId) return

  loading.value = true
  error.value = ''

  try {
    const [limitsResponse, statsResponse] = await Promise.all([
      botsApi.getInstallationRuntimeLimits(props.installationId),
      botsApi.getInstallationRuntimeProtectionStats(props.installationId),
    ])

    limits.value = unwrapData<BotRuntimeLimit>(limitsResponse)
    stats.value = unwrapData<BotRuntimeProtectionStats>(statsResponse)
  } catch (err: any) {
    error.value =
      err?.response?.data?.error || err?.message || 'Не удалось загрузить Runtime Protection'
  } finally {
    loading.value = false
  }
}

const formatDate = (value?: string | null) => {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString()
}

watch(
  () => props.installationId,
  () => {
    limits.value = null
    stats.value = null
    load()
  },
)

onMounted(load)
</script>

<style scoped>
.runtime-protection-card {
  margin-top: 16px;
  border: 1px solid var(--border-color);
  background: var(--glass);
  border-radius: 14px;
  padding: 16px;
}

.gateway-status-card {
  margin-top: 16px;
  border: 1px solid var(--border-color);
  background: var(--glass);
  border-radius: 14px;
  padding: 16px;
}

.runtime-protection-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.runtime-protection-header h4 {
  margin: 0 0 4px;
  color: var(--text-primary);
}

.runtime-protection-header p {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.runtime-grid {
  display: grid;
  gap: 10px;
}

.runtime-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
}

.runtime-row span,
.runtime-note span {
  color: var(--text-secondary);
}

.runtime-row strong {
  color: var(--text-primary);
  font-weight: 600;
  text-align: right;
}

.runtime-note {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.runtime-note code {
  display: block;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.18);
  color: var(--text-primary);
  font-size: 12px;
  word-break: break-word;
  white-space: pre-wrap;
}

.runtime-error {
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
}

.empty-urls {
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 640px) {
  .runtime-protection-header {
    flex-direction: column;
    align-items: stretch;
  }

  .runtime-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .runtime-row strong {
    text-align: left;
  }
}
</style>
