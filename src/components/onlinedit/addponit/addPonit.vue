<template>
  <div class="sm-function-module-content" v-show="addPoint">
    <label class="sm-function-module-sub-section-setting">{{
      Resource.symbolicLibrary
    }}</label>
    <div class="symbolicLibrary">
      <div
        v-for="(Options, index) in divData"
        :key="Options.id"
        class="Thematicbox"
        :title="Options.name"
        :ref="'dom' + index"
        @mousedown.stop="move($event, index, Options)"
      >
        <img :src="Options.thumbnail" alt />
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.pointSymbolColor }}</label>
      <ColorPicker v-stopdrag class="sm-colorpicker" editable v-model="pointColor" />
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.Xrotation }}</label>
      <input
        class="sm-input-long"
        min="-180"
        max="180"
        step="1.0"
        type="number"
        v-model="pitch"
      />
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.Yrotation }}</label>
      <input
        class="sm-input-long"
        min="-180"
        max="180"
        step="1.0"
        type="number"
        v-model="roll"
      />
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.Zrotation }}</label>
      <input
        class="sm-input-long"
        min="-180"
        max="180"
        step="1.0"
        type="number"
        v-model="heading"
      />
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.zoom }}</label>
      <input
        class="sm-input-long"
        step="0.1"
        min="0.1"
        type="number"
        v-model="scale"
      />
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.Xmobile }}</label>
      <input
        class="sm-input-long"
        type="number"
        step="0.2"
        v-model="positionX"
      />
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.Ymobile }}</label>
      <input
        class="sm-input-long"
        type="number"
        step="0.2"
        v-model="positionY"
      />
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.Zmobile }}</label>
      <input
        class="sm-input-long"
        type="number"
        step="0.2"
        v-model="positionZ"
      />
    </div>
    <div class="boxchild" style="padding-left: 0">
      <span class="media-hidden" style="font-size: 12px; width: 100%">{{
        Resource.EditingTips
      }}
      </span>
      <button class="tbtn" type="button" @click="clearPolygon">
        {{ Resource.eliminate }}
      </button>
    </div>
  </div>
</template>

<script>
import dataSourece from "../../../data/models";
let s3mInstanceColc;
let firstTime = '',lastTime = '';
export default {
  name: "addPoint",
  data() {
    return {
      sharedState: store.state,
      divData: dataSourece.s3mModels,
      pointColor: "#FFFFFF",
      pitch: 0,
      roll: 0,
      heading: 0,
      scale: 1,
      defaultUrl: null,
      isDestroyFlag: true,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      clientX: 0,
      clientY: 0,
      distX: 0,
      distY: 0,
      active: false,
      dom:null,
      dragPosition:new Cesium.Cartesian2()
    };
  },
  directives:{
    stopdrag:{
      inserted:function(el,binding){
        let element = el;
        element.onmousedown = function(e){
          e.stopPropagation();
        }
      }
    }
  },
  computed: {
    addPoint: function () {
      return this.sharedState.onlineEdit[0];
    },
    onlineEditShow: function () {
      return this.sharedState.toolBar[8];
    },
  },
  mounted() {
    if (this.onlineEditShow && this.addPoint) {
      this.init();
    }
  },
  methods: {
    init() {
      if (s3mInstanceColc) {
        return;
      }
      if(!window.handlerPoint){
        common.initHandler("Point");
      }
      s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
      viewer.scene.primitives.add(s3mInstanceColc);
    },
    pointSelectType(i,Options){
      this.defaultUrl = null;
      this.defaultUrl = Options.path;
      this.heading = 0;
      this.pitch = 0;
      this.roll = 0;
      this.scale = 1;
      this.positionX = 0;
      this.positionY = 0;
      this.positionZ = 0;
      this.isDestroyFlag = false;
      common.handlerDrawing("Point").then((res)=>{
        let that = this;
        s3mInstanceColc.add(that.defaultUrl,{
          position:res.result.object.position,
          hpr:new Cesium.HeadingPitchRoll(
            parseFloat(that.heading),
            parseFloat(that.pitch),
            parseFloat(that.roll)
          ),
          scale:new Cesium.Cartesian3(
            parseFloat(that.scale),
            parseFloat(that.scale),
            parseFloat(that.scale)
          )
        });
        window.handlerPoint.deactivate();
      });
      window.handlerPoint && window.handlerPoint.activate();
    },
    clearPolygon() {
      if (viewer.selectedEntity) {
        let instance = viewer.selectedEntity.primitive;
        let index = viewer.selectedEntity.index;
        instance.updateScale(new Cesium.Cartesian3(0, 0, 0), index);
      }
      common.clearHandlerDrawing("Point");
    },

    updatePointMarkerRotation() {
      if (this.heading === "" || this.pitch === "" || this.roll === "") {
        return;
      }
      // 转换为整数
      let headingValue = Cesium.Math.toRadians(this.heading);
      let pitchValue = Cesium.Math.toRadians(this.pitch);
      let rollValue = Cesium.Math.toRadians(this.roll);
      if (viewer.selectedEntity) {
        let instance = viewer.selectedEntity.primitive;
        let index = viewer.selectedEntity.index;
        instance.updateRotation(
          new Cesium.HeadingPitchRoll(headingValue, pitchValue, rollValue),
          index
        );
      }
    },

    dragPointSelectType(e, Options){
       this.defaultUrl = Options.path;

       this.dragPosition.x = e.clientX;
       this.dragPosition.y = e.clientY;
       let cartesian = viewer.scene.pickPosition(this.dragPosition);
       s3mInstanceColc.add(this.defaultUrl,{
         position:cartesian,
         hpr:new Cesium.HeadingPitchRoll(
           parseFloat(this.heading),
           parseFloat(this.pitch),
           parseFloat(this.roll)
         ),
         scale:new Cesium.Cartesian3(
           parseFloat(this.scale),
           parseFloat(this.scale),
           parseFloat(this.scale)
         )
       })

    },
    //图片拖动事件
    move(e,index,Options){
      e.preventDefault();
      this.dom = this.$refs['dom' + index][0];
      this.active = true;
      // 记录鼠标点击时的坐标
      this.clientX = e.clientX;
      this.clientY = e.clientY;
      // 解析后的 translateX & translateY 的值
      this.targetX = this.dom.getBoundingClientRect().x;
      this.targetY = this.dom.getBoundingClientRect().y;
      // 计算坐标边界
      this.distX = this.clientX - this.targetX;
      this.distY = this.clientY - this.targetY;
      this.dom.style.position = 'fixed';
      this.dom.style.left = this.clientX + 'px';
      this.dom.style.top = this.clientX + 'px';
      this.divData.splice(index, 0, Options);
      firstTime = new Date().getTime();

      let that = this;
      document.onmousemove = (e)=>{
        if (that.active) {
          //计算偏移量
          let moveX = e.clientX - that.distX;
          let moveY = e.clientY - that.distY;
          // 写入 style
          that.dom.className = "Thematicbox";
          that.dom.style.position = 'fixed';
          that.dom.style.left = moveX + 'px';
          that.dom.style.top = moveY + 'px';
        }
      },

      document.onmouseup = (e)=>{
        //鼠标弹起来的时候不再移动
        document.onmousemove = null;

        //预防鼠标弹起来后还会循环(即预防鼠标放上去的时候还会移动)
        document.onmouseup = null;
        that.dom.style.display = "none";
        that.active = false;
        lastTime = new Date().getTime();
        if((lastTime - firstTime)<200){
          //处理单击事件
          that.pointSelectType(index,Options);
        }else{
          //处理拖拽事件
          that.dragPointSelectType(e,Options);
        }
      }
    }

  },

  watch: {
    addPoint: function (val) {
      if (val) {
        this.init();
      }
    },
    onlineEditShow(val) {
      if (val && this.addPoint) {
        this.init();
      }
    },
    pointColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.primitive.type === "Instanced_Object"
      ) {
        let instance = viewer.selectedEntity.primitive;
        let index = viewer.selectedEntity.id;
        instance.updateColor(color, index);
      }
    },
    pitch(val) {
      if (val == "" && Number(val) <= 0) return;
      this.updatePointMarkerRotation();
    },
    roll(val) {
      if (val == "" && Number(val) <= 0) return;
      this.updatePointMarkerRotation();
    },
    heading(val) {
      if (val == "" && Number(val) <= 0) return;
      this.updatePointMarkerRotation();
    },
    scale(val) {
      if (val == "" && Number(val) <= 0) return;
      let scale = Number(val);
      if (viewer.selectedEntity) {
        let instance = viewer.selectedEntity.primitive;
        let index = viewer.selectedEntity.index;
        instance.updateScale(new Cesium.Cartesian3(scale, scale, scale), index);
      }
    },
    positionX(newVal, oldVal) {
      if (newVal == "") return;
      if (viewer.selectedEntity) {
        let instance = viewer.selectedEntity.primitive;
        let x = Number(newVal) - Number(oldVal);
        let enu = Cesium.Transforms.eastNorthUpToFixedFrame(
          instance.position,
          Cesium.Ellipsoid.WGS84,
          new Cesium.Matrix4()
        );
        let offset = new Cesium.Cartesian3(x, 0, 0);
        let newPos = Cesium.Matrix4.multiplyByPoint(
          enu,
          offset,
          new Cesium.Cartesian3()
        );
        instance.updatePosition(newPos);
      }
    },
    positionY(newVal, oldVal) {
      if (newVal == "") return;
      if (viewer.selectedEntity) {
        let instance = viewer.selectedEntity.primitive;
        let y = Number(newVal) - Number(oldVal);
        let enu = Cesium.Transforms.eastNorthUpToFixedFrame(
          instance.position,
          Cesium.Ellipsoid.WGS84,
          new Cesium.Matrix4()
        );
        let offset = new Cesium.Cartesian3(0, y, 0);
        let newPos = Cesium.Matrix4.multiplyByPoint(
          enu,
          offset,
          new Cesium.Cartesian3()
        );
        instance.updatePosition(newPos);
      }
    },
    positionZ(newVal, oldVal) {
      if (newVal == "") return;
      if (viewer.selectedEntity) {
        let instance = viewer.selectedEntity.primitive;
        let z = Number(newVal) - Number(oldVal);
        let enu = Cesium.Transforms.eastNorthUpToFixedFrame(
          instance.position,
          Cesium.Ellipsoid.WGS84,
          new Cesium.Matrix4()
        );
        let offset = new Cesium.Cartesian3(0, 0, z);
        let newPos = Cesium.Matrix4.multiplyByPoint(
          enu,
          offset,
          new Cesium.Cartesian3()
        );
        instance.updatePosition(newPos);
      }
    },
  }
};
</script>

<style lang="scss"  scoped>
@import "addPonit";
  .Thematicbox{
    transform: translate3d(0, 0, 1px);
  }
</style>
