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
    style="max-height: 500px;max-width:260px"
  />
</template>

<script setup>
import { h, ref, watch, shallowRef, inject,onMounted } from "vue";
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
  },
  defaultExpandedKeys:Array,
  defaultCheckedKeys:Array,
  defaultShowTypes:Array,
  deletButtonShow: {
    type: Boolean,
    default: true
  },
});

const emit = defineEmits(["getCheckedKeys","getSelectedKeys","getS3mLayers"]);

watch(()=>props.isUpdate,val => {
    if (val) setTimeout(() => updateLayers(), 500);
  });

onMounted(() => {
  setTimeout(() => updateLayers(), 500);
});

//监听图层改变
watch(storeState.layerChanges, val => {
  if (props.isUpdate) updateLayers();
});


// 定义数据
let data = shallowRef([{ label: ()=>locale.value.NoLayer, key: 0, disabled: true }]);

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
  emit("getS3mLayers", layers);
  
  if (terrain_layers.get_count() > 0) {
    terrain_layers = terrain_layers.get_item(0); //目前tin地形支持只能加一个,加多个栅格要修改这
    terrainlayers.children[0] = creatNode(
      terrain_layers.name,
      `TERRAIN--${terrain_layers.name}--0`,
      undefined,
      "TERRAIN",
      props.deletButtonShow
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
        creatNode(name, `S3M--${name}--${index}`, undefined, "S3M", props.deletButtonShow)
      );
    } else if (layer.type === SuperMap.Web.Realspace.Layer3DType.IMAGE) {
      imglayers.children.push(
        creatNode(name, `IMG--${name}--${index}`, undefined, "IMG", props.deletButtonShow)
      );
    }
  });
  if (s3mlayers.children.length > 0 && props.defaultShowTypes.includes('S3M')) {
    newData[0] = s3mlayers;
  }
  if (imglayers.children.length > 0  && props.defaultShowTypes.includes('IMG')) {
    newData[1] = imglayers;
  }
  if (terrainlayers.children.length > 0  && props.defaultShowTypes.includes('TERRAIN')) {
    newData[2] = terrainlayers;
  }
  data.value = newData;
}

// 勾选节点
function getCheckedKeys(params) {
   emit("getCheckedKeys", params);
}

// 点击节点
function getSelectedKeys(params) {
  emit("getSelectedKeys", params);
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

