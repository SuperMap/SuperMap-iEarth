<!-- 灯光 -->
<template>
  <!-- 符号库 -->
  <div class="row-wrap">
    <div class="label">{{ $t("symbolLibrary") }}</div>
    <div class="content">
      <div class="icon-list-box">
        <span v-for="(item, index) in state.itemOptions" :key="index" :bordered="false" :title="item.lable"
          @click="changleIconItem(item)" class="icon-span" :class="item.isSelect ? 'selected-icon' : ''">
          <i class="iconfont iconSize" :class="item.iconName" :title="item.lable" style="margin-top: 0px"></i>
        </span>
      </div>
    </div>
  </div>

  <!-- 灯光颜色 -->
  <div class="row-wrap">
    <div class="label">{{ $t("lightsourceColor") }}</div>
    <div class="content">
      <n-color-picker v-model:value="state.lightColor" :render-label="() => {
      return '';
              }
      " size="small"></n-color-picker>
    </div>
  </div>

  <!-- 扩散距离 -->
  <div class="row-wrap">
    <div class="label">{{ $t("diffusionDistance") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.cutoffDistance" :step="1" :min="0" :max="500" />
        <n-input-number v-model:value="state.cutoffDistance"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0" :max="500" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 衰减因子 -->
  <div class="row-wrap" v-if="state.lightSelectId != 3">
    <div class="label">{{ $t("lightDecay") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.lightDecay" :step="0.1" :min="0" :max="10" />
        <n-input-number v-model:value="state.lightDecay"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0" :max="10" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 光源强度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("lightsourceIntensity") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.lightIntensity" :step="0.1" :min="0" :max="10" />
        <n-input-number v-model:value="state.lightIntensity"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0" :max="10" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 聚光范围 -->
  <div class="row-wrap" v-if="state.lightSelectId === 2">
    <div class="label">{{ $t("spotlightRange") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.spotLightAngle" :step="1" :min="1" :max="90" />
        <n-input-number v-model:value="state.spotLightAngle"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="1" :max="90" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 显示光源模型 -->
  <div class="row-wrap">
    <div class="content">
      <n-checkbox v-model:checked="state.visibleModel" :label="$t('displayLightmodel')" />
    </div>
  </div>

  <!-- 模型大小 -->
  <div class="row-wrap" v-show="state.visibleModel">
    <div class="label">{{ $t("modelSize") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.modelSize" :step="1" :min="1" :max="100" />
        <n-input-number v-model:value="state.modelSize"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="1" :max="100" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <div class="row-btns">
    <n-button @click="addLight" class="operate" type="info" :focusable="false">{{
    $t("add") }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import DrawHandler from "@/lib/DrawHandler";
import ModelEdit from "@/lib/ModelEdit";
import tool from "@/tools/tool";

const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

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
  isDrawing: boolean; // 判断当前是否处于添加灯光状态
  modelPosition: any;
  visibleModel: boolean;
  bubbleShow: boolean;
  dockFontShow: boolean;
  modelSize:number;
};

// 设置默认值数据
const state = reactive<stateType>({
  lightSelectId: 1,
  lightColor: "rgb(255, 255, 255)",
  cutoffDistance: 470,
  lightDecay: 2.5,
  lightIntensity: 4.7,
  spotLightAngle: 49,
  showligthModel: true,
  showligtCoordinate: true,
  isDrawing: false,
  modelPosition: null,
  visibleModel: true,
  bubbleShow: false,
  dockFontShow: true,
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
  modelSize:5,
});

// 初始化变量
const scene = viewer.scene;
const entityLightPairs = new Map(); // 灯光和模型映射表，方便通过模型来找到灯光
const modelUrl = "./Resource/model/light.s3m";

const modelEdit = new ModelEdit(viewer, {
  rotation: false,
  scale: false,
  size: Number(state.modelSize)/10,
  callback: changeLightSourcePosition
})

// 模型编辑器回调函数：当改变entity的位置时改变灯光的位置
function changeLightSourcePosition(entityModel, lightSource) {
  // position : {
  //       get : function() {
  //           return this._sceneMode === SceneMode.SCENE3D ? this._position : this._positionCV;
  //       },
  //       set : function(value) {
  //           Check.defined('point light position', value);
  //           this._position = value;
  //           if(this._sceneMode === SceneMode.COLUMBUS_VIEW) {
  //               this._positionCV = Transforms.convertToColumbusCartesian(this._position);
  //           }
  //       }
  //   },
  // 平面场景中：由于entityModel.position本身就是cv坐标，传过去就又转了一遍，所以这里先把它转成3DCartesian3，在传过去
  // let cartesian3D = SuperMap3D.Transforms.convertTo3DCartesian(entityModel.position);
  // lightSource.position = cartesian3D;
  
  let isPlane = viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW;
  if(isPlane){ // 平面场景下，使用_positionCV
    lightSource._positionCV = entityModel.position;
  }else{
    lightSource.position = entityModel.position;
  }
}

let handlerPoint = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
let selectLightModel, selectdeLightSource;
let instanceCollection = new SuperMap3D.S3MInstanceCollection(scene._context);
viewer.scene.primitives.add(instanceCollection);

// 当场景中已存在自定义灯光，给他添加绑定一个s3m模型方便操作
function addModelToExist() {
  const sceneLightSource = viewer.scene.lightSource;
  const existPointLights = sceneLightSource.pointLight.values; // _array
  const existSpotLights = sceneLightSource.spotLight.values;
  const existDirectionLights = sceneLightSource.directionalLight.values;

  // 平面场景下，对于点光源和聚光灯这个_positionCV才是对的坐标，但是平行光没有_positionCV，直接用position也可以
  // 但是_positionCV是cv坐标，添加模型这里应该用笛卡尔坐标，因此这里应该用SuperMap3D.Transforms.convertTo3DCartesian(pointLight._positionCV)
  // 此时pointLight._position初始化时本身就就是笛卡尔坐标，所以可以直接用pointLight._position
  // 但是pointLight._position初始化一次出set外就没有其他赋值了，用模型编辑器更新坐标的时候，保存的不是最新的坐标，因此我们统一用_positionCV
  let isPlane = viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW;
  existPointLights.forEach(pointLight => {
    let position = isPlane ? SuperMap3D.Transforms.convertTo3DCartesian(pointLight._positionCV) : pointLight.position;
    addModel(position, pointLight); 
  });
  existSpotLights.forEach(spotLight => {
    let position = isPlane ? SuperMap3D.Transforms.convertTo3DCartesian(spotLight._positionCV) : spotLight.position;
    addModel(position, spotLight);
  });
  existDirectionLights.forEach(directionLight => {
    addModel(directionLight.position, directionLight);
  });
}

onMounted(() => {
  state.modelSize = window.customConfig.lightModelSize || 5;
  addModelToExist();
  viewer.eventManager.addEventListener("CLICK", click_light, true);
});

onBeforeUnmount(() => {
  modelEdit.destroy();
  viewer.eventManager.removeEventListener("CLICK", click_light);
  handlerPoint = null;
  viewer.scene.primitives.remove(instanceCollection);
  instanceCollection = null;
});

// 开始添加
function addLight() {
  state.isDrawing = true;
  switch (state.lightSelectId) {
    case 1:
      add_point();
      break;
    case 2:
      add_line('spot');
      break;
    case 3:
      add_line('direction');
      break;
  }
}

// 点击事件：添加灯光或激modelEdit
function click_light(e) {
  if (state.isDrawing) return; // 绘制模型下禁止点选

  const symbol = viewer.scene.pick(e.message.position) || viewer.selectedEntity;
  if (!symbol || !symbol.id || !symbol.primitive || typeof symbol.id != "string" || !symbol.id.includes('lightModel')) { // 未选中实体或未选中对应灯光模型
    selectLightModel = undefined;
    selectdeLightSource = undefined;
    if (modelEdit) modelEdit.close();
    return;
  } else { // 当前选中的实体.id包含lightModel
    selectLightModel = symbol.primitive;
    selectdeLightSource = entityLightPairs.get(selectLightModel.id);
    updataLightState(selectdeLightSource);
    modelEdit.open(selectLightModel, selectdeLightSource);
    return;
  }

}

// 根据选中的灯光模型，更改面板上的参数
function updataLightState(curLightSource: any) {
  if (!curLightSource) return;

  switch (curLightSource.lightType) {
    case 0:
      changleIconItem(state.itemOptions[2]);
      state.lightColor = tool.rgbaToCssString(curLightSource.color) || "rgb(255, 255, 255)";
      state.lightIntensity = curLightSource.intensity || 4.7;
      break;
    case 1:
      changleIconItem(state.itemOptions[0]);
      state.lightColor = tool.rgbaToCssString(curLightSource.color) || "rgb(255, 255, 255)";
      state.cutoffDistance = curLightSource.cutoffDistance || 470;
      state.lightDecay = curLightSource.decay || 2.5;
      state.lightIntensity = curLightSource.intensity || 4.7;
      break;
    case 2:
      changleIconItem(state.itemOptions[1]);
      state.lightColor = tool.rgbaToCssString(curLightSource.color) || "rgb(255, 255, 255)";
      state.cutoffDistance = curLightSource.cutoffDistance || 470;
      state.lightDecay = curLightSource.decay || 2.5;
      state.lightIntensity = curLightSource.intensity || 4.7;
      state.spotLightAngle = SuperMap3D.Math.toDegrees(curLightSource.angle) || 49;
      break;
    default:
      break;
  }
}

// 添加光源模型
function addModel(position, light) {
  const id = `lightModel-${light.id}`;
  const size = Number(state.modelSize);
  instanceCollection.add(modelUrl, {
    id: id,
    position: position,
    scale: new SuperMap3D.Cartesian3(size, size, size),
  });
  selectLightModel = instanceCollection.getInstance(modelUrl, id);
  entityLightPairs.set(id, light);
}

// 开启提示
function openNotification(content: string, duration: number) {
  window["$notification"].create({
    content: () => content || '',
    duration: duration || 3500,
  });
}

// 绘制点
function add_point() {
  openNotification($t("lightTip_edit"), 3500);

  tool.setMouseCursor('measureCur');

  handlerPoint.setInputAction(e => {
    const position = viewer.scene.pickPosition(e.position);
    addPointLight(position);
    tool.setMouseCursor('normal');
    handlerPoint.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK); // 一次性添加
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

// 添加点光源
function addPointLight(position: any) {
  if (!(position instanceof SuperMap3D.Cartesian3)) return;
  const options: any = {
    color: SuperMap3D.Color.fromCssColorString(state.lightColor),
    cutoffDistance: Number(state.cutoffDistance),
    decay: Number(state.lightDecay),
    intensity: Number(state.lightIntensity),
  };
  const pointLight = new SuperMap3D.PointLight(position, options);
  viewer.scene.addLightSource(pointLight);

  selectdeLightSource = pointLight;
  addModel(position, pointLight);
  state.isDrawing = false;
}

// 绘制线
async function add_line(type: string) {
  openNotification($t("addSpotLightTip"), 3500);
  // 根据传入的类型选择对应的回调操作函数
  const callback = type === 'spot' ? addSpotLight : addDirectionalLight;

  const positions = await drawHandler.startPolyline();
  callback(positions);
}


// 添加聚光灯
function addSpotLight(positions: any) {
  if (!positions || positions.length < 2) return;
  const position = positions[0];
  const target = positions[1];
  const options: any = {
    color: SuperMap3D.Color.fromCssColorString(state.lightColor),
    distance: Number(state.cutoffDistance),
    decay: Number(state.lightDecay),
    intensity: Number(state.lightIntensity),
    angle: SuperMap3D.Math.toRadians(Number(state.spotLightAngle)),
  };
  const spotLight = new SuperMap3D.SpotLight(position, target, options);
  viewer.scene.addLightSource(spotLight);

  selectdeLightSource = spotLight;
  addModel(position, spotLight);
  state.isDrawing = false;
}

// 添加平行光
function addDirectionalLight(positions: any) {
  const position = positions[0];
  const options: any = {
    targetPosition: positions[1],
    color: SuperMap3D.Color.fromCssColorString(state.lightColor),
    intensity: Number(state.lightIntensity),
  };
  const directionalLight = new SuperMap3D.DirectionalLight(position, options);
  viewer.scene.addLightSource(directionalLight);

  selectdeLightSource = directionalLight;
  addModel(position, directionalLight);
  state.isDrawing = false;
}

// 切换面板符号
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

// 清除
function clear() {
  if (!selectdeLightSource) {
  openNotification($t("lightTip_del"), 3500);
  return;
}

state.isDrawing = false;

// 关闭模型编辑器
if (modelEdit) modelEdit.close();

// 恢复鼠标样式
tool.setMouseCursor('normal');

drawHandler.destroy();
if (handlerPoint) handlerPoint.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);

// 删除灯光
viewer.scene.removeLightSource(selectdeLightSource);
selectdeLightSource = null;

// 删除模型
if (selectLightModel) {
  entityLightPairs.delete(selectLightModel.id);
  instanceCollection.removeInstance(modelUrl, selectLightModel.id);
  selectLightModel = null;
}
}

watch(
() => state.lightColor,
(val) => {
  if (!selectdeLightSource) return;
  selectdeLightSource.color = SuperMap3D.Color.fromCssColorString(val);;
}
);
watch(
() => state.cutoffDistance,
(val) => {
  if (!selectdeLightSource) return;
  const lightType = selectdeLightSource.lightType;
  if (lightType === 1) selectdeLightSource.cutoffDistance = Number(val);
  if (lightType === 2) selectdeLightSource.distance = Number(val);
}
);
watch(
() => state.lightDecay,
(val) => {
  if (!selectdeLightSource) return;
  const lightType = selectdeLightSource.lightType;
  if (lightType !== 0) selectdeLightSource.decay = Number(val);
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
  const lightType = selectdeLightSource.lightType;
  if (lightType === 2) selectdeLightSource.angle = SuperMap3D.Math.toRadians(Number(val));
}
);
watch(
() => state.visibleModel,
(val) => {
  if(modelEdit) modelEdit.close();
  instanceCollection.visible = val;
}
);
watch(
() => state.modelSize,
(val) => {
  if(!instanceCollection) return;
  let targetGroup = instanceCollection.group[modelUrl];
  if(!targetGroup || !targetGroup.instances) return;
  targetGroup.instances._array.forEach(instance => {
    instance.updateScale(new SuperMap3D.Cartesian3(val, val, val))
  });
  
  if(modelEdit && modelEdit.modelEditor) modelEdit.modelEditor._scale = Number(val)/10;

  window.customConfig.lightModelSize = val;
  // window.instanceCollection.group[modelUrl].instances._array[0].updateScale(new SuperMap3D.Cartesian3(1, 1, 1))
}
);
</script>