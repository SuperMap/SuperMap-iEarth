<template>
  <n-tree
    block-node
    cascade
    checkable
    :draggable="draggable"
    virtual-scroll
    :data="data"
    :default-expanded-keys="defaultExpandedKeys"
    :default-checked-keys="defaultCheckedKeys"
    @update:checked-keys="getCheckedKeys"
    @update:selected-keys="getSelectedKeys"
    :style="style"
  />
</template>

<script lang="ts" setup>
import { watch, ref } from "vue";
import { GlobalStoreCreate } from '@/store/global/global';
import { storeToRefs } from 'pinia';
// import layerManagement from "@/tools/layerManagement";

// import ids from 'virtual:svg-icons-names'
// console.log("svgIDS:",ids) 查看所用svg的symbolId：icon-measure-Aear

const GlobalStore = GlobalStoreCreate();
const { SceneLayerChangeCount } = storeToRefs(GlobalStore);

let layers:any, imgLayers:any, terrainLayers:any, mvtLayers:any, terrainProvider:any;

// 触发更新
let props = defineProps({
  isUpdate: {
    type: Boolean,
    default: true
  },
  defaultExpandedKeys: Array,
  defaultCheckedKeys: {
    type: Array,
    default: ["S3M--Root", "IMG--Root", "MVT--Root", "TERRAIN--Root","GLOBE--Root---1"]
  },
  defaultShowTypes: {
    type: Array,
    default: ["S3M", "TERRAIN", "IMG", "MVT"]
  },
  deletButtonShow: {
    type: Boolean,
    default: true
  },
  draggable: {
    //是否可拖拽
    type: Boolean,
    default: false
  },
  style: {
    type: Object,
    default: "max-height: 5rem;max-width:2.6rem"
  },
  updateData:Array
});

const emit = defineEmits([
  "getCheckedKeys",
  "getSelectedKeys",
  "getS3mLayers",
  "getImgLayers",
  "getMvtLayers",
  "getAllLayers",
  "getDropedNodes"
]);

watch(
  () => props.isUpdate,
  val => {
    if (val) setTimeout(() => updateLayers(), 500);
  }
);
watch(
  () => props.updateData,
  val => {
    if (val) data.value = val;
    console.log('updateData:',val)
  }
);

//监听图层改变
watch(SceneLayerChangeCount, val => {
  if (props.isUpdate) updateLayers();
});

// 定义数据
let data = ref<any[]>([
  { label: () => '暂无图层', key: 0, disabled: true }
]);

// 创建节点函数
function creatNode(label, key, children, type, is_suffix) {
  return {
    label: label,
    key: key,
    children: children,
    type: type,
  };
}

let s3mRootNode = creatNode(
  () => 's3m图层',
  "S3M--Root",
  [],
  "S3M--Root",
  false
);
let imgRootNode = creatNode(
  () => '影像图层',
  "IMG--Root",
  [],
  "IMG--Root",
  false
);
let mvtRootNode = creatNode(
  () => '影像图层',
  "MVT--Root",
  [],
  "MVT--Root",
  false
);

let terrainRootNode = creatNode(
  () => '地形图层',
  "TERRAIN--Root",
  [],
  "TERRAIN--Root",
  false
);

let globeNode = creatNode(
  () => '地球',
  "GLOBE--Root---1",
  undefined,
  "GLOBE--Root",
  false
);

// update图层
function updateLayers() {
  s3mRootNode.children.length = 0;
  imgRootNode.children.length = 0;
  mvtRootNode.children.length = 0;
  terrainRootNode.children.length = 0;

  // 获取所有图层
  layers = viewer.scene.layers.layerQueue;
  imgLayers = viewer.imageryLayers._layers;
  mvtLayers = viewer.scene._vectorTileMaps._layerQueue;
  terrainLayers = viewer.terrainProvider;
  emit("getS3mLayers", layers);
  // emit("getImgLayers", imgLayers);
  // emit("getMvtLayers", mvtLayers);
  emit("getAllLayers", layers,imgLayers,mvtLayers);
  updataS3MLayer();
  // updataImgLayers();
  // updataMvtLayers();
  // updataTerrainLayers();
  let newData:any[] = [];

  if (
    s3mRootNode.children.length > 0 &&
    props.defaultShowTypes.includes("S3M")
  ) {
    newData[0] = s3mRootNode;
  }
  // if (
  //   imgRootNode.children.length > 0 &&
  //   props.defaultShowTypes.includes("IMG")
  // ) {
  //   newData[1] = imgRootNode;
  // }
  // if (
  //   mvtRootNode.children.length > 0 &&
  //   props.defaultShowTypes.includes("MVT")
  // ) {
  //   newData[2] = mvtRootNode;
  // }
  // if (
  //   terrainRootNode.children.length > 0 &&
  //   props.defaultShowTypes.includes("TERRAIN")
  // ) {
  //   newData[3] = terrainRootNode;
  // }
  // if (props.defaultShowTypes.includes("GLOBE")) {
  //   newData[4] = globeNode;
  // }
  if (newData.length === 0) {
    data.value = [
      { label: () => '暂无图层', key: 0, checkboxDisabled: true }
    ];
    return;
  }
  data.value = newData;
}
updateLayers();

// updatS3M图层
function updataS3MLayer() {
  if (!layers || layers.length < 1) return;
  layers.forEach((layer, index) => {
    let name = layer._name;
    s3mRootNode.children.push(
      creatNode(name, `S3M--${name}--${index}`, undefined, "S3M", true)
    );
  });
}
//updatImg
// function updataImgLayers() {
//   if (!imgLayers || imgLayers.length < 1) return;
//   imgLayers.forEach((layer, index) => {
//     let isMvt = layer._imageryProvider instanceof SuperMap3D.MvtProviderGL;
//     if (index === 0 || isMvt) return true;
//     // let name = layer._imageryProvider.tablename || "img";
//     let name = layerManagement.getImageryLayerName(layer);
//     imgRootNode.children.unshift(
//       creatNode(name, `IMG--${name}--${index}`, undefined, "IMG", true)
//     );
//   });
// }
// //updatMVT
// function updataMvtLayers() {
//   mvtLayers.forEach((layer, index) => {
//     let name = layer.name || "mvt";
//     mvtRootNode.children.unshift(
//       creatNode(name, `IMG--${name}--${index}`, undefined, "MVT", true)
//     );
//   });
// }
//updatTerrain
// function updataTerrainLayers() {
//   let name = layerManagement.getTerrainLayerName();
//   if (name) {
//     terrainRootNode.children[0] = creatNode(
//       name,
//       `TERRAIN--${name}--0`,
//       undefined,
//       "TERRAIN",
//       true
//     );
//   } else terrainLayers = undefined;
// }

// 勾选节点
function getCheckedKeys(params) {
  emit("getCheckedKeys", params, data.value);
}

// 点击节点
function getSelectedKeys(params) {
  emit("getSelectedKeys", params);
}



function findSiblingsAndIndex(node, nodes) {
  if (!nodes) return [null, null];
  for (let i = 0; i < nodes.length; ++i) {
    const siblingNode = nodes[i];
    if (siblingNode.key === node.key) return [nodes, i];
    const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children);
    if (siblings) return [siblings, index];
  }
  return [null, null];
}

</script>

