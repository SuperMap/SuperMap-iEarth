<template>
  <div class="addData-base-container">
    <div
      v-for="(item, index) in layerStore.layerServiceData
        .onlineTerrainLayerList"
      :key="index"
      class="ItemBox"
      :class="item.chooseType ? 'isSelect' : ''"
      @click="addTerrainLayer(item)"
    >
      <div class="img-box">
        <img :src="item.thumbnail" class="img" alt="" />
      </div>
      <span>{{ $t(item.title) }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import { useMessage } from "naive-ui";
import { useLayerStore } from "@/store/layerStore";

const message = useMessage();
const layerStore = useLayerStore();
let state = reactive({
  terrainToken: layerStore.configToken.TiandituToken, // 天地图token,
})

// 添加地形
function addTerrainLayer(item: any) {
  if (item.chooseType) {
    message.warning(GlobalLang.repeatAddTip);
    return;
  }
  layerStore.SelectedOptions.onlineTerrain.push(item.name); // 存入已选择的地形服务选项
  let type = item.type;
  let terrainUrl = item.proxiedUrl;
  switch (type) {
    case "STKTerrain":
      viewer.terrainProvider = new SuperMap3D.SuperMapTerrainProvider({
        url: terrainUrl,
        isSct: false,
      });
      break;
    case "tianDiTuTerrain":
      viewer.terrainProvider = new SuperMap3D.TiandituTerrainProvider({
        token:state.terrainToken
      });
      break;
    case "supermapOnlineTerrain":
      viewer.terrainProvider = new SuperMap3D.SCTTerrainProvider({
        urls: [terrainUrl],
      });
      break;
    default:
      break;
  }
  viewer.terrainProvider.name = item.name; //保存在线地图名称
  layerStore.layerServiceData.onlineTerrainLayerList.map((item) => {
    if (item.proxiedUrl == terrainUrl) {
      item.chooseType = true;
    } else {
      item.chooseType = false;
    }
  });
  layerStore.updateLayer({ type: "terrain", label: item.name });
}
</script>

<style>
  .addData-base-container{
    margin-bottom: -0.1rem;
  }
</style>