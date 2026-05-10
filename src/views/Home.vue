<template>
  <DefaultLayout>
    <div class="home">
      <div class="welcome-section">
        <h1>欢迎使用 iTools</h1>
        <p class="subtitle">纯前端在线工具网站 - Dr.Zhang</p>
        <p class="current-mode">当前模式：{{ mode }}</p>
      </div>
      
      <div class="tools-section">
        <h2 class="section-title">常用工具</h2>
        <div class="tools-grid">
          <router-link to="/base64" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="CodeWorking" />
            </div>
            <h3 class="tool-title">Base64 编解码</h3>
            <p class="tool-desc">Base64 编码、解码，支持 URL-safe 模式</p>
          </router-link>
          
          <router-link to="/json" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="CodeSlash" />
            </div>
            <h3 class="tool-title">JSON 格式化</h3>
            <p class="tool-desc">JSON 格式化、压缩、验证、排序</p>
          </router-link>
          
          <router-link to="/timestamp" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="Time" />
            </div>
            <h3 class="tool-title">时间戳转换</h3>
            <p class="tool-desc">时间戳与日期格式相互转换</p>
          </router-link>
          
          <router-link to="/url" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="Link" />
            </div>
            <h3 class="tool-title">URL 编解码</h3>
            <p class="tool-desc">URL 编码、解码、参数解析和构建</p>
          </router-link>
          
          <router-link to="/case" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="Text" />
            </div>
            <h3 class="tool-title">文本大小写转换</h3>
            <p class="tool-desc">文本大小写转换、命名格式转换、文本统计</p>
          </router-link>
          
          <router-link to="/qrcode" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="Aperture" />
            </div>
            <h3 class="tool-title">二维码生成器</h3>
            <p class="tool-desc">将文本、URL 等转换为二维码图片，支持下载</p>
          </router-link>
          
          <router-link to="/crypto" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="LockClosed" />
            </div>
            <h3 class="tool-title">加密哈希工具</h3>
            <p class="tool-desc">支持 MD5、SHA-1、SHA-256、AES 加密解密</p>
          </router-link>
          
          <router-link to="/color" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="ColorPalette" />
            </div>
            <h3 class="tool-title">颜色转换工具</h3>
            <p class="tool-desc">HEX、RGB、HSL 颜色格式相互转换</p>
          </router-link>
          
          <router-link to="/regex" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="Search" />
            </div>
            <h3 class="tool-title">正则表达式测试</h3>
            <p class="tool-desc">在线测试正则表达式，实时显示匹配结果</p>
          </router-link>
          
          <router-link to="/base" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="Calculator" />
            </div>
            <h3 class="tool-title">进制转换</h3>
            <p class="tool-desc">二进制、八进制、十进制、十六进制相互转换</p>
          </router-link>
          
          <router-link to="/image-to-base64" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="Image" />
            </div>
            <h3 class="tool-title">图片转 Base64</h3>
            <p class="tool-desc">上传图片生成 Base64 编码，支持拖拽上传</p>
          </router-link>
          
          <router-link to="/base64-to-image" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="ImageOutline" />
            </div>
            <h3 class="tool-title">Base64 转图片</h3>
            <p class="tool-desc">粘贴 Base64 编码生成图片并下载</p>
          </router-link>
          
          <router-link to="/text-stats" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="BarChart" />
            </div>
            <h3 class="tool-title">字符统计</h3>
            <p class="tool-desc">统计字符数、单词数、行数、中文字符数等</p>
          </router-link>
          
          <router-link to="/unicode" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="Language" />
            </div>
            <h3 class="tool-title">Unicode 转换</h3>
            <p class="tool-desc">文本与 Unicode 编码相互转换，支持多种格式</p>
          </router-link>
          
          <router-link to="/html-entity" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="CodeSlash" />
            </div>
            <h3 class="tool-title">HTML 实体编解码</h3>
            <p class="tool-desc">HTML 特殊字符编码与解码，支持多种实体格式</p>
          </router-link>
          
          <router-link to="/jwt" class="tool-card">
            <div class="tool-icon">
              <n-icon :component="Key" />
            </div>
            <h3 class="tool-title">JWT 解析</h3>
            <p class="tool-desc">解析和验证 JWT Token，查看头部和载荷信息</p>
          </router-link>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CodeWorking, CodeSlash, Time, Link, Text, Aperture, LockClosed, ColorPalette, Search, Calculator, Image, ImageOutline, BarChart, Language, Key } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { useThemeStore } from '@/stores/theme'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const themeStore = useThemeStore()

const mode = computed(() => themeStore.mode)
</script>

<style scoped>
.home {
  min-height: calc(100vh - 64px);
  padding: 48px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 48px;
}

.welcome-section h1 {
  font-size: 48px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 16px;
}

.subtitle {
  font-size: 18px;
  color: var(--text-color-secondary);
  margin: 8px 0;
}

.current-mode {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin-top: 16px;
}

.tools-section {
  margin-top: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 32px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.tool-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-normal);
  cursor: pointer;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.tool-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  border-radius: var(--radius-full);
  margin-bottom: 16px;
  color: var(--primary-color);
}

.tool-icon .n-icon {
  font-size: 32px;
}

.tool-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
  text-align: center;
}

.tool-desc {
  font-size: 14px;
  color: var(--text-color-secondary);
  text-align: center;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .welcome-section h1 {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>
