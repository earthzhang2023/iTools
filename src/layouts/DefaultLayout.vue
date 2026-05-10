<template>
  <div class="default-layout">
    <AppHeader>
      <template #logo>
        <h1 class="logo">iTools</h1>
        <span class="author">- Dr.Zhang</span>
      </template>
    </AppHeader>
    
    <AppSidebar :collapsed="sidebarCollapsed" />
    
    <main 
      class="main-content" 
      :class="{ 'sidebar-collapsed': sidebarCollapsed }"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const sidebarCollapsed = ref(false)
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.logo {
  display: inline;
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

.author {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin-left: 8px;
}

.main-content {
  margin-left: 240px;
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  transition: margin-left var(--transition-normal);
}

.main-content.sidebar-collapsed {
  margin-left: 64px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
}
</style>
