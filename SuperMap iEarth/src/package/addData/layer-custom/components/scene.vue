<template>
  <div class="row-item">
    <span>地址</span>
    <n-input
      class="input-border"
      v-model:value="sceneUrl"
      type="text"
      style="width: 2.4rem"
      :placeholder="sceneUrlPlaceholder"
      :title="sceneUrl"
      @input="handleChange"
    />
  </div>

  <div style="margin-left: 0.74rem; margin-bottom: 0.1rem">
    <n-checkbox v-model:checked="token"> 添加token </n-checkbox>
    <n-input
      style="margin-top: 0.1rem; width: 2.4rem"
      v-if="token"
      v-model:value="sceneToken"
      type="text"
      placeholder="token..."
    />
  </div>

  <div class="btn-row-item" style="margin-left: 0.74rem">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="openScene"
      style="margin-right: 0.1rem"
      >确定</n-button
    >
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useMessage } from "naive-ui";
import layerManagement from "@/tools/layerManagement";
const widget = viewer.cesiumWidget;

const message = useMessage();

let sceneUrl = ref("");
let sceneUrlPlaceholder = "http://www.supermapol.com/realspace/services/3D-CBD-2/rest/realspace";
let sceneToken = ref("");
let token = ref(false);

// 校验URL
function handleChange() {
  // 检查地址是否正确 - 使用正则严格校验
  if (sceneUrl.value.indexOf("rest/realspace") != -1) {
    // message.success(langGlobal.urlCheckedsuccess);
  }

  //处理realspace带有/
  if (sceneUrl.value.slice(-14) === "rest/realspace") {
    let url = sceneUrl.value.split("rest/realspace")[0] + "rest/realspace";
    let scenesUrl = url + "/scenes.json";

    // console.log(`向${scenesUrl}发送请求，获取name`)

    // // 有跨域，之后看看
    // let sceneListPromise = window.axios.get(scenesUrl, {
    //     //需要cookie验证
    //     withCredentials: true
    // });

    // sceneListPromise.then((results:any) => {
    //     console.log("results.data:", results.data)
    // });
  }
}
function clear(){};
let promiseArray: any[] = [];
function openScene() {
  if (sceneUrl.value == null || sceneUrl.value == "") {
    // message.warning(langGlobal.urlIsNull);
    return;
  }

  //去引号
  if (sceneUrl.value.charAt(0) == '"' || sceneUrl.value.charAt(0) == "'") {
    let reg = /^['|"](.*)['|"]$/;
    sceneUrl.value = sceneUrl.value.replace(reg, "$1");
  }
  if (token.value) {
    SuperMap3D.Credential.CREDENTIAL = new SuperMap3D.Credential(
      sceneToken.value
    );
  }

  layerManagement.openScene(sceneUrl.value, "REALSPACE");

}


</script>
<style lang="scss" scoped>
.input-border {
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
</style>
