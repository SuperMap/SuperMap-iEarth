<template>  
  <div class="userinfoBox" v-show="!GlobalStore.isNormalMode">
    <i class="iconfont iconuser"></i>
    <div v-if="IportalStore.isLogin" @click="toUserInfoPage">
    <span style="font-size: 0.15rem;"> {{ UserName }}</span>
  </div>
  <n-tooltip v-else>
    <template #trigger>
      <n-button @click="showLoginBox" :bordered="false" tag="div" style="font-size: 0.15rem;">{{
        IportalStore.userInfo.userName === 'GUEST' ? $t('global.tourists') : IportalStore.userInfo.userName
      }}</n-button>
    </template>
    {{$t('global.loginPlease')}}
  </n-tooltip>
  </div>
</template>

<script lang="ts" setup>

import { computed } from "vue";
import Authenticate from "@ispeco/authentication-sdk"; // 超图iportal第三方库
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { GlobalStoreCreate } from '@/store/global/global';
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
const GlobalStore = GlobalStoreCreate();


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
    console.log("用户信息", result);
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

// 有昵称优先使用昵称，没有再使用用户名
let UserName = computed(()=>{
  if(IportalStore.userInfo.nickName && IportalStore.userInfo.nickName != ""){
    return IportalStore.userInfo.nickName;
  }else{
    // return IportalStore.userInfo.userName;
    let userName = IportalStore.userInfo.userName;
    if(userName == 'GUEST'){
      return GlobalLang.tourists;
    }else{
      return userName;
    }

  }
})
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
