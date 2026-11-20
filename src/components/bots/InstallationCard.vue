<template>
  <article class="installation-card" :class="{ 'installation-card--inactive': installation.status !== 'active' }">
    <div class="installation-header">
      <div class="server-info">
        <div class="server-avatar" aria-hidden="true">{{ serverInitials }}</div>
        <div class="server-details">
          <h3>{{ installation.server_name || `Сервер ${installation.server_id}` }}</h3>
          <p>Сервер #{{ installation.server_id }} · Установка #{{ installation.id }}</p>
          <p>Установлен: {{ formatDate(installation.created_at) }}</p>
        </div>
      </div>
      <Badge :variant="statusVariant" size="sm">{{ statusLabel }}</Badge>
    </div>

    <div class="installation-footer">
      <div class="installation-scopes">
        <details v-if="installation.granted_scopes !== undefined">
          <summary>Выданные разрешения <span class="scope-count">{{ scopes.length }}</span></summary>
          <p class="scopes-explanation">Права этой установки могут отличаться от разрешений приложения.</p>
          <div class="scopes-list">
            <Badge v-for="scope in scopes" :key="scope" variant="default" size="sm">
              <span :title="scope">{{ scopeTitle({ name: scope, label: '' }) }}</span>
            </Badge>
            <span v-if="!scopes.length" class="no-scopes">Разрешения не выданы</span>
          </div>
        </details>
        <span v-else class="scopes-unavailable" title="GET /dev/bots/:id/installations пока не возвращает granted_scopes">
          Сведения о выданных разрешениях недоступны
        </span>
      </div>
      <div v-if="installation.status === 'active'" class="installation-actions">
        <Button variant="secondary" size="sm" :disabled="busy" @click="emit('configure', installation)">
          <AppIcon name="settings" :size="18" /> Настроить
        </Button>
        <Button variant="danger" size="sm" :disabled="busy" @click="emit('revoke', installation)">
          Отозвать
        </Button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import type { BotInstallation } from '@/api/bots'
import { scopeTitle } from '@/utils/botScopeCatalog'

const props = withDefaults(defineProps<{
  installation: BotInstallation
  busy?: boolean
}>(), { busy: false })

const emit = defineEmits<{
  revoke: [installation: BotInstallation]
  configure: [installation: BotInstallation]
}>()

const serverInitials = computed(() => {
  const name = props.installation.server_name?.trim() || 'Сервер'
  return name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
})

const statusVariant = computed(() => {
  switch (props.installation.status) {
    case 'active': return 'success'
    case 'paused': return 'warning'
    case 'revoked': return 'danger'
    default: return 'default'
  }
})

const scopes = computed(() => props.installation.granted_scopes ?? [])
const statusLabel = computed(() => {
  switch (props.installation.status) {
    case 'active': return 'Активна'
    case 'paused': return 'Приостановлена'
    case 'revoked': return 'Отозвана'
    default: return props.installation.status
  }
})

const formatDate = (date: string) => {
  const value = new Date(date)
  return Number.isNaN(value.getTime()) ? '—' : value.toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
</script>

<style scoped>
.installation-card {
  display: grid;
  gap: 18px;
  padding: 20px;
  margin-bottom: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  transition: border-color 160ms ease, background-color 160ms ease;
}
.installation-card:hover { border-color: var(--accent-primary); }
.installation-card--inactive { background: var(--glass); }
.installation-header, .installation-footer { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.server-info { display: flex; align-items: center; gap: 14px; min-width: 0; }
.server-avatar { width: 46px; height: 46px; flex: 0 0 46px; display: grid; place-items: center; border-radius: 12px; background: var(--accent-gradient); color: white; font-weight: 700; }
.server-details { min-width: 0; }
.server-details h3 { margin: 0 0 5px; font-size: 15px; color: var(--text-primary); overflow-wrap: anywhere; }
.server-details p { margin: 3px 0 0; font-size: 12px; color: var(--text-secondary); }
.installation-footer { align-items: center; border-top: 1px solid var(--border-color); padding-top: 14px; }
.installation-scopes { min-width: 0; }
.installation-scopes summary { cursor: pointer; color: var(--text-secondary); font-size: 13px; user-select: none; }
.installation-scopes summary:hover { color: var(--text-primary); }
.installation-scopes summary:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 3px; }
.scope-count { padding: 1px 7px; border-radius: 12px; background: var(--glass); }
.scopes-explanation, .scopes-unavailable { color: var(--text-secondary); font-size: 12px; line-height: 1.5; }
.scopes-explanation { margin: 10px 0; }
.scopes-list { display: flex; flex-wrap: wrap; gap: 6px; }
.no-scopes { color: var(--text-secondary); font-size: 13px; }
.installation-actions { display: flex; flex-wrap: wrap; gap: 8px; }
@media (max-width: 650px) {
  .installation-header { flex-wrap: wrap; }
  .installation-footer { flex-direction: column; align-items: stretch; }
  .installation-actions { justify-content: flex-start; }
}
@media (prefers-reduced-motion: reduce) { .installation-card { transition: none; } }
</style>
