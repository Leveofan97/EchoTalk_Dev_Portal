<template>
  <span :class="['badge', `badge--${variant}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge--default {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.badge--success {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.badge--warning {
  background: rgba(234, 179, 8, 0.15);
  color: #eab308;
}

.badge--danger {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.badge--info {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}
</style>
