<!-- components/bots/InstallationCard.vue -->
<template>
  <div class="installation-card">
    <div class="installation-header">
      <div class="server-info">
        <div class="server-avatar">
          {{ serverInitials }}
        </div>
        <div class="server-details">
          <h4>{{ installation.server_name || 'Unknown Server' }}</h4>
          <p>Установлен: {{ formatDate(installation.created_at) }}</p>
        </div>
      </div>
      <div class="installation-actions">
        <Badge :variant="statusVariant" size="sm">
          {{ installation.status }}
        </Badge>
        <Button
          v-if="installation.status === 'active'"
          variant="error"
          size="sm"
          :loading="isRevoking"
          @click="handleRevoke"
        >
          Отозвать
        </Button>
      </div>
    </div>

    <div class="installation-scopes">
      <p class="scopes-label">Разрешения:</p>
      <div class="scopes-list">
        <Badge
          v-for="scope in scopes"
          :key="scope"
          variant="secondary"
          size="sm"
        >
          {{ scope }}
        </Badge>
        <span v-if="!scopes.length" class="no-scopes">Нет разрешений</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import type {BotInstallation} from "@/api/bots.ts"

const props = defineProps<{
  installation: BotInstallation
}>()

const emit = defineEmits<{
  revoke: [installationId: string]
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
    case 'revoked': return 'error'
    default: return 'secondary'
  }
})

const scopes = computed(() => {
  return props.installation.granted_scopes || []
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
  margin-bottom: 1rem;
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
  border-top: 1px solid var(--border-color);
}

.scopes-label {
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

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
