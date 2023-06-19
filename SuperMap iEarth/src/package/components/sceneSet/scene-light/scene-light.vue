<template>
  <!-- 灯光 -->
  <div class="symbol-container">
    <span class="name">符号库</span>
    <div class="icon-container">
      <div class="icon-list">
        <span
          v-for="(item, index) in state.itemOptions"
          :key="index"
          :bordered="false"
          :title="item.lable"
          @click="changleIconItem(item)"
          class="icon-span"
          :class="item.isSelect ? 'is-select' : ''"
          ><svg-icon :name="item.iconName" class="icon-size" />
        </span>
      </div>
    </div>
  </div>

  <!-- 颜色与强度 共有 -->
  <sm-rowLayOut contentMarginLeft="-0.08rem" contentWidth="2.4rem">
    <template #item-lable>光源颜色</template>
    <template #item-content>
      <div class="single-color-pick-bg">
        <sm-color-pick v-model:value="state.lightColor"></sm-color-pick>
      </div>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut
    lableWidth="0.6rem"
    marginbottom="0.15rem"
    contentWidth="2.05rem"
    slotType="slider"
  >
    <template #item-lable>光源强度</template>
    <template #item-content-slider>
      <n-slider v-model:value="state.lightIntensity" style="width: 80%" />
      <div style="font-size: 0.12rem; margin-left: 0.12rem">
        {{ state.lightIntensity }}
      </div>
    </template>
  </sm-rowLayOut>

  <!-- 点光源  聚光灯-->
  <sm-rowLayOut
    v-if="state.lightSelectId !== 2"
    lableWidth="0.6rem"
    marginbottom="0.15rem"
    contentWidth="2.05rem"
    slotType="slider"
  >
    <template #item-lable>扩散距离</template>
    <template #item-content-slider>
      <n-slider v-model:value="state.cutoffDistance" style="width: 80%" />
      <div style="font-size: 0.12rem; margin-left: 0.12rem">
        {{ state.cutoffDistance }}
      </div>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut
    v-if="state.lightSelectId !== 2"
    lableWidth="0.6rem"
    marginbottom="0.15rem"
    contentWidth="2.05rem"
    slotType="slider"
  >
    <template #item-lable>衰减因子</template>
    <template #item-content-slider>
      <n-slider v-model:value="state.lightDecay" style="width: 80%" />
      <div style="font-size: 0.12rem; margin-left: 0.12rem">
        {{ state.lightDecay }}
      </div>
    </template>
  </sm-rowLayOut>

  <!-- 聚光灯 -->
  <sm-rowLayOut
    v-if="state.lightSelectId === 1"
    lableWidth="0.6rem"
    marginbottom="0.15rem"
    contentWidth="1.93rem"
    slotType="slider"
  >
    <template #item-lable>聚光范围</template>
    <template #item-content-slider>
      <n-slider v-model:value="state.spotLightAngle" style="width: 80%" />
      <div style="font-size: 0.12rem; margin-left: 0.12rem">
        {{ state.spotLightAngle }}
      </div>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut v-if="state.lightSelectId === 1">
    <template #item-lable>显示光源模型</template>
    <template #item-content>
      <n-checkbox v-model:checked="state.showligthModel"></n-checkbox>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut v-if="state.lightSelectId === 1">
    <template #item-lable>显示光源坐标</template>
    <template #item-content>
      <n-checkbox v-model:checked="state.showligtCoordinate"></n-checkbox>
    </template>
  </sm-rowLayOut>

  <sm-btnGroup>
    <template #btn-left>
      <n-button type="info" color="#3499E5" text-color="#fff" @click="addLight"
        >添加</n-button
      >
    </template>
    <template #btn-right>
      <n-button class="btn-secondary" @click="clear">清除</n-button>
    </template>
  </sm-btnGroup>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount } from "vue";
import { useNotification } from "naive-ui";
import initHandler from "@/tools/drawHandler";
import { useChangePanelStore } from "@/store/changePanelbg/index";

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
  cutoffDistance: 20,
  lightDecay: 5,
  lightIntensity: 5,
  spotLightAngle: 30,
  showligthModel: true,
  showligtCoordinate: true,
  itemOptions: [
    {
      index: 1,
      lable: "点光源",
      iconName: "light-point",
      isSelect: true,
    },
    {
      index: 2,
      lable: "聚光灯",
      iconName: "light-spot",
      isSelect: false,
    },
    {
      index: 3,
      lable: "平行光",
      iconName: "light-parallel",
      isSelect: false,
    },
  ],
});

let handlerPolyline: any, handlerPoint: any;
let lightSource: any[] = [];

// 开始添加
function addLight() {
  switch (state.lightSelectId) {
    case 0:
      add_point(addPointLight);
      break;
    case 1:
      add_line(addSpotLight);
      break;
    case 2:
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
    handlerPoint = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point, 0);
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
    color: Cesium.Color.fromCssColorString(state.lightColor),
    cutoffDistance: Number(state.cutoffDistance),
    decay: Number(state.lightDecay),
    intensity: Number(state.lightIntensity),
  };
  let pointLight = new Cesium.PointLight(position, options);
  viewer.scene.addLightSource(pointLight);
  lightSource.push(pointLight);
}

// 添加聚光灯
function addSpotLight(positions: any) {
  let position1 = addModleHeight(positions[0]);
  let position2 = positions[1];
  let options = {
    color: Cesium.Color.fromCssColorString(state.lightColor),
    distance: Number(state.cutoffDistance),
    decay: Number(state.lightDecay),
    intensity: Number(state.lightIntensity),
    angle: Cesium.Math.toRadians(Number(state.spotLightAngle)),
  };
  let spotLight = new Cesium.SpotLight(position1, position2, options);
  viewer.scene.addLightSource(spotLight);
  lightSource.push(spotLight);
}

// 添加平行光
function addDirectionalLight(positions: any) {
  let position1 = addModleHeight(positions[0]);
  let options = {
    targetPosition: positions[1],
    color: Cesium.Color.fromCssColorString(state.lightColor),
    intensity: Number(state.lightIntensity),
  };
  let directionalLight = new Cesium.DirectionalLight(position1, options);
  viewer.scene.addLightSource(directionalLight);
  lightSource.push(directionalLight);
}

// 默认设置附加高度
function addModleHeight(Cartesian3: any) {
  let Cartographic = Cesium.Cartographic.fromCartesian(Cartesian3);
  Cartographic.height += 0.5;
  return Cesium.Cartographic.toCartesian(Cartographic);
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
const changePanelStore = useChangePanelStore();
function changleIconItem(item: any) {
  for (let i = 0; i < state.itemOptions.length; i++) {
    if (state.itemOptions[i].index == item.index) {
      state.itemOptions[i].isSelect = true;
    } else {
      state.itemOptions[i].isSelect = false;
    }
  }
  changePanelStore.setAnalyserPanel(item.name);
}

onBeforeUnmount(() => {
  clear();
});
</script>

<style lang="scss" scoped>
@include iconContainer(0, 2.2rem);
.symbol-container {
  display: flex;
  font-size: 0.12rem;
  // margin-left: 0.1rem;
  margin-bottom: 0.15rem;
}

.icon-list {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .is-select {
    border: 0.01rem solid #3499e5;
  }
}
</style>

