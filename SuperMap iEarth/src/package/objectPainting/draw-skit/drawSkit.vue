<template>
  <!-- 小品 -->
  <div id="add-skit-container">
    <n-scrollbar style="max-height: 4.8rem;padding-right: 0.1rem;" trigger="none">
      <!-- 符号类型 -->
      <div class="row-item">
        <span>{{ $t("symbolType") }}</span>
        <n-select style="width: 2.2rem" v-model:value="state.selectedTypeId" :options="state.symbolClassOptions" />
      </div>

      <!-- 符号库 -->
      <div class="row-item no-center">
        <span class="name">{{ $t("symbolLibrary") }}</span>
        <div class="icon-list-space" style="width: 2.2rem">
          <n-scrollbar style="max-height: 1.6rem">
            <div style="display: flex;flex-wrap: wrap;">
              <div v-for="(model, index) in state.symbolOptionsList.data"
                :class="model.isSelect ? 'selected-img' : 'normal-img'"
                style="width: 0.4rem; height: 0.4rem; margin: 0.04rem 0.04rem">
                <img :key="index" :src="model.thumbnail" :title="model.name" v-show="model.name" class="draw-img"
                  @click="changleIconItem(model)" @dblclick="cancleIconItem(model)" />
              </div>
            </div>
          </n-scrollbar>
        </div>
      </div>

      <!-- 添加模式 -->
      <div class="row-item">
        <span>{{ $t("addMode") }}</span>
        <n-select v-model:value="state.addType" :options="state.addWayOptions" style="width: 2.2rem" />
      </div>
      <div class="row-item" v-if="state.addType === 'face'">
        <span></span>
        <n-checkbox v-model:checked="state.multiSelection" style="margin-bottom: 0.1rem;margin-right: 1.26rem;" :focusable="false">
          {{ $t("multiSelection") }}
        </n-checkbox>
      </div>


      <!-- 线：间隔 -->
      <div class="row-item" v-if="state.addType === 'line'">
        <span>{{ $t("spacing") }}</span>
        <n-input-number v-model:value="state.space" style="width: 2.2rem" :min="1" :max="1000"></n-input-number>
      </div>

      <!-- 面：密度 -->
      <div class="row-item" v-if="state.addType === 'face'">
        <span>{{ $t("density") }}</span>
        <n-input-number v-model:value="state.density" style="width: 2.2rem" :min="0" :max="1"
          :step="0.01"></n-input-number>
      </div>

      <!-- 随机大小 -->
      <div class="row-item" style="margin-right: 0.1rem">
        <span>{{ $t('randomScale') }}</span>
        <div class="check-color-pick">
          <n-checkbox v-model:checked="state.isRandomScale" :focusable="false"
            style="margin-left: -0.12rem;margin-right: 0.1rem;"></n-checkbox>
          <div class="slider-box">
            <span>{{ state.scaleRange[0] }}</span>
            <n-slider style="width: 1.5rem" v-model:value="state.scaleRange" :step="0.1" range :min="0.1" :max="5.0"
              :disabled="!state.isRandomScale" />
            <span>{{ state.scaleRange[1] }}</span>
          </div>
        </div>
      </div>

      <!-- 随机角度 -->
      <div class="row-item" style="margin-right: 0.1rem">
        <span>{{ $t('randomRotate') }}</span>
        <div class="check-color-pick">
          <n-checkbox v-model:checked="state.isRandomRotate" :focusable="false"
            style="margin-left: -0.12rem;margin-right: 0.1rem;"></n-checkbox>
          <div class="slider-box">
            <span>{{ state.rotateRange[0] }}</span>
            <n-slider style="width: 1.5rem" v-model:value="state.rotateRange" :step="1" range :min="1" :max="360"
              :disabled="!state.isRandomRotate" />
            <span>{{ state.rotateRange[1] }}</span>
          </div>
        </div>
      </div>

      <!-- 符号编辑 -->
      <div class="row-item">
        <span>{{$t('symbolEdit')}}</span>
        <n-checkbox v-model:checked="state.openDrag" style="margin-bottom: 0.1rem" :focusable="false">
          {{ $t("dragEdit") }}
        </n-checkbox>
        <n-checkbox v-model:checked="state.selectDel" style="margin-bottom: 0.1rem" :focusable="false">
          {{ $t("clickDel") }}
        </n-checkbox>
      </div>

      <!-- 小品列表 -->
      <span style="font-size: 0.14rem;">{{$t('skitList')}}</span>
      <div class="icon-list-space" style="margin-left: 0.86rem; margin-bottom: 0.1rem; margin-top: -0.3rem;">
        <n-scrollbar x-scrollable style="max-height:3.6rem" trigger="none">
          <n-tree 
            block-line 
            :data="treeData" 
            :render-suffix="renderSuffix" 
            :default-expanded-keys="['0','2','3']"
          />
        </n-scrollbar>
      </div>

      <!-- 绘制和关闭 -->
      <div class="btn-row-item" style="margin-left: 0.86rem;">
        <n-button type="info" color="#3499E5" text-color="#fff" :focusable="false" @click="add"
          style="margin-right: 0.1rem">{{ $t("Draw") }}</n-button>
        <n-button :focusable="false" @click="finishAllDraw">{{ $t("finish") }}</n-button>
      </div>
    </n-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { h,reactive, onMounted, onBeforeUnmount, watch} from "vue";
import { NButton } from "naive-ui";
import { useSkitTreeStore } from "@/store/skitTree/SkitTree";
import AddSymbol from "@/lib/AddSymbol";
import MouseMove from "@/lib/MouseMove";
import ModelEdit from "@/lib/ModelEdit";
import DragTool from "@/lib/DragTool";
import OpenSkitCollection from "@/lib/OpenSkitCollection";
import SkitCollection from "@/lib/SkitCollection";
import DrawHandler from "@/lib/DrawHandler";
import tool from "@/tools/tool";

const symbolOptions = window.skitConfig;
const SkitTreeStore = useSkitTreeStore();

const defaulModelUrl = "./Resource/skitStore/Trees3mLibrary/001_Platanus.s3mb";

type stateType = {
  selectedTypeId: number; //选中符号类型id
  space: number; //直线种树间距
  density: number; //区域种树密度
  addType: string; // 种树方式
  currentModelUrl: string; // 当前种树模型的url
  symbolClassOptions: any; // 符号类型选项
  addWayOptions: any; // 添加方式选项
  symbolOptionsList: any; // 模型资源列表
  multiSelection: boolean; // 支持多选
  currentModelUrlArray: any; // 多选是选择的模型路径数组
  delType: number; // 删除方式
  scaleNumber:number; // 缩放倍数
  rotateNumber:number; // 旋转角度
  openDrag:boolean; // 是否开启拖拽
  selectDel:boolean; // 是否开启选中删除
  isRandomScale:boolean; // 是否开启随机大小
  scaleRange:any; // 随机大小范围
  isRandomRotate:boolean; // 是否开启随机旋转
  rotateRange:any; // 随机旋转范围
};

// 初始化变量
let state = reactive<stateType>({
  selectedTypeId: 0, 
  space: 10, 
  density: 0.1, 
  addType: "single",
  currentModelUrl: defaulModelUrl,
  currentModelUrlArray: [defaulModelUrl],
  symbolClassOptions: [
    {
      label: () => $t("tree"),
      value: 0,
    },
  ],
  addWayOptions: [],
  symbolOptionsList: symbolOptions[0],
  multiSelection: false,
  delType: 1,
  scaleNumber:1,
  rotateNumber:1,
  openDrag:false,
  selectDel:false,
  isRandomScale:false,
  scaleRange:[1.0, 4.0], 
  isRandomRotate:false, 
  rotateRange:[50, 300], 
});

// 树木添加方式选项
const treeOperation = [
  {
    label: () => $t("singleAdd"),
    value: "single",
  },
  {
    label: () => $t("lineAdd"),
    value: "line",
  },
  {
    label: () => $t("AreaAdd"),
    value: "face",
  },
];

// 公共设施添加方式选项
const publicOperation = [
  {
    label: () => $t("singleAdd"),
    value: "single",
  },
  {
    label: () => $t("lineAdd"),
    value: "line",
  },
];

let treeData = SkitTreeStore.InstanceCollection;

let instanceCollection_tree:any = undefined;
let selectInstance:any = undefined; // 当前选中的实例

// 绘制类
const drawHandler = new DrawHandler(viewer,{
  openMouseTip:true,
  useDefaultTip:false,
  tipContent: {
    pointMoving: $t('pointMovingTip'),
    polylineMoving: $t('polylineMovingTip'),
    polylineFinish: $t('polylineFinishTip'),
    polygonMoving: $t('polygonMovingTip'),
    polygonFinish: $t('polygonFinishTip'),
  }
});
// 添加类
const addSymbol = new AddSymbol(viewer, {});
// treeData管理操作类
const skitCollection = new SkitCollection(viewer,{
  Data:treeData
})

// 拖拽类：实体ID中必须包含'addSymbol'
const dragtool = new DragTool(viewer,{
  dragFlagInID: 'addSymbol',
  glueS3M: true, // 贴到S3M模型上
  callback:skitCollection.updateInstanceOptionInTreeData
});

// 模型编辑器
const modelEdit = new ModelEdit(viewer,{
  callback:skitCollection.updateInstanceOptionInTreeData
})

// 鼠标提示类
const mouseMove = new MouseMove(viewer, {
  body: document.body,
  disableDomClassName: 'right-panel'
});
mouseMove.openTip(); // 开启鼠标提示（当前暂无内容，所以不显示）

// 面板Dom：移动到上面时关闭弹窗
let panelContainer; 
const panelContainerMouseMoveFunc = function(){ mouseMove.closeTip();}
const handlerClick = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);

onMounted(() => {
  state.addWayOptions = treeOperation;
  state.symbolOptionsList.data[0].isSelect = true;

  panelContainer = document.getElementById('add-skit-container'); // 当移动到面板位置的时候，关闭提示
  if (panelContainer) panelContainer.addEventListener('mousemove', panelContainerMouseMoveFunc);

  viewer.scene.primitives._primitives.forEach(primitive=>{
    if(primitive.customID && primitive.customID == "plantTree"){
      instanceCollection_tree = primitive;
    }
  })

  handlerClick.setInputAction(click_symbol, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK)
});

onBeforeUnmount(() => {
  if(panelContainer) panelContainer.removeEventListener('mousemove', panelContainerMouseMoveFunc);
  handlerClick.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);

  // 符号库
  let symbolList = state.symbolOptionsList.data;
  for (let i = 0; i < symbolList.length; i++) {
    symbolList[i].isSelect = false;
  }

  finishAllDraw();
  dragtool.destroy();
  mouseMove.destroy();
  modelEdit.close();
  drawHandler.destroy();
});


// 图层列表添加删除后缀
function renderSuffix({ option }) {
  if(option.key && option.key.length >= 5){ // 单个项目
    return h("div", {}, [
      h(
        NButton,
        {
          bordered: false,
          text: true,
          focusable: false,
          title: $t('rapidLocate'),
          onClick: () => {
            console.log("option:",option)
            skitCollection.instenceLocate(option);
          },
        },
        {
          icon: () => h("i", { class: "iconfont icondingwei", style: "color: rgba(255,255,255,0.65)" }, "")
        }
      ),
      h(
        NButton,
        {
          bordered: false,
          text: true,
          focusable: false,
          title: $t('remove'),
          onClick: () => {
            skitCollection.removeTreeOptionBatch(option, instanceCollection_tree);
          },
        },
        {
          icon: () => h("i", { class: "iconfont iconshanchu", style: "color: #DC5849" }, "")
        }
      )
    ]);
  } else if (option.key && option.children.length > 0 && option.key != '0') { // 集合
    return h("div", {}, [
      h(
        NButton,
        {
          bordered: false,
          text: true,
          focusable: false,
          title: $t('remove'),
          onClick: () => {
            skitCollection.removeTreeOptionBatch(option, instanceCollection_tree);
          },
        },
        {
          icon: () => h("i", { class: "iconfont iconshanchu", style: "color: #DC5849" }, "")
        }
      )
    ]);
  }else if(option.key && option.key == '0'){ // 根目录
    return h("div", {}, [
      h(
        NButton,
        {
          bordered: false,
          text: true,
          focusable: false,
          title: $t('remoteALLSkit'),
          onClick: () => {
            clearAllTree();
          },
        },
        {
          icon: () => h("i", { class: "iconfont iconshanchu", style: "color: #DC5849" }, "")
        }
      ),
      h(
        NButton,
        {
          bordered: false,
          text: true,
          focusable: false,
          title: $t('importSkit'),
          onClick: () => {
            openLocalTree();
          },
        },
        {
          icon: () => h("i", { class: "iconfont icondaoru",  }, "")
        }
      ),
      h(
        NButton,
        {
          bordered: false,
          text: true,
          focusable: false,
          title: $t('downLoadSkit'),
          onClick: () => {
            downLoadTree();
          },
        },
        {
          icon: () => h("i", { class: "iconfont icondaochu",  }, "")
        }
      )
    ]
  );
  }
}


// 选择符号库
function changleIconItem(item: any) {
  if (state.multiSelection) {
    for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
      if (state.symbolOptionsList.data[i].id == item.id) {
        state.symbolOptionsList.data[i].isSelect = true;
      }
    }
    let itemIndex = state.currentModelUrlArray.indexOf(item.path);
    if (itemIndex == -1) state.currentModelUrlArray.push(item.path);
  } else {
    for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
      if (state.symbolOptionsList.data[i].id == item.id) {
        state.symbolOptionsList.data[i].isSelect = true;
      } else {
        state.symbolOptionsList.data[i].isSelect = false;
      }
    }
    state.currentModelUrl = item.path;
    state.currentModelUrlArray = [item.path];
  }
}

// 取消所选符号
function cancleIconItem(item: any) {
  if (state.multiSelection) {
    for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
      if (state.symbolOptionsList.data[i].id == item.id) {
        state.symbolOptionsList.data[i].isSelect = false;
        let pathIndex = state.currentModelUrlArray.indexOf(item.path);
        state.currentModelUrlArray.splice(pathIndex, 1);
      }
    }
  } else {
    for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
      if (state.symbolOptionsList.data[i].id == item.id) {
        state.symbolOptionsList.data[i].isSelect = false;
        state.currentModelUrl = "";
        state.currentModelUrlArray = [];
      }
    }
  }
}



// 将添加的树小品保存为本地json文件
function downLoadTree(){
  let treeJsonData = SkitTreeStore.createSkitCollectionOptions();

  treeJsonData = skitCollection.hprAndScaleToModelMatrix(treeJsonData);
  console.log("保存的小品列表:",treeJsonData);

  window.iEarthTool.saveObjToJsonFile(JSON.stringify(treeJsonData, null, '\t'), '全部小品'); // 保存为json存到本地
  setTimeout(() => {
    window["$message"].success($t('skitSaveSuccess'));
  }, 1000);
}

// 打开本地JSON文件
function openLocalTree() {
  const promise = tool.openLocalFile();
  const openSkitCollection = new OpenSkitCollection(viewer);
  
  promise.then((jsonData:any) => {
    if (!jsonData) return;
    console.log("本地小品集合:", jsonData);

    clearAllTree(); // 清除上一次的树

    if (jsonData.Camera) window.iEarthTool.openCamera(jsonData.Camera); // 设置相机位置
    if(jsonData.SkitInstanceCollection){ // 支持之前版本保存json
      jsonData = jsonData.SkitInstanceCollection.TreeGroup[0];
    }
    if (jsonData.children) {
      const promise = openSkitCollection.addSkitInstanceCollection(jsonData);
      promise.then((treeDataHandled:any)=>{
        SkitTreeStore.InstanceCollection[0] = treeDataHandled; // 传入Store
        treeData = SkitTreeStore.InstanceCollection;
        skitCollection.init({Data:treeData}); // 更新类中的TreeData
      })
    }
  }, error => {
    console.log('open file failed:', error);
  })
}


// 左键控制选中或者添加d
function click_symbol(e) {

  // 绘制模式下关闭点选
  if(drawHandler.getIsDrawing()) return;  

  // 拾取到选中的实体
  let symbol = viewer.scene.pick(e.position) || viewer.selectedEntity;
  if (symbol && symbol.primitive && symbol.id && typeof symbol.id == 'string' && symbol.id.includes('addSymbol')) { // instanceID中含有addSymbol才是我们的种的树
    selectInstance = symbol.primitive;
  } else {
    selectInstance = undefined;
    modelEdit.close();
    return;
  }

  if (state.openDrag || state.selectDel) { // 编辑模式下禁止开启模型编辑器：拖拽+点选
    modelEdit.close();
  }else {
    modelEdit.open(selectInstance, treeData);
  }

  // 点选删除
  if(state.selectDel){
    clearSelectTree();
  }
}


// 结束当前所有绘制
function finishAllDraw(){
  drawHandler.clear();
  mouseMove.closeTip();
  tool.setMouseCursor('normal');
}


// 添加
function add() {
  state.openDrag = false; // 添加时，关闭拖拽
  state.selectDel = false; // 添加时，关闭点选删除
  modelEdit.close();
  if(!instanceCollection_tree) return;
  if (state.currentModelUrl == "" || state.currentModelUrlArray.length == 0) {
    window["$message"].warning($t("addSkitTip"));
    return;
  }
  
  switch (state.addType) {
    case "single":
      add_single();
      break;
    case "line":
      add_line();
      break;
    case "face":
      add_face();
      break;
    default:
      add_single();
      break;
  }
}

// 单个添加
async function add_single() {
  const position = await drawHandler.startPoint();
  if(!position || !(position instanceof SuperMap3D.Cartesian3)) return;
  let path = state.currentModelUrl;
  let currentIndex = skitCollection.computedCurrentIndex('point');
  let pointID = `point-${currentIndex}-addSymbol`;
  let point_option = addSymbol.addByPoint(path, position, pointID);
  skitCollection.addItemToTree(point_option, 'point');

  // 不用担心递归死循环，因为点击右键时在drawHandler已结束此次绘制，startPoint()不返回，下来的代码都不走了，递归也从这一次结束
  if(drawHandler.handlerPoint) add_single(); // 连续添加
}

// 沿线添加
async function add_line() {
  const positions = await drawHandler.startPolyline();
  if(!positions || !(positions instanceof Array)) return;
  const path = state.currentModelUrl;
  let currentIndex = skitCollection.computedCurrentIndex('polylineGroup');
  const line_options = await addSymbol.addByline(path, positions, state.space, currentIndex);
  skitCollection.addItemToTree(line_options, 'polylineGroup');

  if(drawHandler.handlePolyline) add_line(); // 连续添加
}

// 区域添加
async function add_face() {
  const positions = await drawHandler.startPolygon();
  if(!positions || !(positions instanceof Array)) return;
  let path = state.currentModelUrlArray;
  let area = getArea(positions);
  let count = Math.floor(area) * Number(state.density);
  let currentIndex = skitCollection.computedCurrentIndex('polygonGroup');
  let polygon_options = addSymbol.addByFace(path, positions, Math.floor(count), currentIndex);
  skitCollection.addItemToTree(polygon_options, 'polygonGroup');

  if(drawHandler.handlePolygon) add_face(); // 连续添加
}

// 根据传入的点计算多边形面积：[Cartesian3]
function getArea(points) {
  let res: any = 0;
  //拆分三角曲面

  for (let i = 0; i < points.length - 2; i++) {
    let j = (i + 1) % points.length;
    let k = (i + 2) % points.length;
    let totalAngle = Angle(points[i], points[j], points[k]);

    let dis_temp1 = distance(points[j], points[0]);
    let dis_temp2 = distance(points[k], points[0]);
    res += dis_temp1 * dis_temp2 * Math.sin(totalAngle) / 2;
  }

  res = Math.abs(res).toFixed(4);
  return res;

  // 方向
  function Bearing(from, to) {
    from = SuperMap3D.Cartographic.fromCartesian(from);
    to = SuperMap3D.Cartographic.fromCartesian(to);

    let lat1 = from.latitude;
    let lon1 = from.longitude;
    let lat2 = to.latitude;
    let lon2 = to.longitude;
    let angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
    if (angle < 0) {
      angle += Math.PI * 2.0;
    }
    let degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度

    angle = angle * degreesPerRadian; //角度
    return angle;
  }

  // 角度
  function Angle(p1, p2, p3) {
    let bearing21 = Bearing(p2, p1);
    let bearing23 = Bearing(p2, p3);
    let angle = bearing21 - bearing23;
    if (angle < 0) {
      angle += 360;
    }
    return angle;
  }

  // 距离
  function distance(point1, point2) {
    let point1cartographic = SuperMap3D.Cartographic.fromCartesian(point1);
    let point2cartographic = SuperMap3D.Cartographic.fromCartesian(point2);
    /**根据经纬度计算出距离**/
    let geodesic = new SuperMap3D.EllipsoidGeodesic();
    geodesic.setEndPoints(point1cartographic, point2cartographic);
    let s = geodesic.surfaceDistance;
    //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
    //返回两点之间的距离
    s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
    return s;
  }

};

// 清除所有
function clearAllTree() {
  finishAllDraw();
  
  addSymbol.destroy(); // 需要调用他的destroy方法，主要是重置this.instanceCollection = null；避免该对象销毁后仍然调用
  dragtool.cancelDrag();
  modelEdit.close();

  selectInstance = undefined;

  state.isRandomScale = false;
  state.isRandomRotate = false;
  state.openDrag = false;
  state.selectDel = false;

  // 清空图层列表
  treeData[0].children[0].children = [];
  treeData[0].children[1].children = [];
  treeData[0].children[2].children = [];

  // 当点击全部删除时，删除InstanceCollection
  if(instanceCollection_tree) viewer.scene.primitives.remove(instanceCollection_tree);
  instanceCollection_tree = null;
  instanceCollection_tree = new SuperMap3D.S3MInstanceCollection(viewer.scene._context);
  instanceCollection_tree.selectedColor = SuperMap3D.Color.GOLD; // 没效果
  instanceCollection_tree.customID = 'plantTree';
  viewer.scene.primitives.add(instanceCollection_tree);
}

// 清除选中的
function clearSelectTree() {
  if (selectInstance && instanceCollection_tree) {
    // 删除图层列表中的树
    let targetOption = skitCollection.removeInstanceOptionInTreeData(selectInstance);
    if(!targetOption || !targetOption.url) return;
    let instanceUrl = targetOption.url;

    // 删除场景中的树
    instanceCollection_tree.removeInstance(instanceUrl, [selectInstance.id]);
  }
}


watch(
  () => state.addType,
  () => {
    finishAllDraw();
    state.multiSelection = false;
  }
);
watch(
  () => state.selectedTypeId,
  (val) => {
    switch (val) {
      case 0:
        state.symbolOptionsList = symbolOptions[0];
        state.addWayOptions = treeOperation;
        break;
      case 1:
        state.symbolOptionsList = symbolOptions[1];
        state.addWayOptions = publicOperation;
        state.addType = "single";
        break;
      case 2:
        state.symbolOptionsList = symbolOptions[2];
        state.addWayOptions = publicOperation;
        state.addType = "single";
        break;
      default:
        break;
    }
  }
);
watch(
  () => state.multiSelection,
  (val) => {
    if (!val) {
      for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
        state.symbolOptionsList.data[i].isSelect = false;
      }
      state.currentModelUrlArray = [defaulModelUrl];
      state.symbolOptionsList.data[0].isSelect = true;
    }
  }
);

watch(
  () => state.openDrag,
  (val) => {
    if (val) {
      finishAllDraw();
      state.selectDel = false; //拖拽和点选暂不同时开启
      modelEdit.close();
      dragtool.startDrag(treeData); 
      window["$message"].success($t('openDragTip'));
      mouseMove.setText($t('dragTip'));
    }else{
      dragtool.cancelDrag();
      window["$message"].success($t('closeDragTip'));
      mouseMove.setText('');
    }
  }
);

watch(
  () => state.selectDel,
  (val) => {
    if (val) {
      finishAllDraw();
      state.openDrag = false; //拖拽和点选暂不同时开启
      modelEdit.close();
      window["$message"].success($t('openSelectDelTip'));
      mouseMove.setText($t('clickDelTip'));
    }else{
      window["$message"].success($t('closeSelectDelTip'));
      mouseMove.setText('');
    }
  }
);

watch(
  () => state.isRandomScale,
  (val) => {
    val ? addSymbol.updateScaleRange(state.scaleRange) : addSymbol.updateScaleRange([1,1]); 
  }
);
watch(
  () => state.scaleRange,
  (val) => {
    if (val) addSymbol.updateScaleRange(val);
  }
);

watch(
  () => state.isRandomRotate,
  (val) => {
    val ? addSymbol.updateRotateRange(state.rotateRange) : addSymbol.updateRotateRange([1,1]); 
  }
);
watch(
  () => state.rotateRange,
  (val) => {
    if (val) addSymbol.updateRotateRange(val);
  }
);

</script>

<style lang="scss" scoped>
.icon-list-space {
  display: flex;
  flex-wrap: wrap;
}

.selected-img {
  border: 3px solid #3499e5;
}

.normal-img {
  border: 3px solid rgba(#fff, 0);
}

.draw-img {
  height: 100%;
}

.n-checkbox.n-checkbox--show-label{
  margin-left: -0.27rem;
}

.btn-row-item2{
  margin-right:0.2rem;
}

// 通过深度选择器来进行绑定：n-tree小品后缀按钮
.icon-list-space :deep(.n-tree) .n-tree-node-content .n-tree-node-content__suffix{
  margin-right:0.24rem;
}
.icon-list-space :deep(.n-tree) .n-tree-node-switcher.n-tree-node-switcher--hide{
  width: 0.1rem !important;
}

// 使用:deep强制设置图层列表后缀button颜色
:deep(.n-button) {
  color: rgba(255, 255, 255, 0.65);
}
:deep(.n-button):hover {
  // hover颜色
  color: rgba(255, 255, 255, 0.85);
}
</style>
