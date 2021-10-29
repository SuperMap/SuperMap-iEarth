<template>
  <div id="terrainAnalysis" class="sm-panel terrainAnalysis" v-show="terrainShow" v-drag>
    <label class="terrainTitle">{{Resource.terrain}}</label>
    <div style="margin-top:-2px;">
      <div class="sm-panel-header combinationHear">
        <span
          :class="{ titleColor: OperationShow }"
          class="title-txt"
          @click="choose(0)"
          >{{ Resource.TerrainOperation }}</span
        >
        <span
          :class="{ titleColor: floodShow }"
          class="title-txt"
          @click="choose(1)"
          >{{ Resource.FloodAnalysis }}</span
        >
        <span
          :class="{ titleColor: slopeShow }"
          class="title-txt"
          @click="choose(2)"
          >{{ Resource.terrainSlope }}</span
        >
        <span
          :class="{ titleColor: isolineShow }"
          class="title-txt"
          @click="choose(3)"
          >{{ Resource.isoline }}</span
        >
      </div>
      <!-- 调用子组件 -->
      <sm3d-terrain-operation></sm3d-terrain-operation>
      <sm3d-terrain-flood></sm3d-terrain-flood>
      <sm3d-terrain-slope></sm3d-terrain-slope>
      <sm3d-terrain-isoline></sm3d-terrain-isoline>
    </div>
    <span class="terrainBtn" @click="toggleVisibility">&times;</span>
  </div>
</template>

<script>
export default {
  name: "TerrainAnalysis",
  props: {},
  data() {
    return {
      sharedState: store.state,
    };
  },

  computed: {
    OperationShow: function () {
      return this.sharedState.terrain[0];
    },
    floodShow: function () {
      return this.sharedState.terrain[1];
    },
    slopeShow: function () {
      return this.sharedState.terrain[2];
    },
    isolineShow: function () {
      return this.sharedState.terrain[3];
    },
    terrainShow: function () {
      return this.sharedState.toolBar[5];
    },
    zIndex() {
      return this.sharedState.zindex;
    },
  },

  methods: {
    toggleVisibility() {
      //控制组件界面显隐
      store.setToolBarAction(5);
    },
    choose(i) {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      let isClick = document
        .getElementById("terrainAnalysis")
        .getAttribute("data-flag");
      if (isClick !== "true") {
        return false;
      }
      switch (i) {
        case 0:
          store.setTerrainAction([1, 0, 0, 0]);
          break;
        case 1:
          store.setTerrainAction([0, 1, 0, 0]);
          break;
        case 2:
          store.setTerrainAction([0, 0, 1, 0]);
          break;
        case 3:
          store.setTerrainAction([0, 0, 0, 1]);
          break;
        default:
          store.setTerrainAction([1, 0, 0, 0]);
      }
    },
  },
  watch: {
    terrainShow(val) {
      if (val) {
        let arr = this.sharedState.toolBar.filter((v) => {
          return v > 0 || v == true;
        });
        let dom = document.getElementById("terrainAnalysis");
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
<style lang="scss" scoped>
  @import "TerrainCombination";
</style>
