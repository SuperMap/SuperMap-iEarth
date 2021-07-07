<template>
  <div
    id="SceneAtttribute"
    class="sm-panel"
    v-show="SceneAtttributeShow"
    v-drag
    data-attr="drag"
  >
    <div class="sm-content">
      <div class="sm-panel-header">
        <span
          :class="{ titleColor: basicOptions }"
          class="title-txt"
          @click="choose(0)"
          >{{ Resource.basicOptions }}</span
        >
        <span
          :class="{ titleColor: cameraShow }"
          class="title-txt"
          @click="choose(1)"
          >{{ Resource.camera }}</span
        >
        <span
          :class="{ titleColor: light }"
          class="title-txt"
          @click="choose(2)"
          >{{ Resource.light }}</span
        >
        <span
          :class="{ titleColor: ParticleSystem }"
          class="title-txt"
          @click="choose(3)"
          >{{ Resource.ParticleSystem }}</span
        >
        <span
          :class="{ titleColor: otherOptions }"
          class="title-txt"
          @click="choose(4)"
          >{{ Resource.otherOptions }}</span
        >
        <span class="closeBtn" @click="toggleVisibility">&times;</span>
      </div>

      <!-- 调用子组件 -->
      <scene-basic-options></scene-basic-options>
      <scene-camera></scene-camera>
      <scene-light></scene-light>
      <scene-particle-system></scene-particle-system>
      <scene-other-options></scene-other-options>
    </div>
  </div>
</template>

<script>
export default {
  name: "sceneAtttribute",
  data() {
    return {
      sharedState: store.state,
    };
  },

  computed: {
    basicOptions: function () {
      return this.sharedState.sceneAtttribute[0];
    },
    cameraShow: function () {
      return this.sharedState.sceneAtttribute[1];
    },
    light: function () {
      return this.sharedState.sceneAtttribute[2];
    },
    ParticleSystem: function () {
      return this.sharedState.sceneAtttribute[3];
    },
    otherOptions: function () {
      return this.sharedState.sceneAtttribute[4];
    },
    SceneAtttributeShow: function () {
      return this.sharedState.toolBar[3];
    },
    zIndex() {
      return this.sharedState.zindex;
    },
  },
  mounted() {
    // this.init();
  },
  methods: {
    toggleVisibility() {
      //控制组件界面隐
      store.setToolBarAction(3);
    },
    choose(i) {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      let isClick = document
        .getElementById("SceneAtttribute")
        .getAttribute("data-flag");
      if (isClick !== "true") {
        return false;
      }
      switch (i) {
        case 0:
          store.setSceneAtttribute([1, 0, 0, 0, 0]);
          break;
        case 1:
          store.setSceneAtttribute([0, 1, 0, 0, 0]);
          break;
        case 2:
          store.setSceneAtttribute([0, 0, 1, 0, 0]);
          break;
        case 3:
          store.setSceneAtttribute([0, 0, 0, 1, 0]);
          break;
        case 4:
          store.setSceneAtttribute([0, 0, 0, 0, 1]);
          break;
        default:
          store.setSceneAtttribute([1, 0, 0, 0, 0]);
      }
    },
  },
  watch: {
    SceneAtttributeShow(val) {
      if (val) {
        let arr = this.sharedState.toolBar.filter((v) => {
          return v > 0 || v == true;
        });
        let dom = document.getElementById("SceneAtttribute");
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

