<template>
  <div class="userinfoBox" v-show="isEnviPortal">
    <i class="iconfont iconuser"></i>
    <div @click="toUserInfoPage" v-if="IportalStore.isLogin">
      <span class="userbox"> {{ UserName }} </span>
    </div>
    <n-tooltip v-else>
      <template #trigger>
        <n-button :bordered="false" tag="div" @click="showLoginBox">
          {{
            IportalStore.userInfo.userName === "GUEST"
              ? $t("tourists")
              : IportalStore.userInfo.userName
          }}
        </n-button>
      </template>
      {{ $t("loginPlease") }}
    </n-tooltip>
  </div>
</template>

<script lang="ts" setup>
import Authenticate from "@ispeco/authentication-sdk"; // 超图iportal第三方库
import { computed } from "vue";
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { getRootUrl } from "@/tools/iportal/portalTools";

const IportalStore = IportalStoreCreate();

// 登录页面
function showLoginBox() {
  const authInstance = new Authenticate({
    loginOptions: {
      theme: "dark",
      appName: "iEarth",
      // logoUrl: ('./logo.png'),
      // rootUrl: "/iportal/", // 正确的地址
    },
    onSucceed: function (result: any) {
      if (window.iEarthConsole) console.log("用户信息", result);
      const { data } = result;
      if (data && data.success && data.user) {
        IportalStore.isLogin = true;
        IportalStore.userInfo.userName = data.user.name;
        IportalStore.userInfo.nickName = data.user.nickname;
        window["$message"].success("登录成功");
      }
    },
    onFailed: function (err) {
      console.log("err------>", err);
    },
    onCanceled: function (err) {
      console.log("err------>", err);
    },
  });
  authInstance.create();
}
// 用户信息
function toUserInfoPage() {
  let myAccountUrl = getRootUrl() + "web-ui/my-account/account";
  window.open(myAccountUrl);
}

// 有昵称优先使用昵称，没有再使用用户名
let UserName = computed(() => {
  if (IportalStore.userInfo.nickName && IportalStore.userInfo.nickName != "") {
    return IportalStore.userInfo.nickName;
  } else {
    let userName = IportalStore.userInfo.userName;
    if (userName == "GUEST") {
      return $t("tourists");
    } else {
      return userName;
    }
  }
});

const isEnviPortal = computed(() => {
  return window.iEarthBindData.EnvironmentMode != 'Normal';
});
</script>
<style lang="scss" scoped>
.userinfoBox {
  width: auto;
  height: 0.4rem;
  line-height: 0.4rem;
  display: flex;
  justify-content: end;

  .iconfont {
    margin-right: 0.1rem;
    font-size: 0.18rem;
  }

  .userbox {
    font-size: 0.15rem;
  }
}
</style>
