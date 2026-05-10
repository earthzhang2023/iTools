/**
 * 时间处理工具函数
 */

/**
 * 时间戳转日期时间
 * @param timestamp 时间戳（毫秒或秒）
 * @param options 选项
 * @returns 格式化后的日期时间字符串
 */
export function timestampToDateTime(
  timestamp: number | string,
  options: { unit?: 'seconds' | 'milliseconds'; format?: string } = {}
): string {
  const { unit = 'milliseconds', format = 'YYYY-MM-DD HH:mm:ss' } = options
  
  let ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
  
  if (unit === 'seconds') {
    ts *= 1000
  }
  
  const date = new Date(ts)
  
  if (isNaN(date.getTime())) {
    throw new Error('无效的时间戳')
  }
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 日期时间转时间戳
 * @param dateTime 日期时间字符串
 * @param unit 返回的时间戳单位
 * @returns 时间戳
 */
export function dateTimeToTimestamp(dateTime: string, unit: 'seconds' | 'milliseconds' = 'milliseconds'): number {
  const timestamp = new Date(dateTime).getTime()
  
  if (isNaN(timestamp)) {
    throw new Error('无效的日期时间格式')
  }
  
  return unit === 'seconds' ? Math.floor(timestamp / 1000) : timestamp
}

/**
 * 当前时间戳
 * @param unit 返回的时间戳单位
 * @returns 当前时间戳
 */
export function currentTimestamp(unit: 'seconds' | 'milliseconds' = 'milliseconds'): number {
  const now = Date.now()
  return unit === 'seconds' ? Math.floor(now / 1000) : now
}

/**
 * 日期格式化
 * @param date 日期对象或时间戳
 * @param format 格式化字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number | string, format = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  
  if (isNaN(d.getTime())) {
    throw new Error('无效的日期')
  }
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}
