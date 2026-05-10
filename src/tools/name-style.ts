/**
 * 命名风格转换工具函数库
 */

/**
 * 转换为驼峰命名 (camelCase)
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^[A-Z]/, char => char.toLowerCase())
}

/**
 * 转换为帕斯卡命名（大驼峰，PascalCase）
 */
export function toPascalCase(str: string): string {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

/**
 * 转换为短横线命名（kebab-case）
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[-_\s]+/g, '-')
    .toLowerCase()
}

/**
 * 转换为下划线命名（snake_case）
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase()
}

/**
 * 转换为常量命名（CONSTANT_CASE）
 */
export function toConstantCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toUpperCase()
}

/**
 * 命名风格类型
 */
export type NameStyle = 'camelCase' | 'PascalCase' | 'kebab-case' | 'snake_case' | 'CONSTANT_CASE'

/**
 * 命名风格转换
 */
export function convertNameStyle(str: string, targetStyle: NameStyle): string {
  switch (targetStyle) {
    case 'camelCase':
      return toCamelCase(str)
    case 'PascalCase':
      return toPascalCase(str)
    case 'kebab-case':
      return toKebabCase(str)
    case 'snake_case':
      return toSnakeCase(str)
    case 'CONSTANT_CASE':
      return toConstantCase(str)
    default:
      return str
  }
}
