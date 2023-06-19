<template>
  <div class="layer-terrain-container">
    <div
      v-for="(item, index) in onlineTerrainLayerList"
      :key="index"
      class="ItemBox"
      :class="item.chooseType ? 'isSelect' : ''"
      @click="addTerrainLayer(item)"
    >
      <div class="img-box">
        <img :src="$t(item.thumbnail)" class="img" alt="" />
      </div>
      <span>{{ $t(item.name) }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { UrlDataSetCreate } from "@/store/layerUrlSet/dataSet";
import { GlobalStoreCreate } from "@/store/global/global";
import { useLayerTreeStore } from "@/store/layerTreeStore/index";
const layerTreeStore = useLayerTreeStore();

const GlobalStore = GlobalStoreCreate();
const urlDataSetStore = UrlDataSetCreate();
const { onlineTerrainLayerList } = storeToRefs(urlDataSetStore);

function addTerrainLayer(item: any) {
  let type = item.type;
  let terrainUrl = item.proxiedUrl;
  onlineTerrainLayerList.value.forEach((element) => {
    element.chooseType = false;
  }); //默认只加一个地形
  item.chooseType = true;
  switch (type) {
    case "STKTerrain":
      viewer.terrainProvider = new Cesium.SuperMapTerrainProvider({
        url: terrainUrl,
        isSct: false,
        requestWaterMask: true,
        requestVertexNormals: true,
      });
      break;
    case "tianDiTuTerrain":
      viewer.terrainProvider = new Cesium.TiandituTerrainProvider({
        token: "e90d56e5a09d1767899ad45846b0cefd",
      });
      break;
    case "supermapOnlineTerrain":
      viewer.terrainProvider = new Cesium.SCTTerrainProvider({
        urls: [terrainUrl],
      });
      break;
    default:
      break;
  }
  viewer.terrainProvider.name = item.name; //保存在线地图名称
  GlobalStore.SceneLayerChangeCount++;
  layerTreeStore.updateBaseTerrain(item);
}
</script>

<style lang="scss" scoped>
.layer-terrain-container {
  display: flex;
  flex-wrap: wrap;

  // @include panelContainer(100%, 3.8rem);

  .ItemBox {
    width: 30%;
    // height: 0.9rem;
    color: $--SM--FontColor-Sub;
    font-size: $--SM--FontSize-Text;
    margin-bottom: 0.07rem;
    margin-right: 0.16rem;
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