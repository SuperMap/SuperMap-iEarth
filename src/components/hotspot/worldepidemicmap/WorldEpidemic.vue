
<template>
  <!-- 气泡HTML -->
  <div>
    <div id="bubble2" class="bubble" v-show="bubbleShow">
      <div style="overflow-y:auto;" id="tableContainer">
        <div id="tab" style="padding: 10px;">
          <div>
            <span>国家:</span>
            <span>{{countryName}}</span>
          </div>
          <div v-if="existData">
            <div>
              现有确诊:
              <span>{{Ptotal["nowConfirm"]}}</span>
            </div>
            <div>
              累计确诊:
              <span>{{Ptotal["confirm"]}}</span>
            </div>
            <div>
              累计死亡:
              <span>{{Ptotal["dead"]}}</span>
            </div>
            <div>
              累计康复:
              <span>{{Ptotal["heal"]}}</span>
            </div>
          </div>
          <div v-if="!existData">
            <div>暂无数据</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 疫情图层颜色说明 -->
    <div id="legend" class="params-setting-container" v-if="hotSpotsShow">

      <div style="margin-top: 0px;">
        <div
          style="width: 16px; height: 16px;display: inline-table; margin-left: 4px; background-color: rgb(127,  17,  0);"
        ></div>
        <span style="margin-left: 0px;font-size: 14px;">>50万</span>
      </div>

      <div style="margin-top: 0px;">
        <div
          style="width: 16px; height: 16px;display: inline-table; margin-left: 4px; background-color: rgb(189,  19,  22);"
        ></div>
        <span style="margin-left: 0px;font-size: 14px;">10万 - 50万</span>
      </div>

      <div style="margin-top: 0px;">
        <div
          style="width: 16px; height: 16px;display: inline-table; margin-left: 4px; background-color: rgb(230,  75,   69);"
        ></div>
        <span style="margin-left: 0px;font-size: 14px;">1万 - 10万</span>
      </div>

      <div style="margin-top: 0px;">
        <div
          style="width: 16px; height: 16px;display: inline-table; margin-left: 4px; background-color: rgb(255,   140,  113);"
        ></div>
        <span style="margin-left: 0px;font-size: 14px;">5000 - 9999</span>
      </div>

      <div style="margin-top: 0px;">
        <div
          style="width: 16px; height: 16px;display: inline-table; margin-left: 4px; background-color: rgb(253,   210,  160);"
        ></div>
        <span style="margin-left: 0px;font-size: 14px;">500 - 4999</span>
      </div>

      <div style="margin-top: 0px;">
        <div
          style="width: 16px; height: 16px;display: inline-table; margin-left: 4px; background-color: rgb(255,   242,  207);"
        ></div>
        <span style="margin-left: 0px;font-size: 14px;">1 - 499</span>
      </div>
      <div style="margin-top: 0px;">
        <div
          style="width: 16px; height: 16px;display: inline-table; margin-left: 4px; background-color: rgb(255,   255,  255);"
        ></div>
        <span style="margin-left: 0px;font-size: 14px;">0</span>
      </div>
    </div>
    <!-- 疫情信息展示 -->
    <div id="yq-info" v-if="hotSpotsShow">
      <button class="goOutBtn" @click="clear">×</button>
      <div style="display:block;margin-bottom:-5px;margin-top:-2px">
        <span
          id="yq-info-title"
          style="font-weight: normal;font-size: 26px;letter-spacing: 4px;"
        >全球新冠肺炎疫情地图</span>
      </div>
      <div
        style="display:block;margin-bottom: 4px;margin-top: 6px;font-size: 12px;color: rgb(214, 212, 212);letter-spacing: 1px;"
      >
        <span>截至{{yqDate}}</span>
      </div>
      <div
        style="display:inline-block;margin-bottom: -5px;font-size: 16px;background-color:rgba(0, 0, 0, 0.4);"
      >
        <div
          class="yq-info-item"
          style=" padding: 4px; margin-left: 2px; margin-right: 2px;margin-top: -4px; margin-bottom: -4px;"
        >
          <div style=" margin-bottom: -3px;">
            <span
              id="yq-ljqz"
              style="color: rgb(175, 8,25);font-size: 22px;font-weight: bold;"
            >{{ljqz}}</span>
          </div>
          <div style="margin: 1px;">
            <span
              style="background-color: rgba(255, 255, 255, 0.1);padding: 3px;font-size: 12px;font-weight: lighter;padding-top: 0px;"
            >确诊人数</span>
          </div>
          <div>
            <span style="color: rgb(243, 166, 67);font-size: 12px;">较昨日</span>+
            <span id="yq-qz-zrzj" style="font-size: 14px;">{{qzZrzj}}</span>
          </div>
        </div>
        <div
          class="yq-info-item"
          style=" padding: 4px; margin-left: 2px; margin-right: 2px;margin-top: -4px; margin-bottom: -4px;"
        >
          <div style=" margin-bottom: -3px;">
            <span
              id="yq-ljzycy"
              style="color: rgb(19, 206, 182);font-size: 22px;font-weight: bold;"
            >{{ljzycy}}</span>
          </div>
          <div style="margin: 1px;">
            <span
              style="background-color: rgba(255, 255, 255, 0.1);padding: 3px;font-size: 12px;font-weight: lighter;padding-top: 0px;"
            >治愈人数</span>
          </div>
          <div>
            <span style="color: rgb(243, 166, 67);;font-size: 12px;">较昨日</span>+
            <span id="yq-zy-zrzj" style="font-size: 14px;">{{zyZrzj}}</span>
          </div>
        </div>
        <div
          class="yq-info-item"
          style=" padding: 4px; margin-left: 2px; margin-right: 2px;margin-top: -4px; margin-bottom: -4px;"
        >
          <div style=" margin-bottom: -3px;">
            <span
              id="yq-ljsw"
              style="color: rgb(158, 189, 210);font-size: 22px;font-weight: bold;"
            >{{ljsw}}</span>
          </div>
          <div style="margin: 1px;">
            <span
              style="background-color: rgba(255, 255, 255, 0.1);padding: 3px;font-size: 12px;font-weight: lighter;padding-top: 0px;"
            >死亡人数</span>
          </div>
          <div>
            <span style="color: rgb(243, 166, 67);;font-size: 12px;">较昨日</span>+
            <span id="yq-sw-zrzj" style="font-size: 14px;">{{swZrzj}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增人数前十国家排名 -->
    <div class="bubble hidden" v-if="hotSpotsShow" style="left:1%;bottom:9%;max-height:330px">
      <div style="overflow-y:auto;" id="tableContainer">
        <div id="tab" style="padding: 10px;">
          <div>
            <span style="font-size:18px;">新增确诊国家排名（前十）</span>
          </div>
          <div v-for="country in countryAddConfirmRankList" :key="country.nation" style="font-size: 16px;">
            <span>{{country.nation}}</span>:
            <span>{{country.addConfirm}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div id="main" style="color:#fff;width: 300px;height:200px; position: absolute;left:0;top:100px;z-index:666"></div> -->
  </div>
</template>

<script>
import hotSpots_config from "@/data/hotSpots_CN.json";
let WorldIds, colorsWorld, infoboxContainer, handler;
export default {
  name: "WorldEpidemicMap",
  data() {
    return {
      sharedState: store.state,
      bubbleShow: false,
      yqDate: null,
      ljqz: null,
      ljzycy: null,
      ljsw: null,
      qzZrzj: null,
      zyZrzj: null,
      swZrzj: null,
      countryAddConfirmRankList: null, //世界新增前十国家排名表
      countryName: null,
      Ptotal: null,
      existData: false,
    };
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
    hotSpotsShow: function () {
      return this.sharedState.hotSpots[1];
    },
  },
  methods: {
    init() {
      colorsWorld = [
        new Cesium.Color(255 / 255, 255 / 255, 255 / 255, 0.7),
        new Cesium.Color(255 / 255, 242 / 255, 207 / 255, 0.7),
        new Cesium.Color(253 / 255, 210 / 255, 160 / 255, 0.7),
        new Cesium.Color(255 / 255, 140 / 255, 113 / 255, 0.7),
        new Cesium.Color(230 / 255, 75 / 255, 69 / 255, 0.7),
        new Cesium.Color(189 / 255, 19 / 255, 22 / 255, 0.7),
        new Cesium.Color(127 / 255, 17 / 255, 0 / 255, 0.7),
      ];
      WorldIds = {
        1: "俄罗斯",
        2: "北极地区",
        3: "格陵兰（丹）",
        4: "扬马延岛（挪）",
        5: "冰岛",
        6: "法罗群岛（丹）",
        7: "芬兰",
        8: "爱沙尼亚",
        9: "拉脱维亚",
        10: "立陶宛",
        11: "丹麦",
        12: "白俄罗斯",
        13: "爱尔兰",
        14: "波兰",
        15: "捷克",
        16: "蒙古",
        17: "乌克兰",
        18: "卢森堡",
        19: "德国",
        20: "斯洛伐克",
        21: "摩尔多瓦",
        22: "匈牙利",
        23: "奥地利",
        24: "列支敦士登",
        25: "斯洛文尼亚",
        26: "瑞士",
        27: "法国",
        28: "罗马尼亚",
        29: "波斯尼亚",
        30: "克罗地亚",
        31: "保加利亚",
        32: "圣马力诺",
        33: "摩纳哥",
        34: "吉尔吉斯斯坦",
        35: "安道尔",
        36: "马其顿",
        37: "阿塞拜疆",
        38: "阿尔巴尼亚",
        39: "土库曼斯坦",
        40: "乌兹别克斯坦",
        41: "塔吉克斯坦",
        42: "朝鲜",
        43: "阿尔及利亚",
        44: "直布罗陀（英占）",
        45: "阿富汗",
        46: "马耳他",
        47: "伊拉克",
        48: "塞浦路斯",
        49: "黎巴嫩",
        50: "利比亚",
        51: "约旦",
        52: "巴勒斯坦",
        53: "日本",
        54: "巴基斯坦",
        55: "",
        56: "尼泊尔",
        57: "不丹",
        58: "巴哈马",
        59: "西撒哈拉",
        60: "孟加拉国",
        61: "阿曼",
        62: "毛利塔尼亚",
        63: "沙特阿拉伯",
        64: "老挝",
        65: "多米尼加",
        66: "开曼群岛（英）",
        67: "",
        68: "安圭拉（英）",
        69: "波多黎各",
        70: "",
        71: "尼日尔",
        72: "厄立特里亚",
        73: "",
        74: "",
        75: "",
        78: "马里",
        79: "塞内加尔",
        80: "",
        81: "",
        82: "",
        83: "布基纳法索",
        84: "埃塞俄比亚",
        85: "",
        86: "",
        87: "萨尔瓦多",
        88: "",
        89: "",
        90: "",
        91: "菲律宾",
        92: "喀麦隆",
        93: "尼加拉瓜",
        94: "缅甸",
        95: "荷属安的列斯",
        96: "柬埔寨",
        97: "",
        98: "",
        99: "吉布提",
        100: "特立尼达",
        101: "乍得",
        102: "多哥",
        103: "",
        104: "塞拉利昂",
        105: "苏里南",
        106: "利比里亚",
        107: "贝宁",
        108: "斯里兰卡",
        109: "尼日利亚",
        110: "苏丹",
        111: "马来西亚",
        112: "圭亚那",
        113: "法属圭亚那",
        114: "索马里",
        115: "瑙鲁",
        116: "文莱",
        117: "马尔代夫",
        118: "赤道几内亚",
        119: "乌干达",
        120: "新加坡",
        121: "",
        122: "圣多美和普林西比",
        124: "肯尼亚",
        125: "",
        126: "",
        127: "加蓬",
        128: "厄瓜多尔",
        129: "卢旺达",
        130: "布隆迪",
        131: "刚果",
        132: "",
        133: "坦桑尼亚",
        134: "查戈斯群岛",
        135: "所罗门群岛",
        136: "东帝汶",
        137: "",
        138: "塞舌尔",
        139: "",
        140: "",
        141: "科摩罗",
        142: "",
        143: "马拉维",
        144: "",
        145: "赞比亚",
        146: "",
        147: "",
        148: "",
        149: "澳大利亚",
        150: "",
        151: "津巴布韦",
        152: "",
        153: "",
        154: "",
        155: "",
        156: "",
        157: "",
        158: "纳米比亚",
        159: "",
        160: "巴拉圭",
        161: "博茨瓦纳",
        162: "",
        163: "阿根廷",
        164: "斯威士兰",
        165: "",
        166: "南非",
        167: "莱索托",
        168: "乌拉圭",
        169: "新西兰",
        170: "",
        171: "福克兰群岛",
        172: "",
        173: "",
        174: "",
        175: "哈萨克斯坦",
        176: "格鲁吉亚",
        178: "亚美尼亚",
        179: "伊朗",
        180: "巴林",
        181: "卡塔尔",
        182: "荷兰",
        183: "比利时",
        184: "科特迪瓦",
        185: "墨西哥",
        186: "",
        187: "美国",
        188: "",
        189: "",
        190: "智利",
        191: "加拿大",
        192: "",
        193: "委内瑞拉",
        194: "秘鲁",
        195: "玻利维亚",
        196: "巴西",
        197: "",
        198: "伯利兹",
        199: "洪都拉斯",
        200: "危地马拉",
        201: "哥斯达黎加",
        202: "巴拿马",
        203: "哥伦比亚",
        204: "牙买加",
        205: "海地",
        206: "古巴",
        207: "",
        208: "斐济群岛",
        209: "",
        210: "",
        211: "巴布亚新几内亚",
        212: "",
        213: "韩国",
        214: "马达加斯加",
        215: "",
        216: "安哥拉",
        217: "也门",
        218: "印度尼西亚",
        219: "泰国",
        220: "莫桑比克",
        221: "科威特",
        222: "几内亚",
        223: "中非",
        224: "加纳",
        225: "扎伊尔",
        226: "阿拉伯联合酋长国",
        227: "几内亚比绍",
        228: "葡萄牙",
        229: "希腊",
        230: "突尼斯",
        231: "摩洛哥",
        232: "冈比亚",
        233: "越南",
        234: "土耳其",
        235: "叙利亚",
        236: "以色列",
        237: "阿拉伯区",
        238: "埃及",
        239: "西班牙",
        240: "挪威",
        241: "瑞典",
        242: "意大利",
        243: "英国",
        244: "南斯拉夫",
        245: "印度",
        246: "中华人民共和国",
      };
       let layer = viewer.scene.layers.find("World_简化");
       let layerlap = viewer.scene.layers.find("World标签");
      layerlap.isOverlapDisplayed = false;
       if (layer) {
          layer.selectedColor = new Cesium.Color(
            252 / 255,
            224 / 255,
            55 / 255,
            0.7
          );
          layer.style3D.lineWidth = 1;
          layer.style3D.lineColor = new Cesium.Color(
            196 / 255,
            219 / 255,
            237 / 255,
            1
          );
          layer.hasLight = false;
          layer.maxVisibleAltitude = Number.MAX_VALUE;
          layer.selectColorType = Cesium.SelectColorType.REPLACE;
        }
      //世界数据
      axios
        .jsonp("https://view.inews.qq.com/g2/getOnsInfo?name=disease_foreign")
        .then((response) => {
          let data = JSON.parse(response.data);
          //全球统计数据
          window.yqWorldData = data;
          this.ljqz = data.globalStatis.confirm;
          this.ljzycy = data.globalStatis.heal;
          this.ljsw = data.globalStatis.dead;
          this.qzZrzj = data.globalStatis.confirmAdd;
          this.zyZrzj = data.globalStatis.healAdd;
          this.swZrzj = data.globalStatis.deadAdd;
          this.yqDate = data.globalStatis.lastUpdateTime;
          this.countryAddConfirmRankList = data.countryAddConfirmRankList;
          //每个国家的数据ranklist
          axios
            .post(
              "https://api.inews.qq.com/newsqa/v1/automation/foreign/country/ranklist"
            )
            .then((data) => {
              let countrys = data.data.data;
              window.countrysData = countrys;
              for (let i = 0, j = countrys.length; i < j; i++) {
                let country = countrys[i];
                let confirm = country.confirm;
                let color = this.findColorWorld(confirm);
                let id = this.findIdByName(country.name);
                layer.setObjsColor(id, color);
              };

              //中国数据
              axios
                .jsonp(
                  "https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5"
                )
                .then((response) => {
                  let data = JSON.parse(response.data);
                  window.chinaDatas = data;
                  let id = this.findIdByName("中华人民共和国");
                  let color = this.findColorWorld(data.chinaTotal.confirm);
                  layer.setObjsColor(id, color);
                });
              layer.refresh();
            });
        });
      let scenePosition = null; // 记录在场景中点击的笛卡尔坐标点
      infoboxContainer = document.getElementById("bubble2");
      handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      handler.setInputAction((e) => {
        this.bubbleShow = false;
        let cameraHeight = viewer.scene.camera.positionCartographic.height;
        // 获取点击位置笛卡尔坐标
        scenePosition = viewer.scene.pickPosition(e.position);
        this.bubblePosition(scenePosition);
        let selLayer = viewer.scene.layers.getSelectedLayer();
        if (!selLayer) {
          this.bubbleShow = false;
          return;
        }
        let id = selLayer.getSelection();
        let countryName = this.findNameById(id);
        let province = this.findDataByName(countryName, window.countrysData);

        if (countryName === "中华人民共和国") {
          province = window.chinaDatas.chinaTotal;
        }

        if (province) {
          this.bubbleShow = true;
          this.existData = true;
          this.Ptotal = province;
          this.countryName = countryName;
        } else {
          this.bubbleShow = true;
          this.existData = false;
          this.countryName = countryName;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    // 气泡位置
    bubblePosition(scenePosition) {
      if (scenePosition) {
        let windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          viewer.scene,
          scenePosition,
          windowPosition
        );
        infoboxContainer.style.top = windowPosition.y + "px";
        infoboxContainer.style.left = windowPosition.x + "px";
      }
    },
    findIdByName(name) {
      for (let item in WorldIds) {
        let value = WorldIds[item];
        if (value === name) {
          return item;
        }
      }
      for (let item in WorldIds) {
        let value = WorldIds[item];
        if (value.indexOf(name) != -1) {
          return item;
        }
      }
      return -1;
    },

    findNameById(id) {
      return WorldIds[id] || "";
    },

    findDataByName(name, datas) {
      for (let i = 0; i < datas.length; i++) {
        let item = datas[i];
        if (name === item.name) {
          return item;
        }
      }
      for (let i = 0; i < datas.length; i++) {
        let item = datas[i];
        if (name.indexOf(item.name) != -1) {
          return item;
        }
      }

      return null;
    },

    findColorWorld(num) {
      if (num < 1) {
        return colorsWorld[0];
      }

      if (num <= 499) {
        return colorsWorld[1];
      }

      if (num <= 4999) {
        return colorsWorld[2];
      }

      if (num <= 9999) {
        return colorsWorld[3];
      }

      if (num <= 100000) {
        return colorsWorld[4];
      }

      if (num <= 500000) {
        return colorsWorld[5];
      }

      return colorsWorld[6];
    },
    clear() {
      !handler.isDestroyed() && handler.destroy();
      this.bubbleShow = false;
      viewer.scene.layers.remove("World标签");
      viewer.scene.layers.remove("World_简化");
      viewer.scene.layers.remove("China_Boundary_C_ln@China");
      store.setHotSpots(1, 0);
      this.reset();
      hotSpots_config.hotSpots[1].state = 0; //图层添加状态置零
    },
    reset() {
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          110.60396458865515,
          34.54408834959379,
          30644793.325518917
        ),
      });
    },
  },

  watch: {
    hotSpotsShow(val) {
      if (val) {
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./WorldEpidemic.scss";
</style>
