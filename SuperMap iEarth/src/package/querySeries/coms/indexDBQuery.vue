<!-- 属性查询 -->
<template>
  <div class="row-wrap">
    <div class="content">
      <div class="switch-box">
        <div class="text">{{ $t("openIndexDBQuery") }}</div>
        <n-switch v-model:value="state.useDBQuery" size="small" />
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, reactive, watch } from "vue";
import CustomBubble from "@/lib/CustomBubble";

const state = reactive({
  useDBQuery: false
})

const viewer = window.viewer;
const customBubble = new CustomBubble(viewer, {
  bubbleFields: window.iEarthBindData.bubbleFields
});
customBubble.start();

let handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);

onMounted(() => { })

onBeforeUnmount(() => {
  customBubble.destroy();
  handler.destroy();
});

// 开启属性查询
function startDBQuery() {
  handler.setInputAction(updateScenePosition, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

// 基于当前点击位置计算弹窗position
async function updateScenePosition(e: any) {
  // 执行DB查询并计算弹窗table-data
  await viewer.scene.pickAsync(e.position);
  const layer = viewer.scene.layers.getSelectedLayer();
  if (layer) {
    const ids = layer.getSelection();
    console.log('DB当前查询ID:', ids);
    layer.getAttributesById(ids).then(function (data) {
      console.log("DB属性查询结果:", data); // 根据SMID查询对象属性，取data.UniqueID
      if (data) {
        let rowsContent: any = [];
        for (let key in data) {
          let value = String(data[key]);
          if (value.includes(".")) {
            let value_num = Number(value);
            if (!isNaN(value_num)) {
              value = value_num.toFixed(2);
            }
          }
          let array = [key, value];
          rowsContent.push(array);
        }

        customBubble.open({
          title: `${$t("bubble_entityID")}:${ids[0]}`,
          content: [
            {
              type: 'table', data: {
                headers: [$t("bubble_field"), $t("bubble_value")],
                rows: rowsContent
              }
            }
          ]
        });
      } else {
        customBubble.hidden();
        window["$message"].success($t("noData"));
      }
    })
  } else {
    customBubble.hidden();
    window["$message"].success($t("noData"));
  }
}

// 清除关闭监听事件
function clearHandler() {
  window["$message"].success($t('closeDBtip'));
  customBubble.hidden();
  handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}


watch(
  () => state.useDBQuery,
  (val) => {
    if (val) {
      window["$message"].success($t('openDBTip'));
      startDBQuery(); // 隐藏面板，开启DB属性查询
    } else {
      clearHandler();
    }
  }
);
</script>
  