/**
 * 颜色转换工具函数库
 */

export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

/**
 * HEX 转 RGB
 */
export function hexToRgb(hex: string): RGB {
  // 移除 # 号
  hex = hex.replace(/^#/, '')
  
  // 支持 3 位简写
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }
  
  if (hex.length !== 6) {
    throw new Error('无效的 HEX 颜色格式')
  }
  
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  return { r, g, b }
}

/**
 * RGB 转 HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  return '#' + toHex(r) + toHex(g) + toHex(b)
}

/**
 * RGB 转 HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * HSL 转 RGB
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100
  
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  
  let r = 0
  let g = 0
  let b = 0
  
  if (h < 60) {
    r = c
    g = x
    b = 0
  } else if (h < 120) {
    r = x
    g = c
    b = 0
  } else if (h < 180) {
    r = 0
    g = c
    b = x
  } else if (h < 240) {
    r = 0
    g = x
    b = c
  } else if (h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  }
}

/**
 * HEX 转 HSL
 */
export function hexToHsl(hex: string): HSL {
  const rgb = hexToRgb(hex)
  return rgbToHsl(rgb.r, rgb.g, rgb.b)
}

/**
 * HSL 转 HEX
 */
export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

/**
 * 解析颜色字符串
 */
export function parseColor(color: string): { type: 'hex' | 'rgb' | 'hsl'; value: any } | null {
  // HEX
  const hexMatch = color.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  if (hexMatch) {
    return { type: 'hex', value: '#' + hexMatch[1].toLowerCase() }
  }
  
  // RGB
  const rgbMatch = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)
  if (rgbMatch) {
    return {
      type: 'rgb',
      value: {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      }
    }
  }
  
  // HSL
  const hslMatch = color.match(/^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i)
  if (hslMatch) {
    return {
      type: 'hsl',
      value: {
        h: parseInt(hslMatch[1]),
        s: parseInt(hslMatch[2]),
        l: parseInt(hslMatch[3])
      }
    }
  }
  
  return null
}

/**
 * 颜色格式转换
 */
export function convertColor(color: string, targetFormat: 'hex' | 'rgb' | 'hsl'): string {
  const parsed = parseColor(color)
  if (!parsed) {
    throw new Error('无效的颜色格式')
  }
  
  let rgb: RGB
  
  // 先转换为 RGB
  switch (parsed.type) {
    case 'hex':
      rgb = hexToRgb(parsed.value)
      break
    case 'rgb':
      rgb = parsed.value
      break
    case 'hsl':
      rgb = hslToRgb(parsed.value.h, parsed.value.s, parsed.value.l)
      break
  }
  
  // 再转换为目标格式
  switch (targetFormat) {
    case 'hex':
      return rgbToHex(rgb.r, rgb.g, rgb.b)
    case 'rgb':
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    case 'hsl':
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  }
}
