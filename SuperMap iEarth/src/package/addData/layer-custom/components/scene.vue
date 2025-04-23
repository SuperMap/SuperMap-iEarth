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

  <div class="row-item">
    <span>多子域</span>
    <n-input class="add-input-border" v-model:value="state.subdomains" placeholder="t0,t1,t2,t3" type="text" style="width: 2.4rem"/>
  </div>


  <!-- 选择场景名称 -->
  <div class="row-item" v-if="state.sceneNameOptions.length>0">
    <span>{{ $t("sceneName") }}</span>
    <n-select style="width: 2.4rem" v-model:value="state.sceneName" :options="state.sceneNameOptions" />
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
import tool from "@/tools/tool";

const state = reactive({
  urlTip: "http://<server>:<port>/realspace/services/<component>/rest/realspace",
  sceneUrl: '',
  sceneName: '',
  sceneToken: '',
  token: false,
  subdomains:'',
  sceneNameOptions:[]
})

//检查场景服务地址是否合规
function handleChange(){
  state.sceneUrl = state.sceneUrl.trim();
  if(state.sceneUrl.endsWith("/realspace")) {
    tool.computedSceneNameOptions(state.sceneUrl).then(result => {
      if (result && result.length > 0) {
        state.sceneName = result[0].value;
        state.sceneNameOptions = result;
      }
    });
  }else{
    window["$message"].warning($t("urlChecedFail"));
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

  let list = state.subdomains.split(',');
  let subdomains:any = [];
  list.forEach(item=>{
    if(item.length>0){
      subdomains.push(item);
    }
  })
  if(subdomains.length == 0) subdomains = undefined;

  console.log("subdomains:",subdomains);
  let sceneName = state.sceneName == '' ? undefined : state.sceneName;
  const promise = window.viewer.scene.open(state.sceneUrl, sceneName, { 
    subdomains: subdomains,
    autoSetView: true 
  });
  SuperMap3D.when(promise, function (layers: any) {
    layers.forEach((layer: any) => {
      layer.residentRootTile = (window.customConfig && window.customConfig.s3mLayer_residentRootTile) ? true : false;
      // layer.selectColorType = SuperMap3D.SelectColorType.SILHOUETTE_EDGE; // 通过场景打开的S3M图层设置选中效果
      layer.selectedColor = new SuperMap3D.Color(
        128 / 255 * 1.5,
        198 / 255 * 1.5,
        226 / 255 * 1.5,
        1
      );
      layer.ignoreNormal = window.customConfig.ignoreNormal;
      layer.ignoreVertexColor = window.customConfig.ignoreVertexColor;
      layer.minTransparentAlpha = window.customConfig.minTransparentAlpha || 0.1; // 默认值为0.1
      
      if(window.customConfig.LoadingPriority !== undefined){
        layer.LoadingPriority = window.customConfig.LoadingPriority;
      }
    });

    if(window.iEarthCustomFunc && window.iEarthCustomFunc.afterSceneOpen){
      window.iEarthCustomFunc.afterSceneOpen(layers);
    }

    window["$message"].success($t("openSceneSuccess"));

    // 等打开场景相机定位过去后绑到场景中去
    setTimeout(() => {
      if(layers && layers.length > 0){
        layers.forEach((layer:any)=>{
          layer.positionCartographic_for_colubus = SuperMap3D.clone(viewer.camera.positionCartographic) || undefined;
        })
      }
    }, 3000); 
  });
}

// 清除
function clear() {
  state.sceneUrl = "";
  state.sceneToken = "";
  state.token = false;
  state.sceneName = '';
  state.sceneNameOptions = [];
}
</script>

