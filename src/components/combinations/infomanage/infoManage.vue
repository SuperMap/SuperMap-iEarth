<template>
  <div class="infoManage" v-show="infoManageShow">
      <div id="infoManageLogin"
           class="infoManageLogin"
           style="display:block"
           @click="show"
           :title="Resource.login">
        <span class="iconfont icondenglu infoManagetb"></span>
      </div>
  </div>
</template>

<script>
import {showLoginBox} from "../../../common/js/request";
export default {
  name: "infoManage",
  data() {
    return {
      sharedState: store.state,
    };
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
    infoManageShow: function () {
      return this.sharedState.infoManage;
    }
  },
  methods: {
    show(){
      showLoginBox({
        authSucceed:this.loginSucceedCallback.bind(this),
        onFailed:this.loginFailedCallback.bind(this),
        onCanceled:this.cancel.bind(this)
      })
    },
    hide(){

    },
    loginSucceedCallback(result){
      const {data} = result;
      if(data && data.success && data.user){
        window.store.userInfo = data.user;
        this.$Message.success(Resource.loginSuccess);
        this.$emit('login-success');
      }else{
        this.loginFailedCallback(result);
      }
    },
    loginFailedCallback(result){
      const {data} = result;
      window.store.userInfo = data.user;
      this.$Message.error(Resource.loginFailed);
      this.$emit('login-failed',result);
    },
    cancel(source){
      if(source === 'user'){
        this.$emit('login-cancel',{error:false});
      }
    }
  }
};
</script>

<style lang="scss"  scoped>
@import "infoManage";
</style>

