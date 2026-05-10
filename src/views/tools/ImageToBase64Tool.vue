<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>图片转 Base64</h1>
        <p class="description">上传图片，生成 Base64 编码，支持拖拽上传和图片预览</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-space>
              <n-button type="primary" @click="convert" :disabled="!selectedFile">
                转换
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
          </div>
          
          <div class="upload-section">
            <div class="section-title">
              <h3>上传图片</h3>
              <n-space>
                <n-button size="small" @click="triggerFileInput">
                  选择文件
                </n-button>
                <n-button size="small" @click="loadExample">
                  示例
                </n-button>
              </n-space>
            </div>
            
            <div
              class="drop-area"
              :class="{ 'dragover': isDragover }"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="file-input"
                @change="handleFileChange"
              />
              
              <div v-if="!selectedFile" class="drop-hint">
                <n-icon :component="Image" size="64" />
                <p>点击或拖拽图片到这里上传</p>
                <p class="hint-text">支持 JPEG、PNG、GIF、WebP、SVG 格式，最大 10MB</p>
              </div>
              
              <div v-else class="file-info">
                <div class="image-preview">
                  <img :src="previewUrl" alt="Preview" />
                </div>
                <div class="file-details">
                  <n-tag>{{ selectedFile.name }}</n-tag>
                  <n-tag>{{ formatFileSize(selectedFile.size) }}</n-tag>
                  <n-tag>{{ selectedFile.type }}</n-tag>
                </div>
              </div>
            </div>
          </div>
          
          <div class="options-section">
            <h4>高级选项</h4>
            <n-space vertical>
              <div class="option-row">
                <span class="option-label">最大宽度：</span>
                <n-input-number
                  v-model:value="options.maxWidth"
                  :min="100"
                  :max="4096"
                  :step="100"
                  size="small"
                  style="width: 120px"
                />
                <span class="option-unit">px</span>
              </div>
              
              <div class="option-row">
                <span class="option-label">最大高度：</span>
                <n-input-number
                  v-model:value="options.maxHeight"
                  :min="100"
                  :max="4096"
                  :step="100"
                  size="small"
                  style="width: 120px"
                />
                <span class="option-unit">px</span>
              </div>
              
              <div class="option-row">
                <span class="option-label">质量：</span>
                <n-slider
                  v-model:value="options.quality"
                  :min="0.1"
                  :max="1"
                  :step="0.1"
                />
                <span class="option-value">{{ Math.round(options.quality * 100) }}%</span>
              </div>
              
              <div class="option-row">
                <span class="option-label">格式：</span>
                <n-select
                  v-model:value="options.outputFormat"
                  :options="formatOptions"
                  size="small"
                  style="width: 120px"
                />
              </div>
            </n-space>
          </div>
          
          <div class="result-section">
            <div class="section-title">
              <h3>Base64 结果</h3>
              <CopyButton v-if="base64Result" :text="base64Result" />
            </div>
            
            <div v-if="loading" class="loading-state">
              <n-spin size="large" />
              <p>转换中...</p>
            </div>
            
            <div v-else-if="error" class="error-state">
              <n-icon :component="AlertCircle" size="48" />
              <p>{{ error }}</p>
            </div>
            
            <div v-else-if="base64Result" class="result-content">
              <n-input
                v-model:value="base64Result"
                type="textarea"
                placeholder="Base64 结果"
                :rows="6"
                readonly
              />
              
              <div class="result-info">
                <n-tag size="small" type="info">
                  长度：{{ base64Result.length }}
                </n-tag>
                <n-button size="small" @click="copyFullResult">
                  复制完整结果
                </n-button>
              </div>
            </div>
            
            <div v-else class="empty-state">
              <n-icon :component="CodeSlash" size="64" />
              <p>上传图片后点击转换</p>
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
  NCard, NButton, NSpace, NInput, NIcon, NTag, NSpin, NInputNumber, NSlider, NSelect, useMessage
} from 'naive-ui'
import { AlertCircle, Image, CodeSlash } from '@vicons/ionicons5'
import type { SelectOption } from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { imageToBase64, validateImageFile, type ImageToBase64Options } from '@/tools/image'

const message = useMessage()

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const base64Result = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const isDragover = ref(false)

const options = reactive<ImageToBase64Options>({
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  outputFormat: 'jpeg'
})

const formatOptions: SelectOption[] = [
  { label: 'JPEG', value: 'jpeg' },
  { label: 'PNG', value: 'png' },
  { label: 'WebP', value: 'webp' }
]

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    processFile(target.files[0])
  }
}

function handleDragOver() {
  isDragover.value = true
}

function handleDragLeave() {
  isDragover.value = false
}

function handleDrop(event: DragEvent) {
  isDragover.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

function processFile(file: File) {
  const validation = validateImageFile(file)
  if (!validation.valid) {
    error.value = validation.error
    message.error(validation.error)
    return
  }
  
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  error.value = null
  base64Result.value = ''
  message.success('图片上传成功')
}

async function convert() {
  if (!selectedFile.value) {
    message.warning('请先上传图片')
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    base64Result.value = await imageToBase64(selectedFile.value, options)
    message.success('转换成功')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '转换失败'
    message.error('转换失败')
  } finally {
    loading.value = false
  }
}

function clearAll() {
  selectedFile.value = null
  previewUrl.value = ''
  base64Result.value = ''
  error.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function loadExample() {
  // 生成示例图片
  const canvas = document.createElement('canvas')
  canvas.width = 100
  canvas.height = 100
  const ctx = canvas.getContext('2d')
  
  if (ctx) {
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(0, 0, 100, 100)
    ctx.fillStyle = '#ffffff'
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('iTools', 50, 50)
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'example.png', { type: 'image/png' })
        processFile(file)
      }
    })
  }
  
  message.success('已加载示例图片')
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function copyFullResult() {
  if (!base64Result.value) return
  
  navigator.clipboard.writeText(base64Result.value)
    .then(() => {
      message.success('完整结果已复制')
    })
    .catch(() => {
      message.error('复制失败')
    })
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

.upload-section,
.options-section,
.result-section {
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

.drop-area {
  position: relative;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  background-color: var(--bg-color);
}

.drop-area:hover {
  border-color: var(--primary-color);
  background-color: rgba(var(--primary-color-rgb), 0.05);
}

.drop-area.dragover {
  border-color: var(--primary-color);
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
}

.drop-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-color-secondary);
}

.hint-text {
  font-size: 12px;
  opacity: 0.7;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.image-preview {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.options-section {
  padding: 16px;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
}

.options-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.option-label {
  font-size: 14px;
  color: var(--text-color-secondary);
  min-width: 80px;
}

.option-unit,
.option-value {
  font-size: 14px;
  color: var(--text-color-secondary);
  min-width: 40px;
}

.result-section {
  min-height: 200px;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 16px;
  color: var(--text-color-secondary);
}

.error-state {
  color: var(--error-color);
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .file-info {
    flex-direction: column;
    text-align: center;
  }
  
  .option-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .result-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
