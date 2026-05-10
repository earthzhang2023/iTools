/**
 * Base64 工具函数库
 */

/**
 * Base64 编码
 */
export function base64Encode(str: string): string {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    ))
  } catch (err) {
    throw new Error('Base64 编码失败')
  }
}

/**
 * Base64 解码
 */
export function base64Decode(str: string): string {
  try {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch (err) {
    throw new Error('Base64 解码失败')
  }
}

/**
 * URL-safe Base64 编码
 */
export function base64EncodeUrlSafe(str: string): string {
  return base64Encode(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * URL-safe Base64 解码
 */
export function base64DecodeUrlSafe(str: string): string {
  const padded = str + '='.repeat((4 - str.length % 4) % 4)
  return base64Decode(
    padded
      .replace(/-/g, '+')
      .replace(/_/g, '/')
  )
}

/**
 * 检测是否是有效的 Base64 字符串
 */
export function isValidBase64(str: string): boolean {
  const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/
  return base64Regex.test(str)
}

/**
 * 检测是否是有效的 URL-safe Base64 字符串
 */
export function isValidBase64Url(str: string): boolean {
  const base64UrlRegex = /^([A-Za-z0-9_-]{4})*([A-Za-z0-9_-]{4}|[A-Za-z0-9_-]{3}=|[A-Za-z0-9_-]{2}==)$/
  return base64UrlRegex.test(str)
}
