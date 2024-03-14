<template>
  <div class="my-service-container">
    <n-data-table
      :columns="columns"
      :data="myServiceData"
      @update:checked-row-keys="handleCheck"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getRootUrl } from "@/tools/iportal/portalTools";
import { useMessage } from "naive-ui";

const message = useMessage();

let columns = ref([
  {
    type: "selection",
  },
  {
    title: $t("name"),
    key: "name",
  },
  {
    title: $t("type"),
    key: "type",
  },
  {
    title: $t("updateTime"),
    key: "time",
  },
]);

let myServiceData: any = ref([]);
let iportalToken = ref(
  "&token=BTKYtyi2bsoLNUA2xn7nRg3V9IfETNnmskQhpsmCz8Q5ClFYCWGAMJSX1ESedBqCF1jFmHLY_20jhpHssvwNQg.."
);

onMounted(() => {
  initMyServiceData();
});

// 初始化变量 只请求三维场景数据
function initMyServiceData() {
  let requestUrl =
    "/gateway/catalog/resource/search.json?searchType=MY_RES&resourceType=SERVICE&pageSize=1000";
  let rootUrl = getRootUrl();
  let url = rootUrl.includes("iportal")
    ? rootUrl + requestUrl
    : "/iportal" + requestUrl + iportalToken.value;

  // get请求参数没有生效 后续在看怎么改
  window.axios
    .get(url, {
      resourceType: "SERVICE",
      resourceSubTypes: "['REALSPACE']",
      pageSize: 1000,
    })
    .then((dataObj: any) => {
      dataObj.data.content.map((item: any) => {
        if (item.resourceSubType == "REALSPACE") {
          // 通过场景id去请求对应的数据
          let scenePostUrl = "/web/services/" + item.resourceId + ".json";
          let sceneurl = rootUrl.includes("iportal")
            ? rootUrl + scenePostUrl
            : "/iportal" + scenePostUrl;
          window.axios
            .get(sceneurl, { withCredentials: true })
            .then((responseScene: any) => {
              myServiceData.value.push({
                name: item.name,
                linkPage: responseScene.data.linkPage,
                time: formatTime(item.updateTime),
                type: "REALSPACE",
                key: responseScene.data.linkPage + "/realspace",
              });
            });
        }
      });
    });
}

function formatTime(timestamp: any) {
  const date = new Date(timestamp); // 创建 Date 对象

  const year = date.getFullYear(); // 获取年份
  const month = date.getMonth() + 1; // 获取月份（注意要加 1，因为月份从 0 开始）
  const day = date.getDate(); // 获取日期
  const hour = date.getHours(); // 获取小时
  const minute = date.getMinutes(); // 获取分钟
  const second = date.getSeconds(); // 获取秒数

  // 将时间格式化为字符串
  const formattedTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return formattedTime;
}

// 打开场景
function handleCheck(rowKeys: any) {
  if (rowKeys.length > 2) {
    message.warning("请选择一个场景打开");
    return;
  }
  let url = rowKeys;
  window.viewer.scene.open(url[0], undefined, { autoSetView: true });
}
</script>
