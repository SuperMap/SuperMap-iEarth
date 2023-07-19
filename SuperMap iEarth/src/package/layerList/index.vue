<template>
  <div class="layer-list-box">
    <n-tree block-line :data="layerStore.layerTreeData" :render-suffix="renderSuffix" cascade default-expand-all="true" />
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
import { h } from "vue";
import { usePanelStore } from "@/store";

const panelStore = usePanelStore();
const layerStore = useLayerStore();
let currentTerrainProvider: any; // 保存当前地形图层，方便控制其显隐

// 给树添加icon
function renderSuffix({ option }: { option: TreeOption | any }) {
  if (!option.children) {
    return h("div", {}, [
      h(
        NButton,
        {
          bordered: false,
          text: true,
          title: GlobalLang.isShow,
          style: 'margin-right:4px',
          onClick: (e) => {
            setLayerShow(option);
          },
        },
        {
          icon: () => h(option.isShow ? h("i", { class: "iconfont iconkejian", style: 'color:rgba(255, 255, 255, 0.65)' }, "") :
            h("i", { class: "iconfont iconyincang", style: 'color:rgba(255, 255, 255, 0.65)' }, "")),
        }
      ),
      h(
        NDropdown,
        {
          trigger: "click",
          placement: "right-start",
          options: setOptionsByType(option.type),
          onSelect: (key: any) => {
            setDropdownAction(option,key);
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
                onClick: (e) => { },
              },
              {
                icon: () => h("i", { class: "iconfont icongengduo" }, ""),
              }
            ),
        }
      ),
    ]);
  }
}

// 根据图层类型设置不同的下拉操作选项
function setOptionsByType(type: string) {
  if (type === 's3m') {
    return [
      {
        label: GlobalLang.rapidLocate,
        key: 1,
        icon: () => h("i", { class: "iconfont icondingwei" }, ""),
      },
      {
        label: GlobalLang.layerOpration,
        key: 2,
        icon: () => h("i", { class: "iconfont iconyidong" }, ""),
      },
      {
        label: GlobalLang.layerAttribute,
        key: 3,
        icon: () => h("i", { class: "iconfont icontishi" }, ""),
      },
      {
        label: GlobalLang.layerStyle,
        key: 4,
        icon: () => h("i", { class: "iconfont icontuceng" }, ""),
      },
      {
        label: GlobalLang.remove,
        key: 5,
        icon: () => h("i", { class: "iconfont iconshanchu", style: "color: #DC5849" }, ""),
      },
    ]
  } else if (type === 'mvt') {
    return [
      {
        label: GlobalLang.rapidLocate,
        key: 1,
        icon: () => h("i", { class: "iconfont icondingwei" }, ""),
      },
      {
        label: GlobalLang.remove,
        key: 5,
        icon: () => h("i", { class: "iconfont iconshanchu", style: "color: #DC5849" }, ""),
      },
    ]
  } else {
    return [{
      label: GlobalLang.remove,
      key: 5,
      icon: () => h("i", { class: "iconfont iconshanchu", style: "color: #DC5849" }, ""),
    }]
  }
}

// 控制图层显隐
function setLayerShow(option: any) {
  // console.log("option:",option)
  if (!option.key) return;
  let optionKey: any = option.key;
  if (optionKey.indexOf("-") != -1) {
    let index = optionKey.split("-")[1];
    switch (option.type) {
      case "s3m":
        viewer.scene.layers._layerQueue[index].visible = !option.isShow;
        layerStore.isShowLayer(option);
        break;
      case "imagery":
        viewer.imageryLayers._layers[index].show = !option.isShow;
        layerStore.isShowLayer(option);
        break;
      case "mvt":
        viewer.scene._vectorTileMaps._layerQueue[index].show = !option.isShow;
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
  }
}

// 下拉列表操作
function setDropdownAction(option: any, key: number) {
  // key为1：定位，key为2：删除图层
  layerStore.s3mLayerSelectIndex = option.key.split('-')[1];
  // console.log(option)
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
  else if (key === 2) {
    panelStore.setRightToolBarList({ id: 7 });
  }
  else if (key === 3) {
    panelStore.setRightToolBarList({ id: 8 });
  }
  else if (key === 4) {
    panelStore.setRightToolBarList({ id: 9 });
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
      let delImagelayer = viewer.imageryLayers._layers[layerIndex];
      viewer.imageryLayers.remove(delImagelayer);
      layerStore.removeLayer(option);
    }
    if (type === "mvt") {
      let mvtLayerName = layerStore.MVTLayerNameList[layerIndex];
      viewer.scene.removeVectorTilesMap(mvtLayerName);
      layerStore.removeLayer(option);
    }
    if (type === "terrain") {
      viewer.terrainProvider =
        new SuperMap3D.EllipsoidTerrainProvider();
      layerStore.removeLayer(option);
    }
  }
}
</script>

<style lang="scss" scoped>
.layer-list-box {
  padding: 0px 6px;
}
</style>
