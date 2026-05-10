import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: '关于' }
  },
  // 工具路由
  {
    path: '/base64',
    name: 'Base64Tool',
    component: () => import('@/views/tools/Base64Tool.vue'),
    meta: { title: 'Base64 编码解码' }
  },
  {
    path: '/json',
    name: 'JsonFormatterTool',
    component: () => import('@/views/tools/JsonFormatterTool.vue'),
    meta: { title: 'JSON 格式化' }
  },
  {
    path: '/timestamp',
    name: 'TimestampTool',
    component: () => import('@/views/tools/TimestampTool.vue'),
    meta: { title: '时间戳转换' }
  },
  {
    path: '/url',
    name: 'UrlTool',
    component: () => import('@/views/tools/UrlTool.vue'),
    meta: { title: 'URL 编码解码' }
  },
  {
    path: '/case',
    name: 'CaseTool',
    component: () => import('@/views/tools/CaseTool.vue'),
    meta: { title: '文本大小写转换' }
  },
  // Week 3 新增工具
  {
    path: '/qrcode',
    name: 'QRCodeTool',
    component: () => import('@/views/tools/QRCodeTool.vue'),
    meta: { title: '二维码生成器' }
  },
  {
    path: '/crypto',
    name: 'CryptoTool',
    component: () => import('@/views/tools/CryptoTool.vue'),
    meta: { title: '加密哈希工具' }
  },
  {
    path: '/color',
    name: 'ColorTool',
    component: () => import('@/views/tools/ColorTool.vue'),
    meta: { title: '颜色转换工具' }
  },
  {
    path: '/regex',
    name: 'RegexTool',
    component: () => import('@/views/tools/RegexTool.vue'),
    meta: { title: '正则表达式测试' }
  },
  // Week 4 新增工具
  {
    path: '/base',
    name: 'BaseTool',
    component: () => import('@/views/tools/BaseTool.vue'),
    meta: { title: '进制转换' }
  },
  {
    path: '/image-to-base64',
    name: 'ImageToBase64Tool',
    component: () => import('@/views/tools/ImageToBase64Tool.vue'),
    meta: { title: '图片转 Base64' }
  },
  {
    path: '/base64-to-image',
    name: 'Base64ToImageTool',
    component: () => import('@/views/tools/Base64ToImageTool.vue'),
    meta: { title: 'Base64 转图片' }
  },
  // Week 5 新增工具
  {
    path: '/json-csv',
    name: 'JsonCsvTool',
    component: () => import('@/views/tools/JsonCsvTool.vue'),
    meta: { title: 'JSON 转 CSV' }
  },
  {
    path: '/json-to-ts',
    name: 'JsonToTsTool',
    component: () => import('@/views/tools/JsonToTsTool.vue'),
    meta: { title: 'JSON 转 TS 接口' }
  },
  {
    path: '/text-process',
    name: 'TextProcessTool',
    component: () => import('@/views/tools/TextProcessTool.vue'),
    meta: { title: '文本去重排序' }
  },
  {
    path: '/name-style',
    name: 'NameStyleTool',
    component: () => import('@/views/tools/NameStyleTool.vue'),
    meta: { title: '命名风格转换' }
  },
  // Week 6 新增工具
  {
    path: '/text-stats',
    name: 'TextStatsTool',
    component: () => import('@/views/tools/TextStatsTool.vue'),
    meta: { title: '字符统计' }
  },
  {
    path: '/unicode',
    name: 'UnicodeTool',
    component: () => import('@/views/tools/UnicodeTool.vue'),
    meta: { title: 'Unicode 转换' }
  },
  {
    path: '/html-entity',
    name: 'HtmlEntityTool',
    component: () => import('@/views/tools/HtmlEntityTool.vue'),
    meta: { title: 'HTML 实体编解码' }
  },
  {
    path: '/jwt',
    name: 'JwtTool',
    component: () => import('@/views/tools/JwtTool.vue'),
    meta: { title: 'JWT 解析' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - iTools`
  }
  next()
})

export default router
