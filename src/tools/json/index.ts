/**
 * JSON 处理工具函数
 */

/**
 * JSON 格式化
 * @param input JSON 字符串
 * @param options 格式化选项
 * @returns 格式化后的 JSON 字符串
 */
export function jsonFormat(input: string, options: { indent?: number; sortKeys?: boolean } = {}): string {
  const { indent = 2, sortKeys = false } = options
  
  try {
    const parsed = JSON.parse(input)
    
    if (sortKeys) {
      return JSON.stringify(sortObjectKeys(parsed), null, indent)
    }
    
    return JSON.stringify(parsed, null, indent)
  } catch (error) {
    throw new Error(`JSON 格式化失败：${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * JSON 压缩
 * @param input JSON 字符串
 * @returns 压缩后的 JSON 字符串
 */
export function jsonMinify(input: string): string {
  try {
    return JSON.stringify(JSON.parse(input))
  } catch (error) {
    throw new Error(`JSON 压缩失败：${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * JSON 验证
 * @param input JSON 字符串
 * @returns 验证结果
 */
export function jsonValidate(input: string): { valid: boolean; error?: { message: string; line?: number; column?: number } } {
  try {
    JSON.parse(input)
    return { valid: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    
    // 尝试解析错误位置
    const positionMatch = errorMessage.match(/position (\d+)/i)
    const position = positionMatch ? parseInt(positionMatch[1]) : undefined
    
    let line, column
    if (position !== undefined) {
      const lines = input.substring(0, position).split('\n')
      line = lines.length
      column = lines[lines.length - 1].length + 1
    }
    
    return {
      valid: false,
      error: {
        message: errorMessage,
        line,
        column
      }
    }
  }
}

/**
 * JSON 转 CSV
 * @param input JSON 字符串
 * @returns CSV 字符串
 */
export function jsonToCsv(input: string): string {
  try {
    const data = JSON.parse(input)
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('JSON 必须是对象数组')
    }
    
    // 获取所有键
    const headers = Array.from(new Set(data.flatMap(obj => Object.keys(obj))))
    
    // 生成 CSV
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(field => {
          const value = row[field] ?? ''
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ]
    
    return csvRows.join('\n')
  } catch (error) {
    throw new Error(`JSON 转 CSV 失败：${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * JSON 转 TypeScript 接口
 * @param input JSON 字符串
 * @param interfaceName 接口名称
 * @returns TypeScript 接口定义
 */
export function jsonToTypeScript(input: string, interfaceName = 'Root'): string {
  try {
    const data = JSON.parse(input)
    
    function getType(value: any, name: string): string {
      if (value === null) return 'null'
      if (Array.isArray(value)) {
        if (value.length === 0) return 'any[]'
        const itemType = getType(value[0], `${name}Item`)
        return `${itemType}[]`
      }
      if (typeof value === 'object') {
        const properties = Object.entries(value)
          .map(([key, val]) => {
            const type = getType(val, `${name}${key.charAt(0).toUpperCase() + key.slice(1)}`)
            return `  ${key}: ${type}`
          })
          .join(';\n')
        return `{\n${properties}\n}`
      }
      return typeof value
    }
    
    const type = getType(data, interfaceName)
    return `interface ${interfaceName} ${type}`
  } catch (error) {
    throw new Error(`JSON 转 TypeScript 失败：${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 对象键排序
 */
function sortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  }
  
  const sorted: any = {}
  Object.keys(obj).sort().forEach(key => {
    sorted[key] = sortObjectKeys(obj[key])
  })
  
  return sorted
}
