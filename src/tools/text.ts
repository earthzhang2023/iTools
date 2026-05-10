/**
 * 文本工具函数库
 */

/**
 * 转换为驼峰命名
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^[A-Z]/, char => char.toLowerCase())
}

/**
 * 转换为帕斯卡命名（大驼峰）
 */
export function toPascalCase(str: string): string {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

/**
 * 转换为短横线命名
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[-_\s]+/g, '-')
    .toLowerCase()
}

/**
 * 转换为下划线命名
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase()
}

/**
 * 转换为常量命名（大写 + 下划线）
 */
export function toConstantCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toUpperCase()
}

/**
 * 转换为句子大小写
 */
export function toSentenceCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, char => char.toUpperCase())
}

/**
 * 转换为标题大小写
 */
export function toTitleCase(str: string): string {
  const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'in', 'of']
  
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index === 0 || !minorWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      return word
    })
    .join(' ')
}

/**
 * 转换为小写
 */
export function toLowerCase(str: string): string {
  return str.toLowerCase()
}

/**
 * 转换为大写
 */
export function toUpperCase(str: string): string {
  return str.toUpperCase()
}

/**
 * 反转大小写
 */
export function toggleCase(str: string): string {
  return str
    .split('')
    .map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase()
      }
      return char.toUpperCase()
    })
    .join('')
}

/**
 * 移除 HTML 标签
 */
export function removeHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

/**
 * 移除多余空格
 */
export function removeExtraSpaces(str: string): string {
  return str.replace(/\s+/g, ' ').trim()
}

/**
 * 统计字符数
 */
export function countCharacters(str: string, excludeSpaces: boolean = false): number {
  if (excludeSpaces) {
    return str.replace(/\s/g, '').length
  }
  return str.length
}

/**
 * 统计单词数
 */
export function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(word => word.length > 0).length
}

/**
 * 统计行数
 */
export function countLines(str: string): number {
  if (!str.trim()) return 0
  return str.split(/\r\n|\r|\n/).length
}

/**
 * 反转字符串
 */
export function reverseString(str: string): string {
  return str.split('').reverse().join('')
}

/**
 * 随机大小写
 */
export function randomCase(str: string): string {
  return str
    .split('')
    .map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase())
    .join('')
}
