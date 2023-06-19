import { defineStore } from 'pinia'
// import { UrlDataSetCreate } from '../store/layerUrlSet/dataSet';
import { UrlDataSetCreate } from '../layerUrlSet/dataSet';

const UrlDataSetCreateTem = UrlDataSetCreate;

export const useLayerTreeStore = defineStore({
  id: 'layerTreeStore',
  state: (): any => ({
    layerList: [
      {
        key: "1",
        label: "所有图层",
        children: [
          {
            key: "1-1",
            label: "S3M图层",
            children: [
              {
                key: "1-1-1",
                label: "build1",
                children: undefined
              },
            ]
          },
          {
            key: "1-2",
            label: "影像图层",
            children: []
          },
          // {
          //   key: "1-3",
          //   label: "MVT图层",
          //   children: []
          // },
          {
            key: "1-4",
            label: "地形图层",
            children: []
          },
        ],
      }
    ],
    onlineBaseLayerList: [{
      url: './images/baseLayers/baseImage.png',
      name: 'global.LocalImage',
      thumbnail: './images/baseLayers/image.jpg',
      title: 'Image',
      type: 'IMAGE',
      imgsrc: '@/../static/css/cross.png',
      chooseType: false,
      isMultipleChoose: false,
      index: 0
    },
    {
      url: '//dev.virtualearth.net/',
      name: 'global.BingMap',
      thumbnail: './images/baseLayers/BingMap.jpg',
      title: 'BingMap',
      type: 'BINGMAP',
      imgsrc: '@/../static/css/cross.png',
      key: "Aq0D7MCY5ErORA9vrwFtfE9aancUq5J6uNjw0GieF0ostaIrVuJZ8ScXxNHHvEwS",
      chooseType: false,
      isMultipleChoose: false,
      index: 1
    },
    {
      url: 'https://[subdomain].tianditu.gov.cn/img_w/wmts',
      name: 'global.TIANDITU',
      thumbnail: './images/baseLayers/tianditu.jpg',
      token: '7933ae29d47bcf1440889ad983dbe0af',
      title: '天地图',
      type: 'TIANDITU',
      imgsrc: '@/../static/css/cross.png',
      chooseType: false,
      isMultipleChoose: false,
      index: 2
    },
    {
      url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      name: 'global.OSM',
      thumbnail: './images/baseLayers/OSM.jpg',
      title: 'Open Street Map',
      type: 'OSM',
      imgsrc: '@/../static/css/cross.png',
      subdomains: ["a", "b", "c", "d"],
      chooseType: false,
      isMultipleChoose: false,
      index: 3
    },
    {
      name: 'global.GRIDIMAGERY',
      thumbnail: './images/baseLayers/grad.jpg',
      title: 'Grid Image Map',
      type: 'GRIDIMAGERY',
      imgsrc: '@/../static/css/cross.png',
      chooseType: false,
      isMultipleChoose: false,
      index: 4
    }
    ],
    showSaveDialog: false,
    sceneCurrentTime: '',
  }),
  getters: {
  },
  actions: {
    // 保存弹窗显示
    setShowSaveDialog(isShow: any) {
      this.showSaveDialog = isShow;
      if (isShow) {
        this.sceneCurrentTime = this.getNowFormatDate();
        this.outputSceneToFile();
      }
    },
    // 更新图层
    updatelayerList(type: any) {
      // 清空
      this.layerList.map((item: any) => {
        item.children.children = []
      });
      if (type == "REALSPACE") {
        // s3m图层
        this.layerList[0].children[0].children.length = 0;
        viewer.scene.layers._layerQueue.forEach((S3Mlayer: any, index: string) => {
          this.layerList[0].children[0].children.push({
            label: S3Mlayer.name,
            key: "1-1" + String(index),
            type: "s3m",
            children: undefined
          });
        });

        console.log("viewer.scene.layers._layerQueue", viewer.scene.layers._layerQueue);
        

        // img
        this.updateBaseImage()
        // tterrain
        this.updateBaseTerrain()
      }

      // mvt
      if (type == "MVT") {
        viewer.imageryLayers._layers.forEach((imageryLayer: any, index: string) => {
          let imageryLayerName = this.getImageryLayerName(imageryLayer);
          this.layerList[0].children[1].children.push({
            label: imageryLayerName,
            key: "1-2-" + String(index),
            type: "imagery",
            children: undefined
          });
        });
      }
      // ThematicMap
      if (type == "ThematicMap") {
        // if (terrainLayerName === "无地形") return;
        // treeData.children[3].children[0] = {
        //   label: terrainLayerName,
        //   key: "terrain-1",
        //   type: "terrain",
        // };
      }
    },
    // 传入影像图层，获取并返回他在项目中的名称
    getImageryLayerName(imageryLayer: any) {
      let imageUrl = imageryLayer._imageryProvider.url || imageryLayer._imageryProvider._url;
      if (!imageUrl) return window.LangGlobal.global.lnglatMap;
      if (imageUrl.indexOf("earth-skin.jpg") != -1) {
        return window.LangGlobal.global.defaultImage;
      }
      let targetItem = this.onlineBaseLayerList.find((item: any) => item.url === imageUrl)
      if (targetItem) {
        let imgName = targetItem.name.split(".")[1];
        return window.LangGlobal.global[imgName];
      } else if (imageUrl) {
        if (imageUrl.indexOf("realspace/datas/") != -1) {
          let otherImageLayerName = imageUrl.split('realspace/datas/')[1].replace('/', '');
          return otherImageLayerName;
        } else {
          return window.LangGlobal.global.unnamedLayer;
        }
      } else {
        return window.LangGlobal.global.unnamedLayer;
      }
    },
    // 获取现在的时间
    getNowFormatDate() {
      let date = new Date();
      let seperator1 = "-";
      let seperator2 = ":";
      let month: any = date.getMonth() + 1;
      let strDate: any = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentDate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
      return currentDate;
    },
    // 截取缩略图
    outputSceneToFile() {
      let promise = viewer.scene.outputSceneToFile();
      Cesium.when(promise, function (buffer) {
        let canvas: any = document.getElementById("sceneCanvas");
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.src = buffer;
        img.onload = function () {
          ctx.drawImage(img, 0, 0, 298, 150);
        };
      });
    },
    // 更新底图
    updateBaseImage() {
      this.layerList[0].children[1].children.length = 0;
      viewer.imageryLayers._layers.forEach((imageryLayer: any, index: string) => {
        let imageryLayerName = this.getImageryLayerName(imageryLayer);
        // 如果相同就不添加了
        this.layerList[0].children[1].children.push({
          label: imageryLayerName,
          key: "1-2-" + String(index),
          type: "imagery",
          children: undefined
        });
        // 去重
        // let imageryArr = this.layerList[0].children[1].children;
        // if (imageryArr.length > 0) {
        //   for (let i = 0; i < imageryArr.length; i++) {
        //     for (let j = 0; j < imageryArr.length; j++) {
        //       if (imageryArr[i].label == imageryArr[j].label) {
        //         delete imageryArr[j]
        //       }
        //     }
        //   }
        // }

      })
    },
    // 更新地形
    updateBaseTerrain(item?:any){
      this.layerList[0].children[3].children.length = 0;
      if(item){
        this.layerList[0].children[3].children.push({
          label:  window['$t'](item.name),
          key: "1-4-0",
          type: "terrain",
          children: undefined
        });
      }else{
        viewer.terrainProvider._readyPromise.then(()=>{
          let name = viewer.terrainProvider.name || viewer.terrainProvider.tablename ;
          if(name){
            this.layerList[0].children[3].children.push({
              label: name,
              key: "1-4-0",
              type: "terrain",
              children: undefined
            });
          }
        })
      }
    }
  }
})
