<template>
  <n-tree
    block-node
    cascade
    checkable
    virtual-scroll
    :data="data"
    :default-expanded-keys="defaultExpandedKeys"
    :default-checked-keys="defaultCheckedKeys"
    @update:checked-keys="getCheckedKeys"
    @update:selected-keys="getSelectedKeys"
    style="max-height: 500px"
    ref="treeNode"
  />
</template>

<script setup>
import { h, ref, watch, shallowRef, inject } from "vue";
import { NButton, NPopconfirm, useMessage, NTree } from "naive-ui";

const message = useMessage();
let storeState = inject("storeState");
let {setDeleteLayerName,layersDelete,getScene,setLayerChanges} = inject("storeActions");
let { locale } = inject("storeData");
let layers, terrain_layers;

// 触发更新
let props = defineProps({
  isUpdate: {
    type: Boolean,
    default: true
  }
});
watch( () => props.isUpdate,val => {
    if (val) setTimeout(() => updateLayers(), 500);
  });

//监听图层改变
watch(storeState.layerChanges, val => {
  if (props.isUpdate) updateLayers();
});


// 定义数据
let data = shallowRef([{ label: ()=>locale.value.NoLayer, key: 0, disabled: true }]);
let defaultExpandedKeys = ref(["root--s3m"]); //默认展开
let defaultCheckedKeys = ref(["root--s3m", "root--img", "root--terrain"]); //默认选中
let treeNode = ref(null);

// 创建节点函数
function creatNode(label, key, children, type, is_suffix) {
  return {
    label: label,
    key: key,
    children: children,
    type: type,
    suffix: is_suffix ? () => renderSuffix(type, label) : undefined
  };
}

let s3mlayers = creatNode(()=>locale.value.S3mLayer, "root--s3m", [], "ROOT--S3M", false);
let imglayers = creatNode(()=>locale.value.ImageLayer,"root--img",[], "ROOT--IMG", false);
let terrainlayers = creatNode(()=>locale.value.TerrainLayer,"root--terrain",[], "ROOT--TERRAIN", false);

// update图层
function updateLayers() {
  s3mlayers.children.length = 0;
  imglayers.children.length = 0;
  terrainlayers.children.length = 0;

  // 获取所有图层
  layers = getScene().get_layer3Ds().getAllLayers();
  terrain_layers = getScene().get_terrainLayers();

  if (terrain_layers.get_count() > 0) {
    terrain_layers = terrain_layers.get_item(0); //目前tin地形支持只能加一个,加多个栅格要修改这
    terrainlayers.children[0] = creatNode(
      terrain_layers.name,
      `TERRAIN--${terrain_layers.name}--0`,
      undefined,
      "TERRAIN",
      true
    );
  } else terrain_layers = undefined;

  if (layers.length === 0 && !terrain_layers) {
    data.value = [{ label: ()=>locale.value.NoLayer, key: 0, checkboxDisabled: true }];
    return;
  }
  let newData = [];
  layers.forEach((layer, index) => {
    let name = layer.name;
    if (layer.type === SuperMap.Web.Realspace.Layer3DType.OSGB) {
      s3mlayers.children.push(
        creatNode(name, `S3M--${name}--${index}`, undefined, "S3M", true)
      );
    } else if (layer.type === SuperMap.Web.Realspace.Layer3DType.IMAGE) {
      imglayers.children.push(
        creatNode(name, `IMG--${name}--${index}`, undefined, "IMG", true)
      );
    }
  });
  if (s3mlayers.children.length > 0) {
    newData[0] = s3mlayers;
  }
  if (imglayers.children.length > 0) {
    newData[1] = imglayers;
  }
  if (terrainlayers.children.length > 0) {
    newData[2] = terrainlayers;
  }
  data.value = newData;
}

// 勾选节点显隐
let checkedKeys = []; //记录变化前所有的勾选keys
function getCheckedKeys(params) {
  set_layer_visible(s3mlayers.children, params);
  set_layer_visible(imglayers.children, params);
  set_terrain_visible(terrainlayers.children, params);
}
function set_layer_visible(arr, checkedKeys) {
  if (!arr instanceof Array || arr.length === 0) return;
  arr.forEach(layerObj => {
    let index = layerObj.key.split("--")[2];
    index = Number(index);
    if (index === NaN) return;
    if (checkedKeys.includes(layerObj.key)) layers[index].set_isVisible(true);
    else layers[index].set_isVisible(false);
  });
}
function set_terrain_visible(arr, checkedKeys) {
  if (!arr instanceof Array || arr.length === 0) return;
  let layerObj = terrainlayers.children[0];
  if (checkedKeys.includes(layerObj.key)) terrain_layers.set_isVisible(true);
  else terrain_layers.set_isVisible(false);
}

// 点击节点定位
let selectedKey;
function getSelectedKeys(params) {
  selectedKey = params[0] ? params[0] : selectedKey;
  let infos = selectedKey ? selectedKey.split("--") : [];
  let layerName = infos[1] ? infos[1] : undefined;
  let layerType = infos[0] ? infos[0] : undefined;
  if (layerType === "TERRAIN" && terrain_layers) {
    getScene().get_flyingOperator().flyToLayer(terrain_layers);
  }
  let layer;
  if (layerName) layer = getScene().get_layer3Ds().get_item(layerName);
  if (layer) getScene().get_flyingOperator().flyToLayer(layer);
}



// 删除图层
function renderSuffix(type, name) {
  return h(
    NPopconfirm,
    {
      placement: "right-start",
      onPositiveClick: () => {
        deletLayer(type, name);
      }
    },
    {
      trigger: () =>
        h(NButton, {
          text: true,
          onClick: e => {
            e.stopPropagation();
          },
          class: "iconfont iconshanchu"
        }),
      default: () => locale.value.DeleteLayerTip
    }
  );
}

function deletLayer(layerType, layerName) {
  if (!layerType || !layerName) return message.error(locale.value.DeleteLayerFail);
  layersDelete(layerType, layerName);
  updateLayers();
  setDeleteLayerName(layerName); //提供给添加图层组件设置状态
  setLayerChanges();// 触发图层管理树更新
  message.success(locale.value.DeleteLayerSuccess);
}
</script>

