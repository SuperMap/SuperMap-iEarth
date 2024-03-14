<template>
  <!-- 公共服务 -->
  <n-scrollbar style="max-height: 3.42rem">
    <div class="addData-data-container">
      <div
        v-for="(item, index) in publicServiceList"
        class="ItemBox"
        :class="item.chooseType ? 'isSelect' : ''"
        :key="index"
        @click="addPublicService(item)"
      >
        <div class="img-box">
          <img class="img" :src="item.thumbnail" alt="" />
        </div>
        <div class="img-box-text">{{ $t(item.name) }}</div>
      </div>
    </div>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { useMessage } from "naive-ui";
import { useLayerStore } from "@/store/layerStore/layer";
import { usePanelStore } from "@/store";
import layerManagement from "@/tools/layerManagement";

// 弹窗提示
const message = useMessage();
const layerStore = useLayerStore();
const panelStore = usePanelStore();
const publicServiceList = layerStore.layerServiceData.publicServiceList;

// 添加公共服务：三类
function addPublicService(item: any) {
  if (item.chooseType) {
    message.warning($t("repeatAddTip"));
    return;
  }

  layerStore.SelectedOptions.publicService.push(item.name); // 存入已选择的公共服务选项
  let type = item.type;
  switch (type) {
    case "REALSPACE":
      layerManagement.openScene(item.proxiedUrl, "REALSPACE", item.name);
      item.chooseType = true;
      break;
    case "MVT":
      layerManagement.addMvtLayer(
        item.proxiedUrl,
        item.VectorTilesMapName,
        "MVT"
      );
      item.chooseType = true;
      break;
    case "ThematicMap":
      layerManagement.addBaiMo(item.proxiedUrl, item.name, "ThematicMap");
      item.chooseType = true;
      break;
  }
  panelStore.closeRightToolPanel(1); // 1为关闭左侧面板
}
</script>

<style lang="scss" scoped>
.img-box-text {
  text-align: center;
  font-size: 0.14rem;
}
</style>
