<template>
  <supermap-webscene-manager isPPT v-if="panelStore.showWebScenePanel" ref="sceneManagerRef" position="bottom-right" />
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, toRaw } from 'vue'
import { usePanelStore } from "@/store/panelStore/index";

const sceneManagerRef = ref(null)
const panelStore = usePanelStore();

watch(() => panelStore.showWebScenePanel, async (newVal) => {
  if (!newVal) return;
  
  await nextTick();
  const component:any = sceneManagerRef.value
  if (!component) return;

  // 直接给DOM元素挂载原生Viewer对象，完全绕过Vue响应式系统，无Proxy包装
  component.viewer = toRaw(window.viewer);

  // 等待Lit组件内部渲染完成（必须加，否则拿不到内部元素）
  await component.updateComplete;

  // 获取Shadow DOM里的容器元素
  const container = component.shadowRoot.querySelector('.container')
  if (container) {
    container.style.right = '50px'
    container.style.bottom = '20px'

  }
}, { immediate: true })
</script>
