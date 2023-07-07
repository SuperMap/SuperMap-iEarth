<template>
  <div class="layer-list-box">
    <!-- <button @click="consoleTree">查看树</button>
    <button @click="consoleViewer">查看viewer</button>
    <button @click="delMvt">删除MVT</button> -->
    <n-tree
      block-line
      :data="layerStore.layerTreeData"
      :render-suffix="renderSuffix"
      cascade
      default-expand-all="true"
    />
  </div>
</template>

<script setup lang="ts">
import { useLayerStore } from "@/store/index";
import {
  TreeOption,
  NIcon,
  NButton,
  NDropdown,
} from "naive-ui";
import {
  Eye,
  EyeOff,
  EllipsisVertical,
  // LocateOutline,
  LocationSharp,
  Trash
} from "@vicons/ionicons5";
import { h } from "vue";
import { usePanelStore } from "@/store";
const panelStore = usePanelStore();
const layerStore = useLayerStore();
let currentTerrainProvider: any; // 保存当前地形图层，方便控制其显隐

// 测试用
// function consoleTree(){
//   console.log("tree:",layerStore.layerTreeData)
// }
// function consoleViewer(){
//   console.log("viewer:",viewer)
// }
// function delMvt(){
//   console.log("MVT:",viewer.scene._vectorTileMaps._layerQueue);
//   viewer.scene.removeVectorTilesMap('JingJinMVT'); // 当前包删除MVT有问题
// };

// 给树添加icon
function renderSuffix({ option }: { option: TreeOption | any }) {
  if (!option.children) {
    return h("div", {}, [
      h(
        NButton,
        {
          bordered: false,
          text: true,
          title: "显隐",
          onClick: (e) => {
            console.log(e)
            console.log("option:",option)
            if (!option.key) return;
            let optionKey: any = option.key;
            if (optionKey.indexOf("-") != -1) {
              let index = optionKey.split("-")[1];
              switch (option.type) {
                case "s3m":
                  viewer.scene.layers._layerQueue[index].visible =
                    !viewer.scene.layers._layerQueue[index].visible;
                    layerStore.isShowLayer(option);
                  break;
                case "imagery":
                  viewer.imageryLayers._layers[index].show =
                    !viewer.imageryLayers._layers[index].show;
                    layerStore.isShowLayer(option);
                  break;
                case "mvt":
                  viewer.scene._vectorTileMaps._layerQueue[index].show =
                    !viewer.scene._vectorTileMaps._layerQueue[index].show;
                    layerStore.isShowLayer(option);
                  break;
                case "terrain":
                  if (!currentTerrainProvider) {
                    currentTerrainProvider = viewer.terrainProvider;
                    viewer.terrainProvider =
                      new SuperMap3D.EllipsoidTerrainProvider();
                  } else {
                    viewer.terrainProvider = currentTerrainProvider;
                    currentTerrainProvider = null;
                  }
                  layerStore.isShowLayer(option);
                  break;
                default:
                  break;
              }
              // updateTree();
              // state.isCheckItem = false;
            }
          },
        },
        {
          icon: () => h(option.isShow ? h("i", { class: "iconfont iconkejian", style:'color:rgba(255, 255, 255, 0.65)' }, "") : 
          h("i", { class: "iconfont iconyincang",style:'color:rgba(255, 255, 255, 0.65)' }, "")),
        }
      ),
      h(
        NDropdown,
        {
          trigger: "click",
          placement: "right-start",
          options: option.type === 's3m' ? [
            {
              label: "快速定位",
              key: 1,
              icon: () => h("i", { class: "iconfont icondingwei" }, ""), 
            },
            // {
            //   label: "图层操作",
            //   key: 2,
            //   icon: () => h("i", { class: "iconfont iconyidong" }, ""), 
            // },
            // {
            //   label: "图层属性",
            //   key: 3,
            //   icon: () => h("i", { class: "iconfont icontishi" }, ""), 
            // },
            // {
            //   label: "图层风格",
            //   key: 4,
            //   icon: () => h("i", { class: "iconfont icontuceng" }, ""), 
            // },
            {
              label: "移除",
              key: 5,
              icon: () => h("i", { class: "iconfont iconshanchu", style: "color: #DC5849"}, ""),
            },
          ]:[{
              label: "移除",
              key: 5,
              icon: () => h("i", { class: "iconfont iconshanchu", style: "color: #DC5849"}, ""),
            }],
          onSelect: (key: any) => {
            // key为1：定位，key为2：删除图层
            if (key === 1) {
              if (option.type === "s3m") {
                let s3mLayer = viewer.scene.layers.find(option.label);
                viewer.flyTo(s3mLayer, { duration: 0 });
              } else if (option.type === "mvt") {
                let index = String(option.key).split("-")[1];
                let mvtLayer = viewer.scene._vectorTileMaps._layerQueue[index];
                var bounds = mvtLayer.rectangle;
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
              }
            }
            else if(key === 2){
              panelStore.setRightToolBarList({id:7});
            }
            else if(key === 3){
              panelStore.setRightToolBarList({id:8});
            }
            else if(key === 4){
              panelStore.setRightToolBarList({id:9});
            }
            else if (key === 5) {
              // 删除图层之后 再显隐会有问题，不通过id
              let type = option.type;
              let layerName = option.label;
              let layerIndex = option.key.split("-")[1];
              if (type === "s3m") {
                viewer.scene.layers.remove(layerName);
                layerStore.removeLayer(option);
              }
              if (type === "imagery") {
                // console.log("option:",option);
                let delImagelayer = viewer.imageryLayers._layers[layerIndex];
                viewer.imageryLayers.remove(delImagelayer);
                layerStore.removeLayer(option);
              }
              if (type === "mvt") {
                let mvtLayerName = layerStore.MVTLayerNameList[layerIndex];
                viewer.scene.removeVectorTilesMap(mvtLayerName);
                layerStore.removeLayer(option);
                // let mvtLayerName = GlobalStore.MVTLayerNameList[layerIndex];
                // viewer.scene.removeVectorTilesMap(mvtLayerName);
                // updateTree();
                // GlobalStore.MVTLayerNameList = [];
              }
              if (type === "terrain") {
                viewer.terrainProvider =
                  new SuperMap3D.EllipsoidTerrainProvider();
                  layerStore.removeLayer(option);
              }
            }
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
                onClick: (e) => {},
              },
              {
                icon: () => h(EllipsisVertical),
              }
            ),
        }
      ),
    ]);
  }

  // if (option.label == "1-1-1") {
  //   return h("div", {}, [
  //     h("div", {}, [
  //       h(
  //         NButton,
  //         {
  //           bordered: false,
  //           text: true,
  //           title: "",
  //           onClick: (e) => {},
  //         },
  //         {
  //           icon: () =>
  //             h(NIcon, { size: 14 }, { default: () => h(EllipsisVertical) }),
  //         }
  //       ),
  //     ]),
  //   ]);
  // }
}
function changelabelStyle({ option }: { option: any }){
  console.log(option)
} 
</script>

<style lang="scss" scoped>
.layer-list-box{
  padding: 0px 6px;
}
</style>
