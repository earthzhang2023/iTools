/**
 * Unicode 转换工具函数
 * 提供文本与 Unicode 编码之间的相互转换功能
 */

export interface UnicodeEncodeOptions {
  format: 'escaped' | 'raw' // escaped: \uXXXX 格式，raw: 直接 Unicode 字符
  uppercase: boolean // 是否使用大写字母
}

/**
 * 将文本编码为 Unicode
 * @param text 输入文本
 * @param options 编码选项
 * @returns Unicode 编码字符串
 */
export function textToUnicode(text: string, options: UnicodeEncodeOptions = { format: 'escaped', uppercase: false }): string {
  if (!text) return ''

  let result = ''
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i)
    
    if (options.format === 'escaped') {
      // 对于 ASCII 可打印字符，可以选择保留原样
      if (charCode >= 0x20 && charCode <= 0x7E) {
        result += text[i]
      } else {
        const hex = charCode.toString(16).padStart(4, '0')
        result += `\\u${options.uppercase ? hex.toUpperCase() : hex}`
      }
    } else {
      // raw 格式直接输出字符
      result += text[i]
    }
  }
  
  return result
}

/**
 * 将文本全部转换为 Unicode 转义序列（包括 ASCII 字符）
 * @param text 输入文本
 * @param options 编码选项
 * @returns 完整的 Unicode 转义序列
 */
export function textToUnicodeFull(text: string, options: UnicodeEncodeOptions = { format: 'escaped', uppercase: false }): string {
  if (!text) return ''

  let result = ''
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i)
    const hex = charCode.toString(16).padStart(4, '0')
    result += `\\u${options.uppercase ? hex.toUpperCase() : hex}`
  }
  
  return result
}

/**
 * 将 Unicode 编码解码为文本
 * @param unicode Unicode 编码字符串
 * @returns 解码后的文本
 */
export function unicodeToText(unicode: string): string {
  if (!unicode) return ''

  // 替换 \\uXXXX 格式
  return unicode.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16))
  })
}

/**
 * 获取字符的 Unicode 码点
 * @param char 单个字符
 * @returns Unicode 码点（十六进制）
 */
export function getUnicodeCodePoint(char: string): string {
  if (!char || char.length !== 1) return ''
  
  const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')
  return `U+${code}`
}

/**
 * 分析文本中的每个字符的 Unicode 信息
 * @param text 输入文本
 * @returns 每个字符的 Unicode 信息数组
 */
export function analyzeUnicode(text: string): Array<{
  char: string
  codePoint: string
  decimal: number
  category: string
}> {
  if (!text) return []

  const categories: Record<string, string> = {
    '0-9': '数字',
    'A-Z': '大写字母',
    'a-z': '小写字母',
    '\u4e00-\u9fa5': '汉字',
    'other': '其他字符'
  }

  return text.split('').map(char => {
    const code = char.charCodeAt(0)
    const hex = code.toString(16).toUpperCase().padStart(4, '0')
    
    let category = '其他字符'
    if (/[0-9]/.test(char)) category = '数字'
    else if (/[A-Z]/.test(char)) category = '大写字母'
    else if (/[a-z]/.test(char)) category = '小写字母'
    else if (/[\u4e00-\u9fa5]/.test(char)) category = '汉字'
    else if (/\s/.test(char)) category = '空白字符'
    else if (/[.,!?;:'"(){}\[\]<>，。！？；：'"（）{}【】《》]/.test(char)) category = '标点符号'

    return {
      char,
      codePoint: `U+${hex}`,
      decimal: code,
      category
    }
  })
}
