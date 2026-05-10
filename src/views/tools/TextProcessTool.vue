<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>文本去重排序</h1>
        <p class="description">文本去重、排序、统计，支持多种排序方式</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-space>
              <n-button type="primary" @click="process">
                处理
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
            
            <div class="stats">
              <n-space>
                <n-tag size="small">行数：{{ stats.lines }}</n-tag>
                <n-tag size="small">唯一行：{{ stats.uniqueLines }}</n-tag>
                <n-tag size="small">字符数：{{ stats.characters }}</n-tag>
                <n-tag size="small">单词数：{{ stats.words }}</n-tag>
              </n-space>
            </div>
          </div>
          
          <div class="options-section">
            <h4>处理选项</h4>
            <n-space>
              <n-checkbox v-model:checked="options.deduplicate">
                去重
              </n-checkbox>
              <n-checkbox v-model:checked="options.caseSensitive">
                区分大小写
              </n-checkbox>
              <n-checkbox v-model:checked="options.trimLines">
                去除首尾空格
              </n-checkbox>
              <n-checkbox v-model:checked="options.removeEmpty">
                去除空行
              </n-checkbox>
              
              <div class="option-divider" />
              
              <span class="option-label">排序方式：</span>
              <n-select
                v-model:value="options.sortBy"
                :options="sortOptions"
                size="small"
                style="width: 150px"
              />
              
              <n-select
                v-model:value="options.sortOrder"
                :options="sortOrderOptions"
                size="small"
                style="width: 100px"
              />
            </n-space>
          </div>
          
          <div class="conversion-grid">
            <div class="input-section">
              <div class="section-title">
                <h3>输入文本</h3>
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
                v-model:value="inputText"
                type="textarea"
                placeholder="输入文本，每行一个项目"
                :rows="12"
                @update:value="onInput"
              />
            </div>
            
            <div class="output-section">
              <div class="section-title">
                <h3>输出结果</h3>
                <CopyButton :text="outputText" />
              </div>
              <n-input
                v-model:value="outputText"
                type="textarea"
                placeholder="处理结果"
                :rows="12"
                readonly
              />
              <div v-if="outputText" class="result-info">
                <n-tag size="small">
                  结果行数：{{ outputText.split('\n').filter(l => l.trim()).length }}
                </n-tag>
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  NCard, NButton, NSpace, NInput, NTag, NCheckbox, NSelect, useMessage
} from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { textDeduplicateAndSort, countTextStats } from '@/tools/text-process'

const message = useMessage()

const inputText = ref('')
const outputText = ref('')

const options = reactive({
  deduplicate: true,
  caseSensitive: true,
  trimLines: true,
  removeEmpty: true,
  sortBy: 'original' as 'original' | 'alphabetical' | 'length' | 'reverse',
  sortOrder: 'asc' as 'asc' | 'desc'
})

const sortOptions: SelectOption[] = [
  { label: '原始顺序', value: 'original' },
  { label: '字母顺序', value: 'alphabetical' },
  { label: '长度排序', value: 'length' },
  { label: '反转顺序', value: 'reverse' }
]

const sortOrderOptions: SelectOption[] = [
  { label: '升序', value: 'asc' },
  { label: '降序', value: 'desc' }
]

const stats = computed(() => countTextStats(inputText.value))

function onInput() {
  // 实时更新统计
}

function process() {
  if (!inputText.value.trim()) {
    message.warning('请输入文本')
    return
  }
  
  try {
    outputText.value = textDeduplicateAndSort(inputText.value, options)
    message.success('处理成功')
  } catch (err) {
    message.error('处理失败')
  }
}

function clearAll() {
  inputText.value = ''
  outputText.value = ''
}

function loadExample() {
  inputText.value = `apple
banana
Apple
  orange  
banana
grape
Apple
  Pear
orange
kiwi`
  message.success('已加载示例文本')
  setTimeout(() => process(), 100)
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
    message.success('粘贴成功')
    setTimeout(() => process(), 100)
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
  flex-wrap: wrap;
  gap: 12px;
}

.stats {
  display: flex;
  align-items: center;
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

.option-divider {
  width: 1px;
  height: 24px;
  background-color: var(--border-color);
  margin: 0 8px;
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
  
  .stats {
    flex-wrap: wrap;
  }
  
  .options-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
