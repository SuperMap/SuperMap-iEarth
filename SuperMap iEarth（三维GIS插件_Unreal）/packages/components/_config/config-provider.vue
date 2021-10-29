<template>
  <n-config-provider
    :locale="locale.NaiveLocale"
    :date-locale="locale.NaiveDateLocale"
    :theme="theme"
    style="height:100%"
  >
    <n-message-provider>
      <slot />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { watch, ref, inject } from "vue";
import { NConfigProvider, NMessageProvider } from "naive-ui";

let { locale, theme } = inject("storeData");
let { setLocale } = inject("storeActions");
const props = defineProps(["locale"]);
watch(
  () => props.locale,
  val => setLocale(val),
  { immediate: true }
);
</script>

