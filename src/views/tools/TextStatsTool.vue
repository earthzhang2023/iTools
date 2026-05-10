<template>
  <div class="text-stats-tool">
    <n-grid :cols="1" :x-gap="20" :y-gap="20">
      <!-- 输入区域 -->
      <n-grid-item>
        <n-card :title="null" :bordered="false" class="input-card">
          <n-input
            v-model:value="inputText"
            type="textarea"
            placeholder="请输入要统计的文本..."
            :rows="10"
            show-count
            class="text-input"
          />
        </n-card>
      </n-grid-item>

      <!-- 统计结果 -->
      <n-grid-item>
        <n-card title="统计结果" :bordered="false">
          <template #header-extra>
            <n-button size="small" @click="handleClear">
              <template #icon>
                <n-icon :component="TrashOutline" />
              </template>
              清空
            </n-button>
          </template>

          <n-grid :cols="2" :x-gap="12" :y-gap="12" class="stats-grid">
            <n-grid-item v-for="stat in statsList" :key="stat.key">
              <n-card :bordered="false" class="stat-card">
                <div class="stat-content">
                  <div class="stat-icon" :style="{ backgroundColor: stat.color }">
                    <n-icon :component="stat.icon" :size="24" />
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ stat.value }}</div>
                    <div class="stat-label">{{ stat.label }}</div>
                  </div>
                </div>
              </n-card>
            </n-grid-item>
          </n-grid>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'
import {
  TrashOutline,
  TextOutline,
  ListOutline,
  LanguageOutline,
  ScanOutline,
  BookmarkOutline,
  GridOutline
} from '@vicons/ionicons5'
import { getTextStats } from '@/tools/text-stats'
import { debounce } from 'lodash-es'

const message = useMessage()

// 输入文本
const inputText = ref('')

// 统计结果
const stats = computed(() => getTextStats(inputText.value))

// 统计列表
const statsList = computed(() => [
  {
    key: 'characters',
    label: '总字符数',
    value: stats.value.characters,
    color: '#18a058',
    icon: TextOutline
  },
  {
    key: 'charactersNoSpaces',
    label: '不含空格',
    value: stats.value.charactersNoSpaces,
    color: '#2080f0',
    icon: GridOutline
  },
  {
    key: 'words',
    label: '单词数',
    value: stats.value.words,
    color: '#f0a020',
    icon: ListOutline
  },
  {
    key: 'lines',
    label: '行数',
    value: stats.value.lines,
    color: '#d03050',
    icon: LanguageOutline
  },
  {
    key: 'chineseCharacters',
    label: '中文字符',
    value: stats.value.chineseCharacters,
    color: '#9d6dde',
    icon: ScanOutline
  },
  {
    key: 'spaces',
    label: '空格数',
    value: stats.value.spaces,
    color: '#00b6ad',
    icon: BookmarkOutline
  }
])

// 清空文本
const handleClear = () => {
  inputText.value = ''
  message.success('已清空')
}
</script>

<style scoped lang="scss">
.text-stats-tool {
  max-width: 1200px;
  margin: 0 auto;
}

.input-card {
  :deep(.n-card__content) {
    padding: 0;
  }

  .text-input {
    textarea {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
      font-size: 14px;
      line-height: 1.6;
    }
  }
}

.stats-grid {
  margin-top: 8px;
}

.stat-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  :deep(.n-card__content) {
    padding: 16px;
  }

  .stat-content {
    display: flex;
    align-items: center;
    gap: 12px;

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .stat-info {
      flex: 1;
      min-width: 0;

      .stat-value {
        font-size: 24px;
        font-weight: 600;
        line-height: 1.2;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 13px;
        opacity: 0.7;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .stats-grid {
    :deep(.n-grid) {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  .stat-card {
    .stat-content {
      .stat-icon {
        width: 40px;
        height: 40px;
      }

      .stat-info {
        .stat-value {
          font-size: 20px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .stats-grid {
    :deep(.n-grid) {
      grid-template-columns: 1fr !important;
    }
  }
}
</style>
