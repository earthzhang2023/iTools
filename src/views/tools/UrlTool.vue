<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>URL 编码解码</h1>
        <p class="description">URL 编码、解码、参数解析和构建</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-tabs v-model:value="activeTab" type="segment">
              <n-tab-pane name="encode" tab="编码" />
              <n-tab-pane name="decode" tab="解码" />
              <n-tab-pane name="parse" tab="解析参数" />
              <n-tab-pane name="build" tab="构建参数" />
            </n-tabs>
            
            <n-space>
              <n-button type="primary" @click="execute">
                执行
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
          </div>
          
          <!-- 编码/解码模式 -->
          <template v-if="activeTab === 'encode' || activeTab === 'decode'">
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
                  :placeholder="activeTab === 'encode' ? '输入要编码的文本' : '输入要解码的 URL 编码'"
                  :rows="10"
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
                  :rows="10"
                  readonly
                  :status="error ? 'error' : undefined"
                />
                <div v-if="error" class="error-message">
                  <n-icon :component="AlertCircle" />
                  {{ error }}
                </div>
              </div>
            </div>
          </template>
          
          <!-- 解析参数模式 -->
          <template v-else-if="activeTab === 'parse'">
            <div class="input-output">
              <div class="input-section">
                <div class="section-title">
                  <h3>输入 URL 或查询字符串</h3>
                  <n-button size="small" @click="loadExample">
                    加载示例
                  </n-button>
                </div>
                <n-input
                  v-model:value="inputValue"
                  type="textarea"
                  placeholder="https://example.com?name=John&age=30"
                  :rows="6"
                  @update:value="onInput"
                />
              </div>
              
              <div class="output-section">
                <div class="section-title">
                  <h3>解析结果</h3>
                  <CopyButton :text="outputValue" />
                </div>
                <n-input
                  v-model:value="outputValue"
                  type="textarea"
                  placeholder="解析结果"
                  :rows="6"
                  readonly
                  :status="error ? 'error' : undefined"
                />
                <div v-if="error" class="error-message">
                  <n-icon :component="AlertCircle" />
                  {{ error }}
                </div>
              </div>
            </div>
            
            <div v-if="parsedParams.length > 0" class="params-table">
              <n-data-table
                :columns="paramColumns"
                :data="parsedParams"
                :bordered="false"
                size="small"
              />
            </div>
          </template>
          
          <!-- 构建参数模式 -->
          <template v-else-if="activeTab === 'build'">
            <div class="build-params">
              <n-space vertical>
                <div v-for="(param, index) in buildParams" :key="index" class="param-row">
                  <n-input
                    v-model:value="param.key"
                    placeholder="键"
                    style="width: 200px"
                  />
                  <n-input
                    v-model:value="param.value"
                    placeholder="值"
                    style="flex: 1"
                  />
                  <n-button @click="removeParam(index)">
                    删除
                  </n-button>
                </div>
                
                <n-button @click="addParam" style="width: 100%">
                  添加参数
                </n-button>
                
                <n-input
                  v-model:value="baseUrl"
                  placeholder="基础 URL（可选）"
                >
                  <template #prefix>
                    基础 URL
                  </template>
                </n-input>
                
                <div class="build-result">
                  <h4>构建结果</h4>
                  <n-input
                    v-model:value="outputValue"
                    type="textarea"
                    placeholder="构建结果"
                    :rows="3"
                    readonly
                  />
                  <CopyButton :text="outputValue" style="margin-top: 8px" />
                </div>
              </n-space>
            </div>
          </template>
        </n-card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import {
  NCard, NButton, NSpace, NInput, NIcon, NTabs, NTabPane, NDataTable, useMessage
} from 'naive-ui'
import { AlertCircle } from '@vicons/ionicons5'
import type { DataTableColumns } from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { urlEncode, urlDecode, parseUrlParams, buildUrlParams, addParamsToUrl } from '@/tools/url'

const message = useMessage()

const activeTab = ref<'encode' | 'decode' | 'parse' | 'build'>('encode')
const inputValue = ref('')
const outputValue = ref('')
const error = ref<string | null>(null)
const baseUrl = ref('')

interface Param {
  key: string
  value: string
}

const buildParams = ref<Param[]>([{ key: '', value: '' }])

const parsedParams = ref<Array<{ key: string; value: string }>>([])

const paramColumns: DataTableColumns = [
  {
    title: '键',
    key: 'key',
    width: 200
  },
  {
    title: '值',
    key: 'value'
  }
]

const processInput = useDebounceFn(() => {
  execute()
}, 500)

function onInput(value: string) {
  processInput()
}

function execute() {
  error.value = null
  parsedParams.value = []
  
  try {
    switch (activeTab.value) {
      case 'encode':
        if (!inputValue.value.trim()) {
          outputValue.value = ''
          return
        }
        outputValue.value = urlEncode(inputValue.value)
        message.success('编码成功')
        break
        
      case 'decode':
        if (!inputValue.value.trim()) {
          outputValue.value = ''
          return
        }
        outputValue.value = urlDecode(inputValue.value)
        message.success('解码成功')
        break
        
      case 'parse':
        if (!inputValue.value.trim()) {
          outputValue.value = ''
          return
        }
        const params = parseUrlParams(inputValue.value)
        parsedParams.value = Object.entries(params).map(([key, value]) => ({ key, value }))
        outputValue.value = JSON.stringify(params, null, 2)
        message.success('解析成功')
        break
        
      case 'build':
        const paramsObj: Record<string, string> = {}
        buildParams.value.forEach(p => {
          if (p.key.trim()) {
            paramsObj[p.key.trim()] = p.value
          }
        })
        
        const queryString = buildUrlParams(paramsObj)
        outputValue.value = baseUrl.value.trim()
          ? addParamsToUrl(baseUrl.value.trim(), paramsObj)
          : queryString
        message.success('构建成功')
        break
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '操作失败'
    outputValue.value = ''
    message.error('操作失败')
  }
}

function clearAll() {
  inputValue.value = ''
  outputValue.value = ''
  error.value = null
  parsedParams.value = []
  if (activeTab.value === 'build') {
    buildParams.value = [{ key: '', value: '' }]
    baseUrl.value = ''
  }
}

function loadExample() {
  switch (activeTab.value) {
    case 'encode':
      inputValue.value = 'Hello World! 你好世界！@#$%'
      break
    case 'decode':
      inputValue.value = 'Hello%20World!%20%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C%EF%BC%81%40%23%24%25'
      break
    case 'parse':
      inputValue.value = 'https://example.com/search?keyword=vue3&page=1&limit=10'
      break
    case 'build':
      buildParams.value = [
        { key: 'name', value: 'John' },
        { key: 'age', value: '30' },
        { key: 'city', value: 'New York' }
      ]
      baseUrl.value = 'https://api.example.com/users'
      execute()
      return
  }
  
  setTimeout(() => execute(), 100)
}

function addParam() {
  buildParams.value.push({ key: '', value: '' })
}

function removeParam(index: number) {
  if (buildParams.value.length > 1) {
    buildParams.value.splice(index, 1)
  } else {
    buildParams.value[0] = { key: '', value: '' }
  }
}

// 监听标签页切换
watch(activeTab, () => {
  error.value = null
  parsedParams.value = []
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
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.n-tabs) {
  flex: 1;
  min-width: 300px;
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
  align-items: center;
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
}

.params-table {
  margin-top: 20px;
}

.build-params {
  padding: 20px 0;
}

.param-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.build-result {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.build-result h4 {
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
  
  :deep(.n-tabs) {
    width: 100%;
  }
  
  .param-row {
    flex-wrap: wrap;
  }
  
  .param-row .n-input {
    flex: 1 1 100%;
  }
}
</style>
