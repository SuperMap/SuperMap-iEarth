<template>
  <div class="modal" v-if="addLayerShow">
    <div class="addLayer-panel">
      <div class="sm-panel-header" style="position:relative">
        <div style="width:10px;"></div>
        <span
          :class="{titleColor:webServiceShow}"
          class="title-txt"
          @click="choose(0)"
        >{{Resource.publicService}}</span>
        <span
          :class="{titleColor:customServiceShow}"
          class="title-txt"
          @click="choose(1)"
        >{{Resource.customService}}</span>
        <span
          :class="{titleColor:localFileShow}"
          class="title-txt"
          @click="choose(2)"
        >{{Resource.localKML}}</span>
        <span
          :class="{titleColor:portalServiceShow}"
          class="title-txt"
          @click="choose(3)"
        >{{Resource.portalService}}</span>
        <div style="width:10px;"></div>
        <span class="closeBtn" @click="toggleVisibility">&times;</span>
      </div>
      <!-- 调用子组件 -->
      <add-web-service></add-web-service>
      <add-custom-service @childEvent="parentEvent"></add-custom-service>
      <add-local-file></add-local-file>
      <add-portal-service></add-portal-service>
    </div>
  </div>
</template>

<script>
export default {
  name: "addLayers",
  data() {
    return {
      sharedState: store.state
    };
  },
  computed: {
    webServiceShow: function() {
      return this.sharedState.addLayer[0];
    },
    customServiceShow: function() {
      return this.sharedState.addLayer[1];
    },
    localFileShow: function() {
      return this.sharedState.addLayer[2];
    },
    portalServiceShow: function() {
      return this.sharedState.addLayer[3];
    },
    addLayerShow: function() {
      return this.sharedState.toolBar[1];
    }
  },
  methods: {
    toggleVisibility() {
      //控制组件界面显隐
      store.setToolBarAction(1);
    },
    choose(i) {
      switch (i) {
        case 0:
          store.setAddLayerAction([1, 0, 0, 0]);
          break;
        case 1:
          store.setAddLayerAction([0, 1, 0, 0]);
          break;
        case 2:
          store.setAddLayerAction([0, 0, 1, 0]);
          break;
        case 3:
          store.setAddLayerAction([0, 0, 0, 1]);
          break;
        default:
          store.setAddLayerAction([1, 0, 0, 0]);
      }
    },
    parentEvent() {
      store.setToolBarAction(1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./addLayersCombination.scss";
</style>
