<template>
  <!-- box裁剪 -->
  <div class="row-item">
    <span>{{ $t("clipMode") }}</span>
    <n-radio-group
      v-model:value="state.clipMode"
      name="radiogroup"
      class="radio-group"
      style="margin-right: 0.3rem; width: 1.65rem"
    >
      <n-radio
        v-for="item in state.modeOptions"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </n-radio>
    </n-radio-group>
  </div>

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="startBoxClipByEitor"
      style="margin-right: 0.1rem"
      >{{ $t("clip") }}</n-button
    >
    <n-button
      class="btn-secondary"
      @click="clearBoxClipByEitor"
      color="rgba(255, 255, 255, 0.65)"
      ghost
      >{{ $t("clear") }}</n-button
    >
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import tool from "@/tools/tool";

type stateType = {
  clipMode: string; // 裁剪模式
  modeOptions: any; // 模式选项
};

// 设置默认值
let state = reactive<stateType>({
  clipMode: "clip_behind_all_plane",
  modeOptions: [
    {
      label: $t("inner"),
      value: "clip_behind_all_plane",
    },
    {
      label: $t("outer"),
      value: "clip_behind_any_plane",
    },
  ],
});

// 初始化变量
let boxEntity: any, editorBox: any;
let layers = viewer.scene.layers.layerQueue;
let handlerBox = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Box);

onMounted(() => {});

onBeforeUnmount(() => {
  clearBoxClipByEitor();
  if (editorBox) editorBox.destroy();
  editorBox = undefined;
  handlerBox = undefined;
  boxEntity = undefined;
});

// 分析
function startBoxClipByEitor() {
  tool.setMouseCursor("drawCur");

  clearBoxClipByEitor();
  if (editorBox) {
    handlerBox.activate();
    return;
  }

  // 设置裁剪线颜色
  setAllLayersClipColor();

  window["$notification"].create({
    content: () => $t("boxclipTip"),
    duration: 5500,
  });

  handlerBox.drawEvt.addEventListener((e: any) => {
    boxEntity = e.object;
    let newDim = boxEntity.box.dimensions.getValue();
    let position = boxEntity.position.getValue(0);
    let boxOption = {
      dimensions: newDim,
      position: position,
      clipMode: state.clipMode,
      heading: 0,
    };

    //box编辑
    editorBox = new SuperMap3D.BoxEditor(viewer, boxEntity);
    editorBox.editEvt.addEventListener((e: any) => {
      boxEntity.box.dimensions = e.dimensions;
      boxEntity.position = e.position;
      boxEntity.orientation = e.orientation;
      setClipBox();
    });
    editorBox.activate();
    setAllLayersClipOptions(boxOption);
    handlerBox.clear();
    handlerBox.deactivate();

    tool.setMouseCursor("normal");
  });
  handlerBox.activate();
}

// 更新
function setClipBox() {
  if (typeof boxEntity == "undefined") {
    return;
  }
  let newDim = boxEntity.box.dimensions.getValue();
  let position = boxEntity.position.getValue(0);

  let heading = 0;
  if (typeof boxEntity.orientation != "undefined") {
    let rotationM3 = SuperMap3D.Matrix3.fromQuaternion(
      boxEntity.orientation._value,
      new SuperMap3D.Matrix3()
    );
    let localFrame = SuperMap3D.Matrix4.fromRotationTranslation(
      rotationM3,
      SuperMap3D.Cartesian3.ZERO,
      new SuperMap3D.Matrix4()
    );
    let inverse = SuperMap3D.Matrix4.inverse(
      SuperMap3D.Transforms.eastNorthUpToFixedFrame(position),
      new SuperMap3D.Matrix4()
    );
    let hprm = SuperMap3D.Matrix4.multiply(
      inverse,
      localFrame,
      new SuperMap3D.Matrix4()
    );
    let rotation = SuperMap3D.Matrix4.getMatrix3(
      hprm,
      new SuperMap3D.Matrix3()
    );
    let hpr = SuperMap3D.HeadingPitchRoll.fromQuaternion(
      SuperMap3D.Quaternion.fromRotationMatrix(rotation)
    );
    heading = hpr.heading;
  }
  let boxOptions = {
    dimensions: newDim,
    position: position,
    clipMode: state.clipMode,
    heading: heading,
  };
  setAllLayersClipOptions(boxOptions);
}

//设置图层裁剪
function setAllLayersClipOptions(boxOptions: any) {
  for (let i = 0, j = layers.length; i < j; i++) {
    layers[i].setCustomClipBox(boxOptions);
  }
}

//设置线颜色
function setAllLayersClipColor() {
  for (let i = 0, j = layers.length; i < j; i++) {
    layers[i].selectEnabled = false;
    layers[i].clipLineColor = new SuperMap3D.Color(1, 1, 1, 0);
  }
}

// 清除
function clearBoxClipByEitor() {
  if (handlerBox) {
    handlerBox.deactivate();
  }
  if (!boxEntity) {
    return;
  }
  for (let layer of layers) {
    layer.clearCustomClipBox();
  }
  boxEntity = undefined;
  editorBox.deactivate();
  viewer.entities.removeAll();
  handlerBox.clear();
}

// box裁剪模式
watch(
  () => state.clipMode,
  () => {
    setClipBox();
  }
);
</script>
