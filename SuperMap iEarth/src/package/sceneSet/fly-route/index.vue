<template>
  <n-scrollbar style="max-height: 5rem;">
    <div class="btn-list">
      <div
        class="btn"
        v-for="(item, index) in comList"
        :class="item.isSelect ? 'select-btn' : ''"
        :key="index"
        @click="changeItem(item)"
      >
        {{ item.name }}
      </div>
    </div>

    <KeepAlive>
      <component :is="currentItem.com"></component>
    </KeepAlive>
    <!-- <n-divider /> -->
    <rotate></rotate>
    <!-- <n-divider />
    <flyPosition></flyPosition> -->

    <!-- <n-button @click="getLocate">获取</n-button>
    <n-button @click="setLocate">定位</n-button> -->
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { reactive, markRaw } from "vue";
import createRoute from "./components/create-route.vue";
import importRoute from "./components/import-route.vue";
import rotate from "./components/rotate.vue";
// import flyPosition from "./components/flyPosition.vue";

function getLocate() {
  var camera = viewer.scene.camera
  console.log(`
                    destination : SuperMap3D.Cartesian3.fromRadians(
                        ${camera.positionCartographic.longitude},
                        ${camera.positionCartographic.latitude},
                        ${camera.positionCartographic.height},
                    ),
                    orientation :{
                        heading:${camera.heading},
                        pitch:${camera.pitch},
                        roll:${camera.roll},
                    }
                `)
}

function setLocate() {
  viewer.scene.camera.setView({
    convert: viewer.scene.mode !== SuperMap3D.SceneMode.SCENE3D,
    destination: SuperMap3D.Cartesian3.fromRadians(
      0.0003140368332739343,
      0.00003938345003739653,
      372.0380201973021,
    ),
    orientation: {
      heading: 1.1602918584493285,
      pitch: -0.33492040386298116,
      roll: 6.283185307179583,
    }
  })
}

// 使用vue3 setUp实现动态组件
let comList = reactive([
  {
    name: $t("importFlyRoute"),
    com: markRaw(importRoute),
    isSelect: true,
  },
  {
    name: $t("createFlyRoute"),
    com: markRaw(createRoute),
    isSelect: false,
  },
]);

// 默认项目
let currentItem = reactive({
  com: comList[0].com,
});

// 点击切换项目
function changeItem(item: any) {
  currentItem.com = item.com;

  comList.map((itemObj) => {
    if (itemObj.name == item.name) {
      itemObj.isSelect = true;
    } else {
      itemObj.isSelect = false;
    }
  });
}
</script>

<style lang="scss" scoped>
.btn-list {
  margin-left: 0.1rem;
  width: 2.7rem;
  margin-bottom: 0.15rem;
  justify-content: space-evenly;

  .btn {
    width: fit-content;
    padding: 0 0.1rem;
  }
}
</style>
