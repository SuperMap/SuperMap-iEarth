<template>
    <!-- 长方体 -->
    <div class="row-item">
        <span>{{$t('global.length')}}</span>
        <div class="slider-box" >
            <n-slider style="width: 1.5rem" v-model:value="state.boxLength" :step="1" :min="10" :max="100" />
            <n-input-number 
                v-model:value="state.boxLength" 
                class="slider-input-number"
                :update-value-on-input="false"
                :bordered="false" 
                :show-button="false" 
                :min="10"
                :max="100"
                placeholder=""
                size="small" 
            />
        </div>
    </div>

    <div class="row-item">
        <span>{{$t('global.width')}}</span>
        <div class="slider-box">
            <n-slider style="width: 1.5rem" v-model:value="state.boxWidth" :step="1" :min="10" :max="200" />
            <n-input-number 
                v-model:value="state.boxLength" 
                class="slider-input-number"
                :update-value-on-input="false"
                :bordered="false" 
                :show-button="false" 
                :min="10"
                :max="200"
                placeholder=""
                size="small" 
            />
        </div>
    </div>

    <div class="row-item">
        <span>{{$t('global.height')}}</span>
        <div class="slider-box">
            <n-slider style="width: 1.5rem" v-model:value="state.boxHeight" :step="1" :min="10" :max="100" />
            <n-input-number 
                v-model:value="state.boxLength" 
                class="slider-input-number"
                :update-value-on-input="false"
                :bordered="false" 
                :show-button="false" 
                :min="10"
                :max="100"
                placeholder=""
                size="small" 
            />
        </div>
    </div>

    <div class="row-item">
        <span>{{$t('global.color')}}</span>
        <div class="color-pick-box row-content">
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
    boxLength: number, // 长度
    boxWidth: number, // 宽度
    boxHeight: number, // 高度
    geometryMaterial: string, // 颜色
    displayMode: string,// 显示模式
    optionsMode:any,// 显示模式选项
}
// 初始化数据
let state = reactive<stateType>({
    // 长方体
    boxLength: 20,
    boxWidth: 20,
    boxHeight: 20,
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
        },
        {
            label: () => GlobalLang.fillBothMode,
            value: "Both",
        }
    ],

});

let boxEntity;
let entities = viewer.entities;
let targetEntity: any = null;

let handlerPoint_box = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Point);

handlerPoint_box.activeEvt.addEventListener((isActive: any) => {
    if (isActive == true) {
        window.viewer.enableCursorStyle = false;
        window.viewer._element.style.cursor = '';
        document.body.classList.add("measureCur");
    } else {
        window.viewer.enableCursorStyle = true;
        document.body.classList.remove('measureCur');
    }
});

//注册绘制长方体事件
handlerPoint_box.drawEvt.addEventListener(function (res) {
    let point = res.object;
    let position = point.position;
    // let color = SuperMap3D.Color.fromRandom({ alpha: 1.0 });
    let color = SuperMap3D.Color.fromCssColorString(state.geometryMaterial);
    let fillFlag = ['Fill','Both'].indexOf(state.displayMode) != -1;
    let outlineFlag = ['Outline','Both'].indexOf(state.displayMode) != -1;
    boxEntity = entities.add({
        position: position,
        box: {
            dimensions: new SuperMap3D.Cartesian3(20.0, 20.0, 20.0),
            material: color,
            fill:  fillFlag,
            outline: outlineFlag,
            outlineColor: SuperMap3D.Color.BLACK,
            outlineWidth: 1
        }
    });
    targetEntity = boxEntity;
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

// 关闭
function deactiveAll() {
    handlerPoint_box.deactivate();
}

// 添加entity
function add() {
    deactiveAll();
    handlerPoint_box.activate();
}
// 清除
function clear() {
    deactiveAll();
    if(handlerPoint_box) handlerPoint_box.clear();
    viewer.entities.removeAll();
    state.displayMode = 'Fill';
}

watch(
    () => state.boxLength,
    (val) => {
        if (targetEntity) {
            let dim = targetEntity.box.dimensions.getValue();
            targetEntity.box.dimensions = new SuperMap3D.Cartesian3(val,dim.y,dim.z);
        }
    }
);

watch(
    () => state.boxWidth,
    (val) => {
        if (targetEntity) {
            let dim = targetEntity.box.dimensions.getValue();
            targetEntity.box.dimensions = new SuperMap3D.Cartesian3(dim.x,val,dim.z);
        }
    }
);

watch(
    () => state.boxHeight,
    (val) => {
        if (targetEntity) {
            let dim = targetEntity.box.dimensions.getValue();
            targetEntity.box.dimensions = new SuperMap3D.Cartesian3(dim.x,dim.y,val);
        }
    }
);

watch(
    () => state.geometryMaterial,
    (val) => {
        if (targetEntity) {
            targetEntity.box['material'] = SuperMap3D.Color.fromCssColorString(val);
        }
    }
);
watch(
    () => state.displayMode,
    (val) => {
        if (targetEntity) {
            if (val === 'Fill') {
                targetEntity.box.fill = true;
                targetEntity.box.outline = false;
            } else if(val === 'Outline') {
                targetEntity.box.fill = false;
                targetEntity.box.outline = true;
            }else{
                targetEntity.box.fill = true;
                targetEntity.box.outline = true;
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
    
    
    
    
    
    