/**
 * 文本处理工具函数
 */

/**
 * 文本大小写转换
 * @param input 输入文本
 * @param type 转换类型
 * @returns 转换后的文本
 */
export function caseConvert(
  input: string,
  type: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab'
): string {
  switch (type) {
    case 'upper':
      return input.toUpperCase()
    
    case 'lower':
      return input.toLowerCase()
    
    case 'title':
      return input.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
    
    case 'sentence':
      return input.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase())
    
    case 'camel':
      return input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, '')
    
    case 'pascal':
      return input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) =>
        word.toUpperCase()
      ).replace(/\s+/g, '')
    
    case 'snake':
      return input.replace(/\W+/g, '_').toLowerCase()
    
    case 'kebab':
      return input.replace(/\W+/g, '-').toLowerCase()
    
    default:
      return input
  }
}

/**
 * 文本统计
 * @param input 输入文本
 * @returns 统计结果
 */
export function textStats(input: string): {
  length: number
  charsNoSpace: number
  words: number
  lines: number
  chinese: number
  english: number
  numbers: number
  spaces: number
  special: number
} {
  return {
    length: input.length,
    charsNoSpace: input.replace(/\s/g, '').length,
    words: input.trim() === '' ? 0 : input.trim().split(/\s+/).length,
    lines: input.trim() === '' ? 0 : input.split(/\n/).length,
    chinese: (input.match(/[\u4e00-\u9fa5]/g) || []).length,
    english: (input.match(/[a-zA-Z]/g) || []).length,
    numbers: (input.match(/[0-9]/g) || []).length,
    spaces: (input.match(/\s/g) || []).length,
    special: (input.match(/[^\w\s\u4e00-\u9fa5]/g) || []).length
  }
}

/**
 * 文本去重
 * @param input 输入文本（按行）
 * @returns 去重后的文本
 */
export function textDeduplicate(input: string): string {
  const lines = input.split('\n')
  const unique = [...new Set(lines)]
  return unique.join('\n')
}

/**
 * 文本排序
 * @param input 输入文本（按行）
 * @param type 排序类型
 * @returns 排序后的文本
 */
export function textSort(input: string, type: 'alpha' | 'length' | 'reverse'): string {
  const lines = input.split('\n')
  
  switch (type) {
    case 'alpha':
      return lines.sort().join('\n')
    case 'length':
      return lines.sort((a, b) => a.length - b.length).join('\n')
    case 'reverse':
      return lines.reverse().join('\n')
    default:
      return input
  }
}
