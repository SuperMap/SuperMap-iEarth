<template>
  <!-- 底部信息条 -->
  <div class="foot-info-container">
    <span class="info-box">{{cameraState.latitude_text_computed}}</span>
    <span class="info-box">{{cameraState.longitude_text_computed}}</span>
    <span class="info-box">{{`${$t('foot_elevation')}：${cameraState.altitude} m`}}</span>
    <!-- 
    <span class="info-box">{{`${$t('foot_height')}：${cameraState.cameraHeigh_computed}`}}</span>
    <span class="info-box">{{`${$t('foot_heading')}：${cameraState.heading}°`}}</span>
    <span class="info-box">{{`${$t('foot_pitch')}：${cameraState.pitch}°`}}</span> -->
    <!-- <span class="info-box">{{`翻滚角：${cameraState.roll}°`}}</span> -->
  </div>
</template>
  
<script lang="ts" setup>
import { onMounted, reactive, computed } from "vue";

const cameraState = reactive<any>({
  level: 0,
  longitude: 0,
  latitude: 0,
  altitude: 0,
  cameraHeight: 0,
  heading: 0,
  pitch: 0,
  roll: 0,
  cameraHeigh_computed: '',
  longitude_text_computed:'',
  latitude_text_computed:'',
});

onMounted(() => {
  if(!viewer) return;
  initInfoBar();
});

// 计算视高
cameraState.cameraHeigh_computed = computed(() => {
  let value = cameraState.cameraHeight > 1000 ? (cameraState.cameraHeight / 1000).toFixed(5) : cameraState.cameraHeight;
  let unit = cameraState.cameraHeight > 1000 ? 'km' : 'm';
  return `${value} ${unit}`;
});
// 计算经度和Y方向
cameraState.longitude_text_computed = computed(() => {
  if(!viewer) return;
  if(viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW){
    return `${$t('foot_Y')}：${Number(cameraState.longitude).toFixed(2)} m`;
  }else{
    return `${$t('foot_lng')}：${cameraState.longitude} °`;
  }
});
// 计算纬度和X方向
cameraState.latitude_text_computed = computed(() => {
  if(!viewer) return;
  if(viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW){
    return `${$t('foot_X')}：${Number(cameraState.latitude).toFixed(2)} m`;
  }else{
    return `${$t('foot_lat')}：${cameraState.latitude} °`;
  }
});

// 绑定监听事件
function initInfoBar() {
  // 实时获取鼠标经纬度
  // const handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
  // handler.setInputAction(function (e) {
  //   if (!e.endPosition) return;
  //   const cartesian3 = viewer.scene.pickPosition(e.endPosition);
  //   if (!cartesian3 || !(cartesian3 instanceof SuperMap3D.Cartesian3)) return;
  //   let longitude, latitude, altitude: any = undefined;
  //   if (viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW) {
  //     const cartesian3_columbu = SuperMap3D.Transforms.convertToColumbusCartesian(cartesian3);
  //     altitude = cartesian3_columbu.x;
  //     longitude = cartesian3_columbu.z;
  //     latitude = cartesian3_columbu.y;
  //   } else {
  //     const cartographic = SuperMap3D.Cartographic.fromCartesian(cartesian3);
  //     longitude = SuperMap3D.Math.toDegrees(cartographic.longitude);
  //     latitude = SuperMap3D.Math.toDegrees(cartographic.latitude);
  //     altitude = cartographic.height;

  //   }
  //   if (longitude) cameraState.longitude = longitude.toFixed(6);
  //   if (latitude) cameraState.latitude = latitude.toFixed(6);
  //   if (altitude) cameraState.altitude = altitude.toFixed(2);

  //   // console.log('点击经纬度：', `${longitude},${latitude},${height}`);
  // }, SuperMap3D.ScreenSpaceEventType.MOUSE_MOVE);

  // 实时获取相机位置
  computedCameraParams(); // 获取初始值
  viewer.camera.changed.addEventListener(computedCameraParams);
  function computedCameraParams(){
    const camera = viewer.camera;

    // 视高 m
    cameraState.cameraHeight = (camera.positionCartographic.height).toFixed(2);
    // 方位角
    cameraState.heading = SuperMap3D.Math.toDegrees(camera.heading).toFixed(2);
    // 俯仰角
    cameraState.pitch = SuperMap3D.Math.toDegrees(camera.pitch).toFixed(2);
    // 翻滚角
    cameraState.roll = SuperMap3D.Math.toDegrees(camera.roll).toFixed(2);
    // 级别
    let tileRender = viewer.scene._globe._surface._tilesToRender;
    if (tileRender && tileRender.length > 0) {
      cameraState.level = viewer.scene._globe._surface._tilesToRender[0]._level;
    }

    // 相机位置
    let longitude, latitude, altitude: any = undefined;
    let cartesian3 = camera.position;
    if (viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW) {
      let cartesian3_columbu = cartesian3; // 这里相机的坐标本身就是平面场景下，无需转换
      // const cartesian3_columbu = SuperMap3D.Transforms.convertToColumbusCartesian(cartesian3);
      // 相机这里的顺序和鼠标拾取到的不一致 
      latitude = cartesian3_columbu.x; // X方向
      longitude = cartesian3_columbu.y; // Y方向
      altitude = cartesian3_columbu.z; // 高程
    } else {
      const cartographic = SuperMap3D.Cartographic.fromCartesian(cartesian3);
      latitude = SuperMap3D.Math.toDegrees(cartographic.latitude); // 纬度
      longitude = SuperMap3D.Math.toDegrees(cartographic.longitude); // 经度
      altitude = cartographic.height; // 高程
    }
    if (longitude) cameraState.longitude = longitude.toFixed(6);
    if (latitude) cameraState.latitude = latitude.toFixed(6);
    if (altitude) cameraState.altitude = altitude.toFixed(2);

    // console.log(`级数：${level} 视高：${alt}km 方位角：${heading}° 俯仰角：${pitch}° 翻滚角：${roll}°`);
  }
}
</script>
  
<style lang="scss" scoped>
.foot-info-container {
  position: fixed;
  bottom: 0rem;
  width: 100%;
  height: 25px;
  line-height: 30px;
  text-align: center;
  background-color: transparent; // #383838
  font-size: 0.18rem;
  z-index: 99999999999;

  .info-box {
    margin: 0 0.2rem;
  }
}
</style>
  