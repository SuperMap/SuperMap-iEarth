<template>
  <n-modal v-model:show="panelStore.showSavePanel">
    <n-card
      style="width: 4rem; text-align: center"
      :title="$t('sceneSave')"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div class="save-scene-container">
        <canvas id="sceneCanvas" />
        <n-form
          ref="formRef"
          :model="fromData"
          label-placement="left"
          require-mark-placement="right-hanging"
          :style="{ maxWidth: '4.5rem' }"
        >
          <n-form-item
            label-width="0.8rem"
            :label="$t('saveDate')"
            path="storageSceneCurrentTime"
            :rule="{
              required: false,
              trigger: ['input', 'blur'],
            }"
          >
            <n-input
              v-model:value="fromData.storageSceneCurrentTime"
              clearable
            />
          </n-form-item>

          <n-form-item
            label-width="0.8rem"
            :label="$t('sceneName')"
            path="scenePortalName"
            :rule="{
              required: true,
              trigger: ['input', 'blur'],
              renderMessage: () => {
                if (language == 'zh') {
                  return '必选项';
                } else if (language == 'ja') {
                  return '必須オプション';
                } else {
                  return 'Must Option';
                }
              },
            }"
          >
            <n-input
              v-model:value="fromData.scenePortalName"
              :placeholder="$t('placeHolder')"
              clearable
            />
          </n-form-item>

          <n-form-item
            label-width="0.8rem"
            :label="$t('sceneLable')"
            path="scenePortalTages"
            :rule="{
              required: true,
              trigger: ['input', 'blur'],
              renderMessage: () => {
                if (language == 'zh') {
                  return '必选项';
                } else if (language == 'ja') {
                  return '必須オプション';
                } else {
                  return 'Must Option';
                }
              },
            }"
          >
            <n-input
              v-model:value="fromData.scenePortalTages"
              :placeholder="$t('placeHolder')"
              clearable
            />
          </n-form-item>

          <n-form-item
            label-width="0.8rem"
            :label="$t('authorName')"
            path="scenePortalUser"
            :rule="{
              required: false,
              trigger: ['input', 'blur'],
            }"
          >
            <n-input
              v-model:value="fromData.scenePortalUser"
              :placeholder="$t('placeHolder')"
              clearable
            />
          </n-form-item>

          <n-form-item
            label-width="0.8rem"
            :label="$t('sceneDescribe')"
            path="scenePortalDescription"
            :rule="{
              required: false,
              trigger: ['input', 'blur'],
            }"
          >
            <n-input
              v-model:value="fromData.scenePortalDescription"
              :placeholder="$t('placeHolder')"
              clearable
            />
          </n-form-item>

          <n-form-item>
            <n-space justify="space-between">
              <n-button
                type="info"
                color="#3499E5"
                :loading="state.isloading"
                text-color="#fff"
                attr-type="button"
                @click="saveScene"
              >
                {{ $t("save") }}
              </n-button>
              <n-button attr-type="button" @click="close">
                {{ $t("cancle") }}
              </n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { reactive,computed,watch } from "vue";
import { IportalStoreCreate } from "@/store/index";
import { usePanelStore } from "@/store/panelStore/index";
import { getRootUrl } from "@/tools/iportal/portalTools";
import { useLayerStore } from "@/store/layerStore/layer";
import i18n from "@/locale/index";
import SceneConfig from "@/lib/SceneConfig";

const panelStore = usePanelStore();
const IportalStore = IportalStoreCreate();
const layerStore = useLayerStore();

// 根据当前语言环境，切换naiveUI中的提示
let language = computed(() => {
  return i18n.global.locale;
});

// 初始化变量
let state = reactive({
  storageSceneShow: false,
  sceneID: "",
  loadingShow: false, // 模态框
  isloading: false,
});

// 表格数据
let fromData = reactive({
  storageSceneCurrentTime: "",
  scenePortalName: "",
  scenePortalTages: "",
  scenePortalUser: "",
  scenePortalDescription: "",
});

// 获取当前时间
function getNowFormatDate() {
  let date = new Date();
  let seperator1 = "-";
  let seperator2 = ":";
  let month: any = date.getMonth() + 1;
  let strDate: any = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let currentDate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate +
    " " +
    date.getHours() +
    seperator2 +
    date.getMinutes() +
    seperator2 +
    date.getSeconds();
  return currentDate;
}

// 保存当前场景（保存为本地JSON文件）
async function saveScene(){  
  if (!fromData.scenePortalName || fromData.scenePortalName == "") {
    window["$message"].warning($t("sceneSaveNameCannotBeNull"));
    return;
  }

  if (!fromData.scenePortalTages || fromData.scenePortalTages == "") {
    window["$message"].warning($t("sceneSaveLableCannotBeNull"));
    return;
  }

  if (window.location.href.includes("/apps")) {
    let iportaluserName = IportalStore.userInfo.userName;
    if (iportaluserName === "GUEST") {
      window["$message"].error($t("saveErrorNeedOnline"));
      return;
    }
  }

  state.isloading = true;

  let name = fromData.scenePortalName;
  let tagsArray = fromData.scenePortalTages.replace("，", ",").split(",");
  let userName = fromData.scenePortalUser;
  let description = fromData.scenePortalDescription;

  const sceneConfig = new SceneConfig(viewer);
  const sceneInfo = await sceneConfig.computedSceneInfo();
  const layerTreeData = computedLayerTreeData(); // 图层列表数据
  const bindiEarthData = computedBindData(); // 绑定在window上iEarth需要的数据
  const sceneContent = {
    sceneInfo:sceneInfo,
    layerTreeData:layerTreeData,
    bindiEarthData:bindiEarthData
  }
  const saveData = { // 场景保存参数设置
    name: name || '',
    tags: tagsArray || '',
    userName: userName || '',
    description: description || '', 
    content: JSON.stringify(sceneContent),
  }

  if (window.iEarthConsole) console.log("保存的场景信息:", saveData);

  if(window.iEarthBindData.EnvironmentMode == "Normal"){
    saveData.content = JSON.parse(saveData.content);
    window.iEarthTool.saveObjToJsonFile(saveData,name);
    state.isloading = false;
    window["$message"].success($t("saveSuccess"));
    panelStore.showSavePanel = false;
    return;
  }

  if (window.iEarthBindData.EnvironmentMode.includes("CreateScene")) {
    createScene(saveData);
  } else {
    updateScene(saveData);
  }
}

//创建并保存场景
function createScene(saveData) {
  let canvas: any = document.getElementById("sceneCanvas");
  let base64 = canvas.toDataURL("image/jpeg");
  base64 = base64.split(",")[1];

  // 保存场景
  let url = getRootUrl() + "web/scenes.json";
  window.axios
    .post(url, JSON.stringify(saveData), { withCredentials: true })
    .then(
      function (response) {
        state.sceneID = response.data.newResourceID;
        //保存缩略图
        let putSceneUrl =
          getRootUrl() +
          "web/scenes/" +
          parseInt(response.data.newResourceID) +
          "/thumbnail.json";

        window
          .axios({
            method: "put",
            url: putSceneUrl,
            data: base64,
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            withCredentials: true,
          })
          .then(function () {
            state.isloading = false;
            window["$message"].success($t("saveSuccess"));
            panelStore.showSavePanel = false;
            setTimeout(() => {
              let currentUrl =
                getRootUrl() +
                "apps/earth/v2/index.html?id=" +
                response.data.newResourceID;
              window.open(currentUrl, "_self");
            }, 1000);
          })
          .catch(function (error) {
            window["$message"].error(error.message.toString());
          });
      },
      function (err) {
        console.log(err);
        state.isloading = false;
        window["$message"].warning("配额不足");
      }
    );
}

// 更新保存场景的信息
function updateScene(saveData) {
  let openExistSceneUrl = window.location.href;
  let parmeter = openExistSceneUrl.split("id=")[1];
  state.sceneID = parmeter.split("&")[0];

  let canvas: any = document.getElementById("sceneCanvas");
  let base64 = canvas.toDataURL("image/jpeg");
  base64 = base64.split(",")[1];

  // 更新场景
  let url = getRootUrl() + "web/scenes/" + state.sceneID + ".json";
  window.axios
    .put(url, JSON.stringify(saveData), { withCredentials: true })
    .then(
      function () {
        //保存缩略图
        let putSceneUrl =
          getRootUrl() + "web/scenes/" + state.sceneID + "/thumbnail.json";
        window
          .axios({
            method: "put",
            url: putSceneUrl,
            data: base64,
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            withCredentials: true,
          })
          .then(function () {
            panelStore.showSavePanel = false;
            state.isloading = false;
            window["$message"].success($t("saveUpdate"));
            let currentUrl =
              getRootUrl() + "apps/earth/v2/index.html?id=" + state.sceneID;
            window.open(currentUrl, "_self");
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      function (err) {
        console.log(err);
        state.isloading = false;
        window["$message"].warning("配额不足");
      }
    );
}

// 计算iEarth绑定的相关信息
function computedBindData(){
  const bindData = {};
  bindData["layerQueryOptions"] = window.iEarthBindData.layerQueryOptions; // s3m图层绑定的查询数据源信息

  bindData["mapQueryOptions"] = window.iEarthBindData.mapQueryOptions; // 地图查询绑定的数据源信息

  bindData["mediaFeildOptions"] = layerStore.mediaFeildOptions; // 地图查询中媒体字段的绑定信息

  bindData["wmtsLayerOption"] = layerStore.wmtsLayerOption; // wmts服务

  bindData["baseMapOption"] = window.iEarthBindData.BaseMapOption; // 默认底图选项

  bindData["mediaResourceOptions"] = window.iEarthBindData.mediaResourceOptions; // 弹窗媒体资源

  bindData["bubbleFields"] = window.iEarthBindData.bubbleFields; // DB属性查询过滤字段 

  return bindData;
}

// 获取当前图层列表中S3M的结构
function computedLayerTreeData() {
  console.log("layerTreeData-S3M:", window.layerTreeData[0]);

  const LayerEnum = {
    S3M: 's3m',
    Imagery: "imagery",
    MVT: "mvt",
    Terrain: "terrain",
    Collection: 'collection',
    Group: "group",
    S3MROOT: "s3mRoot",
    ImgRoot: "imgRoot",
    MvtRoot: "mvtRoot",
    TinRoot: "tinRoot",
  }
  // 计算S3M图层的树结构
  let s3mTree = window.layerTreeData[0];
  let s3mTreeData:any = [];
  s3mTree.children.forEach(collection => {
    let obj:any = undefined;
    if (collection.type == LayerEnum.S3M) {
      let child = collection;
      obj = {
        label: child.label,
        name: child.id,
        type: LayerEnum.S3M,
      }
    } else if (collection.type == LayerEnum.Group) {
      let group = collection;
      obj = {
        label: group.label,
        type: LayerEnum.Group,
        children: []
      }
      group.children.forEach(child => {
        obj.children.push({
          label: child.label,
          name: child.id,
          type: LayerEnum.S3M
        })
      })
    } else if (collection.type == LayerEnum.Collection) {
      obj = {
        label: collection.label,
        type: LayerEnum.Collection,
        children: []
      }
      collection.children.forEach(group => {
        if (group.type == LayerEnum.Group) {
          let obj_group:any = {
            label: group.label,
            type: LayerEnum.Group,
            children: []
          }
          group.children.forEach(child => {
            obj_group.children.push({
              label: child.label,
              name: child.id,
              type: LayerEnum.S3M,
            })
          })
          if (obj_group.children && obj_group.children.length > 0) {
            obj.children.push(obj_group)
          }
        } else if (group.type == LayerEnum.S3M) {
          let child = group;
          obj.children.push({
            label: child.label,
            name: child.id,
            type: LayerEnum.S3M,
          })
        }
      })
    }

    if (!obj) {
      console.log('该项数据不满足要求请检查:', collection);
    } else if (obj.type == LayerEnum.S3M) {
      s3mTreeData.push(obj);
    } else if (obj.type == LayerEnum.Collection || obj.type == LayerEnum.Group) {
      if (obj.children && obj.children.length > 0) {
        s3mTreeData.push(obj);
      }
    }
  })

  console.log('s3mTreeData:', s3mTreeData)
  return {
    s3mTreeData: s3mTreeData
  };
}

// 关闭保存面板
function close() {
  panelStore.showSavePanel = false;
  state.isloading = false;
}

watch(
  () => panelStore.showSavePanel,
  () => {
    fromData.storageSceneCurrentTime = getNowFormatDate();
    fromData.scenePortalUser = IportalStore.userInfo.userName;
    if (IportalStore.saveInfo) {
      fromData.scenePortalName = IportalStore.saveInfo.scenePortalName;
      fromData.scenePortalTages = IportalStore.saveInfo.scenePortalTages;
      fromData.scenePortalUser = IportalStore.saveInfo.scenePortalUser;
      fromData.scenePortalDescription =
        IportalStore.saveInfo.scenePortalDescription;
    }
  }
);
</script>

<style lang="scss" scoped>
#sceneCanvas {
  width: 100%;
  margin-bottom: 0.1rem;
}

.save-scene-container {
  padding: 0 0.1rem;
  box-sizing: border-box;
}
</style>
