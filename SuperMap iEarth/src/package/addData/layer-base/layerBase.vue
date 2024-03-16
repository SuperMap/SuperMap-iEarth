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
import { reactive } from "vue";
import { useLayerStore } from "@/store/layerStore/layer";
import { usePanelStore } from "@/store";
import { useMessage } from "naive-ui";

const layerStore = useLayerStore();
const panelStore = usePanelStore();
const message = useMessage();
const onlineBaseLayerList = layerStore.layerServiceData.onlineBaseLayerList;

let state = reactive({
  BingMapKey: layerStore.configToken.BingMapKey, // 必应地图token,
  TiandituToken: layerStore.configToken.TiandituToken, // 天地图token,
});

let imageryProvider: any = null;

function addBaseLayer(item: any) {
  let index = layerStore.SelectedOptions.baseMap.indexOf(item.name);
  if (index != -1) {
    message.warning($t("repeatAddTip"));
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
