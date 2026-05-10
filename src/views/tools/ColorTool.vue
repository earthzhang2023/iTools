<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>颜色转换工具</h1>
        <p class="description">HEX、RGB、HSL 颜色格式相互转换，支持颜色预览</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="action-bar">
            <n-space>
              <n-button type="primary" @click="convert">
                转换
              </n-button>
              <n-button @click="clearAll">
                清空
              </n-button>
            </n-space>
            
            <div class="options">
              <span class="option-label">转换目标：</span>
              <n-select
                v-model:value="targetFormat"
                :options="formatOptions"
                size="small"
                style="width: 120px"
              />
            </div>
          </div>
          
          <div class="converter-grid">
            <div class="input-section">
              <div class="section-title">
                <h3>输入颜色</h3>
                <n-space>
                  <n-button size="small" @click="loadExample">
                    示例
                  </n-button>
                  <n-color-picker
                    v-model:value="selectedColor"
                    :modes="['hex']"
                    size="small"
                    @update:value="onColorPick"
                  />
                </n-space>
              </div>
              
              <n-input
                v-model:value="inputValue"
                placeholder="#FF5733 或 rgb(255, 87, 51) 或 hsl(11, 100%, 60%)"
                @update:value="onInput"
              >
                <template #prefix>
                  颜色值
                </template>
              </n-input>
              
              <div class="color-preview" :style="{ backgroundColor: previewColor }">
                <div class="preview-label">预览</div>
              </div>
              
              <div class="input-formats">
                <h4>支持的格式</h4>
                <n-space>
                  <n-tag>HEX: #FF5733</n-tag>
                  <n-tag>RGB: rgb(255, 87, 51)</n-tag>
                  <n-tag>HSL: hsl(11, 100%, 60%)</n-tag>
                </n-space>
              </div>
            </div>
            
            <div class="output-section">
              <div class="section-title">
                <h3>转换结果</h3>
                <CopyButton v-if="result" :text="result.value" />
              </div>
              
              <div v-if="result" class="result-container">
                <div class="result-color" :style="{ backgroundColor: result.value }">
                  <div class="color-value">
                    <n-tag :type="result.type === 'hex' ? 'error' : result.type === 'rgb' ? 'success' : 'info'">
                      {{ result.type.toUpperCase() }}
                    </n-tag>
                    <span class="value-text">{{ result.value }}</span>
                  </div>
                </div>
                
                <div class="all-formats">
                  <h4>所有格式</h4>
                  <div class="format-row">
                    <span class="format-label">HEX:</span>
                    <n-space>
                      <n-tag>{{ allFormats.hex }}</n-tag>
                      <CopyButton :text="allFormats.hex" size="small" />
                    </n-space>
                  </div>
                  <div class="format-row">
                    <span class="format-label">RGB:</span>
                    <n-space>
                      <n-tag>{{ allFormats.rgb }}</n-tag>
                      <CopyButton :text="allFormats.rgb" size="small" />
                    </n-space>
                  </div>
                  <div class="format-row">
                    <span class="format-label">HSL:</span>
                    <n-space>
                      <n-tag>{{ allFormats.hsl }}</n-tag>
                      <CopyButton :text="allFormats.hsl" size="small" />
                    </n-space>
                  </div>
                </div>
              </div>
              
              <div v-else class="empty-result">
                <n-icon :component="ColorPalette" size="64" />
                <p>输入颜色值进行转换</p>
              </div>
              
              <div v-if="error" class="error-message">
                <n-icon :component="AlertCircle" />
                {{ error }}
              </div>
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
  NCard, NButton, NSpace, NInput, NIcon, NSelect, NTag, NColorPicker, useMessage
} from 'naive-ui'
import { AlertCircle, ColorPalette } from '@vicons/ionicons5'
import type { SelectOption } from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { convertColor, parseColor, hexToRgb, rgbToHsl, hexToHsl } from '@/tools/color'

const message = useMessage()

const inputValue = ref('')
const selectedColor = ref('#3b82f6')
const targetFormat = ref<'hex' | 'rgb' | 'hsl'>('hex')
const error = ref<string | null>(null)

const previewColor = computed(() => {
  if (!inputValue.value) return selectedColor.value
  const parsed = parseColor(inputValue.value)
  if (parsed) {
    if (parsed.type === 'hex') return parsed.value
    if (parsed.type === 'rgb') return `rgb(${parsed.value.r}, ${parsed.value.g}, ${parsed.value.b})`
    if (parsed.type === 'hsl') return `hsl(${parsed.value.h}, ${parsed.value.s}%, ${parsed.value.l}%)`
  }
  return inputValue.value
})

const formatOptions: SelectOption[] = [
  { label: 'HEX', value: 'hex' },
  { label: 'RGB', value: 'rgb' },
  { label: 'HSL', value: 'hsl' }
]

interface ConvertResult {
  type: 'hex' | 'rgb' | 'hsl'
  value: string
}

const result = ref<ConvertResult | null>(null)

const allFormats = reactive({
  hex: '',
  rgb: '',
  hsl: ''
})

const processInput = useDebounceFn(() => {
  if (inputValue.value.trim()) {
    convert()
  } else {
    result.value = null
    error.value = null
  }
}, 300)

function onInput(value: string) {
  processInput()
}

function onColorPick(value: string) {
  inputValue.value = value
  convert()
}

function convert() {
  if (!inputValue.value.trim()) {
    message.warning('请输入颜色值')
    return
  }
  
  error.value = null
  
  try {
    const converted = convertColor(inputValue.value, targetFormat.value)
    result.value = {
      type: targetFormat.value,
      value: converted
    }
    
    // 计算所有格式
    const parsed = parseColor(inputValue.value)
    if (parsed) {
      if (parsed.type === 'hex') {
        const rgb = hexToRgb(parsed.value)
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        allFormats.hex = parsed.value
        allFormats.rgb = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
        allFormats.hsl = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
      } else if (parsed.type === 'rgb') {
        const hsl = rgbToHsl(parsed.value.r, parsed.value.g, parsed.value.b)
        const hex = '#' + [parsed.value.r, parsed.value.g, parsed.value.b]
          .map(x => x.toString(16).padStart(2, '0'))
          .join('')
        allFormats.hex = hex
        allFormats.rgb = `rgb(${parsed.value.r}, ${parsed.value.g}, ${parsed.value.b})`
        allFormats.hsl = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
      } else if (parsed.type === 'hsl') {
        const hex = '#' + [parsed.value.h, parsed.value.s, parsed.value.l]
          .map(x => x.toString(16).padStart(2, '0'))
          .join('')
        allFormats.hex = hex
        allFormats.rgb = inputValue.value
        allFormats.hsl = `hsl(${parsed.value.h}, ${parsed.value.s}%, ${parsed.value.l}%)`
      }
    }
    
    message.success('转换成功')
  } catch (err) {
    result.value = null
    error.value = '无效的颜色格式，请输入有效的 HEX、RGB 或 HSL 颜色值'
    message.error('转换失败')
  }
}

function clearAll() {
  inputValue.value = ''
  selectedColor.value = '#3b82f6'
  result.value = null
  error.value = null
  allFormats.hex = ''
  allFormats.rgb = ''
  allFormats.hsl = ''
}

function loadExample() {
  inputValue.value = '#FF5733'
  setTimeout(() => convert(), 100)
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
  gap: 12px;
}

.option-label {
  font-size: 14px;
  color: var(--text-color-secondary);
}

.converter-grid {
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

.color-preview {
  height: 120px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.preview-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  font-weight: 500;
}

.input-formats {
  padding: 16px;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
}

.input-formats h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.result-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-color {
  height: 100px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: flex-end;
  padding: 16px;
  box-shadow: var(--shadow-md);
}

.color-value {
  display: flex;
  align-items: center;
  gap: 12px;
}

.value-text {
  font-size: 18px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.all-formats {
  padding: 16px;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
}

.all-formats h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.format-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.format-row:last-child {
  border-bottom: none;
}

.format-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-secondary);
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

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
  color: var(--error-color);
  font-size: 14px;
}

.error-message .n-icon {
  font-size: 18px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .converter-grid {
    grid-template-columns: 1fr;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
