import { defineAsyncComponent, AsyncComponentLoader } from 'vue'
import { AsyncLoading } from '@/components/Loading'

/**
 * * 动态注册组件
 */
export const componentInstall = <T>(key: string, node: T) => {
  if (!window['$vue'].component(key) && node) {
    window['$vue'].component(key, node)
  }
}

/**
 * * 异步加载组件
 * @param loader
 * @returns
 */
export const loadAsyncComponent = (loader: AsyncComponentLoader<any>) =>
  defineAsyncComponent({
    loader,
    loadingComponent: AsyncLoading,
    delay: 20,
  })