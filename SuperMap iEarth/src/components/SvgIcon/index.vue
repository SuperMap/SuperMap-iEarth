<template>
  <svg
    aria-hidden="true"
    class="svg-icon"
    :width="props.size"
    :height="props.size"
    color="#fff"
  >
    <use :xlink:href="symbolId" fill="red" />
  </svg>
</template>
  
  <script lang="ts" setup>
import { computed } from "vue";
const props = defineProps({
  prefix: {
    type: String,
    default: "icon",
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#fa0",
  },
  size: {
    type: String,
    default: "1em",
  }
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
  
  <style scoped lang="scss">
// /* 悬浮改变颜色 */
// svg:hover{
// 	fill: #fa0;
// }

</style>