/**
 * 文本统计工具函数
 * 提供文本字符数、单词数、行数等统计功能
 */

export interface TextStats {
  characters: number // 总字符数
  charactersNoSpaces: number // 不含空格的字符数
  words: number // 单词数
  lines: number // 行数
  chineseCharacters: number // 中文字符数
  spaces: number // 空格数
  punctuation: number // 标点符号数
}

/**
 * 统计文本信息
 * @param text 输入文本
 * @returns 文本统计结果
 */
export function getTextStats(text: string): TextStats {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      chineseCharacters: 0,
      spaces: 0,
      punctuation: 0
    }
  }

  // 总字符数
  const characters = text.length

  // 不含空格的字符数
  const charactersNoSpaces = text.replace(/\s/g, '').length

  // 单词数（按空格分隔）
  const words = text.trim() ? text.trim().split(/\s+/).length : 0

  // 行数
  const lines = text ? text.split('\n').length : 0

  // 中文字符数（匹配 Unicode 中的汉字）
  const chineseCharacters = (text.match(/[\u4e00-\u9fa5]/g) || []).length

  // 空格数
  const spaces = (text.match(/\s/g) || []).length

  // 标点符号数（包括中英文标点）
  const punctuation = (text.match(/[.,!?;:'"(){}\[\]<>，。！？；：'"（）{}【】《》]/g) || []).length

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    chineseCharacters,
    spaces,
    punctuation
  }
}
