<template>
  <div class="layer-tree-box">
    <n-tree
      cascade
      draggable
      block-line
      default-expand-all="true"
      virtual-scroll
      style="max-height: 5rem;"
      :data="layerTreeData"
      :render-suffix="renderSuffix"
      :node-props="checkCamera"
      :render-label="nodelabel"
      @drop="handleDrop"
    />
  </div>
</template>

<script setup lang="ts">
import { h, ref, nextTick, onMounted, onBeforeUnmount } from "vue";
import { TreeOption, NButton, NDropdown, NInput, NEllipsis } from "naive-ui";
import { usePanelStore } from "@/store";
import { useLayerStore } from "@/store/index";
import { LayerEnum, PanelNameEnum } from "@/enums/layerEnum";

const panelStore = usePanelStore();
const layerStore = useLayerStore();

enum OperationEnum {
  LayerLocate = 'locate',
  LayerOpration = "opration",
  LayerAttribute = "attribute",
  LayerStyle = "style",
  LayerQuery = "query",
  LayerTheme = "thematic",
  ImageRaiseOne = "raiseOne",
  ImageLowerOne = "lowerOne",
  ImageRaiseToTop = "raiseToTop",
  ImageLowerToBottom = "lowerToBottom",
  ImageMapQuery = "mapQuery",
  ImageMapCover = "mapCover",
  ImageSetAsBaseMap = "setAsBaseMap",
  QXSingle = "single",
  MvtStyle = "mvtStyle",
  ReName = "rename",
  ReMove = "remove",
  AddGroup = "addGroup",
  RemoveCollection = "removeCollection",
}


let intervalID;

let layerTreeData = layerStore.layerTreeData;

let currentTerrainProvider: any; // 保存当前地形图层，方便控制其显隐

onMounted(() => {
  layerStore.updateLayer({ type: "s3m" });
  layerStore.updateLayer({ type: "imagery" });
  layerStore.updateLayer({ type: "mvt" });
  layerStore.updateLayer({ type: "terrain" });
});

onBeforeUnmount(()=>{
  if(intervalID) clearInterval(intervalID);
})

if (window.customConfig && window.customConfig.useLayerTreeAutoUpdate) {
  intervalID = setInterval(() => {
    layerStore.updateLayer({ type: "s3m" });
  }, 2000);
}

// 给树添加icon
function renderSuffix({ option }: { option: TreeOption | any }) {
  if (!option.children) {
    return h("div", {}, [
      h(
        NButton,
        {
          bordered: false,
          text: true,
          title: $t("isShow"),
          style: "margin-right:0.04rem",
          focusable: false, // 取消focus效果
          onClick: () => {
            setLayerShow(option);
          },
        },
        {
          icon: () =>
            h(
              option.isShow
                ? h(
                    "i",
                    {
                      class: "iconfont iconkejian",
                    },
                    ""
                  )
                : h(
                    "i",
                    {
                      class: "iconfont iconyincang",
                    },
                    ""
                  )
            ),
        }
      ),
      h(
        NDropdown,
        {
          trigger: "click", // click | hover
          placement: "right-start",
          options: setOptionsByType(option.type),
          onSelect: (key: any) => {
            setDropdownAction(option, key);
          },
        },
        {
          default: () =>
            h(
              NButton,
              {
                bordered: false,
                text: true,
                title: "",
                focusable: false, // 取消focus效果
                onClick: (e) => {},
              },
              {
                icon: () => h("i", { class: "iconfont icongengduo" }, ""),
              }
            ),
        }
      ),
    ]);
  }else if(option.type==LayerEnum.S3MROOT){ // S3M图层
    return h("div", {}, [
      h(
        NButton,
        {
          bordered: false,
          text: true,
          title: $t("addGroup"),
          style: "margin-right:0.04rem",
          focusable: false, // 取消focus效果
          onClick: () => {
            addLayerCollection(option);
          },
        },
        {
          icon: () => h("i", { class: "iconfont iconxinjianwenjian", style: "color: rgba(255,255,255,0.65)" }, ""),
        }
      )
    ]);
  }else if(option.type==LayerEnum.Collection){
    return h("div", {}, [
      h(
        NButton,
        {
          bordered: false,
          text: true,
          title: $t("isShow"),
          style: "margin-right:0.04rem",
          focusable: false, // 取消focus效果
          onClick: () => {
            setCollectionShow(option);
          },
        },
        {
          icon: () =>
            h(
              option.isShow
                ? h(
                    "i",
                    {
                      class: "iconfont iconkejian",
                    },
                    ""
                  )
                : h(
                    "i",
                    {
                      class: "iconfont iconyincang",
                    },
                    ""
                  )
            ),
        }
      ),
      h(
        NDropdown,
        {
          trigger: "click", // click | hover
          placement: "right-start",
          options: setOptionsByType(option.type),
          onSelect: (key: any) => {
            setDropdownAction(option, key);
          },
        },
        {
          default: () =>
            h(
              NButton,
              {
                bordered: false,
                text: true,
                title: "",
                focusable: false, // 取消focus效果
                onClick: (e) => {},
              },
              {
                icon: () => h("i", { class: "iconfont icongengduo" }, ""),
              }
            ),
        }
      ),
    ]);
  }else if(option.type==LayerEnum.Group){
    return h("div", {}, [
      h(
        NButton,
        {
          bordered: false,
          text: true,
          title: $t("isShow"),
          style: "margin-right:0.04rem",
          focusable: false, // 取消focus效果
          onClick: () => {
            setGroupShow(option);
          },
        },
        {
          icon: () =>
            h(
              option.isShow
                ? h(
                    "i",
                    {
                      class: "iconfont iconkejian",
                    },
                    ""
                  )
                : h(
                    "i",
                    {
                      class: "iconfont iconyincang",
                    },
                    ""
                  )
            ),
        }
      ),
      h(
        NButton,
        {
          bordered: false,
          text: true,
          title: $t("remove"),
          style: "margin-right:0.04rem",
          focusable: false, // 取消focus效果
          onClick: () => {
            delLayerGroup(option);
          },
        },
        {
          icon: () => h("i", { class: "iconfont iconshanchu", style: "color: #DC5849" }, ""),
        }
      ),
    ]);
  }
}

// 根据图层类型设置不同的下拉操作选项
function setOptionsByType(type: string) {
  if (type === LayerEnum.S3M) {
    return [
      {
        label: $t("rapidLocate"),
        key: OperationEnum.LayerLocate,
        icon: () => h("i", { class: "iconfont icondingwei" }, ""),
      },
      {
        label: $t("layerOpration"),
        key: OperationEnum.LayerOpration,
        icon: () => h("i", { class: "iconfont iconyidong" }, ""),
      },
      {
        label: $t("layerAttribute"),
        key: OperationEnum.LayerAttribute,
        icon: () => h("i", { class: "iconfont icontishi" }, ""),
      },
      {
        label: $t("layerStyle"),
        key: OperationEnum.LayerStyle,
        icon: () => h("i", { class: "iconfont icontucengfengge" }, ""),
      },
      {
        label: $t("layerQuery"),
        key: OperationEnum.LayerQuery,
        icon: () => h("i", { class: "iconfont iconchaxun" }, ""),
      },
      {
        label: $t("qxSingle"),
        key: OperationEnum.QXSingle,
        icon: () => h("i", { class: "iconfont iconqingxiedantihua" }, ""),
      },
      // {
      //   label: $t("thematicMap"),
      //   key: OperationEnum.LayerTheme,
      //   icon: () => h("i", { class: "iconfont iconqingxiedantihua" }, ""),
      // },
      {
        label: $t("rename"),
        key: OperationEnum.ReName,
        icon: () => h("i", { class: "iconfont iconzhongmingming" }, ""),
      },
      {
        label: $t("remove"),
        key: OperationEnum.ReMove,
        icon: () =>
          h(
            "i",
            { class: "iconfont iconshanchu", style: "color: #DC5849" },
            ""
          ),
      },
    ];
  } else if (type === LayerEnum.Imagery) {
    return [
      {
        label: $t("rapidLocate"),
        key: OperationEnum.LayerLocate,
        icon: () => h("i", { class: "iconfont icondingwei" }, ""),
      },
      {
        label: $t("raiseOne"),
        key: OperationEnum.ImageRaiseOne,
        icon: () => h("i", { class: "iconfont iconshangyiyiceng" }, ""),
      },
      {
        label: $t("lowerOne"),
        key: OperationEnum.ImageLowerOne,
        icon: () => h("i", { class: "iconfont iconxiayiyiceng" }, ""),
      },
      {
        label: $t("raiseToTop"),
        key: OperationEnum.ImageRaiseToTop,
        icon: () => h("i", { class: "iconfont iconzhiding" }, ""),
      },
      {
        label: $t("lowerToBottom"),
        key: OperationEnum.ImageLowerToBottom,
        icon: () => h("i", { class: "iconfont iconzhidi" }, ""),
      },
      {
        label: $t("mapQuery"),
        key: OperationEnum.ImageMapQuery,
        icon: () => h("i", { class: "iconfont icondituchaxun" }, ""),
      },
      {
        label: $t("mapCover"),
        key: OperationEnum.ImageMapCover,
        icon: () => h("i", { class: "iconfont iconditudiejiaqingxie" }, ""),
      },
      {
        label: $t("setAsBaseMap"),
        key: OperationEnum.ImageSetAsBaseMap,
        icon: () => h("i", { class: "iconfont iconshezhi" }, ""),
      },
      {
        label: $t("rename"),
        key: OperationEnum.ReName,
        icon: () => h("i", { class: "iconfont iconzhongmingming" }, ""),
      },
      {
        label: $t("remove"),
        key: OperationEnum.ReMove,
        icon: () =>
          h(
            "i",
            { class: "iconfont iconshanchu", style: "color: #DC5849" },
            ""
          ),
      },
    ];
  } else if (type === LayerEnum.MVT) {
    return [
      {
        label: $t("rapidLocate"),
        key: OperationEnum.LayerLocate,
        icon: () => h("i", { class: "iconfont icondingwei" }, ""),
      },
      // {
      //   label: $t("mvtStyle"),
      //   key: OperationEnum.MvtStyle,
      //   icon: () => h("i", { class: "iconfont icontucengfengge" }, ""),
      // },
      {
        label: $t("rename"),
        key: OperationEnum.ReName,
        icon: () => h("i", { class: "iconfont iconzhongmingming" }, ""),
      },
      {
        label: $t("remove"),
        key: OperationEnum.ReMove,
        icon: () =>
          h(
            "i",
            { class: "iconfont iconshanchu", style: "color: #DC5849" },
            ""
          ),
      },
    ];
  } else if(type === LayerEnum.Collection){
    return [
      {
        label: $t("addGroup"),
        key: OperationEnum.AddGroup,
        icon: () => h("i", { class: "iconfont iconzhongmingming" }, ""),
      },
      {
        label: $t("remove"),
        key: OperationEnum.RemoveCollection,
        icon: () =>
          h(
            "i",
            { class: "iconfont iconshanchu", style: "color: #DC5849" },
            ""
          ),
      },
    ];
  }else {
    return [
      {
        label: $t("rename"),
        key: OperationEnum.ReName,
        icon: () => h("i", { class: "iconfont iconzhongmingming" }, ""),
      },
      {
        label: $t("remove"),
        key: OperationEnum.ReMove,
        icon: () =>
          h(
            "i",
            { class: "iconfont iconshanchu", style: "color: #DC5849" },
            ""
          ),
      },
    ];
  }
}

// 添加图层集合
function addLayerCollection(option: any) {
  let time = new Date().getTime();
  let newOption = {
    "label": `新建集合_${time}`,
    "id": `${LayerEnum.Collection}-${time}`,
    "key": `1-${time}`,
    "type": LayerEnum.Collection,
    "isEdit": false,
    "isShow": true,
    "children": [],
    "parent":option
  }
  option.children.push(newOption);
}


function setCollectionShow(option:any){
  console.log("显隐Option:",option);
  option.isShow = !option.isShow;
  option.children.forEach(child=>{
    if(child.type==LayerEnum.S3M){
      setLayerShow(child, option.isShow);
    }else if(child.type == LayerEnum.Group){
      setGroupShow(child, option.isShow);
    }else{
      console.log('其他类型:',child)
    }
  })
}

function delCollection(option:any){
  console.log("删除Option:",option);
  option.children.forEach(child=>{
    if(child.type==LayerEnum.S3M){
      delLayerOption(child, false);
    }else if(child.type == LayerEnum.Group){
      delLayerGroup(child, false);
    }else{
      console.log('其他类型:',child)
    }
  })
  option.parent.children = option.parent.children.filter(item => item.id != option.id);

  // 代码层面似乎解决不了，这里暂时用切换组件的方式来刷新layerTree
  setTimeout(() => {
    let closeDom: any = document.getElementsByClassName('iconguanbi')[0];
    closeDom.click();
    setTimeout(() => {
      let layerDom: any = document.getElementsByClassName('icontuceng')[0];
      layerDom.click();
    });
  });
}

// 添加图层分组
function addLayerGroup(option: any) {
  let time = new Date().getTime();
  let newOption = {
    "label": `新建分组_${time}`,
    "id": `${LayerEnum.Group}-${time}`,
    "key": `1-${time}`,
    "type": LayerEnum.Group,
    "isEdit": false,
    "isShow": true,
    "children": [],
    "parent":option
  }
  option.children.push(newOption);
}

// 控制图层分组显隐
function setGroupShow(option:any,isCansee=undefined){
  option.isShow = isCansee != undefined ? isCansee : !option.isShow;
  option.children.forEach(item => {
    setLayerShow(item, option.isShow);
  });
}

// 删除图层分组；TODO：一旦删除图层分组，删除图层组里面的单个图层列表上不会消失，得关闭图层列表再打开才行
function delLayerGroup(option:any, isDelLayer=false){
  option.children.forEach(item => {
    if(item.layer && isDelLayer){
      viewer.scene.layers.remove(item.layer.name);
    }
  });
  option.parent.children = option.parent.children.filter(item=>item.id != option.id);
  // 直接用layerTreeData[0].children也不行，不知道怎么回事
  // option.parent.children.map((item, index) => {
  //   if (item.id == option.id) {
  //     option.parent.children.splice(index, 1)
  //   }
  // })
  // option.parent.children[option.parent.children.length-2].children = undefined; // 这也不行，图层列表还是会失效
  // layerStore.updateS3M(true);

  // 代码层面似乎解决不了，这里暂时用切换组件的方式来做
  setTimeout(() => {
    let closeDom:any = document.getElementsByClassName('iconguanbi')[0];
    closeDom.click();
    setTimeout(() => {
      let layerDom:any = document.getElementsByClassName('icontuceng')[0];
      layerDom.click();
    });
  });
}

// 控制图层显隐
function setLayerShow(option: any, isCansee=undefined) {
  if (!option.key) return;
  switch (option.type) {
    case LayerEnum.S3M:
      if(!option.layer) return;
      option.layer.visible = isCansee != undefined ? isCansee : !option.layer.visible;
      option.isShow = option.layer.visible;
      break;
    case LayerEnum.Imagery:
      if(!option.layer) return;
      option.layer.show = !option.layer.show;
      option.isShow = option.layer.show;
      break;
    case LayerEnum.MVT:
      if(!option.id) return;
      // option.layer.show = !option.layer.show; // 这样包了一层,似乎无法控制MVT了
      // option.isShow = option.layer._show;

      // 通过MVT图层控制显隐
      // let mvtLayer = viewer.scene.getVectorTilesMap(option.id);
      // if(!mvtLayer){
      //   let index = String(option.key).split("-")[1];
      //   mvtLayer = viewer.scene._vectorTileMaps._layerQueue[Number(index)];
      // }
      // if(!mvtLayer) return;
      // mvtLayer.show = !mvtLayer.show; 
      // option.isShow = mvtLayer.show;

      // 通过mapboxstyle子图层控制显隐
      const mvtLayer = viewer.scene.mapboxMap;
      if (mvtLayer.getLayoutProperty(option.id, 'visibility') === "visible") {
        mvtLayer.setLayoutProperty(option.id, 'visibility', 'none');
        option.isShow = false;
      } else {
        mvtLayer.setLayoutProperty(option.id, 'visibility', 'visible');
        option.isShow = true;
      }
      break;
    case LayerEnum.Terrain:
      if (!currentTerrainProvider) {
        currentTerrainProvider = viewer.terrainProvider;
        viewer.terrainProvider = new SuperMap3D.EllipsoidTerrainProvider();
      } else {
        viewer.terrainProvider = currentTerrainProvider;
        currentTerrainProvider = null;
      }
      option.isShow = !option.isShow;
      break;
    default:
      break;
  }
}

// 移除单个图层
function delLayerOption(option, isDelLayer=true){
    // 删除图层之后 再显隐会有问题，不通过id
    let type = option.type;
    let targetID = option.id;
    let targetLayer = option.layer;
    let layerIndex = option.key.split("-")[1];
    if (type === LayerEnum.S3M) {
      if(!targetLayer) return;
      if(isDelLayer) viewer.scene.layers.remove(targetLayer.name);
      option.parent.children = option.parent.children.filter(item=>item.id != targetID);
    }else if (type === LayerEnum.Imagery) {
      if(!targetLayer) return;
      // if (targetLayer._imageryProvider.url == "./images/earth-skin2.jpg") {
      //   window["$message"].warning($t("delUnsupported"));
      //   return;
      // }
      // viewer.scene.imageryLayers.remove(targetLayer); // 这里直接删除似乎不起作用,还是采用index方式删除
      let delImagelayer = viewer.imageryLayers._layers[layerIndex];
      if(isDelLayer && delImagelayer) viewer.scene.imageryLayers.remove(delImagelayer);
      layerTreeData[1].children = layerTreeData[1].children.filter(item=>item.id != targetID);
    }else if (type === LayerEnum.MVT) {
      if(!targetID) return;
      if(isDelLayer) viewer.scene.mapboxMap.removeLayer(targetID);
      layerTreeData[2].children = layerTreeData[2].children.filter(item=>item.id != targetID);
    }else if (type === LayerEnum.Terrain) {
      if(isDelLayer) viewer.terrainProvider = new SuperMap3D.EllipsoidTerrainProvider();
      layerTreeData[3].children = [];
    }
}

// 下拉列表操作
function setDropdownAction(option: any, key: any) {
  // 获取当前选择的图层名称
  if(option.type === LayerEnum.S3M){
    window.iEarthBindData.CurrentS3MLayerName = option.id; // id中保存的是S3M图层真实的名称
  }else if(option.type === LayerEnum.Imagery){
    window.iEarthBindData.CurrentIMGLayerName = option.label;
  }else if(option.type === LayerEnum.MVT){
    window.iEarthBindData.CurrentMVTStyleLayerSourceName = option.source;
  }
  if (key === OperationEnum.ReName) {
    option.isEdit = true;
    nextTick(() => {
      inputRef.value.focus();
    });
  } else if (key === OperationEnum.LayerLocate) {
    if (option.type === LayerEnum.S3M) {
      let s3mLayer = viewer.scene.layers.find(option.id);
      if (viewer.scene.mode == SuperMap3D.SceneMode.SCENE3D) {
        if (s3mLayer.lon && s3mLayer.lat) { // 一些特殊的坐标系，比如ISVJ-7839中的4508+平面场景，直接flyTo不行，这里参考IServer里面的预览，使用此种方式来定位
          viewer.scene.camera.setView({
            destination: new SuperMap3D.Cartesian3.fromDegrees(s3mLayer.lon, s3mLayer.lat, 500)
          });
        } else {
          viewer.flyTo(s3mLayer, { duration: 0 });
        }
      } else if (viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW) { // 哥伦布视图下可能存在问题，比如ISVJ-7839中，用场景打开，定位就不对了
        if(s3mLayer.layerBounds){
          // 这样定位还是没到准确位置
          // const boundingSphere = SuperMap3D.BoundingSphere.fromRectangle2D(s3mLayer.layerBounds);
          // console.log("boundingSphere:",boundingSphere)
          // viewer.camera.flyToBoundingSphere(boundingSphere, {
          //   duration: 2
          // });

          // 这种办法可以
          const center = SuperMap3D.Rectangle.center(s3mLayer.layerBounds);
          viewer.scene.camera.setView({
            convert: true,
            destination: SuperMap3D.Cartesian3.fromRadians(
              center.longitude,
              center.latitude,
              1000,
            )
          })
        }else if (s3mLayer.positionCartographic_for_colubus) { // 以场景形式打开时，会给图层绑定一个打开后的相机视图定位
          let positionCartographic = s3mLayer.positionCartographic_for_colubus;
          let longitude = Number(SuperMap3D.Math.toDegrees(positionCartographic.longitude));
          let latitude = Number(SuperMap3D.Math.toDegrees(positionCartographic.latitude));
          let height = Number(positionCartographic.height);
          viewer.scene.camera.setView({
            destination: new SuperMap3D.Cartesian3.fromDegrees(longitude, latitude, height),
          });
        } else if (s3mLayer.lon && s3mLayer.lat) { 
          viewer.scene.camera.setView({
            destination: new SuperMap3D.Cartesian3.fromDegrees(s3mLayer.lon, s3mLayer.lat, 500)
          });
        } else {
          viewer.flyTo(s3mLayer, { duration: 0 });
        }
      } else {
        viewer.flyTo(s3mLayer, { duration: 0 });
      }
    } else if (option.type === LayerEnum.MVT) {
      if(!option.source) return;

      // 基于key来计算索引获取MVT图层
      // let mvtLayer = viewer.scene.getVectorTilesMap(option.id);
      // if(!mvtLayer){
      //   let index = String(option.key).split("-")[1];
      //   mvtLayer = viewer.scene._vectorTileMaps._layerQueue[Number(index)];
      // }
      // if(!mvtLayer) return;

      // 基于stylelayer上的source来过滤出MVT图层
      const result = viewer.scene._vectorTileMaps._layerQueue.filter(mvtLayer => {
        if(mvtLayer && mvtLayer._sourceIds){
          return mvtLayer._sourceIds[0] == option.source;
        }
      })
      if(!result || result.length==0) return;

      const mvtLayer = result[0];
      const bounds = mvtLayer.rectangle || mvtLayer._rectangle;
      if (bounds) {
        viewer.scene.camera.flyTo({
          destination: new SuperMap3D.Cartesian3.fromRadians(
            (bounds.east + bounds.west) * 0.5,
            (bounds.north + bounds.south) * 0.5,
            10000
          ),
          duration: 1,
          orientation: {
            heading: 0,
            roll: 0,
          },
        });
      }else if(mvtLayer.customPosition){ // Geojson生成MVT时从第一个feature的geometry获取的坐标信息
        const position = mvtLayer.customPosition;
        if(position.length>=2 && Math.abs(position[0])<=180){
          viewer.scene.camera.setView({
            destination: new SuperMap3D.Cartesian3.fromDegrees(position[0], position[1], 500)
          });
        }
      }
    } else if (option.type === LayerEnum.Imagery) {
      let index = String(option.key).split("-")[1];
      let imgLayer = viewer.imageryLayers._layers[Number(index)];
      if (!imgLayer.wmtsImageLayerPosition) {
        viewer.flyTo(imgLayer);
      } else {
        let wmtsImageLayerPosition = imgLayer.wmtsImageLayerPosition;
        viewer.scene.camera.flyTo({
          destination: new SuperMap3D.Cartesian3.fromDegrees(
            wmtsImageLayerPosition.lng,
            wmtsImageLayerPosition.lat,
            wmtsImageLayerPosition.height
          ),
          duration: 1,
          orientation: {
            heading: 0,
            roll: 0,
          },
        });
      }
    }
  } else if (key === OperationEnum.LayerOpration) {
    panelStore.setRightToolBarList({ id: PanelNameEnum.LayerOpration });
  } else if (key === OperationEnum.LayerAttribute) {
    panelStore.setRightToolBarList({ id: PanelNameEnum.LayerAttribute });
  } else if (key === OperationEnum.LayerStyle) {
    panelStore.setRightToolBarList({ id: PanelNameEnum.LayerStyle });
  } else if (key === OperationEnum.ReMove) {
    delLayerOption(option);
  } else if (key === OperationEnum.LayerQuery) {
    panelStore.setRightToolBarList({ id: PanelNameEnum.LayerQuery });
  } else if (key === OperationEnum.ImageMapQuery) {
    panelStore.setRightToolBarList({ id: PanelNameEnum.ImageMapQuery });
  } else if (key === OperationEnum.QXSingle) {
    panelStore.setRightToolBarList({ id: PanelNameEnum.QXSingle });
  } else if (key === OperationEnum.LayerTheme) {
    panelStore.setRightToolBarList({ id: PanelNameEnum.LayerTheme });
  } else if (key === OperationEnum.ImageRaiseOne) {
    let index = String(option.key).split("-")[1];
    let imgLayer = viewer.imageryLayers._layers[Number(index)];
    if (imgLayer) {
      viewer.imageryLayers.raise(imgLayer);
      layerStore.updateLayer({ type: "imagery" });
    }
  } else if (key === OperationEnum.ImageLowerOne) {
    let index = String(option.key).split("-")[1];
    let imgLayer = viewer.imageryLayers._layers[Number(index)];
    if (imgLayer) {
      viewer.imageryLayers.lower(imgLayer);
      layerStore.updateLayer({ type: "imagery" });
    }
  } else if (key === OperationEnum.ImageRaiseToTop) {
    let index = String(option.key).split("-")[1];
    let imgLayer = viewer.imageryLayers._layers[Number(index)];
    if (imgLayer) {
      viewer.imageryLayers.raiseToTop(imgLayer);
      layerStore.updateLayer({ type: "imagery" });
    }
  } else if (key === OperationEnum.ImageLowerToBottom) {
    let index = String(option.key).split("-")[1];
    let imgLayer = viewer.imageryLayers._layers[Number(index)];
    if (imgLayer) {
      viewer.imageryLayers.lowerToBottom(imgLayer);
      layerStore.updateLayer({ type: "imagery" });
    }
  } else if (key === OperationEnum.ImageMapCover) {
    panelStore.setRightToolBarList({ id: PanelNameEnum.ImageMapCover });
  } else if (key === OperationEnum.MvtStyle) {
    panelStore.setRightToolBarList({ id: PanelNameEnum.MVTStyle });
  } else if (key === OperationEnum.ImageSetAsBaseMap) {
    // 将目标图层设置默认底图
    const layerIndex = option.key.split("-")[1];
    const targetImagelayer = viewer.imageryLayers._layers[layerIndex];
    if(!targetImagelayer) return;
    if(!targetImagelayer._imageryProvider) return;

    // 默认的地球球皮不支持设置为默认底图
    if(targetImagelayer._imageryProvider.url == "./images/earth-skin2.jpg") {
      window["$message"].warning($t('noSupportBaseMap'));
      return;
    }

    let imgLayerUrl = '';
    if(targetImagelayer._imageryProvider instanceof SuperMap3D.SingleTileImageryProvider){
      imgLayerUrl = targetImagelayer._imageryProvider.url;
    }else if(targetImagelayer._imageryProvider instanceof SuperMap3D.TileCoordinatesImageryProvider){
      imgLayerUrl = "GRIDIMAGERY";
    }else if(targetImagelayer._imageryProvider instanceof SuperMap3D.BingMapsImageryProvider){
      imgLayerUrl = "BingMap";
    }else if(targetImagelayer._imageryProvider instanceof SuperMap3D.TiandituImageryProvider){
      imgLayerUrl = "TIANDITU";
    }else if(targetImagelayer._imageryProvider instanceof SuperMap3D.SuperMapImageryProvider){
      const provider = targetImagelayer._imageryProvider;
      imgLayerUrl = provider._url ? provider._url : provider._resource._url;
    }else{
      window["$message"].warning($t('noSupportBaseMap'));
      return;
    }

    window.iEarthBindData.BaseMapOption = {
      name:option.label,
      url:imgLayerUrl
    }

    window["$message"].success(`${option.label}-${$t('baseMapSetSuccess')}`);

    // 删除默认底图:图层和option
    const layerResult = viewer.imageryLayers._layers.filter((imgLayer) => {
      if (imgLayer._imageryProvider && imgLayer._imageryProvider.url) {
        return imgLayer._imageryProvider.url == "./images/earth-skin2.jpg";
      }
    })
    if(layerResult.length === 1) viewer.imageryLayers.remove(layerResult[0]);
  } else if( key === OperationEnum.AddGroup){
    addLayerGroup(option);
  }else if( key === OperationEnum.RemoveCollection){
    delCollection(option);
  }
}

// 可拖拽
function findSiblingsAndIndex(
  node: TreeOption,
  nodes?: TreeOption[]
): [TreeOption[], number] | [null, null] {
  if (!nodes) return [null, null];
  for (let i = 0; i < nodes.length; ++i) {
    const siblingNode = nodes[i];
    if (siblingNode.key === node.key) return [nodes, i];
    const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children);
    if (siblings && index !== null) return [siblings, index];
  }
  return [null, null];
}

// 拖拽相关事件
const supportDragList = ['1','2','3'];
enum dragEnum {
  Inside = 'inside',
  Before = 'before',
  After = 'after'
}
function handleDrop({ node, dragNode, dropPosition }) {
  if(dragNode.type == LayerEnum.Group || dragNode.type == LayerEnum.Collection) {
    window["$message"].warning($t("tree_darg_tip_group_and_collection"));
    return;
  }
  // node为目标节点，dragNode为当前拖拽节点
  let target_level:any,drag_level:any = undefined;
  let target_index: number = -1;
  let drag_index: number = -1;
  if (node && node.key.indexOf("-") != -1) {
    let node_split_arr = node.key.split("-");
    if (node_split_arr.length > 1) {
      target_level = node_split_arr[0];
      target_index = Number(node_split_arr[1]);
    }
  }
  if (dragNode && dragNode.key.indexOf("-") != -1) {
    let dragNode_split_arr = dragNode.key.split("-");
    if (dragNode_split_arr.length > 1) {
      drag_level = dragNode_split_arr[0];
      drag_index = Number(dragNode_split_arr[1]);
    }
  }

  if (!supportDragList.includes(target_level) || !supportDragList.includes(drag_level)) {
    window["$message"].warning($t("tree_darg_tip_img"));
    return;
  }
  if (target_level != drag_level) {
    window["$message"].warning($t("tree_darg_tip_level"));
    return;
  }

  const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
    dragNode,
    layerTreeData
  );
  if (dragNodeSiblings === null || dragNodeIndex === null) return;
  dragNodeSiblings.splice(dragNodeIndex, 1);
  if (dropPosition === dragEnum.Inside) {
    if (node.children) {
      node.children.unshift(dragNode);
    } else {
      node.children = [dragNode];
    }
  } else if (dropPosition === dragEnum.Before) {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, layerTreeData);
    if (nodeSiblings === null || nodeIndex === null) return;
    nodeSiblings.splice(nodeIndex, 0, dragNode);
  } else if (dropPosition === dragEnum.After) {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, layerTreeData);
    if (nodeSiblings === null || nodeIndex === null) return;
    nodeSiblings.splice(nodeIndex + 1, 0, dragNode);
  }
  layerTreeData = Array.from(layerTreeData);

  // 绑定parent
  if(node.type == LayerEnum.S3M){
    dragNode.parent = node.parent;
  }else if(node.type == LayerEnum.Group){
    if(dropPosition == dragEnum.Inside){
      dragNode.parent = node;
    }else{
      dragNode.parent = node.parent;
    }
  }else if(node.type == LayerEnum.Collection){
    if(dropPosition == dragEnum.Inside){
      dragNode.parent = node;
    }else{
      dragNode.parent = node.parent;
    }
  }
  // console.log("node:",node);
  // console.log("dragNode:",dragNode)

  // 拖拽改变图层顺序
  if(target_level == '2' && drag_level == '2'){
    changeLayerOrderByDrag(drag_index, target_index);
  }

  if(target_level == '3' && drag_level == '3'){
    if(node.id && dragNode.id){
      const dragID = dragNode.id;
      const targetID = node.id;

      if(dropPosition === dragEnum.Before){
        viewer.scene.mapboxMap.moveLayer(targetID, dragID);
      }else if(dropPosition === dragEnum.After){
        viewer.scene.mapboxMap.moveLayer(dragID,targetID);
      }
    }else{
      window["$message"].success($t("dragMVTTip"));
    }
  }
}

//节点内容渲染函数
const inputRef = ref();
const nodelabel = ({ option }) => {
  return h(
    "div",
    option.isEdit == true
      ? h(NInput, {
          autofocus: true,
          ref: inputRef,
          size: "small",
          title: option.label,
          value: option.label,
          onUpdateValue: (v) => {
            option.label = v;
            if(option.layer) option.layer.customName = option.label; 
          },
          onChange: () => {
            option.isEdit = false;
          },
          onBlur: () => {
            option.isEdit = false;
          },
        })
      : h(NEllipsis,{
            bordered: false,
            text: true,
            title: option.label,
            focusable: false, // 取消focus效果
          },
          { default: () => option.label }
        )
  );
};

//节点点击事件:双击开启编辑
const checkCamera = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {},
    ondblclick() {
      // if(option.type == LayerEnum.Group || option.type == LayerEnum.Collection) { // 只有图层分组和集合双击才能直接编辑
        option.isEdit = true;
        nextTick(() => {
          inputRef.value.focus();
        });
      // } 
    },
  };
};

// 通过拖拽调整图层顺序
function changeLayerOrderByDrag(drag_index: number, target_index: number) {
  // 影像图层列表中index从下往上为：0 1 2 .. n,所以drag - target < 0，drag才是raise，反之则亦然
  let gap: number = drag_index - target_index;
  let change_count = Math.abs(gap);
  let drag_imgLayer = viewer.imageryLayers._layers[drag_index];
  if (gap > 0) {
    //上 -> 下：lower
    for (let i = 0; i < change_count; i++) {
      viewer.imageryLayers.lower(drag_imgLayer);
    }
  } else if (gap < 0) {
    // 下 -> 上：raise
    for (let i = 0; i < change_count; i++) {
      viewer.imageryLayers.raise(drag_imgLayer);
    }
  } else {
    return;
  }

  layerStore.updateLayer({ type: "imagery" });
}
</script>

<style lang="scss" scoped>
.layer-tree-box {
  padding: 0rem 0.06rem;
}

// 使用:deep强制设置图层列表后缀button颜色
:deep(.n-button) {
  color: rgba(255, 255, 255, 0.65);
}
:deep(.n-button):hover {
  // hover颜色
  color: rgba(255, 255, 255, 0.85);
}
</style>
