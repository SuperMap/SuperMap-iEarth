<template>
  <div class="Contanier">
      <n-tree block-line :data="[treeData]" cascade checkable :default-checked-keys=defaultCheckedKeys
          :default-expanded-keys="state.defaultExpandedKeys" :node-props="nodeProps"
          :on-update:checked-keys="itemCheckChangeHandle" default-expand-all="true" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch} from 'vue'
import { TreeOption, useMessage, DropdownOption } from 'naive-ui'
// import { storeToRefs } from 'pinia';
// import { GlobalStoreCreate } from '@/store/global/global';
import layerManagement from "@/tools/layerManagement";

// const GlobalStore = GlobalStoreCreate();
// const { isViewer, SceneLayerChangeCount } = storeToRefs(GlobalStore);
const message = useMessage()

let langGlobal = window.LangGlobal.global;

type dropdownOptionType = {
  label: string,
  key: string
}

type stateType = {
  showDropdownRef: boolean, // 下拉菜单控制
  xRef: number, // 下拉菜单x坐标
  yRef: number, // 下拉菜单y坐标
  defaultExpandedKeys: string[], // 需要检测变更的默认属性
  dropdownOptions: dropdownOptionType[], // 当下拉菜单当前结点无子节点显示的options
  currentDropdownOptions: DropdownOption[] // 当前结点的下拉菜单options
  currentLayerOptions: any, // 当前结点的内容
  isCheckItem: boolean;
}

let state = reactive<stateType>({
  showDropdownRef: false,
  xRef: 0,
  yRef: 0,
  defaultExpandedKeys: ['list'],
  currentLayerOptions: null,
  dropdownOptions: [{
      label: langGlobal.deleteLayer,
      key: "delete",
  }],
  currentDropdownOptions: [],
  isCheckItem: false
})

let currentTerrainProvider: any;
let currentCheckedItemList: any[] = [];
// "实例化"出树结构，不单独定义类型了
let treeData = reactive({
  label: langGlobal.allLayer,
  key: "layerList",
  children: [
      {
          label: String(langGlobal.s3mLayer),
          key: "s3m",
          children: []
      },
      {
          label: String(langGlobal.imgLayer),
          key: "imagery",
          children: []
      },
      {
          label: String(langGlobal.mvtLayer),
          key: "mvt",
          children: []
      },
      {
          label: String(langGlobal.terrainLayer),
          key: "terrain",
          children: [
              {
                  label: String(langGlobal.defaultTerrain),
                  key: "403220",
                  type: "terrain"
              },
          ]
      },
  ]
})

let defaultCheckedKeys = ['layerList']


function handleSelect(key: string, item: any) {
  state.showDropdownRef = false
  let type = state.currentLayerOptions.type;
  let layerName = state.currentLayerOptions.label;
  let layerIndex = state.currentLayerOptions.key.split('-')[1];
}
function handleClickoutside() {
  state.showDropdownRef = false
}
function nodeProps({ option }: { option: TreeOption }) {
  return {
      onClick() {
          // console.log("option:",option)
          if (!state.isCheckItem) { // 点击图层列，跳转到当前图层（仅支持：s3m）
              if (option.type === 's3m') {
                  let s3mLayer = viewer.scene.layers.find(option.label);
                  message.info('跳转到：' + option.label)

                  viewer.flyTo(s3mLayer, { duration: 0 })
              }
              else if (option.type === 'mvt') {
                  let index = String(option.key).split('-')[1];
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
                          roll: 0
                      }
                  });
              }

          } else {
              if (!option.key) return;
              let optionKey: any = option.key
              if (optionKey.indexOf('-') != -1) {
                  let checkFlag = currentCheckedItemList.indexOf(option.key) != -1 ? true : false;

                  let index = optionKey.split('-')[1];
                  switch (option.type) {
                      case "s3m":
                          viewer.scene.layers._layerQueue[index].visible = checkFlag;
                          break;
                      case "imagery":
                          viewer.imageryLayers._layers[index].show = checkFlag;
                          break;
                      case "mvt":
                          viewer.scene._vectorTileMaps._layerQueue[index].show = checkFlag;
                          break;
                      case "terrain":
                          if (!checkFlag) {
                              currentTerrainProvider = viewer.terrainProvider;
                              viewer.terrainProvider = new SuperMap3D.EllipsoidTerrainProvider();
                          } else {
                              viewer.terrainProvider = currentTerrainProvider;
                          }
                          break;
                      default:
                          null;
                  }
                  state.isCheckItem = false;
              }
          }


      },
      onContextmenu(e: MouseEvent): void {
          state.currentLayerOptions = option;

          // 下拉菜单会针对当前结点是否有子结点来显示不同的options
          if (option.children) {
              state.currentDropdownOptions = [option];
          } else {
              state.currentDropdownOptions = state.dropdownOptions;
          }

          state.showDropdownRef = true
          state.xRef = e.clientX
          state.yRef = e.clientY
          e.preventDefault()
      }
  }
}

// 左侧选择框事件，由于其框架的问题(itemCheckChangeHandle总是先于onClick)，而且没办法直接用keys（很不好用，无法定位单个一下子就是全部），这里我们只改变isCheckItem，后续操作在nodeProps-onClick中
function itemCheckChangeHandle(keys: Array<string>, option: Array<TreeOption | null>, meta: { node: TreeOption | null, action: 'check' | 'uncheck' }) {
  state.isCheckItem = true;
  currentCheckedItemList = keys;

  let s3mListTemp = keys.filter(item => item.indexOf("s3m-") != -1);
  let imageryListTemp = keys.filter(item => item.indexOf("imagery-") != -1);
  let mvtListTemp = keys.filter(item => item.indexOf("mvt-") != -1);

  // GlobalStore.layerTreeCheckedKeys.s3mLayerCheckedList = s3mListTemp.map(function (item) {
  //     return item.split("-")[1];
  // });
  // GlobalStore.layerTreeCheckedKeys.imageryLayerCheckedList = imageryListTemp.map(function (item) {
  //     return item.split("-")[1];
  // });
  // GlobalStore.layerTreeCheckedKeys.mvtLayerCheckedList = mvtListTemp.map(function (item) {
  //     return item.split("-")[1];
  // });

  console.log("layer-Tree-keys:",keys);
  console.log("layer-Tree-option:",option);
}


// 更新树目录
function updateTree() {
  treeData.children[0].children = []
  treeData.children[1].children = []
  treeData.children[2].children = []
  treeData.children[3].children = []

  viewer.scene.layers._layerQueue.forEach((S3Mlayer: any, index: string) => {
      treeData.children[0].children.push({
          label: S3Mlayer.name,
          key: 's3m-' + String(index),
          type: 's3m'
      })
  });

  viewer.imageryLayers._layers.forEach((imageryLayer: any, index: string) => {
      let imageryLayerName = layerManagement.getImageryLayerName(imageryLayer);
      treeData.children[1].children.push({
          label: imageryLayerName,
          key: 'imagery-' + String(index),
          type: 'imagery'
      })
  })

  viewer.scene._vectorTileMaps._layerQueue.forEach((MVTlayer: any, index: string) => {
      treeData.children[2].children.push({
          label: MVTlayer.name,
          key: 'mvt-' + String(index),
          type: 'mvt'
      })
  });

  let terrainLayerName = layerManagement.getTerrainLayerName();
  if (terrainLayerName === '无地形') return;
  treeData.children[3].children[0] = {
      label: terrainLayerName,
      key: 'terrain-1',
      type: 'terrain'
  }

}


// 我们通过监听GeobalStore.SceneLayerChangeCount，来判断是否有图层添加产生，从而执行updateTree
// watch(SceneLayerChangeCount, () => {
//   updateTree();
// })
// watch(isViewer, () => {
//   updateTree();
// })
onMounted(() => {
  updateTree();
})
</script>
