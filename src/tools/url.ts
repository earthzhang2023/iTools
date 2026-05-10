/**
 * URL 工具函数库
 */

/**
 * URL 编码
 */
export function urlEncode(str: string, encodeType: 'default' | 'component' | 'full' = 'component'): string {
  try {
    switch (encodeType) {
      case 'default':
        return encodeURIComponent(str)
      case 'component':
        return encodeURIComponent(str)
      case 'full':
        return encodeURI(str)
      default:
        return encodeURIComponent(str)
    }
  } catch (err) {
    throw new Error('URL 编码失败')
  }
}

/**
 * URL 解码
 */
export function urlDecode(str: string): string {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    throw new Error('URL 解码失败')
  }
}

/**
 * 解析 URL 参数
 */
export function parseUrlParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value
    })
  } catch (err) {
    // 如果不是完整 URL，尝试解析查询字符串
    const queryString = url.startsWith('?') ? url.slice(1) : url.split('?')[1]
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=')
        if (key) {
          params[key] = value ? decodeURIComponent(value) : ''
        }
      })
    }
  }
  
  return params
}

/**
 * 构建 URL 参数
 */
export function buildUrlParams(params: Record<string, string>): string {
  const urlParams = new URLSearchParams()
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      urlParams.set(key, value)
    }
  }
  
  return urlParams.toString()
}

/**
 * 将参数添加到 URL
 */
export function addParamsToUrl(url: string, params: Record<string, string>): string {
  try {
    const urlObj = new URL(url)
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        urlObj.searchParams.set(key, value)
      }
    }
    
    return urlObj.toString()
  } catch (err) {
    // 如果不是完整 URL，简单处理
    const queryString = buildUrlParams(params)
    if (!queryString) {
      return url
    }
    
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}${queryString}`
  }
}

/**
 * 移除 URL 参数
 */
export function removeParamsFromUrl(url: string, paramsToRemove: string[]): string {
  try {
    const urlObj = new URL(url)
    
    for (const param of paramsToRemove) {
      urlObj.searchParams.delete(param)
    }
    
    return urlObj.toString()
  } catch (err) {
    return url
  }
}

/**
 * 获取 URL 基础信息
 */
export function getUrlInfo(url: string): {
  protocol: string
  host: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  origin: string
} {
  try {
    const urlObj = new URL(url)
    return {
      protocol: urlObj.protocol,
      host: urlObj.host,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      origin: urlObj.origin
    }
  } catch (err) {
    throw new Error('无效的 URL')
  }
}

/**
 * Base64 URL 编码
 */
export function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Base64 URL 解码
 */
export function base64UrlDecode(str: string): string {
  const padded = str + '='.repeat((4 - str.length % 4) % 4)
  return atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
}
