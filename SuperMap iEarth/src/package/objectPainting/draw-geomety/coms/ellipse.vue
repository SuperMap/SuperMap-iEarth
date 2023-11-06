<template>
    <!-- 圆柱体 -->

    <div class="row-item">
        <span>{{$t('global.semiMinorAxis')}}</span>
        <div class="slider-box" >
            <n-slider style="width: 1.5rem" v-model:value="state.semiMinorAxis" :step="1" :min="5" :max="100" />
            <span>{{ state.semiMinorAxis }}</span>
        </div>
    </div>

    <div class="row-item">
        <span>{{$t('global.semiMajorAxis')}}</span>
        <div class="slider-box" >
            <n-slider style="width: 1.5rem" v-model:value="state.semiMajorAxis" :step="1" :min="5" :max="200" />
            <span>{{ state.semiMajorAxis }}</span>
        </div>
    </div>

    <div class="row-item">
        <span>{{$t('global.stretchingHeight')}}</span>
        <div class="slider-box" >
            <n-slider style="width: 1.5rem" v-model:value="state.extrudedHeight" :step="10" :min="10" :max="100" />
            <span>{{ state.extrudedHeight }}</span>
        </div>
    </div>

    <div class="row-item">
        <span>{{$t('global.granularity')}}</span>
        <div class="slider-box" >
            <n-slider style="width: 1.5rem" v-model:value="state.granularity" :step="0.1" :min="0.5" :max="2" />
            <span>{{ state.granularity }}</span>
        </div>
    </div>
    <div class="row-item">
        <span>{{$t('global.rotate')}}</span>
        <div class="slider-box" >
            <n-slider style="width: 1.5rem" v-model:value="state.rotation" :step="0.1" :min="0" :max="90" />
            <span>{{ state.rotation }}</span>
        </div>
    </div>

    <div class="row-item">
        <span>{{$t('global.color')}}</span>
        <div class="color-pick-box">
            <n-color-picker v-model:value="state.geometryMaterial" :render-label="() => {
                return '';
            }
                " size="small"></n-color-picker>
        </div>
    </div>
    <div class="row-item">
        <span>{{$t('global.drawMode')}}</span>
        <n-select style="width: 1.96rem" v-model:value="state.displayMode" 
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
    semiMinorAxis: 21,
    semiMajorAxis: 40,
    extrudedHeight: 50,
    granularity: 1,
    rotation: 0,
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

let ellipseEntity;
let entities = viewer.entities;
let targetEntity: any = null;

let handlerPoint_ellipse = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Point);

// 注册绘制圆柱事件
handlerPoint_ellipse.drawEvt.addEventListener(function (res) {
    let point = res.object;
    let position = point.position;
    // let color = SuperMap3D.Color.fromRandom({ alpha: 1.0 });
    let color = SuperMap3D.Color.fromCssColorString(state.geometryMaterial);
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
            fill: state.displayMode === 'Fill',
            outline: state.displayMode === 'Outline',
            outlineColor: SuperMap3D.Color.BLACK,
            outlineWidth: 1
        }
    });
    targetEntity = ellipseEntity;
});

// 场景中拾取获得选中entity
let handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (e) {
    let pickedObject = viewer.scene.pick(e.position);
    if (SuperMap3D.defined(pickedObject) && (pickedObject.id instanceof SuperMap3D.Entity)) {
        targetEntity = pickedObject.id;
    } else {
        // targetEntity = null;
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
    handlerPoint_ellipse.clear();
    if(handlerPoint_ellipse) handlerPoint_ellipse.clear();
    viewer.entities.removeAll();
    state.displayMode = 'Fill';
}
// 监听
watch(
    () => state.semiMinorAxis,
    (val) => {
        if(val > state.semiMajorAxis) state.semiMinorAxis = state.semiMajorAxis - 1;
        if (targetEntity) {
            if(val <= state.semiMajorAxis){ // 短半轴不能超过长半轴
                targetEntity.ellipse['semiMinorAxis'] = val;
            }
        }
    }
);
watch(
    () => state.semiMajorAxis, 
    (val) => {
        if(val < state.semiMinorAxis) state.semiMajorAxis = state.semiMinorAxis + 1;
        if (targetEntity) {
            if(val >= state.semiMinorAxis){
                targetEntity.ellipse['semiMajorAxis'] = val;
            }
        }
    }
);
watch(
    () => state.extrudedHeight, 
    (val) => {
        if (targetEntity) {
            targetEntity.ellipse['extrudedHeight'] = val;
        }
    }
);
watch(
    () => state.rotation, 
    (val) => {
        if (targetEntity) {
            targetEntity.ellipse['rotation'] =  val ;
        }
    }
);
watch(
    () => state.granularity, 
    (val) => {
        if (targetEntity) {
            targetEntity.ellipse['granularity'] =  val * SuperMap3D.Math.RADIANS_PER_DEGREE;
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
    
    
    
<style lang="scss" scoped>
</style>
    
    
    
    
    
    