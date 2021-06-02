<template>
  <div id="3DAnalysis" class="sm-panel" v-show="analysisShow" v-drag>
    <div class="sm-content">
      <div class="sm-panel-header">
        <span
          :class="{ titleColor: sightlineShow }"
          class="title-txt"
          @click="choose(0)"
          >{{ Resource.sightline }}</span
        >
        <span
          :class="{ titleColor: viewshedShow }"
          class="title-txt"
          @click="choose(1)"
          >{{ Resource.viewShed }}</span
        >
        <span
          :class="{ titleColor: shadowqueryShow }"
          class="title-txt"
          @click="choose(2)"
          >{{ Resource.shadowAnalysis }}</span
        >
        <span
          :class="{ titleColor: profileShow }"
          class="title-txt"
          @click="choose(3)"
          >{{ Resource.profile }}</span
        >
        <span
          :class="{ titleColor: skylineShow }"
          class="title-txt"
          @click="choose(4)"
          >{{ Resource.skyline }}</span
        >
        <span class="closeBtn" @click="toggleVisibility">&times;</span>
      </div>
      <!-- 调用子组件 -->
      <sm3d-sightline></sm3d-sightline>
      <sm3d-viewshed :spatial-analysis-url="spatialAnalysisUrl"></sm3d-viewshed>
      <sm3d-shadowquery></sm3d-shadowquery>
      <sm3d-profile></sm3d-profile>
      <sm3d-skyline></sm3d-skyline>

    </div>
  </div>
</template>

<script>
export default {
  name: "Sm3dAnalysis",
  props: {},
  data() {
    return {
      sharedState: store.state,
      spatialAnalysisUrl:
        "https://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/viewshedbody.json",
    };
  },

  computed: {
    sightlineShow: function () {
      return this.sharedState.analysis[0];
    },
    viewshedShow: function () {
      return this.sharedState.analysis[1];
    },
    shadowqueryShow: function () {
      return this.sharedState.analysis[2];
    },
    profileShow: function () {
      return this.sharedState.analysis[3];
    },
    skylineShow: function () {
      return this.sharedState.analysis[4];
    },
    analysisShow: function () {
      return this.sharedState.toolBar[6];
    },
    zIndex() {
      return this.sharedState.zindex;
    },
  },

  methods: {
    toggleVisibility() {
      //控制组件界面显隐
      store.setToolBarAction(6);
    },
    choose(i) {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      let isClick = document
        .getElementById("3DAnalysis")
        .getAttribute("data-flag");
      if (isClick !== "true") {
        return false;
      }
      switch (i) {
        case 0:
          store.setAnalysisAction([1, 0, 0, 0, 0]);
          break;
        case 1:
          store.setAnalysisAction([0, 1, 0, 0, 0]);
          break;
        case 2:
          store.setAnalysisAction([0, 0, 1, 0, 0]);
          break;
        case 3:
          store.setAnalysisAction([0, 0, 0, 1, 0]);
          break;
        default:
          store.setAnalysisAction([0, 0, 0, 0, 1]);
      }
    },
  },
  watch: {
    analysisShow(val) {
      if (val) {
        let arr = this.sharedState.toolBar.filter((v) => {
          return v > 0 || v == true;
        });
        let dom = document.getElementById("3DAnalysis");
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

