<template>
  <div
    class="itemBox"
    :marginbottom="props.marginbottom"
    :marginleft="props.marginleft"
  >
    <span class="lable" :lableWidth="props.lableWidth">
      <slot name="item-lable"></slot>
    </span>
    <div class="content" :contentWidth="props.contentWidth">
      <slot name="item-content"></slot>
      <div class="sliderBox" v-if="props.slotType === 'slider'">
        <slot name="item-content-slider"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps({
  lableWidth: {
    type: String,
    default: "1.2rem",
  },
  contentWidth: {
    type: String,
    default: "2.6rem",
  },
  marginbottom: {
    type: String,
    default: "0.15rem",
  },
  marginleft: {
    type: String,
    default: "0.15rem",
  },
  slotType: {
    type: String,
    default: "normal",
  },
  contentMarginLeft: {
    type: String,
    default: "0rem",
  },
});

let lableWidth = ref(props.lableWidth);
let contentWidth = ref(props.contentWidth);
let contentMarginLeft = ref(props.contentMarginLeft);
</script>

<style lang="scss" scoped>
.itemBox {
  display: flex;
  align-items: center;
  font-size: 0.12rem;

  .lable {
    justify-content: left;
    width: v-bind(lableWidth);
    font-size: $--SM--FontSize-Lable;
  }

  .content {
    justify-content: right;
    width: v-bind(contentWidth);
    margin-left: v-bind(contentMarginLeft);

    & > .sliderBox {
      @include setSliderBoxStyle();
      margin-left: 0.34rem;
    }
  }

  margin-bottom: v-bind(marginbottom);
  // margin-left: v-bind(marginleft);
}
</style>