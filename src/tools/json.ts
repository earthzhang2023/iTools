/**
 * JSON 工具函数库
 */

export interface JsonFormatOptions {
  indent?: number
  sortKeys?: boolean
}

/**
 * 格式化 JSON
 */
export function jsonFormat(json: string, options: JsonFormatOptions = {}): string {
  const { indent = 2, sortKeys = false } = options
  const parsed = JSON.parse(json)
  
  if (sortKeys) {
    return JSON.stringify(sortObjectKeys(parsed), null, indent)
  }
  
  return JSON.stringify(parsed, null, indent)
}

/**
 * 压缩 JSON（移除空格和换行）
 */
export function jsonMinify(json: string): string {
  const parsed = JSON.parse(json)
  return JSON.stringify(parsed)
}

/**
 * 验证 JSON
 */
export function jsonValidate(json: string): { valid: boolean; error?: Error } {
  try {
    JSON.parse(json)
    return { valid: true }
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err : new Error('Invalid JSON')
    }
  }
}

/**
 * 递归排序对象键
 */
function sortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  }
  
  const sorted: Record<string, any> = {}
  const keys = Object.keys(obj).sort()
  
  for (const key of keys) {
    sorted[key] = sortObjectKeys(obj[key])
  }
  
  return sorted
}

/**
 * JSON 转 CSV
 */
export function jsonToCsv(json: string): string {
  const data = JSON.parse(json)
  const array = Array.isArray(data) ? data : [data]
  
  if (array.length === 0) {
    return ''
  }
  
  const headers = Object.keys(array[0])
  const csvRows = [headers.join(',')]
  
  for (const row of array) {
    const values = headers.map(header => {
      const value = row[header]
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`
      }
      return value
    })
    csvRows.push(values.join(','))
  }
  
  return csvRows.join('\n')
}

/**
 * CSV 转 JSON
 */
export function csvToJson(csv: string): string {
  const lines = csv.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  
  const result = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const obj: Record<string, any> = {}
    
    headers.forEach((header, index) => {
      obj[header] = values[index]
    })
    
    result.push(obj)
  }
  
  return JSON.stringify(result, null, 2)
}
