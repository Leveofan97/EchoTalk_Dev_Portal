<template>
  <div class="asyncapi-reference">
    <ApiReference :key="specUrl" :configuration="configuration" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { ApiReference } from '@scalar/api-reference'
import '@scalar/api-reference/style.css'

const props = defineProps<{
  specUrl: string
}>()

const configuration = computed(() => ({
  url: props.specUrl,

  layout: 'modern' as const,
  theme: 'purple',

  showSidebar: true,

  modelsSectionLabel: 'Schemas',

  // Для WS Gateway API-клиент нам сейчас не нужен.
  hideClientButton: true,
  hideTestRequestButton: true,

  // Не показываем внутренние dev-инструменты Scalar.
  showDeveloperTools: 'never' as const,

  // Не позволяем Scalar менять route Dev Portal.
  urlRouting: false,

  // Используем шрифты приложения.
  withDefaultFonts: false,

  // Пока документацию держим светлой,
  // как твой REST reference.
  forceDarkModeState: 'light' as const,
  hideDarkModeToggle: true,

  customFetch: (input: string | URL | globalThis.Request, init?: RequestInit) =>
    window.fetch(input, {
      ...init,
      credentials: 'omit',
    }),
}))
</script>

<style scoped>
.asyncapi-reference {
  width: 100%;
  min-width: 0;
  min-height: 75vh;
}
</style>
