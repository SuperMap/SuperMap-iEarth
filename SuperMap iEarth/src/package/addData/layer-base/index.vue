<template>
  <!-- 在线底图 -->
  <div class="layer-base-container">
    <div
      v-for="(item, index) in layerStore.layerServiceData.onlineBaseLayerList"
      class="ItemBox"
      :class="item.chooseType ? 'isSelect' : ''"
      :key="index"
      @click="addBaseLayer(item)"
    >
      <div class="img-box">
        <img :src="item.thumbnail" class="img" alt="" />
      </div>
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from "naive-ui";
import { useLayerStore } from "@/store/layerStore";
const message = useMessage();
const layerStore = useLayerStore();

let imageryProvider: any = null;

function addBaseLayer(item: any) {
  if (item.chooseType) {
    message.warning("请勿重复添加！");
    return;
  }
  layerStore.SelectedOptions.baseMap.push(item.name); // 存入已选择的在线底图选项
  let type = item.type;
  let layerUrl = item.url;
  switch (type) {
    case "BINGMAP":
      imageryProvider = new SuperMap3D.BingMapsImageryProvider({
        url: layerUrl,
        key: item.key,
      });
      item.chooseType = true;
      break;
    case "TIANDITU":
      imageryProvider = new SuperMap3D.TiandituImageryProvider({
        url: layerUrl,
        token: item.token,
      });
      item.chooseType = true;
      break;
    case "IMAGE":
      imageryProvider = new SuperMap3D.SingleTileImageryProvider({
        url: layerUrl,
      });
      item.chooseType = true;
      break;
    case "OSM":
      // imageryProvider = new SuperMap3D.createOpenStreetMapImageryProvider({
      //   url: layerUrl,
      // });
      imageryProvider = new SuperMap3D.UrlTemplateImageryProvider({
        url: layerUrl,
        subdomains: item.subdomains,
      });
      item.chooseType = true;
      break;
    case "GRIDIMAGERY":
      imageryProvider = new SuperMap3D.TileCoordinatesImageryProvider();
      item.chooseType = true;
      break;
    case "UrlTemplateImageryProvider":
      message.warning("日本服务不稳定，如果不行请稍后再试");
      imageryProvider = new SuperMap3D.UrlTemplateImageryProvider({
        url: layerUrl,
      });
      item.chooseType = true;
      break;
    default:
      break;
  }

  viewer.imageryLayers.addImageryProvider(imageryProvider);
  // console.log("viewer.imageryLayers._layers：",viewer.imageryLayers._layers);

  
  // let delImagelayer = viewer.imageryLayers._layers[0];
  // viewer.imageryLayers.remove(delImagelayer);
  // layerStore.removeLayer({key: "2-0",label: "默认影像",type: "imagery"});
  layerStore.updateLayer({ type: "imagery" });
}
</script>

<style lang="scss" scoped>
.layer-base-container {
  display: flex;
  flex-wrap: wrap;

  .ItemBox {
    width: 30%;
    color: $--SM--FontColor-Sub;
    // font-size: $--SM--FontSize-Text;
    // margin-bottom: 0.07rem;
    // margin-right: 0.16rem;
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
      background-color: #000;
      .img {
        width: 100%;
        height: 100%;
        // width: 0.72rem;
        // height: 0.72rem;
        object-fit: none;
      }
    }
  }
  .ItemBox:nth-child(3n) {
    margin-right: 0;
  }
  .isSelect {
    .img-box {
      border: 0.02rem solid #3499e5;
    }
  }
}
</style>