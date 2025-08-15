<!-- 视频投放 -->
<template>
  <!-- 选择本地视频 -->
  <div class="row-wrap">
    <div class="label">{{ $t("videoPath") }}</div>
    <div class="content">
      <n-input-group>
        <n-input v-model:value="state.fileText" :placeholder="$t('localVideoPath')" />
        <n-button @click="chooseFile" type="tertiary">{{
        $t("chooseFile")
        }}</n-button>
      </n-input-group>
    </div>
  </div>

  <!-- 宽度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("width") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.horizontal" :step="1" :min="1" :max="60" />
        <n-input-number v-model:value="state.horizontal"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="1" :max="60" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 高度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("height") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.vertical" :step="1" :min="1" :max="60" />
        <n-input-number v-model:value="state.vertical"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="1" :max="60" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 投放距离 -->
  <div class="row-wrap">
    <div class="label">{{ $t("distencePlace") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.distance" :step="1" :min="1" :max="500" />
        <n-input-number v-model:value="state.distance"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="1" :max="500" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 最大可见距离 -->
  <div class="row-wrap">
    <div class="label">{{ $t("MaxVisibleDistance") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.visibleDistanceMax" :step="1" :min="300" :max="2000" />
        <n-input-number v-model:value="state.visibleDistanceMax" 
          :update-value-on-input="false" :bordered="false" :show-button="false" :min="300" :max="2000" placeholder=""
          size="small" />
      </div>
    </div>
  </div>

  <!-- 裁剪模式 -->
  <div class="row-wrap">
    <div class="label">{{ $t("clipMode") }}</div>
    <div class="content">
      <n-radio-group v-model:value="state.clipMode" name="radiogroup">
        <n-radio v-for="item in state.modeOptions" :key="item.value" :value="item.value">
          {{ item.label }}
        </n-radio>
      </n-radio-group>
    </div>
  </div>

  <!-- 视频投放线 -->
  <div class="row-wrap">
    <div class="content">
      <n-checkbox v-model:checked="state.visibleLine" :label="$t('visibleVideoLine')" />
    </div>
  </div>

  <div class="row-btns">
    <n-button @click="startProjection" class="operate" type="info" :focusable="false">{{
    $t("videoSet") }}</n-button>
    <n-button @click="clipProjectImg" class="operate" type="info" :focusable="false">{{
    $t("clip") }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>


  <div id="videoContain" style="width: 0; height: 0">
    <video id="trailer-0" style="visibility: hidden" autoplay loop controls muted multiple>
      <source src="" type="video/mp4" />
    </video>
  </div>
</template>

<script lang="ts" setup>
// 引入依赖
import { watch, ref, reactive, onBeforeUnmount, onMounted } from "vue";
import tool from "@/tools/tool";
import DrawHandler from "@/lib/DrawHandler";

const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

type stateType = {
  horizontal: number;
  vertical: number;
  distance: number;
  clipMode: string;
  visibleLine: boolean;
  fileText: string;
  modeOptions: any;
  visibleDistanceMax: number;
};
// 设置默认值数据
let state = reactive<stateType>({
  horizontal: 20,
  vertical: 10,
  distance: 200,
  clipMode: "clip_behind_all_plane",
  visibleLine: true,
  fileText: "",
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
  visibleDistanceMax: 500,
});

// 初始化变量
let modelIdProjectPairs = new Map(); // 模型id和视频投放对象对象的键值对
let reader = new FileReader();

let modelUrl = "./Resource/model/projector.s3m";
let currentSelectedSymbol: any = null;
let isActive = false;
let isClip = false;
let currntVideoDom;
let layers, scene, currentProject, s3mInstanceColc;

// 初始化
function init() {
  scene = viewer.scene;
  layers = viewer.scene.layers.layerQueue;
  s3mInstanceColc = new SuperMap3D.S3MInstanceCollection(scene._context);
  viewer.scene.primitives.add(s3mInstanceColc);
}

onMounted(() => {
  init();
  currntVideoDom = document.getElementById("trailer-0");
});

onBeforeUnmount(() => {});

// 点击选择文件函数
async function chooseFile() {
  const file: any = await tool.openLocalFile('.mp4', true);
  if (!file || !(file instanceof File)) return;

  state.fileText = file.name;

  const blob = new Blob([file], { type: "video/mp4" });
  reader.readAsDataURL(blob);
  reader.onload = function (e: any) {
    let vedio = e.target.result;
    let index = document.querySelectorAll("#videoContain>video").length;
    creatVideo_dom(vedio, index).then((res) => {
      currntVideoDom = document.getElementById("trailer-" + index);
    });
  };
}


// 创建Video-html元素
function creatVideo_dom(src, index) {
  return new Promise((resolve, reject) => {
    let videoContain: any = document.getElementById("videoContain");
    let video = document.createElement("video");
    let source = document.createElement("source");
    source.src = src;
    video.appendChild(source);
    video.id = "trailer-" + index;
    video.classList.add("videoBox");
    video.setAttribute("autoplay", "autoplay");
    video.setAttribute("loop", "loop");
    video.setAttribute("crossorigin", "crossorigin");
    video.setAttribute("controls", "controls");
    video.setAttribute("muted", "muted");
    videoContain.appendChild(video);
    setTimeout(() => {
      resolve(video);
    }, 500);
  });
}

// 视频投放
function startProjection() {
  if (state.fileText === "") {
    window["$message"].warning($t("localVideoPath"));
    return;
  }

  if (currentProject) {
    window["$message"].warning($t("deleteVideo"));
    return;
  }

  tool.setMouseCursor("measureCur");
  let viewPosition = viewer.scene.camera.position;
  currntVideoDom.play();
  currentProject = new SuperMap3D.ProjectionImage(scene);
  currentProject.setImage({ video: currntVideoDom });
  currentProject.distance = Number(state.distance);
  currentProject.horizontalFov = Number(state.horizontal);
  currentProject.verticalFov = Number(state.vertical);
  currentProject.viewPosition = window.iEarthTool.Cartesian3ToDegreeArray(viewPosition);
  currentProject.visibleDistanceMax = state.visibleDistanceMax;
  currentProject.build();
  isActive = true;
  viewer.eventManager.addEventListener("MOUSE_MOVE", move_set_target);
  viewer.eventManager.addEventListener("CLICK", click_set_target, true);
}

// 点击事件
function click_set_target(e) {
  if (isClip) return;
  if (isActive) {
    tool.setMouseCursor("normal");
    let Cartesian3 = SuperMap3D.Cartesian3.fromDegrees(
      currentProject.viewPosition[0],
      currentProject.viewPosition[1],
      currentProject.viewPosition[2]
    );
    let viewPosition = JSON.parse(JSON.stringify(Cartesian3));
    viewer.eventManager.removeEventListener("MOUSE_MOVE", move_set_target);
    addModel(viewPosition);
    isActive = false;
    return;
  }
}

// 鼠标移动事件
function move_set_target(e) {
  let distance = 0;
  let viewPosition = viewer.scene.camera.position;
  let targetPosition = scene.pickPosition(e.message.endPosition);
  if (targetPosition)
    distance = SuperMap3D.Cartesian3.distance(viewPosition, targetPosition);
  if (distance > 0 && distance < 1000)
    currentProject.setDistDirByPoint(window.iEarthTool.Cartesian3ToDegreeArray(targetPosition));
}

// 添加模型
function addModel(position: any, position2?: any) {
  let id = "projector-" + new Date().getTime();
  let direction = currentProject.direction;
  let pitch = currentProject.pitch;
  let radians = SuperMap3D.Math.toRadians(direction);
  let heading =
    radians >= SuperMap3D.Math.PI
      ? radians - SuperMap3D.Math.PI
      : radians + SuperMap3D.Math.PI;
  let pitch2 = -SuperMap3D.Math.toRadians(pitch);
  s3mInstanceColc.add(modelUrl, {
    id: id,
    position: position,
    hpr: {
      heading: heading,
      pitch: 0,
      roll: pitch2,
    },
    scale: new SuperMap3D.Cartesian3(2, 2, 2),
    // offset: new SuperMap3D.Cartesian3(0, 0, 0.1)
  });
  currentSelectedSymbol = s3mInstanceColc.getInstance(modelUrl, id);
  modelIdProjectPairs.set(id, currentProject);
}

// 裁剪
async function clipProjectImg() {
  isClip = true;
  const positions = await drawHandler.startPolygon();
  isClip = false;
  let positionList: any = [];
  for (let i = 0; i < positions.length; i++) {
    let position: any[] = window.iEarthTool.Cartesian3ToDegreeArray(positions[i]);
    positionList.push(position[0]);
    positionList.push(position[1]);
    positionList.push(position[2]);
  }

  updateClipImg(positionList);

}

function updateClipImg(position) {
  if (!currentProject) return;
  currentProject.addClipRegion({
    name: "clip-Projector" + new Date().getTime(),
    position: position,
  });
}

// 清除
function clear() {
  viewer.eventManager.removeEventListener("MOUSE_MOVE", move_set_target);
  drawHandler.destroy();

  if (currentSelectedSymbol) {
    modelIdProjectPairs.delete(currentSelectedSymbol.id);
    s3mInstanceColc.removeInstance(modelUrl, currentSelectedSymbol.id);
    currentSelectedSymbol = null;
  }
  if (currentProject) {
    currentProject.removeAllClipRegion();
    currentProject.destroy();
  }
  if (modelIdProjectPairs.size === 0)
    viewer.eventManager.removeEventListener("CLICK", click_set_target);

  currentProject = null;
  tool.setMouseCursor("normal");
}

// 监听
watch(
  () => state.fileText,
  (val) => {
    if (val.indexOf("http") === -1) return;
    let index = document.querySelectorAll("#videoContain>video").length;
    creatVideo_dom(val, index).then((res) => {
      currntVideoDom = document.getElementById("trailer-" + index);
    });
  }
);
watch(
  () => state.horizontal,
  (val) => {
    if (!currentProject) return;
    currentProject.horizontalFov = Number(val);
  }
);
watch(
  () => state.vertical,
  (val) => {
    if (!currentProject) return;
    currentProject.verticalFov = Number(val);
  }
);
watch(
  () => state.distance,
  (val) => {
    if (!currentProject) return;
    currentProject.distance = Number(val);
  }
);
watch(
  () => state.visibleDistanceMax,
  (val) => {
    if (!currentProject) return;
    currentProject.visibleDistanceMax = Number(val);
  }
);
watch(
  () => state.visibleLine,
  (val) => {
    if (!currentProject) return;
    s3mInstanceColc.visible = val; //隐藏所有模型
    modelIdProjectPairs.forEach((projector) => {
      //隐藏所有投放线
      projector.hintLineVisible = val;
    });
  }
);
watch(
  () => state.clipMode,
  (val) => {
    if (!currentProject) return;
    let clipMode =
      val === "clip_behind_any_plane"
        ? SuperMap3D.ModifyRegionMode.CLIP_INSIDE
        : SuperMap3D.ModifyRegionMode.CLIP_OUTSIDE;
    currentProject.setClipMode(clipMode);
  }
);
</script>
