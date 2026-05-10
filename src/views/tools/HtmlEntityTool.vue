<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>HTML 实体编码解码工具</h1>
        <p class="description">HTML 特殊字符编码与解码，支持多种实体格式</p>
      </div>
      
      <div class="tool-content">
        <n-grid :cols="1" :x-gap="20" :y-gap="20">
          <!-- 转换模式选择 -->
          <n-grid-item>
            <n-card :bordered="false">
              <n-space>
                <n-radio-group v-model:value="mode" size="large">
                  <n-radio-button value="encode">编码</n-radio-button>
                  <n-radio-button value="decode">解码</n-radio-button>
                  <n-radio-button value="analyze">分析</n-radio-button>
                </n-radio-group>
              </n-space>
            </n-card>
          </n-grid-item>

          <!-- 编码选项 -->
          <n-grid-item v-if="mode === 'encode'">
            <n-card :bordered="false">
              <n-space>
                <n-checkbox v-model:checked="encodeOptions.encodeQuotes">编码引号</n-checkbox>
                <n-checkbox v-model:checked="encodeOptions.encodeSlash">编码斜杠</n-checkbox>
                <n-checkbox v-model:checked="encodeOptions.encodeNonASCII">编码非 ASCII 字符</n-checkbox>
              </n-space>
            </n-card>
          </n-grid-item>

          <!-- 输入区域 -->
          <n-grid-item>
            <n-card :title="mode === 'encode' ? '输入文本' : mode === 'decode' ? '输入 HTML 实体' : '输入要分析的 HTML'" :bordered="false">
              <template #header-extra>
                <n-space>
                  <n-button size="small" @click="handlePaste">
                    粘贴
                  </n-button>
                  <n-button size="small" @click="handleClear">
                    清空
                  </n-button>
                  <n-button size="small" @click="loadExample">
                    示例
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
              <div v-if="mode === 'analyze' && entityStats.length > 0" class="analysis-table">
                <n-table :bordered="false" :single-line="false">
                  <thead>
                    <tr>
                      <th>实体</th>
                      <th>对应字符</th>
                      <th>Unicode 码点</th>
                      <th>出现次数</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in entityStats" :key="index">
                      <td><code>{{ item.entity }}</code></td>
                      <td><code class="char-display">{{ item.character }}</code></td>
                      <td><code>{{ item.codePoint }}</code></td>
                      <td><n-tag size="small" type="info">{{ item.count }}</n-tag></td>
                    </tr>
                  </tbody>
                </n-table>
              </div>

              <!-- 分析模式下无实体时的提示 -->
              <div v-if="mode === 'analyze' && inputText && entityStats.length === 0" class="empty-state">
                <n-empty description="未发现 HTML 实体" />
              </div>
            </n-card>
          </n-grid-item>

          <!-- 常用 HTML 实体参考表 -->
          <n-grid-item>
            <n-card title="常用 HTML 实体参考" :bordered="false">
              <n-table :bordered="false" :single-line="false" size="small">
                <thead>
                  <tr>
                    <th>字符</th>
                    <th>实体名称</th>
                    <th>实体编号</th>
                    <th>描述</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>{{ '&' }}</code></td>
                    <td><code>&amp;amp;</code></td>
                    <td><code>&amp;#38;</code></td>
                    <td>和号</td>
                  </tr>
                  <tr>
                    <td><code>&lt;</code></td>
                    <td><code>&amp;lt;</code></td>
                    <td><code>&amp;#60;</code></td>
                    <td>小于号</td>
                  </tr>
                  <tr>
                    <td><code>&gt;</code></td>
                    <td><code>&amp;gt;</code></td>
                    <td><code>&amp;#62;</code></td>
                    <td>大于号</td>
                  </tr>
                  <tr>
                    <td><code>"</code></td>
                    <td><code>&amp;quot;</code></td>
                    <td><code>&amp;#34;</code></td>
                    <td>双引号</td>
                  </tr>
                  <tr>
                    <td><code>'</code></td>
                    <td><code>&amp;apos;</code></td>
                    <td><code>&amp;#39;</code></td>
                    <td>单引号</td>
                  </tr>
                  <tr>
                    <td><code>{{ '\u00A0' }}</code></td>
                    <td><code>&amp;nbsp;</code></td>
                    <td><code>&amp;#160;</code></td>
                    <td>不间断空格</td>
                  </tr>
                  <tr>
                    <td><code>€</code></td>
                    <td><code>&amp;euro;</code></td>
                    <td><code>&amp;#8364;</code></td>
                    <td>欧元符号</td>
                  </tr>
                  <tr>
                    <td><code>©</code></td>
                    <td><code>&amp;copy;</code></td>
                    <td><code>&amp;#169;</code></td>
                    <td>版权符号</td>
                  </tr>
                </tbody>
              </n-table>
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
import { encodeHtml, decodeHtml, analyzeHtmlEntities } from '@/tools/html-entity'
import { debounce } from 'lodash-es'

const message = useMessage()

// 转换模式
const mode = ref<'encode' | 'decode' | 'analyze'>('encode')

// 编码选项
const encodeOptions = ref({
  encodeQuotes: true,
  encodeSlash: false,
  encodeNonASCII: false
})

// 输入文本
const inputText = ref('')

// 输出文本
const outputText = ref('')

// 实体统计
const entityStats = ref<Array<{
  entity: string
  character: string
  codePoint: string
  count: number
}>>([])

// 执行转换
const performConversion = debounce(() => {
  if (!inputText.value) {
    outputText.value = ''
    entityStats.value = []
    return
  }

  try {
    if (mode.value === 'encode') {
      outputText.value = encodeHtml(inputText.value, encodeOptions.value)
      entityStats.value = []
    } else if (mode.value === 'decode') {
      outputText.value = decodeHtml(inputText.value)
      entityStats.value = []
    } else if (mode.value === 'analyze') {
      outputText.value = ''
      entityStats.value = analyzeHtmlEntities(inputText.value)
    }

    if (outputText.value || entityStats.value.length > 0) {
      message.success('转换成功')
    }
  } catch (error) {
    message.error('转换失败：' + (error as Error).message)
    outputText.value = ''
    entityStats.value = []
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
      return '请输入要编码的文本...\n例如：<scr' + 'ipt>alert("Hello")</scr' + 'ipt>'
    case 'decode':
      return '请输入 HTML 实体...\n例如：&lt;script&gt;alert(&quot;Hello&quot;)&lt;/script&gt;'
    case 'analyze':
      return '请输入 HTML 代码进行分析...\n例如：&lt;div class=&quot;test&quot;&gt;Hello &amp; World&lt;/div&gt;'
  }
}

// 加载示例
function loadExample() {
  if (mode.value === 'encode') {
    inputText.value = '<scr' + 'ipt>alert("Hello World");</scr' + 'ipt>'
    message.success('已加载编码示例')
  } else if (mode.value === 'decode') {
    inputText.value = '&lt;div class=&quot;test&quot;&gt;Hello &amp; World&lt;/div&gt;'
    message.success('已加载解码示例')
  } else {
    inputText.value = '<div class="container">\n  <p>Hello &copy; 2024</p>\n  <a href="test">Link &rarr;</a>\n</div>'
    message.success('已加载分析示例')
  }
  setTimeout(() => performConversion(), 100)
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
  entityStats.value = []
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

  const blob = new Blob([outputText.value], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'html-entity-conversion.txt'
  a.click()
  URL.revokeObjectURL(url)
  message.success('已下载')
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

  .empty-state {
    margin-top: 16px;
    text-align: center;
    padding: 32px;
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
