/**
 * 时间工具函数库
 */

export interface DateFormatOptions {
  format?: string
  timezone?: string
}

/**
 * 时间戳转日期
 */
export function timestampToDate(timestamp: number | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp
  const date = new Date(ts * 1000) // 假设是秒级时间戳
  
  if (isNaN(date.getTime())) {
    throw new Error('无效的时间戳')
  }
  
  return formatDate(date, format)
}

/**
 * 日期转时间戳
 */
export function dateToTimestamp(dateStr: string, unit: 'seconds' | 'milliseconds' = 'seconds'): number {
  const date = new Date(dateStr)
  
  if (isNaN(date.getTime())) {
    throw new Error('无效的日期')
  }
  
  if (unit === 'milliseconds') {
    return date.getTime()
  }
  
  return Math.floor(date.getTime() / 1000)
}

/**
 * 格式化日期
 */
export function formatDate(date: Date, format: string): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0')
  
  const replacements: Record<string, string> = {
    'YYYY': String(year),
    'YY': String(year).slice(-2),
    'MM': month,
    'DD': day,
    'HH': hours,
    'mm': minutes,
    'ss': seconds,
    'SSS': milliseconds
  }
  
  let result = format
  for (const [pattern, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(pattern, 'g'), value)
  }
  
  return result
}

/**
 * 解析日期字符串
 */
export function parseDate(dateStr: string, format: string): Date {
  // 简化实现，支持常见格式
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    throw new Error('无效的日期格式')
  }
  return date
}

/**
 * 计算相对时间
 */
export function getRelativeTime(date: Date | number | string): string {
  const now = new Date()
  const target = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const diff = now.getTime() - target.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  if (years > 0) {
    return `${years}年前`
  }
  if (months > 0) {
    return `${months}个月前`
  }
  if (days > 0) {
    return `${days}天前`
  }
  if (hours > 0) {
    return `${hours}小时前`
  }
  if (minutes > 0) {
    return `${minutes}分钟前`
  }
  if (seconds > 0) {
    return `${seconds}秒前`
  }
  return '刚刚'
}

/**
 * 获取当前时间戳
 */
export function getCurrentTimestamp(unit: 'seconds' | 'milliseconds' = 'seconds'): number {
  const now = Date.now()
  return unit === 'seconds' ? Math.floor(now / 1000) : now
}

/**
 * 时间戳转换（支持不同单位）
 */
export function convertTimestamp(timestamp: number, from: 'seconds' | 'milliseconds', to: 'seconds' | 'milliseconds'): number {
  if (from === to) {
    return timestamp
  }
  
  if (from === 'seconds' && to === 'milliseconds') {
    return timestamp * 1000
  }
  
  return Math.floor(timestamp / 1000)
}
