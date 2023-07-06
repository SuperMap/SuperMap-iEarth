<template>  
  <div class="userinfoBox">
    <i class="iconfont iconuser"></i>
    <div v-if="IportalStore.isLogin" @click="toUserInfoPage">
    {{ IportalStore.userInfo.userName }}
  </div>
  <n-tooltip v-else>
    <template #trigger>
      <n-button @click="showLoginBox" :bordered="false" tag="div">{{
        IportalStore.userInfo.userName === '游客' ? "游客" : IportalStore.userInfo.userName
      }}</n-button>
    </template>
    请登录
  </n-tooltip>
  </div>
</template>

<script lang="ts" setup>

// import { ref } from "vue";
import Authenticate from "@ispeco/authentication-sdk"; // 超图iportal第三方库
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { getRootUrl } from "@/tools/iportal/portalTools";

// const modelShowInfo = ref(false);
// const modelShow = ref(false);

// // 是否失败
// const fallback = ref(false);
// // 用户名

// interface loginProps {
// data: {
//   user: {
//     name: string;
//     nickname: string;
//   };
//   reason: string;
//   success: string;
// };
// type: string;
// }

const IportalStore = IportalStoreCreate();

// 登录页面
function showLoginBox() {
// const { authSucceed, ...restOption } = option;
const authInstance = new Authenticate({
  loginOptions: {
    theme: "dark",
    // logoUrl: ('./logo.png'),
    appName: "iEarth",
    // rootUrl: "/iportal/", // 正确的地址
  },
  onSucceed: function (result: any){
    console.log("result-用户信息", result);
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
</script>

<style lang="scss" scoped>
.userinfoBox{
  // width: 1.3rem;
  display: flex;
  justify-content: space-between;

  margin-right: 0.06px;

  line-height: .38rem;
  align-items: center;
}

</style>
