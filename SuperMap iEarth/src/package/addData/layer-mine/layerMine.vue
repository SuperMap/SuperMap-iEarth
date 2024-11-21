<template>
  <div class="layer-terrain-container">
    <div class="portalServiceTable">
      <n-data-table
        size="small"
        :columns="state.columns"
        :data="state.portalServiceList"
        :row-class-name="rowClassName"
        flex-height
        class="flex-1-hidden"
        v-model:checked-row-keys="state.checkedRowKeys"
      />
    </div>
    
    <n-scrollbar x-scrollable>
      <n-pagination 
        v-model:page="state.currentPage" 
        :page-count="state.pageCount" 
        style="margin-top: 0.1rem;"
      />
    </n-scrollbar>

    <div style="margin-top: 0.1rem;">
        <n-checkbox v-model:checked="state.useSenceName">{{ $t("appointSceneName") }}</n-checkbox>
    </div>

    <div class="row-item-mine" v-if="state.useSenceName">
      <span>{{ $t("name") }}</span>
      <n-input class="add-input-border" v-model:value="state.sceneName" type="text" style="width: 2.4rem" @input="handleNameChange"/>
    </div>

    <div class="btn-row-item opration">
      <n-button
        type="info"
        class="ans-btn"
        color="#3499E5"
        text-color="#fff"
        :focusable="false"
        @click="addService"
        :disabled="!state.isCheckPass"
        >{{ $t("sure") }}</n-button
      >
      <n-button :focusable="false" @click="refreshData">{{ $t("refresh") }}</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, reactive} from "vue";
import { useMessage } from "naive-ui";
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { useLayerStore } from "@/store/layerStore/layer";
import {
  getRootUrl,
  isIportalProxyServiceUrl,
  getHostName,
} from "@/tools/iportal/portalTools";
import { RuleCheckTypeEnum, inputRuleCheck } from "@/tools/inputRuleCheck";

const IportalStore = IportalStoreCreate();
const layerStore = useLayerStore();
const message = useMessage();

let widget: any = viewer.cesiumWidget;

// let testHeader = 'http://172.16.168.74:8190/iportal/'; 
// http://172.16.168.74:8190/iportal/web/services.json?pageSize=10&orderBy=UPDATETIME&orderType=DESC&permissionType=READ&currentPage=1
// 用户名/密码：admin supermap.12 by 易桂全

let baseUrl = getRootUrl() + 'web/services.json?pageSize=10&orderBy=UPDATETIME&orderType=DESC&permissionType=READ&currentPage';

onMounted(() => {
  let searchUrl = `${baseUrl}=1`;
  getIportalServiceData(searchUrl);
  message.success($t("getData"));
});

type stateType = {
  portalServiceList: any;
  columns: any;
  tableData: any;
  checkedRowKeys: any;
  currentPage:number;
  pageCount:number;
  useSenceName:boolean;
  isNamePass:boolean;
  isCheckPass:boolean;
  sceneName:string;
};

let state = reactive<stateType>({
  portalServiceList: [],
  columns: [
    {
      type: "selection",
      multiple: false,
      align: "center",
      disabled: (rowdata) => {
        return rowdata.disabled ? true : false;
      },
    },
    {
      key: "name",
      title: $t("serviceName"),
      align: "center",
    },
    {
      key: "resourceSubType",
      title: $t("resourceSubType"),
      align: "center",
    },
    {
      key: "updateTime",
      title: $t("updateTime"),
      align: "center",
    },
    {
      key: "url",
      title: $t("serviceUrl"),
      align: "center",
      ellipsis: {
        tooltip: true,
      },
    },
  ],
  tableData: [],
  checkedRowKeys: ["1"],
  currentPage:1,
  pageCount:1,
  useSenceName:false,
  isNamePass:false,
  isCheckPass:true,
  sceneName: '',
});

function handleNameChange() {
  state.sceneName = state.sceneName.trim();
  const checkeResult = inputRuleCheck(state.sceneName, RuleCheckTypeEnum.Text);
  if (!checkeResult.isPass) message.warning(checkeResult.message);
  state.isNamePass = checkeResult.isPass;
  computedCheckPass();
}

function computedCheckPass(){
  if(state.useSenceName){
    state.isCheckPass = state.isNamePass;
  }else{
    state.isCheckPass = true;
  }
}

// 给非场景类型的服务项添加新class
let rowClassName = function (row: any) {
  if (row.disabled) {
    return 'myService-disabled-item'
  }
  return ''
}

async function getIportalServiceData(searchUrl:string){
  if(!searchUrl) return;

  if (window.iEarthConsole){
      console.log("iportal-myservice-searchUrl:",searchUrl);
  }

  let data = await window.axios.get(searchUrl).then((response)=>{
    return response.data;
  })

  if (window.iEarthConsole){
      console.log("iportal-myservice-data:",data);
  }

  state.pageCount = Number(data.totalPage);

  if (data.content && data.content.length > 0) {
    state.portalServiceList.length = 0; // 清空当前列表
    data.content.forEach((item: any, index:number) => {
      let sceneUrl = item.proxiedUrl || item.linkPage;
      let disabled = item.type != "REALSPACE"; // 当前仅支持场景
      state.portalServiceList.push({
        key: `my-service-${index}`,
        name: item.resTitle || '',
        resourceSubType: item.type,
        updateTime: dateDiff(item.updateTime),
        url: sceneUrl,
        disabled: disabled,
      });
    })
  }
}

// 因为@on-update:page = "fun"没起作用，这里用watch监听实现
watch(
  () => state.currentPage,
  (val) => {
    let searchUrl = `${baseUrl}=${val}`;
    getIportalServiceData(searchUrl);
  }
);

watch(
  () => state.useSenceName,
  (val) => {
    computedCheckPass();
  }
);

// // 初始化并获取数据
// function init_Origin() {
//   //查询出portal中的服务列表（只查询出服务项）
//   let searchUrl =
//     getRootUrl() +
//     "gateway/catalog/resource/search.json?searchType=MY_RES&resourceType=SERVICE";

//   if (window.iEarthConsole) console.log("searchUrl-mine:", searchUrl);

//   window.axios
//     //需要withCredentials验证否？
//     .get(searchUrl, { withCredentials: IportalStore.isPortal })
//     .then(function (response: any) {
//       let data = response.data.content;
//       if (window.iEarthConsole) console.log("response-mine:", response);
//       data.forEach((item: any) => {
//         let sceneID = item.resourceId;

//         let highestpermissionurl =
//           getRootUrl() +
//           "web/permissions/highestpermission.json?resourceIds=" +
//           encodeURIComponent("[" + sceneID + "]") +
//           "&resourceType=SERVICE";

//         let arrays = ["READ", "READWRITE", "DELETE"];
//         //判断是否有权限
//         let noPermission = false;
//         window.axios
//           .get(highestpermissionurl, {
//             withCredentials: IportalStore.isPortal,
//           })
//           .then(function (responseHigh: any) {
//             if (arrays.indexOf(responseHigh.data[sceneID]) < 0) {
//               noPermission = true;
//             }
//             let scenePostUrl =
//               getRootUrl() + "web/services/" + item.resourceId + ".json";
//             window.axios
//               .get(scenePostUrl, { withCredentials: IportalStore.isPortal })
//               .then(function (responseScene) {
//                 let sceneUrl =
//                   responseScene.data.proxiedUrl || responseScene.data.linkPage;
//                 let disabled =
//                   noPermission || item.resourceSubType != "REALSPACE"; //是否禁用选择
//                 state.portalServiceList.push({
//                   key: item.name,
//                   name: item.name,
//                   resourceSubType: item.resourceSubType,
//                   updateTime: dateDiff(item.updateTime),
//                   url: sceneUrl,
//                   disabled: disabled,
//                 });
//                 if (window.iEarthConsole){
//                   console.log(" state.portalServiceList：",state.portalServiceList);
//                 }
//               });
//           });
//       });
//     });
// }

// 打开保存的服务

function addService() {
  let selecteditems = state.portalServiceList.filter((item: any) => {
    return item.key === state.checkedRowKeys[0];
  });

  if (viewer) {
    selecteditems.forEach((item) => {
      let url = item.url + "/realspace";

      let promiseArray: any = [];
      setTrustedServers(url);

      // let promise = viewer.scene.open(url);
      let sceneName = state.sceneName == '' ? undefined : state.sceneName;
      const promise = viewer.scene.open(url, sceneName, { autoSetView: true });
      promiseArray.push(promise);
      promiseWhen(promiseArray);
    });
  }
}

// 检查请求是否带cookie
function setTrustedServers(url: string) {
  if (IportalStore.isPortal) {
    if (IportalStore.portalConfig) {
      let serviceProxy = IportalStore.portalConfig.serviceProxy;
      let withCredentials = isIportalProxyServiceUrl(url, serviceProxy);
      if (withCredentials) {
        let ip = getHostName(url);
        if (
          !SuperMap3D.TrustedServers.contains(
            "http://" + ip + "/" + serviceProxy.port
          )
        ) {
          SuperMap3D.TrustedServers.add(ip, serviceProxy.port);
        }
      }
    }
  }
}

function promiseWhen(promiseArray) {
  SuperMap3D.when.all(
    promiseArray,
    function (layers) {
      // for (let i = 0; i < layers.length; i++) {
      //   layers[i].visibleDistanceMax = 10000; //最大可见高度
      // }
      setTimeout(() => {
        layerStore.refreshLayerTree(); //更新图层
      }, 500);

      if (layers && layers[0]) {
        viewer.flyTo(layers[0]);
      }
    },
    function (e) {
      if (widget._showRenderLoopErrors) {
        var title = $t("scpUrlErrorMsg");
        widget.showErrorPanel(title, undefined, e);
      }
    }
  );
}

// 更新数据
function refreshData() {
  let searchUrl = `${baseUrl}=1`;
  state.currentPage = 1;
  getIportalServiceData(searchUrl);
}


/** 时间倒序，多少小时之前
 * @param timestamp 时间毫秒数
 */
function dateDiff(timestamp) {
  // 补全为13位
  let arrTimestamp: any = (timestamp + "").split("");
  for (let start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) {
      arrTimestamp[start] = "0";
    }
  }
  timestamp = arrTimestamp.join("") * 1;
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let month = day * 30;
  let now = new Date().getTime();
  let diffValue = now - timestamp;

  // 如果本地时间反而小于变量时间
  if (diffValue < 0) {
    return "不久前";
  }
  // 计算差异时间的量级
  let monthC: any = diffValue / month;
  let weekC: any = diffValue / (7 * day);
  let dayC: any = diffValue / day;
  let hourC: any = diffValue / hour;
  let minC: any = diffValue / minute;

  // 数值补0方法
  let zero = function (value) {
    if (value < 10) {
      return "0" + value;
    }
    return value;
  };

  // 使用
  if (monthC > 4) {
    // 超过1年，直接显示年月日
    return (function () {
      let date = new Date(timestamp);
      return (
        date.getFullYear() +
        $t("year") +
        zero(date.getMonth() + 1) +
        $t("month") +
        zero(date.getDate()) +
        $t("day")
      );
    })();
  } else if (monthC >= 1) {
    return parseInt(monthC) + $t("monthsAgo");
  } else if (weekC >= 1) {
    return parseInt(weekC) + $t("weeksAgo");
  } else if (dayC >= 1) {
    return parseInt(dayC) + $t("daysAgo");
  } else if (hourC >= 1) {
    return parseInt(hourC) + $t("hoursAgo");
  } else if (minC >= 1) {
    return parseInt(minC) + $t("minutesAgo");
  }
  return $t("secondsAgo");
}
</script>

<style lang="scss" scoped>
.layer-terrain-container {
  display: flex;
  flex-wrap: wrap;

}

.portalServiceTable {
  display: flex;
  flex-direction: column;
  margin-right: 0.1rem;
  height: 2.3rem;
  background-color: rgb(29, 29, 17);
  opacity: 0.5;
  z-index: 999999;
}

.flex-1-hidden {
  flex: 1 1 0% !important;
  overflow: hidden;
}

.opration {
  margin-top: 0.1rem;
  margin-left: 60%;
}

.row-item-mine{
  span {
    font-size: 0.14rem;
  }
  display: flex;
  justify-content: space-between;
  width: 3.4rem;
  margin-top: 0.1rem;
  margin-right: 0.1rem;
}
</style>
