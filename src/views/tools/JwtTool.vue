<template>
  <DefaultLayout>
    <div class="tool-page">
      <div class="tool-header">
        <h1>JWT 解析工具</h1>
        <p class="description">解析和验证 JWT Token，查看头部和载荷信息</p>
      </div>
      
      <div class="tool-content">
        <n-grid :cols="1" :x-gap="20" :y-gap="20">
          <!-- 输入区域 -->
          <n-grid-item>
            <n-card title="输入 JWT Token" :bordered="false">
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
                v-model:value="inputToken"
                type="textarea"
                placeholder="请输入 JWT Token（格式：xxxxx.yyyyy.zzzzz）"
                :rows="4"
                show-count
                class="text-input"
              />

              <!-- 验证状态 -->
              <div v-if="validationResult" class="validation-status" :class="validationResult.valid ? 'valid' : 'invalid'">
                <n-alert :type="validationResult.valid ? 'success' : 'error'" :title="validationResult.message">
                  <template v-if="validationResult.expired">
                    <n-tag type="warning" size="small">已过期</n-tag>
                  </template>
                  <template v-if="validationResult.notYetValid">
                    <n-tag type="warning" size="small">未生效</n-tag>
                  </template>
                </n-alert>
              </div>
            </n-card>
          </n-grid-item>

          <!-- 解析结果 -->
          <n-grid-item v-if="jwtData && jwtData.valid">
            <n-grid :cols="1" :x-gap="20" :y-gap="20">
              <!-- JWT 头部 -->
              <n-grid-item>
                <n-card title="JWT 头部 (Header)" :bordered="false">
                  <template #header-extra>
                    <n-button size="small" @click="copyToClipboard(JSON.stringify(jwtData.header, null, 2))">
                      复制
                    </n-button>
                  </template>

                  <n-table :bordered="false" :single-line="false" size="small">
                    <thead>
                      <tr>
                        <th>字段</th>
                        <th>值</th>
                        <th>说明</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>alg</code></td>
                        <td><n-tag size="small" type="info">{{ jwtData.header.alg }}</n-tag></td>
                        <td>签名算法</td>
                      </tr>
                      <tr v-if="jwtData.header.typ">
                        <td><code>typ</code></td>
                        <td><n-tag size="small">{{ jwtData.header.typ }}</n-tag></td>
                        <td>Token 类型</td>
                      </tr>
                      <tr v-if="jwtData.header.kid">
                        <td><code>kid</code></td>
                        <td><n-tag size="small">{{ jwtData.header.kid }}</n-tag></td>
                        <td>密钥 ID</td>
                      </tr>
                    </tbody>
                  </n-table>

                  <n-code :code="JSON.stringify(jwtData.header, null, 2)" language="json" class="json-code" />
                </n-card>
              </n-grid-item>

              <!-- JWT 载荷 -->
              <n-grid-item>
                <n-card title="JWT 载荷 (Payload)" :bordered="false">
                  <template #header-extra>
                    <n-button size="small" @click="copyToClipboard(JSON.stringify(jwtData.payload, null, 2))">
                      复制
                    </n-button>
                  </template>

                  <!-- 标准声明 -->
                  <div v-if="standardClaims.length > 0" class="claims-section">
                    <h3 class="section-title">标准声明</h3>
                    <n-table :bordered="false" :single-line="false" size="small">
                      <thead>
                        <tr>
                          <th>字段</th>
                          <th>值</th>
                          <th>说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="claim in standardClaims" :key="claim.claim">
                          <td><code>{{ claim.claim }}</code></td>
                          <td><span class="claim-value">{{ claim.value }}</span></td>
                          <td>{{ claim.description }}</td>
                        </tr>
                      </tbody>
                    </n-table>
                  </div>

                  <!-- 自定义声明 -->
                  <div v-if="customClaims.length > 0" class="claims-section">
                    <h3 class="section-title">自定义声明</h3>
                    <n-table :bordered="false" :single-line="false" size="small">
                      <thead>
                        <tr>
                          <th>字段</th>
                          <th>值</th>
                          <th>类型</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="claim in customClaims" :key="claim.key">
                          <td><code>{{ claim.key }}</code></td>
                          <td><span class="claim-value">{{ claim.value }}</span></td>
                          <td><n-tag size="small" type="info">{{ claim.type }}</n-tag></td>
                        </tr>
                      </tbody>
                    </n-table>
                  </div>

                  <n-code :code="JSON.stringify(jwtData.payload, null, 2)" language="json" class="json-code" />
                </n-card>
              </n-grid-item>

              <!-- JWT 签名 -->
              <n-grid-item>
                <n-card title="JWT 签名 (Signature)" :bordered="false">
                  <template #header-extra>
                    <n-button size="small" @click="copyToClipboard(jwtData.signature)">
                      复制
                    </n-button>
                  </template>

                  <div class="signature-display">
                    <n-code :code="jwtData.signature" language="text" class="signature-code" />
                  </div>

                  <n-alert type="info" title="说明">
                    <p>JWT 签名用于验证 Token 的完整性和真实性。签名由头部、载荷和密钥通过指定算法生成。</p>
                    <p>前端无法验证签名的有效性，需要服务端使用密钥进行验证。</p>
                  </n-alert>
                </n-card>
              </n-grid-item>

              <!-- JWT 可视化结构 -->
              <n-grid-item>
                <n-card title="JWT 结构可视化" :bordered="false">
                  <div class="jwt-visual">
                    <div class="jwt-part header">
                      <div class="part-label">Header</div>
                      <div class="part-content">{{ inputToken.split('.')[0] }}</div>
                    </div>
                    <div class="jwt-separator">.</div>
                    <div class="jwt-part payload">
                      <div class="part-label">Payload</div>
                      <div class="part-content">{{ inputToken.split('.')[1] }}</div>
                    </div>
                    <div class="jwt-separator">.</div>
                    <div class="jwt-part signature">
                      <div class="part-label">Signature</div>
                      <div class="part-content">{{ inputToken.split('.')[2] }}</div>
                    </div>
                  </div>
                </n-card>
              </n-grid-item>
            </n-grid>
          </n-grid-item>

          <!-- 错误提示 -->
          <n-grid-item v-if="jwtData && !jwtData.valid && jwtData.error">
            <n-alert type="error" title="解析失败">
              {{ jwtData.error }}
            </n-alert>
          </n-grid-item>

          <!-- 空状态 -->
          <n-grid-item v-if="!inputToken">
            <n-empty description="请输入 JWT Token 进行解析" />
          </n-grid-item>
        </n-grid>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMessage } from 'naive-ui'
import { parseJwt, validateJwt, getStandardClaims, getCustomClaims } from '@/tools/jwt'
import { debounce } from 'lodash-es'

const message = useMessage()

// 输入的 JWT Token
const inputToken = ref('')

// 解析结果
const jwtData = ref<ReturnType<typeof parseJwt> | null>(null)

// 验证结果
const validationResult = ref<ReturnType<typeof validateJwt> | null>(null)

// 标准声明
const standardClaims = computed(() => {
  if (!jwtData.value?.payload) return []
  return getStandardClaims(jwtData.value.payload)
})

// 自定义声明
const customClaims = computed(() => {
  if (!jwtData.value?.payload) return []
  return getCustomClaims(jwtData.value.payload)
})

// 解析 JWT
const parseToken = debounce(() => {
  if (!inputToken.value.trim()) {
    jwtData.value = null
    validationResult.value = null
    return
  }

  try {
    // 解析 JWT
    const parsed = parseJwt(inputToken.value.trim())
    jwtData.value = parsed

    if (parsed.valid) {
      // 验证 JWT
      const validation = validateJwt(inputToken.value.trim())
      validationResult.value = validation
      
      if (validation.valid) {
        message.success('JWT 解析成功')
      } else {
        message.warning(validation.message)
      }
    } else {
      validationResult.value = null
      message.error(parsed.error || '解析失败')
    }
  } catch (error) {
    message.error('解析失败：' + (error as Error).message)
    jwtData.value = null
    validationResult.value = null
  }
}, 300)

// 监听输入变化
watch(inputToken, () => {
  parseToken()
})

// 加载示例
function loadExample() {
  // 一个示例 JWT（不包含敏感信息）
  inputToken.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  message.success('已加载示例 JWT')
}

// 粘贴
function handlePaste() {
  navigator.clipboard.readText()
    .then(text => {
      inputToken.value = text.trim()
      message.success('已粘贴')
    })
    .catch(() => {
      message.error('无法访问剪贴板')
    })
}

// 清空
function handleClear() {
  inputToken.value = ''
  jwtData.value = null
  validationResult.value = null
  message.success('已清空')
}

// 复制到剪贴板
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
    .then(() => {
      message.success('已复制')
    })
    .catch(() => {
      message.error('复制失败')
    })
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

  .validation-status {
    margin-top: 16px;
  }

  .json-code {
    margin-top: 16px;
    max-height: 400px;
    overflow-y: auto;
  }

  .claims-section {
    margin-bottom: 20px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--text-color);
    }

    .claim-value {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
      font-size: 13px;
      word-break: break-all;
    }
  }

  .signature-display {
    margin-bottom: 16px;

    .signature-code {
      word-break: break-all;
      white-space: pre-wrap;
    }
  }

  .jwt-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 20px;
    background-color: var(--bg-color);
    border-radius: var(--radius-lg);
    flex-wrap: wrap;

    .jwt-part {
      flex: 1;
      min-width: 200px;
      padding: 12px;
      border-radius: var(--radius-md);
      background-color: var(--card-bg);
      border: 2px solid var(--border-color);

      &.header {
        border-color: #f0a020;

        .part-label {
          color: #f0a020;
        }
      }

      &.payload {
        border-color: #2080f0;

        .part-label {
          color: #2080f0;
        }
      }

      &.signature {
        border-color: #18a058;

        .part-label {
          color: #18a058;
        }
      }

      .part-label {
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 8px;
        text-align: center;
      }

      .part-content {
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
        font-size: 11px;
        word-break: break-all;
        text-align: center;
        color: var(--text-color-secondary);
      }
    }

    .jwt-separator {
      font-size: 24px;
      font-weight: bold;
      color: var(--text-color-secondary);
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

  .jwt-visual {
    flex-direction: column;

    .jwt-separator {
      transform: rotate(90deg);
    }
  }
}
</style>
