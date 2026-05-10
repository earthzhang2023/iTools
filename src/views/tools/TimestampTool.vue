<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>时间戳转换</h1>
        <p class="description">时间戳与日期格式相互转换，支持多种格式</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-space>
              <n-button type="primary" @click="convertToTimestamp">
                转为时间戳
              </n-button>
              <n-button @click="convertToDate">
                转为日期
              </n-button>
              <n-button @click="getCurrent">
                当前时间
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
            
            <div class="options">
              <n-select
                v-model:value="timestampUnit"
                :options="unitOptions"
                size="small"
                style="width: 120px"
              />
              <n-input
                v-model:value="dateFormat"
                placeholder="YYYY-MM-DD HH:mm:ss"
                size="small"
                style="width: 180px"
              >
                <template #prefix>
                  格式
                </template>
              </n-input>
            </div>
          </div>
          
          <div class="input-output">
            <div class="input-section">
              <div class="section-title">
                <h3>输入</h3>
                <n-button size="small" @click="loadExample">
                  加载示例
                </n-button>
              </div>
              <n-input
                v-model:value="inputValue"
                type="textarea"
                placeholder="输入日期或时间戳"
                :rows="8"
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
                :rows="8"
                readonly
                :status="error ? 'error' : undefined"
              />
              <div v-if="error" class="error-message">
                <n-icon :component="AlertCircle" />
                {{ error }}
              </div>
              <div v-if="successInfo" class="success-info">
                <n-icon :component="CheckmarkCircle" />
                {{ successInfo }}
              </div>
            </div>
          </div>
          
          <div class="quick-conversions">
            <h3>快速转换</h3>
            <n-space>
              <n-button size="small" @click="quickConvert('now')">
                当前时间戳
              </n-button>
              <n-button size="small" @click="quickConvert('today')">
                今日零点
              </n-button>
              <n-button size="small" @click="quickConvert('week')">
                本周一
              </n-button>
              <n-button size="small" @click="quickConvert('month')">
                本月一日
              </n-button>
            </n-space>
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
  NCard, NButton, NSpace, NSelect, NInput, NIcon, NInputGroup, useMessage
} from 'naive-ui'
import { AlertCircle, CheckmarkCircle } from '@vicons/ionicons5'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import {
  timestampToDate,
  dateToTimestamp,
  getCurrentTimestamp,
  formatDate
} from '@/tools/time'

const message = useMessage()

const inputValue = ref('')
const outputValue = ref('')
const timestampUnit = ref<'seconds' | 'milliseconds'>('seconds')
const dateFormat = ref('YYYY-MM-DD HH:mm:ss')
const error = ref<string | null>(null)
const successInfo = ref<string | null>(null)

const unitOptions = [
  { label: '秒', value: 'seconds' },
  { label: '毫秒', value: 'milliseconds' }
]

const processInput = useDebounceFn((value: string) => {
  if (!value.trim()) {
    outputValue.value = ''
    error.value = null
    successInfo.value = null
    return
  }
  
  // 判断输入是时间戳还是日期
  const isTimestamp = /^\d+$/.test(value.trim())
  
  try {
    if (isTimestamp) {
      // 时间戳转日期
      const result = timestampToDate(value.trim(), dateFormat.value)
      outputValue.value = result
      error.value = null
      successInfo.value = '时间戳转日期成功'
    } else {
      // 日期转时间戳
      const result = dateToTimestamp(value.trim(), timestampUnit.value)
      outputValue.value = result.toString()
      error.value = null
      successInfo.value = '日期转时间戳成功'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '转换失败'
    successInfo.value = null
    outputValue.value = ''
  }
}, 500)

function onInput(value: string) {
  processInput(value)
}

function convertToTimestamp() {
  try {
    const result = dateToTimestamp(inputValue.value, timestampUnit.value)
    outputValue.value = result.toString()
    error.value = null
    successInfo.value = '转换成功'
    message.success('转换成功')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '转换失败'
    successInfo.value = null
    message.error('转换失败')
  }
}

function convertToDate() {
  try {
    const result = timestampToDate(inputValue.value, dateFormat.value)
    outputValue.value = result
    error.value = null
    successInfo.value = '转换成功'
    message.success('转换成功')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '转换失败'
    successInfo.value = null
    message.error('转换失败')
  }
}

function getCurrent() {
  const now = getCurrentTimestamp(timestampUnit.value)
  inputValue.value = now.toString()
  const dateStr = formatDate(new Date(), dateFormat.value)
  outputValue.value = dateStr
  successInfo.value = '已获取当前时间'
  error.value = null
  message.success('已获取当前时间')
}

function clearAll() {
  inputValue.value = ''
  outputValue.value = ''
  error.value = null
  successInfo.value = null
}

function loadExample() {
  const now = getCurrentTimestamp('seconds')
  inputValue.value = now.toString()
  processInput(inputValue.value)
}

function quickConvert(type: string) {
  const now = new Date()
  let result: number
  
  switch (type) {
    case 'now':
      result = getCurrentTimestamp(timestampUnit.value)
      inputValue.value = result.toString()
      outputValue.value = formatDate(new Date(), dateFormat.value)
      break
    case 'today':
      now.setHours(0, 0, 0, 0)
      result = timestampUnit.value === 'seconds' 
        ? Math.floor(now.getTime() / 1000) 
        : now.getTime()
      inputValue.value = result.toString()
      outputValue.value = formatDate(now, dateFormat.value)
      break
    case 'week':
      const day = now.getDay() || 7
      now.setDate(now.getDate() - day + 1)
      now.setHours(0, 0, 0, 0)
      result = timestampUnit.value === 'seconds'
        ? Math.floor(now.getTime() / 1000)
        : now.getTime()
      inputValue.value = result.toString()
      outputValue.value = formatDate(now, dateFormat.value)
      break
    case 'month':
      now.setDate(1)
      now.setHours(0, 0, 0, 0)
      result = timestampUnit.value === 'seconds'
        ? Math.floor(now.getTime() / 1000)
        : now.getTime()
      inputValue.value = result.toString()
      outputValue.value = formatDate(now, dateFormat.value)
      break
  }
  
  error.value = null
  successInfo.value = '快速转换成功'
  message.success('已加载')
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
  gap: 12px;
}

.input-output {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
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

.error-message,
.success-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: var(--radius-md);
  font-size: 14px;
  margin-top: 8px;
}

.error-message {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
}

.success-info {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.error-message .n-icon,
.success-info .n-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.quick-conversions {
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.quick-conversions h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
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
