<template>
    <!-- 相机定位 -->
    <div class="row-wrap">
      <div class="content">
        <div class="switch-box">
            <div class="text">{{ $t("cameraLocate") }}</div>
            <n-switch v-model:value="state.flyShow" size="small" />
        </div>
      </div>
    </div>

    <!-- 相机定位 -->
    <div v-show="state.flyShow">
        <div class="row-wrap">
            <div class="label">{{ $t("longitude") }}</div>
            <div class="content">
                <n-input-number v-model:value="state.longitude" :min="-180" :max="180"
                    :show-button="false" placeholder="0">
                    <template #suffix>°</template>
                </n-input-number>
            </div>
        </div>

        <div class="row-wrap">
            <div class="label">{{ $t("latitude") }}</div>
            <div class="content">
                <n-input-number v-model:value="state.latitude" :min="-90" :max="90" :show-button="false" 
                    placeholder="0">
                    <template #suffix>°</template>
                </n-input-number>
            </div>
        </div>

        <div class="row-wrap">
            <div class="label">{{ $t("elevation") }}</div>
            <div class="content">
                <n-input-number v-model:value="state.altitude" :min="-1000" :max="1000000" :show-button="false" 
                    placeholder="0">
                    <template #suffix>{{ $t("meter") }}</template>
                </n-input-number>
            </div>
        </div>

        <div class="row-btns">
            <n-button @click="flyPosition" class="operate" type="info" :focusable="false">{{
            $t("locate") }}</n-button>
            <n-button @click="cancle" :focusable="false">{{ $t("cancle") }}</n-button>
        </div>
    </div>

</template>
  
<!-- TODO: 支持俯仰角等 -->
<!-- TODO: 支持获取当前相机定位 -->
<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";

type stateType = {
    flyShow: false; // 是否开启相机定位
    longitude: number;
    latitude: number;
    altitude: number;
};

// 初始化变量
let state = reactive<stateType>({
    flyShow: false,
    longitude: 0,
    latitude: 0,
    altitude: 0,
});

const scene = viewer.scene;

onMounted(() => { });

onBeforeUnmount(() => { });


function flyPosition() {
    viewer.camera.flyTo({
        destination: SuperMap3D.Cartesian3.fromDegrees(state.longitude, state.latitude, state.altitude),
    });
}

function cancle() {

}
</script>
  