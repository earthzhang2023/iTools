<template>
  <div class="result-panel" :class="{ loading, error: errorMessage }">
    <div class="panel-header">
      <h3 v-if="title">{{ title }}</h3>
      <slot name="header-actions">
        <CopyButton v-if="copyable && value" :text="value" />
      </slot>
    </div>
    
    <div class="panel-content">
      <template v-if="loading">
        <div class="loading-state">
          <n-spin size="medium" />
          <p>处理中...</p>
        </div>
      </template>
      
      <template v-else-if="errorMessage">
        <div class="error-state">
          <n-icon :component="AlertCircle" />
          <p>{{ errorMessage }}</p>
        </div>
      </template>
      
      <template v-else>
        <slot>
          <pre class="result-content">{{ value }}</pre>
        </slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from '@vicons/ionicons5'
import { NIcon, NSpin } from 'naive-ui'
import CopyButton from './CopyButton.vue'

interface Props {
  value?: string
  title?: string
  loading?: boolean
  error?: string | null
  copyable?: boolean
}

withDefaults(defineProps<Props>(), {
  value: '',
  title: '',
  loading: false,
  error: null,
  copyable: true
})

const errorMessage = (props.error || '') as string
</script>

<style scoped>
.result-panel {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.result-panel.error {
  border: 1px solid var(--error-color);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.panel-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.panel-content {
  min-height: 100px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px;
  color: var(--text-color-secondary);
}

.error-state {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
  color: var(--error-color);
}

.error-state .n-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.error-state p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.result-content {
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
  padding: 16px;
  font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 400px;
  overflow-y: auto;
  color: var(--text-color);
}
</style>
