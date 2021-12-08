<template>
  <div class="sm-function-module-content" v-show="otherOptions">
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.viewMode }}</label>
      <select class="sm-select" v-model="viewMode">
        <option value="3D">3D</option>
        <option value="2.5D">2.5D</option>
        <option value="2D">2D</option>
      </select>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.multiViewport }}</label>
      <select class="sm-select" v-model="multiViewport">
        <option value="NONE">{{ Resource.onePort }}</option>
        <option value="HORIZONTAL">{{ Resource.horizontalSnap }}</option>
        <option value="VERTICAL">{{ Resource.verticalSnap }}</option>
        <option value="TRIPLE">{{ Resource.tripeSnap }}</option>
        <option value="QUAD">{{ Resource.quadSnap }}</option>
      </select>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.sceneFlood }}</label>
      <br />
      <div class="flexbox">
        <label class="sm-viewshed-label-right">{{
          Resource.openSceneFlood
        }}</label>
        <input type="checkbox" v-model="openSceneFlood" />
        <div style="width: 45%"></div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.threshold }}</label>
        <input
          class="sm-input-long"
          min="0"
          max="1"
          step="0.01"
          type="number"
          v-model="threshold"
          style="width:66%"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.bloomIntensity }}</label>
        <input
          class="sm-input-long"
          min="0"
          max="10"
          step="0.5"
          type="number"
          v-model="bloomIntensity"
          style="width:66%"
        />
      </div>
    </div>
    <div>
      <label class="label-container">{{ Resource.split }}</label>
      </div>
    <div class="sm-function-module-sub-section flexbox choose" style="width:41.5%;">
      <label class="sm-viewshed-label-right">
        <span style="position:relative;left:4px;">{{ Resource.useRoller }}</span>
      </label>
      <input type="checkbox" style="position:relative;bottom:-2px;right:1px;" v-model="useRoller" />
    </div>
    <div class="sm-function-module-sub-section flexbox choose" style="width:41%;position:absolute;right:2%;bottom:22.5%;">
      <label class="sm-viewshed-label-right">{{Resource.modelRoller}}</label>
      <input type="checkbox" style="position:absolute;right:14%;bottom:10px;" v-model="useModelRoller" >
    </div>
    <div class="sm-function-module-sub-section flexbox choose">
      <label class="radio" for="lrRoller">
        <span style="position:relative;left:-21px;">{{Resource.lrRoller}}</span>
        <input
          type="radio"
          name="lrtbRoller"
          id="lrRoller"
          value="lrRoller"
          v-model="lrtbRoller"
        />
      <i style="position:absolute;left:99px;"></i>
      </label>
      <label class="radio" for="tbRoller">
        <span style="position:relative;left:-68px;">{{Resource.tbRoller }}</span>
        <input
           type="radio"
           name="lrtbRoller"
           id="tbRoller"
           value="tbRoller"
           v-model="lrtbRoller"
        />
      <i style="position:absolute;left:59px;"></i>
      </label>
    </div>
    <div
      class="sm-function-module-sub-section flexbox choose"
      v-show="lrtbRoller == 'lrRoller'"
    >
      <label class="radio" for="leftRoller">
      <span style="position:relative;left:-21px;">{{Resource.leftRoller}}</span>
      <input
        type="radio"
        name="lrRoller"
        id="leftRoller"
        value="leftRoller"
        v-model="lrRoller"
      />
      <i style="position:absolute;left:99px;"></i>
      </label>
      <label class="radio" for="rightRoller">
        <span style="position:relative;left:-67px;">{{Resource.rightRoller }}</span>
        <input
          type="radio"
          name="lrRoller"
          id="rightRoller"
          value="rightRoller"
          v-model="lrRoller"
        />
        <i style="position:absolute;left:59px;"></i>
      </label>
    </div>
    <div class="sm-function-module-sub-section flexbox choose"  v-show="lrtbRoller == 'tbRoller'">
      <label class="radio" for="topRoller">
        <span style="position:relative;left:-21px;">{{Resource.topRoller}}</span>
        <input type="radio"
               name="tbRoller"
               id="topRoller"
               value="topRoller"
               v-model="tbRoller">
        <i style="position:absolute;left:99px;"></i>
      </label>
      <label class="radio" style="margin-left:38px;">
        <span style="position:relative;left:-68px;">{{Resource.bottomRoller}}</span>
        <input type="radio"
               name="tbRoller"
               id="bomRoller"
               value="bomRoller"
               v-model="tbRoller">
        <i style="position:absolute;left:58px;"></i>
      </label>
    </div>
  </div>
</template>

<script>
let rollerShutterConfig;
let blackMarble;
export default {
  name: "sceneOtherOptions",
  data() {
    return {
      sharedState: store.state,
      isDestroyFlag: true,
      viewMode: "3D",
      multiViewport: "NONE",
      openSceneFlood: false,
      threshold: 0.6,
      bloomIntensity: 2.0,
      useRoller: false,
      useModelRoller:false,
      lrtbRoller: "lrRoller",
      lrRoller: "leftRoller",
      tbRoller: "topRoller",
      scratchSwipeRegion:new Cesium.BoundingRectangle(),
      scratchModelSwipeRegion:new Cesium.BoundingRectangle(),
      tRMode:4,
      lrMode:1,
      rrMode:2,
      bRMode:8,
      modelRollerShutterConfig:{
        startX:0.33,
        startY:0.33,
        endX:0.66,
        endY:0.66,
        index:0.66,
        mode:1
      }
    };
  },
  computed: {
    otherOptions: function () {
      return this.sharedState.sceneAtttribute[4];
    },
    SceneAtttributeShow: function () {
      return this.sharedState.toolBar[3];
    },
  },
  beforeDestroy() {},
  mounted() {
    if (this.SceneAtttributeShow && this.otherOptions) {
      this.init();
    }
  },
  methods: {
    //子组件部分
    init() {
      if (rollerShutterConfig) {
        return;
      }
      let windowWidth = document.body.clientWidth; // 窗口宽度
      let windowHeight = document.body.clientHeight; // 窗口高度
      // 卷帘配置参数，以对象方式实现地址传递
      rollerShutterConfig = {
        splitDirection:new Cesium.Cartesian2(Cesium.ImagerySplitDirection.RIGHT,Cesium.ImagerySplitDirection.NONE),//初始时屏蔽左侧
        verticalSplitPosition: windowWidth / 2,
        horizontalSplitPosition: windowHeight / 2,
        latestSplitDirection:null,
        imageryLayers:[]
      };
      if (!document.getElementById("vertical-slider-left")) {
        let f = document.getElementById("cesiumContainer");
        let v = document.createElement("div");
        let h = document.createElement("div");
        let g = document.createElement("div");
        let z = document.createElement("div");
        v.id = "verticalSlider";
        h.id = "horizontalSlider";
        g.id = "vertical-slider-left";
        z.id = "horizontal-slider-top";
        v.style.display = "none";
        h.style.display = "none";
        g.style.display = "none";
        z.style.display = "none";
        f.appendChild(v);
        f.appendChild(h);
        f.appendChild(g);
        f.appendChild(z);
      }
      this.setImageRollerShutterSplit();
      this.bindImagerySliderEvt();
      this.setModelRollerShutterSplit(viewer.scene,this.modelRollerShutterConfig);
      this.bindModelSliderEvt(viewer.scene,this.modelRollerShutterConfig);
    },
    /**
     * 设置卷帘的分割方向及分割条的位置。
     *
     */
    setImageRollerShutterSplit(){
      let splitPosition = null;
      if (
        rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.LEFT, Cesium.ImagerySplitDirection.NONE)) ||
        rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.RIGHT,Cesium.ImagerySplitDirection.NONE))
      ) {
        splitPosition = rollerShutterConfig.verticalSplitPosition;
      } else if (
        rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE,Cesium.ImagerySplitDirection.TOP)) ||
        rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE,Cesium.ImagerySplitDirection.BOTTOM))
      ) {
        splitPosition = rollerShutterConfig.horizontalSplitPosition;
      }
      for (let imageryLayer of rollerShutterConfig.imageryLayers) {
        imageryLayer.splitDirection = rollerShutterConfig.splitDirection;
      }
      if (splitPosition) {
        // 如果禁用卷帘就没有必要设置分割位置
       if(
         rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.LEFT,Cesium.ImagerySplitDirection.NONE))
         || rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.RIGHT,Cesium.ImagerySplitDirection.NONE))
       ){
         viewer.scene.imagerySplitPosition.x = splitPosition / document.body.clientWidth;
       }else if(rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE,Cesium.ImagerySplitDirection.TOP)) ||
          rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE,Cesium.ImagerySplitDirection.BOTTOM))){
         viewer.scene.imagerySplitPosition.y = splitPosition / document.body.clientHeight;
       }
      }
    },
    setImageryRollerMode() {
      let imageryLayers = viewer.imageryLayers;
      if (this.useRoller) {
        for (let i = 0; i < imageryLayers.length; i++) {
          let imageryLayer = imageryLayers.get(i);
          switch (rollerShutterConfig.splitDirection) {
            case Cesium.SplitDirection.LEFT:
              imageryLayer.splitDirection = new Cesium.Cartesian2(
                Cesium.ImagerySplitDirection.RIGHT,
                Cesium.ImagerySplitDirection.NONE
              );
              break;
            case Cesium.SplitDirection.RIGHT:
              imageryLayer.splitDirection = new Cesium.Cartesian2(
                Cesium.ImagerySplitDirection.LEFT,
                Cesium.ImagerySplitDirection.NONE
              );
              break;
            case Cesium.SplitDirection.TOP:
              imageryLayer.splitDirection = new Cesium.Cartesian2(
                Cesium.ImagerySplitDirection.NONE,
                Cesium.ImagerySplitDirection.BOTTOM
              );
              break;
            case Cesium.SplitDirection.BOTTOM:
              imageryLayer.splitDirection = new Cesium.Cartesian2(
                Cesium.ImagerySplitDirection.NONE,
                Cesium.ImagerySplitDirection.TOP
              );
              break;
            default:
              imageryLayer.splitDirection = new Cesium.Cartesian2(
                Cesium.ImagerySplitDirection.NONE,
                Cesium.ImagerySplitDirection.NONE
              );
              break;
          }
        }
      } else {
        for (let i = 0; i < imageryLayers._layers.length; i++) {
          let imageryLayer = imageryLayers.get(i);
          imageryLayer.splitDirection = new Cesium.Cartesian2(
            Cesium.ImagerySplitDirection.NONE,
            Cesium.ImagerySplitDirection.NONE
          );
        }
      }
    },
    /**
     * 注册卷帘分割条的拖拽事件。
     */
    bindImagerySliderEvt(){
      let verticalSlider = document.getElementById("verticalSlider");
      let horizontalSlider = document.getElementById("horizontalSlider");
      verticalSlider.addEventListener('mousedown',mouseDown,false);
      horizontalSlider.addEventListener('mousedown',mouseDown,false);
      let imageryMe = this;
      let windowHeight = document.body.clientHeight;
      document.addEventListener('mouseup',mouseUp,false);
      function mouseUp(e){
        document.removeEventListener('mousemove',sliderMove,false);
      }
      function mouseDown(e){
        document.addEventListener('mousemove',sliderMove,false);
      }
      function sliderMove(e){ //鼠标拖拽时执行

        //解决拖拽鼠标粘滞的问题
        if(e.preventDefault){
          e.preventDefault();
        }else{
          e.returnValue = false;
        }
        if(rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.LEFT,Cesium.ImagerySplitDirection.NONE))
          || rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.RIGHT,Cesium.ImagerySplitDirection.NONE))){
             verticalSlider.style.left = e.clientX + 'px';
             rollerShutterConfig.verticalSplitPosition = e.clientX;
        }else if(rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE,Cesium.ImagerySplitDirection.TOP))
          || rollerShutterConfig.splitDirection.equals(new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE,Cesium.ImagerySplitDirection.BOTTOM))){
          let clientY = e.clientY;
          if(clientY < 0){
            clientY = 0;
          }else if(clientY > windowHeight){
              clientY = windowHeight - document.getElementById("horizontalSlider").style.height;
          }
           horizontalSlider.style.top = clientY + 'px';
          rollerShutterConfig.horizontalSplitPosition = windowHeight - clientY;
        }
        imageryMe.setImageRollerShutterSplit();
      }
    },
    bindModelSliderEvt(scene,modelRollerShutterConfig){
      let that = this;
      let verticalSlider = document.getElementById("vertical-slider-left");
      let horizontalSlider = document.getElementById("horizontal-slider-top");
      verticalSlider.addEventListener('mousedown',function(e){
        mouseDown(e,1);
      },false);
      horizontalSlider.onmousedown = function(e){
        mouseDown(e,2);
      }

      window.addEventListener('resize',function(){
        let width = document.body.clientWidth;
        let height = document.body.clientHeight;
        verticalSlider.style.left = modelRollerShutterConfig.startX * width + 'px';
        horizontalSlider.style.top = modelRollerShutterConfig.startY * height + 'px';
      });

      document.addEventListener('mouseup',mouseUp,false);
      function mouseUp(e){
         document.removeEventListener('mousemove',sliderMove,false);
      }

      function mouseDown(e,index){
        modelRollerShutterConfig.index = index;
        document.addEventListener('mousemove',sliderMove,false);
      }

      function sliderMove(e){
        if(e.preventDefault){
          e.preventDefault();
        }else{
          e.returnValue = false;
        }

        switch(modelRollerShutterConfig.index){
          case 1:
            verticalSlider.style.left = e.clientX + 'px';
            modelRollerShutterConfig.startX = e.clientX / document.body.clientWidth;
            break;
          case 2:
            horizontalSlider.style.top = e.clientY + "px";
            modelRollerShutterConfig.startY = e.clientY / document.body.clientHeight;
            break;
        }
        if(that.useRoller == false && that.useModelRoller){
          that.setModelRollerShutterSplit(scene,modelRollerShutterConfig);
        }

      }
    },
    // 更新卷帘
    updateLrImageryRoller(){
      switch (this.lrRoller) {
        case "leftRoller":
          rollerShutterConfig.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.RIGHT,Cesium.ImagerySplitDirection.NONE);
          break;
        case "rightRoller":
          rollerShutterConfig.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.LEFT,Cesium.ImagerySplitDirection.NONE);
          break;
        default:
          break;
      }
      this.setImageryRollerMode();
      this.setImageRollerShutterSplit();
    },
    updateImageryTbRoller(){
      switch (this.tbRoller) {
        case "topRoller":
          rollerShutterConfig.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE,Cesium.ImagerySplitDirection.BOTTOM);
          break;
        case "bomRoller":
          rollerShutterConfig.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE,Cesium.ImagerySplitDirection.TOP);
          break;
        default:
          break;
      }
      this.setImageryRollerMode();
      this.setImageRollerShutterSplit();
    },
    updateModelTbRoller(){
      switch (this.tbRoller) {
        case "topRoller":
          this.modelRollerShutterConfig.mode = this.bRMode;
          break;
        case "bomRoller":
          this.modelRollerShutterConfig.mode = this.tRMode;
          break;
        default:
          break;
      }
      this.setModelRollerShutterSplit(viewer.scene,this.modelRollerShutterConfig);
    },
    updateModelrRoller(){
      switch (this.lrRoller) {
        case "leftRoller":
          this.modelRollerShutterConfig.mode = this.lrMode;
          break;
        case "rightRoller":
          this.modelRollerShutterConfig.mode = this.rrMode;
          break;
        default:
          break;
      }
      this.setModelRollerShutterSplit(viewer.scene,this.modelRollerShutterConfig);
    },
    updateCameraPosition(useRoller){      //这个函数还有问题，可以不用这个函数，用viewer.flyTo
      if(useRoller){
        let layers = viewer.imageryLayers._layers;
        for(let i=0;i<layers.length;i++){
          viewer.flyTo(layers[i]);
        }
      }else{
        let modelLayers = viewer.scene.layers.layerQueue;
        for(let j=0;j<modelLayers.length;j++){
          viewer.flyTo(modelLayers[j]);
        }
      }
    },
    enableSlider(index){
       let verticalSlider = document.getElementById("vertical-slider-left");
       let horizontalSlider = document.getElementById("horizontal-slider-top");
       verticalSlider.style.display = "none";
       horizontalSlider.style.display = "none";

       if(index & 1){
         verticalSlider.style.display = "block";
       }

       if(index & 4){
         horizontalSlider.style.display = "block";
       }

    },
    setModelRollerShutterSplit(scene,modelRollerShutterConfig){
      let startX = modelRollerShutterConfig.startX;
      let startY = modelRollerShutterConfig.startY;
      let scratchModelSwipeRegion = this.scratchModelSwipeRegion;

      let mode = modelRollerShutterConfig.mode;
      switch(mode){
        case 1:
          Cesium.BoundingRectangle.unpack([startX, 0, 1, 1],0, scratchModelSwipeRegion);
          break;
        case 2:
          Cesium.BoundingRectangle.unpack([0, 0, startX, 1], 0,scratchModelSwipeRegion);
          break;
        case 4:
          Cesium.BoundingRectangle.unpack([0, 0, 1, startY], 0, scratchModelSwipeRegion);
          break;
        case 8:
          Cesium.BoundingRectangle.unpack([0, startY,1,1],0,scratchModelSwipeRegion);
          break;
        default:
          Cesium.BoundingRectangle.unpack([0, 0, 1, 1], 0, scratchModelSwipeRegion);
          break;
      }

      let s3mLayer = scene.layers.layerQueue;
      for(let i=0,j=s3mLayer.length; i<j; i++){
          if(this.useModelRoller){
             s3mLayer[i].swipeEnabled = true;
             s3mLayer[i].swipeRegion = scratchModelSwipeRegion;
          }else{
            s3mLayer[i].swipeEnabled = false;
          }
      }
    },
    imageryState(){
      if(this.useRoller){
        let verticalSlider = document.getElementById("verticalSlider");
        let horizontalSlider = document.getElementById("horizontalSlider");
        if(this.lrtbRoller == "lrRoller"){
          verticalSlider.style.display = "block";
          horizontalSlider.style.display = "none";
        }else if(this.lrtbRoller == "tbRoller"){
          verticalSlider.style.display = "none";
          horizontalSlider.style.display = "block";
        }
      }
    },
    modelState(){
      if(this.useModelRoller){
        let verticalSlider = document.getElementById("vertical-slider-left");
        let horizontalSlider = document.getElementById("horizontal-slider-top");
        if(this.lrtbRoller == "lrRoller"){
          verticalSlider.style.display = "block";
          horizontalSlider.style.display = "none";
        }else if(this.lrtbRoller == "tbRoller"){
          verticalSlider.style.display = "none";
          horizontalSlider.style.display = "block";
        }
      }
    },
    ModelRoller(val){
      if(val){
        if(this.lrtbRoller == "lrRoller"){
          this.modelRollerShutterConfig.mode = 1;
          this.enableSlider(1);
        }else if(this.lrtbRoller == "tbRoller"){
          this.modelRollerShutterConfig.mode = 4;
          this.enableSlider(4);
        }
      }else if(this.useRoller && val == false){
        this.enableSlider(0);
        this.imageryState();
      }else if(this.useRoller == false && val == false){
        this.enableSlider(0);
      }
      this.setModelRollerShutterSplit(viewer.scene,this.modelRollerShutterConfig);
    },
    imageryRoller(val){
      let verticalSlider = document.getElementById("verticalSlider");
      let horizontalSlider = document.getElementById("horizontalSlider");
      if (val) {
        blackMarble = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
          url:"@/../static/images/BlackMarble_2012.jpg"
        }));
        this.updateCameraPosition(this.useRoller);
        rollerShutterConfig.imageryLayers = [blackMarble];
        switch(this.lrtbRoller){
          case "lrRoller":
            verticalSlider.style.display = "block";
            horizontalSlider.style.display = "none";
            this.updateLrImageryRoller();
            break;
          case "tbRoller":
            verticalSlider.style.display = "none";
            horizontalSlider.style.display = "block";
            this.updateImageryTbRoller();
            break;
          default:
            break;
        }
        this.setImageryRollerMode();
        this.setImageRollerShutterSplit();
      } else {
        if(blackMarble !== undefined){
          blackMarble.alpha = 0;
        }
        rollerShutterConfig.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE,Cesium.ImagerySplitDirection.NONE);
        verticalSlider.style.display = "none";
        horizontalSlider.style.display = "none";
        this.setImageryRollerMode();
        this.setImageRollerShutterSplit();
        this.modelState();
      }
    }
  },

  watch: {
    otherOptions(val) {
      if (val) {
        this.init();
      }
    },
    viewMode(value) {
      if (value === "2D") {
        viewer.scene.mode = Cesium.SceneMode.SCENE2D;
      } else if (value === "3D") {
        viewer.scene.mode = Cesium.SceneMode.SCENE3D;
      } else if (value === "2.5D") {
        viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
      }
    },
    multiViewport(value) {
      scene.multiViewportMode = Cesium.MultiViewportMode[value];
    },
    openSceneFlood(val) {
      viewer.scene.bloomEffect.show = val;
      viewer.scene.hdrEnabled = val;
      viewer.scene.toneMappingEnabled = val;
      viewer.scene.bloomEffect.threshold = Number(this.threshold);
      viewer.scene.bloomEffect.bloomIntensity = Number(this.bloomIntensity);
    },
    threshold(val) {
      viewer.scene.bloomEffect.threshold = Number(val);
    },
    bloomIntensity(val) {
      viewer.scene.bloomEffect.bloomIntensity = Number(val);
    },
    useRoller(val) {
      let verticalSlider = document.getElementById("verticalSlider");
      let horizontalSlider = document.getElementById("horizontalSlider");
      if (val) {
        this.useModelRoller = false;
        this.ModelRoller(false);
        blackMarble = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
          url:"@/../static/images/BlackMarble_2012.jpg"
        }));
        this.updateCameraPosition(this.useRoller);
        rollerShutterConfig.imageryLayers = [blackMarble];
        switch(this.lrtbRoller){
          case "lrRoller":
            verticalSlider.style.display = "block";
            horizontalSlider.style.display = "none";
            this.updateLrImageryRoller();
            break;
          case "tbRoller":
            verticalSlider.style.display = "none";
            horizontalSlider.style.display = "block";
            this.updateImageryTbRoller();
            break;
          default:
            break;
        }
        this.setImageryRollerMode();
        this.setImageRollerShutterSplit();
      } else if(this.useModelRoller == false && val == false){
        blackMarble.alpha = 0;
        rollerShutterConfig.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE,Cesium.ImagerySplitDirection.NONE);
        verticalSlider.style.display = "none";
        horizontalSlider.style.display = "none";
        this.setImageryRollerMode();
        this.setImageRollerShutterSplit();
        this.modelState();
      }
    },
    useModelRoller(val){
      if(val){
            this.useRoller = false;
            this.updateCameraPosition(this.useRoller);
            this.imageryRoller(this.useRoller);
            if(this.lrtbRoller == "lrRoller"){
              this.modelRollerShutterConfig.mode = 1;
              this.enableSlider(1);
            }else if(this.lrtbRoller == "tbRoller"){
              this.modelRollerShutterConfig.mode = 4;
              this.enableSlider(4);
            }
         }else if(this.useRoller && val == false){
         this.enableSlider(0);
         this.imageryState();
      }else if(this.useRoller == false && val == false){
         this.enableSlider(0);
      }
      this.setModelRollerShutterSplit(viewer.scene,this.modelRollerShutterConfig);
    },
    lrtbRoller(val) {
        let verticalSlider = document.getElementById("verticalSlider");
        let horizontalSlider = document.getElementById("horizontalSlider");
        switch(val){
         case "lrRoller":
           if(this.useRoller && this.useModelRoller == false){
             verticalSlider.style.display = "block";
             horizontalSlider.style.display = "none";
             this.updateLrImageryRoller();
           }else if(this.useModelRoller && this.useRoller == false){
             this.enableSlider(1);
             this.modelRollerShutterConfig.mode = this.lrMode;
             this.setModelRollerShutterSplit(viewer.scene,this.modelRollerShutterConfig);
           }
          break;
         case "tbRoller":
           if(this.useRoller && this.useModelRoller == false){
             verticalSlider.style.display = "none";
             horizontalSlider.style.display = "block";
             this.updateImageryTbRoller();
           }else if(this.useModelRoller && this.useRoller == false){
             this.enableSlider(4);
             this.modelRollerShutterConfig.mode = this.bRMode;
             this.setModelRollerShutterSplit(viewer.scene,this.modelRollerShutterConfig);
          }
          break;
         default:
            break;
        }
    },
    lrRoller() {
     if(this.useRoller && this.useModelRoller == false){
       this.updateLrImageryRoller();
     }else if(this.useRoller == false && this.useModelRoller){
       this.updateModelrRoller();
     }
    },
    tbRoller() {
     if(this.useRoller && this.useModelRoller == false){
       this.updateImageryTbRoller();
     }else if(this.useRoller == false && this.useModelRoller){
       this.updateModelTbRoller();
     }
    }
  }
};
</script>

<style lang="scss">
@import "otherOptions";
</style>

