<template>
  <div class="sence-config-container">
    <div class="row-item">
      <span>{{ $t("chooseTexture") }}</span>
      <n-select style="width: 1.96rem" v-model:value="state.hdrName" @update:value="handlePresetEnvMap"
        :options="state.hdrOptions" />
    </div>

    <div class="row-item">
      <span>{{ $t("envIntensity") }}</span>
      <div class="slider-box">
        <n-slider style="width: 1.5rem" v-model:value="state.intensity" :step="0.1" :min="0" :max="3" />
        <n-input-number v-model:value="state.intensity" class="slider-input-number" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0" :max="5" placeholder="" size="small" />
      </div>
    </div>

    <div style="margin-left: 0.96rem; margin-bottom: 0.1rem;">
      <n-checkbox v-model:checked="state.isCustom">{{ $t("customResource") }}</n-checkbox>
    </div>

    <div class="row-item" v-if="state.isCustom">
      <span>{{ $t("resourcePath") }}</span>
      <n-input class="add-input-border" v-model:value="state.customUrl" @change="handleCustomEnvMap" type="text"
        :title="state.customUrl"
        style="width: 2rem" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, reactive } from "vue";
import tool from "@/tools/tool";

const viewer = window.viewer;
const scene = viewer.scene;

const state = reactive({
  intensity: 1,
  hdrName: 'EnvironmentMapping_city.hdr',
  hdrOptions: [
    { label: () => $t("pleaseSelect"), value: 'custom' },
    { label: () => $t("envCity"), value: "EnvironmentMapping_city.hdr" },
    { label: () => $t("envIndoor"), value: "EnvironmentMapping_indoor.hdr" },
    { label: () => $t("envNature"), value: "EnvironmentMapping_nature.hdr" },
    { label: () => $t("envGrayTexture"), value: "EnvironmentMapping_texture.hdr" },
  ],
  isCustom: false,
  customUrl: '',
})

onMounted(() => {
  const defaultEnvMapOptions = ["EnvironmentMapping_city.hdr","EnvironmentMapping_indoor.hdr","EnvironmentMapping_nature.hdr","EnvironmentMapping_texture.hdr"];
  if (scene.specularEnvironmentMaps && scene.specularEnvironmentMaps.includes('.hdr')) {
    state.intensity = Number(scene.envMapIntensity);
    const envMapName = String(scene.specularEnvironmentMaps).replace('./Resource/hdr/', '');
    if(defaultEnvMapOptions.includes(envMapName)){
      state.hdrName = envMapName;
    }else{
      state.hdrName = 'custom';
      state.isCustom = true;
      state.customUrl = envMapName;
    }
  } else {
    updateEnvMap(state.hdrName);
  }
})

// 根据传入的值计算真正的路径，并进行可访问性校验
async function checkEnvMapImageUrl(hdrUrl) {
  if(!hdrUrl.includes('.hdr')) { // 传入的url，必须携带.hdr后缀才行
    window["$message"].warning($t("envMapCustomUrlWithotHdr"));
    return;
  }

  let envMapUrl = '';
  let result:any = {};

  // 针对不同情况计算路径
  if (hdrUrl.includes('http')) {
    envMapUrl = hdrUrl;
    result.url = envMapUrl;
    result.type = 'absolute';
  } else {
    let resourceRootUrl = window.location.href.replace('index.html',''); // 这里需要处理一下路径拼接的问题

    // iportal打开保存的场景href会带?id=
    if(resourceRootUrl.includes('?id')){
      resourceRootUrl = resourceRootUrl.split("?id")[0];
    }

    envMapUrl = `${resourceRootUrl}Resource/hdr/${hdrUrl}`; // 还有问题
    result.url = hdrUrl;
    result.type = 'relative';
  }

  // 判断可访问性
  const isAccess = await tool.checkURLAccess(envMapUrl); // 判断当前URL是否可以访问
  if (isAccess) {
    result.isAccess = true;
  }else{
    result.isAccess = false;
    window["$message"].warning($t("envMapUrlAccessTip"));
  }
  return result;
}

// 更新环境光贴图
async function updateEnvMap(hdrValue: string) {
  let result = await checkEnvMapImageUrl(hdrValue);
  if(!result || !result.isAccess) return;

  let intensity = state.intensity;
  let hdrUrl:any = undefined;
  if(result.type == 'relative'){ // 相对路径，资源位于iEarth中
    hdrUrl = `./Resource/hdr/${result.url}`;
  }else if(result.type == 'absolute'){ // 绝对路径，资源再其他服务器中
    hdrUrl = result.url; 
  }else{
    console.log("此环境光贴图资源添加失败:",result);
  }

  if(hdrUrl){
    scene.specularEnvironmentMaps = undefined; // 切换环境光贴图是，首先需要删除它，然后定时异步等一会再设置，不然会没有效果
    setTimeout(() => {
      scene.specularEnvironmentMaps = hdrUrl;
      scene.envMapIntensity = intensity;
    }, 1000)
  }

  return hdrUrl;
}

// 切换内置预设的环境光贴图资源
function handlePresetEnvMap(value) {
  if(!value || value=='' || value=='custom') return;
  updateEnvMap(value);
}

// 切换自定义贴图
async function handleCustomEnvMap(value: string) {
  if(!value || value == '') return;
  let customEnvMapUrl = await updateEnvMap(value);
  if(customEnvMapUrl) state.hdrName = 'custom';
}

watch(
  () => state.intensity,
  (val) => {
    scene.envMapIntensity = val;
  }
);


</script>
