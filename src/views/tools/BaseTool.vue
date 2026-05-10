<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>进制转换工具</h1>
        <p class="description">二进制、八进制、十进制、十六进制相互转换</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-space>
              <n-button type="primary" @click="convert">
                转换
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
          </div>
          
          <div class="conversion-grid">
            <!-- 输入 -->
            <div class="input-section">
              <div class="section-title">
                <h3>输入</h3>
                <n-space>
                  <n-select
                    v-model:value="fromBase"
                    :options="baseOptions"
                    size="small"
                    style="width: 120px"
                  />
                  <n-button size="small" @click="loadExample">
                    示例
                  </n-button>
                </n-space>
              </div>
              <n-input
                v-model:value="inputValue"
                placeholder="输入要转换的数字"
                @update:value="onInput"
                :status="inputError ? 'error' : undefined"
              >
                <template #prefix>
                  {{ basePrefixes[fromBase] }}
                </template>
              </n-input>
              <div v-if="inputError" class="error-message">
                <n-icon :component="AlertCircle" />
                {{ inputError }}
              </div>
              
              <div v-if="inputValue" class="input-info">
                <n-tag size="small">
                  位数：{{ inputValue.replace(/\s/g, '').length }}
                </n-tag>
                <n-tag size="small">
                  十进制：{{ displayDecimal }}
                </n-tag>
              </div>
            </div>
            
            <!-- 输出 -->
            <div class="output-section">
              <div class="section-title">
                <h3>输出</h3>
                <n-select
                  v-model:value="toBase"
                  :options="baseOptions"
                  size="small"
                  style="width: 120px"
                />
              </div>
              <n-input
                v-model:value="outputValue"
                placeholder="转换结果"
                readonly
              >
                <template #prefix>
                  {{ basePrefixes[toBase] }}
                </template>
                <template #suffix>
                  <CopyButton :text="outputValue" />
                </template>
              </n-input>
              
              <div class="all-bases">
                <h4>所有进制</h4>
                <div class="base-results">
                  <div class="base-item">
                    <span class="base-label">二进制：</span>
                    <n-space>
                      <n-tag>{{ binaryResult }}</n-tag>
                      <CopyButton :text="binaryResult" size="small" />
                    </n-space>
                  </div>
                  <div class="base-item">
                    <span class="base-label">八进制：</span>
                    <n-space>
                      <n-tag>{{ octalResult }}</n-tag>
                      <CopyButton :text="octalResult" size="small" />
                    </n-space>
                  </div>
                  <div class="base-item">
                    <span class="base-label">十进制：</span>
                    <n-space>
                      <n-tag>{{ decimalResult }}</n-tag>
                      <CopyButton :text="decimalResult" size="small" />
                    </n-space>
                  </div>
                  <div class="base-item">
                    <span class="base-label">十六进制：</span>
                    <n-space>
                      <n-tag>{{ hexResult }}</n-tag>
                      <CopyButton :text="hexResult" size="small" />
                    </n-space>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import {
  NCard, NButton, NSpace, NInput, NIcon, NSelect, NTag, useMessage
} from 'naive-ui'
import { AlertCircle } from '@vicons/ionicons5'
import type { SelectOption } from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { baseConvert, validateInput, formatNumber, type Base } from '@/tools/base'

const message = useMessage()

const inputValue = ref('')
const outputValue = ref('')
const fromBase = ref<Base>(10)
const toBase = ref<Base>(2)
const inputError = ref<string | null>(null)

const baseOptions: SelectOption[] = [
  { label: '二进制 (2)', value: 2 },
  { label: '八进制 (8)', value: 8 },
  { label: '十进制 (10)', value: 10 },
  { label: '十六进制 (16)', value: 16 }
]

const basePrefixes = {
  2: '0b',
  8: '0o',
  10: '',
  16: '0x'
}

const displayDecimal = computed(() => {
  if (!inputValue.value) return ''
  try {
    const value = inputValue.value.replace(/\s/g, '')
    const decimal = parseInt(value, fromBase.value)
    return isNaN(decimal) ? '' : decimal.toString()
  } catch {
    return ''
  }
})

const binaryResult = computed(() => {
  if (!inputValue.value) return ''
  try {
    const value = inputValue.value.replace(/\s/g, '')
    return formatNumber(baseConvert(value, fromBase.value, 2), 2)
  } catch {
    return ''
  }
})

const octalResult = computed(() => {
  if (!inputValue.value) return ''
  try {
    const value = inputValue.value.replace(/\s/g, '')
    return baseConvert(value, fromBase.value, 8)
  } catch {
    return ''
  }
})

const decimalResult = computed(() => {
  if (!inputValue.value) return ''
  try {
    const value = inputValue.value.replace(/\s/g, '')
    return baseConvert(value, fromBase.value, 10)
  } catch {
    return ''
  }
})

const hexResult = computed(() => {
  if (!inputValue.value) return ''
  try {
    const value = inputValue.value.replace(/\s/g, '')
    return formatNumber(baseConvert(value, fromBase.value, 16).toUpperCase(), 16)
  } catch {
    return ''
  }
})

const processInput = useDebounceFn(() => {
  if (inputValue.value) {
    convert()
  } else {
    outputValue.value = ''
    inputError.value = null
  }
}, 300)

function onInput(value: string) {
  processInput()
}

function convert() {
  const value = inputValue.value.replace(/\s/g, '')
  
  if (!value) {
    outputValue.value = ''
    inputError.value = null
    return
  }
  
  // 验证输入
  if (!validateInput(value, fromBase.value)) {
    inputError.value = `请输入有效的${baseOptions.find(b => b.value === fromBase.value)?.label}数字`
    outputValue.value = ''
    message.error('输入格式错误')
    return
  }
  
  try {
    const result = baseConvert(value, fromBase.value, toBase.value)
    outputValue.value = formatNumber(result, toBase.value)
    inputError.value = null
    message.success('转换成功')
  } catch (err) {
    inputError.value = '转换失败'
    outputValue.value = ''
    message.error('转换失败')
  }
}

function clearAll() {
  inputValue.value = ''
  outputValue.value = ''
  inputError.value = null
  fromBase.value = 10
  toBase.value = 2
}

function loadExample() {
  inputValue.value = '255'
  fromBase.value = 10
  toBase.value = 2
  setTimeout(() => convert(), 100)
}

// 监听进制变化
watch([fromBase, toBase], () => {
  if (inputValue.value) {
    convert()
  }
})
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

.conversion-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
  color: var(--error-color);
  font-size: 14px;
}

.error-message .n-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.input-info {
  display: flex;
  gap: 8px;
  padding: 12px;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
}

.all-bases {
  padding: 16px;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
}

.all-bases h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.base-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.base-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.base-item:last-child {
  border-bottom: none;
}

.base-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-secondary);
  min-width: 80px;
}

@media (max-width: 768px) {
  .conversion-grid {
    grid-template-columns: 1fr;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
