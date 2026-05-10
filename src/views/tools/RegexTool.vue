<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>正则表达式测试</h1>
        <p class="description">在线测试正则表达式，实时显示匹配结果和高亮</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-space>
              <n-button type="primary" @click="testRegex">
                测试匹配
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
            
            <div class="flags-section">
              <span class="flag-label">标志：</span>
              <n-checkbox v-model:checked="flags.global">
                g (全局)
              </n-checkbox>
              <n-checkbox v-model:checked="flags.ignoreCase">
                i (忽略大小写)
              </n-checkbox>
              <n-checkbox v-model:checked="flags.multiline">
                m (多行)
              </n-checkbox>
              <n-checkbox v-model:checked="flags.dotAll">
                s (点号匹配所有)
              </n-checkbox>
            </div>
          </div>
          
          <div class="regex-input-section">
            <div class="section-title">
              <h3>正则表达式</h3>
              <n-space>
                <n-button size="small" @click="loadRegexExample">
                  示例
                </n-button>
              </n-space>
            </div>
            
            <div class="regex-wrapper">
              <span class="regex-delimiter">/</span>
              <n-input
                v-model:value="regexPattern"
                placeholder="输入正则表达式，例如：\d+"
                @update:value="onRegexInput"
              />
              <span class="regex-delimiter">/</span>
              <div class="regex-flags">
                {{ currentFlags }}
              </div>
            </div>
            
            <div v-if="regexError" class="error-message">
              <n-icon :component="AlertCircle" />
              {{ regexError }}
            </div>
          </div>
          
          <div class="test-input-section">
            <div class="section-title">
              <h3>测试文本</h3>
              <n-space>
                <n-button size="small" @click="loadTextExample">
                  示例
                </n-button>
                <n-button size="small" @click="pasteFromClipboard">
                  粘贴
                </n-button>
              </n-space>
            </div>
            
            <n-input
              v-model:value="testText"
              type="textarea"
              placeholder="输入要测试的文本"
              :rows="6"
              @update:value="onTextInput"
            />
          </div>
          
          <div class="results-section">
            <div class="section-title">
              <h3>匹配结果</h3>
              <n-tag v-if="matchCount > 0" type="success">
                找到 {{ matchCount }} 个匹配
              </n-tag>
              <n-tag v-else-if="testText && !regexError" type="warning">
                未找到匹配
              </n-tag>
            </div>
            
            <div v-if="highlightedText" class="highlighted-result" v-html="highlightedText"></div>
            
            <div v-if="matches.length > 0" class="matches-list">
              <h4>匹配详情</h4>
              <n-space vertical>
                <div v-for="(match, index) in matches" :key="index" class="match-item">
                  <div class="match-header">
                    <n-tag size="small">匹配 {{ index + 1 }}</n-tag>
                    <span class="match-position">
                      位置：{{ match.index }} - {{ match.index + match.match.length }}
                    </span>
                  </div>
                  <div class="match-content">
                    <n-input
                      :value="match.match"
                      readonly
                      size="small"
                    >
                      <template #suffix>
                        <CopyButton :text="match.match" size="small" />
                      </template>
                    </n-input>
                  </div>
                  <div v-if="match.groups && match.groups.length > 0" class="match-groups">
                    <h5>捕获组：</h5>
                    <n-space vertical>
                      <div v-for="(group, gIndex) in match.groups" :key="gIndex" class="group-item">
                        <span class="group-label">组 {{ gIndex }}:</span>
                        <n-space>
                          <n-tag size="small">{{ group.value }}</n-tag>
                          <CopyButton :text="group.value" size="small" />
                        </n-space>
                      </div>
                    </n-space>
                  </div>
                </div>
              </n-space>
            </div>
            
            <div v-if="!testText && !regexError" class="empty-result">
              <n-icon :component="Search" size="64" />
              <p>输入正则表达式和测试文本</p>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import {
  NCard, NButton, NSpace, NInput, NIcon, NCheckbox, NTag, useMessage
} from 'naive-ui'
import { AlertCircle, Search } from '@vicons/ionicons5'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const message = useMessage()

const regexPattern = ref('')
const testText = ref('')
const regexError = ref<string | null>(null)
const highlightedText = ref('')
const matches = reactive<Array<{
  match: string
  index: number
  groups?: Array<{ value: string }>
}>>([])

const flags = reactive({
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false
})

const currentFlags = computed(() => {
  let f = ''
  if (flags.global) f += 'g'
  if (flags.ignoreCase) f += 'i'
  if (flags.multiline) f += 'm'
  if (flags.dotAll) f += 's'
  return f
})

const matchCount = computed(() => matches.length)

const processRegex = useDebounceFn(() => {
  if (regexPattern.value && testText.value) {
    testRegex()
  } else {
    clearResults()
  }
}, 300)

function onRegexInput(value: string) {
  processRegex()
}

function onTextInput(value: string) {
  processRegex()
}

function testRegex() {
  regexError.value = null
  matches.length = 0
  highlightedText.value = ''
  
  if (!regexPattern.value.trim()) {
    return
  }
  
  try {
    // 构建正则表达式
    let flagString = ''
    if (flags.global) flagString += 'g'
    if (flags.ignoreCase) flagString += 'i'
    if (flags.multiline) flagString += 'm'
    if (flags.dotAll) flagString += 's'
    
    const regex = new RegExp(regexPattern.value, flagString)
    
    // 查找所有匹配
    let match
    const allMatches: Array<{
      match: string
      index: number
      groups?: Array<{ value: string }>
    }> = []
    
    // 如果不是全局标志，只匹配一次
    if (!flags.global) {
      match = regex.exec(testText.value)
      if (match) {
        const groups = match.slice(1).map((g, i) => ({
          index: i,
          value: g || ''
        }))
        allMatches.push({
          match: match[0],
          index: match.index,
          groups: groups.length > 0 ? groups : undefined
        })
      }
    } else {
      // 全局匹配
      while ((match = regex.exec(testText.value)) !== null) {
        const groups = match.slice(1).map((g, i) => ({
          index: i,
          value: g || ''
        }))
        allMatches.push({
          match: match[0],
          index: match.index,
          groups: groups.length > 0 ? groups : undefined
        })
        
        // 防止空匹配导致的无限循环
        if (match.index === regex.lastIndex) {
          regex.lastIndex++
        }
      }
    }
    
    // 更新匹配结果
    matches.push(...allMatches)
    
    // 高亮显示匹配文本
    if (allMatches.length > 0) {
      highlightedText.value = highlightMatches(testText.value, allMatches, regexPattern.value)
    }
    
    if (allMatches.length > 0) {
      message.success(`找到 ${allMatches.length} 个匹配`)
    } else {
      message.warning('未找到匹配')
    }
    
  } catch (err) {
    regexError.value = err instanceof Error ? err.message : '正则表达式语法错误'
    message.error('正则表达式语法错误')
  }
}

function highlightMatches(text: string, matches: Array<{ match: string; index: number }>, pattern: string): string {
  // 转义 HTML 特殊字符
  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
  
  // 按位置排序匹配项
  const sortedMatches = [...matches].sort((a, b) => a.index - b.index)
  
  let result = ''
  let lastIndex = 0
  
  for (const match of sortedMatches) {
    // 添加匹配前的文本
    result += escapeHtml(text.substring(lastIndex, match.index))
    
    // 添加高亮的匹配文本
    result += `<mark class="highlight">${escapeHtml(match.match)}</mark>`
    
    lastIndex = match.index + match.match.length
  }
  
  // 添加剩余的文本
  result += escapeHtml(text.substring(lastIndex))
  
  return result
}

function clearResults() {
  regexError.value = null
  matches.length = 0
  highlightedText.value = ''
}

function clearAll() {
  regexPattern.value = ''
  testText.value = ''
  clearResults()
  flags.global = true
  flags.ignoreCase = false
  flags.multiline = false
  flags.dotAll = false
}

function loadRegexExample() {
  regexPattern.value = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b'
  message.success('已加载邮箱匹配正则示例')
  setTimeout(() => testRegex(), 100)
}

function loadTextExample() {
  testText.value = `联系邮箱：
support@example.com
sales@company.org
info@test-site.net`
  message.success('已加载示例文本')
  setTimeout(() => testRegex(), 100)
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    testText.value = text
    message.success('粘贴成功')
    setTimeout(() => testRegex(), 100)
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

.flags-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.flag-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
}

.regex-input-section,
.test-input-section,
.results-section {
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

.regex-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.regex-delimiter {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
  padding: 0 4px;
}

.regex-flags {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color-secondary);
  padding: 0 8px;
  min-width: 60px;
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

.highlighted-result {
  padding: 16px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  margin-bottom: 20px;
}

.highlighted-result :deep(.highlight) {
  background-color: rgba(255, 235, 59, 0.5);
  padding: 2px 4px;
  border-radius: 2px;
  font-weight: 600;
}

.matches-list {
  padding: 16px;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
}

.matches-list h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.match-item {
  padding: 12px;
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.match-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.match-position {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.match-content {
  margin-bottom: 8px;
}

.match-groups {
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
}

.match-groups h5 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color-secondary);
  margin-bottom: 8px;
}

.group-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.group-label {
  font-size: 12px;
  color: var(--text-color-secondary);
  min-width: 50px;
}

.empty-result {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-color-secondary);
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .flags-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .regex-wrapper {
    flex-wrap: wrap;
  }
}
</style>
