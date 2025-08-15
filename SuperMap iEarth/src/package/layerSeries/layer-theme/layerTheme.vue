<template>
  <n-scrollbar style="max-height: 5rem">
    <div class="right-panel-container-not-tabs">
      <div class="theme-box" v-for="(item, index) in state.conditionList" :key="index">
        <div class="condition-box">
          <div class="base-condition-box">
            <n-color-picker v-model:value="item.color" style="width: 8%;" :render-label="() => { return ''; } "
              size="small"></n-color-picker>
            <n-select style="width: 30%" v-model:value="item.themeField" :disabled="index!=0"
              @update:value="handleSelectField" :placeholder="$t('field')" :title="item.themeField"
              :options="state.themeFieldOption" />
            <n-select style="width: 30%" v-model:value="item.operation" :options="operatorTypeOption"
              :placeholder="$t('operator')" :title="$t('operator')" />
            <n-input style="width: 25%" v-model:value="item.value" type="text" placeholder=""
              :title="item.value" />
            <i class="iconfont iconSize icontianjia" :title="$t('addChildCondition')"
              @click="addChildCondition(item)"></i>
          </div>

          <div class="child-condition-box" v-for="(child, child_index) in item.children" :key="child_index">
            <n-select style="width: 30%;margin-left: 8%;" v-model:value="child.linkType" :options="linkTypeOption"
              :title="child.linkType" />
            <n-select style="width: 30%" v-model:value="child.operation" :options="operatorTypeOption"
              :placeholder="$t('operator')" :title="$t('operator')" />
            <n-input style="width: 25%" v-model:value="child.value" type="text" placeholder=""
              :title="child.value" />
            <i class="iconfont iconSize iconyichu" :title="$t('removeChildCondition')"
              @click="removeChildCondition(item, child_index)"></i>
          </div>
        </div>

        <div class="condition-btn" style="margin: auto;">
          <i v-if="index===0" class="iconfont iconSize icontianjia" :title="$t('addCondition')"
            @click="addCondition(item)"></i>
          <i v-else class="iconfont iconSize iconyichu" :title="$t('removeCondition')"
            @click="removeCondition(item, index)"></i>
        </div>
      </div>

      <div class="row-btns">
        <n-button @click="setTheme" class="operate" type="info" :focusable="false">{{
        $t("add") }}</n-button>
        <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
      </div>
    </div>
  </n-scrollbar>
</template>


<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";

// 开启地下
const state = reactive<any>({
  themeFieldOption: [],
  conditionList: [{
    color: "rgba(102, 204, 255, 1)",
    themeField: null,
    operation: null,
    value: "",
    children: []
  }],
})

const linkTypeOption = ref([
  {
    label: () => "Or",
    value: "||",
  },
  {
    label: () => "And",
    value: "&&",
  },
])

const operatorTypeOption = ref([
  {
    label: () => "<",
    value: "<",
  },
  {
    label: () => "<=",
    value: "<=",
  },
  {
    label: () => "==",
    value: "===",
  },
  {
    label: () => ">",
    value: ">",
  },
  {
    label: () => ">=",
    value: ">=",
  },
])

let selectLayer: any = undefined;

async function init() {
  const s3mLayerName = window.iEarthBindData.CurrentS3MLayerName;;
  if (!s3mLayerName || s3mLayerName == '') return;
  selectLayer = viewer.scene.layers.find(s3mLayerName);

  // 获取字段选项
  const atttributeUrl = getS3MLayerAttributeJsonUrl(selectLayer);
  if (!atttributeUrl || !atttributeUrl.includes("attribute.json")) return;
  const data = await window.axios.get(atttributeUrl);
  if (data && data.data && data.data.layerInfos) {
    const fieldInfos = data.data.layerInfos[0].fieldInfos;
    fieldInfos.forEach(item => {
      const obj = {
        label: item.alias ?? item.name,
        value: item.name,
        type: item.type,
      };
      state.themeFieldOption.push(obj);
    });
  }
}

onMounted(() => {
  init();
  changePanleWidth(true);
});

onBeforeUnmount(() => {
  changePanleWidth(false);
})

// 修改面板，专题图渲染面板元素太多不然放不下
function changePanleWidth(isChange) {
  const panleContainer: any = document.querySelector(".right-panel");
  const headerContainer: any = document.querySelector(".panle-header-right");
  const contentContainer: any = document.querySelector(".panle-container-right");
  const footerContainer: any = document.querySelector(".panle-footer-right");

  if (isChange) { // 修改面板
    panleContainer.style.right = "1.1rem";
    headerContainer.style.width = "4.0rem";
    contentContainer.style.width = "4.0rem";
    headerContainer.style.width = "4.0rem";
    footerContainer.style.width = "4.0rem";
  } else { // 还原面板
    panleContainer.style.right = "0.45rem";
    headerContainer.style.width = "3.36rem";
    contentContainer.style.width = "3.36rem";
    headerContainer.style.width = "3.36rem";
    footerContainer.style.width = "3.36rem";
  }
}

function getS3MLayerAttributeJsonUrl(s3mLayer) {
  const baseUri = s3mLayer._baseUri;
  if (!baseUri) return;

  let layerUrl = baseUri.scheme + "://" + baseUri.authority + baseUri.path;
  if (baseUri._string) layerUrl = baseUri._string;
  if (layerUrl && !layerUrl.includes('/realspace')) return;
  const atttributeUrl = layerUrl + "attribute.json";
  return atttributeUrl;
}


function randomRGBA() {
  const r = Math.floor(Math.random() * 256); // 0-255
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  // const a = Math.random().toFixed(2);         // 0.00-1.00
  return `rgba(${r},${g},${b},1)`;
}

// 清除图层主题样式
function clearThemeStyle(selectLayer) {
  selectLayer.themeStyle = new SuperMap3D.Cesium3DTileStyle({
    color: {
      conditions: [['true', 'rgb(255,255,255)']]
    }
  });
}

const addChildCondition = function (item) {
  item.children.push({
    linkType: '&&',
    operation: null,
    value: ""
  })
}

const removeChildCondition = function (item, index) {
  item.children.splice(index, 1)
}


const addCondition = function (item) {
  const themeField = item.themeField;
  const conditionList = state.conditionList;
  conditionList.push({
    color: randomRGBA(),
    themeField: themeField, // 限制只能操作一个字段做专题图
    operation: "",
    value: "",
    children: []
  })
}

const removeCondition = function (item, index) {
  state.conditionList.splice(index, 1)
}

// 限制只能操作一个字段做专题图 
// TODO:后续支持多个
const handleSelectField = function (val) {
  const conditionList = state.conditionList;
  conditionList.forEach(condition => {
    condition.themeField = val;
  });
}

const setTheme = function () {
  const conditionList = state.conditionList;
  console.log("原始条件对象数组:", conditionList);
  if (!conditionList || conditionList.length == 0) return;

  // 设置图层样式前先清除之前设置过的
  clearThemeStyle(selectLayer);

  const conditionListForTheme: any = [];
  const themeFieldList: any = [];
  conditionList.forEach(condition => {
    const themeField = condition.themeField;
    if (!themeFieldList.includes(themeField)) themeFieldList.push(themeField);
    const themeFieldString = "${" + themeField + "}";
    let condition_express = "";
    if (condition.children.length == 0) { // 单个条件
      condition_express = `${themeFieldString} ${condition.operation} "${condition.value}"`;
    } else if (condition.children.length > 0) { // 复合条件
      condition_express = `${themeFieldString} ${condition.operation} "${condition.value}"`;
      condition.children.forEach(childCondition => {
        let child_express = `${childCondition.linkType} ${themeFieldString} ${childCondition.operation} "${childCondition.value}"`;
        condition_express += child_express;
      });
    }

    const condition_color = condition.color;
    conditionListForTheme.push([condition_express, condition_color]);
  });

  console.log("生成的表达式数组:", conditionListForTheme);
  if (themeFieldList.length == 0) return;

  selectLayer.queryFieldNames = themeFieldList;
  selectLayer.themeStyle = new SuperMap3D.Cesium3DTileStyle({
    color: {
      conditions: conditionListForTheme
    }
  });
}

const clear = function () {
  clearThemeStyle(selectLayer);
  state.conditionList = [{
    color: "rgba(102, 204, 255, 1)",
    themeField: null,
    operation: null,
    value: "",
    children: []
  }];
}
</script>

<style lang="scss" scoped>
.theme-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 0.1rem;
  padding: 2px;

  .condition-box {
    width: 90%;
    border: 1px solid rgba(255, 255, 255, 0.15);

    .base-condition-box {
      display: flex;
      justify-content: space-between;
      padding: 0.05rem;
      padding-top: 0.08rem;

      div {
        padding: 0px 3px;
      }
    }

    .child-condition-box {
      display: flex;
      justify-content: space-between;
      padding: 0.05rem;
      padding-top: 0.08rem;

      div {
        padding: 0px 3px;
      }
    }

    .condition-btn {
      margin: auto;
    }
  }
}
</style>