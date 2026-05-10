/**
 * JSON 转 CSV 工具函数库
 */

export interface JsonToCsvOptions {
  delimiter?: string
  quote?: string
  escape?: string
  includeHeader?: boolean
}

/**
 * JSON 转 CSV
 */
export function jsonToCsv(json: string, options: JsonToCsvOptions = {}): string {
  const {
    delimiter = ',',
    quote = '"',
    escape = '"',
    includeHeader = true
  } = options
  
  try {
    const data = JSON.parse(json)
    const array = Array.isArray(data) ? data : [data]
    
    if (array.length === 0) {
      return ''
    }
    
    // 获取所有键（合并所有对象的键）
    const allKeys = new Set<string>()
    array.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => allKeys.add(key))
      }
    })
    
    const headers = Array.from(allKeys)
    const csvRows: string[] = []
    
    // 添加表头
    if (includeHeader) {
      csvRows.push(headers.map(h => escapeField(h, quote, escape)).join(delimiter))
    }
    
    // 添加数据行
    for (const row of array) {
      if (typeof row === 'object' && row !== null) {
        const values = headers.map(header => {
          const value = row[header]
          return escapeField(formatValue(value), quote, escape)
        })
        csvRows.push(values.join(delimiter))
      }
    }
    
    return csvRows.join('\n')
  } catch (err) {
    throw new Error('JSON 格式错误，无法转换为 CSV')
  }
}

/**
 * CSV 转 JSON
 */
export function csvToJson(csv: string): string {
  const lines = csv.trim().split(/\r?\n/)
  
  if (lines.length === 0) {
    return '[]'
  }
  
  // 解析表头
  const headers = parseCsvLine(lines[0])
  const result = []
  
  // 解析数据行
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    const obj: Record<string, any> = {}
    
    headers.forEach((header, index) => {
      obj[header] = parseValue(values[index])
    })
    
    result.push(obj)
  }
  
  return JSON.stringify(result, null, 2)
}

/**
 * 格式化值
 */
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  
  return String(value)
}

/**
 * 转义字段
 */
function escapeField(field: string, quote: string, escape: string): string {
  // 如果字段包含分隔符、引号或换行符，需要用引号包裹
  if (field.includes(quote) || field.includes(',') || field.includes('\n')) {
    const escaped = field.replace(new RegExp(quote, 'g'), escape + quote)
    return `${quote}${escaped}${quote}`
  }
  
  return field
}

/**
 * 解析 CSV 行
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // 转义的引号
        current += '"'
        i++ // 跳过下一个引号
      } else {
        // 切换引号状态
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // 字段分隔符
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  // 添加最后一个字段
  result.push(current.trim())
  
  return result
}

/**
 * 解析值
 */
function parseValue(value: string): any {
  // 空值
  if (value === '') {
    return null
  }
  
  // 数字
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value)
  }
  
  // 布尔值
  if (value.toLowerCase() === 'true') {
    return true
  }
  if (value.toLowerCase() === 'false') {
    return false
  }
  
  // null
  if (value.toLowerCase() === 'null') {
    return null
  }
  
  // 尝试解析 JSON
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}
