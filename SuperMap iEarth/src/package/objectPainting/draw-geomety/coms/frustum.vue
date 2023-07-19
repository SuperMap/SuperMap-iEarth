<template>
    <div class="row-item">
        <span>{{$t('global.length')}}</span>
        <div class="slider-box" >
            <n-slider style="width: 1.5rem" v-model:value="state.cylinderLength" :step="1" :min="10" :max="100" />
            <span>{{ state.cylinderLength }}</span>
        </div>
    </div>

    <div class="row-item">
        <span>{{$t('global.bottomHeight')}}</span>
        <div class="slider-box" >
            <n-slider style="width: 1.5rem" v-model:value="state.bottomRadius" :step="1" :min="10" :max="200" />
            <span>{{ state.bottomRadius }}</span>
        </div>
    </div>
    <div class="row-item">
        <span>{{$t('global.color')}}</span>
        <div class="color-pick-box" >
            <n-color-picker v-model:value="state.geometryMaterial" :render-label="() => {
                return '';
            }
                " size="small"></n-color-picker>
        </div>
    </div>
    <div class="row-item">
        <span>{{$t('global.drawMode')}}</span>
        <n-select style="width: 1.96rem;" v-model:value="state.displayMode" 
            :options="state.optionsMode" />
    </div>


    <div class="btn-row-item">
        <n-button type="info" color="#3499E5" text-color="#fff" @click="add" style="margin-right: 0.1rem">{{$t('global.Draw')}}</n-button>
        <n-button class="btn-secondary" @click="clear" color="rgba(255, 255, 255, 0.65)" ghost>{{$t('global.clear')}}</n-button>
    </div>
</template>
    
<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";

type stateType = {
    cylinderLength: number, // 长度
    bottomRadius: number, // 底部高程
    geometryMaterial: string, // 颜色
    displayMode: string,// 显示模式
    optionsMode:any,// 显示模式选项
}
// 初始化数据
let state = reactive<stateType>({
    // 圆锥
    cylinderLength: 40,
    bottomRadius: 20,
    geometryMaterial: 'rgba(255,255,255, 1)',
    displayMode: "Fill",
    optionsMode: [
        {
            label: () => GlobalLang.fillMode,
            value: "Fill",
        },
        {
            label: () => GlobalLang.wireframe,
            value: "Outline",
        }
    ],
});

let frustumEntity;
let entities = viewer.entities;
let handlerPoint_frustum = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Point);

//注册绘制椎体事件
handlerPoint_frustum.drawEvt.addEventListener(function (res) {
    let point = res.object;
    let position = point.position;
    // let color = SuperMap3D.Color.fromRandom({ alpha: 1.0 });
    let color = SuperMap3D.Color.fromCssColorString(state.geometryMaterial);
    frustumEntity = entities.add({
        position: position,
        cylinder: {
            length: 40.0,
            topRadius: 0.0,
            bottomRadius: 20.0,
            material: color,
            fill: true,
            outline: false,
            outlineColor: SuperMap3D.Color.BLACK,
            outlineWidth: 1
        }
    });
});

// 场景中拾取获得选中entity
let targetEntity: any = null;
let handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (e) {
    let pickedObject = viewer.scene.pick(e.position);
    if (SuperMap3D.defined(pickedObject) && (pickedObject.id instanceof SuperMap3D.Entity)) {
        targetEntity = pickedObject.id;
    } else {
        targetEntity = null;
    }
}, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);

function deactiveAll() {
    handlerPoint_frustum.deactivate();
}

function add() {
    deactiveAll();
    handlerPoint_frustum.activate();
}
function clear() {
    deactiveAll();
    if(handlerPoint_frustum) handlerPoint_frustum.clear();
    viewer.entities.removeAll();
    state.displayMode = 'Fill';
}

watch(
    () => state.bottomRadius,
    (val) => {
        if (targetEntity) {
            targetEntity.cylinder.bottomRadius = val;
        }
    }
);
watch(
    () => state.cylinderLength,
    (val) => {
        if (targetEntity) {
            targetEntity.cylinder.length = val;
        }
    }
);

watch(
    () => state.geometryMaterial,
    (val) => {
        if (targetEntity) {
            targetEntity.cylinder['material'] = SuperMap3D.Color.fromCssColorString(val);
        }
    }
);
watch(
    () => state.displayMode,
    (val) => {
        if (targetEntity) {
            if (val === 'Fill') {
                targetEntity.cylinder.fill = true;
                targetEntity.cylinder.outline = false;
            } else {
                targetEntity.cylinder.fill = false;
                targetEntity.cylinder.outline = true;
            }
        }
    }
);

onBeforeUnmount(() => {
    clear();
});


</script>
    
    
<style lang="scss" scoped>
</style>
    
    
    
    
    
    