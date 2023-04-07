<script src="compassViewModel.js"></script>
<template>
  <div class="compass" v-show="compassShow">
    <!-- <div class="btnCompass" :title="Resource.search">
      <div class="searchBar">
        <div v-show="searchPlane">
          <div class="inputContainer" ref="searchInput">
            <input class="input" type="text" v-model="searchText" placeholder="Searching...">
            <div class="close">
              <span @click="inputClose" :title="Resource.clear"><img class="closeImg" :src="iconImg[1]" alt=""></span>
            </div>
            <div class="cityPanle">
              <span @click="cityPanle = true" :title="Resource.cityList">
                <img class="downImg" :src="iconImg[0]" alt="">
              </span>
            </div>
            <span class="split">|</span>
            <div class="search">
              <span @click="search" :title="Resource.search"><img class="searchImg" :src="iconImg[2]" alt=""></span>
            </div>
          </div>

          <div v-show="infoShow">
            <ul v-if="cityInfoArray.length !== 0" class="infoContainer">
              <li v-for="item in cityInfoArray" :key="item" :class="{ isSelect: item.isSelect }" @click="flyTo(item.name)">
                <span>市区町村名：</span>
                <span>{{ item.name }}</span>
              </li>
            </ul>
            <ul v-else class="infoContainer no-content">
              <li>{{Resource.resultNone}}</li>
            </ul>
          </div>
        </div>

        <div class="btnCompass" :title="Resource.searchBox" @click="searchPlane = !searchPlane">
          <span class="iconfont iconsousuo compasstb"></span>
        </div>

      </div>

      <div class="cityTabs" v-show="cityPanle">
        <div class="title">
          <div class="titleText" title="市区町村">市区町村</div>
          <div class="titleClose" @click="cityPanle = false">X</div>
        </div>
        <div class="tabs">
          <button class="tabBtn" v-for="item in cityClassify.TABS" :key="item" :title="item" @click="setCity(item)">{{
              item
          }}</button>
        </div>
        <div class="hrLine"></div>
        <div class="cityContainer">
          <div class="cityClass" v-for="(items, key, index) in cityClassifyNow" :key="items">
            <div class="cityLeft">{{ key }}</div>
            <div class="cityRight">
              <div class="city" v-for="item in items" @click="flyToCity(item)" :key="item" :title="item">{{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="btnCompass" @click="reduceCompass" :title=Resource.compass>
      <span id="compass" class="iconfont iconiEarth-zhibeizhen-01 compasstb"
        style="transform : rotate(0deg);display : inline-block;"></span>
    </div>
    <div class="btnCompass" @click="reset" :title=Resource.reset>
      <span class="iconfont iconzhongzhi compasstb"></span>
    </div>
    <div id="zoomIn" class="btnCompass" @mousedown="zoomIn">
      <span class="iconfont iconfangda compasstb"></span>
    </div>
    <div id="zoomOut" class="btnCompass" @mousedown="zoomOut">
      <span class="iconfont iconsuoxiao compasstb"></span>
    </div>
    <div class="btnCompass" @click="fullscreenchange" :title=Resource.fullScreen>
      <span class="iconfont compasstb" :class="!isfull ? 'iconquanping' : 'iconICON_tuichuquanping'"></span>
    </div>
  </div>
</template>

<script>
  import CompassViewModel from "./compassViewModel.js";
  import cityClassifyData from "./poi-search-city-classify.js"
  import cityFeaturesData from "./poi-search-city-features.js"
  import downImg from "@/../static/images/searchBar/down.png";
  import closeImg from "@/../static/images/searchBar/close.png";
  import searchImg from "@/../static/images/searchBar/search.png";


  let viewModel = {};
export default {
  name: "compass",
  data() {
    return {
      sharedState: store.state,
      isfull: false,
      searchText:'',
      infoShow:false,
      searchPlane:false,
      selectName: true,
      cityPanle:false,
      cityInfoArray:[],
      cityClassify:cityClassifyData,
      cityClassifyNow:cityClassifyData["CITYS"]["HOT"],
      cityFeatures:cityFeaturesData,
      iconImg:[downImg,closeImg,searchImg],
    };
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
    compassShow: function () {
      return this.sharedState.compass;
    }
  },
  methods: {
    initCompass() {
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      viewModel = new CompassViewModel({
        viewer:viewer,
        scene:scene,
        viewerId:"compass"
      });
      handler.setInputAction(function(){
        viewModel.viewerChanged = true;
        viewModel.handleViewerChange();
      },Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
      handler.setInputAction(function(){
        viewModel.viewerChanged = false;
        viewModel.handleViewerChange();
      },Cesium.ScreenSpaceEventType.MIDDLE_UP);
      handler.setInputAction(function(){
        viewModel.viewerChanged = false;
        viewModel.handleViewerChange();
      },Cesium.ScreenSpaceEventType.LEFT_UP);
      handler.setInputAction(function(){
        viewModel.viewerChanged = true;
        viewModel.handleViewerChange();
      },Cesium.ScreenSpaceEventType.LEFT_DOWN);
    },
    reduceCompass() {
      viewModel.compassPointingNorth();
    },
    reset() {
      let defaultPosition = new Cesium.Cartesian3.fromDegrees(110.60396458865515, 34.54408834959379, 30644793.325518917);
      viewModel.defaultCameraPosition = defaultPosition;
      viewModel.resetCameraPosition();
    },
    fullscreenchange() {
      if (!document.fullscreenElement) {
        this.isfull = true;
        this.launchFullscreen(document.documentElement);
      } else {
        this.isfull = false;
        this.exitFullscreen();
      }
    },
    zoomIn(){
      viewModel.handleZoomInMouseDown();
    },
    zoomOut(){
      viewModel.handleZoomOutMouseDown();
    },
    mercatorTolonlat(mercator){
        var lonlat={
          x:0,
          y:0
        };
        var x = mercator.x/20037508.34*180;
        var y = mercator.y/20037508.34*180;
        y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
        lonlat.x = x;
        lonlat.y = y;
        return lonlat;
    },
    search(){

      let searchText = this.searchText

      // 数据接口
      if(this.searchText){
        this.infoShow = true;

        let url = "https://iserver4.supermap.jp/iserver/services/data-XingZhengQuYu/rest/data/featureResults.json?returnContent=true"

        let format = {"getFeatureMode":"SQL","datasetNames":["行政区域:市区町村"],"targetEpsgCode":"3857","queryParameter":{"name":"市区町村@行政区域","attributeFilter":"","fields":null}}
        format["queryParameter"]["attributeFilter"] = `市区町村名 LIKE '%${searchText}%'`

        let that = this
        window.axios
          .post(url, format, {header: {'Content-Type': "application/json;charset=utf-8"}})
          .then(function (response) {
            let data = response.data.features

            let infodata = []
            for(let i=0;i<data.length;i++){
                let info = {}
                info.center = data[i].geometry.center
                info.name = data[i]["fieldValues"][7];
                info.isSelect = false
                infodata.push(info)
            }

            console.log("infodata:",infodata)

            let cityInfoArray = []

            infodata.forEach(element => {
              let lnglat = that.mercatorTolonlat(element.center)
              let cityInfo = {
                lnglat:lnglat,
                name:element.name
              }
              cityInfoArray.push(cityInfo)
            });
            
            that.cityInfoArray = cityInfoArray
          })
      }

    },
    inputClose(){
      this.infoShow=false;
      this.searchText=''
      this.cityInfoArray = []
    },
    flyTo(searchName){
      this.cityInfoArray.map((item,index) => {
        if(searchName === item.name) {
          this.cityInfoArray[index].isSelect = true;
        } else {
          this.cityInfoArray[index].isSelect = false;
        }
      })


      // console.log("searchName:",searchName)
      let cityInfoArray = this.cityInfoArray

      for(let i=0;i<cityInfoArray.length;i++){
        if(cityInfoArray[i].name === searchName){

          let lnglat = cityInfoArray[i].lnglat

          viewer.camera.flyTo({
              destination:Cesium.Cartesian3.fromDegrees(lnglat.x, lnglat.y, 100000),
          });
        }
      }

    },
    flyToCity(cityName){
      let geo = this.cityFeatures.features.filter(item => {
        return item.properties.Name === cityName
      })

      let locationArray = geo[0].geometry.coordinates[0][0]
      console.log("geo:",geo)

      let location = []
      if(locationArray.length > 3){
        location = locationArray[0]
      }else{
        location = locationArray
      }

      viewer.camera.flyTo({
				destination: Cesium.Cartesian3.fromDegrees(location[0], location[1], 100000),
			});

    },
    setCity(item){
      console.log("cityClassify:",item)
      this.cityClassifyNow = this.cityClassify["CITYS"][item]
    },
    /**
     * 进入全屏模式。目前并不是所有的浏览器都实现了无前缀版本的API（2018-12-10）
     */
    launchFullscreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    },
    /**
     * 退出全屏模式。兼容模式。
     */
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
  },
  watch: {
    isInitViewer(val) {
      if (val) {
        this.initCompass();
      }
    }
  }
};
</script>

<style lang="scss"  scoped>
@import "compass";
</style>

