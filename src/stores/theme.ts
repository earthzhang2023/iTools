import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem('theme-mode') : null
  const mode = ref<'light' | 'dark' | 'auto'>((saved as 'light' | 'dark' | 'auto') || 'auto')
  
  const isDark = ref(false)
  
  function applyTheme() {
    if (mode.value === 'auto') {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDark.value = mode.value === 'dark'
    }
    
    localStorage.setItem('theme-mode', mode.value)
    
    // Update HTML class for CSS variables
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  function toggleTheme() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    applyTheme()
  }
  
  function setThemeMode(newMode: 'light' | 'dark' | 'auto') {
    mode.value = newMode
    applyTheme()
  }
  
  function watchSystem() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (mode.value === 'auto') {
        applyTheme()
      }
    })
  }
  
  function init() {
    applyTheme()
    watchSystem()
  }
  
  // Watch for changes
  watch(mode, () => {
    applyTheme()
  })
  
  return {
    mode,
    isDark,
    toggleTheme,
    setThemeMode,
    init
  }
})
