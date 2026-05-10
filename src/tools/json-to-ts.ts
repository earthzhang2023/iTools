/**
 * JSON 转 TypeScript 接口工具函数库
 */

export interface JsonToTsOptions {
  interfaceName?: string
  useTypeAlias?: boolean
  optionalProperties?: boolean
}

/**
 * JSON 转 TypeScript 接口
 */
export function jsonToTypeScript(json: string, options: JsonToTsOptions = {}): string {
  const {
    interfaceName = 'Root',
    useTypeAlias = false,
    optionalProperties = false
  } = options
  
  try {
    const data = JSON.parse(json)
    const types = new Map<string, string>()
    
    // 生成类型定义
    const rootType = generateType(data, interfaceName, types, optionalProperties)
    
    // 组装输出
    let output = ''
    
    types.forEach((typeDef, name) => {
      if (useTypeAlias) {
        output += `type ${name} = ${typeDef}\n\n`
      } else {
        output += `interface ${name} ${typeDef}\n\n`
      }
    })
    
    // 添加根类型
    if (useTypeAlias) {
      output += `type ${interfaceName} = ${rootType}`
    } else {
      output += `interface ${interfaceName} ${rootType}`
    }
    
    return output.trim()
  } catch (err) {
    throw new Error('JSON 格式错误')
  }
}

/**
 * 生成类型
 */
function generateType(
  value: any,
  name: string,
  types: Map<string, string>,
  optionalProperties: boolean,
  depth = 0
): string {
  // 防止过深递归
  if (depth > 10) {
    return 'any'
  }
  
  if (value === null) {
    return 'null'
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'any[]'
    }
    
    // 分析数组元素类型
    const elementTypes = new Set<string>()
    value.forEach(item => {
      elementTypes.add(getTypeOf(item))
    })
    
    if (elementTypes.size === 1) {
      const elementType = elementTypes.values().next().value
      if (['object', 'array'].includes(elementType)) {
        // 复杂类型需要生成接口
        const arrayName = `${name}Item`
        const itemDef = generateType(value[0], arrayName, types, optionalProperties, depth + 1)
        types.set(arrayName, itemDef)
        return `${arrayName}[]`
      }
      return `${elementType}[]`
    }
    
    // 混合类型数组
    return 'any[]'
  }
  
  if (typeof value === 'object') {
    const keys = Object.keys(value)
    
    if (keys.length === 0) {
      return '{ }'
    }
    
    const properties: string[] = []
    
    for (const key of keys) {
      const propValue = value[key]
      const propType = getTypeOf(propValue)
      const optional = optionalProperties && propValue === null ? '?' : ''
      
      if (propType === 'object' || propType === 'array') {
        // 复杂类型需要生成嵌套接口
        const propName = `${name}${capitalize(key)}`
        const propDef = generateType(propValue, propName, types, optionalProperties, depth + 1)
        types.set(propName, propDef)
        properties.push(`${key}${optional}: ${propName}`)
      } else {
        properties.push(`${key}${optional}: ${propType}`)
      }
    }
    
    return `{\n  ${properties.join(';\n  ')};\n}`
  }
  
  return getTypeOf(value)
}

/**
 * 获取值的 TypeScript 类型
 */
function getTypeOf(value: any): string {
  if (value === null) {
    return 'null'
  }
  
  if (Array.isArray(value)) {
    return 'array'
  }
  
  if (typeof value === 'object') {
    return 'object'
  }
  
  if (typeof value === 'boolean') {
    return 'boolean'
  }
  
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'number' : 'number'
  }
  
  if (typeof value === 'string') {
    // 尝试推断更具体的类型
    if (isValidDate(value)) {
      return 'string // ISO Date'
    }
    if (isValidUrl(value)) {
      return 'string // URL'
    }
    if (isValidEmail(value)) {
      return 'string // Email'
    }
    if (isValidUUID(value)) {
      return 'string // UUID'
    }
    return 'string'
  }
  
  return 'any'
}

/**
 * 首字母大写
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 验证是否为日期格式
 */
function isValidDate(str: string): boolean {
  return !isNaN(Date.parse(str)) && /^\d{4}-\d{2}-\d{2}/.test(str)
}

/**
 * 验证是否为 URL
 */
function isValidUrl(str: string): boolean {
  return /^https?:\/\//.test(str)
}

/**
 * 验证是否为邮箱
 */
function isValidEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
}

/**
 * 验证是否为 UUID
 */
function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}
