/**
 * JWT 解析工具函数
 * 提供 JWT Token 的解析、验证和 decoding 功能
 */

export interface JwtHeader {
  alg: string // 算法
  typ?: string // 类型
  kid?: string // 密钥 ID
  [key: string]: string | undefined
}

export interface JwtPayload {
  iss?: string // 签发者
  sub?: string // 主题
  aud?: string | string[] // 受众
  exp?: number // 过期时间
  nbf?: number // 生效时间
  iat?: number // 签发时间
  jti?: string // JWT ID
  [key: string]: string | number | string[] | undefined
}

export interface JwtData {
  header: JwtHeader
  payload: JwtPayload
  signature: string
  valid: boolean
  error?: string
}

export interface JwtValidationResult {
  valid: boolean
  expired: boolean
  notYetValid: boolean
  message?: string
}

/**
 * 解码 Base64URL
 * @param str Base64URL 编码的字符串
 * @returns 解码后的字符串
 */
function decodeBase64Url(str: string): string {
  // 将 Base64URL 转换为标准 Base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  
  // 添加填充
  while (base64.length % 4) {
    base64 += '='
  }
  
  // 解码
  try {
    return decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  } catch (e) {
    // 如果解码失败，尝试直接解码
    return atob(base64)
  }
}

/**
 * 解析 JWT Token
 * @param token JWT Token
 * @returns 解析后的 JWT 数据
 */
export function parseJwt(token: string): JwtData {
  const defaultResult: JwtData = {
    header: { alg: '', typ: 'JWT' },
    payload: {},
    signature: '',
    valid: false,
    error: ''
  }

  if (!token || typeof token !== 'string') {
    return {
      ...defaultResult,
      error: '无效的 JWT Token'
    }
  }

  const parts = token.split('.')
  
  if (parts.length !== 3) {
    return {
      ...defaultResult,
      error: 'JWT 格式错误，应包含 3 个部分'
    }
  }

  const [headerPart, payloadPart, signaturePart] = parts

  // 解析头部
  let header: JwtHeader
  try {
    const headerJson = decodeBase64Url(headerPart)
    header = JSON.parse(headerJson)
  } catch (error) {
    return {
      ...defaultResult,
      error: 'JWT 头部解析失败：' + (error as Error).message
    }
  }

  // 解析载荷
  let payload: JwtPayload
  try {
    const payloadJson = decodeBase64Url(payloadPart)
    payload = JSON.parse(payloadJson)
  } catch (error) {
    return {
      ...defaultResult,
      error: 'JWT 载荷解析失败：' + (error as Error).message
    }
  }

  // 获取签名
  const signature = signaturePart

  // 验证基本结构
  const valid = !!(header && payload && signature)

  return {
    header,
    payload,
    signature,
    valid,
    error: valid ? undefined : 'JWT 验证失败'
  }
}

/**
 * 验证 JWT Token 的有效性（时间相关）
 * @param token JWT Token
 * @returns 验证结果
 */
export function validateJwt(token: string): JwtValidationResult {
  const parsed = parseJwt(token)
  
  if (!parsed.valid) {
    return {
      valid: false,
      expired: false,
      notYetValid: false,
      message: parsed.error
    }
  }

  const now = Math.floor(Date.now() / 1000)
  const { exp, nbf } = parsed.payload

  // 检查是否过期
  if (exp && now > exp) {
    return {
      valid: false,
      expired: true,
      notYetValid: false,
      message: 'JWT 已过期'
    }
  }

  // 检查是否还未生效
  if (nbf && now < nbf) {
    return {
      valid: false,
      expired: false,
      notYetValid: true,
      message: 'JWT 还未生效'
    }
  }

  return {
    valid: true,
    expired: false,
    notYetValid: false,
    message: 'JWT 有效'
  }
}

/**
 * 格式化时间戳为可读日期
 * @param timestamp 时间戳（秒）
 * @returns 格式化的日期字符串
 */
export function formatTimestamp(timestamp: number): string {
  if (!timestamp) return ''
  
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

/**
 * 获取 JWT 中的标准字段信息
 * @param payload JWT 载荷
 * @returns 标准字段信息数组
 */
export function getStandardClaims(payload: JwtPayload): Array<{
  claim: string
  value: string | number
  description: string
}> {
  const claims: Record<string, string> = {
    iss: '签发者',
    sub: '主题',
    aud: '受众',
    exp: '过期时间',
    nbf: '生效时间',
    iat: '签发时间',
    jti: 'JWT ID'
  }

  const result: Array<{
    claim: string
    value: string | number
    description: string
  }> = []

  for (const [key, description] of Object.entries(claims)) {
    const value = payload[key]
    if (value !== undefined) {
      // 时间字段转换为可读格式
      if (['exp', 'nbf', 'iat'].includes(key) && typeof value === 'number') {
        result.push({
          claim: key,
          value: `${value} (${formatTimestamp(value)})`,
          description
        })
      } else {
        result.push({
          claim: key,
          value: String(value),
          description
        })
      }
    }
  }

  return result
}

/**
 * 获取 JWT 中的自定义字段
 * @param payload JWT 载荷
 * @returns 自定义字段信息数组
 */
export function getCustomClaims(payload: JwtPayload): Array<{
  key: string
  value: string
  type: string
}> {
  const standardClaims = ['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti']
  const result: Array<{
    key: string
    value: string
    type: string
  }> = []

  for (const [key, value] of Object.entries(payload)) {
    if (!standardClaims.includes(key)) {
      result.push({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        type: Array.isArray(value) ? 'array' : typeof value
      })
    }
  }

  return result
}
