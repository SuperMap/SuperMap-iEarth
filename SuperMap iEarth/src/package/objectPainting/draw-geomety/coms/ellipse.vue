<template>
    <!-- 圆柱体 -->

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
    semiMinorAxis: number, // 短半轴
    semiMajorAxis: number, // 长半轴
    extrudedHeight: number, // 拉伸高度
    granularity: number, // 粒度
    rotation: number, // 旋转
    geometryMaterial: string, // 颜色
    displayMode: string,// 显示模式
    optionsMode:any,// 显示模式选项
}

// 初始化数据
let state = reactive<stateType>({
    // 圆柱体
    semiMinorAxis: 10,
    semiMajorAxis: 40,
    extrudedHeight: 50,
    granularity: 1,
    rotation: 0,
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

let ellipseEntity;
let entities = viewer.entities;

var handlerPoint_ellipse = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Point);

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
    handlerPoint_ellipse.deactivate();
}

function add() {
    deactiveAll();
    handlerPoint_ellipse.activate();
}
function clear() {
    deactiveAll();
    viewer.entities.removeAll();
}

watch(
    () => state.semiMinorAxis, // 不起效果，而且场景会动不了，但是页面组件随便用
    (val) => {
        if (targetEntity) {
            targetEntity.ellipse['semiMinorAxis'] = val;
        }
    }
);
watch(
    () => state.geometryMaterial,
    (val) => {
        if (targetEntity) {
            targetEntity.ellipse['material'] = SuperMap3D.Color.fromCssColorString(val);
        }
    }
);
watch(
    () => state.displayMode,
    (val) => {
        if (targetEntity) {
            if (val === 'Fill') {
                targetEntity.ellipse.fill = true;
                targetEntity.ellipse.outline = false;
            } else {
                targetEntity.ellipse.fill = false;
                targetEntity.ellipse.outline = true;
            }
        }
    }
);


onBeforeUnmount(() => {
    clear();
});


</script>
    
    
<style lang="scss" scoped></style>
    
    
    
    
    
    