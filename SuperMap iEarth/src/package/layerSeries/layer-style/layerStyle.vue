<template>
  <n-scrollbar style="max-height: 5rem">
    <div class="layerSeries-box">
      <div class="row-item">
        <span>{{ $t("chooseLayer") }}</span>
        <n-select style="width: 1.96rem" @update:value="handleSelectLayer" v-model:value="state.selectedName"
          :options="state.s3mlayers" />
      </div>

      <div class="row-item">
        <span>{{ $t("fillStyle") }}</span>
        <n-select style="width: 1.96rem" v-model:value="state.fillStyle"
          :options="state.fillStyleMode" />
      </div>
      <div class="row-item" v-show="state.fillStyle != 1">
        <span>{{ $t("fillColor") }}</span>
        <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
          <n-color-picker v-model:value="state.fillColor" :render-label="() => {
            return '';
          }
            " size="small"></n-color-picker>
        </div>
      </div>

      <div class="row-item" v-show="state.fillStyle != 0">
        <span>{{ $t('wireframeColor') }}</span>
        <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
          <n-color-picker v-model:value="state.lineColor" :render-label="() => {
            return '';
          }
            " size="small"></n-color-picker>
        </div>
      </div>

      <div class="row-item" v-show="state.fillStyle != 0">
        <span>{{ $t('wireWidth') }}</span>
        <div class="slider-box">
          <n-slider v-model:value="state.lineWidth" style="width: 70%" :step="0.1" :min="0.1" :max="10" />
          <n-input-number v-model:value="state.lineWidth" class="slider-input-number" :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="0.1" :max="10" placeholder="" size="small" />
        </div>
      </div>

      <div class="row-item">
        <span>{{ $t("selectedColor") }}</span>
        <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
          <n-color-picker v-model:value="state.selectedColor" :render-label="() => {
              return '';
            }
            " size="small"></n-color-picker>
        </div>
      </div>

      <div class="row-item">
        <span>{{ $t("selectColorMode") }}</span>
        <n-radio-group v-model:value="state.selectColorMode" name="shadowMode" style="width: 1.96rem">
          <n-radio :value="0" style="margin-right: 0.2rem"><n-ellipsis>{{ $t("colorMix") }}</n-ellipsis></n-radio>
          <n-radio :value="1"><n-ellipsis>{{ $t("colorReplace") }} </n-ellipsis></n-radio>
        </n-radio-group>
      </div>

      <div class="row-item">
        <span>{{ $t("bottomHeight") }}</span>
        <div class="slider-box">
          <n-slider v-model:value="state.bottomAltitude" style="width: 70%" :step="1" :min="-100" :max="100" />
          <n-input-number v-model:value="state.bottomAltitude" class="slider-input-number"
            :update-value-on-input="false" :bordered="false" :show-button="false" :min="-100" :max="100" placeholder=""
            size="small" />
        </div>
      </div>

      <div class="row-item">
        <span>LOD</span>
        <div class="slider-box">
          <n-slider v-model:value="state.LODScale" style="width: 70%" :step="0.1" :min="0" :max="10" />
          <n-input-number v-model:value="state.LODScale" class="slider-input-number" :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="0" :max="10" placeholder="" size="small" />
        </div>
      </div>

      <div class="row-item">
        <span>{{ $t("transparency") }}</span>
        <div class="slider-box">
          <n-slider v-model:value="state.layerTrans" style="width: 70%" :step="0.05" :min="0" :max="1" />
          <n-input-number v-model:value="state.layerTrans" class="slider-input-number" :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="0" :max="1" placeholder="" size="small" />
        </div>
      </div>

      <!-- 水面风格 -->
      <div class="row-item" v-show="hasWaterParameter">
        <span>{{ $t("waterEffect") }}</span>
        <div style="width: 1.96rem">
          <n-switch v-model:value="state.showWater" size="small" />
        </div>
      </div>
      <WaterStyle v-if="state.showWater" :selectS3MLayerName="selectS3MLayerName"></WaterStyle>

      <!-- 图层后处理 -->
      <div class="row-item">
        <span>{{ $t("colorAdjust") }}</span>
        <div style="width: 1.96rem">
          <n-switch v-model:value="state.showPost" size="small" />
        </div>
      </div>
      <PostStyle v-if="state.showPost" :selectS3MLayerName="selectS3MLayerName"></PostStyle>

      <div class="row-item">
          <div>{{ $t("setMaterial") }}</div>
          <div>
            <n-input-group>
              <n-input style="width: 1.4rem" :placeholder="$t('localFilePathJson')"
                v-model:value="state.fileSrc" />
              <n-button type="tertiary" @click="chooseFile" style="width: 0.6rem">{{ $t("import") }}</n-button>
            </n-input-group>
          </div>
      </div>


      <div class="btn-row-item" style="margin-left: 1.06rem;">
          <n-button :focusable="false" @click="reSetting">{{ $t("reset") }}</n-button>
      </div>
    </div>
  </n-scrollbar>
</template>


<script lang="ts" setup>
import { ref, watch, onMounted, reactive } from "vue";
import WaterStyle from "./coms/waterStyle.vue";
import PostStyle from "./coms/postStyle.vue";
import tool from "@/tools/tool";
import layerManagement from "@/tools/layerManagement";

const viewer = window.viewer;

type StateType = {
  s3mlayers: any; //当前存在的可选择s3m图层
  selectedColor: string; //选中色
  selectColorMode: number; //选中色模式
  bottomAltitude: number; // 底部高程
  LODScale: number; //LOD
  layerTrans: number; // 图层透明度
  showWater: boolean,
  showPost: boolean,
  pbrJsonUrl: string,
  selectedName:number //当前选择的s3m图层名称
  fillStyle: number; // 填充风格
  fillStyleMode: any;// 填充模式选项
  lineColor: string; //线颜色
  fillColor: string; //前景色
  lineWidth: number;// 线宽
  fileSrc: "", //文件地址
};

// 开启地下
const state = reactive<StateType>({
  s3mlayers: [],
  selectedColor: "rgba(250,196,65,1)", //选中色
  selectColorMode: 0, //选中色模式
  bottomAltitude: 0,
  LODScale: 1, //LOD
  layerTrans: 1,
  showWater: false,
  showPost: false,
  pbrJsonUrl: "./Resource/pbr/MaterialJson/M_Brick_Clay_Old_.json",
  selectedName:0,
  fillStyle: 2, //填充风格
  fillStyleMode: [
    { label: () => $t('fillMode'), value: 0 },
    { label: () => $t('wireframe'), value: 1 },
    { label: () => $t('fillBothMode'), value: 2 },
  ],
  lineColor: "rgba(56, 56, 56, 1)", //线颜色
  fillColor: "rgba(255, 255, 255, 1)", //前景色
  lineWidth: 2,
  fileSrc: "", //文件地址
})

const hasWaterParameter = ref(false);
const selectS3MLayerName = ref('');

let selectLayer: any = undefined;

function init() {
  state.s3mlayers = layerManagement.getS3MLayerList();
  const selectS3MName = window.iEarthBindData.CurrentS3MLayerName;
  if(!selectS3MName || selectS3MName == '') return;
  state.selectedName = selectS3MName; // 修改当前select选中项
  selectS3MLayerName.value = selectS3MName;

  selectLayer = viewer.scene.layers.find(selectS3MName);
  if(selectLayer){
    selectLayer.isChangedStyle = true; // 自定义属性,用于保存场景时获取指定图层的风格属性
    selectLayer.selectEnabled = true;
    hasWaterParameter.value = selectLayer.waterParameter ? true : false;
    updateStateValue(selectLayer);
    // selectLayer.selectedColor = SuperMap3D.Color.fromCssColorString(state.selectedColor);
    // selectLayer.selectColorType = SuperMap3D.SelectColorType.SILHOUETTE_EDGE;
    selectLayer.selectedColor = new SuperMap3D.Color(
      128/255*1.5 ,
      198/255*1.5 ,
      226/255*1.5  ,
      1
    );
  }
}

onMounted(() => {
  init();
});


// 切换图层
function handleSelectLayer(value) {
  if (value == '0') return;
  selectLayer = viewer.scene.layers.find(value);
  if(!selectLayer) return;
  selectLayer.isChangedStyle = true;
  selectS3MLayerName.value = value;
  hasWaterParameter.value = selectLayer.waterParameter ? true : false;
  updateStateValue(selectLayer);
}

// 基于当前选择的图层更新state
function updateStateValue(selectLayer){
  if(selectLayer && selectLayer instanceof SuperMap3D.S3MTilesLayer){
    state.fillStyle = selectLayer.style3D.fillStyle;
    state.lineWidth = selectLayer.style3D.lineWidth;
    state.selectColorMode = selectLayer.selectColorType;
    state.fillColor = tool.rgbaToCssString(selectLayer.style3D.fillForeColor) || "rgba(255, 255, 255, 1)";
    state.lineColor = tool.rgbaToCssString(selectLayer.style3D.lineColor) || "rgba(56, 56, 56, 1)";
    state.bottomAltitude = Number(selectLayer.style3D.bottomAltitude);
    state.layerTrans = Number(selectLayer.style3D.fillForeColor.alpha);
    state.LODScale = Number(selectLayer.lodRangeScale);
  }else{
    state.fillStyle = 2;
    state.lineWidth = 2;
    state.fillColor = "rgba(255, 255, 255, 1)";
    state.lineColor = "rgba(56, 56, 56, 1)";
    state.bottomAltitude = 0;
    state.layerTrans = 1;
    state.LODScale = 1;
  }
}

// 点击选择文件函数
function chooseFile() {
  readFileByCreateInput();
}

// 通过创建input来读取本地json文件
function readFileByCreateInput() {
  // 创建一个隐藏的input元素
  const input = document.createElement('input');
  input.type = 'file';
  input.style.display = 'none';
  input.accept = '.json'; // 过滤文件类型
  document.body.appendChild(input);

  input.addEventListener('change', function (event: any) {
    const file = event.target.files[0]; // 获取文件引用
    if (!file) { return; }
    const reader = new FileReader();

    reader.onload = function (e: any) {
      if(!e || !e.target) return;
      const jsonString = e.target.result;
      const PBRjson = JSON.parse(jsonString);
      console.log('打开PBRJSON:', PBRjson);
      if (PBRjson && selectLayer) {
        selectLayer.removePBRMaterial(); // 先清除之前的 
        selectLayer.setPBRMaterialFromJSON(PBRjson);

        // 将pbr（obj|url）绑定到图层上，以便保存时能够得到材质相关
        // 如果是obj，请使用jsonstring，不要直接用PBRjson的值内部会改变造成嵌套循环，导致JSON.stringify报错
        selectLayer.pbrJsonDataSave = jsonString; 
      }
    };
    
    reader.onerror = function (error) {
      console.error("File could not be read:", error);
    };
    reader.readAsText(file);
  });
  input.click();
}

// 重置
function reSetting(){
  if(selectLayer){
    // 通过watch监听修改
    state.selectedColor = "rgba(250,196,65,1)"; //选中色
    state.selectColorMode = 0; //选中色模式
    state.bottomAltitude = 0;
    state.LODScale = 1;//LOD
    state.layerTrans = 1;
    state.showWater = false;
    state.showPost = false;
    state.fillStyle =  2 //填充风格
    state.lineColor = "rgba(56, 56, 56, 1)"; //线颜色
    state.fillColor = "rgba(255, 255, 255, 1)"; //前景色
    state.lineWidth = 2;

    // 重置颜色校正后处理
    selectLayer.brightness = 1;
    selectLayer.contrast = 1;
    selectLayer.hue = 0;
    selectLayer.saturation = 1;
    selectLayer.gamma = 1;

    // 重置水面
    if(selectLayer.waterParameter){
      selectLayer.waterParameter.color = SuperMap3D.Color.fromCssColorString("rgba(66,126,120,1.0)");
      selectLayer.waterParameter.waveDirection = 0;
      selectLayer.waterParameter.waterbodySize = 0;
      selectLayer.waterParameter.waveStrength = 0;
    }

    // 删除PBR材质
    selectLayer.removePBRMaterial();

    // 重置时恢复S3M图层默认的选中效果,因为state.selectedColor有watch效果，所以这里做一下延迟
    setTimeout(() => {
      // selectLayer.selectColorType = SuperMap3D.SelectColorType.SILHOUETTE_EDGE; // 通过iPortal打开的已保存的场景设置选中效果
      selectLayer.selectedColor = new SuperMap3D.Color(
        128 / 255 * 1.5,
        198 / 255 * 1.5,
        226 / 255 * 1.5,
        1
      );
    }, 1000);
  }
}



watch(
  () => state.fillStyle,
  (val) => {
    if (selectLayer) {
      switch (val) {
        case 0:
          selectLayer.style3D.fillStyle = SuperMap3D.FillStyle.Fill;
          break;
        case 1:
          selectLayer.style3D.fillStyle = SuperMap3D.FillStyle.WireFrame;
          selectLayer.style3D.lineColor = SuperMap3D.Color.fromCssColorString(state.lineColor);
          break;
        case 2:
          selectLayer.style3D.fillStyle = SuperMap3D.FillStyle.Fill_And_WireFrame;
          selectLayer.style3D.lineColor = SuperMap3D.Color.fromCssColorString(state.lineColor);
          break;
        default:
          break;
      }
      // selectLayer.refresh();
    }
  }
);

watch(
  () => state.fillColor,
  (val) => {
    if (selectLayer)
      selectLayer.style3D.fillForeColor = SuperMap3D.Color.fromCssColorString(val);
  }
);

watch(
  () => state.lineColor,
  (val) => {
    if (selectLayer) {
      selectLayer.style3D.lineColor = SuperMap3D.Color.fromCssColorString(val);
    }
  }
);

watch(
  () => state.lineWidth,
  (val) => {
    if (selectLayer) {
      selectLayer.style3D.lineWidth = val;
    }
  }
);

watch(
  () => state.selectedColor,
  (val) => {
    if (selectLayer){
      selectLayer.selectedColor = SuperMap3D.Color.fromCssColorString(val);
    }
  }
);

watch(
  () => state.selectColorMode,
  (val) => {
    if (selectLayer){
      selectLayer.selectColorType = val;
    }
  }
);

watch(
  () => state.bottomAltitude,
  (val) => {
    if (selectLayer) {
      selectLayer.style3D.bottomAltitude = Number(val);
      // selectLayer.refresh();
    }
  }
);

watch(
  () => state.LODScale,
  (val) => {
    if (selectLayer){
      selectLayer.lodRangeScale = Number(val);
    }      
  }
);

watch(
  () => state.layerTrans,
  (val) => {
    if (selectLayer) {
      selectLayer.style3D.fillForeColor.alpha = Number(val);
    }
  }
);
</script>

<style lang="scss" scoped>
.n-radio-group {
  display: flex;
}

.n-radio .n-radio__label {
  padding-right: 0.1rem;
}
</style>
