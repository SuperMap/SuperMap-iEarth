<template>
  <div v-show="viewshedComb">
    <div class="sm-function-module-content" style="max-height:570px;">
      <div class="sm-point media-hidden"></div>
      <label class="sm-function-module-ViewShed media-hidden">{{
        Resource.ObserverInformation
      }}</label>
      <div class="sm-function-module-sub-section">
        <div class="viewShed-half">
          <label class="sm-function-module-ViewShed">{{
            Resource.longitude
          }}</label>
          <input
            v-model="viewlongitude"
            type="text"
            id="viewshed-observation-place-x"
            class="sm-input-right"
            style="width:130px;float:left;"
          />
        </div>
        <div class="viewShed-half">
          <label
            class="sm-function-module-ViewShed"
            >{{ Resource.latitude }}</label
          >
          <input
            v-model="viewlatitude"
            type="text"
            id="viewshed-observation-place-y"
            class="sm-input-right"
            style="width:130px;float:left;"
          />
        </div>
        <div class="viewShed-half">
          <label class="sm-function-module-ViewShed">{{
            Resource.altitude
          }}</label>
          <input
            v-model="viewheight"
            type="text"
            id="viewshed-observation-place-z"
            class="sm-input-right"
            style="width:130px;float:left;"
          />
        </div>
      </div>

      <div class="sm-point media-hidden"></div>
      <label class="sm-function-module-ViewShed media-hidden">{{
        Resource.parameterSetting
      }}</label>
      <div class="sm-function-module-sub-section">
        <div class="viewShed-half">
          <label class="sm-function-module-ViewShed">{{
            Resource.additionalHeight
          }}</label>
          <input
            type="number"
            id="addheight"
            class="sm-input sm-input-long"
            step="0.1"
            min="0"
            v-model="addheight"
            style="width:130px;float:left;"
          />
        </div>
        <div class="viewShed-half">
          <label
            class="sm-function-module-ViewShed"
            >{{ Resource.directionAngle }}</label
          >
          <input
            type="number"
            id="direction"
            class="sm-input sm-input-long"
            min="0"
            max="360"
            step="1.0"
            v-model="direction"
            style="width:130px;float:left;"
          />
        </div>

        <div class="viewShed-half">
          <label class="sm-function-module-ViewShed">{{
            Resource.visualRange
          }}</label>
          <input
            type="number"
            id="distance"
            class="sm-input sm-input-long"
            min="1"
            step="1"
            v-model="distance"
            style="width:130px;float:left;"
          />
        </div>
        <div class="viewShed-half">
          <label
            class="sm-function-module-ViewShed"
            >{{ Resource.ElevationAngle }}</label
          >
          <input
            type="number"
            id="pitch"
            class="sm-input sm-input-long"
            min="-90"
            max="90"
            step="1.0"
            v-model="pitch"
            style="width:130px;float:left;"
          />
        </div>


        <div class="viewShed-half">
          <label class="sm-function-module-ViewShed">{{
            Resource.horizontalFov
          }}</label>
          <input
            type="number"
            id="horizontalFov"
            class="sm-input sm-input-long"
            min="1"
            max="120"
            step="1.0"
            title="水平视角"
            v-model="horizontalFov"
            style="width:130px;float:left;"
          />
        </div>
        <div class="viewShed-half">
          <label
            class="sm-function-module-ViewShed"
            >{{ Resource.verticalFov }}</label
          >
          <input
            type="number"
            id="verticalFov"
            class="sm-input sm-input-long"
            min="1"
            step="1.0"
            title="垂直视角"
            v-model="verticalFov"
            style="width:130px;float:left;"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <div class="sm-point"></div>
        <label class="sm-function-module-sub-section-setting">{{
          Resource.colorSetting
        }}</label>
        <div>
          <label class="sm-function-module-sub-section-caption">{{
            Resource.promptLineColor
          }}</label>
          <ColorPicker class="sm-colorpicker" v-model="hintLineColor" alpha />
        </div>
        <div>
          <label class="sm-function-module-sub-section-caption">{{
            Resource.visibleColor
          }}</label>
          <ColorPicker
            class="sm-colorpicker"
            v-model="visibleAreaColor"
            alpha
          />
        </div>
        <div>
          <label class="sm-function-module-sub-section-caption">{{
            Resource.invisibleColor
          }}</label>
          <ColorPicker class="sm-colorpicker" v-model="hiddenAreaColor" alpha />
        </div>
        <div>
          <input type="checkbox" v-model="visibleBody" />
          <label class="sm-function-module-sub-section-caption">
            {{Resource.displayVisualsBody}}
          </label>
          <ColorPicker
            class="sm-colorpicker"
            v-model="visibleBodyColor"
            alpha
          />
        </div>
        <div>
           <input type="checkbox" v-model="invisibleBody" />
           <label class="sm-function-module-sub-section-caption">
             {{Resource.displayInvisibleBody}}
           </label>
           <ColorPicker
             class="sm-colorpicker"
             v-model="invisibleBodyColor"
             alpha
           />
        </div>
      </div>
      <div class="boxchild">
        <button type="button" class="tbtn tbn1" v-on:click="chooseView">
          {{ Resource.analyze }}
        </button>
        <button type="button" class="tbtn" @click="clear">
          {{ Resource.eliminate }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
let viewshed3D, handler, pointHandler, s3mInstanceColc,doubleRender = true;
export default {
  name: "Sm3dViewshed",
  props: {
    spatialAnalysisUrl: {
      type: String,
    },
  },
  data() {
    return {
      sharedState: store.state,
      spurl: "",
      viewlongitude: 0,
      viewlatitude: 0,
      viewheight: 0,
      direction: 1.0,
      pitch: 1.0,
      addheight: 1.8,
      distance: 1.0,
      verticalFov: 60,
      horizontalFov: 90,
      hintLineColor: "rgb(212,202,45)",
      visibleAreaColor: "rgb(9,199,112)",
      hiddenAreaColor: "rgb(238,114,22)",
      visibleBodyColor: "rgba(44,149,197,0.9)",
      invisibleBodyColor: "rgba(200,0,0,0.9)",
      visibleBody:false,
      invisibleBody:false,
      isDestroyFlag: true,
      originViewshedObservationPlace: {},
    };
  },
  computed: {
    viewshedComb: function () {
      return this.sharedState.analysis[1];
    },
    analysisShow: function () {
      return this.sharedState.toolBar[6];
    },
  },

  beforeDestroy() {
    if (this.isDestroyFlag && pointHandler) {
      if (s3mInstanceColc) {
        s3mInstanceColc.destroy();
      }
      viewshed3D.destroy();
      handler.destroy();
      pointHandler.deactivate();
      viewshed3D = undefined;
      handler = undefined;
      pointHandler = undefined;
      s3mInstanceColc = undefined;
    }
  },
  mounted() {
    if (this.analysisShow && this.viewshedComb) {
      this.init();
    }
  },
  methods: {
    init() {
      if (viewshed3D) {
        return;
      }
      // 创建可视域分析对象
      scene = viewer.scene;
      scene.viewFlag = true;
      if (!viewshed3D) {
        viewshed3D = new Cesium.ViewShed3D(scene);
      }

      viewshed3D.hintLineColor = Cesium.Color.fromCssColorString(
        this.hintLineColor
      );
      viewshed3D.visibleAreaColor = Cesium.Color.fromCssColorString(
        this.visibleAreaColor
      );
      viewshed3D.hiddenAreaColor = Cesium.Color.fromCssColorString(
        this.hiddenAreaColor
      );

      let that = this;

      handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      // 鼠标移动时间回调
      handler.setInputAction(function (e) {
        // 若此标记为false，则激活对可视域分析对象的操作
        if (!scene.viewFlag) {
          //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
          let position = e.endPosition;
          let last = scene.pickPosition(position);

          //计算该点与视口位置点坐标的距离
          let distance = Cesium.Cartesian3.distance(that.viewPosition, last);

          if (distance > 0) {
            // 将鼠标当前点坐标转化成经纬度
            let cartographic = Cesium.Cartographic.fromCartesian(last);
            let longitude = Cesium.Math.toDegrees(cartographic.longitude);
            let latitude = Cesium.Math.toDegrees(cartographic.latitude);
            let height = cartographic.height;
            // 通过该点设置可视域分析对象的距离及方向
            viewshed3D.setDistDirByPoint([longitude, latitude, height]);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction(function (e) {
        //鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
        if (!scene.viewFlag) {
          scene.viewFlag = true;

          that.direction = viewshed3D.direction.toFixed(2);
          that.pitch = viewshed3D.pitch.toFixed(2);
          that.distance = viewshed3D.distance.toFixed(2);
          that.horizontalFov = viewshed3D.horizontalFov;
          that.verticalFov = viewshed3D.verticalFov;
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

      pointHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
      pointHandler.drawEvt.addEventListener(function (result) {
        let point = result.object;
        let position = point.position;
        that.viewPosition = position;

        // 将获取的点的位置转化成经纬度
        let cartographic = Cesium.Cartographic.fromCartesian(position);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let height = cartographic.height;
        that.originViewshedObservationPlace = { longitude, latitude, height };

        let additionalHeight = Number(that.addheight);
        let heightnew = cartographic.height + additionalHeight;
        point.position = Cesium.Cartesian3.fromDegrees(
          longitude,
          latitude,
          heightnew
        );

        if (scene.viewFlag) {
          // 设置视口位置
          viewshed3D.viewPosition = [longitude, latitude, heightnew];
          viewshed3D.build();
          // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
          scene.viewFlag = false;

          that.viewlongitude = longitude.toFixed(4);
          that.viewlatitude = latitude.toFixed(4);
          that.viewheight = height.toFixed(2);
        }
      });
    },
    chooseView() {
      if(doubleRender){
        if (pointHandler.active) {
          return;
        }
        this.isDestroyFlag = false; //保留效果
        //先清除之前的可视域分析
        viewer.entities.removeAll();
        if(!viewshed3D){
          viewshed3D = new Cesium.ViewShed3D(scene);
          viewshed3D.hintLineColor = Cesium.Color.fromCssColorString(
            this.hintLineColor
          );
          viewshed3D.visibleAreaColor = Cesium.Color.fromCssColorString(
            this.visibleAreaColor
          );
          viewshed3D.hiddenAreaColor = Cesium.Color.fromCssColorString(
            this.hiddenAreaColor
          );
        }
        viewshed3D.distance = 0.1;
        viewer.scene.viewFlag = true;

        //激活绘制点类
        pointHandler.activate();
        doubleRender = !doubleRender;
      }
    },
    getVisibleResult() {
      if (!viewshed3D) {
        return;
      }
      if (!s3mInstanceColc) {
        s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
        viewer.scene.primitives.add(s3mInstanceColc);
      }

      let obj = viewshed3D.getViewshedParameter();

      let geometryViewShedBodyvisibleParameter = {
        viewerPoint: obj.viewPosition,
        point3DsList: obj.point3DList,
        radius: obj.distance,
        lonlat: true,
        viewShedType: "VISIBLEBODY",
      };
      let url = this.spurl;
      let queryData = JSON.stringify(geometryViewShedBodyvisibleParameter);
      let color = Cesium.Color.fromCssColorString(this.visibleBodyColor);

      //先发送POST请求
      window.axios
        .post(url, queryData)
        .then(function (response) {
          let newResourceLocationUrl = response.data.newResourceLocation;
          let urlResult = newResourceLocationUrl.split(":");
          newResourceLocationUrl = "https:"+ urlResult[1];
          //再发送一次GET请求  获取到运算结果
          window.axios
            .get(newResourceLocationUrl + ".json")
            .then(function (response) {
              let data = response.data;

              //失败 没有内容
              if (data.geometry == null) {
                return;
              }

              //将二进制流构建arrayBuffer 添加至S3MInstanceCollection
              let u8 = new Uint8Array(data.geometry.model);
              let ab = u8.buffer;

              //注意  若添加多个模型 请保证各个名称唯一  否则可能引起显示错乱问题
              s3mInstanceColc.add(
                "resultV",
                {
                  id: 1,
                  position: Cesium.Cartesian3.fromDegrees(
                    data.geometry.position.x,
                    data.geometry.position.y,
                    data.geometry.position.z
                  ),
                  hpr: new Cesium.HeadingPitchRoll(0, 0, 0),
                  color: color,
                },
                ab,
                false
              );
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });

      viewshed3D.visibleAreaColor = Cesium.Color.fromCssColorString(
        "rgba(9,199,112,0)"
      );
      viewshed3D.hiddenAreaColor = Cesium.Color.fromCssColorString(
        "rgba(238,114,22,0)"
      );
    },
    getInVisibleResult() {
      if (!viewshed3D) {
        return;
      }
      if (!s3mInstanceColc) {
        s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
        viewer.scene.primitives.add(s3mInstanceColc);
      }

      let obj = viewshed3D.getViewshedParameter();

      let geometryViewShedBodyvisibleParameter = {
        viewerPoint: obj.viewPosition,
        point3DsList: obj.point3DList,
        radius: obj.distance,
        lonlat: true,
        viewShedType: "HIDDENBODY",
      };
      let url = this.spurl;
      let queryData = JSON.stringify(geometryViewShedBodyvisibleParameter);
      let color = Cesium.Color.fromCssColorString(this.invisibleBodyColor);

      //先发送POST请求
      window.axios
        .post(url, queryData)
        .then(function (response) {
          let responseUrl = response.data.newResourceLocation;
          let newResourceLocationResult =  responseUrl.split(":");
          responseUrl = "https:"+ newResourceLocationResult[1];
          //再发送一次GET请求  获取到运算结果
          window.axios
            .get(responseUrl + ".json")
            .then(function (response) {
              let data = response.data;

              //失败 没有内容
              if (data.geometry == null) {
                return;
              }

              //将二进制流构建arrayBuffer 添加至S3MInstanceCollection
              let u8 = new Uint8Array(data.geometry.model);
              let ab = u8.buffer;

              //注意  若添加多个模型 请保证各个名称唯一  否则可能引起显示错乱问题
              s3mInstanceColc.add(
                "resultUnV",
                {
                  id: 2,
                  position: Cesium.Cartesian3.fromDegrees(
                    data.geometry.position.x,
                    data.geometry.position.y,
                    data.geometry.position.z
                  ),
                  hpr: new Cesium.HeadingPitchRoll(0, 0, 0),
                  color: color,
                },
                ab,
                false
              );
            })
            .catch(function (error) {
              console.log(error);
            });

          viewshed3D.visibleAreaColor = Cesium.Color.fromCssColorString(
            "rgba(9,199,112,0)"
          );
          viewshed3D.hiddenAreaColor = Cesium.Color.fromCssColorString(
            "rgba(238,114,22,0)"
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    clear() {
      this.isDestroyFlag = true; //摧毁标志，释放内存
      viewer.entities.removeAll();
      pointHandler.clear();
      this.visibleBody = false;
      this.invisibleBody = false;
      scene.viewFlag = true;
      viewshed3D.destroy();
      viewshed3D = undefined;
      doubleRender = true;
      this.hintLineColor = "rgb(212,202,45)";
      this.visibleAreaColor =  "rgb(9,199,112)";
      this.hiddenAreaColor =  "rgb(238,114,22)";
      this.visibleBodyColor = "rgba(44,149,197,0.9)";
      this.invisibleBodyColor = "rgba(200,0,0,0.9)";
    },
    destory() {
      if (s3mInstanceColc) {
        s3mInstanceColc.destroy();
        s3mInstanceColc = undefined;
      }
      if (viewshed3D) {
        viewshed3D.destroy();
        viewshed3D = undefined;
      }
    }
  },

  watch: {
    viewshedComb(val) {
      if (val) {
        this.init();
      }
    },
    analysisShow(val) {
      if (val && this.viewshedComb) {
        this.init();
      }
    },
    addheight: function (newValue) {
      let originViewshedObservationPlace = this.originViewshedObservationPlace;
      let longitude = originViewshedObservationPlace.longitude;
      let latitude = originViewshedObservationPlace.latitude;
      if (newValue === "") {
        // 避免删除导致崩溃
        newValue = "0.0";
      }
      let height = originViewshedObservationPlace.height + parseFloat(newValue);
      let cartesian = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
      );
      viewshed3D.viewPosition = [longitude, latitude, height];
    },
    direction: function (newValue) {
      viewshed3D.direction = parseFloat(newValue);
    },
    distance: function (newValue) {
      viewshed3D.distance = parseFloat(newValue);
    },
    pitch: function (newValue) {
      viewshed3D.pitch = parseFloat(newValue);
    },
    verticalFov: function (newValue) {
      viewshed3D.verticalFov = parseFloat(newValue);
    },
    horizontalFov: function (newValue) {
      viewshed3D.horizontalFov = parseFloat(newValue);
    },
    hintLineColor: function (newValue) {
      let color = Cesium.Color.fromCssColorString(newValue);
      if(viewshed3D){
        viewshed3D.hintLineColor = color;
      }
    },
    visibleAreaColor: function (newValue) {
      let color = Cesium.Color.fromCssColorString(newValue);
      if(viewshed3D){
        viewshed3D.visibleAreaColor = color;
      }
    },
    hiddenAreaColor: function (newValue) {
      let color = Cesium.Color.fromCssColorString(newValue);
      if(viewshed3D){
        viewshed3D.hiddenAreaColor = color;
      }
    },
    visibleBodyColor: function (newValue) {
      let color = Cesium.Color.fromCssColorString(newValue);
      if (
        s3mInstanceColc &&
        s3mInstanceColc instanceof Cesium.S3MInstanceCollection
      ) {
        s3mInstanceColc.getInstance("resultV", 1).updateColor(color);
      }
    },
    invisibleBodyColor: function (newValue) {
      let color = Cesium.Color.fromCssColorString(newValue);
      if (
        s3mInstanceColc &&
        s3mInstanceColc instanceof Cesium.S3MInstanceCollection
      ) {
        s3mInstanceColc.getInstance("resultUnV", 2).updateColor(color);
      }
    },
    visibleBody:function(newValue){
      if(newValue){
        this.getVisibleResult();
      }else{
        //清除体
        if(
          s3mInstanceColc &&
          s3mInstanceColc instanceof Cesium.S3MInstanceCollection
        ){
          s3mInstanceColc.removeCollection("resultV");
        }
        if(!this.visibleBody && !this.invisibleBody){
          viewshed3D.visibleAreaColor = Cesium.Color.fromCssColorString(
            this.visibleAreaColor
          );
          viewshed3D.hiddenAreaColor = Cesium.Color.fromCssColorString(
            this.hiddenAreaColor
          );
        }
      }
    },
    invisibleBody:function(newValue){
      if(newValue){
        this.getInVisibleResult();
      }else{
        //清除体
        if(
          s3mInstanceColc &&
          s3mInstanceColc instanceof Cesium.S3MInstanceCollection
        ){
          s3mInstanceColc.removeCollection("resultUnV");
        }
        if(!this.visibleBody && !this.invisibleBody){
          viewshed3D.visibleAreaColor = Cesium.Color.fromCssColorString(
           this.visibleAreaColor
          );
          viewshed3D.hiddenAreaColor = Cesium.Color.fromCssColorString(
           this.hiddenAreaColor
          );
        }
      }
    },
    spatialAnalysisUrl: {
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.spurl = val;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "ViewShed";
</style>
