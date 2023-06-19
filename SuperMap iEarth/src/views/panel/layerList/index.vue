
<template>
  <!-- 图层列表 -->
  <div class="panle-box-layer">
    <div class="panle-container-layer">
      <div class="panle-header-layer">
        <span class="panle-title">图层列表</span>
        <div class="panel-close" @click="panelCloseHandle">
          <svg-icon name="ui-close" class="close-btn" />
        </div>
      </div>
      <!-- 图层列表树 -->
      <div class="tree-list">
        <n-tree
          block-line
          :data="[treeData]"
          cascade
          :render-suffix="renderSuffix"
          default-expand-all="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch, h } from "vue";
import {
  TreeOption,
  useMessage,
  DropdownOption,
  NIcon,
  NButton,
  NDropdown,
  NEllipsis,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { GlobalStoreCreate } from "@/store/global/global";
import layerManagement from "@/tools/layerManagement";
import {
  Eye,
  EyeOff,
  EllipsisVertical,
  LocateOutline,
  Trash,
} from "@vicons/ionicons5";

import { toolBarStoreCreate } from "@/store/toolBar/toolBar";
const toolBarStore = toolBarStoreCreate();

// import useLayerStore1 from "@/store/index"

// const layerStore = useLayerStore1()

const GlobalStore = GlobalStoreCreate();
const { SceneLayerChangeCount } = storeToRefs(GlobalStore);
const message = useMessage();

let langGlobal = window.LangGlobal.global;

type dropdownOptionType = {
  label: string;
  key: string;
};

type stateType = {
  showDropdownRef: boolean; // 下拉菜单控制
  xRef: number; // 下拉菜单x坐标
  yRef: number; // 下拉菜单y坐标
  defaultExpandedKeys: string[]; // 需要检测变更的默认属性
  dropdownOptions: dropdownOptionType[]; // 当下拉菜单当前结点无子节点显示的options
  currentDropdownOptions: DropdownOption[]; // 当前结点的下拉菜单options
  currentLayerOptions: any; // 当前结点的内容
  isCheckItem: boolean;
};

let state = reactive<stateType>({
  showDropdownRef: false,
  xRef: 0,
  yRef: 0,
  defaultExpandedKeys: ["list"],
  currentLayerOptions: null,
  dropdownOptions: [
    {
      label: langGlobal.deleteLayer,
      key: "delete",
    },
  ],
  currentDropdownOptions: [],
  isCheckItem: false,
});

// 树的渲染名称
// function renderLabel({ option }: { option: TreeOption }) {
//   let maxWidth = 170;
//   if (option.type === "dataset") {
//     maxWidth = 150;
//   }
//   return createLabel(option, maxWidth);
// }

// // 超出最大宽度省略号
// function createLabel(lab: any, maxWidth: number) {
//   return h(
//     NEllipsis,
//     {
//       lineClamp: 1,
//       style: `max-width: ${maxWidth}px`,
//     },
//     {
//       default: () => lab,
//     }
//   );
// }

let currentTerrainProvider: any;
// "实例化"出树结构，不单独定义类型了
let treeData = reactive<any>({
  label: langGlobal.allLayer,
  key: "layerList",
  children: [
    {
      label: String(langGlobal.s3mLayer),
      key: "s3m",
      children: [],
    },
    {
      label: String(langGlobal.imgLayer),
      key: "imagery",
      children: [],
    },
    {
      label: String(langGlobal.mvtLayer),
      key: "mvt",
      children: [],
    },
    {
      label: String(langGlobal.terrainLayer),
      key: "terrain",
      children: [
        {
          label: String(langGlobal.defaultTerrain),
          key: "403220",
          type: "terrain",
        },
      ],
    },
  ],
});

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
            if (!option.key) return;
            let optionKey: any = option.key;
            if (optionKey.indexOf("-") != -1) {
              let index = optionKey.split("-")[1];
              switch (option.type) {
                case "s3m":
                  viewer.scene.layers._layerQueue[index].visible =
                    !viewer.scene.layers._layerQueue[index].visible;
                  break;
                case "imagery":
                  viewer.imageryLayers._layers[index].show =
                    !viewer.imageryLayers._layers[index].show;
                  break;
                case "mvt":
                  viewer.scene._vectorTileMaps._layerQueue[index].show =
                    !viewer.scene._vectorTileMaps._layerQueue[index].show;
                  break;
                case "terrain":
                  if (viewer.terrainProvider._baseUrl) {
                    currentTerrainProvider = viewer.terrainProvider;
                    viewer.terrainProvider =
                      new SuperMap3D.EllipsoidTerrainProvider();
                  } else {
                    viewer.terrainProvider = currentTerrainProvider;
                  }
                  break;
                default:
                  break;
              }
              updateTree();
              state.isCheckItem = false;
            }
          },
        },
        {
          // icon: () => h(NIcon, { size: 14 }, { default: () => h(Eye) }),
          icon: () => h(option.show ? h(Eye) : h(EyeOff)),
          // icon: () => h(viewer.scene.layers._layerQueue[index].visible ? h(Eye) : h(EyeOff)),
        }
      ),
      h(
        NDropdown,
        {
          trigger: "click",
          placement: "right-start",
          options: [
            {
              label: "定位",
              key: 1,
              icon: () =>
                h(NIcon, { size: 18 }, { default: () => h(LocateOutline) }),
            },
            {
              label: "删除图层",
              key: 2,
              icon: () => h(NIcon, { size: 18 }, { default: () => h(Trash) }),
            },
          ],
          onSelect: (key: any) => {
            // key为1：定位，key为2：删除图层
            if (key === 1) {
              if (option.type === "s3m") {
                let s3mLayer = viewer.scene.layers.find(option.label);
                message.info("跳转到：" + option.label);

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
            } else if (key === 2) {
              let type = option.type;
              let layerName = option.label;
              let layerIndex = option.key.split("-")[1];

              if (type === "s3m") {
                viewer.scene.layers.remove(layerName);
                updateTree();
              }
              if (type === "imagery") {
                let delImagelayer = viewer.imageryLayers._layers[layerIndex];
                viewer.imageryLayers.remove(delImagelayer);

                // 对于一些无法删除的图层，做特殊处理，当只有他一个图层的时候，直接删除所有影像图层;单独删除他一个的办法还没找到，他始终就是无法删除不知道为什么
                if (
                  viewer.imageryLayers._layers.length === 1 &&
                  delImagelayer._imageryProvider._url ===
                    "https://www.supermapol.com/realspace/services/map-mvt-JingJinDiQuDiTu/restjsr/v1/vectortile/maps/%E4%BA%AC%E6%B4%A5%E5%9C%B0%E5%8C%BA%E5%9C%B0%E5%9B%BE"
                ) {
                  viewer.imageryLayers.removeAll();
                }
                updateTree();
              }
              if (type === "terrain") {
                viewer.terrainProvider =
                  new SuperMap3D.EllipsoidTerrainProvider();
                updateTree();
              }
              if (type === "mvt") {
                let mvtLayerName = GlobalStore.MVTLayerNameList[layerIndex];
                viewer.scene.removeVectorTilesMap(mvtLayerName);
                updateTree();
                GlobalStore.MVTLayerNameList = [];
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
// 关闭弹窗
function panelCloseHandle() {
  toolBarStore.setToolBarShow(1, false);
}

// 更新树目录
function updateTree() {
  treeData.children[0].children = [];
  treeData.children[1].children = [];
  treeData.children[2].children = [];
  treeData.children[3].children = [];

  viewer.scene.layers._layerQueue.forEach((S3Mlayer: any, index: string) => {
    treeData.children[0].children.push({
      label: S3Mlayer.name,
      key: "s3m-" + String(index),
      type: "s3m",
      show: S3Mlayer.visible,
    });
  });

  viewer.imageryLayers._layers.forEach((imageryLayer: any, index: string) => {
    let imageryLayerName = layerManagement.getImageryLayerName(imageryLayer);
    treeData.children[1].children.push({
      label: imageryLayerName,
      key: "imagery-" + String(index),
      type: "imagery",
      show: imageryLayer.show,
    });
  });

  viewer.scene._vectorTileMaps._layerQueue.forEach(
    (MVTlayer: any, index: string) => {
      treeData.children[2].children.push({
        label: MVTlayer.name,
        key: "mvt-" + String(index),
        type: "mvt",
        show: MVTlayer.show,
      });
    }
  );

  let terrainLayerName = layerManagement.getTerrainLayerName();
  if (terrainLayerName === "无地形") return;
  treeData.children[3].children[0] = {
    label: terrainLayerName,
    key: "terrain-1",
    type: "terrain",
    show: true,
  };
}

// 我们通过监听GeobalStore.SceneLayerChangeCount，来判断是否有图层添加产生，从而执行updateTree
watch(SceneLayerChangeCount, () => {
  updateTree();
});

onMounted(() => {
  updateTree();
});
</script>

<style lang="scss" scoped>
.panle-container-layer {
  position: fixed;
  top: 0.6rem;
  left: 0.6rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  box-sizing: border-box;

  @include tool-background(
    2.66rem,
    5.41rem,
    "@/assets/imageWeb/panel/layerList/layerList-bg.png"
  );

  .panle-header-layer {
    height: 0.3rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.16rem;

    .panle-title {
      font-size: $--FontSize-Title;
      color: #cae6ff;
      font-weight: bold;
      margin-left: 0.1rem;
    }

    .close-btn {
      font-size: 0.12rem;
    }
  }

  .tree-list {
    @include panelContainer(100%, 4.5rem);
  }
}
</style>