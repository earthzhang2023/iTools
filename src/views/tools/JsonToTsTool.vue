<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>JSON 转 TypeScript 接口</h1>
        <p class="description">根据 JSON 数据自动生成 TypeScript 接口或类型定义</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-space>
              <n-button type="primary" @click="convert">
                生成接口
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
            
            <div class="options">
              <n-checkbox v-model:checked="options.useTypeAlias">
                使用 type
              </n-checkbox>
              <n-checkbox v-model:checked="options.optionalProperties">
                可选属性
              </n-checkbox>
            </div>
          </div>
          
          <div class="conversion-grid">
            <div class="input-section">
              <div class="section-title">
                <h3>JSON 输入</h3>
                <n-space>
                  <n-button size="small" @click="loadExample">
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
                placeholder="输入 JSON 对象或数组"
                :rows="12"
                :status="jsonError ? 'error' : undefined"
              />
              <div v-if="jsonError" class="error-message">
                <n-icon :component="AlertCircle" />
                {{ jsonError }}
              </div>
              
              <div class="interface-name">
                <span class="label">接口名称：</span>
                <n-input
                  v-model:value="options.interfaceName"
                  placeholder="Root"
                  size="small"
                  style="width: 200px"
                />
              </div>
            </div>
            
            <div class="output-section">
              <div class="section-title">
                <h3>TypeScript 接口</h3>
                <CopyButton :text="tsOutput" />
              </div>
              <n-input
                v-model:value="tsOutput"
                type="textarea"
                placeholder="生成的 TypeScript 接口"
                :rows="12"
                readonly
              />
              <div v-if="tsOutput" class="result-info">
                <n-space>
                  <n-tag size="small">
                    {{ options.useTypeAlias ? 'Type' : 'Interface' }} 数量：{{ countInterfaces(tsOutput) }}
                  </n-tag>
                  <n-button size="small" @click="copyToClipboard">
                    复制
                  </n-button>
                </n-space>
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  NCard, NButton, NSpace, NInput, NIcon, NCheckbox, NTag, useMessage
} from 'naive-ui'
import { AlertCircle } from '@vicons/ionicons5'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { jsonToTypeScript } from '@/tools/json-to-ts'

const message = useMessage()

const jsonInput = ref('')
const tsOutput = ref('')
const jsonError = ref<string | null>(null)

const options = reactive({
  interfaceName: 'Root',
  useTypeAlias: false,
  optionalProperties: false
})

function convert() {
  jsonError.value = null
  
  if (!jsonInput.value.trim()) {
    message.warning('请输入 JSON')
    return
  }
  
  try {
    tsOutput.value = jsonToTypeScript(jsonInput.value, options)
    message.success('生成成功')
  } catch (err) {
    jsonError.value = err instanceof Error ? err.message : 'JSON 格式错误'
    tsOutput.value = ''
    message.error('生成失败')
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
  tsOutput.value = ''
  jsonError.value = null
  options.interfaceName = 'Root'
  options.useTypeAlias = false
  options.optionalProperties = false
}

function loadExample() {
  jsonInput.value = JSON.stringify({
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25,
    active: true,
    address: {
      street: '朝阳路',
      city: '北京',
      zipCode: '100000'
    },
    tags: ['developer', 'vue', 'typescript'],
    projects: [
      {
        name: 'Project A',
        stars: 100
      },
      {
        name: 'Project B',
        stars: 200
      }
    ]
  }, null, 2)
  message.success('已加载示例 JSON')
  setTimeout(() => convert(), 100)
}

function copyToClipboard() {
  if (!tsOutput.value) {
    message.warning('没有可复制的内容')
    return
  }
  
  navigator.clipboard.writeText(tsOutput.value)
    .then(() => {
      message.success('复制成功')
    })
    .catch(() => {
      message.error('复制失败')
    })
}

function countInterfaces(ts: string): number {
  const matches = ts.match(/(interface|type)\s+\w+/g)
  return matches ? matches.length : 0
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
  margin-top: 8px;
}

.error-message .n-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.interface-name {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
}

.label {
  font-size: 14px;
  color: var(--text-color-secondary);
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
  
  .options {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .result-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
