/**
 * 图片工具函数库
 */

export interface ImageToBase64Options {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  outputFormat?: 'png' | 'jpeg' | 'webp'
}

/**
 * 图片转 Base64
 */
export function imageToBase64(
  file: File,
  options: ImageToBase64Options = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const result = event.target?.result as string
      
      // 如果需要调整尺寸或质量
      if (options.maxWidth || options.maxHeight || options.quality) {
        resizeImage(result, options)
          .then(resizedBase64 => resolve(resizedBase64))
          .catch(reject)
      } else {
        resolve(result)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * 调整图片尺寸和质量
 */
function resizeImage(
  base64: string,
  options: ImageToBase64Options
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('无法创建 canvas 上下文'))
        return
      }
      
      // 计算新尺寸
      let { width, height } = img
      const { maxWidth = 1920, maxHeight = 1080, quality = 0.8, outputFormat = 'jpeg' } = options
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      // 绘制图片
      ctx.drawImage(img, 0, 0, width, height)
      
      // 转换为 Base64
      const resizedBase64 = canvas.toDataURL(`image/${outputFormat}`, quality)
      resolve(resizedBase64)
    }
    
    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }
    
    img.src = base64
  })
}

/**
 * Base64 转 Blob
 */
export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,')
  const contentType = parts[0].split(':')[1]
  const decodedData = window.atob(parts[1])
  const byteArray = new Uint8Array(decodedData.length)
  
  for (let i = 0; i < decodedData.length; i++) {
    byteArray[i] = decodedData.charCodeAt(i)
  }
  
  return new Blob([byteArray], { type: contentType })
}

/**
 * 下载 Base64 图片
 */
export function downloadBase64Image(base64: string, filename: string): void {
  const link = document.createElement('a')
  link.href = base64
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 验证图片文件
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: '不支持的图片格式，请上传 JPEG、PNG、GIF、WebP 或 SVG 文件'
    }
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: '图片大小不能超过 10MB'
    }
  }
  
  return { valid: true }
}
