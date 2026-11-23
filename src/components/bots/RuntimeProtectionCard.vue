<template>
  <section class="diagnostic-card" :aria-busy="loading">
    <header class="diagnostic-header">
      <div class="diagnostic-heading">
        <span class="diagnostic-heading-icon"><AppIcon name="shield-check" :size="22" /></span>
        <div>
          <h3>Защита от перегрузки</h3>
          <p>Лимиты запросов и автоматическая блокировка установки</p>
        </div>
      </div>
      <Button variant="secondary" size="sm" :loading="loading" @click="load">Обновить</Button>
    </header>

    <div v-if="loading && !limits && !stats" class="diagnostic-empty" role="status">Загружаем показатели защиты…</div>
    <div v-if="error" class="diagnostic-error" role="alert">
      <span>{{ error }}</span>
      <Button variant="secondary" size="sm" :disabled="loading" @click="load">Повторить</Button>
    </div>

    <template v-if="limits || stats">
      <div class="diagnostic-summary">
        <Badge :variant="statusBadgeVariant">{{ statusLabel }}</Badge>
        <span v-if="health === 'blocked'">Новые запросы бота могут отклоняться до окончания блокировки.</span>
        <span v-else-if="health === 'disabled'">Защита отключена для этой установки.</span>
        <span v-else-if="health === 'active'">Защита включена; превышения лимитов учитываются сервером.</span>
        <span v-else>Не все данные диагностики доступны. Статус защиты не подтверждён.</span>
      </div>

      <div v-if="health === 'blocked'" class="diagnostic-block-info">
        <div><strong>{{ runtimeBlockReason(stats?.block_reason || limits?.block_reason) }}</strong></div>
        <div>До {{ diagnosticDate(stats?.blocked_until || limits?.blocked_until) }}</div>
        <div v-if="stats?.retry_after_sec != null && stats.retry_after_sec > 0">Повторная попытка через {{ diagnosticDuration(stats.retry_after_sec) }}</div>
        <code v-if="stats?.block_reason || limits?.block_reason" class="diagnostic-code">{{ stats?.block_reason || limits?.block_reason }}</code>
      </div>

      <div class="diagnostic-metrics">
        <div class="diagnostic-metric">
          <span class="diagnostic-metric-label">Нарушения за период</span>
          <strong class="diagnostic-metric-value">{{ diagnosticNumber(stats?.violation_count) }} / {{ diagnosticNumber(stats?.violation_limit ?? limits?.violation_limit) }}</strong>
          <small class="diagnostic-metric-hint">Период: {{ diagnosticDuration(stats?.violation_window_sec ?? limits?.violation_window_sec) }}</small>
        </div>
        <div class="diagnostic-metric">
          <span class="diagnostic-metric-label">Запросов в минуту</span>
          <strong class="diagnostic-metric-value">{{ diagnosticNumber(limits?.requests_per_minute) }}</strong>
          <small class="diagnostic-metric-hint">Максимум запросов к API бота</small>
        </div>
        <div class="diagnostic-metric">
          <span class="diagnostic-metric-label">Сообщений в минуту</span>
          <strong class="diagnostic-metric-value">{{ diagnosticNumber(limits?.messages_per_minute) }}</strong>
          <small class="diagnostic-metric-hint">Лимит отправки сообщений</small>
        </div>
        <div class="diagnostic-metric">
          <span class="diagnostic-metric-label">Взаимодействий в минуту</span>
          <strong class="diagnostic-metric-value">{{ diagnosticNumber(limits?.interactions_per_minute) }}</strong>
          <small class="diagnostic-metric-hint">Лимит обработки взаимодействий</small>
        </div>
      </div>

      <details class="diagnostic-details">
        <summary>Все ограничения и технические сведения</summary>
        <div v-if="limits">
          <p class="diagnostic-subheading">Gateway</p>
          <dl class="diagnostic-rows">
            <div class="diagnostic-row"><dt>Создание сессий в минуту</dt><dd>{{ diagnosticNumber(limits.gateway_sessions_per_minute) }}</dd></div>
            <div class="diagnostic-row"><dt>WebSocket-подключений в минуту</dt><dd>{{ diagnosticNumber(limits.gateway_connections_per_minute) }}</dd></div>
          </dl>
          <p class="diagnostic-subheading">Суточные ограничения</p>
          <dl class="diagnostic-rows">
            <div class="diagnostic-row"><dt>Сообщений в сутки</dt><dd>{{ diagnosticNumber(limits.messages_per_day) }}</dd></div>
            <div class="diagnostic-row"><dt>Взаимодействий в сутки</dt><dd>{{ diagnosticNumber(limits.interactions_per_day) }}</dd></div>
            <div class="diagnostic-row"><dt>Событий Gateway в сутки</dt><dd>{{ diagnosticNumber(limits.gateway_events_per_day) }}</dd></div>
          </dl>
          <p class="diagnostic-subheading">Кратковременные всплески</p>
          <dl class="diagnostic-rows">
            <div class="diagnostic-row"><dt>Сообщения</dt><dd>{{ diagnosticNumber(limits.burst_messages_limit) }} за {{ diagnosticDuration(limits.burst_messages_window_sec) }}</dd></div>
            <div class="diagnostic-row"><dt>Взаимодействия</dt><dd>{{ diagnosticNumber(limits.burst_interactions_limit) }} за {{ diagnosticDuration(limits.burst_interactions_window_sec) }}</dd></div>
          </dl>
          <p class="diagnostic-subheading">Блокировки</p>
          <dl class="diagnostic-rows">
            <div class="diagnostic-row"><dt>Время автоматической блокировки</dt><dd>{{ diagnosticDuration(limits.auto_block_duration_sec) }}</dd></div>
            <div class="diagnostic-row"><dt>Период подсчёта нарушений</dt><dd>{{ diagnosticDuration(limits.violation_window_sec) }}</dd></div>
            <div class="diagnostic-row"><dt>Сброс счётчика нарушений</dt><dd>{{ diagnosticDate(stats?.violation_reset_at) }}</dd></div>
          </dl>
        </div>
        <p v-else class="diagnostic-note">Лимиты не загрузились. Попробуйте обновить данные.</p>
      </details>
      <p class="diagnostic-note">Показатели доступны только для просмотра. Разблокировка через эту панель не предусмотрена.</p>
    </template>

    <div v-else-if="!loading && !error" class="diagnostic-empty">Параметры защиты не получены.</div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { botsApi, type BotRuntimeProtectionStats, type BotRuntimeLimits } from '@/api/bots'
import { diagnosticDate, diagnosticDuration, diagnosticNumber, runtimeBlockReason, runtimeHealth } from '@/utils/botDiagnostics'

const props = defineProps<{ installationId: number | string }>()
const loading = ref(false)
const error = ref('')
const limits = ref<BotRuntimeLimits | null>(null)
const stats = ref<BotRuntimeProtectionStats | null>(null)
let requestGeneration = 0

const health = computed(() => runtimeHealth(limits.value, stats.value))
const statusLabel = computed(() => ({
  blocked: 'Заблокирован', disabled: 'Отключена', active: 'Активна', unknown: 'Нет данных',
})[health.value])
const statusBadgeVariant = computed<'success' | 'danger' | 'default'>(() => {
  if (health.value === 'blocked') return 'danger'
  if (health.value === 'active') return 'success'
  return 'default'
})

const load = async () => {
  const generation = ++requestGeneration
  const installationId = props.installationId
  limits.value = null
  stats.value = null
  error.value = ''
  if (!installationId) {
    loading.value = false
    return
  }
  loading.value = true

  try {
    const [limitsResult, statsResult] = await Promise.allSettled([
      botsApi.getInstallationRuntimeLimits(installationId),
      botsApi.getInstallationRuntimeProtectionStats(installationId),
    ])
    if (generation !== requestGeneration || installationId !== props.installationId) return

    const failures: string[] = []
    if (limitsResult.status === 'fulfilled' && limitsResult.value.data && !limitsResult.value.error) {
      limits.value = limitsResult.value.data
    } else {
      failures.push('Не удалось получить настройки лимитов')
    }
    if (statsResult.status === 'fulfilled' && statsResult.value.data && !statsResult.value.error) {
      stats.value = statsResult.value.data
    } else {
      failures.push('Не удалось получить текущие показатели защиты')
    }
    error.value = failures.join('. ')
  } catch (err: unknown) {
    if (generation !== requestGeneration || installationId !== props.installationId) return
    error.value = err instanceof Error ? err.message : 'Не удалось загрузить состояние защиты'
  } finally {
    if (generation === requestGeneration && installationId === props.installationId) loading.value = false
  }
}

watch(() => props.installationId, load, { immediate: true })
</script>
