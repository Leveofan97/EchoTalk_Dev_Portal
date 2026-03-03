<template>
  <Card v-if="isValidBot" hover class="bot-card">
    <div class="bot-card__header">
      <div class="bot-avatar">
        {{ firstLetter }}
      </div>
      <div class="bot-info">
        <h4 class="bot-name">{{ bot.name }}</h4>
        <span class="bot-status" :class="`bot-status--${bot.status}`">
          {{ statusText }}
        </span>
      </div>
      <Badge v-if="bot.is_public || bot.isPublic" variant="success">Public</Badge>
    </div>

    <p class="bot-description">{{ description }}</p>

    <div class="bot-card__footer">
      <span class="bot-date">Создан {{ formattedDate }}</span>
      <div class="bot-actions">
        <Button variant="primary" size="sm" @click="$emit('manage', bot)">
          Управление
        </Button>
      </div>
    </div>
  </Card>
  <div v-else class="bot-card-error">
    <p>Ошибка отображения бота</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import type { BotApp } from '@/types'

interface Props {
  bot: BotApp
}

const props = defineProps<Props>()

defineEmits<{
  edit: [bot: BotApp]
  manage: [bot: BotApp]
}>()

const isValidBot = computed(() => {
  return props.bot &&
    typeof props.bot === 'object' &&
    (props.bot.id !== undefined && props.bot.id !== null) &&
    typeof props.bot.name === 'string'
})

const firstLetter = computed(() => {
  if (!props.bot?.name) return '?'
  return props.bot.name.charAt(0).toUpperCase()
})

const description = computed(() => {
  return props.bot?.description || 'Нет описания'
})

const formattedDate = computed(() => {
  if (!props.bot?.created_at) return 'неизвестно'
  try {
    return new Date(props.bot.created_at).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return 'неизвестно'
  }
})

const statusText = computed(() => {
  const status = props.bot?.status
  const map: Record<string, string> = {
    draft: 'Черновик',
    active: 'Активен',
    suspended: 'Приостановлен'
  }
  return map[status] || status || 'Неизвестно'
})
</script>

<style scoped>
.bot-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.bot-card__header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bot-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius);
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.bot-info {
  flex: 1;
  min-width: 0;
}

.bot-name {
  margin: 0;
  font-size: 1.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bot-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-weight: 500;
}

.bot-card-error {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius);
}

.bot-status--draft {
  background: var(--bg-tertiary);
  color: var(--text-muted);
}

.bot-status--active {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.bot-status--suspended {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.bot-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  flex: 1;
}

.bot-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.bot-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.bot-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
