<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>Base64 转图片</h1>
        <p class="description">粘贴 Base64 编码，生成图片并提供下载</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-space>
              <n-button type="primary" @click="convert" :disabled="!inputValue.trim()">
                转换
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
          </div>
          
          <div class="input-section">
            <div class="section-title">
              <h3>输入 Base64</h3>
              <n-space>
                <n-button size="small" @click="pasteFromClipboard">
                  粘贴
                </n-button>
                <n-button size="small" @click="loadExample">
                  示例
                </n-button>
              </n-space>
            </div>
            <n-input
              v-model:value="inputValue"
              type="textarea"
              placeholder="粘贴 Base64 编码（支持完整 DataURL 或纯 Base64）"
              :rows="6"
              @update:value="onInput"
              :status="inputError ? 'error' : undefined"
            />
            <div v-if="inputError" class="error-message">
              <n-icon :component="AlertCircle" />
              {{ inputError }}
            </div>
            
            <div v-if="inputValue" class="input-info">
              <n-tag size="small">
                长度：{{ inputValue.length }}
              </n-tag>
              <n-tag size="small" v-if="detectedFormat">
                格式：{{ detectedFormat }}
              </n-tag>
            </div>
          </div>
          
          <div class="preview-section">
            <div class="section-title">
              <h3>图片预览</h3>
              <n-space>
                <n-select
                  v-model:value="outputFormat"
                  :options="formatOptions"
                  size="small"
                  style="width: 120px"
                />
                <n-button size="small" @click="downloadImage" :disabled="!imageUrl">
                  下载图片
                </n-button>
              </n-space>
            </div>
            
            <div class="preview-container">
              <div v-if="loading" class="loading-state">
                <n-spin size="large" />
                <p>转换中...</p>
              </div>
              
              <div v-else-if="error" class="error-state">
                <n-icon :component="AlertCircle" size="48" />
                <p>{{ error }}</p>
              </div>
              
              <div v-else-if="imageUrl" class="image-preview">
                <img :src="imageUrl" alt="Preview" />
                <div class="image-info">
                  <n-tag size="small">
                    尺寸：{{ imageWidth }} × {{ imageHeight }}
                  </n-tag>
                  <n-tag size="small">
                    大小：{{ formatFileSize(imageSize) }}
                  </n-tag>
                </div>
              </div>
              
              <div v-else class="empty-state">
                <n-icon :component="Image" size="64" />
                <p>输入 Base64 后点击转换</p>
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
import { useDebounceFn } from '@vueuse/core'
import {
  NCard, NButton, NSpace, NInput, NIcon, NTag, NSpin, NSelect, useMessage
} from 'naive-ui'
import { AlertCircle, Image } from '@vicons/ionicons5'
import type { SelectOption } from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { base64ToBlob, downloadBase64Image } from '@/tools/image'

const message = useMessage()

const inputValue = ref('')
const imageUrl = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const inputError = ref<string | null>(null)
const imageWidth = ref(0)
const imageHeight = ref(0)
const imageSize = ref(0)
const outputFormat = ref<'png' | 'jpeg' | 'webp'>('png')

const formatOptions: SelectOption[] = [
  { label: 'PNG', value: 'png' },
  { label: 'JPEG', value: 'jpeg' },
  { label: 'WebP', value: 'webp' }
]

const detectedFormat = computed(() => {
  if (!inputValue.value) return ''
  
  const match = inputValue.value.match(/data:image\/(\w+);base64,/)
  if (match) {
    return match[1].toUpperCase()
  }
  
  return 'Unknown'
})

const processInput = useDebounceFn(() => {
  if (inputValue.value) {
    convert()
  } else {
    imageUrl.value = ''
    error.value = null
    inputError.value = null
  }
}, 500)

function onInput(value: string) {
  processInput()
}

function convert() {
  const value = inputValue.value.trim()
  
  if (!value) {
    imageUrl.value = ''
    error.value = null
    inputError.value = null
    return
  }
  
  loading.value = true
  error.value = null
  inputError.value = null
  
  try {
    // 确保是完整的 DataURL
    let dataUrl = value
    if (!value.startsWith('data:')) {
      // 尝试自动识别格式
      dataUrl = `data:image/${outputFormat.value};base64,${value}`
    }
    
    // 验证 Base64
    if (!isValidBase64(dataUrl)) {
      throw new Error('无效的 Base64 编码')
    }
    
    imageUrl.value = dataUrl
    
    // 加载图片获取尺寸
    const img = new Image()
    img.onload = () => {
      imageWidth.value = img.width
      imageHeight.value = img.height
      
      // 计算图片大小
      try {
        const base64 = dataUrl.split(',')[1]
        if (base64) {
          imageSize.value = Math.round((base64.length * 3) / 4)
        }
      } catch {
        imageSize.value = 0
      }
      
      message.success('转换成功')
    }
    
    img.onerror = () => {
      throw new Error('无法加载图片，请检查 Base64 编码')
    }
    
    img.src = dataUrl
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : '转换失败'
    imageUrl.value = ''
    message.error('转换失败')
  } finally {
    loading.value = false
  }
}

function clearAll() {
  inputValue.value = ''
  imageUrl.value = ''
  error.value = null
  inputError.value = null
  imageWidth.value = 0
  imageHeight.value = 0
  imageSize.value = 0
}

function pasteFromClipboard() {
  navigator.clipboard.readText()
    .then(text => {
      inputValue.value = text
      message.success('已粘贴')
      setTimeout(() => convert(), 100)
    })
    .catch(() => {
      message.error('无法访问剪贴板')
    })
}

function loadExample() {
  // 生成一个简单的示例 Base64
  inputValue.value = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AoRCy0j/3Wt9QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAgElEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/jcgAB4TwTAAAAABJRU5ErkJggg=='
  message.success('已加载示例 Base64')
  setTimeout(() => convert(), 100)
}

function downloadImage() {
  if (!imageUrl.value) {
    message.warning('请先生成图片')
    return
  }
  
  const filename = `image-${Date.now()}.${outputFormat.value}`
  downloadBase64Image(imageUrl.value, filename)
  message.success('下载已开始')
}

function isValidBase64(dataUrl: string): boolean {
  try {
    // 提取 Base64 部分
    const base64 = dataUrl.split(',')[1]
    if (!base64) return false
    
    // 验证 Base64 格式
    const decoded = atob(base64)
    return decoded.length > 0
  } catch {
    return false
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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

.input-section,
.preview-section {
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

.input-info {
  display: flex;
  gap: 8px;
  padding: 12px;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
  margin-top: 8px;
}

.preview-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
  padding: 24px;
  border: 1px solid var(--border-color);
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-color-secondary);
  min-height: 200px;
}

.error-state {
  color: var(--error-color);
}

.image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 100%;
}

.image-preview img {
  max-width: 100%;
  max-height: 400px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.image-info {
  display: flex;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .section-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .input-info {
    flex-wrap: wrap;
  }
  
  .image-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
