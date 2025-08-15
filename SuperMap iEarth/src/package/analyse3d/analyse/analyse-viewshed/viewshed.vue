<!-- 可视域分析 -->
<template>
  <n-scrollbar style="max-height: 3.8rem;padding-right: 0.1rem;" trigger="none">
    <div class="row-wrap">
      <div class="label">{{ $t("longitude") }}</div>
      <div class="content">
        <n-input-number v-model:value="longitude" :show-button="false" disabled>
          <template #suffix>°</template>
        </n-input-number>
      </div>
    </div>

    <div class="row-wrap">
      <div class="label">{{ $t("latitude") }}</div>
      <div class="content">
        <n-input-number v-model:value="latitude" :show-button="false" disabled>
          <template #suffix>°</template>
        </n-input-number>
      </div>
    </div>

    <div class="row-wrap">
      <div class="label">{{ $t("elevation") }}</div>
      <div class="content">
        <n-input-number v-model:value="altitude" :show-button="false" disabled>
          <template #suffix>{{ $t("meter") }}</template>
        </n-input-number>
      </div>
    </div>

    <n-divider />

    <!-- 附加高度：待修改点 -->
    <div class="row-wrap" v-show="!state.viewshedAnimation">
      <div class="label">{{ $t("additionalHeight") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.addheight" :step="0.1" :min="1" :max="100" />
          <n-input-number v-model:value="state.addheight" :update-value-on-input="false" :bordered="false"
            :show-button="false" placeholder="" size="small" />
          <span class="unit">{{ $t("meter") }}</span>
        </div>
      </div>
    </div>

    <!-- 水平视角 -->
    <div class="row-wrap">
      <div class="label">{{ $t("horizontalFov") }}</div>
      <div class="content">
        <n-input-number v-model:value="state.horizontalFov" :min="1" :max="179" :show-button="false">
          <template #suffix>°</template>
        </n-input-number>
      </div>
    </div>

    <!-- 垂直视角 -->
    <div class="row-wrap">
      <div class="label">{{ $t("verticalFov") }}</div>
      <div class="content">
        <n-input-number v-model:value="state.verticalFov" :min="1" :max="180" :show-button="false">
          <template #suffix>°</template>
        </n-input-number>
      </div>
    </div>

    <!-- 提示线颜色 -->
    <div class="row-wrap">
      <div class="label">{{ $t("hintLineColor") }}</div>
      <div class="content">
        <n-color-picker v-model:value="state.hintLineColor" :render-label="
          () => {
            return '';
          }
        " size="small"></n-color-picker>
      </div>
    </div>

    <!-- 显示可视体 -->
    <div class="row-wrap">
      <div class="label">{{ $t("visibleBody") }}</div>
      <div class="content">
        <div class="check-box-new">
          <n-checkbox v-model:checked="state.visibleBody" :disabled="state.viewshedAnimation"></n-checkbox>
          <n-color-picker v-model:value="state.visibleAreaColor" :render-label="
            () => {
              return '';
            }
          " :disabled="!state.visibleBody" size="small"></n-color-picker>
        </div>
      </div>
    </div>

    <!-- 显示不可视体 -->
    <div class="row-wrap">
      <div class="label">{{ $t("invisibleBody") }}</div>
      <div class="content">
        <div class="check-box-new">
          <n-checkbox v-model:checked="state.invisibleBody" :disabled="state.viewshedAnimation"></n-checkbox>
          <n-color-picker v-model:value="state.hiddenAreaColor" :render-label="
            () => {
              return '';
            }
          " :disabled="!state.invisibleBody" size="small"></n-color-picker>
        </div>
      </div>
    </div>

    <!-- 动态可视域 -->
    <div class="row-wrap">
      <div class="content">
        <n-checkbox v-model:checked="state.viewshedAnimation" :label="$t('viewshedAnimation')" />
      </div>
    </div>

  </n-scrollbar>

  <div class="row-btns">
    <n-button @click="analysis" class="operate" type="info" :focusable="false">{{
    $t("analysis") }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch, computed } from "vue";
import axios from "axios";
import tool from "@/tools/tool";
import DrawHandler from "@/lib/DrawHandler";

const scene = viewer.scene;
const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

type stateType = {
  viewshedSpatialUrl: string; // 空间分析服务url
  observerInformation: number[]; //观察者信息
  direction: number; //方向
  pitch: number; //俯仰角度
  defaultheight: number; //默认高度
  addheight: number; //附加高度
  distance: number; //距离
  verticalFov: number; //  垂直视角
  horizontalFov: number; //水平视角
  hintLineColor: string; //提示线颜色
  visibleColorBarShow: boolean; // 可视体颜色设置条
  invisibleColorBarShow: boolean; // 不可视体颜色设置条
  visibleAreaColor: string; //可视区域颜色
  hiddenAreaColor: string; //不可视区域颜色
  visibleBody: boolean; //显示可视域体
  invisibleBody: boolean; //显示不可视域体
  viewshedAnimation: boolean; //动画演示
  DynamicLine: any[]; //路线点
  DynamicSpeed: number; //动态分析行进速度
};

// 设置默认值数据
let state = reactive<stateType>({
  viewshedSpatialUrl:
    "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/viewshedbody.json",
  observerInformation: [0, 0, 0],
  direction: 0.0,
  pitch: 0.0,
  defaultheight: 1.8,
  addheight: 1.8,
  distance: 200,
  verticalFov: 60,
  horizontalFov: 90,
  hintLineColor: "rgb(212,202,45)",
  visibleColorBarShow: false,
  invisibleColorBarShow: false,
  visibleAreaColor: "rgba(9,199,112,0.4)",
  hiddenAreaColor: "rgba(238,114,22,0.4)",
  visibleBody: false,
  invisibleBody: false,
  viewshedAnimation: false,
  DynamicLine: [],
  DynamicSpeed: 10,
});

// 初始化变量
let startPosition: any, timers: any, observerEntity: any;
let Carurls = ["./Resource/model/car1.s3m"];
let viewshed3D = new SuperMap3D.ViewShed3D(scene);
let s3mInstanceColc = new SuperMap3D.S3MInstanceCollection(scene._context);
let dynamicLayer3D = new SuperMap3D.DynamicLayer3D(scene.context, Carurls);

function init() {
  if (!viewer) return;
  viewshed3D.hintLineColor = SuperMap3D.Color.fromCssColorString(
    state.hintLineColor
  );
  viewshed3D.visibleAreaColor = SuperMap3D.Color.fromCssColorString(
    state.visibleAreaColor
  );
  viewshed3D.hiddenAreaColor = SuperMap3D.Color.fromCssColorString(
    state.hiddenAreaColor
  );
  viewer.scene.primitives.add(s3mInstanceColc);
  dynamicLayer3D.updateInterval = 100;
  dynamicLayer3D.setCullEnabled(Carurls[0], SuperMap3D.CullFace.BACK);
  dynamicLayer3D.maxVisibleAltitude = 2000;
  dynamicLayer3D.minVisibleAltitude = 0;
  scene.primitives.add(dynamicLayer3D);
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
  // viewshed3D.destroy();
  viewshed3D = undefined;
  s3mInstanceColc = undefined;
});

let longitude = computed(() => {
  return Number(state.observerInformation[0]).toFixed(4);
});
let latitude = computed(() => {
  return Number(state.observerInformation[1]).toFixed(4);
});
let altitude = computed(() => {
  return Number(state.observerInformation[2]).toFixed(2);
});

// 分析
function analysis() {
  clearViewshed();
  if (state.viewshedAnimation) {
    if (timers) {
      clear();
      state.viewshedAnimation = true;
      tool.setMouseCursor("drawCur");
    }
    drawPolyline();
    return;
  }

  tool.setMouseCursor("measureCur");

  //鼠标左键事件监听
  viewer.eventManager.addEventListener("CLICK", LEFT_CLICK, true);
}

// 点击左键确认观察者点
function LEFT_CLICK(e: any) {
  //获取点击位置笛卡尔坐标
  let position = scene.pickPosition(e.message.position);
  startPosition = position; //记录分析观察者笛卡尔坐标
  let p = window.iEarthTool.Cartesian3ToDegreeArray(position); // 将获取的点的位置转化成经纬度
  p[2] += state.addheight as number; //添加附加高度
  viewshed3D.viewPosition = p;
  viewshed3D.build();
  // 观察者信息记录
  state.observerInformation = p;
  // 添加观察者点
  let p2 = SuperMap3D.Cartesian3.fromDegrees(p[0], p[1], p[2]);
  addPoint(p2);

  viewshed3D.visibleAreaColor = colorUpdate(state.visibleAreaColor);
  viewshed3D.hiddenAreaColor = colorUpdate(state.hiddenAreaColor);

  tool.setMouseCursor("normal");

  viewer.eventManager.removeEventListener("CLICK", LEFT_CLICK);
  viewer.eventManager.addEventListener("MOUSE_MOVE", MOUSE_MOVE, true);
  viewer.eventManager.addEventListener("RIGHT_CLICK", RIGHT_CLICK, true);

  observerEntity = viewer.entities.getById("viewshedPoint");
}

// 添加可视域点
function addPoint(p: any) {
  viewer.entities.removeById("viewshedPoint");
  viewer.entities.add(
    new SuperMap3D.Entity({
      id: "viewshedPoint",
      point: new SuperMap3D.PointGraphics({
        color: colorUpdate(state.hiddenAreaColor),
        pixelSize: 8,
      }),
      position: p,
    })
  );
}

// 鼠标移动实时分析
function MOUSE_MOVE(e: any) {
  //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
  let position = e.message.endPosition;
  let endPosition = scene.pickPosition(position);
  //计算该点与视口位置点坐标的距离
  let distance = SuperMap3D.Cartesian3.distance(startPosition, endPosition);
  if (distance > 0) {
    let p2 = window.iEarthTool.Cartesian3ToDegreeArray(endPosition); // 将获取的点的位置转化成经纬度
    // 通过该点设置可视域分析对象的距离及方向
    viewshed3D.setDistDirByPoint(p2);
  }
}

// 鼠标右键确认分析距离和方向，不再执行鼠标移动事件中对可视域的操作
function RIGHT_CLICK(e: any) {
  state.direction = viewshed3D.direction;
  state.pitch = viewshed3D.pitch;
  state.distance = viewshed3D.distance;
  state.horizontalFov = viewshed3D.horizontalFov;
  state.verticalFov = viewshed3D.verticalFov;
  if (state.visibleBody) {
    getVisibleResult();
  }
  if (state.invisibleBody) {
    getInVisibleResult();
  }
  viewer.eventManager.removeEventListener("MOUSE_MOVE", MOUSE_MOVE);
  viewer.eventManager.removeEventListener("RIGHT_CLICK", RIGHT_CLICK);
}

// 可视域体走数据服务
function getVisibleResult() {
  let color = SuperMap3D.Color.fromCssColorString(state.visibleAreaColor);
  requestModel("VISIBLEBODY", color);
}

// 获取不可视结果
function getInVisibleResult() {
  let color = SuperMap3D.Color.fromCssColorString(state.hiddenAreaColor);
  requestModel("HIDDENBODY", color);
}

// 请求分析结果模型
function requestModel(viewShedType: any, color: any) {
  let obj = viewshed3D.getViewshedParameter();
  let geometryViewShedBodyvisibleParameter = {
    viewerPoint: obj.viewPosition,
    point3DsList: obj.point3DList,
    radius: obj.distance,
    lonlat: true,
    viewShedType: viewShedType,
  };
  let queryData = JSON.stringify(geometryViewShedBodyvisibleParameter);
  //先发送POST请求
  axios
    .post(state.viewshedSpatialUrl, queryData)
    .then(function (response) {
      //再发送一次GET请求  获取到运算结果
      axios
        .get(response.data.newResourceLocation + ".json")
        .then(function (response) {
          let data = response.data;
          if (data.geometry == null) return window["$message"].error("get geometry fail");
          //将二进制流构建arrayBuffer 添加至S3MInstanceCollection
          let u8 = new Uint8Array(data.geometry.model);
          let ab = u8.buffer;
          //注意  若添加多个模型 请保证各个名称唯一  否则可能引起显示错乱问题
          s3mInstanceColc.add(
            viewShedType,
            {
              id: 1,
              position: SuperMap3D.Cartesian3.fromDegrees(
                data.geometry.position.x,
                data.geometry.position.y,
                data.geometry.position.z
              ),
              hpr: new SuperMap3D.HeadingPitchRoll(0, 0, 0),
              color: color,
            },
            ab,
            false
          );
          data.geometry.model = [4, 0, 0, 0].concat(data.geometry.model);
          // 分析区域颜色和可视域体颜色会影响，所以先透明
          viewshed3D.visibleAreaColor =
            SuperMap3D.Color.fromCssColorString("rgba(0,0,0,0)");
          viewshed3D.hiddenAreaColor =
            SuperMap3D.Color.fromCssColorString("rgba(0,0,0,0)");
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 清除
function clear() {
  drawHandler.destroy();
  clearViewshed();
  dynamicLayer3D.clearState(Carurls[0], [1]);
  clearInterval(timers);
  timers = null;
  state.viewshedAnimation = false;
  state.observerInformation = [0, 0, 0];
}

// 清除可视域
function clearViewshed() {
  s3mInstanceColc.removeCollection("VISIBLEBODY");
  s3mInstanceColc.removeCollection("HIDDENBODY");
  viewer.entities.removeById("viewshedPoint");
  tool.setMouseCursor("normal");
  viewshed3D.distance = 0.00001;
  viewshed3D.viewPosition = [0, 0, 0];
  state.observerInformation = [0, 0, 0];
}

/*
  动态可视域模块
  */
//绘制路线
async function drawPolyline() {
  const positions = await drawHandler.startPolyline();
  state.DynamicLine = positions;
  if (state.DynamicLine.length < 2) return;
  setCarState();
}

// 添加动态可视域动画模型
let points2: any[] = [];
let positions: any[] = [];
function setCarState() {
  viewshed3D.distance = state.distance;
  viewshed3D.build();
  let points = state.DynamicLine;
  for (let i = 1, j = points.length; i < j; i++) {
    let startPoint = points[i - 1];
    let endPoint = points[i];
    let d: number = SuperMap3D.Cartesian3.distance(startPoint, endPoint);
    let count = Math.floor(d / (state.DynamicSpeed * 0.05)) + 1;
    for (let i = 1, j = count; i <= j; i++) {
      points2.push(
        SuperMap3D.Cartesian3.lerp(
          startPoint,
          endPoint,
          i / count,
          new SuperMap3D.Cartesian3()
        )
      );
    }
  }
  positions = window.iEarthTool.Cartesian3ToDegreeObjs(points2);
  let CarState = new SuperMap3D.DynamicObjectState({
    id: 1,
    longitude: positions[0].longitude,
    latitude: positions[0].latitude,
    altitude: positions[0].height,
    scale: new SuperMap3D.Cartesian3(1, 1, 1),
  });
  dynamicLayer3D.updateObjectWithModel(Carurls[0], [CarState]);
  let index = 1;
  timers = setInterval(() => {
    if (index >= positions.length) {
      clearInterval(timers);
      return;
    }
    CarState.longitude = positions[index].longitude;
    CarState.latitude = positions[index].latitude;
    CarState.altitude = positions[index].height;
    dynamicLayer3D.updateObjectWithModel(Carurls[0], [CarState]);
    let angleAndRadian = getAngleAndRadian(
      points2[index - 1],
      points2[index]
    );
    viewshed3D.direction = angleAndRadian.angle;
    viewshed3D.viewPosition = [
      CarState.longitude,
      CarState.latitude,
      CarState.altitude + Number(state.addheight),
    ];
    index += 1;
  }, 50);
}

// 获取两点的角度和弧度
function getAngleAndRadian(pointA: any, pointB: any) {
  // 建立以点A为原点，X轴为east,Y轴为north,Z轴朝上的坐标系
  const transform = SuperMap3D.Transforms.eastNorthUpToFixedFrame(pointA);
  // 向量AB
  const positionvector = SuperMap3D.Cartesian3.subtract(pointB, pointA, new SuperMap3D.Cartesian3());
  // 因transform是将A为原点的eastNorthUp坐标系中的点转换到世界坐标系的矩阵
  // AB为世界坐标中的向量
  // 因此将AB向量转换为A原点坐标系中的向量，需乘以transform的逆矩阵。
  const vector = SuperMap3D.Matrix4.multiplyByPointAsVector(SuperMap3D.Matrix4.inverse(transform, new SuperMap3D.Matrix4()), positionvector, new SuperMap3D.Cartesian3());
  //归一化
  const direction = SuperMap3D.Cartesian3.normalize(vector, new SuperMap3D.Cartesian3());
  // heading
  const heading1 = Math.atan2(direction.y, direction.x) - SuperMap3D.Math.PI_OVER_TWO;

  let radian = SuperMap3D.Math.TWO_PI - SuperMap3D.Math.zeroToTwoPi(heading1);
  var angle = radian * (180 / Math.PI);
  if (angle < 0) {
    angle = angle + 360;
  }
  return { angle, radian };
}

// 通过传入的color，返回SuperMap3D的
function colorUpdate(val: any) {
  if (val == "") return;
  return SuperMap3D.Color.fromCssColorString(val);
}

// 监听
watch(
  () => state.visibleBody,
  (val) => {
    if (val && state.observerInformation) {
      getVisibleResult();
    } else {
      s3mInstanceColc.removeCollection("VISIBLEBODY");
      if (!state.invisibleBody) {
        viewshed3D.visibleAreaColor = SuperMap3D.Color.fromCssColorString(
          state.visibleAreaColor
        );
        viewshed3D.hiddenAreaColor = SuperMap3D.Color.fromCssColorString(
          state.hiddenAreaColor
        );
      }
    }
  }
);
watch(
  () => state.invisibleBody,
  (val: any) => {
    if (val && state.observerInformation) {
      getInVisibleResult();
    } else {
      s3mInstanceColc.removeCollection("HIDDENBODY");
      if (!state.visibleBody) {
        viewshed3D.visibleAreaColor = SuperMap3D.Color.fromCssColorString(
          state.visibleAreaColor
        );
        viewshed3D.hiddenAreaColor = SuperMap3D.Color.fromCssColorString(
          state.hiddenAreaColor
        );
      }
    }
  }
);
watch(
  () => state.addheight,
  (val: any) => {
    if (val === "" || val < 0) {
      // 避免删除导致崩溃
      val = 0;
    }
    if (state.observerInformation) {
      state.observerInformation[2] = parseFloat(val) + state.defaultheight;
      viewshed3D.viewPosition = state.observerInformation;
    }

    if (observerEntity) {
      let lon = Number(state.observerInformation[0]);
      let lat = Number(state.observerInformation[1]);
      let hei = Number(state.observerInformation[2]);
      let position = SuperMap3D.Cartesian3.fromDegrees(lon, lat, hei);
      observerEntity.position = position;
      // observerEntity.primitive.updatePosition(position);
    } else {
      observerEntity = viewer.entities.getById("viewshedPoint");
    }
  }
);
watch(
  () => state.pitch,
  (val: any) => {
    viewshed3D.pitch = parseFloat(val);
  }
);
watch(
  () => state.direction,
  (val: any) => {
    if (val === "" || val < 0) {
      // 避免删除导致崩溃
      val = 0;
    }
    viewshed3D.direction = parseFloat(val);
  }
);
watch(
  () => state.distance,
  (val: any) => {
    if (val === "" || val < 0) {
      // 避免删除导致崩溃
      val = 0;
    }
    viewshed3D.distance = parseFloat(val);
  }
);
watch(
  () => state.verticalFov,
  (val: any) => {
    if (parseFloat(val) > 0) {
      viewshed3D.verticalFov = parseFloat(val);
    } else {
      state.verticalFov = 1;
    }
  }
);
watch(
  () => state.horizontalFov,
  (val: any) => {
    if (parseFloat(val) > 0) {
      viewshed3D.horizontalFov = parseFloat(val);
    } else {
      state.horizontalFov = 1;
    }
  }
);
watch(
  () => state.hintLineColor,
  (val: any) => {
    viewshed3D.hintLineColor = colorUpdate(val);
  }
);
watch(
  () => state.visibleAreaColor,
  (val: any) => {
    viewshed3D.visibleAreaColor = colorUpdate(val);
    if (state.visibleBody)
      s3mInstanceColc
        .getInstance("VISIBLEBODY", 1)
        .updateColor(colorUpdate(val));
  }
);
watch(
  () => state.viewshedAnimation,
  (val: any) => {
    if (val) {
      state.visibleBody = false;
      state.invisibleBody = false;
    }
  }
);
watch(
  () => state.hiddenAreaColor,
  (val: any) => {
    viewshed3D.hiddenAreaColor = colorUpdate(val);
    if (state.invisibleBody)
      s3mInstanceColc
        .getInstance("HIDDENBODY", 1)
        .updateColor(colorUpdate(val));
  }
);

watch(
  () => state.viewshedAnimation,
  (val: any) => {
    if (val) {
      state.visibleBody = false;
      state.invisibleBody = false;
      clearViewshed();
      window["$notification"].create({
        content: () => $t("viewshedAnimationTip"),
        duration: 3500,
      });
    } else clear();
  }
);
</script>