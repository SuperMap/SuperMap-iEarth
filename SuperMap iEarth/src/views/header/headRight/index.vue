<template>
  <!-- 保存场景弹窗 -->
  <div @click="showSave">
    <svg-icon name="ui-header-save" class="headerSvgFontSize"/>
  </div>
  <!-- 设置 先保留 -->
  <!-- <div class="set"></div> -->
  <div class="divider"></div>
  <!-- 用户 -->
  <div class="user-info">
    <div class="user-icon">
      <svg-icon name="ui-header-user" class="headerSvgFontSize" />
    </div>
    <div class="username" @click="toUserInfoPage">
      {{ IportalStore.userInfo.userName }}
      <!-- admin -->
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref } from "vue";
import Authenticate from "@ispeco/authentication-sdk";
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { getRootUrl } from "@/tools/iportal/portalTools";
import { GlobalStoreCreate } from "@/store/global/global";
import { useLayerTreeStore } from "@/store/index";

const layerTreeStore = useLayerTreeStore();
const GlobalStore = GlobalStoreCreate();

// 用户名
const IportalStore = IportalStoreCreate();

// 登录页面
function showLoginBox() {
  // const { authSucceed, ...restOption } = option;
  const authInstance = new Authenticate({
    loginOptions: {
      theme: "dark",
      // logoUrl: ('./logo.png'),
      appName: "三维地球",
      rootUrl: "/iportal/", // 正确的地址
    },
    onSucceed: function (result: any) {
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
      // window["$message"].error(err.data.message);
    },
    onCanceled: function (err) {
      console.log("err------>", err);
      // window["$message"].error(err.data.message);
    },
  });
  authInstance.create();
}
// 用户信息
function toUserInfoPage() {
  let myAccountUrl = getRootUrl() + "web-ui/my-account/account";
  window.open(myAccountUrl);
}

// 打开保持按钮
function showSave() {
  layerTreeStore.setShowSaveDialog(true);
}
</script>
  
<style lang="scss" scoped>
.user-info {
  @include flexLayout(center);
  margin-left: 0.1rem;
  .username {
    font-size: 0.12rem;
    margin-left: 0.05rem;
    margin-right: 0.3rem;
  }
}
.divider {
  width: 0.01rem;
  height: 0.16rem;
  background: rgba(255, 255, 255, 0.15);
  margin-left: 0.2rem;
  margin-right: 0.05rem;
}

.headerSvgFontSize{
  font-size: 19px;
}
</style>
  