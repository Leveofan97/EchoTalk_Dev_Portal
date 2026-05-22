<template>
  <div class="gateway-status-card">
    <div class="gateway-status-header">
      <div>
        <h4>Gateway Status</h4>
        <p>Диагностика WebSocket Gateway для выбранной установки</p>
      </div>

      <Button variant="ghost" size="sm" :loading="loading" @click="load"> Обновить </Button>
    </div>

    <div v-if="error" class="gateway-error">
      {{ error }}
    </div>

    <div v-else-if="status" class="gateway-grid">
      <div class="gateway-row">
        <span>Статус подключения</span>
        <Badge :variant="statusBadgeVariant" size="sm">
          {{ humanStatus }}
        </Badge>
      </div>

      <div class="gateway-row">
        <span>Событий в очереди</span>
        <strong>{{ status.backlog_count ?? 0 }}</strong>
      </div>

      <div class="gateway-row">
        <span>Последнее отправленное событие</span>
        <strong>#{{ status.last_issued_seq ?? 0 }}</strong>
      </div>

      <div class="gateway-row">
        <span>Последнее подтверждённое событие</span>
        <strong>#{{ status.last_acked_seq ?? 0 }}</strong>
      </div>

      <div class="gateway-row">
        <span>Последняя активность</span>
        <strong>{{ formatDate(status.last_seen_at) }}</strong>
      </div>

      <div class="gateway-row">
        <span>Последнее подтверждение доставки</span>
        <strong>{{ formatDate(status.last_acked_at) }}</strong>
      </div>

      <div class="gateway-row">
        <span>Подключение установлено</span>
        <strong>{{ formatDate(status.last_connected_at) }}</strong>
      </div>

      <div class="gateway-row">
        <span>Последний раз отключался</span>
        <strong>{{ formatDate(status.last_disconnected_at) }}</strong>
      </div>

      <div class="gateway-connection-id">
        <span>ID подключения Gateway</span>
        <code>{{ status.last_connection_id || '—' }}</code>
      </div>
    </div>

    <div v-else class="empty-urls">Gateway state пока отсутствует</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { botsApi, type InstallationGatewayStatus } from '@/api/bots'

const props = defineProps<{
  installationId: number
}>()

const status = ref<InstallationGatewayStatus | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const statusBadgeVariant = computed(() => {
  switch (status.value?.status) {
    case 'connected':
      return 'success'
    case 'disconnected':
      return 'warning'
    default:
      return 'secondary'
  }
})

const humanStatus = computed(() => {
  switch (status.value?.status) {
    case 'connected':
      return 'Подключен'

    case 'disconnected':
      return 'Отключен'

    default:
      return 'Нет подключения'
  }
})

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

const load = async () => {
  if (!props.installationId) return

  loading.value = true
  error.value = null

  try {
    const response = await botsApi.getInstallationGatewayStatus(props.installationId)

    status.value = response?.data ?? response
  } catch (err: any) {
    error.value = err.message || 'Не удалось загрузить Gateway Status'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.installationId,
  () => load(),
)

onMounted(load)
</script>

<style scoped>
.gateway-status-card {
  margin-top: 16px;
  border: 1px solid var(--border-color);
  background: var(--glass);
  border-radius: 14px;
  padding: 16px;
}

.gateway-status-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.gateway-status-header h4 {
  margin: 0 0 4px;
  color: var(--text-primary);
}

.gateway-status-header p {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.gateway-grid {
  display: grid;
  gap: 10px;
}

.gateway-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
}

.gateway-row span,
.gateway-connection-id span {
  color: var(--text-secondary);
}

.gateway-row strong {
  color: var(--text-primary);
  font-weight: 600;
}

.gateway-connection-id {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.gateway-connection-id code {
  display: block;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.18);
  color: var(--text-primary);
  font-size: 12px;
  word-break: break-all;
}

.gateway-error {
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
}
</style>
