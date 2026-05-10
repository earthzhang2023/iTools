/**
 * 文本处理工具函数库
 */

export interface TextProcessOptions {
  caseSensitive?: boolean
  trimLines?: boolean
  removeEmpty?: boolean
  sortBy?: 'original' | 'alphabetical' | 'length' | 'reverse'
  sortOrder?: 'asc' | 'desc'
}

/**
 * 文本去重
 */
export function textDeduplicate(text: string, options: TextProcessOptions = {}): string {
  const {
    caseSensitive = true,
    trimLines = true,
    removeEmpty = true
  } = options
  
  let lines = text.split(/\r?\n/)
  
  // 去除空行
  if (removeEmpty) {
    lines = lines.filter(line => line.trim() !== '')
  }
  
  // 去除首尾空格
  if (trimLines) {
    lines = lines.map(line => line.trim())
  }
  
  // 去重
  const seen = new Set<string>()
  const result: string[] = []
  
  for (const line of lines) {
    const key = caseSensitive ? line : line.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      result.push(line)
    }
  }
  
  return result.join('\n')
}

/**
 * 文本排序
 */
export function textSort(text: string, options: TextProcessOptions = {}): string {
  const {
    sortBy = 'original',
    sortOrder = 'asc',
    trimLines = true,
    removeEmpty = true
  } = options
  
  let lines = text.split(/\r?\n/)
  
  // 去除空行
  if (removeEmpty) {
    lines = lines.filter(line => line.trim() !== '')
  }
  
  // 去除首尾空格
  if (trimLines) {
    lines = lines.map(line => line.trim())
  }
  
  // 排序
  if (sortBy === 'alphabetical') {
    lines.sort((a, b) => {
      const comparison = a.localeCompare(b, 'zh-CN')
      return sortOrder === 'asc' ? comparison : -comparison
    })
  } else if (sortBy === 'length') {
    lines.sort((a, b) => {
      const comparison = a.length - b.length
      return sortOrder === 'asc' ? comparison : -comparison
    })
  } else if (sortBy === 'reverse') {
    lines.reverse()
  }
  
  return lines.join('\n')
}

/**
 * 文本去重并排序
 */
export function textDeduplicateAndSort(text: string, options: TextProcessOptions = {}): string {
  const deduplicated = textDeduplicate(text, options)
  return textSort(deduplicated, options)
}

/**
 * 统计文本信息
 */
export function countTextStats(text: string): {
  lines: number
  characters: number
  charactersNoSpaces: number
  words: number
  uniqueLines: number
} {
  const lines = text.split(/\r?\n/)
  const nonEmptyLines = lines.filter(line => line.trim() !== '')
  const uniqueLinesSet = new Set(lines.map(line => line.trim()))
  
  return {
    lines: nonEmptyLines.length,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim().split(/\s+/).filter(word => word.length > 0).length,
    uniqueLines: uniqueLinesSet.size
  }
}
