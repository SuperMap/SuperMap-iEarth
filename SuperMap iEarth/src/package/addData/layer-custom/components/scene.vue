<template>
  <div class="row-item">
    <span>{{ $t("address") }}</span>
    <n-tooltip placement="top-end" trigger="hover">
      <template #trigger>
        <n-input class="add-input-border" v-model:value="state.sceneUrl" type="text" style="width: 2.4rem"
          :title="state.sceneUrl" @input="handleUrlChange"/>
      </template>
      {{ state.urlTip }}
    </n-tooltip>
  </div>

  <div style="margin-left: 0.95rem; margin-bottom: 0.1rem">
    <n-checkbox v-model:checked="state.useSenceName">{{ $t("appointSceneName") }}</n-checkbox>
  </div>

  <div class="row-item" v-if="state.useSenceName">
    <span>{{ $t("name") }}</span>
    <n-input class="add-input-border" v-model:value="state.sceneName" type="text" style="width: 2.4rem" @input="handleNameChange"/>
  </div>

  <div style="margin-left: 0.95rem; margin-bottom: 0.1rem">
    <n-checkbox v-model:checked="state.useToken"> {{ $t("addToken") }} </n-checkbox>
    <n-input style="margin-top: 0.1rem; width: 2.4rem" v-if="state.useToken" v-model:value="state.sceneToken" type="text"
      placeholder="token..." @input="handleTokenChange"/>
  </div>

  <div class="btn-row-item" style="margin-left: 0.95rem">
    <n-button type="info" class="ans-btn" color="#3499E5" text-color="#fff" :focusable="false" @click="openScene" :disabled="!state.isCheckPass">{{
      $t("sure") }}</n-button>
    <n-button :focusable="false" @click="clear">{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";
import { useMessage } from "naive-ui";
import { GlobalStoreCreate } from "@/store/global/global";
import { RuleCheckTypeEnum, inputRuleCheck } from "@/tools/inputRuleCheck";

const message = useMessage();
const GlobalStore = GlobalStoreCreate();

const state = reactive({
  urlTip: "http://<server>:<port>/realspace/services/<component>/rest/realspace",
  sceneUrl: '',
  sceneName: '',
  sceneToken: '',
  useToken: false,
  useSenceName:false,
  isCheckPass:false,
  isURLPass:false,
  isNamePass:false,
  isTokenPass:false,
})


//检查输入是否合规：URL、Name、Token
function handleUrlChange() {
  state.sceneUrl = state.sceneUrl.trim();
  const checkeResult = inputRuleCheck(state.sceneUrl, RuleCheckTypeEnum.URL);
  if (!checkeResult.isPass) message.warning(checkeResult.message);
  state.isURLPass = checkeResult.isPass;
  computedCheckPass();
}
function handleNameChange() {
  state.sceneName = state.sceneName.trim();
  const checkeResult = inputRuleCheck(state.sceneName, RuleCheckTypeEnum.Text);
  if (!checkeResult.isPass) message.warning(checkeResult.message);
  state.isNamePass = checkeResult.isPass;
  computedCheckPass();

}
function handleTokenChange() {
  const checkeResult = inputRuleCheck(state.sceneToken, RuleCheckTypeEnum.Text);
  if (!checkeResult.isPass) message.warning(checkeResult.message);
  state.isTokenPass = checkeResult.isPass;
  computedCheckPass();
}

// 基于url、name和token在几种情况下，计算校验值是否正确
function computedCheckPass(){
  if(!state.useSenceName && !state.useToken){
    state.isCheckPass = state.isURLPass;
  }else if(state.useSenceName && !state.useToken){
    state.isCheckPass = state.isURLPass && state.isNamePass;
  }else if(!state.useSenceName && state.useToken){
    state.isCheckPass = state.isURLPass && state.isTokenPass;
  }else if(state.useSenceName && state.useToken){
    state.isCheckPass = state.isURLPass && state.isNamePass && state.isTokenPass;
  }
}

function checkSeneName(sceneUrl:string){
  let url = sceneUrl+'/scenes.json';
  window.axios.get(url).then((res: any) => {
    let data = res.data;
    if(data.length > 0){
      let sceneName = data[0].name;
      let isExist = GlobalStore.addSceneList.includes(sceneName);
      if(isExist){
        message.warning($t("sceneNameRepeatTip"));
      }else{
        GlobalStore.addSceneList.push(sceneName);
      }
    }
  })
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
  if (state.useToken) {
    SuperMap3D.Credential.CREDENTIAL = new SuperMap3D.Credential(
      state.sceneToken
    );
  }

  // 不指定场景名称的情况下，检测当前场景是否已经添加过
  if(state.sceneName == ''){ 
    checkSeneName(state.sceneUrl);
  }

  let sceneName = state.useSenceName ? state.sceneName : undefined;
  if(sceneName == '') sceneName = undefined;
  const promise = window.viewer.scene.open(state.sceneUrl, sceneName, { autoSetView: true });
  SuperMap3D.when(promise, function (layers: any) {
    layers.forEach((layer: any) => {
      layer.selectedColor = SuperMap3D.Color.fromCssColorString("rgba(166,252,252,1)"); // 通过自定义添加的s3m图层，也设置选中色
    });
    if (window.iEarthConsole) { console.log('scene-layers:', layers); }
    message.success($t("openSceneSuccess"));

    // 等打开场景相机定位过去后绑到场景中去
    setTimeout(() => {
      if(layers && layers.length > 0){
        console.log('layer-fly:',layers);
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
  state.sceneName = "";
  state.isCheckPass = false;
  state.isNamePass = false;
  state.isURLPass = false;
  state.isTokenPass = false;
  state.useToken = false;
  state.useSenceName = false;
}

watch(
  () => state.useSenceName,
  () => {
    computedCheckPass();
  }
);
watch(
  () => state.useToken,
  () => {
    computedCheckPass();
  }
);
</script>

