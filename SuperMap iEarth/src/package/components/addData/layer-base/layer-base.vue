<template>
  <!-- 在线底图 -->
  <div class="layer-base-container">
    <div
      v-for="(item, index) in onlineBaseLayerList"
      class="ItemBox"
      :class="item.chooseType ? 'isSelect' : ''"
      :key="index"
      @click="addBaseLayer(item)"
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
import { useMessage } from "naive-ui";
import { UrlDataSetCreate } from "@/store/layerUrlSet/dataSet";
import { GlobalStoreCreate } from "@/store/global/global";
import { useLayerTreeStore } from "@/store/layerTreeStore/index";

const GlobalStore = GlobalStoreCreate();
const urlDataSetStore = UrlDataSetCreate();
const layerTreeStore = useLayerTreeStore();
const { onlineBaseLayerList } = storeToRefs(urlDataSetStore);
const message = useMessage();

let imageryProvider: any = null;

function addBaseLayer(item: any) {
  let type = item.type;
  let layerUrl = item.url;
  switch (type) {
    case "BINGMAP":
      imageryProvider = new Cesium.BingMapsImageryProvider({
        url: layerUrl,
        key: item.key,
      });
      item.chooseType = true;
      break;
    case "TIANDITU":
      imageryProvider = new Cesium.TiandituImageryProvider({
        url: layerUrl,
        token: item.token,
      });
      item.chooseType = true;
      break;
    case "IMAGE":
      imageryProvider = new Cesium.SingleTileImageryProvider({
        url: layerUrl,
      });
      item.chooseType = true;
      break;
    case "OSM":
      // imageryProvider = new Cesium.createOpenStreetMapImageryProvider({
      //   url: layerUrl,
      // });
      imageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: layerUrl,
        subdomains: item.subdomains,
      });
      item.chooseType = true;
      break;
    case "GRIDIMAGERY":
      imageryProvider = new Cesium.TileCoordinatesImageryProvider();
      item.chooseType = true;
      break;
    case "UrlTemplateImageryProvider":
      message.warning("日本服务不稳定，如果不行请稍后再试");
      imageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: layerUrl,
      });
      item.chooseType = true;
      break;
    default:
      break;
  }

  viewer.imageryLayers.addImageryProvider(imageryProvider);
  layerTreeStore.updateBaseImage();
}
</script>

<style lang="scss" scoped>
.layer-base-container {
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