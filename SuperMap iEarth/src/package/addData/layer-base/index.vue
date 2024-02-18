<template>
  <!-- 在线底图 -->
  <div class="addData-base-container">
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
      <span>{{ $t(item.name) }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import { useMessage } from "naive-ui";
import { useLayerStore } from "@/store/layerStore";
import { usePanelStore } from "@/store";

const message = useMessage();
const layerStore = useLayerStore();
const panelStore = usePanelStore();

let state = reactive({
  BingMapKey: layerStore.configToken.BingMapKey, // 必应地图token,
  TiandituToken: layerStore.configToken.TiandituToken, // 天地图token,
})

let imageryProvider: any = null;

function addBaseLayer(item: any) {
  if (item.chooseType) {
    message.warning(GlobalLang.repeatAddTip);
    return;
  }
  layerStore.SelectedOptions.baseMap.push(item.name); // 存入已选择的在线底图选项
  let type = item.type;
  let layerUrl = item.url;
  switch (type) {
    case "BingMap":
      imageryProvider = new SuperMap3D.BingMapsImageryProvider({
        url: layerUrl,
        key: state.BingMapKey,
      });
      item.chooseType = true;
      break;
    case "TIANDITU":
      imageryProvider = new SuperMap3D.TiandituImageryProvider({
        url: layerUrl,
        token: state.TiandituToken,
      });
      item.chooseType = true;
      break;
    case "LocalImage":
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
      // message.warning("日本服务不稳定，如果不行请稍后再试");
      imageryProvider = new SuperMap3D.UrlTemplateImageryProvider({
        url: layerUrl,
      });
      item.chooseType = true;
      break;
    default:
      break;
  }
  viewer.imageryLayers.addImageryProvider(imageryProvider);

  layerStore.updateLayer({ type: "imagery" });

  panelStore.closeRightToolPanel(1);// 1为关闭左侧面板
}
</script>

<style lang="scss" scoped>
  .img-box {
    height: 0.74rem !important;
  }

  .img{
     object-fit: none !important;
  }

  .img-box{
     background-color: #000;
     border: 0.02rem solid #3498e500;
  }

  .addData-base-container{
    margin-bottom: -0.1rem;
  }

</style>