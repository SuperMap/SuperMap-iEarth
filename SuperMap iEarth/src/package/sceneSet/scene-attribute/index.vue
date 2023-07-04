<template>
  <n-grid :y-gap="8" :cols="3">
    <n-gi>
      <n-checkbox v-model:checked="state.earthShow" label="地球" />
    </n-gi>
    <n-gi>
      <n-checkbox v-model:checked="state.shadow" label="阴影" />
    </n-gi>
    <n-gi>
      <n-checkbox v-model:checked="state.sunShow" label="太阳" />
    </n-gi>
    <n-gi>
      <n-checkbox v-model:checked="state.depthInspection" label="深度检测" />
    </n-gi>
    <n-gi>
      <n-checkbox v-model:checked="state.atomsphereRender" label="大气渲染" />
    </n-gi>
    <n-gi>
      <n-checkbox v-model:checked="state.fogEffect" label="雾化效果" />
    </n-gi>
    <n-gi>
      <n-checkbox v-model:checked="state.cloudLayer" label="云层" />
    </n-gi>
    <!-- <n-gi>
        <n-checkbox v-model:checked="state.rain" label="雨景" />
      </n-gi> -->
    <!-- <n-gi>
        <n-checkbox v-model:checked="state.snow" label="雪景" />
      </n-gi> -->
    <n-gi>
      <n-checkbox v-model:checked="state.skyBoxShow" label="天空盒" />
    </n-gi>
    <n-gi>
        <n-checkbox v-model:checked="state.timeAxis" label="时间轴" />
      </n-gi>
    <n-gi>
      <n-checkbox v-model:checked="state.displayFrame" label="帧率" />
    </n-gi>
  </n-grid>

  <n-divider />

  <div class="row-item">
      <span>亮度</span>
      <div class="slider-box">
        <n-slider
          style="width: 1.5rem;"
          v-model:value="state.brightness"
          :step="0.1" :min="0" :max="5"
        />
        <div class="slider-suffix">
          <span>{{ state.brightness }}</span>
          <!-- <span class="slider-unit">M</span> -->
        </div>
      </div>
    </div>

    <div class="row-item">
      <span>对比度</span>
      <div class="slider-box">
        <n-slider
          style="width: 1.5rem;"
          v-model:value="state.contrast"
          :step="0.1" :min="0" :max="5"
        />
        <div class="slider-suffix">
          <span>{{ state.contrast }}</span>
          <!-- <span class="slider-unit">M</span> -->
        </div>
      </div>
    </div>

    <div class="row-item">
      <span>色调</span>
      <div class="slider-box">
        <n-slider
          style="width: 1.5rem;"
          v-model:value="state.hue"
          :step="0.1" :min="-1" :max="1"
        />
        <div class="slider-suffix">
          <span>{{ state.hue }}</span>
          <!-- <span class="slider-unit">M</span> -->
        </div>
      </div>
    </div>

    <div class="row-item">
      <span>饱和度</span>
      <div class="slider-box">
        <n-slider
          style="width: 1.5rem;"
          v-model:value="state.saturation"
          :step="0.1" :min="0" :max="5"
        />
        <div class="slider-suffix">
          <span>{{ state.saturation }}</span>
          <!-- <span class="slider-unit">M</span> -->
        </div>
      </div>
    </div>

  <div class="row-item">
    <span>开启地下</span>
    <div style="width: 1.96rem;height: 0.32rem;">
      <n-switch v-model:value="state.showUnderground" />
    </div>
  </div>
  <div class="row-item" v-show="state.showUnderground">
      <span>地表透明度</span>
      <div class="slider-box">
        <n-slider
          style="width: 1.5rem;"
          v-model:value="state.surfaceTransparency"
          :step="0.1" :min="0" :max="1"
        />
        <div class="slider-suffix">
          <span>{{ state.surfaceTransparency }}</span>
          <!-- <span class="slider-unit">M</span> -->
        </div>
      </div>
    </div>

  <n-divider />

  <div class="row-item">
    <span>坐标查询</span>
    <n-input
      placeholder="显示坐标"
      v-model:value="coordinate"
      autosize
      style="width: 1.96rem;height: 0.32rem;"
    />
    <!-- <span>经度、维度、高程</span> -->
  </div>

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="queryCoordinate"
      style="margin-right: 0.1rem"
      >查询</n-button
    >
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div>
</template>

<script lang="ts" setup>
import { ref,watch,reactive,onBeforeUnmount} from 'vue'
import tool from "@/tools/tool";

type stateType = {
    // 场景属性
    earthShow:boolean, //地球显隐
    shadow:boolean,//场景阴影
    sunShow:boolean, //太阳
    depthInspection:boolean, //深度检测
    atomsphereRender:boolean, //大气渲染
    fogEffect:boolean, //雾化效果
    cloudLayer:boolean, //云层
    rain:boolean, //雨景
    snow:boolean, //雪景
    skyBoxShow:boolean, //天空盒
    timeAxis:boolean, //时间轴
    displayFrame:boolean, //显示帧率

    // 显示地下
    showUnderground:boolean,
    surfaceTransparency: number, //地表透明度

    // 图层属性
    brightness:number, // 亮度
    contrast:number, // 对比度
    hue:number, // 色调
    saturation:number, // 饱和度
}

// 初始化数据
let state = reactive<stateType>({
    earthShow:true,
    shadow:false,
    sunShow:false,
    depthInspection:true,
    atomsphereRender:true,
    fogEffect:true,
    cloudLayer:false,
    skyBoxShow:false,
    timeAxis:false,
    displayFrame:true,
    rain:false,
    snow:false,

    showUnderground:false,
    surfaceTransparency:1,

    brightness:1,
    contrast:1,
    hue:0,
    saturation:1,
})

// 初始化变量
let coordinate = ref('');
let handlerSearch:any;
viewer.scene.colorCorrection.show = true; // 场景颜色开关打开

// 天空盒
let cloudBoxUrl = './images/project/sceneProperties/clouds/clouds1.png';
let bluesky = {
            positiveX: './images/project/sceneProperties/bluesky/Right.jpg',
            negativeX: './images/project/sceneProperties/bluesky/Left.jpg',
            positiveY: './images/project/sceneProperties/bluesky/Front.jpg',
            negativeY: './images/project/sceneProperties/bluesky/Back.jpg',
            positiveZ: './images/project/sceneProperties/bluesky/Up.jpg',
            negativeZ: './images/project/sceneProperties/bluesky/Down.jpg'
        };

let cloudBox = new SuperMap3D.CloudBox({ url:cloudBoxUrl });
let skybox = new SuperMap3D.SkyBox({ sources: bluesky });
        skybox.USpeed = 0;  //获取或者设置天空盒子绕x轴运动的动画速度。设置为1时表示0.01弧度每秒
        skybox.VSpeed = 0;  //获取或者设置天空盒子绕y轴运动的动画速度。
        skybox.WSpeed = 0;  //获取或者设置天空盒子绕z轴运动的动画速度。
let defaultSkybox = viewer.scene.skyBox; 

// 初始化
init();
function init() {
  if (!window.viewer) return;
  state.earthShow = SuperMap3D.defaultValue(viewer.scene.globe.show, true);
  state.shadow = SuperMap3D.defaultValue(viewer.scene.shadows, false);
  state.sunShow = SuperMap3D.defaultValue(viewer.scene.globe.enableLighting, false);
  state.depthInspection = SuperMap3D.defaultValue(
    viewer.scene.globe.depthTestAgainstTerrain,
    true
  );
  state.atomsphereRender = SuperMap3D.defaultValue(
    viewer.scene.skyAtmosphere.show,
    true
  );
  state.fogEffect = SuperMap3D.defaultValue(viewer.scene.fog.enabled, true);
  state.showUnderground = SuperMap3D.defaultValue(viewer.scene.undergroundMode, true);
  state.surfaceTransparency = SuperMap3D.defaultValue(
    viewer.scene.globe.globeAlpha,
    1
  );
  state.displayFrame = SuperMap3D.defaultValue(
    viewer.scene.debugShowFramesPerSecond,
    false
  );
  state.rain = SuperMap3D.defaultValue(
    viewer.scene.postProcessStages.rain.enabled,
    false
  );
  state.snow = SuperMap3D.defaultValue(
    viewer.scene.postProcessStages.snow.enabled,
    false
  );

  viewer.scene.postProcessStages.snow.uniforms.density = 10;
  viewer.scene.postProcessStages.snow.uniforms.speed = 4;
  viewer.scene.postProcessStages.rain.uniforms.speed = 8;
  if (viewer.scene.frameState.passes.render) {
    skybox.update(viewer.scene.frameState, true);
  }
  viewer.scene.skyBox = skybox;
  viewer.scene.skyBox.show = false;
}

// 监听相机高度，一旦高于设定阈值，关闭天空盒显示大气层
function watchCameraHeight() {
        if (state.skyBoxShow) {
            let cameraHeight = viewer.scene.camera.positionCartographic.height;
            if (cameraHeight > 22e4) {
                viewer.scene.skyBox.show = false;
                state.atomsphereRender = true;
            } else {
                viewer.scene.skyBox.show = true;
                state.atomsphereRender = false;
            }
        }
    }

// 场景中拾取查询坐标
function queryCoordinate() {
    handlerSearch = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
    handlerSearch.setInputAction(function (movement: any) {
        let cartesian = viewer.camera.pickEllipsoid(
            movement.position,
            viewer.scene.globe.ellipsoid
        );  
        let result = tool.CartesiantoDegrees(cartesian)
        coordinate.value = `${Number(result[0]).toFixed(5)},${Number(result[1]).toFixed(5)}`
    }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK)
}

// 清除
function clear(){
    if(handlerSearch){
      if(!handlerSearch.isDestroyed()) handlerSearch.destroy()
    }
    coordinate.value = ''
}

// 监听
watch(()=>state.earthShow, val => {
    viewer.scene.globe.show = val;
})
watch(()=>state.shadow, val => {
    viewer.scene.shadows = val;
})
watch(()=>state.sunShow, val => {
    viewer.scene.globe.enableLighting = val;
})
watch(()=>state.depthInspection, val => {
    viewer.scene.globe.depthTestAgainstTerrain = val;
})
watch(()=>state.atomsphereRender, val => {
    viewer.scene.skyAtmosphere.show = val
})
watch(
  () => state.showUnderground,
  val => {
    viewer.scene.undergroundMode = val;
  }
);
watch(
  () => state.surfaceTransparency,
  val => {
    viewer.scene.globe.globeAlpha = val;
  }
);
watch(()=>state.cloudLayer, val => {
    if (val) {
            viewer.scene.cloudBox = cloudBox;
        } else {
            viewer.scene.cloudBox = null;
        }
})
watch(() => state.rain,val => {
    viewer.scene.postProcessStages.rain.enabled = val;
  }
);
watch(() => state.snow, val => {
    viewer.scene.postProcessStages.snow.enabled = val;
  }
);
watch(()=>state.skyBoxShow, val => {
    if (val) {
            let cameraHeight = viewer.scene.camera.positionCartographic.height;
            viewer.scene.postRender.addEventListener(watchCameraHeight);
            viewer.scene.skyBox = skybox;
            if (cameraHeight < 22e4) {
                viewer.scene.skyBox.show = true;
                state.atomsphereRender = false
            } else {
                state.atomsphereRender  = true
            }
        } else {
            state.atomsphereRender = true;
            viewer.scene.skyBox.show = false;
            viewer.scene.skyBox = defaultSkybox;
            viewer.scene.postRender.removeEventListener(watchCameraHeight);
        }
})
watch(()=>state.timeAxis, val => {
    let timeline = document.getElementsByClassName(
            "supermap3d-viewer-timelineContainer"
        )[0] as HTMLElement;
        if (val) {
            timeline.style.visibility = "visible";
            timeline.style['z-index'] = 99999999999;
        } else {
            timeline.style.visibility = "hidden";
        }
})
watch(()=>state.displayFrame, val => {
    viewer.scene.debugShowFramesPerSecond = val;
})

watch(()=>state.brightness, val => {
    viewer.scene.colorCorrection.brightness = val;
})
watch(()=>state.contrast, val => {
    viewer.scene.colorCorrection.contrast = val;
})
watch(()=>state.hue, val => {
    viewer.scene.colorCorrection.hue = val;
})
watch(()=>state.saturation, val => {
    viewer.scene.colorCorrection.saturation = val;
})

onBeforeUnmount(()=>{
    clear();
})
</script>
<style lang="scss" scoped>
</style>
