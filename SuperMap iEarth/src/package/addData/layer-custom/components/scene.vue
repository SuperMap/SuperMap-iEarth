<template>
  <div class="row-item">
    <span>{{ $t("address") }}</span>
    <n-tooltip placement="top-end" trigger="hover">
      <template #trigger>
        <n-input class="add-input-border" v-model:value="state.sceneUrl" type="text" style="width: 2.4rem"
          :title="state.sceneUrl" @change="handleChange"/>
      </template>
      {{ state.urlTip }}
    </n-tooltip>
  </div>

  <div style="margin-left: 0.95rem; margin-bottom: 0.1rem">
    <n-checkbox v-model:checked="state.useSenceName">{{ $t("appointSceneName") }}</n-checkbox>
  </div>

  <div class="row-item" v-if="state.useSenceName">
    <span>{{ $t("name") }}</span>
    <n-input class="add-input-border" v-model:value="state.sceneName" type="text" style="width: 2.4rem"/>
  </div>

  <div style="margin-left: 0.95rem; margin-bottom: 0.1rem">
    <n-checkbox v-model:checked="state.token"> {{ $t("addToken") }} </n-checkbox>
    <n-input style="margin-top: 0.1rem; width: 2.4rem" v-if="state.token" v-model:value="state.sceneToken" type="text"
      placeholder="token..." />
  </div>

  <div class="btn-row-item" style="margin-left: 0.95rem">
    <n-button type="info" class="ans-btn" color="#3499E5" text-color="#fff" :focusable="false" @click="openScene">{{
      $t("sure") }}</n-button>
    <n-button :focusable="false" @click="clear">{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { useMessage } from "naive-ui";

const message = useMessage();

const state = reactive({
  urlTip: "http://<server>:<port>/realspace/services/<component>/rest/realspace",
  sceneUrl: '',
  sceneName: '',
  sceneToken: '',
  token: false,
  useSenceName:false
})

//检查场景服务地址是否合规
let reg = /rest\/realspace$/g;
function handleChange(){
  state.sceneUrl = state.sceneUrl.trim();
  if (!reg.test(state.sceneUrl)) {
    message.warning($t("urlChecedFail"));
  }
}

// 打开场景服务
function openScene() {
  if (state.sceneUrl == null || state.sceneUrl == "") {
    return;
  }

  //去引号
  if (state.sceneUrl.charAt(0) == '"' || state.sceneUrl.charAt(0) == "'") {
    let reg = /^['|"](.*)['|"]$/;
    state.sceneUrl = state.sceneUrl.replace(reg, "$1");
  }
  if (state.token) {
    SuperMap3D.Credential.CREDENTIAL = new SuperMap3D.Credential(
      state.sceneToken
    );
  }

  let sceneName = state.sceneName == '' ? undefined : state.sceneName;
  const promise = window.viewer.scene.open(state.sceneUrl, sceneName, { autoSetView: true });
  SuperMap3D.when(promise, function (layers: any) {
    layers.forEach((layer: any) => {
      layer.selectedColor = SuperMap3D.Color.fromCssColorString("rgba(166,252,252,1)"); // 通过自定义添加的s3m图层，也设置选中色
    });
    if (window.iEarthConsole) { console.log('scene-layers:', layers); }
    message.success($t("openSceneSuccess"));
  });
}

// 清除
function clear() {
  state.sceneUrl = "";
  state.sceneToken = "";
  state.token = false;
}
</script>

