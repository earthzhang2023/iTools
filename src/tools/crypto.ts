/**
 * 加密哈希工具函数库
 */
import CryptoJS from 'crypto-js'

/**
 * 计算 MD5 哈希
 */
export function md5(input: string): string {
  return CryptoJS.MD5(input).toString()
}

/**
 * 计算 SHA-1 哈希
 */
export function sha1(input: string): string {
  return CryptoJS.SHA1(input).toString()
}

/**
 * 计算 SHA-256 哈希
 */
export function sha256(input: string): string {
  return CryptoJS.SHA256(input).toString()
}

/**
 * 计算 SHA-512 哈希
 */
export function sha512(input: string): string {
  return CryptoJS.SHA512(input).toString()
}

/**
 * 计算 HMAC-SHA256
 */
export function hmacSHA256(input: string, secret: string): string {
  return CryptoJS.HmacSHA256(input, secret).toString()
}

/**
 * 计算 HMAC-SHA512
 */
export function hmacSHA512(input: string, secret: string): string {
  return CryptoJS.HmacSHA512(input, secret).toString()
}

/**
 * AES 加密
 */
export function aesEncrypt(input: string, key: string): string {
  return CryptoJS.AES.encrypt(input, key).toString()
}

/**
 * AES 解密
 */
export function aesDecrypt(ciphertext: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

/**
 * 哈希算法类型
 */
export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512'

/**
 * 通用哈希计算函数
 */
export function hash(input: string, algorithm: HashAlgorithm): string {
  switch (algorithm) {
    case 'md5':
      return md5(input)
    case 'sha1':
      return sha1(input)
    case 'sha256':
      return sha256(input)
    case 'sha512':
      return sha512(input)
    default:
      throw new Error(`不支持的哈希算法：${algorithm}`)
  }
}
