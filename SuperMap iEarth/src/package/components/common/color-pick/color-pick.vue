<template>
  <n-color-picker
    ref="colorPick"
    v-model:value="props.colorValue"
    class="color-pick"
    size="small"
    :actions="['confirm']"
    :render-label="
      () => {
        return '';
      }
    "
  />
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue";

let props = defineProps({
  colorValue: String,
  className: String,
});

watch(
  () => props.colorValue,
  (val) => {
    let cssSeleter = `.${props.className} .n-color-picker-trigger__fill div:nth-child(2)`;
    // console.log("cssSeleter:",cssSeleter);
    let el: any = document.querySelectorAll(cssSeleter)[0];
    if (el) el.style.backgroundImage = "none";
  }
);

onMounted(() => {
  // document
  //   .querySelectorAll(".n-color-picker-trigger__fill div:nth-child(2)")
  //   .forEach((el: any) => {
  //     el.style.backgroundImage =
  //       "linear-gradient(to right, rgb(255, 191, 112), rgb(52, 153, 229), rgb(1, 212, 219))";
  //   });
});
</script>

<style lang="scss" scoped>
.color-pick {
  height: 0.15rem;
  // width: 1.78rem;
}
</style>

