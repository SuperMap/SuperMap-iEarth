<template>
  <div id="right-toolbar" class="right-toolbar">
    <n-card content-style="padding:0px;">
      <n-space>
        <n-dropdown trigger="hover" @select="handleSelect1" :options="state.options1">
          <n-button>{{resource.language}}</n-button>
        </n-dropdown>
        <n-dropdown trigger="hover" @select="handleSelect2" :options="state.options2">
          <n-button>{{resource.theme}}</n-button>
        </n-dropdown>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, inject, reactive } from "vue";
import locales from "@/js/locales/index.js";
import { enUS, darkTheme } from "vue-gis-ge";

let { resource } = inject("state");
let { setLocale, setTheme } = inject("storeActions");

let state = reactive({
  options1: [
    {
      label: () => resource.value.chinese,
      key: "zh"
    },
    {
      label: () => resource.value.english,
      key: "en"
    }
  ],
  options2: [
    {
      label: () => resource.value.light,
      key: "light"
    },
    {
      label: () => resource.value.dark,
      key: "dark"
    }
  ]
});

function handleSelect1(key) {
  changeResource(key);
}

function handleSelect2(key) {
  changeTheme(key);
}

// 语言设置（设置组件库语言，<sm-config-provider>包裹后只需要调用setLocale方法）
function changeResource(type) {
  if (locales[type]) resource.value = locales[type]; //iearth语言设置
  if (type === "zh") setLocale(null);  // 组件库默认为中文
  else if (type === "en") setLocale(enUS);
}

//主题设置，默认null为light浅色
function changeTheme(type) {
  if (type === "light") setTheme(null);
  if (type === "dark") setTheme(darkTheme);
}
</script>

<style lang="scss" scoped>
.right-toolbar {
  width: auto;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 999;
}
</style>