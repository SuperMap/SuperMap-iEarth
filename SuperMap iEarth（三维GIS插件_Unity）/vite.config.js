import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
const resolve = (dir) => { return path.join(__dirname, dir) }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base:'/',
  resolve: {
    alias: {
      '@': resolve('src'),
      'packages': resolve('packages'),
      'vue-gis-ge': resolve('packages/index'),
    },
  },
  server: {
    host: '0.0.0.0'
  },
})
