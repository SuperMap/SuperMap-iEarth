<template>
  <div class="sm-function-module-content" v-show="portalServiceShow">
    <div>
      <div>
        <Table
          :no-data-text="Resource.noData"
          ref="selection"
          :columns="columns"
          :data="data"
          :height="true ? 250 : ''"
        ></Table>
      </div>

      <div class="boxchild">
        <button class="tbtn tbn1" type="button" @click="openScene">{{Resource.confirm}}</button>
      </div>
    </div>
  </div>
</template>

<script>
let layerLen;
//引入portal处理公共类
import {
  getRootUrl,
  isIportalProxyServiceUrl,
  getHostName
} from "../../../common/js/portalTools";

export default {
  name: "addPortalService",
  data() {
    return {
      sharedState: store.state,

      columns: [
        { type: "selection", width: 60, align: "center" },
        {
          title: Resource.serviceName,
          key: "name"
        },
        {
          title: Resource.resourceSubType,
          key: "resourceSubType"
        },
        {
          title: Resource.updateTime,
          key: "updateTime"
        },
        {
          title: Resource.serviceUrl,
          key: "url",
          align: "center",
          render: (h, params) => {
            return h(
              "a",
              {
                attrs: {
                  href: params.row.url,
                  target: "_black"
                }
              },
              Resource.view
            );
          }
        }
      ],
      data: []
    };
  },
  mounted() {
    if (window.store.isPortal) {
      this.init();
    }
  },
  computed: {
    portalServiceShow: function() {
      return this.sharedState.addLayer[1]; //第二分项
    }
  },
  methods: {
    init() {
      let me = this;
      let that = this;
      //查询出portal中的服务列表（只查询出服务项）
      let searchUrl =
        getRootUrl() +
        "gateway/catalog/resource/search.json?searchType=MY_RES&resourceType=SERVICE";
      window.axios
        //todo
        //需要withCredentials验证否？
        .get(searchUrl, { withCredentials: window.store.isPortal })
        .then(function(response) {
          let data = response.data.content;

          data.forEach(item => {
            let sceneID = item.resourceId;

            let highestpermissionurl =
              getRootUrl() +
              "web/permissions/highestpermission.json?resourceIds=" +
              encodeURIComponent("[" + sceneID + "]") +
              "&resourceType=SERVICE";

            let arrays = ["READ", "READWRITE", "DELETE"];
            //判断是否有权限
            let noPermission = false;
            window.axios
              .get(highestpermissionurl, {
                withCredentials: window.store.isPortal
              })
              .then(function(responseHigh) {
                if (arrays.indexOf(responseHigh.data[sceneID]) < 0) {
                  noPermission = true;
                }

                let scenePostUrl =
                  getRootUrl() + "web/services/" + item.resourceId + ".json";
                window.axios
                  .get(scenePostUrl, { withCredentials: window.store.isPortal })
                  .then(function(responseScene) {
                    let sceneUrl =
                      responseScene.data.proxiedUrl ||
                      responseScene.data.linkPage;

                    let disabled =
                      noPermission || item.resourceSubType != "REALSPACE"; //是否禁用选择

                    // let disabled = noPermission;

                    that.data.push({
                      name: item.name,
                      resourceSubType: item.resourceSubType,
                      updateTime: that.dateDiff(item.updateTime),
                      url: sceneUrl,
                      _disabled: disabled
                    });
                  });
              });
          });
        });
    },

    // /** 判断当前用户的权限
    //  * todo,需要改成异步的才行
    //  * @param sceneID 场景ID
    //  */
    // hasPermission(sceneID) {
    //   let highestpermissionurl =
    //     getRootUrl() +
    //     "web/permissions/highestpermission.json?resourceIds=" +
    //     encodeURIComponent("[" + sceneID + "]") +
    //     "&resourceType=SERVICE";

    //   let arrays = ["READ", "READWRITE", "DELETE"];

    //   window.axios
    //     .get(highestpermissionurl, { withCredentials: true })
    //     .then(function(responseHigh) {
    //       if (arrays.indexOf(responseHigh.data[sceneID]) > -1) {
    //         return true;
    //       }
    //       return false;
    //     });
    // },

    /** 时间倒序，多少小时之前
     * @param timestamp 时间毫秒数
     */
    dateDiff(timestamp) {
      // 补全为13位
      var arrTimestamp = (timestamp + "").split("");
      for (var start = 0; start < 13; start++) {
        if (!arrTimestamp[start]) {
          arrTimestamp[start] = "0";
        }
      }
      timestamp = arrTimestamp.join("") * 1;
      var minute = 1000 * 60;
      var hour = minute * 60;
      var day = hour * 24;
      var halfamonth = day * 15;
      var month = day * 30;
      var now = new Date().getTime();
      var diffValue = now - timestamp;

      // 如果本地时间反而小于变量时间
      if (diffValue < 0) {
        return "不久前";
      }
      // 计算差异时间的量级
      var monthC = diffValue / month;
      var weekC = diffValue / (7 * day);
      var dayC = diffValue / day;
      var hourC = diffValue / hour;
      var minC = diffValue / minute;

      // 数值补0方法
      var zero = function(value) {
        if (value < 10) {
          return "0" + value;
        }
        return value;
      };

      // 使用
      if (monthC > 4) {
        // 超过1年，直接显示年月日
        return (function() {
          var date = new Date(timestamp);
          return (
            date.getFullYear() +
            Resource.yeear +
            zero(date.getMonth() + 1) +
            Resource.month +
            zero(date.getDate()) +
            Resource.day
          );
        })();
      } else if (monthC >= 1) {
        return parseInt(monthC) + Resource.monthsAgo;
      } else if (weekC >= 1) {
        return parseInt(weekC) + Resource.weeksAgo;
      } else if (dayC >= 1) {
        return parseInt(dayC) + Resource.daysAgo;
      } else if (hourC >= 1) {
        return parseInt(hourC) + Resource.hoursAgo;
      } else if (minC >= 1) {
        return parseInt(minC) + Resource.minutesAgo;
      }
      return Resource.secondsAgo;
    },

    /** 时间格式化
     * @param time 时间毫秒数
     */
    timeFormat(time) {
      const date = new Date(time);
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (day >= 1 && day <= 9) {
        day = "0" + day;
      }
      if (hour >= 1 && hour <= 9) {
        hour = "0" + hour;
      }
      if (min >= 0 && min <= 9) {
        min = "0" + min;
      }
      return `${year}-${month}-${day} ${hour}:${min}`;
    },

    getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000)
        .toLocaleString()
        .replace(/:\d{1,2}$/, " ");
    },

    // 添加自定义场景
    openScene() {
      let that = this;

      //获取选中行
      let selectItems = this.$refs.selection.getSelection();

      if (viewer) {
        selectItems.forEach(item => {
          let url = item.url + "/realspace";

          let s;
          let promiseArray = [];
          that.setTrustedServers(url);

          s = viewer.scene.open(url);
          promiseArray.push(s);
          that.promiseWhen(promiseArray);
        });
      }
    },

    promiseWhen(promiseArray, isSCP) {
      Cesium.when.all(
        promiseArray,
        function(layers) {
          for (let i = 0; i < layers.length; i++) {
            layers[i].visibleDistanceMax = 10000; //最大可见高度
          }
          setTimeout(() => {
            //更新图层
            store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
            store.setImgLayerManage(viewer.imageryLayers._layers.length);
            store.setTerrainLayerManage(viewer.terrainProvider);
          }, 500);
          if (isSCP && layers[layerLen]) {
            viewer.flyTo(layers[layerLen]);
          }
        },
        function(e) {
          if (widget._showRenderLoopErrors) {
            let title = Resource.scpUrlErrorMsg;
            widget.showErrorPanel(title, undefined, e);
          }
        }
      );
    },
    //检查请求是否带cookie
    setTrustedServers(url) {
      if (window.store.isPortal) {
        let serviceProxy = window.store.portalConfig.serviceProxy;
        let withCredentials = isIportalProxyServiceUrl(url, serviceProxy);
        if (withCredentials) {
          let ip = getHostName(url);
          if (
            !Cesium.TrustedServers.contains(
              "http://" + ip + "/" + serviceProxy.port
            )
          ) {
            Cesium.TrustedServers.add(ip, serviceProxy.port);
          }
        }
      }
    },
    childEvent() {}
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
@import "./PortalServicePan.scss";
</style>
