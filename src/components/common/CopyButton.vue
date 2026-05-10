<template>
  <n-button :size="size" :type="type" @click="handleCopy">
    <template #icon>
      <n-icon :component="CopyOutline" />
    </template>
    <slot>复制</slot>
  </n-button>
</template>

<script setup lang="ts">
import { CopyOutline } from '@vicons/ionicons5'
import { NButton, NIcon, useMessage } from 'naive-ui'

interface Props {
  text: string
  size?: 'small' | 'medium' | 'large'
  type?: 'primary' | 'default'
  tooltip?: string
}

withDefaults(defineProps<Props>(), {
  size: 'small',
  type: 'default'
})

const emit = defineEmits<{
  (e: 'copy', success: boolean): void
}>()

const message = useMessage()

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.text)
    message.success('复制成功')
    emit('copy', true)
  } catch (error) {
    message.error('复制失败')
    emit('copy', false)
  }
}
</script>
