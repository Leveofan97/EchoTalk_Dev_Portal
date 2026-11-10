<template>
  <div ref="containerRef" class="asyncapi-reference" />
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

import '@asyncapi/react-component/browser/index.js'
import '@asyncapi/react-component/styles/default.min.css'

interface AsyncApiStandalone {
  render(
    options: {
      schema: string
      config?: Record<string, unknown>
    },
    element: HTMLElement,
  ): void
}

declare global {
  interface Window {
    AsyncApiStandalone?: AsyncApiStandalone
  }
}

const props = defineProps<{
  specUrl: string
}>()

const containerRef = ref<HTMLDivElement | null>(null)

async function renderAsyncApi(): Promise<void> {
  if (!containerRef.value) {
    return
  }

  const response = await fetch(props.specUrl)

  if (!response.ok) {
    throw new Error(`Failed to load AsyncAPI specification: ${response.status}`)
  }

  const schema = await response.text()

  await nextTick()

  if (!containerRef.value) {
    return
  }

  if (!window.AsyncApiStandalone) {
    throw new Error('AsyncApiStandalone is not available')
  }

  window.AsyncApiStandalone.render(
    {
      schema,
      config: {
        show: {
          sidebar: true,
          info: true,
          operations: true,
          messages: true,
          schemas: true,
          errors: true,
        },
      },
    },
    containerRef.value,
  )
}

onMounted(() => {
  void renderAsyncApi()
})
</script>
