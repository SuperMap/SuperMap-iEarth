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
import { h, ref, nextTick, onMounted } from "vue";
import { TreeOption, NButton, NDropdown, NInput, useMessage, NEllipsis } from "naive-ui";
import { usePanelStore } from "@/store";
import { useLayerStore } from "@/store/index";

const panelStore = usePanelStore();
const layerStore = useLayerStore();
const message = useMessage();
let layerTreeData = layerStore.layerTreeData;
let layerTreeAlias = layerStore.layerTreeAlias;

let currentTerrainProvider: any; // 保存当前地形图层，方便控制其显隐

onMounted(() => {
  // layerStore.refreshLayerTree();
  layerStore.updateLayer({ type: "s3m" });
  layerStore.updateLayer({ type: "imagery" });
  layerStore.updateLayer({ type: "mvt" });
  layerStore.updateLayer({ type: "terrain" });
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
          title: $t("isShow"),
          style: "margin-right:0.04rem",
          onClick: (e) => {
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
                focusable: false, // 不起作用
                class: "layer-tree-item",
                onClick: (e) => {},
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
  if (type === "s3m") {
    return [
      {
        label: $t("rapidLocate"),
        key: 1,
        icon: () => h("i", { class: "iconfont icondingwei" }, ""),
      },
      {
        label: $t("layerOpration"),
        key: 2,
        icon: () => h("i", { class: "iconfont iconyidong" }, ""),
      },
      {
        label: $t("layerAttribute"),
        key: 3,
        icon: () => h("i", { class: "iconfont icontishi" }, ""),
      },
      {
        label: $t("layerStyle"),
        key: 4,
        icon: () => h("i", { class: "iconfont icontucengfengge" }, ""),
      },
      {
        label: $t("layerQuery"),
        key: 10,
        icon: () => h("i", { class: "iconfont iconchaxun" }, ""),
      },
      {
        label: $t("qxSingle"),
        key: 12,
        icon: () => h("i", { class: "iconfont iconqingxiedantihua" }, ""),
      },
      {
        label: $t("rename"),
        key: 0,
        icon: () => h("i", { class: "iconfont iconzhongmingming" }, ""),
      },
      {
        label: $t("remove"),
        key: 5,
        icon: () =>
          h(
            "i",
            { class: "iconfont iconshanchu", style: "color: #DC5849" },
            ""
          ),
      },
    ];
  } else if (type === "imagery") {
    return [
      {
        label: $t("rapidLocate"),
        key: 1,
        icon: () => h("i", { class: "iconfont icondingwei" }, ""),
      },
      {
        label: $t("mapQuery"),
        key: 11,
        icon: () => h("i", { class: "iconfont icondituchaxun" }, ""),
      },
      {
        label: $t("rename"),
        key: 0,
        icon: () => h("i", { class: "iconfont iconzhongmingming" }, ""),
      },
      {
        label: $t("remove"),
        key: 5,
        icon: () =>
          h(
            "i",
            { class: "iconfont iconshanchu", style: "color: #DC5849" },
            ""
          ),
      },
    ];
  } else if (type === "mvt") {
    return [
      {
        label: $t("rapidLocate"),
        key: 1,
        icon: () => h("i", { class: "iconfont icondingwei" }, ""),
      },
      {
        label: $t("rename"),
        key: 0,
        icon: () => h("i", { class: "iconfont iconzhongmingming" }, ""),
      },
      {
        label: $t("remove"),
        key: 5,
        icon: () =>
          h(
            "i",
            { class: "iconfont iconshanchu", style: "color: #DC5849" },
            ""
          ),
      },
    ];
  } else {
    return [
      {
        label: $t("rename"),
        key: 0,
        icon: () => h("i", { class: "iconfont iconzhongmingming" }, ""),
      },
      {
        label: $t("remove"),
        key: 5,
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

// 控制图层显隐
function setLayerShow(option: any) {
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
          viewer.terrainProvider = new SuperMap3D.EllipsoidTerrainProvider();
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
  layerStore.s3mLayerSelectIndex = option.key.split("-")[1];
  if (key === 0) {
    option.isedit = true;
    nextTick(() => {
      inputRef.value.focus();
    });
  } else if (key === 1) {
    if (option.type === "s3m") {
      let s3mLayer = viewer.scene.layers.find(option.aliasKey);
      if (viewer.scene.mode == SuperMap3D.SceneMode.SCENE3D) {
        if (s3mLayer.lon && s3mLayer.lat) { // 一些特殊的坐标系，比如ISVJ-7839中的4508+平面场景，直接flyTo不行，这里参考IServer里面的预览，使用此种方式来定位
          viewer.scene.camera.setView({
            destination: new SuperMap3D.Cartesian3.fromDegrees(s3mLayer.lon, s3mLayer.lat, 500)
          });
        } else {
          viewer.flyTo(s3mLayer, { duration: 0 });
        }
      } else if (viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW) { // 哥伦布视图下可能存在问题，比如ISVJ-7839中，用场景打开，定位就不对了
        if (s3mLayer.positionCartographic_for_colubus) { // 以场景形式打开时，会给图层绑定一个打开后的相机视图定位
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
    } else if (option.type === "mvt") {
      let index = String(option.key).split("-")[1];
      let mvtLayer = viewer.scene._vectorTileMaps._layerQueue[Number(index)];
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
    } else if (option.type === "imagery") {
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
  } else if (key === 2) {
    panelStore.setRightToolBarList({ id: 7 });
  } else if (key === 3) {
    panelStore.setRightToolBarList({ id: 8 });
  } else if (key === 4) {
    panelStore.setRightToolBarList({ id: 9 });
  } else if (key === 5) {
    // 删除图层之后 再显隐会有问题，不通过id
    let type = option.type;
    let layerName = option.aliasKey;
    let layerIndex = option.key.split("-")[1];
    if (type === "s3m") {
      viewer.scene.layers.remove(layerName);
      layerStore.removeLayer(option);
      delete layerTreeAlias.s3mLayer[option.aliasKey];
    }
    if (type === "imagery") {
      let delImagelayer = viewer.imageryLayers._layers[layerIndex];
      if (delImagelayer._imageryProvider.url == "./images/earth-skin2.jpg") {
        message.warning($t("delUnsupported"));
        return;
      }
      viewer.imageryLayers.remove(delImagelayer);
      layerStore.removeLayer(option);
      delete layerTreeAlias.imgLayer[option.aliasKey];

      // 针对wmts服务在图层列表的删除
      let delLayerImageryProvider = delImagelayer._imageryProvider;
      if (
        delLayerImageryProvider._baseUrl &&
        delLayerImageryProvider._baseUrl.indexOf("wmts") != -1
      ) {
        layerStore.removeWmtsLayer({
          name: delLayerImageryProvider.tablename,
          url: delLayerImageryProvider._baseUrl,
        });
        return;
      }
      if (
        delLayerImageryProvider._resource &&
        delLayerImageryProvider._resource._url.indexOf("wmts") != -1
      ) {
        layerStore.removeWmtsLayer({
          name: delLayerImageryProvider.tablename,
          url: delLayerImageryProvider._resource._url,
        });
        return;
      }
    }
    if (type === "mvt") {
      let mvtLayerName = layerStore.MVTLayerNameList[layerIndex];
      viewer.scene.removeVectorTilesMap(mvtLayerName);
      layerStore.removeLayer(option);
      delete layerTreeAlias.mvtLayer[option.aliasKey];
    }
    if (type === "terrain") {
      viewer.terrainProvider = new SuperMap3D.EllipsoidTerrainProvider();
      layerStore.removeLayer(option);
      delete layerTreeAlias.terrainLayer[option.aliasKey];
    }
  } else if (key === 10) {
    panelStore.setRightToolBarList({ id: 10 });
  } else if (key === 11) {
    panelStore.setRightToolBarList({ id: 11 });
  } else if (key === 12) {
    panelStore.setRightToolBarList({ id: 12 });
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
function handleDrop({ node, dragNode, dropPosition }) {
  let node_key,
    dragNode_key = undefined;
  if (node && node.key.indexOf("-") != -1) {
    node_key = node.key.split("-")[0];
  }
  if (dragNode && dragNode.key.indexOf("-") != -1) {
    dragNode_key = dragNode.key.split("-")[0];
  }
  if (node_key != dragNode_key) {
    message.warning($t("tree_darg_tip"));
    return;
  }
  const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
    dragNode,
    layerTreeData
  );
  if (dragNodeSiblings === null || dragNodeIndex === null) return;
  dragNodeSiblings.splice(dragNodeIndex, 1);
  if (dropPosition === "inside") {
    if (node.children) {
      node.children.unshift(dragNode);
    } else {
      node.children = [dragNode];
    }
  } else if (dropPosition === "before") {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, layerTreeData);
    if (nodeSiblings === null || nodeIndex === null) return;
    nodeSiblings.splice(nodeIndex, 0, dragNode);
  } else if (dropPosition === "after") {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, layerTreeData);
    if (nodeSiblings === null || nodeIndex === null) return;
    nodeSiblings.splice(nodeIndex + 1, 0, dragNode);
  }
  layerTreeData = Array.from(layerTreeData);
}

//节点内容渲染函数
const inputRef = ref();
const nodelabel = ({ option }: { option: TreeOption }) => {
  return h(
    "div",
    option.isedit == true
      ? h(NInput, {
          autofocus: true,
          ref: inputRef,
          size: "small",
          title: option.label,
          value: option.label,
          onUpdateValue: (v) => {
            option.label = v;
            let aliasKey: any = option.aliasKey;
            switch (option.type) {
              case "s3m":
                layerTreeAlias.s3mLayer[aliasKey] = option.label;
                break;
              case "imagery":
                layerTreeAlias.imgLayer[aliasKey] = option.label;
                break;
              case "mvt":
                layerTreeAlias.mvtLayer[aliasKey] = option.label;
                break;
              case "terrain":
                layerTreeAlias.terrainLayer[aliasKey] = option.label;
                break;
              default:
                break;
            }
          },
          onChange: () => {
            option.isedit = false;
          },
          onBlur: () => {
            option.isedit = false;
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
      option.isedit = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    },
  };
};
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
