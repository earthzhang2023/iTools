<template>
  <div class="about">
    <h1>关于 iTools</h1>
    
    <div class="content">
      <p>iTools 是一个纯前端在线工具网站，所有数据处理均在浏览器本地完成，无需上传服务器。</p>
      
      <h2>核心优势</h2>
      <ul>
        <li>零隐私泄露 - 所有数据在本地处理</li>
        <li>响应迅速 - 无网络延迟</li>
        <li>低成本维护 - 无需后端服务</li>
        <li>完全免费 - 开源项目</li>
      </ul>
      
      <h2>技术栈</h2>
      <p>Vue 3 + TypeScript + Vite + Naive UI</p>
      
      <h2>作者</h2>
      <p>Dr.Zhang</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// About page component
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 24px;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--primary-color);
}

h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px;
}

.content {
  color: var(--text-color);
  line-height: 1.8;
}

ul {
  margin-left: 24px;
  margin-bottom: 16px;
}

li {
  margin-bottom: 8px;
}
</style>
