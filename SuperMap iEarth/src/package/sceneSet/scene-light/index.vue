<template>

  <div class="row-item">
      <span>符号库</span>
      <div class="icon-container">
        <div class="icon-list" style="width: 1.95rem;">
          <span
            v-for="(item, index) in state.itemOptions"
            :key="index"
            :bordered="false"
            :title="item.lable"
            @click="changleIconItem(item)"
            class="icon-span"
            :class="item.isSelect ? 'is-select' : ''"
          >
            <i class="iconfont iconSize" :class="item.iconName"  :title="item.lable"></i>
          </span>
        </div>
      </div>
    </div>

  <div class="row-item">
    <span>光源颜色</span>
    <div class="color-pick-box" style="width: 1.95rem;">
      <n-color-picker
        v-model:value="state.lightColor"
        :render-label="
          () => {
            return '';
          }
        "
        size="small"
      ></n-color-picker>
    </div>
  </div>

  <div class="row-item" v-if="state.lightSelectId != 3">
    <span>扩散距离</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.cutoffDistance"
        :step="1"
        :min="0"
        :max="500"
      />
      <span>{{ state.cutoffDistance }}</span>
    </div>
  </div>

  <div class="row-item" v-if="state.lightSelectId != 3">
    <span>衰减因子</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.lightDecay"
        :step="0.1"
        :min="0"
        :max="10"
      />
      <span>{{ state.lightDecay }}</span>
    </div>
  </div>

  <div class="row-item">
    <span>光源强度</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.lightIntensity"
        :step="0.1"
        :min="0"
        :max="10"
      />
      <span>{{ state.lightIntensity }}</span>
    </div>
  </div>

  <div class="row-item" v-if="state.lightSelectId === 2">
    <span>聚光范围</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.spotLightAngle"
        :step="1"
        :min="1"
        :max="90"
      />
      <span>{{ state.spotLightAngle }}</span>
    </div>
  </div>

  <div class="row-item">
      <span>显示光源模型</span>
      <div class="check-box">
        <n-checkbox v-model:checked="state.showligthModel"></n-checkbox>
      </div>
    </div>
  <div class="row-item">
      <span>显示光源坐标</span>
      <div class="check-box">
        <n-checkbox v-model:checked="state.showligtCoordinate"></n-checkbox>
      </div>
    </div>


  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="addLight"
      style="margin-right: 0.1rem"
      >添加</n-button
    >
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount,watch } from "vue";
import { useNotification } from "naive-ui";
import initHandler from "@/tools/drawHandler";

const notification = useNotification();

type itemOptionsType = {
  index: number;
  lable: string;
  iconName: string;
  isSelect: boolean;
};
type stateType = {
  lightSelectId: number; //选中光源id
  lightColor: string; //光源颜色
  cutoffDistance: number; //扩散距离
  lightDecay: number; //衰减因子
  lightIntensity: number; //光源强度
  spotLightAngle: number; //聚光范围
  showligthModel: boolean; // 是否显示光源模型
  showligtCoordinate: boolean; // 是否显示光源坐标
  itemOptions: itemOptionsType[]; // 量算方式列表
};

// 设置默认值数据
let state = reactive<stateType>({
  lightSelectId: 0,
  // lightColor: "#FFFFFF",
  lightColor: "rgb(255, 255, 255)",
  cutoffDistance: 470,
  lightDecay: 2.5,
  lightIntensity: 4.7,
  spotLightAngle: 49,
  showligthModel: true,
  showligtCoordinate: true,
  itemOptions: [
    {
      index: 1,
      lable: "点光源",
      iconName: "icondianguangyuan",
      isSelect: true,
    },
    {
      index: 2,
      lable: "聚光灯",
      iconName: "iconjuguangdeng",
      isSelect: false,
    },
    {
      index: 3,
      lable: "平行光",
      iconName: "iconpinghangguang",
      isSelect: false,
    },
  ],
});

let handlerPolyline: any, handlerPoint: any;
let lightSource: any[] = [];

// 开始添加
function addLight() {
  switch (state.lightSelectId) {
    case 1:
      add_point(addPointLight);
      break;
    case 2:
      add_line(addSpotLight);
      break;
    case 3:
      add_line(addDirectionalLight);
      break;
  }
}

// 绘制线
function add_line(callback: any) {
  notification.create({
    content: () => "鼠标左键绘制两点确定光源方向，右键结束",
    duration: 3500,
  });
  if (!handlerPolyline) {
    handlerPolyline = initHandler("Polyline");
  }
  handlerPolyline.handlerDrawing().then(
    (res: any) => {
      handlerPolyline.polylineTransparent.show = false;
      callback(res.object.positions);
    },
    (err: any) => {
      console.log(err);
    }
  );
  handlerPolyline.activate();
}

// 绘制点
function add_point(callback: any) {
  if (!handlerPoint) {
    handlerPoint = new SuperMap3D.DrawHandler(
      viewer,
      SuperMap3D.DrawMode.Point,
      0
    );
    handlerPoint.activeEvt.addEventListener((isActive: any) => {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = "";
        document.body.classList.add("measureCur");
      }
    });
    handlerPoint.drawEvt.addEventListener((result: any) => {
      callback(result.object.position);
      handlerPoint.deactivate();
      handlerPoint.clear();
      document.body.classList.remove("measureCur");
    });
  }

  handlerPoint.activate();
}

// 添加点光源
function addPointLight(position: any) {
  position = addModleHeight(position);
  let options = {
    color: SuperMap3D.Color.fromCssColorString(state.lightColor),
    cutoffDistance: Number(state.cutoffDistance),
    decay: Number(state.lightDecay),
    intensity: Number(state.lightIntensity),
  };
  let pointLight = new SuperMap3D.PointLight(position, options);
  viewer.scene.addLightSource(pointLight);
  lightSource.push(pointLight);
}

// 添加聚光灯
function addSpotLight(positions: any) {
  let position1 = addModleHeight(positions[0]);
  let position2 = positions[1];
  let options = {
    color: SuperMap3D.Color.fromCssColorString(state.lightColor),
    distance: Number(state.cutoffDistance),
    decay: Number(state.lightDecay),
    intensity: Number(state.lightIntensity),
    angle: SuperMap3D.Math.toRadians(Number(state.spotLightAngle)),
  };
  let spotLight = new SuperMap3D.SpotLight(position1, position2, options);
  viewer.scene.addLightSource(spotLight);
  lightSource.push(spotLight);
}

// 添加平行光
function addDirectionalLight(positions: any) {
  let position1 = addModleHeight(positions[0]);
  let options = {
    targetPosition: positions[1],
    color: SuperMap3D.Color.fromCssColorString(state.lightColor),
    intensity: Number(state.lightIntensity),
  };
  let directionalLight = new SuperMap3D.DirectionalLight(position1, options);
  viewer.scene.addLightSource(directionalLight);
  lightSource.push(directionalLight);
}

// 默认设置附加高度
function addModleHeight(Cartesian3: any) {
  let Cartographic = SuperMap3D.Cartographic.fromCartesian(Cartesian3);
  Cartographic.height += 0.5;
  return SuperMap3D.Cartographic.toCartesian(Cartographic);
}

// 清除
function clear() {
  lightSource.forEach((light) => {
    viewer.scene.removeLightSource(light);
  });
  lightSource.length = 0;
  if (handlerPolyline) handlerPolyline.clearHandler();
  if (handlerPoint) {
    handlerPoint.deactivate();
    handlerPoint.clear();
    viewer.enableCursorStyle = true;
    document.body.classList.remove("measureCur");
  }
}

// 符号
function changleIconItem(item: any) {
  state.lightSelectId = item.index;
  for (let i = 0; i < state.itemOptions.length; i++) {
    if (state.itemOptions[i].index == item.index) {
      state.itemOptions[i].isSelect = true;
    } else {
      state.itemOptions[i].isSelect = false;
    }
  }
}

// 可以设置监听，看是否有必要
watch(()=>state.cutoffDistance,()=>{
  // lightSource[0].cutoffDistance = state.cutoffDistance;
})

onBeforeUnmount(() => {
  clear();
});
</script>

<style lang="scss" scoped>
.is-select {
    color: #3499e5;
  }

  
</style>

