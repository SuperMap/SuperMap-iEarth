<template>
  <n-space vertical>
    <sm-rowLayOut lableWidth="0.77rem">
      <template #item-lable>地址</template>
      <template #item-content>
        <n-input
          class="n-input-border"
          v-model:value="sceneUrl"
          type="text"
          :placeholder="sceneUrlPlaceholder"
          :title="sceneUrl"
          @input="handleChange"
        />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut lableWidth="0.77rem">
      <template #item-lable>图层</template>
      <template #item-content>
        <n-checkbox v-model:checked="token">
          {{ $t("global.addToken") }}
        </n-checkbox>
        <n-input
          style="margin-top: 0.1rem"
          class="n-input-border"
          v-if="token"
          v-model:value="sceneToken"
          type="text"
          :placeholder="$t('global.addToken')"
        />
      </template>
    </sm-rowLayOut>

    <sm-btnGroup>
      <template #btn-left>
        <n-button
          type="info"
          color="#3499E5"
          text-color="#fff"
          @click="openScene"
          >{{ $t("global.sure") }}</n-button
        >
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

const widget = viewer.cesiumWidget;
const langGlobal = window.LangGlobal.global;

const message = useMessage();

let sceneUrl = ref("");
let sceneUrlPlaceholder =
  "http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace/datas/Building@CBD/config";
let sceneToken = ref("");
let token = ref(false);

function handleChange() {
  // 检查地址是否正确 - 使用正则严格校验
  if (sceneUrl.value.indexOf("rest/realspace") != -1) {
    message.success(langGlobal.urlCheckedsuccess);
  }

  //处理realspace带有/
  if (sceneUrl.value.slice(-14) === "rest/realspace") {
    let url = sceneUrl.value.split("rest/realspace")[0] + "rest/realspace";
    let scenesUrl = url + "/scenes.json";

    // console.log(`向${scenesUrl}发送请求，获取name`)

    // // 有跨域，之后看看
    // let sceneListPromise = window.axios.get(scenesUrl, {
    //     //需要cookie验证
    //     withCredentials: true
    // });

    // sceneListPromise.then((results:any) => {
    //     console.log("results.data:", results.data)
    // });
  }
}

let promiseArray: any[] = [];
function openScene() {
  if (sceneUrl.value == null || sceneUrl.value == "") {
    message.warning(langGlobal.urlIsNull);
    return;
  }

  //去引号
  if (sceneUrl.value.charAt(0) == '"' || sceneUrl.value.charAt(0) == "'") {
    let reg = /^['|"](.*)['|"]$/;
    sceneUrl.value = sceneUrl.value.replace(reg, "$1");
  }
  if (token.value) {
    Cesium.Credential.CREDENTIAL = new Cesium.Credential(sceneToken.value);
  }

  if (viewer) {
    // this.setTrustedServers(sceneUrl.value);
    // let s = viewer.scene.open(sceneUrl.value, "CBD");
    let s = viewer.scene.open(sceneUrl.value);
    promiseArray.push(s);
    promiseWhen(promiseArray);
  }
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

