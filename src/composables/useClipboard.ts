// composables/useClipboard.ts
import { ref } from 'vue'

export function useClipboard() {
  const copied = ref(false)
  const error = ref<unknown>(null)
  const isSupported = typeof navigator !== 'undefined' && !!navigator.clipboard

  function fallbackWriteText(text: string) {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  }

  async function copy(text: string) {
    error.value = null
    try {
      if (isSupported) {
        await navigator.clipboard.writeText(text)
      } else if (!fallbackWriteText(text)) {
        throw new Error('execCommand failed')
      }
      copied.value = true
      setTimeout(() => (copied.value = false), 2000)
      return true
    } catch (e) {
      error.value = e
      return false
    }
  }

  return { copy, copied, error, isSupported }
}
