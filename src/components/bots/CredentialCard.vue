<!-- components/bots/CredentialCard.vue -->
<template>
  <div class="credential-card">
    <div class="credential-header">
      <div class="credential-info">
        <h4>{{ title }}</h4>
        <Badge v-if="isNew" variant="success" size="sm">Новый</Badge>
        <Badge v-if="revoked" variant="error" size="sm">Отозван</Badge>
      </div>
      <div class="credential-actions">
        <Button
          v-if="!revealed && !revoked"
          variant="ghost"
          size="sm"
          @click="revealed = true"
        >
          Показать
        </Button>
        <Button
          v-if="revealed && !revoked"
          variant="ghost"
          size="sm"
          @click="revealed = false"
        >
          Скрыть
        </Button>
        <Button
          variant="ghost"
          size="sm"
          :disabled="!value || revoked"
          @click="handleCopy"
        >
          <span v-if="copied">Скопировано!</span>
          <span v-else>Копировать</span>
        </Button>
      </div>
    </div>

    <div class="credential-value">
      <code v-if="revealed && !revoked">{{ value }}</code>
      <code v-else class="masked">••••••••••••••••••••••••••</code>
    </div>

    <div v-if="hint" class="credential-hint">
      <p>{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '@/composables/useClipboard'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

const props = defineProps<{
  title: string
  value: string
  hint?: string
  isNew?: boolean
  revoked?: boolean
}>()

const { copy, copied } = useClipboard()
const revealed = ref(false)

const handleCopy = async () => {
  if (props.value) {
    await copy(props.value)
  }
}
</script>

<style scoped>
.credential-card {
  background: var(--glass);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.credential-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.credential-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.credential-info h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.credential-actions {
  display: flex;
  gap: 0.5rem;
}

.credential-value {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  word-break: break-all;
}

.credential-value code {
  color: var(--text-primary);
}

.credential-value .masked {
  color: var(--text-secondary);
  letter-spacing: 2px;
}

.credential-hint {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.credential-hint p {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style>
