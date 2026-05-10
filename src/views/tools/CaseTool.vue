<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>文本大小写转换</h1>
        <p class="description">文本大小写转换、命名格式转换、文本统计</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-space>
              <n-button type="primary" @click="convert('camelCase')">
                驼峰命名
              </n-button>
              <n-button @click="convert('pascalCase')">
                大驼峰
              </n-button>
              <n-button @click="convert('kebab-case')">
                短横线
              </n-button>
              <n-button @click="convert('snake_case')">
                下划线
              </n-button>
              <n-button @click="convert('CONSTANT_CASE')">
                常量
              </n-button>
            </n-space>
            
            <n-space>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
          </div>
          
          <div class="conversion-grid">
            <div class="input-section">
              <div class="section-title">
                <h3>输入文本</h3>
                <n-space>
                  <n-button size="small" @click="loadExample">
                    加载示例
                  </n-button>
                  <n-button size="small" @click="pasteFromClipboard">
                    粘贴
                  </n-button>
                </n-space>
              </div>
              <n-input
                v-model:value="inputValue"
                type="textarea"
                placeholder="输入要转换的文本"
                :rows="10"
                @update:value="onInput"
              />
              
              <div class="stats-bar">
                <n-space>
                  <n-tag size="small">
                    字符：{{ stats.characters }}
                  </n-tag>
                  <n-tag size="small">
                    单词：{{ stats.words }}
                  </n-tag>
                  <n-tag size="small">
                    行数：{{ stats.lines }}
                  </n-tag>
                </n-space>
              </div>
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
              />
            </div>
          </div>
          
          <div class="more-conversions">
            <h3>更多转换</h3>
            <n-grid :cols="2" :x-gap="12" :y-gap="12">
              <n-gi v-for="item in conversionOptions" :key="item.value">
                <n-button
                  @click="convert(item.value)"
                  block
                  :quaternary="lastConversion !== item.value"
                >
                  {{ item.label }}
                </n-button>
              </n-gi>
            </n-grid>
          </div>
        </n-card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NCard, NButton, NSpace, NInput, NTag, NGrid, NGi, useMessage
} from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import {
  toCamelCase,
  toPascalCase,
  toKebabCase,
  toSnakeCase,
  toConstantCase,
  toSentenceCase,
  toTitleCase,
  toLowerCase,
  toUpperCase,
  toggleCase,
  removeHtmlTags,
  removeExtraSpaces,
  reverseString,
  randomCase,
  countCharacters,
  countWords,
  countLines
} from '@/tools/text'

const message = useMessage()

const inputValue = ref('')
const outputValue = ref('')
const lastConversion = ref<string>('')

const conversionOptions = [
  { label: '句子大小写', value: 'sentenceCase' },
  { label: '标题大小写', value: 'titleCase' },
  { label: '全部大写', value: 'toUpperCase' },
  { label: '全部小写', value: 'toLowerCase' },
  { label: '反转大小写', value: 'toggleCase' },
  { label: '随机大小写', value: 'randomCase' },
  { label: '移除 HTML 标签', value: 'removeHtmlTags' },
  { label: '移除多余空格', value: 'removeExtraSpaces' },
  { label: '反转字符串', value: 'reverseString' }
]

const stats = computed(() => ({
  characters: countCharacters(inputValue.value),
  words: countWords(inputValue.value),
  lines: countLines(inputValue.value)
}))

function onInput(value: string) {
  // 实时统计更新
}

function convert(type: string) {
  if (!inputValue.value.trim()) {
    message.warning('请输入文本')
    return
  }
  
  try {
    let result = ''
    
    switch (type) {
      case 'camelCase':
        result = toCamelCase(inputValue.value)
        break
      case 'pascalCase':
        result = toPascalCase(inputValue.value)
        break
      case 'kebab-case':
        result = toKebabCase(inputValue.value)
        break
      case 'snake_case':
        result = toSnakeCase(inputValue.value)
        break
      case 'CONSTANT_CASE':
        result = toConstantCase(inputValue.value)
        break
      case 'sentenceCase':
        result = toSentenceCase(inputValue.value)
        break
      case 'titleCase':
        result = toTitleCase(inputValue.value)
        break
      case 'toLowerCase':
        result = toLowerCase(inputValue.value)
        break
      case 'toUpperCase':
        result = toUpperCase(inputValue.value)
        break
      case 'toggleCase':
        result = toggleCase(inputValue.value)
        break
      case 'randomCase':
        result = randomCase(inputValue.value)
        break
      case 'removeHtmlTags':
        result = removeHtmlTags(inputValue.value)
        break
      case 'removeExtraSpaces':
        result = removeExtraSpaces(inputValue.value)
        break
      case 'reverseString':
        result = reverseString(inputValue.value)
        break
      default:
        throw new Error('未知的转换类型')
    }
    
    outputValue.value = result
    lastConversion.value = type
    message.success('转换成功')
  } catch (err) {
    message.error('转换失败')
  }
}

function clearAll() {
  inputValue.value = ''
  outputValue.value = ''
  lastConversion.value = ''
}

function loadExample() {
  inputValue.value = 'Hello World! This is a Sample Text for Conversion Testing.'
  message.success('已加载示例文本')
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
  flex-wrap: wrap;
  gap: 12px;
}

.conversion-grid {
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

.stats-bar {
  padding: 12px;
  background-color: var(--background-color-secondary);
  border-radius: var(--radius-md);
}

.more-conversions {
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.more-conversions h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
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
