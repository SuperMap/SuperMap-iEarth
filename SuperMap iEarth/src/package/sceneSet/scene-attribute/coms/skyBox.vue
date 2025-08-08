<template>
  <div class="sence-config-container">
    <div class="row-item">
      <span>{{ $t("skyboxType") }}</span>
      <n-select style="width: 1.96rem" v-model:value="state.skyBoxImgNmae" @update:value="handlePresetSkybox"
        :options="state.skyBoxOptions" />
    </div>

    <!-- 旋转速度和旋转角度一起使用会有问题，优先开启旋转角度 -->
    <!-- <div class="row-item">
      <span>{{ $t("rotateSpeed") }}</span>
      <div class="slider-box">
        <n-slider style="width: 1.5rem" v-model:value="state.WSpeed" :step="0.1" :min="0" :max="5" @update:value="handleSpeed"/>
        <n-input-number v-model:value="state.WSpeed" class="slider-input-number" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0" :max="5" placeholder="" size="small" @update:value="handleSpeed"/>
      </div>
    </div> -->

    <div class="row-item">
      <span>{{ $t("rotateAngle") }}</span>
      <div class="slider-box">
        <n-slider style="width: 1.5rem" v-model:value="state.rotateAngle" :step="1" :min="0" :max="359" @update:value="handleAngle"/>
        <n-input-number v-model:value="state.rotateAngle" class="slider-input-number" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0" :max="359" placeholder="" size="small" @update:value="handleAngle"/>
      </div>
    </div>

    <div style="margin-left: 0.96rem; margin-bottom: 0.1rem;">
      <n-checkbox v-model:checked="state.isCustom">{{ $t("customResource") }}</n-checkbox>
    </div>

    <div class="row-item" v-if="state.isCustom">
      <span>{{ $t("resourcePath") }}</span>
      <n-input class="add-input-border" 
        v-model:value="state.customUrl" 
        @change="handleCustomSkybox" 
        type="text"
        :placeholder="$t('skyBoxCustomUrlTip')"
        :title="state.customUrl"
        style="width: 1.96rem" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import tool from "@/tools/tool";

const viewer = window.viewer;
const scene = viewer.scene;

const state = reactive({
  WSpeed: 0.5, // 旋转速度
  rotateAngle:30, // 旋转角度
  skyBoxImgNmae: 'HDR_morning_4K.jpg',
  skyBoxOptions: [
    { label: () => $t("pleaseSelect"), value: 'custom' },
    { label: () => $t("evening"), value: "HDR_evening_4K.jpg" },
    { label: () => $t("cloudyMore"), value: "HDR_cloudy_more_4K.jpg" },
    { label: () => $t("morning"), value: "HDR_morning_4K.jpg" },
    { label: () => $t("cloudyLess"), value: "HDR_cloudy_less_4K.jpg" },
    { label: () => $t("overcast"), value: "HDR_overcast_4K.jpg" },
  ],
  isCustom: false,
  customUrl: '',
})

onMounted(() => {
  scene.skyAtmosphere.show = false; // 开启天空盒，必须关闭大气渲染

  const defaultSkyBoxOptions = ["HDR_evening_4K.jpg","HDR_cloudy_more_4K.jpg","HDR_morning_4K.jpg","HDR_cloudy_less_4K.jpg","HDR_overcast_4K.jpg"];
  const skyBox = viewer.scene.skyBox;
  if (skyBox.imageUrl && skyBox.imageUrl.includes('jpg')) { // 默认的天空盒是由六张图片组成的，skyBox.imageUrl为undefiend
    skyBox.show = true;
    const skyBoxImgName = String(skyBox.imageUrl).replace('./Resource/skybox/', '');
    if(defaultSkyBoxOptions.includes(skyBoxImgName)){ // 内置预设的
      state.skyBoxImgNmae = skyBoxImgName;
    }else{ // 自定义的
      state.skyBoxImgNmae = 'custom';
      state.isCustom = true;
      state.customUrl = skyBoxImgName;
    }
    state.WSpeed = skyBox.WSpeed;
    state.rotateAngle = SuperMap3D.Math.toDegrees(skyBox.horizontalRotationAngle);
  } else {
    updateSkyBox(state.skyBoxImgNmae);
  }
})

// 根据传入的值计算真正的路径，并进行可访问性校验
async function checkSkyBoxImageUrl(jpgUrl) {
  if(!jpgUrl.includes('.jpg')) { // 传入的url，必须携带.jpg后缀才行
    window["$message"].warning($t("skyBoxCustomUrlWithotJpg"));
    return;
  }

  let imageUrl = '';
  let result:any = {};

  // 针对不同情况计算路径
  if (jpgUrl.includes('http')) {
    imageUrl = jpgUrl;
    result.url = imageUrl;
    result.type = 'absolute';
  } else {
    // if (!jpgUrl.includes('.jpg')) jpgUrl = jpgUrl + '.jpg';
    let resourceRootUrl = window.location.href.replace('index.html',''); // 这里需要处理一下路径拼接的问题

    // iportal打开保存的场景href会带?id=
    if(resourceRootUrl.includes('?id')){
      resourceRootUrl = resourceRootUrl.split("?id")[0];
    }

    imageUrl = `${resourceRootUrl}Resource/skybox/${jpgUrl}`; // 还有问题
    result.url = jpgUrl;
    result.type = 'relative';
  }

  // 判断可访问性
  const isAccess = await tool.checkURLAccess(imageUrl); // 判断当前URL是否可以访问
  if (isAccess) {
    result.isAccess = true;
  }else{
    result.isAccess = false;
    window["$message"].warning($t("skyboxUrlTip"));
  }
  return result;
}

// 更新切换天空盒
async function updateSkyBox(jpgValue) {
  let blueSkyBox:any = undefined;
  let result = await checkSkyBoxImageUrl(jpgValue);

  if(!result || !result.isAccess) return;
  let skyboxImgURL:any = undefined; 
  if(result.type == 'relative'){ // 相对路径，资源位于iEarth中
    skyboxImgURL = `./Resource/skybox/${result.url}`;
  }else if(result.type == 'absolute'){ // 绝对路径，资源再其他服务器中
    skyboxImgURL = result.url;
  }else{
    console.log("此天空盒资源添加失败:",result);
  }

  if(skyboxImgURL){
    blueSkyBox = new SuperMap3D.SkyBox({ imageUrl: skyboxImgURL}); 
    blueSkyBox.show = true;
    scene.skyBox = blueSkyBox;
  }

  // scene.skyBox.WSpeed = state.WSpeed;
  scene.skyBox.horizontalRotationAngle = SuperMap3D.Math.toRadians(Number(state.rotateAngle));

  return blueSkyBox;
}

// 切换内置预设的天空盒资源
function handlePresetSkybox(value) {
  if(!value || value=='' || value=='custom') return;
  updateSkyBox(value);
}

// 切换自定义天空盒
async function handleCustomSkybox(value: string) {
  if(!value || value == '') return;
  let customSkybox = await updateSkyBox(value);
  if(customSkybox) state.skyBoxImgNmae = 'custom';
}


const handleSpeed = function(val){
  scene.skyBox.WSpeed = Number(val);
}
const handleAngle = function(val){
  scene.skyBox.horizontalRotationAngle = SuperMap3D.Math.toRadians(Number(val));
}
</script>