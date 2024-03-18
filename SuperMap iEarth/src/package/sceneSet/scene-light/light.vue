<template>
  <div class="row-item">
    <span>{{ $t("symbolLibrary") }}</span>
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
        >
          <i
            class="iconfont iconSize"
            :class="item.iconName"
            :title="item.lable"
            style="margin-top: 0px"
          ></i>
        </span>
      </div>
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("lightsourceColor") }}</span>
    <div class="color-pick-box">
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
    <span>{{ $t("diffusionDistance") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.cutoffDistance"
        :step="1"
        :min="0"
        :max="500"
      />
      <n-input-number
        v-model:value="state.cutoffDistance"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="500"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item" v-if="state.lightSelectId != 3">
    <span>{{ $t("lightDecay") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.lightDecay"
        :step="0.1"
        :min="0"
        :max="10"
      />
      <n-input-number
        v-model:value="state.lightDecay"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="10"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("lightsourceIntensity") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.lightIntensity"
        :step="0.1"
        :min="0"
        :max="10"
      />
      <n-input-number
        v-model:value="state.lightIntensity"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="10"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item" v-if="state.lightSelectId === 2">
    <span>{{ $t("spotlightRange") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.spotLightAngle"
        :step="1"
        :min="1"
        :max="90"
      />
      <n-input-number
        v-model:value="state.spotLightAngle"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="1"
        :max="90"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("displayLightmodel") }}</span>
    <div class="check-box">
      <n-checkbox v-model:checked="state.visibleModel"></n-checkbox>
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("displayLightcorrdinate") }}</span>
    <div class="check-box">
      <n-checkbox v-model:checked="state.visiblePositions"></n-checkbox>
    </div>
  </div>

  <div
    class="bableLight"
    ref="bableLightDom"
    v-show="state.visiblePositions && state.bableShow"
  >
    <div class="row-item" style="margin-top: 0.12rem; cursor: default">
      <span class="light-anaylse-pop-titie">{{ $t("modelInformation") }}</span>
      <span @click="state.visiblePositions = false" style="margin-right: 14px"
        >X</span
      >
    </div>
    <div class="row-item" style="margin-left: 0.12rem; margin-right: 0.12rem">
      <span>{{ $t("longitude") }}</span>
      <n-input-number
        style="width: 1.5rem"
        v-model:value="state.modelPosition[0]"
        :show-button="false"
        disabled
      >
      </n-input-number>
    </div>
    <div class="row-item" style="margin-left: 0.12rem; margin-right: 0.12rem">
      <span>{{ $t("latitude") }}</span>
      <n-input-number
        style="width: 1.5rem"
        v-model:value="state.modelPosition[1]"
        :show-button="false"
        disabled
      >
      </n-input-number>
    </div>
    <div class="row-item" style="margin-left: 0.12rem; margin-right: 0.12rem">
      <span>{{ $t("elevation") }}</span>
      <n-input-number
        style="width: 1.5rem"
        v-model:value="state.modelPosition[2]"
        :show-button="false"
        disabled
      >
      </n-input-number>
    </div>
  </div>

  <div class="btn-row-item" style="margin-left: 0.96rem">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="addLight"
      style="margin-right: 0.1rem"
      >{{ $t("add") }}</n-button
    >
    <n-button
      class="btn-secondary"
      @click="clear"
      color="rgba(255, 255, 255, 0.65)"
      ghost
      >{{ $t("clear") }}</n-button
    >
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch, ref } from "vue";
import { useNotification } from "naive-ui";
import initHandler from "@/tools/drawHandler";
import tool from "@/tools/tool";

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
  addLightFlag: boolean; // 判断当前是否处于添加灯光状态
  modelPosition: any;
  visibleModel: boolean;
  bubbleShow: boolean;
  dockFontShow: boolean;
  visiblePositions: boolean;
  bableShow: boolean;
  // currentSelectedEntityPosition:
};

// 设置默认值数据
let state = reactive<stateType>({
  lightSelectId: 1,
  // lightColor: "#FFFFFF",
  lightColor: "rgb(255, 255, 255)",
  cutoffDistance: 470,
  lightDecay: 2.5,
  lightIntensity: 4.7,
  spotLightAngle: 49,
  showligthModel: true,
  showligtCoordinate: true,
  addLightFlag: false,
  modelPosition: [0, 0, 0],
  visibleModel: true,
  bubbleShow: false,
  dockFontShow: true,
  visiblePositions: false,
  bableShow: false,
  itemOptions: [
    {
      index: 1,
      lable: $t("pointLight"),
      iconName: "icondianguangyuan",
      isSelect: true,
    },
    {
      index: 2,
      lable: $t("spotLight"),
      iconName: "iconjuguangdeng",
      isSelect: false,
    },
    {
      index: 3,
      lable: $t("parallelLight"),
      iconName: "iconpinghangguang",
      isSelect: false,
    },
  ],
});

// 初始化变量
const scene = viewer.scene;
let bableLightDom = ref();
let entityLightPairs = new Map(); // Entity和点光源对象的键值对
let handlerPolyline: any,
  handlerPoint: any,
  lightSource: any[] = [];
let modelUrl = "./Resource/model/light.s3m";
let currentSelectedEntity, selectdeLightSource, s3mInstanceColc, modelEditor;

function init() {
  s3mInstanceColc = new SuperMap3D.S3MInstanceCollection(scene._context);
  viewer.scene.primitives.add(s3mInstanceColc);
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  distory(true);
  viewer.eventManager.removeEventListener("CLICK", click_light);
  lightSource.forEach((light) => {
    viewer.scene.removeLightSource(light);
  });
  lightSource.length = 0;

  s3mInstanceColc.removeCollection(modelUrl);
  s3mInstanceColc = null;
});

// 开始添加
function addLight() {
  state.addLightFlag = true;
  viewer.eventManager.addEventListener("CLICK", click_light, true);
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

  if (state.lightSelectId == 1) {
    notification.create({
      content: () => $t("lightTip_edit"),
      duration: 3500,
    });
  }
}

// 点击事件：添加灯光或激modelEdit
function click_light(e) {
  if (!state.addLightFlag) {
    let symbol = viewer.scene.pick(e.message.position) || viewer.selectedEntity;
    if (
      symbol &&
      symbol.id &&
      typeof symbol.id === "string" &&
      symbol.id.indexOf("light-model-") != -1
    ) {
      if (currentSelectedEntity && currentSelectedEntity.id === symbol.id.id)
        return;
      currentSelectedEntity = symbol;
      selectdeLightSource = entityLightPairs.get(symbol.id);
      if (!modelEditor) addModelEditor(symbol.primitive);
      else modelEditor.setEditObject(symbol.primitive);
      let position = tool.CartesiantoDegrees(modelEditor._position);
      state.modelPosition.length = 0;
      state.modelPosition.push(
        ...[
          position[0].toFixed(6),
          position[1].toFixed(6),
          position[2].toFixed(2),
        ]
      );
      state.bableShow = true;
      bableLightDom.value.style.top = e.message.position.y - 200 + "px";
      bableLightDom.value.style.left = e.message.position.x + 20 + "px";
      return;
    }
    state.bableShow = false;
    currentSelectedEntity = undefined;
    selectdeLightSource = undefined;
    if (modelEditor) modelEditor.deactivate();
  }
}

// 添加模型编辑器
let isModelMoving = false;
function addModelEditor(model) {
  modelEditor = new SuperMap3D.ModelEditor({
    model: model,
    scene: viewer.scene,
    axesShow: {
      translation: true,
      rotation: false,
      scale: true,
    },
  });
  modelEditor.activate();
  modelEditor.changedEvt.addEventListener((param) => {
    let Cartesian3 = new SuperMap3D.Cartesian3();
    SuperMap3D.Matrix4.getTranslation(param.modelMatrix, Cartesian3);
    if (Cartesian3) {
      selectdeLightSource.position = Cartesian3;
      isModelMoving = true;
      changeSlider(() => (isModelMoving = false));
      let position = tool.CartesiantoDegrees(Cartesian3);
      state.modelPosition.length = 0;
      state.modelPosition.push(
        ...[
          position[0].toFixed(6),
          position[1].toFixed(6),
          position[2].toFixed(2),
        ]
      );
    }
  });
}

// 防止滑块快速滑动的多次执行
let timer;
function changeSlider(callback) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(function () {
    callback();
  }, 1000);
}

// 添加光源模型
function addModel(position, pointLight) {
  let id = "light-model-" + new Date().getTime();
  s3mInstanceColc.add(modelUrl, {
    id: id,
    position: position,
    scale: new SuperMap3D.Cartesian3(2, 2, 2),
  });
  currentSelectedEntity = s3mInstanceColc.getInstance(modelUrl, id);
  entityLightPairs.set(id, pointLight);
}

// 绘制线
function add_line(callback: any) {
  notification.create({
    content: () => $t("addSpotLightTip"),
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
  selectdeLightSource = pointLight;
  addModel(position, pointLight);
  lightSource.push(pointLight);
  state.addLightFlag = false;
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
  selectdeLightSource = spotLight;
  addModel(position1, spotLight);
  lightSource.push(spotLight);
  state.addLightFlag = false;
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
  selectdeLightSource = directionalLight;
  addModel(position1, directionalLight);
  lightSource.push(directionalLight);
  state.addLightFlag = false;
}

// 默认设置附加高度
function addModleHeight(Cartesian3: any) {
  let Cartographic = SuperMap3D.Cartographic.fromCartesian(Cartesian3);
  Cartographic.height += 0.5;
  return SuperMap3D.Cartographic.toCartesian(Cartographic);
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

// 更新弹窗位置
function updatePopup() {
  if (currentSelectedEntity) {
    let position = currentSelectedEntity.primitive._position;
    updatePopupPosition(position);
  }
}
function updatePopupPosition(position) {
  var WindowCoordinates = SuperMap3D.SceneTransforms.wgs84ToWindowCoordinates(
    viewer.scene,
    position
  );
  bableLightDom.value.style.top =
    WindowCoordinates.y - bableLightDom.value.offsetHeight - 10 + "px";
  bableLightDom.value.style.left =
    WindowCoordinates.x - bableLightDom.value.offsetWidth / 2 + 140 + "px";
}

// 清除
function clear(flag = false) {
  distory();
}

function distory(flag = false) {
  state.bableShow = false;
  if (!selectdeLightSource) {
    if (!flag) {
      notification.create({
        content: () => $t("lightTip_del"),
        duration: 3500,
      });
    }

    return;
  }
  viewer.scene.removeLightSource(selectdeLightSource);
  state.visiblePositions = false;
  if (currentSelectedEntity) {
    entityLightPairs.delete(currentSelectedEntity.id);
    s3mInstanceColc.removeInstance(modelUrl, currentSelectedEntity.id);
    currentSelectedEntity = null;
  }
  if (modelEditor) modelEditor.deactivate();
  state.addLightFlag = false;
  selectdeLightSource = null;

  if (handlerPolyline) handlerPolyline.clearHandler();
  if (handlerPoint) {
    handlerPoint.deactivate();
    handlerPoint.clear();
    viewer.enableCursorStyle = true;
    document.body.classList.remove("measureCur");
  }
}

watch(
  () => state.lightColor,
  (val) => {
    if (!selectdeLightSource) return;
    let color = SuperMap3D.Color.fromCssColorString(val);
    selectdeLightSource.color = color;
  }
);
watch(
  () => state.visiblePositions,
  (val) => {
    if (val) {
      viewer.clock.onTick.addEventListener(updatePopup);
    } else {
      viewer.clock.onTick.removeEventListener(updatePopup);
    }
  }
);
watch(
  () => state.cutoffDistance,
  (val) => {
    if (!selectdeLightSource) return;
    if (selectdeLightSource.lightType === 1) {
      selectdeLightSource.cutoffDistance = Number(val);
      return;
    }
    if (selectdeLightSource.lightType === 2) {
      selectdeLightSource.distance = Number(val);
      return;
    }
  }
);
watch(
  () => state.lightDecay,
  (val) => {
    if (!selectdeLightSource) return;
    if (selectdeLightSource.lightType !== 0) {
      selectdeLightSource.decay = Number(val);
    }
  }
);
watch(
  () => state.lightIntensity,
  (val) => {
    if (!selectdeLightSource) return;
    selectdeLightSource.intensity = Number(val);
  }
);
watch(
  () => state.spotLightAngle,
  (val) => {
    if (!selectdeLightSource) return;
    if (selectdeLightSource.lightType === 2) {
      selectdeLightSource.angle = SuperMap3D.Math.toRadians(Number(val));
    }
  }
);
watch(
  () => state.visibleModel,
  (val) => {
    if (!currentSelectedEntity) return;
    if (modelEditor) modelEditor.deactivate();
    s3mInstanceColc.visible = val;
  }
);
watch(
  () => state.modelPosition,
  (val) => {
    if (!currentSelectedEntity || isModelMoving) return;
    changeSlider(() => {
      let lon = Number(val[0]);
      let lat = Number(val[1]);
      let hei = Number(val[2]);
      let position = SuperMap3D.Cartesian3.fromDegrees(lon, lat, hei);
      if (!position) return;
      selectdeLightSource.position = position;
      currentSelectedEntity.primitive.updatePosition(position);
      if (modelEditor)
        modelEditor.setEditObject(currentSelectedEntity.primitive);
    });
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.is-select {
  color: #3499e5;
}

.bableLight {
  position: fixed;
  top: 2rem;
  left: 5rem;
  background-color: #383838;
  opacity: 0.8;
  height: 1.8rem;
  width: 2.28rem;
  z-index: 200000;

  .light-anaylse-pop-titie {
    font-size: 0.12rem;
    line-height: 0.2rem;
    margin-left: 0.12rem;
  }

  span {
    font-size: 0.12rem;
  }
}
</style>
