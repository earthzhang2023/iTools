<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>二维码生成器</h1>
        <p class="description">将文本、URL 等转换为二维码图片，支持下载</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-space>
              <n-button type="primary" @click="generate">
                生成二维码
              </n-button>
              <n-button @click="download">
                下载图片
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
          </div>
          
          <div class="content-grid">
            <div class="input-section">
              <div class="section-title">
                <h3>输入内容</h3>
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
                placeholder="输入要生成二维码的文本或 URL"
                :rows="8"
                @update:value="onInput"
              />
              
              <div class="options-section">
                <h4>高级选项</h4>
                <n-space vertical>
                  <div class="option-row">
                    <span class="option-label">尺寸：</span>
                    <n-slider
                      v-model:value="options.width"
                      :min="200"
                      :max="800"
                      :step="50"
                      :marks="{
                        200: '小',
                        400: '中',
                        600: '大',
                        800: '超大'
                      }"
                    />
                  </div>
                  
                  <div class="option-row">
                    <span class="option-label">边距：</span>
                    <n-input-number
                      v-model:value="options.margin"
                      :min="0"
                      :max="10"
                      size="small"
                      style="width: 100px"
                    />
                  </div>
                  
                  <div class="option-row">
                    <span class="option-label">容错率：</span>
                    <n-select
                      v-model:value="options.errorCorrectionLevel"
                      :options="errorCorrectionOptions"
                      size="small"
                      style="width: 120px"
                    />
                  </div>
                  
                  <div class="option-row">
                    <span class="option-label">前景色：</span>
                    <n-color-picker
                      v-model:value="options.color.dark"
                      :modes="['hex']"
                      size="small"
                      style="width: 100px"
                    />
                  </div>
                  
                  <div class="option-row">
                    <span class="option-label">背景色：</span>
                    <n-color-picker
                      v-model:value="options.color.light"
                      :modes="['hex']"
                      size="small"
                      style="width: 100px"
                    />
                  </div>
                </n-space>
              </div>
            </div>
            
            <div class="output-section">
              <div class="section-title">
                <h3>二维码预览</h3>
                <CopyButton v-if="qrcodeDataURL" :text="qrcodeDataURL" />
              </div>
              
              <div class="qrcode-container">
                <div v-if="loading" class="loading-state">
                  <n-spin size="large" />
                  <p>生成中...</p>
                </div>
                
                <div v-else-if="error" class="error-state">
                  <n-icon :component="AlertCircle" size="48" />
                  <p>{{ error }}</p>
                </div>
                
                <div v-else-if="qrcodeDataURL" class="qrcode-result">
                  <img :src="qrcodeDataURL" alt="QR Code" class="qrcode-image" />
                </div>
                
                <div v-else class="empty-state">
                  <n-icon :component="Aperture" size="64" />
                  <p>请输入内容生成二维码</p>
                </div>
              </div>
              
              <div v-if="qrcodeDataURL" class="qrcode-info">
                <n-alert type="info" :bordered="false">
                  右键点击图片可保存，或点击"下载图片"按钮
                </n-alert>
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import {
  NCard, NButton, NSpace, NInput, NIcon, NSpin, NAlert,
  NSlider, NInputNumber, NSelect, NColorPicker, useMessage
} from 'naive-ui'
import { AlertCircle, Aperture } from '@vicons/ionicons5'
import type { SelectOption } from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { generateQRCodeDataURL, downloadQRCode, type QRCodeOptions } from '@/tools/qrcode'

const message = useMessage()

const inputValue = ref('')
const qrcodeDataURL = ref<string>('')
const loading = ref(false)
const error = ref<string | null>(null)

const options = reactive<QRCodeOptions>({
  width: 400,
  margin: 2,
  errorCorrectionLevel: 'M',
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
})

const errorCorrectionOptions: SelectOption[] = [
  { label: '低 (L)', value: 'L' },
  { label: '中 (M)', value: 'M' },
  { label: '高 (Q)', value: 'Q' },
  { label: '最高 (H)', value: 'H' }
]

const processInput = useDebounceFn(() => {
  if (inputValue.value.trim()) {
    generate()
  } else {
    qrcodeDataURL.value = ''
    error.value = null
  }
}, 500)

function onInput(value: string) {
  processInput()
}

async function generate() {
  if (!inputValue.value.trim()) {
    message.warning('请输入内容')
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    qrcodeDataURL.value = await generateQRCodeDataURL(inputValue.value, options)
    message.success('二维码生成成功')
  } catch (err) {
    error.value = '二维码生成失败，请检查输入内容'
    qrcodeDataURL.value = ''
    message.error('生成失败')
  } finally {
    loading.value = false
  }
}

function download() {
  if (!qrcodeDataURL.value) {
    message.warning('请先生成二维码')
    return
  }
  
  const filename = `qrcode-${Date.now()}.png`
  downloadQRCode(qrcodeDataURL.value, filename)
  message.success('下载已开始')
}

function clearAll() {
  inputValue.value = ''
  qrcodeDataURL.value = ''
  error.value = null
}

function loadExample() {
  inputValue.value = 'https://itools.drzhang.site'
  message.success('已加载示例 URL')
  setTimeout(() => generate(), 100)
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    inputValue.value = text
    message.success('粘贴成功')
    setTimeout(() => generate(), 100)
  } catch (err) {
    message.error('无法访问剪贴板')
  }
}

// 监听选项变化
watch(
  () => ({ ...options }),
  () => {
    if (inputValue.value.trim() && qrcodeDataURL.value) {
      generate()
    }
  },
  { deep: true }
)
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  min-width: 60px;
}

.qrcode-container {
  position: relative;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
  padding: 24px;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-color-secondary);
}

.error-state {
  color: var(--error-color);
}

.qrcode-result {
  display: flex;
  align-items: center;
  justify-content: center;
}

.qrcode-image {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
}

.qrcode-info {
  margin-top: 12px;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
