<template>
  <aside class="app-sidebar" :class="{ collapsed }">
    <div class="sidebar-content">
      <nav class="nav-menu">
        <div class="menu-section">
          <h3 class="menu-title">常用工具</h3>
          <ul class="menu-list">
            <li class="menu-item">
              <router-link to="/" class="menu-link">
                <n-icon :component="Home" />
                <span v-if="!collapsed">首页</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/base64" class="menu-link">
                <n-icon :component="CodeWorking" />
                <span v-if="!collapsed">Base64</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/json" class="menu-link">
                <n-icon :component="CodeSlash" />
                <span v-if="!collapsed">JSON 格式化</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/timestamp" class="menu-link">
                <n-icon :component="Time" />
                <span v-if="!collapsed">时间戳转换</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/url" class="menu-link">
                <n-icon :component="Link" />
                <span v-if="!collapsed">URL 编解码</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/case" class="menu-link">
                <n-icon :component="Text" />
                <span v-if="!collapsed">文本转换</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/qrcode" class="menu-link">
                <n-icon :component="Aperture" />
                <span v-if="!collapsed">二维码</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/crypto" class="menu-link">
                <n-icon :component="LockClosed" />
                <span v-if="!collapsed">加密哈希</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/color" class="menu-link">
                <n-icon :component="ColorPalette" />
                <span v-if="!collapsed">颜色转换</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/regex" class="menu-link">
                <n-icon :component="Search" />
                <span v-if="!collapsed">正则测试</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/base" class="menu-link">
                <n-icon :component="Calculator" />
                <span v-if="!collapsed">进制转换</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/image-to-base64" class="menu-link">
                <n-icon :component="Image" />
                <span v-if="!collapsed">图片转 Base64</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/base64-to-image" class="menu-link">
                <n-icon :component="ImageOutline" />
                <span v-if="!collapsed">Base64 转图片</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/text-stats" class="menu-link">
                <n-icon :component="BarChart" />
                <span v-if="!collapsed">字符统计</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/unicode" class="menu-link">
                <n-icon :component="Language" />
                <span v-if="!collapsed">Unicode 转换</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/html-entity" class="menu-link">
                <n-icon :component="CodeSlash" />
                <span v-if="!collapsed">HTML 实体</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/jwt" class="menu-link">
                <n-icon :component="Key" />
                <span v-if="!collapsed">JWT 解析</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/about" class="menu-link">
                <n-icon :component="InformationCircle" />
                <span v-if="!collapsed">关于</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Home, InformationCircle, CodeWorking, CodeSlash, Time, Link, Text, Aperture, LockClosed, ColorPalette, Search, Calculator, Image, ImageOutline, BarChart, Language, Key } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'

defineProps<{
  collapsed?: boolean
}>()
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 240px;
  background-color: var(--card-bg);
  border-right: 1px solid var(--border-color);
  transition: all var(--transition-normal);
  overflow-y: auto;
  z-index: 999;
}

.app-sidebar.collapsed {
  width: 64px;
}

.sidebar-content {
  padding: 16px;
}

.menu-section {
  margin-bottom: 24px;
}

.menu-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 4px;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--text-color);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.menu-link:hover {
  background-color: var(--bg-color);
  color: var(--primary-color);
}

.menu-link.router-link-active {
  background-color: var(--primary-color);
  color: white;
}

.menu-link .n-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.menu-link span {
  white-space: nowrap;
  font-size: 14px;
}

.app-sidebar.collapsed .menu-link span {
  display: none;
}

@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
  }
  
  .app-sidebar.mobile-visible {
    transform: translateX(0);
  }
}
</style>
