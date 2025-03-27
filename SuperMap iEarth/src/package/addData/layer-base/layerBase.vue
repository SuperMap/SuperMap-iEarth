<template>
  <!-- 在线底图 -->
  <div class="addData-data-container">
    <div
      v-for="(item, index) in onlineBaseLayerList"
      class="ItemBox"
      :class="item.chooseType ? 'isSelect' : ''"
      :key="index"
      @click="addBaseLayer(item)"
    >
      <div class="img-box">
        <img :src="item.thumbnail" class="img" style="object-fit: none" />
      </div>
      <div class="img-box-text">{{ $t(item.name) }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useLayerStore } from "@/store/layerStore/layer";
import { usePanelStore } from "@/store";
import i18n from "@/locale/index";

const layerStore = useLayerStore();
const panelStore = usePanelStore();
let onlineBaseLayerList = layerStore.layerServiceData.onlineBaseLayerList;

// 渲染组件前，基于当前场景中的影像图层来计算那些item是应该被勾选的
onMounted(()=>{
  onlineBaseLayerList.forEach(item=>item.chooseType = false);
  viewer.imageryLayers._layers.forEach(imageLayer => {
    let name = layerStore.getImageryLayerName(imageLayer);
    onlineBaseLayerList.forEach(item => {
      if(item.name && $t(item.name) == name) {
        item.chooseType = true;
      }
    });
  });
})

// 中文环境下，隐藏OSM底图
if(i18n.global.locale === 'zh'){
  onlineBaseLayerList = onlineBaseLayerList.filter(item => item.type !== "OSM");
}

let imageryProvider: any = null;

function addBaseLayer(item: any) {
  if (item.chooseType) {
    window["$message"].warning($t("repeatAddTip"));
    return;
  }

  let type = item.type;
  let layerUrl = item.url;
  switch (type) {
    case "BingMap":
      imageryProvider = new SuperMap3D.BingMapsImageryProvider({
        url: layerUrl,
        key: window.tokenConfig.bingMapsKey,
      });
      break;
    case "TIANDITU":
      imageryProvider = new SuperMap3D.TiandituImageryProvider({
        url: layerUrl,
        token: window.tokenConfig.tiandituKey,
      });
      break;
    case "LocalImage":
      imageryProvider = new SuperMap3D.SingleTileImageryProvider({
        url: layerUrl,
      });
      break;
    case "OSM":
      imageryProvider = new SuperMap3D.UrlTemplateImageryProvider({
        url: layerUrl,
        subdomains: item.subdomains,
      });
      break;
    case "GRIDIMAGERY":
      imageryProvider = new SuperMap3D.TileCoordinatesImageryProvider();
      break;
    case "UrlTemplateImageryProvider":
      imageryProvider = new SuperMap3D.UrlTemplateImageryProvider({
        url: layerUrl,
      });
      break;
    default:
      break;
  }
  viewer.imageryLayers.addImageryProvider(imageryProvider);

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

// 黑色背景
.img-box {
  background-color: #000;
  border: 0.02rem solid #3498e500;
}
</style>
