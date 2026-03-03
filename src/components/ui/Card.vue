<template>
  <div :class="['card', { 'card--hover': hover, 'card--glass': glass }]">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  hover?: boolean
  glass?: boolean
}

withDefaults(defineProps<Props>(), {
  hover: false,
  glass: true
})
</script>

<style scoped>
.card {
  background: v-bind(glass ? 'var(--glass)' : 'var(--bg-secondary)');
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  transition: var(--transition);
}

.card--hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: var(--accent-primary);
}
</style>
