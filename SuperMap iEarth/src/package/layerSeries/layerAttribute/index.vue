<template>
    <!-- 绘制线 -->
    <div class="row-item">
      <span>图层名称</span>
      <n-select
        style="width: 1.96rem;height: 32px;"
        v-model:value="state.selectedType"
        size="small"
        :options="state.optionMode"
      />
    </div>
  
    <div class="row-item">
      <span class="name">符号库</span>
      <div class="icon-list-space" style="width: 1.96rem;">
        <span
          v-for="(line, index) in state.lineOptions"
          :key="index"
          class="icon-span"
          :title="line.name"
          :class="line.isSelect ? 'selected-icon' : ''"
          @click="changleIconItem(line)"
        >
          <!-- <svg-icon :name="line.iconName" class="icon-size" /> -->
          <i class="iconfont iconSize" :class="line.iconName"></i>
        </span>
      </div>
    </div>
  
    <div class="row-item">
      <span>线颜色</span>
      <div class="color-pick-box row-content" style="width: 1.96rem;height: 32px;">
        <n-color-picker
          v-model:value="state.lineColor"
          :render-label="
            () => {
              return '';
            }
          "
          size="small"
        ></n-color-picker>
      </div>
    </div>
  
    <div class="row-item">
      <span>线宽</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider
          style="width: 1.5rem"
          v-model:value="state.lineWidth"
          :step="1"
          :min="1"
          :max="10"
        />
        <span>{{ state.lineWidth }}</span>
      </div>
    </div>
  
    
    <div class="row-item">
        <span>编辑线</span>
        <div class="check-box" >
          <n-checkbox v-model:checked="state.isEdit"></n-checkbox>
        </div>
      </div>
    <div class="row-item">
        <span>编辑线Z轴</span>
        <div class="check-box">
          <n-checkbox v-model:checked="state.isEditZ"></n-checkbox>
        </div>
      </div>
    <div class="btn-row-item">
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        @click="add"
        style="margin-right: 0.1rem"
        >绘制</n-button
      >
      <n-button class="btn-secondary" @click="clear">清除</n-button>
    </div>
  </template>
    
    <script lang="ts" setup>
  import { reactive, onBeforeUnmount, watch } from "vue";
  import { useNotification } from "naive-ui";
  import initHandler from "@/tools/drawHandler";
  import setEditHandler from "@/tools/editHandler";
  import locale from "@/tools/locateTemp";
  
  type stateType = {
    selectedType: string, // 当前选择的绘制模式
    selectedId: number, // 当前选择的线类型索引
    lineColor: string, //设置线颜色
    lineWidth: number, //设置选中线宽
    dottedColor: string, //间隔颜色
    dottedLength: number, 
    outLineColor: string,
    outLineWidth: number,
    glowStrength: number,
    trailPercentage: number,
    isEdit: boolean, // 是否编辑
    isEditZ: boolean, // 是否只编辑Z轴
    optionMode:any,// 绘制模式选项
    lineOptions:any,// 线类型选项
  }
  
  // 初始化数据
  let state = reactive<stateType>({
    selectedType: "NONE",
    selectedId: 0,
    lineColor: "rgba(250, 196, 65, 1)", //设置线颜色
    lineWidth: 5, //设置选中线宽
    dottedColor: "rgba(250, 196, 65, 0)", //间隔颜色
    dottedLength: 30,
    outLineColor: "rgba(29, 206, 200, 1)",
    outLineWidth: 2,
    glowStrength: 0.5,
    trailPercentage: 0.3,
    isEdit: false,
    isEditZ: false,
    optionMode: [
      {
        label: () => locale.SpaceMode,
        value: "NONE",
      },
      {
        label: () => locale.TERRAINMode,
        value: "TERRAIN",
      },
      {
        label: () => locale.S3M_TILEMode,
        value: "S3M_TILE",
      },
      {
        label: () => locale.BOTHMode,
        value: "BOTH",
      },
    ],
    lineOptions: [
      {
        id: 0,
        iconName: "iconshixian",
        name: "实线",
        nameEN: "solidline",
        isSelect: true,
      },
      {
        id: 1,
        iconName: "iconxuxian",
        name: "虚线",
        nameEN: "dottedline",
        isSelect: false,
      },
      {
        id: 2,
        iconName: "iconlunkuoxian",
        name: "轮廓线",
        nameEN: "outline",
        isSelect: false,
      },
      {
        id: 3,
        iconName: "iconjiantou",
        name: "箭头线",
        nameEN: "arrowline",
        isSelect: false,
      },
      {
        id: 4,
        iconName: "iconguangyunxian",
        name: "光晕线",
        nameEN: "haloline",
        isSelect: false,
      },
      {
        id: 5,
        iconName: "iconweijixian",
        name: "尾迹线",
        nameEN: "trailline",
        isSelect: false,
      },
    ],
  });
  
  const notification = useNotification();
  
  let handlerPolyline,
    removeEdit,
    line_ids: any[] = [];
  let clampToGround = undefined,
    classificationType = undefined,
    selected_line: any = undefined;
  
  // 分析
  function add() {
    notification.create({
      content: () => locale.DrawSymbolTip,
      duration: 3500,
    });
    add_line();
  }
  
  // 添加线
  function add_line() {
    if (!handlerPolyline) {
      handlerPolyline = initHandler("Polyline");
    }
    handlerPolyline.handlerDrawing().then(
      (res) => {
        creat_entity_line(res.object.positions);
        handlerPolyline.polylineTransparent.show = false;
      },
      (err) => {
        console.log(err);
      }
    );
    handlerPolyline.activate();
  }
  
  // 清除
  function clear() {
    if (handlerPolyline) handlerPolyline.clearHandler();
    if (selected_line) {
      viewer.entities.removeById(selected_line.id);
      selected_line = undefined;
    } else {
      line_ids.forEach((id) => viewer.entities.removeById(id));
      line_ids.length = 0;
    }
    removeEditHandler();
  
    state.isEdit = false;
  }
  
  // 根据索引创建不同类型的线实体 - entity
  function creat_entity_line(position: any) {
    let lineColor = SuperMap3D.Color.fromCssColorString(state.lineColor);
    let lineWidth = Number(state.lineWidth);
    let material: any;
    let id = "add-line-" + new Date().getTime();
    switch (state.selectedId) {
      case 0:
        material = lineColor;
        break;
      case 1:
        let dottedColor = SuperMap3D.Color.fromCssColorString(state.dottedColor); //间隔颜色
        let dottedLength = Number(state.dottedLength);
        material = new SuperMap3D.PolylineDashMaterialProperty({
          color: lineColor,
          gapColor: dottedColor,
          dashLength: dottedLength,
        });
        break;
      case 2:
        let outLineColor = SuperMap3D.Color.fromCssColorString(
          state.outLineColor
        ); //轮廓颜色
        let outLineWidth = Number(state.outLineWidth);
        material = new SuperMap3D.PolylineOutlineMaterialProperty({
          color: lineColor,
          outlineWidth: outLineWidth,
          outlineColor: outLineColor,
        });
        break;
      case 3:
        material = new SuperMap3D.PolylineArrowMaterialProperty(lineColor);
        break;
      case 4:
        let glowStrength = Number(state.glowStrength);
        material = new SuperMap3D.PolylineGlowMaterialProperty({
          glowPower: glowStrength,
          color: lineColor,
        });
        break;
      case 5:
        let trailPercentage = Number(state.trailPercentage);
        material = new SuperMap3D.PolylineTrailMaterialProperty({
          color: lineColor,
          trailLength: trailPercentage,
          // period: state.trailPeroid
        });
        break;
      default:
        material = lineColor;
        break;
    }
    line_ids.push(id);
    selected_line = viewer.entities.add({
      id: id,
      polyline: {
        positions: position,
        width: lineWidth,
        material: material,
        classificationType: classificationType, //贴地贴对象模式设置
        clampToGround: clampToGround, //贴地贴对象需要设置true
      },
    });
  }
  
  // 设置线的绘制模式：贴地、空间、贴S3M
  function setLineMode(val1, val2) {
    clampToGround = val1;
    classificationType = val2;
    if (selected_line) {
      selected_line.polyline.clampToGround = clampToGround;
      selected_line.polyline.classificationType = classificationType;
    }
  }
  
  // 设置线实体可编辑
  function setEdit() {
    viewer.selectedEntity = undefined;
    removeEdit = viewer.selectedEntityChanged.addEventListener(() => {
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.includes("add-line")
      ) {
        setEditHandler(viewer.selectedEntity, state.isEditZ);
        selected_line = viewer.selectedEntity;
      } else selected_line = undefined;
    });
  }
  
  // 移除编辑
  function removeEditHandler() {
    if (removeEdit) removeEdit();
    if (window.editHandler) window.editHandler.clear();
    viewer.selectedEntity = undefined;
  }
  
  // 切换项目
  function changleIconItem(item: any) {
    state.selectedId = item.id;
    for (let i = 0; i < state.lineOptions.length; i++) {
      if (state.lineOptions[i].id == item.id) {
        state.lineOptions[i].isSelect = true;
      } else {
        state.lineOptions[i].isSelect = false;
      }
    }
  }
  
  watch(
    () => state.selectedType,
    (val) => {
      switch (val) {
        case "NONE":
          setLineMode(undefined, undefined);
          break;
        case "TERRAIN":
          setLineMode(true, SuperMap3D.ClassificationType.TERRAIN);
          break;
        case "S3M_TILE":
          setLineMode(true, SuperMap3D.ClassificationType.S3M_TILE);
          break;
        case "BOTH":
          setLineMode(true, SuperMap3D.ClassificationType.BOTH);
          break;
        default:
          setLineMode(undefined, undefined);
          break;
      }
    }
  );
  
  watch(
    () => state.lineColor,
    (val) => {
      let color = SuperMap3D.Color.fromCssColorString(val);
      if (selected_line) selected_line.polyline.material.color = color;
    }
  );
  watch(
    () => state.lineWidth,
    (val) => {
      if (selected_line) selected_line.polyline.width = Number(val);
    }
  );
  
  watch(
    () => state.dottedColor,
    (val) => {
      let color = SuperMap3D.Color.fromCssColorString(val);
      if (selected_line) selected_line.polyline.material.gapColor = color;
    }
  );
  
  watch(
    () => state.dottedLength,
    (val) => {
      if (selected_line) selected_line.polyline.material.dashLength = Number(val);
    }
  );
  watch(
    () => state.outLineColor,
    (val) => {
      let color = SuperMap3D.Color.fromCssColorString(val);
      if (selected_line) selected_line.polyline.material.outlineColor = color;
    }
  );
  watch(
    () => state.outLineWidth,
    (val) => {
      if (selected_line)
        selected_line.polyline.material.outlineWidth = Number(val);
    }
  );
  watch(
    () => state.glowStrength,
    (val) => {
      if (selected_line) selected_line.polyline.material.glowPower = Number(val);
    }
  );
  watch(
    () => state.trailPercentage,
    (val) => {
      if (selected_line)
        selected_line.polyline.material.trailLength = Number(val);
    }
  );
  
  watch(
    () => state.isEdit,
    (val) => {
      if (val) {
        notification.create({
          content: () => locale.DrawlineTip,
          duration: 3500,
        });
        setEdit();
      } else removeEditHandler();
    }
  );
  watch(
    () => state.isEditZ,
    (val) => {
      if (window.editHandler) {
        window.editHandler.isEditZ = val;
      }
    }
  );
  
  onBeforeUnmount(() => {
    clear();
  });
  
  </script>
    
    
  <style lang="scss" scoped>
  :deep(.n-slider-handle){
    background-color: #414141 !important;
    border: 1.5px solid #3499E5 !important;
  }
  </style>
    
    
    
    
    
    