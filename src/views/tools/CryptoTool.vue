<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>加密哈希工具</h1>
        <p class="description">支持 MD5、SHA-1、SHA-256、SHA-512 等多种哈希算法，以及 AES 加密解密</p>
      </div>
      
      <div class="tool-content">
        <n-card>
          <n-tabs v-model:value="activeTab" type="segment">
            <n-tab-pane name="hash" tab="哈希计算" />
            <n-tab-pane name="hmac" tab="HMAC" />
            <n-tab-pane name="aes" tab="AES 加解密" />
          </n-tabs>
          
          <!-- 哈希计算 -->
          <template v-if="activeTab === 'hash'">
            <div class="action-bar">
              <n-space>
                <n-button type="primary" @click="calculateHash">
                  计算哈希
                </n-button>
                <n-button @click="clearAll">
                  清空
                </n-button>
              </n-space>
              
              <div class="options">
                <n-select
                  v-model:value="hashAlgorithm"
                  :options="hashAlgorithmOptions"
                  size="small"
                  style="width: 150px"
                />
              </div>
            </div>
            
            <div class="input-output">
              <div class="input-section">
                <div class="section-title">
                  <h3>输入文本</h3>
                  <n-space>
                    <n-button size="small" @click="loadHashExample">
                      示例
                    </n-button>
                    <n-button size="small" @click="pasteFromClipboard">
                      粘贴
                    </n-button>
                  </n-space>
                </div>
                <n-input
                  v-model:value="inputValue"
                  type="textarea"
                  placeholder="输入要计算哈希的文本"
                  :rows="6"
                  @update:value="onHashInput"
                />
              </div>
              
              <div class="output-section">
                <div class="section-title">
                  <h3>哈希结果</h3>
                  <CopyButton :text="hashResult" />
                </div>
                <n-input
                  v-model:value="hashResult"
                  type="textarea"
                  placeholder="哈希结果"
                  :rows="6"
                  readonly
                />
                <div v-if="hashResult" class="result-info">
                  <n-tag size="small" type="info">
                    {{ hashAlgorithm.toUpperCase() }}
                  </n-tag>
                  <n-tag size="small" type="success">
                    {{ hashResult.length }} 字符
                  </n-tag>
                </div>
              </div>
            </div>
          </template>
          
          <!-- HMAC -->
          <template v-if="activeTab === 'hmac'">
            <div class="action-bar">
              <n-space>
                <n-button type="primary" @click="calculateHMAC">
                  计算 HMAC
                </n-button>
                <n-button @click="clearAll">
                  清空
                </n-button>
              </n-space>
              
              <div class="options">
                <n-select
                  v-model:value="hmacAlgorithm"
                  :options="hmacAlgorithmOptions"
                  size="small"
                  style="width: 150px"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">密钥</label>
              <n-input
                v-model:value="hmacSecret"
                type="password"
                placeholder="输入密钥"
                show-password-on="click"
              />
            </div>
            
            <div class="input-output">
              <div class="input-section">
                <div class="section-title">
                  <h3>输入文本</h3>
                  <n-space>
                    <n-button size="small" @click="loadHMACExample">
                      示例
                    </n-button>
                  </n-space>
                </div>
                <n-input
                  v-model:value="hmacInput"
                  type="textarea"
                  placeholder="输入要计算 HMAC 的文本"
                  :rows="4"
                />
              </div>
              
              <div class="output-section">
                <div class="section-title">
                  <h3>HMAC 结果</h3>
                  <CopyButton :text="hmacResult" />
                </div>
                <n-input
                  v-model:value="hmacResult"
                  type="textarea"
                  placeholder="HMAC 结果"
                  :rows="4"
                  readonly
                />
              </div>
            </div>
          </template>
          
          <!-- AES 加解密 -->
          <template v-if="activeTab === 'aes'">
            <div class="action-bar">
              <n-space>
                <n-button type="primary" @click="aesEncryptText">
                  加密
                </n-button>
                <n-button @click="aesDecryptText">
                  解密
                </n-button>
                <n-button @click="clearAll">
                  清空
                </n-button>
              </n-space>
            </div>
            
            <div class="form-group">
              <label class="form-label">密钥</label>
              <n-input
                v-model:value="aesKey"
                type="password"
                placeholder="输入加密密钥"
                show-password-on="click"
              />
            </div>
            
            <div class="input-output">
              <div class="input-section">
                <div class="section-title">
                  <h3>输入文本</h3>
                  <n-space>
                    <n-button size="small" @click="loadAESEncryptExample">
                      加密示例
                    </n-button>
                    <n-button size="small" @click="loadAESDecryptExample">
                      解密示例
                    </n-button>
                  </n-space>
                </div>
                <n-input
                  v-model:value="aesInput"
                  type="textarea"
                  placeholder="输入要加密或解密的文本"
                  :rows="4"
                />
              </div>
              
              <div class="output-section">
                <div class="section-title">
                  <h3>输出结果</h3>
                  <CopyButton :text="aesResult" />
                </div>
                <n-input
                  v-model:value="aesResult"
                  type="textarea"
                  placeholder="输出结果"
                  :rows="4"
                  readonly
                  :status="aesError ? 'error' : undefined"
                />
                <div v-if="aesError" class="error-message">
                  <n-icon :component="AlertCircle" />
                  {{ aesError }}
                </div>
              </div>
            </div>
          </template>
        </n-card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import {
  NCard, NButton, NSpace, NInput, NIcon, NTabs, NTabPane,
  NSelect, NTag, useMessage
} from 'naive-ui'
import { AlertCircle } from '@vicons/ionicons5'
import type { SelectOption } from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import {
  hash,
  hmacSHA256,
  hmacSHA512,
  aesEncrypt,
  aesDecrypt,
  type HashAlgorithm
} from '@/tools/crypto'

const message = useMessage()

// 哈希计算
const activeTab = ref<'hash' | 'hmac' | 'aes'>('hash')
const inputValue = ref('')
const hashResult = ref('')
const hashAlgorithm = ref<HashAlgorithm>('sha256')

const hashAlgorithmOptions: SelectOption[] = [
  { label: 'MD5', value: 'md5' },
  { label: 'SHA-1', value: 'sha1' },
  { label: 'SHA-256', value: 'sha256' },
  { label: 'SHA-512', value: 'sha512' }
]

const processHashInput = useDebounceFn(() => {
  if (inputValue.value.trim()) {
    calculateHash()
  } else {
    hashResult.value = ''
  }
}, 300)

function onHashInput(value: string) {
  processHashInput()
}

function calculateHash() {
  if (!inputValue.value.trim()) {
    message.warning('请输入文本')
    return
  }
  
  try {
    hashResult.value = hash(inputValue.value, hashAlgorithm.value)
    message.success('哈希计算成功')
  } catch (err) {
    hashResult.value = ''
    message.error('计算失败')
  }
}

// HMAC
const hmacInput = ref('')
const hmacSecret = ref('')
const hmacResult = ref('')
const hmacAlgorithm = ref<'sha256' | 'sha512'>('sha256')

const hmacAlgorithmOptions: SelectOption[] = [
  { label: 'HMAC-SHA256', value: 'sha256' },
  { label: 'HMAC-SHA512', value: 'sha512' }
]

function calculateHMAC() {
  if (!hmacInput.value.trim() || !hmacSecret.value) {
    message.warning('请输入文本和密钥')
    return
  }
  
  try {
    hmacResult.value = hmacAlgorithm.value === 'sha256'
      ? hmacSHA256(hmacInput.value, hmacSecret.value)
      : hmacSHA512(hmacInput.value, hmacSecret.value)
    message.success('HMAC 计算成功')
  } catch (err) {
    hmacResult.value = ''
    message.error('计算失败')
  }
}

// AES
const aesInput = ref('')
const aesKey = ref('')
const aesResult = ref('')
const aesError = ref<string | null>(null)

function aesEncryptText() {
  if (!aesInput.value || !aesKey.value) {
    message.warning('请输入文本和密钥')
    return
  }
  
  try {
    aesResult.value = aesEncrypt(aesInput.value, aesKey.value)
    aesError.value = null
    message.success('加密成功')
  } catch (err) {
    aesResult.value = ''
    aesError.value = '加密失败'
    message.error('加密失败')
  }
}

function aesDecryptText() {
  if (!aesInput.value || !aesKey.value) {
    message.warning('请输入密文和密钥')
    return
  }
  
  try {
    const result = aesDecrypt(aesInput.value, aesKey.value)
    if (!result) {
      throw new Error('解密结果为空')
    }
    aesResult.value = result
    aesError.value = null
    message.success('解密成功')
  } catch (err) {
    aesResult.value = ''
    aesError.value = '解密失败，请检查密钥是否正确'
    message.error('解密失败')
  }
}

// 通用功能
function clearAll() {
  inputValue.value = ''
  hashResult.value = ''
  hmacInput.value = ''
  hmacSecret.value = ''
  hmacResult.value = ''
  aesInput.value = ''
  aesKey.value = ''
  aesResult.value = ''
  aesError.value = null
}

function loadHashExample() {
  inputValue.value = 'Hello, World!'
  setTimeout(() => calculateHash(), 100)
}

function loadHMACExample() {
  hmacInput.value = 'Hello, World!'
  hmacSecret.value = 'my-secret-key'
  setTimeout(() => calculateHMAC(), 100)
}

function loadAESEncryptExample() {
  aesInput.value = 'Hello, World!'
  aesKey.value = 'my-secret-key'
}

function loadAESDecryptExample() {
  aesInput.value = 'U2FsdGVkX1+vupppZsVJcVL9vfV5G5bQKQVlQmJlY3JldA=='
  aesKey.value = 'my-secret-key'
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    inputValue.value = text
    message.success('粘贴成功')
    setTimeout(() => calculateHash(), 100)
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

.options {
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-output {
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
  gap: 8px;
  margin-top: 8px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 8px;
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

@media (max-width: 768px) {
  .input-output {
    grid-template-columns: 1fr;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
