import type { App } from 'vue'
import Loading from './index.vue'
import AsyncLoading from './index.vue'

// 正常组件
export { Loading }

// 异步
AsyncLoading.install = (app: App): void => {
  app.component('AsyncLoading', AsyncLoading)
}

export { AsyncLoading }
