<template>
    <n-space justify="end">
      <n-select class="add-input-border" v-model:value="state.layerType" :options="state.typeOptions"
        style="width: 2.4rem; margin-bottom: 0.1rem" />
    </n-space>
  
    <div class="row-item" style="margin-bottom: 0.1rem">
      <span>场景ID</span>
      <n-input class="add-input-border" style="width: 2.4rem" v-model:value="state.layerUrl" type="text" />
    </div>
  
    <!-- <div class="row-item" style="margin-bottom: 0.1rem" v-show="state.layerType != 'WMTS'">
      <span>{{ $t('global.name') }}</span>
      <n-input class="add-input-border" style="width: 2.4rem" v-model:value="state.layerName" type="text"
         :title="state.layerName" :disabled="true" />
    </div> -->
  
    <div class="btn-row-item1">
      <n-button type="info" size="small" color="#3499E5" text-color="#fff" class="ans-btn" @click="forTestMinify">打开</n-button>
      <n-button type="info" size="small" color="#3499E5" text-color="#fff" class="ans-btn" @click="watchData">查看</n-button>
      <n-button type="info" size="small" color="#3499E5" text-color="#fff" class="ans-btn" @click="TEST">测试</n-button>
      <n-button type="info" size="small" color="#3499E5" text-color="#fff" class="ans-btn" @click="forAxois">Axois</n-button>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive ,watch} from "vue";
  import openSceneMinify from "./js/openSceneMinify.js"
  import { useLayerStore } from "@/store/layerStore";

  const layerStore = useLayerStore();

  let state = reactive({
    layerType: 'S3M',
    layerToken: '',
    layerUrl: '',
    layerName: '',
    typeOptions: [
      {
        label: "大屏测试",
        value: "S3M",
      },
      {
        label: '地图属性查询',
        value: "Imagery",
      },
    ]
  })


  function forTestMinify() {
    openSceneMinify.openExistScene(state.layerUrl);
  }
  
  function watchData(){
    // console.log("layerStore.particleOptions:",layerStore.particleOptions);
    // if(layerStore.particleOptions['fire'] != null){
    //   let fireOption = layerStore.particleOptions['fire'];
    //   layerStore.addParticleFile(fireOption);
    //   // if(window.EarthGlobal["particle"]){
    //   //   particle = window.EarthGlobal["particle"];
    //   // }
    // }

    console.log("layerStore.layerStyleOptions:",layerStore.layerStyleOptions);
    // console.log("layerStore.particleOptions:",layerStore.particleOptions);
  
  }
  
  // 测试场景风格
  // function TEST(){
  //   let obj = {
  //   "Building@CBD": {
  //       "foreColor": "rgba(33, 48, 213, 1)",
  //       "lineColor": "rgba(255, 255, 255, 1)",
  //       "selectedColor": "rgba(197, 15, 15, 1)",
  //       "selectColorMode": 1,
  //       "bottomAltitude": 71,
  //       "layerTrans": 0.3,
  //       "LODScale": 1,
  //       "fillStyle": 0
  //   },
  //   "重庆白模": {
  //       "foreColor": "rgba(43, 33, 184, 1)",
  //       "lineColor": "rgba(54, 31, 183, 1)",
  //       "selectedColor": "rgba(179,179,255, 1)",
  //       "selectColorMode": 0,
  //       "bottomAltitude": 0,
  //       "layerTrans": 1,
  //       "LODScale": 1,
  //       "fillStyle": 1
  //   },
  //   "Bridge@CBD": {
  //       "foreColor": "rgba(21, 217, 80, 1)",
  //       "lineColor": "rgba(255, 255, 255, 1)",
  //       "selectedColor": "rgba(179,179,255, 1)",
  //       "selectColorMode": 0,
  //       "bottomAltitude": 100,
  //       "layerTrans": 1,
  //       "LODScale": 1,
  //       "fillStyle": 0
  //   }
  //   }
  //   layerStore.setLayerStyle(obj);
  // }

  function TEST(){


    // 测试场景属性
    let attr = {
        "earthShow": true,
        "shadow": true,
        "sunShow": false,
        "depthInspection": true,
        "atomsphereRender": false,
        "fogEffect": false,
        "cloudLayer": false,
        "skyBoxShow": true,
        "timeAxis": true,
        "displayFrame": true,
        "showUnderground": false,
        "surfaceTransparency": 1,
        "brightness": 1.4,
        "contrast": 1.6,
        "hue": -0.3,
        "saturation": 2.8
      }
      layerStore.sceneAttrState = attr;
    layerStore.setSceneAttr(attr)

    // 场景风格
    let style = {
    "Building@CBD": {
        "foreColor": "rgba(33, 48, 213, 1)",
        "lineColor": "rgba(255, 255, 255, 1)",
        "selectedColor": "rgba(197, 15, 15, 1)",
        "selectColorMode": 1,
        "bottomAltitude": 71,
        "layerTrans": 0.3,
        "LODScale": 1,
        "fillStyle": 0
    },
    "重庆白模": {
        "foreColor": "rgba(43, 33, 184, 1)",
        "lineColor": "rgba(54, 31, 183, 1)",
        "selectedColor": "rgba(179,179,255, 1)",
        "selectColorMode": 0,
        "bottomAltitude": 0,
        "layerTrans": 0.3,
        "LODScale": 1,
        "fillStyle": 1
    },
    "Bridge@CBD": {
        "foreColor": "rgba(21, 217, 80, 1)",
        "lineColor": "rgba(255, 255, 255, 1)",
        "selectedColor": "rgba(179,179,255, 1)",
        "selectColorMode": 0,
        "bottomAltitude": 100,
        "layerTrans": 1,
        "LODScale": 1,
        "fillStyle": 0
    }
    }
    // layerStore.layerStyleOptions = style;
    // layerStore.setLayerStyle(style);

    // 测试粒子系统
    let obj = {
    "fire": {
        "particleUrl": "./Resource/particle/Fire.json",
        "particlePosition": {
            "x": -2182675.8188203466,
            "y": 4386571.001194588,
            "z": 4069765.2870884887
        },
        "particleAttr": {
            "emitRate": 852,
            "minSize": 62,
            "maxSize": 80,
            // "minLifeTime": 0.112,
            // "maxLifeTime": 0.178,
            // "minEmitPower": 30,
            // "maxEmitPower": 61
        }
    },
    "water": {
        "particleUrl": "./Resource/particle/fountain.json",
        "particlePosition": {
            "x": -2182939.577150758,
            "y": 4386362.495282677,
            "z": 4069848.304239633
        },
        "particleAttr": {
            "emitRate": 1200,
            "minSize": 7,
            "maxSize": 4,
            "minScaleX": 39,
            "minScaleY": 39,
            "maxScaleX": 39,
            "maxScaleY": 39,
            "gravity": -15,
            "minEmitPower": 19,
            "maxEmitPower": 27,
        }
    },
    "fireWork": {
        "fireWorkPosition": {
            "x": -2182681.849266271,
            "y": 4386266.445984421,
            "z": 4070114.4623629563
        }
    }
    }
    // layerStore.particleOptions = obj
    // layerStore.setParticle(obj);
  }
  
  function forAxois(){
    window.axios
      .get(state.layerUrl, { withCredentials: true })
      .then(function (response) {
        console.log("response-axois:", response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  </script>
  
  <style lang="scss" scoped></style>