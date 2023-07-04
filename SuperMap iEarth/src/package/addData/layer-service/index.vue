<template>
  <!-- 公共服务 -->
  <div class="layer-server-container">
    <div
      v-for="(item, index) in layerStore.layerServiceData.publicServiceList"
      class="ItemBox"
      :class="item.chooseType ? 'isSelect' : ''"
      :key="index"
      @click="addPublicService(item)"
    >
      <div class="img-box">
        <img class="img" :src="item.thumbnail" alt="" />
      </div>
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from "naive-ui";
import { useLayerStore } from "@/store/layerStore";
import layerManagement from "@/tools/layerManagement";

// 弹窗提示
const message = useMessage();
const layerStore = useLayerStore();

// 添加公共服务：三类
function addPublicService(item: any) {
  if (item.chooseType) {
    message.warning("请勿重复添加！");
    return;
  }

  console.log("item:",item);
  layerStore.SelectedOptions.publicService.push(item.name); // 存入已选择的公共服务选项
  let type = item.type;
  switch (type) {
    case "REALSPACE":
      layerManagement.openScene(item.proxiedUrl, "REALSPACE");
      item.chooseType = true;
      break;
    case "MVT":
      layerManagement.addMvtLayer(item.proxiedUrl, item.VectorTilesMapName, "MVT");
      item.chooseType = true;
      break;
    case "ThematicMap":
      layerManagement.addBaiMo(item.proxiedUrl, item.name, "ThematicMap");
      item.chooseType = true;
      break;
  }
}

</script>

<style lang="scss" scoped>
.layer-server-container {
  display: flex;
  flex-wrap: wrap;
  // @include panelContainer(100%, 3.8rem);

  .ItemBox {
    width: 30%;
    color: $--SM--FontColor-Sub;
    // font-size: $--SM--FontSize-Text;
    // margin-bottom: 0.07rem;
    // margin-right: 0.16rem;
    margin-bottom: 0.07rem;
    margin-right: 0.12rem;
    box-sizing: border-box;
    cursor: pointer;

    .img-box {
      width: 100%;
      height: 0.84rem;
      border-radius: 0.05rem;
      overflow: hidden;
      margin-bottom: 0.04rem;
      .img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .ItemBox:nth-child(3n) {
    margin-right: 0;
  }
  .isSelect {
    color: #3499e5;
    .img-box {
      border: 0.02rem solid #3499e5;
    }
  }
}
</style>