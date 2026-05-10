<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { darkTheme } from 'naive-ui'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Initialize theme on app load
themeStore.init()

const theme = computed(() => (themeStore.isDark ? darkTheme : undefined))

const themeOverrides = {
  common: {
    primaryColor: '#3b82f6',
    primaryColorHover: '#60a5fa',
    primaryColorPressed: '#2563eb',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444'
  }
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
