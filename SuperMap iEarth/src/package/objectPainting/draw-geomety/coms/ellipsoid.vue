<template>
    <!-- 球体 -->
    
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
        <span>颜色</span>
        <div class="color-pick-box row-content" style="width: 1.96rem;height: 32px;">
            <n-color-picker v-model:value="state.geometryMaterial" :render-label="() => {
                return '';
            }
                " size="small"></n-color-picker>
        </div>
    </div>
    <div class="row-item">
        <span>绘制模式</span>
        <n-select style="width: 1.96rem;height: 32px;" v-model:value="state.displayMode" size="small"
            :options="state.optionsMode" />
    </div>




    <div class="btn-row-item">
        <n-button type="info" color="#3499E5" text-color="#fff" @click="add" style="margin-right: 0.1rem">绘制</n-button>
        <n-button class="btn-secondary" @click="clear">清除</n-button>
    </div>
</template>
    
<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";

type stateType = {
    xRadii: number, // X半径
    yRadii: number, // Y半径
    zRadii: number, // Z半径
    geometryMaterial: string, // 颜色
    displayMode: string,// 显示模式
    optionsMode:any,// 显示模式选项
}
// 初始化数据
let state = reactive<stateType>({
    // 球体
    xRadii: 20,
    yRadii: 20,
    zRadii: 20,
    geometryMaterial: 'rgba(255,255,255, 1)',
    displayMode: "Fill",
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
});

let ellipsoidEntity;
let entities = viewer.entities;
var handlerPoint_ellipsoid = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Point);

// 注册绘制球体事件
handlerPoint_ellipsoid.drawEvt.addEventListener(function (res) {
    var point = res.object;
    var position = point.position;
    var posDeg = SuperMap3D.Cartographic.fromCartesian(position);
    posDeg.height = 20;
    position = SuperMap3D.Cartesian3.fromRadians(posDeg.longitude, posDeg.latitude, posDeg.height);
    var color = SuperMap3D.Color.fromRandom({ alpha: 1.0 });
    ellipsoidEntity = entities.add({
        position: position,
        ellipsoid: {
            radii: new SuperMap3D.Cartesian3(20.0, 20.0, 20.0),
            material: color,
            fill: true,
            outline: false,
            outlineColor: SuperMap3D.Color.BLACK,
            outlineWidth: 1
        }
    });

});

// 场景中拾取获得选中entity
var targetEntity: any = null;
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
    handlerPoint_ellipsoid.deactivate();
}

function add() {
    deactiveAll();
    handlerPoint_ellipsoid.activate();
}
function clear() {
    deactiveAll();
    viewer.entities.removeAll();
}

watch(
    () => state.geometryMaterial,
    (val) => {
        if (targetEntity) {
            targetEntity.ellipsoid['material'] = SuperMap3D.Color.fromCssColorString(val);
        }
    }
);
watch(
    () => state.displayMode,
    (val) => {
        if (targetEntity) {
            if (val === 'Fill') {
                targetEntity.ellipsoid.fill = true;
                targetEntity.ellipsoid.outline = false;
            } else {
                targetEntity.ellipsoid.fill = false;
                targetEntity.ellipsoid.outline = true;
            }
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
    
    
    
    
    
    