<template>
  <div id="profile3D_echarts"
       v-stopdrag
       class="profile3D_echarts"
       style="position:absolute;right:390px;"
       v-show="isInitEcharts"
  ></div>
</template>

<script>
export default {
  name:"initEcharts",
  data() {
    return {
      sharedState: store.state
    };
  },
  directives:{
    stopdrag:{
      inserted:function(el,binding){
        let element = el;
        element.onmousedown = function(e){
          e.stopPropagation();
        }
      }
    }
  },
  computed: {
    isInitEcharts: function () {
      return this.sharedState.isInitEcharts;
    },
  }
};
</script>
<style lang="scss"  scoped>
@import "initEcharts";
</style>
