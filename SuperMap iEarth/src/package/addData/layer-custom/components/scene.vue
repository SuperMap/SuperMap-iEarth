<template>
  <div class="row-item">
    <span>{{ $t("address") }}</span>
    <n-tooltip placement="top-end" trigger="hover">
      <template #trigger>
        <n-input
          class="add-input-border"
          v-model:value="sceneUrl"
          type="text"
          style="width: 2.4rem"
          :title="sceneUrl"
          @input="handleChange"
        />
      </template>
      {{ urlTip }}
    </n-tooltip>
  </div>

  <div style="margin-left: 0.95rem; margin-bottom: 0.1rem">
    <n-checkbox v-model:checked="token"> {{ $t("addToken") }} </n-checkbox>
    <n-input
      style="margin-top: 0.1rem; width: 2.4rem"
      v-if="token"
      v-model:value="sceneToken"
      type="text"
      placeholder="token..."
    />
  </div>

  <div class="btn-row-item" style="margin-left: 0.95rem">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      class="ans-btn"
      @click="openScene"
      >{{ $t("sure") }}</n-button
    >
    <n-button
      class="btn-secondary"
      @click="clear"
      color="rgba(255, 255, 255, 0.65)"
      ghost
      >{{ $t("clear") }}</n-button
    >
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useMessage } from "naive-ui";
import layerManagement from "@/tools/layerManagement";

const message = useMessage();

let urlTip =
  "http://<server>:<port>/realspace/services/<component>/rest/realspace";
let sceneUrl = ref("");
let sceneToken = ref("");
let token = ref(false);

// 校验URL
function handleChange() {
  // 检查地址是否正确 - 使用正则严格校验
  if (sceneUrl.value.indexOf("rest/realspace") != -1) {
    message.success($t("urlCheckedsuccess"));
  }

  //处理realspace带有/
  // if (sceneUrl.value.slice(-14) === "rest/realspace") {
  //   let url = sceneUrl.value.split("rest/realspace")[0] + "rest/realspace";
  // }
}

// 打开场景服务
function openScene() {
  if (sceneUrl.value == null || sceneUrl.value == "") {
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

  let promiseResult = layerManagement.openScene(
    sceneUrl.value,
    "",
    "REALSPACE"
  );
  SuperMap3D.when(promiseResult, function (layers: any) {
    message.success($t("openSceneSuccess"));
  });
}

// 清除
function clear() {
  sceneUrl.value = "";
  sceneToken.value = "";
  token.value = false;
}
</script>
