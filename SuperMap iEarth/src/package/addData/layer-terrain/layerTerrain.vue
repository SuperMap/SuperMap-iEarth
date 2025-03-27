<template>
  <div class="addData-data-container">
    <div
      v-for="(item, index) in onlineTerrainLayerList"
      :key="index"
      class="ItemBox"
      :class="item.chooseType ? 'isSelect' : ''"
      @click="addTerrainLayer(item)"
    >
      <div class="img-box">
        <img :src="item.thumbnail" class="img" alt="" />
      </div>
      <div class="img-box-text">{{ $t(item.name) }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useLayerStore } from "@/store/layerStore/layer";
import { usePanelStore } from "@/store";

const panelStore = usePanelStore();
const layerStore = useLayerStore();
const onlineTerrainLayerList = layerStore.layerServiceData.onlineTerrainLayerList;

onMounted(()=>{
  let name = layerStore.getTerrainLayerName();
  onlineTerrainLayerList.forEach(item => {
    if (item.name && $t(item.name) == name) {
      item.chooseType = true;
    }else{
      item.chooseType = false;
    }
  });
})

// 添加地形
function addTerrainLayer(item: any) {
  if (item.chooseType) {
    window["$message"].warning($t("repeatAddTip"));
    return;
  }

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
        token: window.tokenConfig.tiandituKey,
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
  panelStore.closeRightToolPanel(1); // 1为关闭左侧面板
}
</script>

<style lang="scss" scoped>
.img-box-text {
  text-align: center;
  font-size: 0.14rem;
}

.addData-data-container {
  margin-bottom: -0.1rem;
}
</style>
