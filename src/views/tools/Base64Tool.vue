<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>Base64 编码解码</h1>
        <p class="description">文本与 Base64 双向转换，支持 URL 安全编码</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <div class="mode-switch">
            <n-radio-group v-model:value="mode" size="medium">
              <n-radio-button value="encode">编码</n-radio-button>
              <n-radio-button value="decode">解码</n-radio-button>
            </n-radio-group>
            
            <n-checkbox v-model:checked="urlSafe">
              URL 安全编码
            </n-checkbox>
          </div>
          
          <div class="input-output">
            <div class="input-section">
              <div class="section-title">
                <h3>{{ mode === 'encode' ? '输入文本' : '输入 Base64' }}</h3>
                <n-button size="small" @click="clearInput">
                  清空
                </n-button>
              </div>
              <n-input
                v-model:value="inputValue"
                type="textarea"
                :placeholder="mode === 'encode' ? '请输入要编码的文本...' : '请输入 Base64 字符串...'"
                :rows="8"
                @update:value="processInput"
              />
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
                :rows="8"
                readonly
              />
            </div>
          </div>
          
          <div class="examples">
            <h4>示例：</h4>
            <n-space>
              <n-button size="small" @click="loadExample('Hello, World!')">
                Hello, World!
              </n-button>
              <n-button size="small" @click="loadExample('iTools - Dr.Zhang')">
                iTools - Dr.Zhang
              </n-button>
              <n-button size="small" @click="loadExample('你好，世界！')">
                中文示例
              </n-button>
            </n-space>
          </div>
        </n-card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { NCard, NRadioGroup, NRadioButton, NCheckbox, NInput, NButton, NSpace, useMessage } from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { base64Encode, base64Decode, base64EncodeUrlSafe, base64DecodeUrlSafe } from '@/tools/base64'

const message = useMessage()

const mode = ref<'encode' | 'decode'>('encode')
const urlSafe = ref(false)
const inputValue = ref('')
const outputValue = ref('')

const processInput = useDebounceFn((value: string) => {
  if (!value) {
    outputValue.value = ''
    return
  }
  
  try {
    if (mode.value === 'encode') {
      outputValue.value = urlSafe.value
        ? base64EncodeUrlSafe(value)
        : base64Encode(value)
    } else {
      outputValue.value = urlSafe.value
        ? base64DecodeUrlSafe(value)
        : base64Decode(value)
    }
  } catch (error) {
    message.error(error instanceof Error ? error.message : '处理失败')
    outputValue.value = ''
  }
}, 300)

function clearInput() {
  inputValue.value = ''
  outputValue.value = ''
}

function loadExample(text: string) {
  inputValue.value = text
  processInput(text)
}

// Watch for mode changes
watch([mode, urlSafe], () => {
  if (inputValue.value) {
    processInput(inputValue.value)
  }
})
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

.mode-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.input-output {
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

.examples {
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.examples h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .input-output {
    grid-template-columns: 1fr;
  }
  
  .mode-switch {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
