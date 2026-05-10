/**
 * HTML 实体编码解码工具函数
 * 提供 HTML 实体的编码和解码功能
 */

// 常见 HTML 实体映射表
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}

const htmlEntitiesReverse: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&#x2F;': '/',
  '&#x60;': '`',
  '&#x3D;': '='
}

// 命名字符实体映射
const namedEntities: Record<string, string> = {
  'nbsp': '\u00A0',
  'copy': '\u00A9',
  'reg': '\u00AE',
  'trade': '\u2122',
  'mdash': '\u2014',
  'ndash': '\u2013',
  'lsquo': '\u2018',
  'rsquo': '\u2019',
  'ldquo': '\u201C',
  'rdquo': '\u201D',
  'hellip': '\u2026',
  'bull': '\u2022',
  'euro': '\u20AC',
  'pound': '\u00A3',
  'yen': '\u00A5',
  'cent': '\u00A2'
}

export interface HtmlEncodeOptions {
  encodeQuotes: boolean // 是否编码引号
  encodeSlash: boolean // 是否编码斜杠
  encodeNonASCII: boolean // 是否编码非 ASCII 字符
}

/**
 * 将文本编码为 HTML 实体
 * @param text 输入文本
 * @param options 编码选项
 * @returns HTML 实体编码字符串
 */
export function encodeHtml(text: string, options: HtmlEncodeOptions = { 
  encodeQuotes: true, 
  encodeSlash: false,
  encodeNonASCII: false 
}): string {
  if (!text) return ''

  let result = ''
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const code = char.charCodeAt(0)
    
    // 基本字符实体
    if (htmlEntities[char]) {
      // 处理引号
      if ((char === '"' || char === "'") && !options.encodeQuotes) {
        result += char
      } 
      // 处理斜杠
      else if (char === '/' && !options.encodeSlash) {
        result += char
      }
      else {
        result += htmlEntities[char]
      }
    }
    // 非 ASCII 字符
    else if (options.encodeNonASCII && code > 127) {
      result += `&#x${code.toString(16).toUpperCase()};`
    }
    else {
      result += char
    }
  }
  
  return result
}

/**
 * 将 HTML 实体解码为文本
 * @param html HTML 实体编码字符串
 * @returns 解码后的文本
 */
export function decodeHtml(html: string): string {
  if (!html) return ''

  return html
    // 解码十六进制实体
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
    // 解码十进制实体
    .replace(/&#(\d+);/g, (_, dec) => {
      return String.fromCharCode(parseInt(dec, 10))
    })
    // 解码命名实体
    .replace(/&([a-zA-Z]+);/g, (_, name) => {
      // 先检查标准实体
      if (htmlEntitiesReverse[`&${name};`]) {
        return htmlEntitiesReverse[`&${name};`]
      }
      // 检查命名字符实体
      if (namedEntities[name]) {
        return namedEntities[name]
      }
      // 未知实体，保持原样
      return `&${name};`
    })
}

/**
 * 获取文本中所有 HTML 实体的统计信息
 * @param text 输入文本（可以是编码或未编码的）
 * @returns 实体统计信息
 */
export function analyzeHtmlEntities(text: string): Array<{
  entity: string
  character: string
  codePoint: string
  count: number
}> {
  if (!text) return []

  const entityMap = new Map<string, { character: string; count: number }>()

  // 查找所有实体
  const entityRegex = /&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g
  let match

  while ((match = entityRegex.exec(text)) !== null) {
    const entity = match[0]
    let character = ''

    // 解码实体获取字符
    if (entity.startsWith('&#x')) {
      const hex = entity.slice(3, -1)
      character = String.fromCharCode(parseInt(hex, 16))
    } else if (entity.startsWith('&#')) {
      const dec = entity.slice(2, -1)
      character = String.fromCharCode(parseInt(dec, 10))
    } else {
      const name = entity.slice(1, -1)
      if (htmlEntitiesReverse[entity]) {
        character = htmlEntitiesReverse[entity]
      } else if (namedEntities[name]) {
        character = namedEntities[name]
      }
    }

    if (character) {
      const existing = entityMap.get(entity)
      if (existing) {
        existing.count++
      } else {
        entityMap.set(entity, { 
          character, 
          count: 1 
        })
      }
    }
  }

  return Array.from(entityMap.entries()).map(([entity, data]) => ({
    entity,
    character: data.character === ' ' ? '\\u00A0' : data.character,
    codePoint: `U+${data.character.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`,
    count: data.count
  }))
}

/**
 * 检查文本是否包含 HTML 实体
 * @param text 输入文本
 * @returns 是否包含 HTML 实体
 */
export function containsHtmlEntities(text: string): boolean {
  if (!text) return false
  return /&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/.test(text)
}
