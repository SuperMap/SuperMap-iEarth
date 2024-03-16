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
import { reactive } from "vue";
import { useMessage } from "naive-ui";
import { useLayerStore } from "@/store/layerStore/layer";
import { usePanelStore } from "@/store";

const panelStore = usePanelStore();
const layerStore = useLayerStore();
const message = useMessage();
const onlineTerrainLayerList =
  layerStore.layerServiceData.onlineTerrainLayerList;

let state = reactive({
  terrainToken: layerStore.configToken.TiandituToken, // 天地图token,
});

// 添加地形
function addTerrainLayer(item: any) {
  let index = layerStore.SelectedOptions.onlineTerrain.indexOf(item.name);
  if (index != -1) {
    message.warning($t("repeatAddTip"));
    return;
  }

  layerStore.SelectedOptions.onlineTerrain = [item.name]; // 存入已选择的地形服务选项

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
        token: state.terrainToken,
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
  viewer.terrainProvider.bindName = item.name; //保存在线地图名称

  // 地形面板中只能有一个被选中
  layerStore.layerServiceData.onlineTerrainLayerList.map((item) => {
    if (item.proxiedUrl == terrainUrl) {
      item.chooseType = true;
    } else {
      item.chooseType = false;
    }
  });

  layerStore.updateLayer({ type: "terrain", label: $t(item.name) });

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
