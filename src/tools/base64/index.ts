/**
 * Base64 编码解码工具函数
 */

/**
 * Base64 编码
 * @param input 输入字符串
 * @returns Base64 编码结果
 */
export function base64Encode(input: string): string {
  try {
    return btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g,
      (_, p1) => String.fromCharCode(parseInt(p1, 16))
    ))
  } catch (error) {
    throw new Error('Base64 编码失败：输入包含无效字符')
  }
}

/**
 * Base64 解码
 * @param input Base64 编码字符串
 * @returns 解码后的字符串
 */
export function base64Decode(input: string): string {
  try {
    return decodeURIComponent(atob(input).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''))
  } catch (error) {
    throw new Error('Base64 解码失败：输入不是有效的 Base64 字符串')
  }
}

/**
 * URL 安全的 Base64 编码
 * @param input 输入字符串
 * @returns URL 安全的 Base64 编码结果
 */
export function base64EncodeUrlSafe(input: string): string {
  return base64Encode(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * URL 安全的 Base64 解码
 * @param input URL 安全的 Base64 编码字符串
 * @returns 解码后的字符串
 */
export function base64DecodeUrlSafe(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = input.length % 4
  if (padding) {
    input += '='.repeat(4 - padding)
  }
  return base64Decode(normalized)
}
