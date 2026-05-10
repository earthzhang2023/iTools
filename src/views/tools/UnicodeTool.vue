<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>Unicode 转换工具</h1>
        <p class="description">文本与 Unicode 编码相互转换，支持多种格式</p>
      </div>
      
      <div class="tool-content">
        <n-grid :cols="1" :x-gap="20" :y-gap="20">
          <!-- 转换模式选择 -->
          <n-grid-item>
            <n-card :bordered="false">
              <n-space>
                <n-radio-group v-model:value="mode" size="large">
                  <n-radio-button value="encode">文本转 Unicode</n-radio-button>
                  <n-radio-button value="decode">Unicode 转文本</n-radio-button>
                  <n-radio-button value="analyze">Unicode 分析</n-radio-button>
                </n-radio-group>
              </n-space>
            </n-card>
          </n-grid-item>

          <!-- 编码选项 -->
          <n-grid-item v-if="mode === 'encode'">
            <n-card :bordered="false">
              <n-space>
                <n-checkbox v-model:checked="encodeOptions.uppercase">大写字母</n-checkbox>
                <n-checkbox v-model:checked="encodeOptions.asciiOnly">仅 ASCII 字符转义</n-checkbox>
              </n-space>
            </n-card>
          </n-grid-item>

          <!-- 输入区域 -->
          <n-grid-item>
            <n-card :title="mode === 'encode' ? '输入文本' : mode === 'decode' ? '输入 Unicode 编码' : '输入要分析的文本'" :bordered="false">
              <template #header-extra>
                <n-space>
                  <n-button size="small" @click="handlePaste">
                    粘贴
                  </n-button>
                  <n-button size="small" @click="handleClear">
                    清空
                  </n-button>
                </n-space>
              </template>

              <n-input
                v-model:value="inputText"
                type="textarea"
                :placeholder="getPlaceholder()"
                :rows="8"
                show-count
                class="text-input"
              />
            </n-card>
          </n-grid-item>

          <!-- 输出区域 -->
          <n-grid-item>
            <n-card :title="mode === 'analyze' ? '分析结果' : '转换结果'" :bordered="false">
              <template #header-extra>
                <n-space>
                  <n-button size="small" @click="handleCopyOutput" :disabled="!outputText">
                    复制
                  </n-button>
                  <n-button size="small" @click="handleDownload" :disabled="!outputText">
                    下载
                  </n-button>
                </n-space>
              </template>

              <n-input
                v-model:value="outputText"
                type="textarea"
                placeholder="转换结果将显示在这里..."
                :rows="8"
                readonly
                class="text-input"
              />

              <!-- 分析模式下的详细信息 -->
              <div v-if="mode === 'analyze' && analysisResults.length > 0" class="analysis-table">
                <n-table :bordered="false" :single-line="false">
                  <thead>
                    <tr>
                      <th>字符</th>
                      <th>Unicode 码点</th>
                      <th>十进制</th>
                      <th>类别</th>
                      <th>转义序列</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in analysisResults" :key="index">
                      <td><code class="char-display">{{ item.char }}</code></td>
                      <td><code>{{ item.codePoint }}</code></td>
                      <td>{{ item.decimal }}</td>
                      <td><n-tag size="small" :type="getCategoryTagType(item.category)">{{ item.category }}</n-tag></td>
                      <td><code>\\u{{ item.codePoint.replace('U+', '').toLowerCase() }}</code></td>
                    </tr>
                  </tbody>
                </n-table>
              </div>
            </n-card>
          </n-grid-item>
        </n-grid>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMessage } from 'naive-ui'
import { textToUnicode, textToUnicodeFull, unicodeToText, analyzeUnicode } from '@/tools/unicode'
import { debounce } from 'lodash-es'

const message = useMessage()

// 转换模式
const mode = ref<'encode' | 'decode' | 'analyze'>('encode')

// 编码选项
const encodeOptions = ref({
  uppercase: false,
  asciiOnly: true
})

// 输入文本
const inputText = ref('')

// 输出文本
const outputText = ref('')

// 分析结果
const analysisResults = ref<Array<{
  char: string
  codePoint: string
  decimal: number
  category: string
}>>([])

// 执行转换
const performConversion = debounce(() => {
  if (!inputText.value) {
    outputText.value = ''
    analysisResults.value = []
    return
  }

  try {
    if (mode.value === 'encode') {
      if (encodeOptions.value.asciiOnly) {
        outputText.value = textToUnicode(inputText.value, {
          format: 'escaped',
          uppercase: encodeOptions.value.uppercase
        })
      } else {
        outputText.value = textToUnicodeFull(inputText.value, {
          format: 'escaped',
          uppercase: encodeOptions.value.uppercase
        })
      }
      analysisResults.value = []
    } else if (mode.value === 'decode') {
      outputText.value = unicodeToText(inputText.value)
      analysisResults.value = []
    } else if (mode.value === 'analyze') {
      analysisResults.value = analyzeUnicode(inputText.value)
      outputText.value = ''
    }

    if (outputText.value || analysisResults.value.length > 0) {
      message.success('转换成功')
    }
  } catch (error) {
    message.error('转换失败：' + (error as Error).message)
    outputText.value = ''
    analysisResults.value = []
  }
}, 300)

// 监听输入和模式变化
watch([inputText, mode, encodeOptions], () => {
  performConversion()
}, { deep: true })

// 获取占位符
function getPlaceholder() {
  switch (mode.value) {
    case 'encode':
      return '请输入要转换为 Unicode 的文本...\n例如：Hello 世界'
    case 'decode':
      return '请输入 Unicode 编码...\n例如：\\u0048\\u0065\\u006C\\u006C\\u006F \\u4e16\\u754c'
    case 'analyze':
      return '请输入要分析 Unicode 信息的文本...'
  }
}

// 粘贴
function handlePaste() {
  navigator.clipboard.readText()
    .then(text => {
      inputText.value = text
      message.success('已粘贴')
    })
    .catch(() => {
      message.error('无法访问剪贴板')
    })
}

// 清空
function handleClear() {
  inputText.value = ''
  outputText.value = ''
  analysisResults.value = []
  message.success('已清空')
}

// 复制输出
function handleCopyOutput() {
  if (!outputText.value) return
  
  navigator.clipboard.writeText(outputText.value)
    .then(() => {
      message.success('已复制到剪贴板')
    })
    .catch(() => {
      message.error('复制失败')
    })
}

// 下载
function handleDownload() {
  if (!outputText.value) return

  const blob = new Blob([outputText.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'unicode-conversion.txt'
  a.click()
  URL.revokeObjectURL(url)
  message.success('已下载')
}

// 获取分类标签类型
function getCategoryTagType(category: string): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (category) {
    case '数字':
      return 'info'
    case '大写字母':
    case '小写字母':
      return 'success'
    case '汉字':
      return 'warning'
    case '空白字符':
    case '标点符号':
      return 'default'
    default:
      return 'default'
  }
}
</script>

<style scoped lang="scss">
.tool-page {
  max-width: 1200px;
  margin: 0 auto;
}

.tool-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-color);
  }

  .description {
    font-size: 14px;
    color: var(--text-color-secondary);
  }
}

.tool-content {
  .text-input {
    textarea {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
      font-size: 14px;
      line-height: 1.6;
    }
  }

  .analysis-table {
    margin-top: 16px;
    max-height: 400px;
    overflow-y: auto;

    .char-display {
      font-size: 18px;
      padding: 4px 8px;
      background-color: var(--bg-color);
      border-radius: var(--radius-sm);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .tool-header {
    h1 {
      font-size: 24px;
    }
  }
}
</style>
