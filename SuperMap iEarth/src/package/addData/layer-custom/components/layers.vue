<template>
  <n-space justify="end">
    <n-select
      class="input-border"
      v-model:value="layerType"
      :options="options"
      style="width: 2.4rem; margin-bottom: 0.1rem"
    />
  </n-space>

  <div class="row-item" style="margin-bottom: 0.1rem">
    <span>地址</span>
    <n-input
      class="input-border"
      style="width: 2.4rem"
      v-model:value="layerUrl"
      type="text"
      @input="handleChange"
    />
  </div>

  <div class="row-item" style="margin-bottom: 0.1rem">
    <span>名称</span>
    <n-input
      class="input-border"
      style="width: 2.4rem"
      v-model:value="layerName"
      type="text"
      placeholder="图层名称"
      :title="layerName"
    />
  </div>

  <div style="margin-left: 0.74rem; margin-bottom: 0.1rem">
    <n-checkbox v-model:checked="token"> 添加token </n-checkbox>
    <n-input
      style="margin-top: 0.1rem; width: 2.4rem"
      v-if="token"
      v-model:value="layerToken"
      type="text"
      placeholder="token..."
    />
  </div>

  <div class="btn-row-item" style="margin-left: 0.74rem">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      class="ans-btn"
      @click="openLayer"
      >确定</n-button
    >
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import layerManagement from "@/tools/layerManagement";
import { useLayerStore } from "@/store/layerStore";
const layerStore = useLayerStore();

const widget = viewer.cesiumWidget;

let layerType = ref("S3M");
let token = ref(false);
let layerToken = ref("");
let options = [
  {
    label: "S3M",
    value: "S3M",
  },
  {
    label: "影像",
    value: "Imagery",
  },
  {
    label: "地形",
    value: "Terrain",
  },
];

let layerUrl = ref("");
let layerName = ref("");

function clear(){};

// 打开自定义图层
function openLayer() {
  if (layerUrl.value === null || layerUrl.value === "") {
    // message.warning(langGlobal.urlIsNull);
    return;
  }
  if (token.value) {
    SuperMap3D.Credential.CREDENTIAL = new SuperMap3D.Credential(
      layerToken.value
    );
  }

  // setTrustedServers(layerUrl.value)

  switch (layerType.value) {
    case "S3M":
      addS3M(layerUrl.value);
      break;
    case "Imagery":
      addImage(layerUrl.value);
      break;
    case "Terrain":
      addTerrain(layerUrl.value);
      break;
    default:
      console.log("hello world");
  }
}

// 针对S3M、影像、地形，通过输入的url，自动获取图层名
function handleChange() {
  //检测地址正确性 - 之后会换成正则表达式做严格校验
  switch (layerType.value) {
    case "S3M":
      if (layerUrl.value.indexOf("/rest/realspace/datas/") != -1) {
        // message.success(langGlobal.urlCheckedsuccess);
        layerName.value = layerManagement.getLayerNameFromUrl(layerUrl.value);
      }
      break;
    case "Imagery":
      if (
        layerUrl.value.indexOf("/rest/realspace/datas/") != -1 &&
        layerUrl.value.indexOf("/rest/maps/") != 0
      ) {
        // message.success(langGlobal.urlCheckedsuccess);
        layerName.value = layerManagement.getLayerNameFromUrl(layerUrl.value);
      }
      break;
    case "Terrain":
      if (layerUrl.value.indexOf("/rest/realspace/datas/") != -1) {
        // message.success(langGlobal.urlCheckedsuccess);
        layerName.value = layerManagement.getLayerNameFromUrl(layerUrl.value);
      }
      break;
  }
  // 对layerurl做特殊处理
  if (layerUrl.value.charAt(0) == '"' || layerUrl.value.charAt(0) == "'") {
    let reg = /^['|"](.*)['|"]$/;
    layerUrl.value = layerUrl.value.replace(reg, "$1");
  }

  if (layerUrl.value === "") {
    layerName.value = "";
  }
}

// 添加s3m
let promiseArray: any[] = [];
function addS3M(s3mLayerUrl: string) {
  let options: { name: string };
  if (layerName.value) {
    options = {
      name: layerName.value,
    };
  } else {
    // message.warning(langGlobal.urlIsNull);
    return;
  }
  promiseArray.push(viewer.scene.addS3MTilesLayerByScp(s3mLayerUrl, options));
  promiseWhen(promiseArray, true);
}

// 添加影像图层 - 目前只支持超图我们自己的影像
function addImage(imageryUrl: string) {
  let layer = viewer.imageryLayers.addImageryProvider(
    new SuperMap3D.SuperMapImageryProvider({
      url: imageryUrl,
    })
  );
  layerStore.updateLayer({ type: "imagery" });
  viewer.flyTo(layer);
}

// 添加地形
function addTerrain(terrainURL: string) {
  // viewer.terrainProvider = new SuperMap3D.SuperMapTerrainProvider({
  //   url: terrainURL,
  //   isSct: true, //地形服务源自SuperMap iServer，本地发布时需设置isSct为true
  // });

  let isSctFlag = false;
  if(terrainURL.indexOf("8090") != -1) isSctFlag = true;
  viewer.terrainProvider = new SuperMap3D.SuperMapTerrainProvider({
        url: terrainURL,
        isSct: isSctFlag,
  });
  layerStore.updateLayer({ type: "terrain" });

  //飞行定位到地形范围
  let terrainProvider = viewer.terrainProvider;
  terrainProvider.readyPromise.then(() => {
    const bounds = terrainProvider._bounds;
    const destination = new SuperMap3D.Rectangle.fromDegrees(
      bounds.west,
      bounds.south,
      bounds.east,
      bounds.north
    );

    viewer.scene.camera.flyTo({
      destination: destination,
    });

  });
}

// addS3MTilesLayerByScp之后，进行后处理
function promiseWhen(promiseArray: any[], isSCP?: boolean) {
  SuperMap3D.when.all(
    promiseArray,
    function (layers: any) {
      for (let i = 0; i < layers.length; i++) {
        layers[i]._visibleDistanceMax = 16000;
      }
      if (isSCP) {
        viewer.flyTo(layers[0]);
        layerStore.updateLayer({ type: "s3m" });
      }
    },
    function (e: any) {
      if (widget._showRenderLoopErrors) {
        // let title = langGlobal.addScpFailed;
        // widget.showErrorPanel(title, undefined, e);
      }
    }
  );
}
</script>

<style lang="scss" scoped>
.input-border {
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
</style>