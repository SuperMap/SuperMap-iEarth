import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true
    }),
  ],
  base: "./",
  resolve: {
    alias: {
      '@': resolve('./src/'),
    }
  },
  server: {
    // hmr: true,  // 开启热更新
    // proxy: {
    //   "/iportal/": {
    //     target: "http://localhost:8190",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/iportal/, ""),
    //   },
    // },
    cors: true,
    proxy: {
      host: '0.0.0.0',
      '/iportal': {
        target: 'http://localhost:8190/iportal',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/iportal/, '')
      }
    }
  },
  // 全局 css 注册
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: `@import "src/styles/index.scss";`
      }
    }
  },
})
