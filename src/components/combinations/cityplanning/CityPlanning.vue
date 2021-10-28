<template>
  <div id="cityPlan" class="sm-panel" v-if="cityPlanShow" v-drag data-attr="drag">
    <div class="sm-content">
      <div class="sm-panel-header">
        <span :class="{titleColor:backLineShow}" class="title-txt" @click="choose(0)">退线</span>
        <span :class="{titleColor:onLineShow}" class="title-txt" @click="choose(1)">贴线</span>
        <span :class="{titleColor:limitHeightShow}" class="title-txt" @click="choose(2)">限高</span>
        <span :class="{titleColor:serviceAreaShow}" class="title-txt" @click="choose(3)">服务区</span>
        <span :class="{titleColor:opennessShow}" class="title-txt" @click="choose(4)">开敞度</span>
        <span class="closeBtn" @click="toggleVisibility">&times;</span>
      </div>

      <!-- 调用子组件 -->
      <sm3d-back-line-analysis :spatial-analysis-url="spatialAnalysisUrl" :query-url="queryUrl"></sm3d-back-line-analysis>
      <sm3d-limit-height-analysis></sm3d-limit-height-analysis>
      <sm3d-onLine-analysis></sm3d-onLine-analysis>
      <sm3d-service-area-analysis></sm3d-service-area-analysis>
    </div>
  </div>
</template>

<script>
export default {
  name: "cityPlan",
  props: {},
  data() {
    return {
      sharedState: store.state,
      spatialAnalysisUrl:
        "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/buffer.json",
      queryUrl:
        "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/datasets/%E5%A2%99%40%E4%B9%9D%E5%8F%B7%E6%A5%BC%E6%8B%89%E4%BD%8E/spatialquery3d.json",
      scps: [
        {
          url: URL_CONFIG.SCENE_GTC_GROUND,
          options: {
            name: "ground",
          },
        },
        {
          url: URL_CONFIG.SCENE_GTC_LWINDOW9,
          options: {
            name: "日照窗户",
          },
        },
        {
          url: URL_CONFIG.SCENE_GTC_LWALL9,
          options: {
            name: "日照墙",
          },
        },
        {
          url: URL_CONFIG.SCENE_GTC_BUILDIBG,
          options: {
            name: "original",
          },
        },
        {
          url: URL_CONFIG.SCENE_GTC_HILL,
          options: {
            name: "hill",
          },
        },
        {
          url: URL_CONFIG.SCENE_GTC_UNIT9,
          options: {
            name: "九号楼@九号楼",
          },
        },
        {
          url: URL_CONFIG.SCENE_GTC_UNIT9,
          options: {
            name: "九号楼@九号楼1",
          },
        },

        {
          url: URL_CONFIG.SCENE_GTC_UINSIDE,
          options: {
            name: "origina白膜控制",
          },
        },
        {
          url: URL_CONFIG.SCENE_GTC_UOUTSIDE,
          options: {
            name: "u外部",
          },
        },
        {
          url: URL_CONFIG.SCENE_GTC_UINSIDE,
          options: {
            name: "u内部",
          },
        },
        {
          url: URL_CONFIG.SCENE_GTC_UWINDOW,
          options: {
            name: "u窗",
          },
        },
      ],
    };
  },

  computed: {
    backLineShow: function () {
      return this.sharedState.cityPlan[0];
    },
    onLineShow: function () {
      return this.sharedState.cityPlan[1];
    },
    limitHeightShow: function () {
      return this.sharedState.cityPlan[2];
    },
    serviceAreaShow: function () {
      return this.sharedState.cityPlan[3];
    },
    opennessShow: function () {
      return this.sharedState.cityPlan[4];
    },
    cityPlanShow: function () {
      return this.sharedState.toolBar[9];
    },
  },

  methods: {
    toggleVisibility() {
      //控制组件界面显隐
      store.setToolBarAction(9);
    },
    choose(i) {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      let isClick = document
        .getElementById("cityPlan")
        .getAttribute("data-flag");
      if (isClick !== "true") {
        return false;
      }
      switch (i) {
        case 0:
          store.setCityPlanAction([1, 0, 0, 0, 0]);
          break;
        case 1:
          store.setCityPlanAction([0, 1, 0, 0, 0]);
          break;
        case 2:
          store.setCityPlanAction([0, 0, 1, 0, 0]);
          break;
        case 3:
          store.setCityPlanAction([0, 0, 0, 1, 0]);
          break;
        case 4:
          store.setCityPlanAction([0, 0, 0, 0, 1]);
          break;
        default:
          store.setCityPlanAction([1, 0, 0, 0, 0]);
      }
    },
    addSCP() {
      let promiseArray = [];
      this.scps.forEach((element) => {
        promiseArray.push(
          viewer.scene.addS3MTilesLayerByScp(element.url, element.options)
        );
      });
      this.promiseWhen(promiseArray);
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          115.00022575830863,
          39.009956534844858,
          500
        ),
        orientation: {
          heading: 1.705646,
          pitch: -0.499956,
          roll: 0.0,
        },
      });
      setTimeout(() => {
        store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
      }, 1000);
    },

    promiseWhen(promiseArray) {
      Cesium.when.all(
        promiseArray,
        function (layer) {
          // window.layers = layer;
        },
        function (e) {
          if (widget._showRenderLoopErrors) {
            let title = "加载SCP失败，请检查网络连接状态或者url地址是否正确？";
            widget.showErrorPanel(title, undefined, e);
          }
        }
      );
    },
    delSCP() {
      scene.camera.setView({
        destination: new Cesium.Cartesian3.fromDegrees(
          110.60396458865515,
          34.54408834959379,
          30644793.325518917
        ),
      });
      this.scps.forEach((item) => {
        viewer.scene.layers.remove(item.options.name);
      });
      store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
    },
  },
  watch: {
    cityPlanShow(val) {
      if (val) {
        this.addSCP();
      } else {
        this.delSCP();
      }
    },
  },

};
</script>
