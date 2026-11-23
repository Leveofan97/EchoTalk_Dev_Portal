<template>
  <section class="diagnostic-card" :aria-busy="loading">
    <header class="diagnostic-header">
      <div class="diagnostic-heading">
        <span class="diagnostic-heading-icon"><AppIcon name="radio-tower" :size="22" /></span>
        <div>
          <h3>WebSocket Gateway</h3>
          <p>Соединение и подтверждение доставки событий ботом</p>
        </div>
      </div>
      <Button variant="secondary" size="sm" :loading="loading" @click="load">Обновить</Button>
    </header>

    <div v-if="loading && !status" class="diagnostic-empty" role="status">Загружаем состояние Gateway…</div>
    <div v-if="error" class="diagnostic-error" role="alert">
      <span>{{ error }}</span>
      <Button variant="secondary" size="sm" :disabled="loading" @click="load">Повторить</Button>
    </div>

    <template v-if="status">
      <div class="diagnostic-summary">
        <Badge :variant="statusBadgeVariant">{{ gatewayConnectionLabel(status.status) }}</Badge>
        <span v-if="!transportActive">Сейчас выбран другой способ доставки — отсутствие Gateway-подключения нормально.</span>
        <span v-else-if="status.status === 'connected'">Бот подключён к Gateway. События требуют подтверждения от клиента.</span>
        <span v-else>Для получения событий по WebSocket клиент бота должен установить соединение.</span>
      </div>

      <div class="diagnostic-metrics">
        <div class="diagnostic-metric">
          <span class="diagnostic-metric-label">Событий в очереди</span>
          <strong class="diagnostic-metric-value">{{ diagnosticNumber(status.backlog_count) }}</strong>
          <small class="diagnostic-metric-hint">Ожидают обработки или подтверждения</small>
        </div>
        <div class="diagnostic-metric">
          <span class="diagnostic-metric-label">Последнее подтверждение</span>
          <strong class="diagnostic-metric-value">{{ diagnosticSequence(status.last_acked_seq) }}</strong>
          <small class="diagnostic-metric-hint">Номер события, подтверждённого клиентом</small>
        </div>
        <div class="diagnostic-metric">
          <span class="diagnostic-metric-label">Последнее отправленное событие</span>
          <strong class="diagnostic-metric-value">{{ diagnosticSequence(status.last_issued_seq) }}</strong>
          <small class="diagnostic-metric-hint">Номер события, переданного Gateway</small>
        </div>
        <div class="diagnostic-metric">
          <span class="diagnostic-metric-label">Активность клиента</span>
          <strong class="diagnostic-metric-value diagnostic-metric-date">{{ diagnosticDate(status.last_seen_at) }}</strong>
          <small class="diagnostic-metric-hint">Последний сигнал от Gateway-сессии</small>
        </div>
      </div>

      <details class="diagnostic-details">
        <summary>Подробности соединения</summary>
        <dl class="diagnostic-rows">
          <div class="diagnostic-row"><dt>Последний ACK</dt><dd>{{ diagnosticDate(status.last_acked_at) }}</dd></div>
          <div class="diagnostic-row"><dt>Последнее подключение</dt><dd>{{ diagnosticDate(status.last_connected_at) }}</dd></div>
          <div class="diagnostic-row"><dt>Последнее отключение</dt><dd>{{ diagnosticDate(status.last_disconnected_at) }}</dd></div>
        </dl>
        <p class="diagnostic-subheading">ID последнего соединения</p>
        <code class="diagnostic-code">{{ status.last_connection_id || '—' }}</code>
      </details>
      <p class="diagnostic-note">Количество событий в очереди само по себе не означает ошибку: проверьте подключение и подтверждения ACK, если оно продолжает расти.</p>
    </template>

    <div v-else-if="!loading && !error" class="diagnostic-empty">Данных о Gateway пока нет.</div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { botsApi, type InstallationGatewayStatus } from '@/api/bots'
import { diagnosticDate, diagnosticNumber, diagnosticSequence, gatewayConnectionLabel } from '@/utils/botDiagnostics'

const props = withDefaults(defineProps<{
  installationId: number
  transportActive?: boolean
}>(), { transportActive: true })

const status = ref<InstallationGatewayStatus | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
let requestGeneration = 0

const statusBadgeVariant = computed<'success' | 'warning' | 'default'>(() => {
  if (status.value?.status === 'connected') return 'success'
  if (status.value?.status === 'disconnected') return 'warning'
  return 'default'
})

const load = async () => {
  const generation = ++requestGeneration
  const requestedInstallationId = props.installationId
  status.value = null
  error.value = null
  if (!requestedInstallationId) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    const response = await botsApi.getInstallationGatewayStatus(requestedInstallationId)
    if (requestedInstallationId !== props.installationId || generation !== requestGeneration) return
    if (response.error || !response.data) {
      error.value = response.error || 'Сервер не вернул состояние Gateway'
      return
    }
    status.value = response.data
  } catch (err: unknown) {
    if (requestedInstallationId !== props.installationId || generation !== requestGeneration) return
    error.value = err instanceof Error ? err.message : 'Не удалось загрузить состояние Gateway'
  } finally {
    if (requestedInstallationId === props.installationId && generation === requestGeneration) loading.value = false
  }
}

watch(() => props.installationId, load, { immediate: true })
</script>
