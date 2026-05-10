/**
 * URL 编码解码工具函数
 */

/**
 * URL 编码
 * @param input 输入字符串
 * @returns URL 编码后的字符串
 */
export function urlEncode(input: string): string {
  try {
    return encodeURIComponent(input)
  } catch (error) {
    throw new Error('URL 编码失败')
  }
}

/**
 * URL 解码
 * @param input URL 编码字符串
 * @returns 解码后的字符串
 */
export function urlDecode(input: string): string {
  try {
    return decodeURIComponent(input)
  } catch (error) {
    throw new Error('URL 解码失败：输入不是有效的 URL 编码字符串')
  }
}

/**
 * 完整 URL 编码（包含特殊字符）
 * @param input 输入字符串
 * @returns 完整 URL 编码后的字符串
 */
export function urlEncodeFull(input: string): string {
  try {
    return encodeURI(input)
  } catch (error) {
    throw new Error('URL 编码失败')
  }
}

/**
 * 完整 URL 解码
 * @param input URL 编码字符串
 * @returns 解码后的字符串
 */
export function urlDecodeFull(input: string): string {
  try {
    return decodeURI(input)
  } catch (error) {
    throw new Error('URL 解码失败')
  }
}
