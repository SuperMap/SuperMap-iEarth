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
          :class="{titleColor:portalServiceSelected}"
          class="title-txt"
          @click="choose(1)"
          v-if="portalServiceShow" >{{Resource.portalService}}</span>
        <span
          :class="{titleColor:customServiceShow}"
          class="title-txt"
          @click="choose(2)"
        >{{Resource.customService}}</span>
        <span
          :class="{titleColor:localFileShow}"
          class="title-txt"
          @click="choose(3)"
        >{{Resource.localKML}}</span>        
        <div style="width:10px;"></div>
        <span class="closeBtn" @click="toggleVisibility">&times;</span>
      </div>
      <!-- 调用子组件 -->
      <add-web-service></add-web-service>
      <add-portal-service v-if="portalServiceShow"></add-portal-service>
      <add-custom-service @childEvent="parentEvent"></add-custom-service>
      <add-local-file></add-local-file>      
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
    portalServiceSelected: function() {   
      return this.sharedState.addLayer[1];   
    },
    customServiceShow: function() {
      return this.sharedState.addLayer[2];
    },
    localFileShow: function() {
      return this.sharedState.addLayer[3];
    },    
    portalServiceShow: function() {      
      return window.store.isPortal;
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
