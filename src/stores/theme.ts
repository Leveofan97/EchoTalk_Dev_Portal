import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Theme } from '@/types'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<Theme>('darkNight')
  const isDark = computed(() => {
    return ['darkNight', 'retroGame', 'cosmicNeon', 'goldDust', 'deepDepth', 'purpleDragon']
      .includes(currentTheme.value)
  })

  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('dev-portal-theme', theme)
  }

  const initTheme = () => {
    const saved = localStorage.getItem('dev-portal-theme') as Theme
    if (saved) {
      setTheme(saved)
    }
  }

  const themes: { value: Theme; label: string; preview: string }[] = [
    { value: 'darkNight', label: 'Dark Night', preview: '#6366f1' },
    { value: 'lightDay', label: 'Light Day', preview: '#4f46e5' },
    { value: 'retroGame', label: 'Retro Game', preview: '#ff00ff' },
    { value: 'cosmicNeon', label: 'Cosmic Neon', preview: '#00d4aa' },
    { value: 'goldDust', label: 'Gold Dust', preview: '#d4af37' },
    { value: 'deepDepth', label: 'Deep Depth', preview: '#00b4d8' },
    { value: 'purpleDragon', label: 'Purple Dragon', preview: '#9d4edd' },
    { value: 'softWarm', label: 'Soft Warm', preview: '#e07a5f' },
  ]

  return {
    currentTheme,
    isDark,
    themes,
    setTheme,
    initTheme
  }
})
