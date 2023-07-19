<template>
  <div class="layer-list-box">
    <n-tree
      block-line
      :data="layerStore.layerTreeData"
      :render-label="renderLabel"
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
import { h,ref } from "vue";
import { usePanelStore } from "@/store";

const panelStore = usePanelStore();
const layerStore = useLayerStore();
let currentTerrainProvider: any; // 保存当前地形图层，方便控制其显隐
let showDropDownArr:any = ref<any>({});
let targetDropDown = ref(null);
function renderLabel({ option }: { option: TreeOption | any}) {
    if(!option.children){
      console.log(option,'option')
    showDropDownArr[option.key] = showDropDownArr.hasOwnProperty(option.key)?showDropDownArr[option.key]:false;
    return h("div",
    {
    style: "display: flex;justify-content: space-between",
    onMouseenter: (e)=>{
        const extendElement = document.getElementById(`extend ${option.key}`);
        if(extendElement){
        extendElement.style.visibility = "visible";
        }
    },
    onMouseleave: (e)=>{
        const extendElement = document.getElementById(`extend ${option.key}`);
        if(extendElement){
        extendElement.style.visibility = "hidden";
        }

    }
    }, 
    [
        h("div",{ id:option.key, style: "width: fit-content"},`${option.label}`),
        h("div",{id:`extend ${option.key}`, style: "width: fit-content; visibility: hidden"},[
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
            }
            //隐藏
            const checkNode = document.getElementById(option.key);
            if(checkNode){
                checkNode.style.color=( option.isShow? "rgba(255, 255, 255, 0.82)": "rgba(255, 255, 255, 0.25)");                           
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
          id:`dropDown ${option.key}`,
          placement: "right-start",
          show:showDropDownArr[option.key],
          options: option.type === 's3m' ? [
            {
              label: "快速定位",
              key: 1,
              icon: () => h("i", { class: "iconfont icondingwei" }, ""), 
            },
            {
              label: "图层操作",
              key: 2,
              icon: () => h("i", { class: "iconfont iconyidong" }, ""), 
            },
            {
              label: "图层属性",
              key: 3,
              icon: () => h("i", { class: "iconfont icontishi" }, ""), 
            },
            {
              label: "图层风格",
              key: 4,
              icon: () => h("i", { class: "iconfont icontuceng" }, ""), 
            },
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
            layerStore.s3mLayerSelectIndex = option.key.split('-')[1];
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
              showDropDownArr[option.key] = !showDropDownArr[option.key];
              showDropDownArr = {};
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
                onClick: (e) => {
                  if(!targetDropDown.value){
                    showDropDownArr[option.key] = !showDropDownArr[option.key]
                  }else{
                    showDropDownArr[targetDropDown.value] =!showDropDownArr[targetDropDown.value];
                    if(targetDropDown.value!=option.key){
                    showDropDownArr[option.key] = !showDropDownArr[option.key]
                    }
                  }
                    targetDropDown.value = option.key;
                },
              },
              {
                icon: () => h("i", { class: "iconfont icongengduo" }, ""),
              }
            ),
        }
      )
        ])
    ])
    }else{
        return `${option.label}`
    }
}
</script>

<style lang="scss" scoped>
.layer-list-box{
  padding: 0px 6px;
}
</style>
