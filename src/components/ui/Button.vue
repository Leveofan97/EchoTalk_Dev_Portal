<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="btn__spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 170ms ease, border-color 170ms ease,
    color 170ms ease, box-shadow 170ms ease, transform 170ms ease;
  font-family: inherit;
  line-height: 1.2;
}
.btn:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 3px;
}
.btn:active:not(:disabled) { transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .btn { transition: none; }
  .btn:hover:not(:disabled) { transform: none; }
  .btn__spinner { animation-duration: 2s; }
}

.btn--sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
.btn--md { padding: 0.75rem 1.5rem; font-size: 1rem; }
.btn--lg { padding: 1rem 2rem; font-size: 1.125rem; }

.btn--primary {
  background: var(--accent-gradient);
  color: white;
  box-shadow: 0 3px 12px color-mix(in srgb, var(--accent-primary) 23%, transparent);
}

.btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 18px color-mix(in srgb, var(--accent-primary) 32%, transparent);
}

.btn--secondary {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--bg-tertiary);
  border-color: var(--accent-primary);
}

.btn--ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn--ghost:hover:not(:disabled) {
  color: var(--text-primary);
  background: var(--glass);
}

.btn--danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
