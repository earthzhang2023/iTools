<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>JSON 格式化</h1>
        <p class="description">JSON 格式化、压缩、验证，支持排序和转换</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-space>
              <n-button type="primary" @click="formatJson">
                格式化
              </n-button>
              <n-button @click="minifyJson">
                压缩
              </n-button>
              <n-button @click="validateJson">
                验证
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
            
            <div class="options">
              <n-checkbox v-model:checked="sortKeys">
                排序键
              </n-checkbox>
              <n-input-number
                v-model:value="indent"
                :min="0"
                :max="8"
                :step="2"
                size="small"
                style="width: 100px"
              >
                <template #prefix>
                  缩进
                </template>
              </n-input-number>
            </div>
          </div>
          
          <div class="input-output">
            <div class="input-section">
              <div class="section-title">
                <h3>输入 JSON</h3>
                <n-button size="small" @click="loadExample">
                  加载示例
                </n-button>
              </div>
              <n-input
                v-model:value="inputValue"
                type="textarea"
                placeholder='{"name": "John", "age": 30}'
                :rows="12"
                @update:value="onInput"
              />
            </div>
            
            <div class="output-section">
              <div class="section-title">
                <h3>输出结果</h3>
                <CopyButton :text="outputValue" />
              </div>
              <n-input
                v-model:value="outputValue"
                type="textarea"
                placeholder="输出结果"
                :rows="12"
                readonly
                :status="error ? 'error' : undefined"
              />
              <div v-if="error" class="error-message">
                <n-icon :component="AlertCircle" />
                {{ error }}
              </div>
              <div v-if="validInfo" class="valid-info">
                <n-icon :component="CheckmarkCircle" />
                {{ validInfo }}
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import {
  NCard, NButton, NSpace, NCheckbox, NInput, NInputNumber, NIcon, useMessage
} from 'naive-ui'
import { AlertCircle, CheckmarkCircle } from '@vicons/ionicons5'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { jsonFormat, jsonMinify, jsonValidate } from '@/tools/json'

const message = useMessage()

const inputValue = ref('')
const outputValue = ref('')
const sortKeys = ref(false)
const indent = ref(2)
const error = ref<string | null>(null)
const validInfo = ref<string | null>(null)

const processInput = useDebounceFn((value: string) => {
  if (!value.trim()) {
    outputValue.value = ''
    error.value = null
    validInfo.value = null
    return
  }
  
  try {
    const result = jsonFormat(value, { indent: indent.value, sortKeys: sortKeys.value })
    outputValue.value = result
    error.value = null
    validInfo.value = 'JSON 格式有效'
  } catch (err) {
    error.value = err instanceof Error ? err.message : '无效的 JSON'
    validInfo.value = null
    outputValue.value = ''
  }
}, 500)

function onInput(value: string) {
  processInput(value)
}

function formatJson() {
  try {
    const result = jsonFormat(inputValue.value, { indent: indent.value, sortKeys: sortKeys.value })
    outputValue.value = result
    error.value = null
    validInfo.value = 'JSON 格式化成功'
    message.success('格式化成功')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '格式化失败'
    validInfo.value = null
    message.error('格式化失败')
  }
}

function minifyJson() {
  try {
    const result = jsonMinify(inputValue.value)
    outputValue.value = result
    error.value = null
    validInfo.value = 'JSON 压缩成功'
    message.success('压缩成功')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '压缩失败'
    validInfo.value = null
    message.error('压缩失败')
  }
}

function validateJson() {
  const result = jsonValidate(inputValue.value)
  if (result.valid) {
    validInfo.value = '✓ JSON 格式有效'
    error.value = null
    message.success('JSON 格式有效')
  } else {
    error.value = result.error?.message || 'JSON 格式无效'
    validInfo.value = null
    message.error('JSON 格式无效')
  }
}

function clearAll() {
  inputValue.value = ''
  outputValue.value = ''
  error.value = null
  validInfo.value = null
}

function loadExample() {
  inputValue.value = JSON.stringify({
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    address: {
      city: "New York",
      zip: "10001"
    },
    hobbies: ["reading", "coding", "traveling"]
  }, null, 2)
  processInput(inputValue.value)
}
</script>

<style scoped>
.tool-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
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

.tool-content {
  margin-bottom: 24px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 12px;
}

.options {
  display: flex;
  align-items: center;
  gap: 16px;
}

.input-output {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.error-message {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
  color: var(--error-color);
  font-size: 14px;
  margin-top: 8px;
}

.error-message .n-icon {
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 1px;
}

.valid-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: rgba(16, 185, 129, 0.1);
  border-radius: var(--radius-md);
  color: var(--success-color);
  font-size: 14px;
  margin-top: 8px;
}

.valid-info .n-icon {
  font-size: 18px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .input-output {
    grid-template-columns: 1fr;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .options {
    flex-wrap: wrap;
  }
}
</style>
