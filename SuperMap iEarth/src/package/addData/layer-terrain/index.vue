<template>
  <div class="layer-terrain-container">
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
import { useMessage } from "naive-ui";
import { useLayerStore } from "@/store/layerStore";

const message = useMessage();
const layerStore = useLayerStore();

// 添加地形
function addTerrainLayer(item: any) {
  if (item.chooseType) {
    message.warning("请勿重复添加！");
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
        token: "e90d56e5a09d1767899ad45846b0cefd",
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

<style lang="scss" scoped>
.layer-terrain-container {
  display: flex;
  flex-wrap: wrap;

  .ItemBox {
    width: 30%;
    color: $--SM--FontColor-Sub;
    margin-bottom: 0.07rem;
    margin-right: 0.12rem;
    box-sizing: border-box;
    cursor: pointer;

    .img-box {
      width: 100%;
      height: 0.84rem;
      border-radius: 0.05rem;
      overflow: hidden;
      margin-bottom: 0.04rem;
      .img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .ItemBox:nth-child(3n) {
    margin-right: 0;
  }
  .isSelect {
    color: #3499e5;
    .img-box {
      border: 0.02rem solid #3499e5;
    }
  }
}
</style>