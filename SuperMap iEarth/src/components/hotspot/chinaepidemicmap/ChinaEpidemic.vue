<template>
  <!-- 气泡HTML -->
  <div>
    <div
      id="bubble"
      class="bubble"
      v-show="bubbleShow" >
      <div style="overflow-y:auto;" id="tableContainer">
        <div id="tab" style="padding: 10px;">
          <div>
            <span>{{cityORprovinceName}}</span>:
            <span>{{cityORprovince.name}}</span>
          </div>
          <div v-if="existData">
            <div>
              今日新增:
              <span>{{cityORprovince.today["confirm"]}}</span>
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
        <span style="margin-left: 0px;font-size: 14px;">>10000</span>
      </div>

      <div style="margin-top: 0px;">
        <div
          style="width: 16px; height: 16px;display: inline-table; margin-left: 4px; background-color: rgb(189,  19,  22);"
        ></div>
        <span style="margin-left: 0px;font-size: 14px;">1000 - 10000</span>
      </div>

      <div style="margin-top: 0px;">
        <div
          style="width: 16px; height: 16px;display: inline-table; margin-left: 4px; background-color: rgb(230,  75,   69);"
        ></div>
        <span style="margin-left: 0px;font-size: 14px;">500 - 999</span>
      </div>

      <div style="margin-top: 0px;">
        <div
          style="width: 16px; height: 16px;display: inline-table; margin-left: 4px; background-color: rgb(255,   140,  113);"
        ></div>
        <span style="margin-left: 0px;font-size: 14px;">100 - 499</span>
      </div>

      <div style="margin-top: 0px;">
        <div
          style="width: 16px; height: 16px;display: inline-table; margin-left: 4px; background-color: rgb(253,   210,  160);"
        ></div>
        <span style="margin-left: 0px;font-size: 14px;">10 - 99</span>
      </div>

      <div style="margin-top: 0px;">
        <div
          style="width: 16px; height: 16px;display: inline-table; margin-left: 4px; background-color: rgb(255,   242,  207);"
        ></div>
        <span style="margin-left: 0px;font-size: 14px;">1 - 9</span>
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
        >中国新冠肺炎疫情地图</span>
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
  </div>
</template>

<script>
import hotSpots_config from "@/data/hotSpots_CN.json";
let ZXSarray, colors, NamesArray, provinceNames, infoboxContainer, handler;
export default {
  name: "ChinaEpidemicMap",
  data() {
    return {
      sharedState: store.state,
      bubbleShow: false,
      cityORprovinceName: "省份",
      yqDate: null,
      ljqz: null,
      ljzycy: null,
      ljsw: null,
      qzZrzj: null,
      zyZrzj: null,
      swZrzj: null,
      cityORprovince: {},
      Ptotal: null,
      existData: false,
    };
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
    hotSpotsShow: function () {
      return this.sharedState.hotSpots[0];
    },
  },
  methods: {
    init() {
      let ids = {
        香港: 2,
        黑龙江: 23,
        台湾: 25,
        湖北: 30,
        上海: 34,
        广东: 5,
        内蒙古: 22,
        北京: 17,
        山西: 16,
        澳门: 1,
        浙江: 31,
        福建: 8,
        山东: 14,
        天津: 18,
        江苏: 28,
        河北: 19,
        云南: 6,
        四川: 10,
        吉林: 21,
        重庆: 9,
        辽宁: 20,
        贵州: 7,
        安徽: 29,
        陕西: 27,
        青海: 13,
        甘肃: 15,
        西藏: 11,
        新疆: 24,
        湖南: 33,
        江西: 32,
        海南: 3,
        河南: 26,
        广西: 4,
        宁夏: 12,
      };
      provinceNames = {
        30: "湖北",
        5: "广东",
        26: "河南",
        31: "浙江",
        33: "湖南",
        29: "安徽",
        28: "江苏",
        9: "重庆",
        14: "山东",
        10: "四川",
        23: "黑龙江",
        17: "北京",
        34: "上海",
        8: "福建",
        19: "河北",
        27: "陕西",
        4: "广西",
        3: "海南",
        6: "云南",
        7: "贵州",
        16: "山西",
        20: "辽宁",
        18: "天津",
        15: "甘肃",
        21: "吉林",
        32: "江西",
        22: "内蒙古",
        24: "新疆",
        12: "宁夏",
        1: "香港",
        13: "青海",
        25: "台湾",
        2: "澳门",
        11: "西藏",
      };
      NamesArray = [
        "崇明县",
        "济源市",
        "嘉峪关市",
        "东莞市",
        "",
        "中山市",
        "三沙市",
        "香港特别行政区",
        "澳门特别行政区",
        "石家庄市",
        "唐山市",
        "秦皇岛市",
        "邯郸市",
        "邢台市",
        "保定市",
        "张家口市",
        "承德市",
        "沧州市",
        "廊坊市",
        "衡水市",
        "太原市",
        "大同市",
        "阳泉市",
        "长治市",
        "晋城市",
        "朔州市",
        "晋中市",
        "运城市",
        "忻州市",
        "临汾市",
        "吕梁市",
        "呼和浩特市",
        "包头市",
        "乌海市",
        "赤峰市",
        "通辽市",
        "鄂尔多斯市",
        "呼伦贝尔市",
        "巴彦淖尔市",
        "乌兰察布市",
        "兴安盟",
        "锡林郭勒盟",
        "阿拉善盟",
        "沈阳市",
        "大连市",
        "鞍山市",
        "抚顺市",
        "本溪市",
        "丹东市",
        "锦州市",
        "营口市",
        "阜新市",
        "辽阳市",
        "盘锦市",
        "铁岭市",
        "朝阳市",
        "葫芦岛市",
        "长春市",
        "吉林市",
        "四平市",
        "辽源市",
        "通化市",
        "白山市",
        "松原市",
        "白城市",
        "延边朝鲜族自治州",
        "哈尔滨市",
        "齐齐哈尔市",
        "鸡西市",
        "鹤岗市",
        "双鸭山市",
        "大庆市",
        "伊春市",
        "佳木斯市",
        "七台河市",
        "牡丹江市",
        "黑河市",
        "绥化市",
        "大兴安岭地区",
        "上海市",
        "南京市",
        "无锡市",
        "徐州市",
        "常州市",
        "苏州市",
        "南通市",
        "连云港市",
        "淮安市",
        "盐城市",
        "扬州市",
        "镇江市",
        "泰州市",
        "宿迁市",
        "杭州市",
        "宁波市",
        "温州市",
        "嘉兴市",
        "湖州市",
        "绍兴市",
        "金华市",
        "衢州市",
        "舟山市",
        "台州市",
        "丽水市",
        "合肥市",
        "芜湖市",
        "蚌埠市",
        "淮南市",
        "马鞍山市",
        "淮北市",
        "铜陵市",
        "安庆市",
        "黄山市",
        "滁州市",
        "阜阳市",
        "宿州市",
        "六安市",
        "亳州市",
        "池州市",
        "宣城市",
        "福州市",
        "厦门市",
        "莆田市",
        "三明市",
        "泉州市",
        "漳州市",
        "南平市",
        "龙岩市",
        "宁德市",
        "南昌市",
        "景德镇市",
        "萍乡市",
        "九江市",
        "新余市",
        "鹰潭市",
        "赣州市",
        "吉安市",
        "宜春市",
        "抚州市",
        "上饶市",
        "济南市",
        "青岛市",
        "淄博市",
        "枣庄市",
        "东营市",
        "烟台市",
        "潍坊市",
        "济宁市",
        "泰安市",
        "威海市",
        "日照市",
        "莱芜市",
        "临沂市",
        "德州市",
        "聊城市",
        "滨州市",
        "菏泽市",
        "郑州市",
        "开封市",
        "洛阳市",
        "平顶山市",
        "安阳市",
        "鹤壁市",
        "新乡市",
        "焦作市",
        "濮阳市",
        "许昌市",
        "漯河市",
        "三门峡市",
        "南阳市",
        "商丘市",
        "信阳市",
        "周口市",
        "驻马店市",
        "武汉市",
        "黄石市",
        "十堰市",
        "宜昌市",
        "襄阳市",
        "鄂州市",
        "荆门市",
        "孝感市",
        "荆州市",
        "黄冈市",
        "咸宁市",
        "随州市",
        "恩施土家族苗族自治州",
        "长沙市",
        "株洲市",
        "湘潭市",
        "衡阳市",
        "邵阳市",
        "岳阳市",
        "常德市",
        "张家界市",
        "益阳市",
        "郴州市",
        "永州市",
        "怀化市",
        "娄底市",
        "湘西土家族苗族自治州",
        "广州市",
        "韶关市",
        "深圳市",
        "珠海市",
        "汕头市",
        "佛山市",
        "江门市",
        "湛江市",
        "茂名市",
        "肇庆市",
        "惠州市",
        "梅州市",
        "汕尾市",
        "河源市",
        "阳江市",
        "清远市",
        "潮州市",
        "揭阳市",
        "云浮市",
        "南宁市",
        "柳州市",
        "桂林市",
        "梧州市",
        "北海市",
        "防城港市",
        "钦州市",
        "贵港市",
        "玉林市",
        "百色市",
        "贺州市",
        "河池市",
        "来宾市",
        "崇左市",
        "成都市",
        "自贡市",
        "攀枝花市",
        "泸州市",
        "德阳市",
        "绵阳市",
        "广元市",
        "遂宁市",
        "内江市",
        "乐山市",
        "南充市",
        "眉山市",
        "宜宾市",
        "广安市",
        "达州市",
        "雅安市",
        "巴中市",
        "资阳市",
        "阿坝藏族羌族自治州",
        "甘孜藏族自治州",
        "凉山彝族自治州",
        "贵阳市",
        "六盘水市",
        "遵义市",
        "安顺市",
        "毕节市",
        "铜仁市",
        "黔西南布依族苗族自治州",
        "黔东南苗族侗族自治州",
        "黔南布依族苗族自治州",
        "昆明市",
        "曲靖市",
        "玉溪市",
        "保山市",
        "昭通市",
        "丽江市",
        "普洱市",
        "临沧市",
        "楚雄彝族自治州",
        "红河哈尼族彝族自治州",
        "文山壮族苗族自治州",
        "西双版纳傣族自治州",
        "大理白族自治州",
        "德宏傣族景颇族自治州",
        "怒江傈僳族自治州",
        "迪庆藏族自治州",
        "拉萨市",
        "昌都地区",
        "山南地区",
        "日喀则地区",
        "那曲地区",
        "阿里地区",
        "林芝地区",
        "西安市",
        "铜川市",
        "宝鸡市",
        "咸阳市",
        "渭南市",
        "延安市",
        "汉中市",
        "榆林市",
        "安康市",
        "商洛市",
        "兰州市",
        "金昌市",
        "白银市",
        "天水市",
        "武威市",
        "张掖市",
        "平凉市",
        "酒泉市",
        "庆阳市",
        "定西市",
        "陇南市",
        "临夏回族自治州",
        "西宁市",
        "海东地区",
        "海北藏族自治州",
        "黄南藏族自治州",
        "海南藏族自治州",
        "果洛藏族自治州",
        "玉树藏族自治州",
        "海西蒙古族藏族自治州",
        "银川市",
        "石嘴山市",
        "吴忠市",
        "固原市",
        "中卫市",
        "乌鲁木齐市",
        "克拉玛依市",
        "吐鲁番地区",
        "哈密地区",
        "昌吉回族自治州",
        "博尔塔拉蒙古自治州",
        "巴音郭楞蒙古自治州",
        "阿克苏地区",
        "克孜勒苏柯尔克孜自治州",
        "喀什地区",
        "和田地区",
        "伊犁哈萨克自治州",
        "塔城地区",
        "阿勒泰地区",
        "嘉义市",
        "嘉义县",
        "桃园县",
        "新竹县",
        "新竹市",
        "台中市",
        "新北市",
        "台中县",
        "南投县",
        "花莲县",
        "基隆市",
        "苗栗县",
        "彰化县",
        "云林县",
        "屏东县",
        "宜兰县",
        "台东县",
        "澎湖县",
        "台北市",
        "台南市",
        "高雄市",
        "东方市",
        "陵水黎族自治县",
        "定安县",
        "儋州市",
        "保亭黎族苗族自治县",
        "琼中黎族苗族自治县",
        "五指山市",
        "乐东黎族自治县",
        "白沙黎族自治县",
        "屯昌县",
        "澄迈县",
        "临高县",
        "万宁市",
        "三亚市",
        "文昌市",
        "昌江黎族自治县",
        "海口市",
        "琼海市",
        "北屯市",
        "石河子市",
        "五家渠市",
        "阿拉尔市",
        "图木舒克市",
        "北京市",
        "重庆市",
        "天津市",
        "甘南藏族自治州",
        "神农架林区",
        "仙桃市",
        "潜江市",
        "天门市",
      ];
      ZXSarray = ["北京", "天津", "上海", "重庆"];
      colors = [
        new Cesium.Color(255 / 255, 255 / 255, 255 / 255),
        new Cesium.Color(255 / 255, 242 / 255, 207 / 255),
        new Cesium.Color(253 / 255, 210 / 255, 160 / 255),
        new Cesium.Color(255 / 255, 140 / 255, 113 / 255),
        new Cesium.Color(230 / 255, 75 / 255, 69 / 255),
        new Cesium.Color(189 / 255, 19 / 255, 22 / 255),
        new Cesium.Color(127 / 255, 17 / 255, 0 / 255),
      ];
      let layers = viewer.scene.layers._layerQueue;
      layers.forEach((layer) => {
        if (layer._name.indexOf("市级行政区划") > -1) {
          layer.maxVisibleAltitude = 930000;
        } else {
          layer.minVisibleAltitude = 930000;
        }
      });
      let layer = viewer.scene.layers.find("Province_R@China");
      let cityLayer = viewer.scene.layers.find(
        "市级行政区划_简化@AdministrativeArea"
      );

      if (layer) {
        layer.selectedColor = new Cesium.Color(
          252 / 255,
          224 / 255,
          55 / 255,
          0.7
        );
        layer.maxVisibleAltitude = Number.MAX_VALUE;
        layer.minVisibleAltitude = 930000;
        layer.style3D.lineWidth = 1;
        layer.style3D.lineColor = new Cesium.Color(
          181 / 255,
          174 / 255,
          160 / 255,
          1
        );
        layer.hasLight = false;
        layer.selectColorType = Cesium.SelectColorType.REPLACE;
        axios
          .jsonp("https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5")
          .then((response) => {
            let data = JSON.parse(response.data);
            window.yqData = data;
            axios
              .post(
                'static/data/city_coordinates.json'
                // "http://www.supermapol.com/earth/data/city_coordinates.json"
              )
              .then((geoData) => {
                this.loadJson(cityLayer);
              });

            this.ljqz = data.chinaTotal.confirm;
            this.ljzycy = data.chinaTotal.heal;
            this.ljsw = data.chinaTotal.dead;
            this.qzZrzj = data.chinaAdd.confirm;
            this.zyZrzj = data.chinaAdd.heal;
            this.swZrzj = data.chinaAdd.dead;
            this.yqDate = data.lastUpdateTime;
            let provinces = data.areaTree[0].children;
            for (let i = 0, j = provinces.length; i < j; i++) {
              let province = provinces[i];
              let confirm = province.total.confirm;
              let color = this.findColor(confirm);
              let id = ids[province.name];
              layer.setObjsColor(id, color);
            };
            layer.refresh();
          });
      }
      if (cityLayer) {
        cityLayer.selectedColor = new Cesium.Color(
          252 / 255,
          224 / 255,
          55 / 255,
          0.7
        );
        cityLayer.maxVisibleAltitude = 930000;
        cityLayer.style3D.lineWidth = 1;
        cityLayer.style3D.lineColor = new Cesium.Color(
          181 / 255,
          174 / 255,
          160 / 255,
          1
        );
        cityLayer.hasLight = false;
        cityLayer.selectColorType = Cesium.SelectColorType.REPLACE;
      }

      // 选中柱子，弹出信息
      let scenePosition = null; // 记录在场景中点击的笛卡尔坐标点
      infoboxContainer = document.getElementById("bubble");
      handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((e) => {
        this.bubbleShow = false;
        let cameraHeight = viewer.scene.camera.positionCartographic.height;
        scenePosition = viewer.scene.pickPosition(e.position);
        this.bubblePosition(scenePosition);
        if (cameraHeight > 930000) {
          // 获取点击位置笛卡尔坐标
          let selLayer = viewer.scene.layers.getSelectedLayer();
          if (!selLayer) {
            this.bubbleShow = false;
            return;
          }
          let id = selLayer.getSelection();
          let provinceName = provinceNames[id];
          let data = window.yqData;
          let provinces = data.areaTree[0].children;
          let province;
          for (let p of provinces) {
            if (p.name === provinceName) {
              province = p;
              break;
            }
          }
          if (province) {
            this.bubbleShow = true;
            this.existData = true;
            this.cityORprovinceName = "省份";
            this.Ptotal = province.total;
            this.cityORprovince = province;
          }
        }
        if (cameraHeight <= 930000) {
          let selLayer = viewer.scene.layers.getSelectedLayer();
          if (!selLayer) {
            this.bubbleShow = false;
            return;
          }
          let id = selLayer.getSelection()[0]; //选中对象ID
          let cityName = NamesArray[id - 1]; //城市全称
          let cityData;
          for (let i = 0, j = window.citysData.length; i < j; i++) {
            let cityJson = window.citysData[i];
            let cityStr = cityJson.name.substring(0, 2);
            if (
              cityJson.name.indexOf("地区待") == -1 &&
              cityName.indexOf(cityStr) != -1
            ) {
              cityData = cityJson;
              break;
            }
          }

          //直辖市，在城市级别找不到，在省级找下
          if (!cityData) {
            for (let i = 0; i < window.provincesData.length; i++) {
              let cityStr = window.provincesData[i].name.substring(0, 2);
              if (cityName.indexOf(cityStr) != -1) {
                cityData = window.provincesData[i];
                break;
              }
            }
          }
          if (cityData) {
            this.bubbleShow = true;
            this.existData = true;
            this.cityORprovinceName = "城市";
            this.Ptotal = cityData.total;
            this.cityORprovince = cityData;
          } else {
            this.bubbleShow = true;
            this.existData = false;
            this.cityORprovinceName = "城市";
            this.cityORprovince = { name: cityName };
          }
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
    findColor(num) {
      if (num < 1) {
        return colors[0];
      };
      if (num <= 9) {
        return colors[1];
      };
      if (num <= 99) {
        return colors[2];
      };
      if (num <= 499) {
        return colors[3];
      };
      if (num <= 999) {
        return colors[4];
      };
      if (num <= 10000) {
        return colors[5];
      };
      return colors[6];
    },
    findCityId(name) {
      for (let i = 0; i < NamesArray.length; i++) {
        let nameAll = NamesArray[i];
        if (nameAll.indexOf(name) != -1) {
          return i;
        }
      }
      return -1;
    },
    loadJson(layer) {
      let provinces = window.yqData.areaTree[0].children;
      window.provincesData = provinces;
      window.citysData = [];
      let num = 0;
      for (let i = 0; i < provinces.length; i++) {
        let province = provinces[i];
        let citys = province.children;
        for (let j = 0, k = citys.length; j < k; j++) {
          num++;
          let city = citys[j];
          citysData.push(city);
          //直辖市
          if (ZXSarray.includes(province.name)) {
            //往省级 找找
            let color = this.findColor(province.total.confirm);
            let index = this.findCityId(province.name);
            if (index != -1) {
              let SmID = index + 1;
              layer.setObjsColor(SmID, color);
            } else {
              // console.log(city.name);
            }
          } else {
            //非直辖市
            let confirm = city.total.confirm;
            let color = this.findColor(confirm);
            let index = this.findCityId(city.name);
            if (index != -1) {
              // let SmID = ids2[index];
              let SmID = index + 1;
              layer.setObjsColor(SmID, color);
            } else {
              // console.log(city.name);
              //恩施州 与 恩施土家族自治州
              let index = this.findCityId(city.name.substring(0, 2));
              if (index != -1) {
                let SmID = index + 1;
                layer.setObjsColor(SmID, color);
              }
            }
          }
        }
      }
    },

    clear() {
      !handler.isDestroyed() && handler.destroy();
      this.bubbleShow = false;
      viewer.scene.layers.remove("Province_R@China");
      viewer.scene.layers.remove("市级行政区划标签");
      viewer.scene.layers.remove("市级行政区划_简化@AdministrativeArea");
      viewer.scene.layers.remove("文字标签png");
      viewer.scene.layers.remove("China_Boundary_C_ln@China");
      store.setHotSpots(0, 0);
      this.reset();
      hotSpots_config.hotSpots[0].state = 0; //图层添加状态置零
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
@import "./ChinaEpidemic.scss";
</style>
