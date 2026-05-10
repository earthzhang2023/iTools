<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>JSON 转 CSV</h1>
        <p class="description">JSON 与 CSV 格式相互转换，支持自定义分隔符和特殊字符处理</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-tabs v-model:value="activeTab" type="segment">
              <n-tab-pane name="json-to-csv" tab="JSON → CSV" />
              <n-tab-pane name="csv-to-json" tab="CSV → JSON" />
            </n-tabs>
            
            <n-space>
              <n-button type="primary" @click="convert">
                转换
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
          </div>
          
          <!-- JSON 转 CSV -->
          <template v-if="activeTab === 'json-to-csv'">
            <div class="options-section">
              <h4>CSV 选项</h4>
              <n-space>
                <div class="option-item">
                  <span class="option-label">分隔符：</span>
                  <n-select
                    v-model:value="csvOptions.delimiter"
                    :options="delimiterOptions"
                    size="small"
                    style="width: 100px"
                  />
                </div>
                <div class="option-item">
                  <span class="option-label">引号：</span>
                  <n-select
                    v-model:value="csvOptions.quote"
                    :options="quoteOptions"
                    size="small"
                    style="width: 80px"
                  />
                </div>
                <n-checkbox v-model:checked="csvOptions.includeHeader">
                  包含表头
                </n-checkbox>
              </n-space>
            </div>
            
            <div class="conversion-grid">
              <div class="input-section">
                <div class="section-title">
                  <h3>JSON 输入</h3>
                  <n-space>
                    <n-button size="small" @click="loadJsonExample">
                      示例
                    </n-button>
                    <n-button size="small" @click="formatJson">
                      格式化
                    </n-button>
                  </n-space>
                </div>
                <n-input
                  v-model:value="jsonInput"
                  type="textarea"
                  placeholder="输入 JSON 数组或对象"
                  :rows="10"
                  :status="jsonError ? 'error' : undefined"
                />
                <div v-if="jsonError" class="error-message">
                  <n-icon :component="AlertCircle" />
                  {{ jsonError }}
                </div>
              </div>
              
              <div class="output-section">
                <div class="section-title">
                  <h3>CSV 输出</h3>
                  <CopyButton :text="csvOutput" />
                </div>
                <n-input
                  v-model:value="csvOutput"
                  type="textarea"
                  placeholder="CSV 输出结果"
                  :rows="10"
                  readonly
                />
                <div v-if="csvOutput" class="result-info">
                  <n-tag size="small">
                    行数：{{ csvOutput.split('\n').length }}
                  </n-tag>
                  <n-button size="small" @click="downloadCsv">
                    下载 CSV
                  </n-button>
                </div>
              </div>
            </div>
          </template>
          
          <!-- CSV 转 JSON -->
          <template v-if="activeTab === 'csv-to-json'">
            <div class="conversion-grid">
              <div class="input-section">
                <div class="section-title">
                  <h3>CSV 输入</h3>
                  <n-space>
                    <n-button size="small" @click="loadCsvExample">
                      示例
                    </n-button>
                  </n-space>
                </div>
                <n-input
                  v-model:value="csvInput"
                  type="textarea"
                  placeholder="输入 CSV 内容"
                  :rows="10"
                />
              </div>
              
              <div class="output-section">
                <div class="section-title">
                  <h3>JSON 输出</h3>
                  <CopyButton :text="jsonOutput" />
                </div>
                <n-input
                  v-model:value="jsonOutput"
                  type="textarea"
                  placeholder="JSON 输出结果"
                  :rows="10"
                  readonly
                />
                <div v-if="jsonOutput" class="result-info">
                  <n-tag size="small">
                    对象数：{{ countJsonObjects(jsonOutput) }}
                  </n-tag>
                </div>
              </div>
            </div>
          </template>
        </n-card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  NCard, NButton, NSpace, NInput, NIcon, NTabs, NTabPane,
  NSelect, NCheckbox, NTag, useMessage
} from 'naive-ui'
import { AlertCircle } from '@vicons/ionicons5'
import type { SelectOption } from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { jsonToCsv, csvToJson } from '@/tools/json-csv'

const message = useMessage()

const activeTab = ref<'json-to-csv' | 'csv-to-json'>('json-to-csv')

// JSON 转 CSV
const jsonInput = ref('')
const csvOutput = ref('')
const jsonError = ref<string | null>(null)

const csvOptions = reactive({
  delimiter: ',',
  quote: '"',
  includeHeader: true
})

const delimiterOptions: SelectOption[] = [
  { label: '逗号 (,)', value: ',' },
  { label: '分号 (;)', value: ';' },
  { label: '制表符 (Tab)', value: '\t' },
  { label: '管道 (|)', value: '|' }
]

const quoteOptions: SelectOption[] = [
  { label: '双引号', value: '"' },
  { label: '单引号', value: "'" },
  { label: '无', value: '' }
]

// CSV 转 JSON
const csvInput = ref('')
const jsonOutput = ref('')

function convert() {
  jsonError.value = null
  
  if (activeTab.value === 'json-to-csv') {
    if (!jsonInput.value.trim()) {
      message.warning('请输入 JSON')
      return
    }
    
    try {
      csvOutput.value = jsonToCsv(jsonInput.value, csvOptions)
      message.success('转换成功')
    } catch (err) {
      jsonError.value = err instanceof Error ? err.message : 'JSON 格式错误'
      csvOutput.value = ''
      message.error('转换失败')
    }
  } else {
    if (!csvInput.value.trim()) {
      message.warning('请输入 CSV')
      return
    }
    
    try {
      jsonOutput.value = csvToJson(csvInput.value)
      message.success('转换成功')
    } catch (err) {
      jsonOutput.value = ''
      message.error('CSV 格式错误')
    }
  }
}

function formatJson() {
  if (!jsonInput.value.trim()) {
    return
  }
  
  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonInput.value = JSON.stringify(parsed, null, 2)
    message.success('格式化成功')
  } catch (err) {
    jsonError.value = 'JSON 格式错误'
    message.error('格式化失败')
  }
}

function clearAll() {
  jsonInput.value = ''
  csvOutput.value = ''
  csvInput.value = ''
  jsonOutput.value = ''
  jsonError.value = null
}

function loadJsonExample() {
  jsonInput.value = JSON.stringify([
    { name: '张三', age: 25, city: '北京', email: 'zhangsan@example.com' },
    { name: '李四', age: 30, city: '上海', email: 'lisi@example.com' },
    { name: '王五', age: 28, city: '广州', email: 'wangwu@example.com' }
  ], null, 2)
  message.success('已加载示例 JSON')
  setTimeout(() => convert(), 100)
}

function loadCsvExample() {
  csvInput.value = `name,age,city,email
张三，25，北京，zhangsan@example.com
李四，30，上海，lisi@example.com
王五，28，广州，wangwu@example.com`
  message.success('已加载示例 CSV')
  setTimeout(() => convert(), 100)
}

function downloadCsv() {
  if (!csvOutput.value) {
    message.warning('没有可下载的内容')
    return
  }
  
  const blob = new Blob([csvOutput.value], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `data-${Date.now()}.csv`
  link.click()
  message.success('下载已开始')
}

function countJsonObjects(json: string): number {
  try {
    const parsed = JSON.parse(json)
    return Array.isArray(parsed) ? parsed.length : 1
  } catch {
    return 0
  }
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
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.n-tabs) {
  flex: 1;
  min-width: 300px;
}

.options-section {
  padding: 16px;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
  margin-bottom: 20px;
}

.options-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label {
  font-size: 14px;
  color: var(--text-color-secondary);
}

.conversion-grid {
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

.result-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 768px) {
  .conversion-grid {
    grid-template-columns: 1fr;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  :deep(.n-tabs) {
    width: 100%;
  }
  
  .result-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
