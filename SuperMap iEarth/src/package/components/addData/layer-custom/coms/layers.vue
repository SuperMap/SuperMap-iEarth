<template>
  <n-space vertical>
    <sm-rowLayOut lableWidth="0.79rem">
      <template #item-content>
        <n-select v-model:value="layerType" :options="options" />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut lableWidth="0.79rem">
      <template #item-lable>{{ $t("global.address") }}</template>
      <template #item-content>
        <n-input
          class="n-input-border"
          v-model:value="layerUrl"
          type="text"
          placeholder="http://www.supermapol.com/reals…"
          @input="handleChange"
        />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut lableWidth="0.79rem">
      <template #item-lable>{{ $t("global.name") }}</template>
      <template #item-content>
        <n-input
          class="n-input-border"
          v-model:value="layerName"
          type="text"
          :placeholder="$t('global.inputLayerName')"
          :title="layerName"
        />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut lableWidth="0.79rem">
      <template #item-content>
        <n-checkbox v-model:checked="token">
          {{ $t("global.addToken") }}
        </n-checkbox>
        <n-input
          style="margin-top: 0.1rem"
          class="n-input-border"
          v-if="token"
          v-model:value="layerToken"
          type="text"
          placeholder="token..."
        />
      </template>
    </sm-rowLayOut>

    <sm-btnGroup>
      <template #btn-left>
        <n-button type="info" color="#3499E5" text-color="#fff" @click="openLayer">{{
          $t("global.sure")
        }}</n-button>
      </template>
      <template #btn-right>
        <n-button class="btn-secondary">{{ $t("global.cancle") }}</n-button>
      </template>
    </sm-btnGroup>
  </n-space>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useMessage } from "naive-ui";
import layerManagement from "@/tools/layerManagement";
import { GlobalStoreCreate } from "@/store/global/global";

const widget = viewer.cesiumWidget;
const langGlobal = window.LangGlobal.global;

const message = useMessage();
const GlobalStore = GlobalStoreCreate();

let layerType = ref("S3M");
let token = ref(false);
let layerToken = ref("");
let options = [
  {
    label: langGlobal.s3mLayer,
    value: "S3M",
  },
  {
    label: langGlobal.imgLayer,
    value: "Imagery",
  },
  {
    label: langGlobal.terrainLayer,
    value: "Terrain",
  },
];

let layerUrl = ref("");
let layerName = ref("");

// 打开自定义图层
function openLayer() {
  if (layerUrl.value === null || layerUrl.value === "") {
    message.warning(langGlobal.urlIsNull);
    return;
  }
  if (token.value) {
    Cesium.Credential.CREDENTIAL = new Cesium.Credential(layerToken.value);
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

function handleChange() {
  //检测地址正确性 - 之后会换成正则表达式做严格校验
  switch (layerType.value) {
    case "S3M":
      if (layerUrl.value.indexOf("/rest/realspace/datas/") != -1) {
        message.success(langGlobal.urlCheckedsuccess);
        layerName.value = layerManagement.getLayerNameFromUrl(layerUrl.value);
      }
      break;
    case "Imagery":
      if (
        layerUrl.value.indexOf("/rest/realspace/datas/") != -1 &&
        layerUrl.value.indexOf("/rest/maps/") != 0
      ) {
        message.success(langGlobal.urlCheckedsuccess);
        layerName.value = layerManagement.getLayerNameFromUrl(layerUrl.value);
      }
      break;
    case "Terrain":
      if (layerUrl.value.indexOf("/rest/realspace/datas/") != -1) {
        message.success(langGlobal.urlCheckedsuccess);
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

let promiseArray: any[] = [];
function addS3M(s3mLayerUrl: string) {
  let options: { name: string };
  if (layerName.value) {
    options = {
      name: layerName.value,
    };
  } else {
    message.warning(langGlobal.urlIsNull);
    return;
  }
  promiseArray.push(viewer.scene.addS3MTilesLayerByScp(s3mLayerUrl, options));
  promiseWhen(promiseArray, true);
}

function addImage(imageryUrl: string) {
  let layer = viewer.imageryLayers.addImageryProvider(
    new Cesium.SuperMapImageryProvider({
      url: imageryUrl,
    })
  );
  viewer.flyTo(layer);

}

function addTerrain(terrainURL: string) {
  viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: terrainURL,
    isSct: true, //地形服务源自SuperMap iServer发布时需设置isSct为true
  });

  //飞行定位到地形范围
  let terrainProvider = viewer.terrainProvider;
  terrainProvider.readyPromise.then(() => {
    const bounds = terrainProvider._bounds;
    const destination = new Cesium.Rectangle.fromDegrees(
      bounds.west,
      bounds.south,
      bounds.east,
      bounds.north
    );

    GlobalStore.SceneLayerChangeCount++;

    viewer.scene.camera.flyTo({
      destination: destination,
    });

    // viewer.scene.camera.flyTo({
    //     destination: destination,
    //     complete: function callback() {
    //         GlobalStore.SceneLayerChangeCount++;
    //     }
    // });
  });
}

// addS3MTilesLayerByScp之后，进行后处理
function promiseWhen(promiseArray: any[], isSCP?: boolean) {
  Cesium.when.all(
    promiseArray,
    function (layers: any) {
      for (let i = 0; i < layers.length; i++) {
        layers[i]._visibleDistanceMax = 16000;
      }
      if (isSCP) {
        viewer.flyTo(layers[0]);
        // console.log("layers:", layers)
        GlobalStore.SceneLayerChangeCount++;
      }
    },
    function (e: any) {
      if (widget._showRenderLoopErrors) {
        let title = langGlobal.addScpFailed;
        widget.showErrorPanel(title, undefined, e);
      }
    }
  );
}
</script>

<!-- 不要用scoped，避免局限于当前组件，这里引入一次就不需要在引了，相当于全局引入了 -->
<style lang="scss">
.btn-group {
  @include btnGroupStyle(0.125rem, 0.08rem);
}
</style>