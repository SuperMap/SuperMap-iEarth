<template>  
    <h3>可在控制台中修改数据源，设置相关控件，以及扩展功能模块</h3>

    <n-card title="设置" style="margin-top: 4px">
      <n-tabs type="line" animated>
        <n-tab-pane name="oasis" tab="数据源">
          <!-- keep-alive不生效，只能是动态组件和路由吗？ -->
          <keep-alive :include="['datasource']">
            <datasource></datasource>
          </keep-alive>
        </n-tab-pane>
        <n-tab-pane name="the beatles" tab="组件设置">
          <keep-alive>
            <vueComponents></vueComponents>
          </keep-alive>
        </n-tab-pane>
        <n-tab-pane name="jay chou" tab="扩展模块">
          扩展模块
        </n-tab-pane>
        <!-- <n-tab-pane name="scene save" tab="场景保存">
          <sm-scene-save></sm-scene-save>
        </n-tab-pane> -->
      </n-tabs>
    </n-card>
  </template>

<script lang="ts" setup>
import { datasource } from "@/views/control/datasource"
import { vueComponents } from "@/views/control/vueComponents"
</script>

<style scoped>
</style>