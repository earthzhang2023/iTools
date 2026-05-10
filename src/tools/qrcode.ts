/**
 * 二维码工具函数库
 */
import QRCode from 'qrcode'

export interface QRCodeOptions {
  width?: number
  margin?: number
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  color?: {
    dark?: string
    light?: string
  }
}

/**
 * 生成二维码 DataURL
 */
export async function generateQRCodeDataURL(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  try {
    const dataURL = await QRCode.toDataURL(text, {
      width: options.width || 400,
      margin: options.margin || 2,
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#ffffff'
      }
    })
    return dataURL
  } catch (err) {
    throw new Error('二维码生成失败')
  }
}

/**
 * 下载二维码图片
 */
export function downloadQRCode(dataURL: string, filename = 'qrcode.png'): void {
  const link = document.createElement('a')
  link.href = dataURL
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
