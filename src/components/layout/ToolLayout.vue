<template>
  <div class="tool-layout">
    <div class="tool-container">
      <div class="tool-header">
        <slot name="header">
          <h1>{{ title }}</h1>
          <p v-if="description" class="description">{{ description }}</p>
        </slot>
      </div>
      
      <div class="tool-body">
        <div class="input-section">
          <div class="section-header">
            <h3>输入</h3>
            <slot name="input-actions">
              <n-button size="small" @click="handleClear">
                清空
              </n-button>
            </slot>
          </div>
          <slot name="input">
            <n-input
              v-model:value="inputValue"
              type="textarea"
              placeholder="请输入..."
              :rows="10"
              @update:value="handleInput"
            />
          </slot>
        </div>
        
        <div class="output-section">
          <div class="section-header">
            <h3>输出</h3>
            <slot name="output-actions">
              <n-button size="small" @click="handleCopy">
                复制
              </n-button>
            </slot>
          </div>
          <slot name="output">
            <n-input
              v-model:value="outputValue"
              type="textarea"
              placeholder="输出结果"
              :rows="10"
              readonly
            />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NButton, NInput } from 'naive-ui'
import { useMessage } from 'naive-ui'

interface Props {
  title?: string
  description?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  modelValue: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'process', value: string): void
}>()

const message = useMessage()
const inputValue = ref(props.modelValue)
const outputValue = ref('')

function handleInput(value: string) {
  emit('update:modelValue', value)
  emit('process', value)
}

function handleClear() {
  inputValue.value = ''
  outputValue.value = ''
  emit('update:modelValue', '')
}

async function handleCopy() {
  if (!outputValue.value) {
    message.warning('没有可复制的内容')
    return
  }
  
  try {
    await navigator.clipboard.writeText(outputValue.value)
    message.success('复制成功')
  } catch (error) {
    message.error('复制失败')
  }
}

watch(() => props.modelValue, (newVal) => {
  inputValue.value = newVal
})

// Expose method to update output
defineExpose({
  setOutput(value: string) {
    outputValue.value = value
  }
})
</script>

<style scoped>
.tool-layout {
  min-height: calc(100vh - 64px);
  background-color: var(--bg-color);
  padding: 24px;
}

.tool-container {
  max-width: 1400px;
  margin: 0 auto;
}

.tool-header {
  margin-bottom: 24px;
}

.tool-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
}

.description {
  font-size: 14px;
  color: var(--text-color-secondary);
}

.tool-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.input-section,
.output-section {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-md);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

@media (max-width: 1024px) {
  .tool-body {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .tool-layout {
    padding: 16px;
  }
  
  .tool-header h1 {
    font-size: 20px;
  }
}
</style>
