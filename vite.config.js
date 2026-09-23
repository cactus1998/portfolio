import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/',
  build: {
    // three.js 已拆成獨立 chunk 並延後載入，本身約 700 kB，放寬警告門檻
    chunkSizeWarningLimit: 800
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'],
    // element-plus 的樣式檔需經 Vite 處理，不可交給 Node 直接載入
    server: { deps: { inline: ['element-plus'] } }
  }
})
