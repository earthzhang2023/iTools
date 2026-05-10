/**
 * 进制转换工具函数库
 */

export type Base = 2 | 8 | 10 | 16

/**
 * 进制转换
 */
export function baseConvert(
  value: string,
  fromBase: Base,
  toBase: Base
): string {
  if (fromBase === toBase) {
    return value
  }
  
  try {
    // 先转换为十进制
    const decimal = parseInt(value, fromBase)
    if (isNaN(decimal)) {
      throw new Error('无效的输入值')
    }
    
    // 再转换为目标进制
    return decimal.toString(toBase)
  } catch (err) {
    throw new Error('进制转换失败')
  }
}

/**
 * 十进制转二进制
 */
export function decimalToBinary(decimal: number | string): string {
  return baseConvert(decimal.toString(), 10, 2)
}

/**
 * 十进制转八进制
 */
export function decimalToOctal(decimal: number | string): string {
  return baseConvert(decimal.toString(), 10, 8)
}

/**
 * 十进制转十六进制
 */
export function decimalToHex(decimal: number | string): string {
  return baseConvert(decimal.toString(), 10, 16).toUpperCase()
}

/**
 * 二进制转十进制
 */
export function binaryToDecimal(binary: string): number {
  return parseInt(binary, 2)
}

/**
 * 八进制转十进制
 */
export function octalToDecimal(octal: string): number {
  return parseInt(octal, 8)
}

/**
 * 十六进制转十进制
 */
export function hexToDecimal(hex: string): number {
  return parseInt(hex, 16)
}

/**
 * 格式化数字显示
 */
export function formatNumber(value: string, base: Base): string {
  switch (base) {
    case 2:
      // 每 4 位加一个空格
      return value.replace(/(.{4})/g, '$1 ').trim()
    case 16:
      // 每 2 位加一个空格
      return value.replace(/(.{2})/g, '$1 ').trim()
    default:
      return value
  }
}

/**
 * 验证进制输入
 */
export function validateInput(value: string, base: Base): boolean {
  const patterns: Record<Base, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^\d+$/,
    16: /^[0-9a-fA-F]+$/
  }
  
  return patterns[base].test(value)
}
