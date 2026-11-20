<!-- components/bots/InstallationCard.vue -->
<template>
  <div class="installation-card">
    <div class="installation-header">
      <div class="server-info">
        <div class="server-avatar">
          {{ serverInitials }}
        </div>
        <div class="server-details">
          <h4>{{ installation.server_name || `Сервер ${installation.server_id}` }}</h4>
          <p>Установлен: {{ formatDate(installation.created_at) }}</p>
        </div>
      </div>
      <div class="installation-actions">
        <Badge :variant="statusVariant" size="sm">
          {{ statusLabel }}
        </Badge>
        <Button
          v-if="installation.status === 'active'"
          variant="danger"
          size="sm"
          :loading="isRevoking"
          @click="handleRevoke"
        >
          Отозвать
        </Button>
      </div>
    </div>

    <details class="installation-scopes">
      <summary>Права этой установки <span class="scope-count">{{ scopes.length }}</span></summary>
      <p class="scopes-explanation">Права выданы при установке на сервер и могут отличаться от настроек приложения.</p>
      <div class="scopes-list">
        <Badge v-for="scope in scopes" :key="scope" variant="default" size="sm">
          <span :title="scope">{{ scopeTitle({ name: scope, label: '' }) }}</span>
        </Badge>
        <span v-if="!scopes.length" class="no-scopes">Нет разрешений</span>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import type { BotInstallation } from '@/api/bots'
import { scopeTitle } from '@/utils/botScopeCatalog'

const props = defineProps<{
  installation: BotInstallation
}>()

const emit = defineEmits<{
  revoke: [installationId: number]
}>()

const isRevoking = ref(false)

const serverInitials = computed(() => {
  const name = props.installation.server_name || '??'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
})

const statusVariant = computed(() => {
  switch (props.installation.status) {
    case 'active': return 'success'
    case 'paused': return 'warning'
    case 'revoked': return 'danger'
    default: return 'default'
  }
})

const scopes = computed(() => props.installation.granted_scopes || [])
const statusLabel = computed(() => {
  switch (props.installation.status) {
    case 'active': return 'Активна'
    case 'paused': return 'Приостановлена'
    case 'revoked': return 'Отозвана'
    default: return props.installation.status
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const handleRevoke = async () => {
  if (!confirm('Вы уверены, что хотите отозвать этого бота с сервера?')) return

  isRevoking.value = true
  try {
    emit('revoke', props.installation.id)
  } finally {
    isRevoking.value = false
  }
}
</script>

<style scoped>
.installation-card {
  background: var(--glass);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.installation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0;
}

.server-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.server-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1.25rem;
}

.server-details h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.server-details p {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.installation-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.installation-scopes {
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid var(--border-color);
}
.installation-scopes summary {
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}
.installation-scopes summary:hover { color: var(--text-primary); }
.installation-scopes summary:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 4px; }
.scope-count { padding: 1px 7px; border-radius: 12px; background: var(--glass); }
.scopes-explanation { margin: 10px 0; color: var(--text-secondary); font-size: 12px; line-height: 1.5; }

.scopes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.no-scopes {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-style: italic;
}
</style>
