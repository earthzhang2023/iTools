<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo-section">
        <slot name="logo">
          <h1 class="logo">iTools</h1>
        </slot>
      </div>
      
      <div class="actions">
        <slot name="actions">
          <n-button @click="toggleTheme" size="medium" quaternary>
            <template #icon>
              <n-icon :component="isDark ? Moon : Sunny" />
            </template>
          </n-button>
        </slot>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Moon, Sunny } from '@vicons/ionicons5'
import { NButton, NIcon } from 'naive-ui'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

function toggleTheme() {
  themeStore.toggleTheme()
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: var(--card-bg);
  box-shadow: var(--shadow-sm);
  z-index: 1000;
  transition: background-color var(--transition-normal);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 768px) {
  .app-header {
    height: 56px;
  }
  
  .header-content {
    padding: 0 16px;
  }
  
  .logo {
    font-size: 20px;
  }
}
</style>
