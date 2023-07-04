<template>
  <!-- 绘制线 -->

  <div class="row-item">
    <span class="name">符号库</span>
    <div class="icon-list-space" style="width: 1.96rem;">
      <span v-for="(line, index) in state.lines" :key="index" class="icon-span-four" :title="line.name"
        :class="line.isSelect ? 'selected-icon' : ''" @click="changleIconItem(line)">
        <!-- <svg-icon :name="line.iconName" class="icon-size" /> -->
        <i class="iconfont" :class="line.iconName"></i>
      </span>
    </div>
  </div>

  <!-- 圆柱体 -->
  <div v-if="state.selectedId === 0">
    <div class="row-item">
      <span>短半轴</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.semiMinorAxis" :step="20" :min="10" :max="100" />
        <span>{{ state.semiMinorAxis }}</span>
      </div>
    </div>

    <div class="row-item">
      <span>长半轴</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.semiMajorAxis" :step="1" :min="10" :max="200" />
        <span>{{ state.semiMajorAxis }}</span>
      </div>
    </div>

    <div class="row-item">
      <span>拉伸高度</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.extrudedHeight" :step="10" :min="10" :max="100" />
        <span>{{ state.extrudedHeight }}</span>
      </div>
    </div>

    <div class="row-item">
      <span>粒度</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.granularity" :step="0.1" :min="0.5" :max="2" />
        <span>{{ state.granularity }}</span>
      </div>
    </div>
    <div class="row-item">
      <span>旋转</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.rotation" :step="0.1" :min="0" :max="90" />
        <span>{{ state.rotation }}</span>
      </div>
    </div>

    <div class="row-item">
      <span>绘制模式</span>
      <n-select style="width: 1.96rem;height: 32px;" v-model:value="state.displayMode_ellipse" size="small"
        :options="state.optionsMode" />
    </div>
  </div>

  <!-- 长方体 -->
  <div v-if="state.selectedId === 1">
    <div class="row-item">
      <span>长度</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.boxLength" :step="1" :min="10" :max="100" />
        <span>{{ state.boxLength }}</span>
      </div>
    </div>

    <div class="row-item">
      <span>宽度</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.boxWidth" :step="1" :min="10" :max="200" />
        <span>{{ state.boxWidth }}</span>
      </div>
    </div>

    <div class="row-item">
      <span>高度</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.boxHeight" :step="10" :min="10" :max="100" />
        <span>{{ state.boxHeight }}</span>
      </div>
    </div>

    <div class="row-item">
      <span>绘制模式</span>
      <n-select style="width: 1.96rem;height: 32px;" v-model:value="state.displayMode_box" size="small"
        :options="state.optionsMode" />
    </div>
  </div>

  <!-- 球体 -->
  <div v-if="state.selectedId === 2">
    <div class="row-item">
      <span>X半径</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.xRadii" :step="1" :min="10" :max="100" />
        <span>{{ state.xRadii }}</span>
      </div>
    </div>

    <div class="row-item">
      <span>Y半径</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.yRadii" :step="1" :min="10" :max="200" />
        <span>{{ state.yRadii }}</span>
      </div>
    </div>

    <div class="row-item">
      <span>Z半径</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.zRadii" :step="10" :min="10" :max="100" />
        <span>{{ state.zRadii }}</span>
      </div>
    </div>

    <div class="row-item">
      <span>绘制模式</span>
      <n-select style="width: 1.96rem;height: 32px;" v-model:value="state.displayMode_ellipsoid" size="small"
        :options="state.optionsMode" />
    </div>
  </div>

  <!-- 圆锥 -->
  <div v-if="state.selectedId === 3">
    <div class="row-item">
      <span>长度</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.cylinderLength" :step="1" :min="10" :max="100" />
        <span>{{ state.cylinderLength }}</span>
      </div>
    </div>

    <div class="row-item">
      <span>底部高程</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.bottomRadius" :step="1" :min="10" :max="200" />
        <span>{{ state.bottomRadius }}</span>
      </div>
    </div>
    <div class="row-item">
      <span>绘制模式</span>
      <n-select style="width: 1.96rem;height: 32px;" v-model:value="state.displayMode_frustum" size="small"
        :options="state.optionsMode" />
    </div>
  </div>

  <div class="row-item">
    <span>颜色</span>
    <div class="color-pick-box row-content" style="width: 1.96rem;height: 32px;">
      <n-color-picker v-model:value="state.cylinderMaterial" :render-label="() => {
          return '';
        }
        " size="small"></n-color-picker>
    </div>
  </div>



  <div class="btn-row-item">
    <n-button type="info" color="#3499E5" text-color="#fff" @click="add" style="margin-right: 0.1rem">绘制</n-button>
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div>
</template>
  
<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";
import { useNotification } from "naive-ui";
import initHandler from "@/tools/drawHandler";
import setEditHandler from "@/tools/editHandler";
import locale from "@/tools/locateTemp";

const notification = useNotification();

// 初始化数据
let state = reactive({
  optionsMode: [
    {
      label: () => '填充模式',
      value: "Fill",
    },
    {
      label: () => '线框模式',
      value: "Outline",
    }
  ],
  lines: [
    {
      id: 0,
      iconName: "iconshixian",
      name: "实线",
      nameEN: "cylinder",
      isSelect: true,
    },
    {
      id: 1,
      iconName: "iconxuxian",
      name: "虚线",
      nameEN: "cuboid",
      isSelect: false,
    },
    {
      id: 2,
      iconName: "iconlunkuoxian",
      name: "轮廓线",
      nameEN: "sphere",
      isSelect: false,
    },
    {
      id: 3,
      iconName: "iconjiantou",
      name: "箭头线",
      nameEN: "cone",
      isSelect: false,
    }
  ],
  selectedType: "Fill",
  selectedId: 0,

  // 圆柱体
  semiMinorAxis: 10,
  semiMajorAxis: 40,
  extrudedHeight: 50,
  granularity: 1,
  rotation: 0,
  cylinderMaterial: '#ffffff',
  displayMode_ellipse:"Fill",
  // 长方体
  boxLength: 20,
  boxWidth: 20,
  boxHeight: 20,
  displayMode_box:"Fill",
  // 球体
  xRadii: 20,
  yRadii: 20,
  zRadii: 20,
  displayMode_ellipsoid:"Fill",
  // 圆锥
  cylinderLength: 40,
  bottomRadius: 20,
  displayMode_frustum:"Fill",
});

let ellipseEntity, boxEntity, ellipsoidEntity, frustumEntity;
let entities = viewer.entities;

var handlerPoint_ellipse = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Point);
var handlerPoint_box = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Point);
var handlerPoint_ellipsoid = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Point);
var handlerPoint_frustum = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Point);

// 注册绘制圆柱事件
handlerPoint_ellipse.drawEvt.addEventListener(function (res) {
  var point = res.object;
  var position = point.position;
  var color = SuperMap3D.Color.fromRandom({ alpha: 1.0 });
  ellipseEntity = entities.add({
    position: position,
    ellipse: {
      semiMinorAxis: 20.0,
      semiMajorAxis: 40.0,
      height: 0,
      extrudedHeight: 50.0,
      material: color,
      granularity: SuperMap3D.Math.RADIANS_PER_DEGREE,
      rotation: 0,
      fill: true,
      outline: false,
      outlineColor: SuperMap3D.Color.BLACK,
      outlineWidth: 1
    }
  });
  // var colorStr = color.toCssColorString();
  // viewModel.ellipseMaterial = colorStr;

  // hideAll();
});
        //注册绘制长方体事件
        handlerPoint_box.drawEvt.addEventListener(function(res){
            var point = res.object;
            var position = point.position;
            var color = SuperMap3D.Color.fromRandom({alpha : 1.0});
            boxEntity = entities.add({
                position : position,
                box : {
                    dimensions : new SuperMap3D.Cartesian3(20.0, 20.0, 20.0),
                    material : color,
                    fill : true,
                    outline : false,
                    outlineColor : SuperMap3D.Color.BLACK,
                    outlineWidth : 1
                }
            });
            // var colorStr = color.toCssColorString();
            // viewModel.boxMaterial = colorStr;
            // $('#colorPicker_box').css({
            //     color : colorStr
            // });
            // $('#popup').show();
            // hideAll();
            // $('#setbar_box').show();

        });
        // 注册绘制球体事件
        handlerPoint_ellipsoid.drawEvt.addEventListener(function(res){
            var point = res.object;
            var position = point.position;
            var posDeg = SuperMap3D.Cartographic.fromCartesian(position);
            posDeg.height = 20;
            position = SuperMap3D.Cartesian3.fromRadians(posDeg.longitude,posDeg.latitude,posDeg.height);
            var color = SuperMap3D.Color.fromRandom({alpha : 1.0});
            ellipsoidEntity = entities.add({
                position : position,
                ellipsoid : {
                    radii : new SuperMap3D.Cartesian3(20.0, 20.0, 20.0),
                    material : color,
                    fill : true,
                    outline : false,
                    outlineColor : SuperMap3D.Color.BLACK,
                    outlineWidth : 1
                }
            });
            var colorStr = color.toCssColorString();
            // viewModel.ellipsoidMaterial = colorStr;
            // $('#colorPicker_ellipsoid').css({
            //     color : colorStr
            // });
            // $('#popup').show();
            // hideAll();
            // $('#setbar_ellipsoid').show();

        });
        //注册绘制椎体事件
        handlerPoint_frustum.drawEvt.addEventListener(function(res){
            var point = res.object;
            var position = point.position;
            var color = SuperMap3D.Color.fromRandom({alpha : 1.0});
            frustumEntity = entities.add({
                position : position,
                cylinder : {
                    length : 40.0,
                    topRadius : 0.0,
                    bottomRadius : 20.0,
                    material : color,
                    fill : true,
                    outline : false,
                    outlineColor : SuperMap3D.Color.BLACK,
                    outlineWidth : 1
                }
            });
            // var colorStr = color.toCssColorString();
            // viewModel.cylinderMaterial = colorStr;
            // $('#colorPicker_cylinder').css({
            //     color : colorStr
            // });
            // $('#popup').show();
            // hideAll();
            // $('#setbar_cylinder').show();

        });


var targetEntity:any = null;
var handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (e) {
  var pickedObject = viewer.scene.pick(e.position);
  if (SuperMap3D.defined(pickedObject) && (pickedObject.id instanceof SuperMap3D.Entity)) {
    targetEntity = pickedObject.id;
  } else {
    targetEntity = null;
  }
}, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);

function deactiveAll() {
  handlerPoint_ellipse.deactivate();
  handlerPoint_box.deactivate();
  handlerPoint_ellipsoid.deactivate();
  handlerPoint_frustum.deactivate();
}

// 切换项目
function changleIconItem(item: any) {
  state.selectedId = item.id;
  for (let i = 0; i < state.lines.length; i++) {
    if (state.lines[i].id == item.id) {
      state.lines[i].isSelect = true;
    } else {
      state.lines[i].isSelect = false;
    }
  }
}

function add() {
  deactiveAll();

  switch (state.selectedId) {
    case 0:
      handlerPoint_ellipse.activate();
      break;
    case 1:
      handlerPoint_box.activate();
      break;
    case 2:
      handlerPoint_ellipsoid.activate();
      break;
    case 3:
      handlerPoint_frustum.activate();
      break;
    default:
      break;
  }

}
function clear() {
  deactiveAll();
  viewer.entities.removeAll();
}
// watch(
//   () => state.selectedType,
//   (val) => {
//     switch (val) {
//       case "NONE":
//         // setLineMode(undefined, undefined);
//         break;
//       default:
//         break;
//     }
//   }
// );

watch(
  () => state.semiMinorAxis,
  (val) => {
    // console.log("ellipseEntity:", ellipseEntity);
    // ellipseEntity.ellipse.semiMinorAxis = val;
    // ellipseEntity.ellipse['semiMinorAxis'] = val;
    // ellipseEntity.ellipse.semiMinorAxis.setValue(state.semiMinorAxis);
    // if(targetEntity){
    //   targetEntity.ellipse.semiMinorAxis = parseFloat(val);                        
    // }
  }
);
watch(
  () => state.displayMode_ellipse,
  (val) => {
    if(targetEntity){
      if(val === 'Fill'){
        targetEntity.ellipse.fill = true;
        targetEntity.ellipse.outline = false;
      }else{
        targetEntity.ellipse.fill = false;
        targetEntity.ellipse.outline = true;
      }
    }
  }
);
watch(
  () => state.displayMode_box,
  (val) => {
    if(targetEntity){
      if(val === 'Fill'){
        targetEntity.box.fill = true;
        targetEntity.box.outline = false;
      }else{
        targetEntity.box.fill = false;
        targetEntity.box.outline = true;
      }
    }
  }
);
watch(
  () => state.displayMode_ellipsoid,
  (val) => {
    if(targetEntity){
      if(val === 'Fill'){
        targetEntity.ellipsoid.fill = true;
        targetEntity.ellipsoid.outline = false;
      }else{
        targetEntity.ellipsoid.fill = false;
        targetEntity.ellipsoid.outline = true;
      }
    }
  }
);
watch(
  () => state.displayMode_frustum,
  (val) => {
    if(targetEntity){
      if(val === 'Fill'){
        targetEntity.cylinder.fill = true;
        targetEntity.cylinder.outline = false;
      }else{
        targetEntity.cylinder.fill = false;
        targetEntity.cylinder.outline = true;
      }
    }
  }
);

onBeforeUnmount(() => {
  // clear();
});


</script>
  
  
<style lang="scss" scoped></style>
  
  
  
  
  
  