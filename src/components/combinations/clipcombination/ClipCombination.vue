<template>
  <div
    id="clipAnalysis"
    class="sm-panel"
    v-show="clipShow"
    v-drag
    data-attr="drag"
  >
    <div class="sm-content">
      <div class="sm-panel-header">
        <span
          :class="{ titleColor: boxShow }"
          class="title-clip-txt"
          @click="choose(0)"
          >{{ Resource.BoxClip }}</span
        >
        <span
          :class="{ titleColor: planeShow }"
          class="title-clip-txt"
          @click="choose(1)"
          >{{ Resource.PlaneClip }}</span
        >
        <span
          :class="{ titleColor: crossShow }"
          class="title-clip-txt"
          @click="choose(2)"
          >{{ Resource.CrossClip }}</span
        >
        <span
          :class="{ titleColor: polygonShow }"
          class="title-clip-txt"
          @click="choose(3)"
          >{{ Resource.PolygonClip }}</span
        >
        <span class="closeBtn" @click="toggleVisibility">&times;</span>
      </div>

      <!-- 调用子组件 -->
      <sm3d-clip-box-byeditor></sm3d-clip-box-byeditor>
      <sm3d-clip-plane></sm3d-clip-plane>
      <sm3d-clip-cross></sm3d-clip-cross>
      <sm3d-clip-polygon></sm3d-clip-polygon>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClipAnalysis",
  props: {},
  data() {
    return {
      sharedState: store.state,
    };
  },

  computed: {
    boxShow: function () {
      return this.sharedState.clip[0];
    },
    planeShow: function () {
      return this.sharedState.clip[1];
    },
    crossShow: function () {
      return this.sharedState.clip[2];
    },
    polygonShow: function () {
      return this.sharedState.clip[3];
    },
    clipShow: function () {
      return this.sharedState.toolBar[4];
    },
    zIndex() {
      return this.sharedState.zindex;
    },
  },

  methods: {
    toggleVisibility() {
      //控制组件界面显隐
      store.setToolBarAction(4);
    },
    choose(i) {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      let isClick = document
        .getElementById("clipAnalysis")
        .getAttribute("data-flag");
      if (isClick !== "true") {
        return false;
      }
      switch (i) {
        case 0:
          store.setClipAction([1, 0, 0, 0]);
          break;
        case 1:
          store.setClipAction([0, 1, 0, 0]);
          break;
        case 2:
          store.setClipAction([0, 0, 1, 0]);
          break;
        case 3:
          store.setClipAction([0, 0, 0, 1]);
          break;
        default:
          store.setClipAction([1, 0, 0, 0]);
      }
    },
  },
  watch: {
    clipShow(val) {
      if (val) {
        let arr = this.sharedState.toolBar.filter((v) => {
          return v > 0 || v == true;
        });
        let dom = document.getElementById("clipAnalysis");
        let t = window.getComputedStyle(dom).top || dom.offsetTop;
        let i = this.zIndex + 1;
        dom.style.zIndex = i;
        store.setZindex(i);
        if (arr.length > 0 && t == "100px") {
          let top = 100 + 40 * (arr.length - 1) + "px";
          dom.style.top = top;
        }
      }
    },
  },
};
</script>
<style lang="scss"  scoped>
  @import "ClipCombination";
</style>
