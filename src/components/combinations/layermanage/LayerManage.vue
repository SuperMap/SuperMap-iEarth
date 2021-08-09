<template>
  <div class="layerBox" v-if="LayerManageShow">
    <Tree
      :data="TreeDatas"
      show-checkbox
      @on-contextmenu="handleContextMenu"
      @on-select-change="handleSelectChange"
      @on-check-change="handleCheckChange"
      ref="tree1"
      :title="Resource.RightClickSetLayerProperties"
    >
      <template slot="contextMenu">
        <DropdownItem @click.native="handleContextMenuEdit" v-show="hid">{{Resource.layerOptions}}</DropdownItem>
        <!--        <DropdownItem @click.native="raise" v-show="ImgHid">{{Resource.MoveUpOneLevel}}</DropdownItem>-->
        <!--        <DropdownItem @click.native ="lower" v-show="ImgHid">{{Resource.MoveDownOneLevel}}</DropdownItem>-->
        <!--        <DropdownItem @click.native="raiseToTop" v-show="ImgHid">{{Resource.MoveToTheTop}}</DropdownItem>-->
        <!--        <DropdownItem @click.native="lowerToBottom" v-show="ImgHid">{{Resource.MoveToTheBottom}}</DropdownItem>-->
        <DropdownItem
          @click.native="handleContextMenuDelete"
          style="color: #ed4014"
        >{{Resource.DelLayer}}</DropdownItem>
      </template>
    </Tree>
  </div>
</template>

<script>
import Config from "@/common/js/webServeConfig.js";
import otherTerrainAndImageModels from "../../../data/otherTerrainAndImageData.js";
import BaseLayerModels from "../../../data/BaseLayerData.js";
import BaseTerrainModels from "../../../data/BaseTerrainData.js";
let layersManager;
export default {
  name: "LayerManage",
  data() {
    return {
      sharedState: store.state,
      hid: true,
      ImgHid: false, //影响图层移动默认不显示
      S3MLayersObj: {
        title: Resource.s3mLayer,
        expand: true,
        checked: true,
        type: "S3M",
        children: []
      },
      imgLayersObj: {
        title: Resource.imageryLayer,
        expand: true,
        checked: true,
        type: "IMG",
        children: []
      },
      TerrainLayersObj: {
        title: Resource.terrainLayer,
        expand: true,
        checked: true,
        type: "TERRAIN",
        children: []
      },

      TreeDatas: [
        {
          title: Resource.layerList,
          expand: true,
          children: [],
          type: "ROOT"
        }
      ],
      contextData: null,
      hideS3mNames: [],
      hideImgNames: [],
      hideTerrainNames: [],
      rightContextMenu: false
    };
  },
  computed: {
    LayerManageShow: function() {
      return this.sharedState.toolBar[0];
    },
    imgLayers: function() {
      return this.sharedState.imgLayerManage;
    },
    terrainLayers: function() {
      return this.sharedState.terrainLayerManage;
    },
    S3MLayers: function() {
      return this.sharedState.S3MLayerManage;
    }
  },

  methods: {
    //判断底图面板里面是否有影像被选中
    judgeIsChooseImagery(name) {
      for (let j = 0; j < this.BaseLayers.length; j++) {
        if (this.BaseLayers[j].name === name) {
          this.BaseLayers[j].chooseType = false;
          return;
        }
      }
      for (let key in this.otherTerrainLayers) {
        if (this.otherTerrainLayers[key].imagery.name === name) {
          this.otherTerrainLayers[key].imagery.chooseType = false;
        }
      }
    },

    //获取当前选中图层
    handleSelectChange(d, select) {
      let name = Config.TitleKeyMap[select.title];
      this.flyTo(name, select);
    },
    // 勾选复选框获取图层 --控制显隐
    handleCheckChange(d, check) {
      switch (check.type) {
        case "ROOT":
          this.isHideAllLayers(check.checked);
          break;
        case "S3M":
          let ly = viewer.scene.layers.find(check.title);
          if (check.title == Resource.s3mLayer) {
            let layers = viewer.scene.layers.layerQueue;
            layers.forEach(i => {
              i._visible = check.checked;
            });
            return;
          }
          if (ly) {
            ly._visible = check.checked;
          }
          break;
        case "IMG":
          let layers = viewer.imageryLayers._layers;
          if (check.title == Resource.imageryLayer) {
            layers.forEach((i, index) => {
              if (index == 0) return;
              i.show = check.checked;
            });
            return;
          }
          layers[check.id].show = check.checked;
          break;
        case "TERRAIN":
          if (!check.checked) {
            window.terrainProvider = viewer.terrainProvider;
            viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
          } else {
            viewer.terrainProvider = window.terrainProvider;
          }
          break;
        default:
          null;
      }
    },

    //   获取右键点击当前图层
    handleContextMenu(data) {
      this.contextData = data;
      if (data.type == "S3M") {
        this.hid = true;
        this.ImgHid = false;
      } else if (data.type == "IMG") {
        this.hid = false;
        this.ImgHid = true;
      } else {
        this.hid = false;
        this.ImgHid = false;
      }
    },
    // 鼠标右键查看图层属性
    handleContextMenuEdit() {
      let selectedObj = this.contextData;
      store.setSelectedLayerName(selectedObj.title);
      store.setLayerAttributeToolbal(true);
    },
    // 鼠标右键删除图层
    handleContextMenuDelete() {
      let selectedObj = this.contextData;
      switch (selectedObj.type) {
        case "S3M":
          viewer.scene.layers.remove(selectedObj.title);
          store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
          //   图层加载状态改变，即删除后可加载。
          let name = Config.TitleKeyMap[selectedObj.title];
          iEarth_resource_services.content.some(item => {
            if (item.sceneName == name) {
              item.state = 0;
              return true;
            }
          });
          break;
        case "IMG":
          let ly2 = viewer.imageryLayers._layers[selectedObj.id];
          viewer.imageryLayers.remove(ly2);
          store.setImgLayerManage(viewer.imageryLayers._layers.length);
          let name2 = Config.TitleKeyMap[selectedObj.title];
          this.judgeIsChooseImagery(selectedObj.title);
          iEarth_resource_services.content.some(item => {
            if (item.sceneName == name2) {
              item.state = 0;
              return true;
            }
          });
          break;
        case "TERRAIN":
          viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
          window.terrainProvider = null;
          this.rightContextMenu = true;
          store.setTerrainLayerManage(viewer.terrainProvider.tablename);
          let name3 = Config.TitleKeyMap[selectedObj.title];
          iEarth_resource_services.content.some(item => {
            if (item.sceneName == name3) {
              item.state = 0;
              return true;
            }
          });
          break;
        default:
          null;
      }
    },
    //判断图层父类是否存在及返回索引
    judgeIsExist(type) {
      let d = this.TreeDatas[0].children;
      let i = false;
      if (d.length == 0) return i;
      d.forEach((item, index) => {
        if (item.type == type) {
          i = index;
        }
      });
      return i;
    },

    //判断底图面板里面是否有地形被选中
    judgeIsChooseTerrain() {
      let index;
      for (let m = 0; m < this.BaseTerrainLayers.length; m++) {
        if (this.BaseTerrainLayers[m].chooseType) {
          index = m;
          break;
        }
      }
      for (let key in this.otherTerrainLayers) {
        if (this.otherTerrainLayers[key].terrain.chooseType) {
          index = this.otherTerrainLayers[key].terrain.index;
        }
      }
      return index;
    },

    //图层列表里面影像的名称修正
    setImageryName(IMGlayer) {
      for (let i = 0; i < this.BaseLayers.length; i++) {
        if (this.BaseLayers[i].chooseType) {
          if (this.imgLayersObj.children.length !== 0) {
            if (
              this.imgLayersObj.children[this.imgLayersObj.children.length - 1]
                .title !== this.BaseLayers[i].name
            ) {
              IMGlayer.title = this.BaseLayers[i].name;
              break;
            }
          } else {
            IMGlayer.title = this.BaseLayers[i].name;
            break;
          }
        }
      }
    },

    //记录更新前被隐藏的图层名称
    hideLayers(nameArr, arr) {
      if (arr.length == 0) return;
      nameArr.length = 0; //置空
      arr.forEach(item => {
        if (item.checked == false) {
          nameArr.push(item.title);
        }
      });
    },

    // updatS3M图层
    updataS3MLayer() {
      let _that = this;
      this.hideLayers(this.hideS3mNames, this.S3MLayersObj.children);
      if (viewer) {
        let layers = viewer.scene.layers.layerQueue;
        let index = this.judgeIsExist("S3M"); //获取图层类型父级下标
        if (layers.length == 0 && index === false) {
          return;
        }
        if (layers.length == 0 && index !== false) {
          this.TreeDatas[0].children.splice(index, 1);
          return;
        }
        this.S3MLayersObj.children = [];
        layers.forEach((layer, index) => {
          let S3Mlayer = {
            title: layer._name,
            checked: true,
            contextmenu: true,
            type: "S3M"
          };
          if (this.hideS3mNames.includes(layer._name)) {
            S3Mlayer.checked = false;
          }
          this.S3MLayersObj.children.push(S3Mlayer);
        });
        if (index !== false) {
          this.TreeDatas[0].children.splice(index, 1, this.S3MLayersObj);
          return;
        }
        this.TreeDatas[0].children.push(this.S3MLayersObj);
      } else {
        setTimeout(() => {
          _that.updataS3MLayer();
        }, 2000);
      }
    },

    //updatImg
    updataImgLayers() {
      let _that = this;
      this.hideLayers(this.hideImgNames, this.imgLayersObj.children);
      if (viewer) {
        let layers = viewer.imageryLayers._layers;
        let index = this.judgeIsExist("IMG"); //获取图层类型父级下标
        if (layers.length == 0 && index === false) {
          this.TreeDatas[0].checked = false;
          return;
        }
        if (layers.length == 0 && index !== false) {
          this.TreeDatas[0].children.splice(index, 1);
          return;
        }
        this.imgLayersObj.children = [];
        layers.forEach((layer, index) => {
          let IMGlayer = {
            title: "",
            checked: true,
            contextmenu: true,
            type: "IMG",
            id: index
          };
          //存在图层名称
          if (layer._imageryProvider.tablename) {
            // for(let key in _that.otherTerrainLayers){
            //   if(_that.otherTerrainLayers[key].imagery.chooseType){
            //     IMGlayer.title = _that.otherTerrainLayers[key].imagery.name;
            //     if (_that.hideImgNames.includes(IMGlayer.title)) {
            //       IMGlayer.checked = false;
            //     };
            //     _that.imgLayersObj.children.unshift(IMGlayer);
            //     return;
            //   }
            // }
            // _that.setImageryName(IMGlayer);

            IMGlayer.title = layer._imageryProvider.name;
          } else {
            //不存在，用底图的名称
            _that.setImageryName(IMGlayer);
          }
          if (_that.hideImgNames.includes(IMGlayer.title)) {
            IMGlayer.checked = false;
          }
          _that.imgLayersObj.children.unshift(IMGlayer);
        });
        if (index !== false) {
          this.TreeDatas[0].children.splice(index, 1, this.imgLayersObj);
          return;
        }
        this.TreeDatas[0].children.push(this.imgLayersObj);
      } else {
        setTimeout(() => {
          _that.updataImgLayers();
        }, 2000);
      }
    },

    //updatTerrain
    updataTerrainLayers() {
      let _that = this;
      this.hideLayers(this.hideTerrainNames, this.TerrainLayersObj.children);
      if (viewer) {
        let layers = viewer.terrainProvider;
        let layerIndex = this.judgeIsChooseTerrain();
        if (Cesium.defined(layerIndex)) {
          if (layerIndex < this.BaseTerrainLayers.length) {
            layers.tablename = this.BaseTerrainLayers[layerIndex].name;
          } else {
            layers.tablename = this.otherTerrainLayers["6"]["terrain"].name;
            // layers.tablename = viewer.terrainProvider.tablename;
          }
        }
        let index = this.judgeIsExist("TERRAIN"); //获取图层类型父级下标
        if (!layers.tablename && index === false) {
          return;
        }
        if (this.rightContextMenu || !layers.tablename) {
          this.TreeDatas[0].children.splice(index, 1);
          this.rightContextMenu = false;
          if (layers.tablename && layerIndex < this.BaseTerrainLayers.length) {
            this.BaseTerrainLayers[layerIndex].chooseType = false;
          } else {
            for (let key in this.otherTerrainLayers) {
              this.otherTerrainLayers[key].terrain.chooseType = false;
            }
          }
          layers.tablename = undefined;
          return;
        }

        this.TerrainLayersObj.children = [];
        // if(layers.tablename === "srtm_54_07%40zhufeng" ){
        //    layers.tablename = "珠峰地形";
        // }
        let TerrainLayer = {
          title: layers.tablename,
          checked: true,
          contextmenu: true,
          type: "TERRAIN"
        };
        if (this.hideTerrainNames.includes(layers.tablename)) {
          TerrainLayer.checked = false;
        }
        this.TerrainLayersObj.children.push(TerrainLayer);
        if (index !== false) {
          this.TreeDatas[0].children.splice(index, 1, this.TerrainLayersObj);
          return;
        }
        this.TreeDatas[0].children.push(this.TerrainLayersObj);
      } else {
        setTimeout(() => {
          _that.updataTerrainLayers();
        }, 2000);
      }
    },

    // 相机飞到
    flyTo(scpName, check) {
      let cameraParam = Config.CAMERA_PARAM[scpName];
      if (cameraParam) {
        viewer.scene.camera.flyTo({
          destination: new Cesium.Cartesian3(
            cameraParam.Cartesian3.x,
            cameraParam.Cartesian3.y,
            cameraParam.Cartesian3.z
          ),
          orientation: {
            heading: cameraParam.heading,
            pitch: cameraParam.pitch,
            roll: cameraParam.roll
          },
          duration: 3
        });
        return;
      } else {
        switch (check.type) {
          case "S3M":
            let ly = viewer.scene.layers.find(check.title);
            if (ly) {
              viewer.flyTo(ly);
            }
            break;
          case "IMG":
            let layers = viewer.imageryLayers._layers;
            if (check.id) {
              viewer.flyTo(layers[check.id]);
            }
            break;
          case "TERRAIN":
            return;
            break;
          default:
            null;
        }
      }
    },

    //根节点控制显隐
    isHideAllLayers(f) {
      if (this.TreeDatas[0].children.length === 0) return;
      let S3MLayers = viewer.scene.layers.layerQueue;
      let ImgLayers = viewer.imageryLayers._layers;
      S3MLayers.forEach(i => {
        i._visible = f;
      });
      ImgLayers.forEach((i, index) => {
        if (index == 0) return;
        i.show = f;
      });
      if (!f) {
        window.terrainProvider = viewer.terrainProvider;
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
      } else {
        viewer.terrainProvider = window.terrainProvider;
      }
    },

    //影像图层操作
    raise() {
      let imageryLayers = viewer.imageryLayers._layers;
      let ly = imageryLayers[this.contextData.id];
      viewer.imageryLayers.raise(ly);
      this.updataImgLayers();
    },
    lower() {
      let imageryLayers = viewer.imageryLayers._layers;
      let ly = imageryLayers[this.contextData.id];
      viewer.imageryLayers.lower(ly);
      this.updataImgLayers();
    },
    raiseToTop() {
      let imageryLayers = viewer.imageryLayers._layers;
      let ly = imageryLayers[this.contextData.id];
      viewer.imageryLayers.raiseToTop(ly);
      this.updataImgLayers();
    },
    lowerToBottom() {
      let imageryLayers = viewer.imageryLayers._layers;
      let ly = imageryLayers[this.contextData.id];
      viewer.imageryLayers.lowerToBottom(ly);
      this.updataImgLayers();
    },
    initLayers() {
      this.updataS3MLayer();
      this.updataImgLayers();
      this.updataTerrainLayers();
    }
  },

  watch: {
    LayerManageShow: function(val) {
      this.BaseTerrainLayers = BaseTerrainModels;
      this.BaseLayers = BaseLayerModels;
      this.otherTerrainLayers = otherTerrainAndImageModels;
      let that = this;
      //监听场景内的图层变化: val:true，监听打开;val:false,监听关闭
      if (val) {
        layersManager = setInterval(() => {
          that.initLayers();
        }, 100);
      } else {
        clearInterval(layersManager);
        layersManager = undefined;
      }
    },
    imgLayers: function(val) {
      if (this.LayerManageShow) {
        this.updataImgLayers();
      }
    },
    terrainLayers: function(val) {
      if (this.LayerManageShow) {
        this.updataTerrainLayers();
      }
    },
    S3MLayers: function(val) {
      if (this.LayerManageShow) {
        this.updataS3MLayer();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./LayerManage.scss";
</style>
