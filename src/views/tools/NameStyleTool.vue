<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>命名风格转换</h1>
        <p class="description">驼峰、帕斯卡、短横线、下划线、常量命名风格相互转换</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-space>
              <n-button type="primary" @click="convertAll">
                全部转换
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
          </div>
          
          <div class="input-section">
            <div class="section-title">
              <h3>输入</h3>
              <n-space>
                <n-button size="small" @click="loadExample">
                  示例
                </n-button>
                <n-button size="small" @click="pasteFromClipboard">
                  粘贴
                </n-button>
              </n-space>
            </div>
            <n-input
              v-model:value="inputValue"
              placeholder="输入变量名或文本"
              @update:value="convertAll"
            />
          </div>
          
          <div class="results-section">
            <div class="result-grid">
              <div class="result-card">
                <div class="result-header">
                  <h4>驼峰命名 (camelCase)</h4>
                  <CopyButton :text="camelCase" />
                </div>
                <div class="result-value">{{ camelCase }}</div>
              </div>
              
              <div class="result-card">
                <div class="result-header">
                  <h4>大驼峰命名 (PascalCase)</h4>
                  <CopyButton :text="pascalCase" />
                </div>
                <div class="result-value">{{ pascalCase }}</div>
              </div>
              
              <div class="result-card">
                <div class="result-header">
                  <h4>短横线命名 (kebab-case)</h4>
                  <CopyButton :text="kebabCase" />
                </div>
                <div class="result-value">{{ kebabCase }}</div>
              </div>
              
              <div class="result-card">
                <div class="result-header">
                  <h4>下划线命名 (snake_case)</h4>
                  <CopyButton :text="snakeCase" />
                </div>
                <div class="result-value">{{ snakeCase }}</div>
              </div>
              
              <div class="result-card">
                <div class="result-header">
                  <h4>常量命名 (CONSTANT_CASE)</h4>
                  <CopyButton :text="constantCase" />
                </div>
                <div class="result-value">{{ constantCase }}</div>
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NButton, NSpace, NInput, useMessage } from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import {
  toCamelCase,
  toPascalCase,
  toKebabCase,
  toSnakeCase,
  toConstantCase
} from '@/tools/name-style'

const message = useMessage()

const inputValue = ref('')

const camelCase = computed(() => 
  inputValue.value ? toCamelCase(inputValue.value) : ''
)

const pascalCase = computed(() => 
  inputValue.value ? toPascalCase(inputValue.value) : ''
)

const kebabCase = computed(() => 
  inputValue.value ? toKebabCase(inputValue.value) : ''
)

const snakeCase = computed(() => 
  inputValue.value ? toSnakeCase(inputValue.value) : ''
)

const constantCase = computed(() => 
  inputValue.value ? toConstantCase(inputValue.value) : ''
)

function convertAll() {
  // 实时转换，无需额外操作
}

function clearAll() {
  inputValue.value = ''
}

function loadExample() {
  inputValue.value = 'hello-world-example'
  message.success('已加载示例')
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    inputValue.value = text
    message.success('粘贴成功')
  } catch (err) {
    message.error('无法访问剪贴板')
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
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.input-section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.results-section {
  margin-top: 24px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.result-card {
  padding: 16px;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.result-value {
  font-size: 16px;
  font-family: 'Courier New', monospace;
  color: var(--primary-color);
  word-break: break-all;
  padding: 8px;
  background-color: var(--card-bg);
  border-radius: var(--radius-sm);
}

@media (max-width: 768px) {
  .result-grid {
    grid-template-columns: 1fr;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
