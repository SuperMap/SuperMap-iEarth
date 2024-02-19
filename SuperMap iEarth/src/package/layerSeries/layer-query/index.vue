<template>
    <div class="layerSeries-box">
        <div class="row-item">
            <span>{{ $t('global.chooseLayer') }}</span>
            <n-select style="width: 1.96rem" v-model:value="state.selectedIndex"
                :options="state.s3mlayers" />
        </div>
        <div class="row-item" style="margin-bottom: 0.1rem">
            <span>{{$t('global.dataServerUrl')}}</span>
            <n-input class="add-input-border" style="width: 1.96rem" v-model:value="state.dataUrl" type="text"
            :placeholder="$t('global.inputServerUrl')"  />
        </div>
        <div class="row-item" style="margin-bottom: 0.1rem">
            <span>{{$t('global.dataSourceName')}}</span>
            <n-input class="add-input-border" style="width: 1.96rem" v-model:value="state.dataSourceName" type="text"
            :placeholder="$t('global.inputSourceName')" />
        </div>
        <div class="btn-row-item" style="margin-right: 0.1rem;margin-top: 0.12rem">
            <n-button type="info" color="#3499E5" text-color="#fff" class="ans-btn" @click="startQuery">{{ $t('global.query') }}</n-button>
            <n-button class="btn-secondary" @click="clear" color="rgba(255, 255, 255, 0.65)" ghost>{{ $t('global.clear')
            }}</n-button>
        </div>

        <div class="bableShadow" ref="bableQuery" v-show="state.shadowRadioShow">
            <div class="row-item" style="margin-top:0.12rem">
                <span class="shadow-anaylse-pop-titie">{{ state.queryLayerName }} - {{$t('global.queryResult')}}</span>
                <span @click="state.shadowRadioShow = false" style="margin-right:14px">X</span>
            </div>
            <div class="bable-container">
                <n-scrollbar style="max-height: 3.8rem">
                    <div class="row-item" style="margin-left: 0.12rem;margin-right: 0.12rem"
                        v-for="item in state.modelInfo">
                        <span>{{ item.lable }}</span>
                        <span>{{ item.value }}</span>
                        <!-- <n-input style="width: 1.6rem;" v-model:value="item.value" :show-button="false" disabled>
                        </n-input> -->
                    </div>
                </n-scrollbar>

            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, onBeforeUnmount, watch } from "vue";
import { useLayerStore } from "@/store/layerStore";
import { useMessage } from "naive-ui";
const message = useMessage();

const layerStore = useLayerStore();

type StateType = {
    s3mlayers: any, //当前存在的可选择s3m图层
    selectedIndex: number, //默认选择图层index
    dataUrl: string,
    dataSourceName: string,
    shadowRadioShow: boolean,
    modelInfo: any,
    queryLayerName: string,
    scenePosition: any,
    isSetForLayer:boolean;
}

// 初始化数据
let state = reactive<StateType>({
    s3mlayers: [], //当前存在的可选择s3m图层
    selectedIndex: 0, //默认选择图层index
    dataUrl: '',
    dataSourceName: '',
    shadowRadioShow: false,
    modelInfo: {},
    queryLayerName: '',
    scenePosition: null,
    isSetForLayer:false,
});
let layers;
let bableQuery = ref();
let handler;
const scene = viewer.scene;

function updateLayers() {
    layers = viewer.scene.layers.layerQueue;
    if (!layers || layers.length < 1) {
        state.s3mlayers = [{ label: () => GlobalLang.noLayer, value: 0 }];
        return;
    }
    state.s3mlayers.length = 0;
    layers.forEach((layer, index) => {
        let name = layer._name;
        state.s3mlayers.push({
            label: name,
            value: index
        });
    });
    if (state.selectedIndex > layers.length - 1) state.selectedIndex = 0;
    layers[state.selectedIndex].selectEnabled = true;
}

function init() {
    if (!window.viewer) return;
    updateLayers();
    state.selectedIndex = Number(layerStore.s3mLayerSelectIndex);
    layers[state.selectedIndex].selectEnabled = true;

    // 获取图层绑定的数据源信息
    setQueryInfo();
}
init();


function startQuery() {
    if (!state.dataUrl || state.dataUrl === '' || !state.dataSourceName || state.dataSourceName === '') {
        message.warning(GlobalLang.inputUrlName);
        return;
    }

    // let targetLayer = viewer.scene.layers.find('BIMbuilding');
    let targetLayer = layers[state.selectedIndex];
    state.queryLayerName = targetLayer.name;

    targetLayer.setQueryParameter({
        // url: "http://www.supermapol.com/realspace/services/data-BIMbuilding/rest/data",
        url: state.dataUrl,
        dataSourceName: state.dataSourceName, // BIMBuilding
        isMerge: true
    });
    // 设置选中颜色
    var color = new SuperMap3D.Color.fromCssColorString("rgba(23,92,239,1)");
    targetLayer.selectedColor = color;
    if(!state.isSetForLayer){
        message.success(GlobalLang.bindInfoOK);
        state.isSetForLayer = true;
    }else{
        message.warning(GlobalLang.hadBind);
    }

    // 点击模型获取相关信息
    viewer.pickEvent.addEventListener(getModelInfo);

    // 每一帧都去计算气泡的正确位置
    scene.postRender.addEventListener(setBablePosition);

    // 获取当前点击的位置
    handler = new SuperMap3D.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function (e: any) {
        // state.shadowRadioShow = true;
        // 获取点击位置笛卡尔坐标
        var position = scene.pickPosition(e.position);
        if (!position) {
            position = SuperMap3D.Cartesian3.fromDegrees(0, 0, 0);
        }
        state.scenePosition = position; // 气泡位置

    }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);

    let item = layerStore.layerQueryOptions.filter(item => item.name == state.queryLayerName);
    if (item.length === 0) {
        // 保存数据源信息
        let obj = {
            name: targetLayer.name,
            dataUrl: state.dataUrl,
            dataSourceName: state.dataSourceName
        }
        layerStore.layerQueryOptions.push(obj);

    } 

}

// 设置气泡位置
function setBablePosition() {
    if (state.scenePosition) {
        let WindowCoordinates = SuperMap3D.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, state.scenePosition)
        bableQuery.value.style.top = (WindowCoordinates.y - bableQuery.value.offsetHeight - 10) + 'px';
        bableQuery.value.style.left = (WindowCoordinates.x - bableQuery.value.offsetWidth / 2) + 140 + 'px';
    }
}

// 点击拾取实体，获取属性信息
function getModelInfo(feature: any) {
    console.log("feature:",feature)
    if (feature) {
        state.shadowRadioShow = true;
        let list: any = [];
        for (let key in feature) {
            let value = String(feature[key]);
            if (value.indexOf('.') != -1) value = Number(value).toFixed(2);
            list.push({
                lable: key,
                value: value
            })
        }
        state.modelInfo = list;
    } else {
        state.shadowRadioShow = false;
        message.success(GlobalLang.noData);
    }
}

// 获取已绑定的图层查询信息
function setQueryInfo() {
    if (layerStore.layerQueryOptions.length > 0) {
        let selectLayerName = layers[state.selectedIndex].name;
        let targetItem = layerStore.layerQueryOptions.filter(item => item.name == selectLayerName);
        if (targetItem.length > 0) {
            state.dataUrl = targetItem[0].dataUrl;
            state.dataSourceName = targetItem[0].dataSourceName;
        }
    }
}

// 清除
function clear() {
    state.shadowRadioShow = false;
    if (handler) {
        handler.destroy();
        handler = null;
    }
    state.dataUrl = '';
    state.dataSourceName = '';
    state.isSetForLayer = false;
    scene.postRender.removeEventListener(setBablePosition);
    viewer.pickEvent.removeEventListener(getModelInfo);
}

// 监听
watch(
    () => layerStore.layerChangeCount,
    () => {
        updateLayers();
    });
watch(
    () => state.selectedIndex,
    () => {
        clear();
        setQueryInfo();
    });

onBeforeUnmount(() => {
    layers = null;
    clear();
});
</script>
  
<style lang="scss" scoped>
.bableShadow {
    position: fixed;
    top: 2rem;
    left: 5rem;
    background-color: #383838;
    opacity: 0.9;
    z-index: 200000;
    height: 4.5rem;
    width: 3rem;

    .bable-container {
        // height: 1.7rem;
        // width: 2.28rem;
        overflow-y: scroll;
        @include setsSrollbar();
    }

    .shadow-anaylse-pop-titie {
        margin-left: 0.12rem;
        font-size: 12px;
        line-height: 20px;

    }

    span {
        font-size: 12px;
    }
}
</style>
  
  
  
  
  
  
  