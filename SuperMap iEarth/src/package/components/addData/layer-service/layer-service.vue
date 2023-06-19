<template>
  <!-- 公共服务 -->
  <div class="layer-server-container">
    <div
      v-for="(item, index) in publicServiceList"
      class="ItemBox"
      :class="item.chooseType ? 'isSelect' : ''"
      :key="index"
      @click="addPublicService(item)"
    >
      <div class="img-box">
        <img class="img" :src="$t(item.thumbnail)" alt="" />
      </div>
      <span>{{ $t(item.name) }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { UrlDataSetCreate } from "@/store/layerUrlSet/dataSet";
import { useMessage } from "naive-ui";
// 导入json文件
import { house } from "./data/json/(32)小区.js";
import { road } from "./data/json/(36)道路_Del.js";
import { TreeData } from "./data/json/tree (5).js";

// import { useLayerTreeStore } from "@/store/index";
import { useLayerTreeStore } from "@/store/layerTreeStore/index";

const layerTreeStore = useLayerTreeStore();

// store仓库数据
const urlDataSetStore = UrlDataSetCreate();
const { publicServiceList } = storeToRefs(urlDataSetStore);

// 弹窗提示
const message = useMessage();

function addPublicService(item: any) {
  if (item.chooseType) {
    message.warning("请勿重复添加！");
    return;
  }
  // 如果是cbd的 添加天空盒等
  if (item.name == "global.BeijingCBD") {
    viewer.imageryLayers.addImageryProvider(
      new SuperMap3D.BingMapsImageryProvider({
        key: "AgYCj_VzN0MWJ-4pgJj3I7bZym9kmbb-HDWjG5cgHFJxNOokbRcSEtUwJM3uWweh", //可至官网（https://www.bingmapsportal.com/）申请key
        url: "//dev.virtualearth.net",
      })
    );
    let scene = viewer.scene;

    // 添加光源
    //光源位置--公园中心点
    var position1 = new SuperMap3D.Cartesian3.fromDegrees(
      116.459972821387,
      39.9098456272661,
      200
    );
    //光源方向点--打向西北方向，模拟日出之后的朝阳的效果
    // var targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(116.455768896303    ,  39.9120854569244    , 100);
    //光源方向点--打向西偏北方向，模拟日出之后1h的效果
    // var targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(116.455703152747     ,  39.9111393953965     , 100);
    //光源方向点--打向西偏北方向，模拟日出之后2h的效果
    // var targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(116.455700406131, 39.9115056668316, 100);
    //光源方向点--打向东偏南方向，补光
    var targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(
      116.461118031787,
      39.9083142302968,
      20
    );
    var dirLightOptions = {
      targetPosition: targetPosition1,
      // color: new SuperMap3D.Color(2.0, 1.46, 0.98, 1),
      // color: new SuperMap3D.Color(0.996, 0.85, 0.675, 1),
      // color: new SuperMap3D.Color(255/255, 224/255, 179/255, 1),
      // color: new SuperMap3D.Color(133/255, 149/255, 177/255, 1),
      color: new SuperMap3D.Color(1, 1, 1, 1),
      intensity: 3.0,
    };
    //光源方向点--打向西偏北方向，模拟日出之后4h的效果
    var targetPosition2 = new SuperMap3D.Cartesian3.fromDegrees(
      116.455700406131,
      39.9115056668316,
      20
    );
    var dirLightOptions1 = {
      targetPosition: targetPosition2,
      // color: new SuperMap3D.Color(2.0, 1.46, 0.98, 1),
      // color: new SuperMap3D.Color(0.996, 0.85, 0.675, 1),
      // color: new SuperMap3D.Color(255/255, 214/255, 153/255, 1),
      color: new SuperMap3D.Color(255 / 255, 229 / 255, 191 / 255, 1),
      // color: new SuperMap3D.Color(255/255, 234/255, 204/255, 1),
      // color: new SuperMap3D.Color(1, 1, 1, 1),
      intensity: 5.0,
    };
    let directionalLight_1 = new SuperMap3D.DirectionalLight(
      position1,
      dirLightOptions
    );
    scene.addLightSource(directionalLight_1);
    let directionalLight_2 = new SuperMap3D.DirectionalLight(
      position1,
      dirLightOptions1
    );
    scene.addLightSource(directionalLight_2);

    //点光源
    var pointLightPoshuatan1 = new SuperMap3D.Cartesian3.fromDegrees(
      116.454972817356,
      39.9120224613012,
      80.0
    );

    var pointLightOptionshuatan1 = {
      cutoffDistance: 900.0,
      color: new SuperMap3D.Color(1.0, 1.0, 1.0, 1.0),
      intensity: 10.6,
    };
    let pointLighthuatan1 = new SuperMap3D.PointLight(
      pointLightPoshuatan1,
      pointLightOptionshuatan1
    );
    // scene.addLightSource(pointLighthuatan1);

    // 新增聚光灯
    var spotLightPosludeng4_1 = new SuperMap3D.Cartesian3.fromDegrees(
      116.454972817356,
      39.9120224613012,
      80
    );
    var spotLightTargetPosludeng4_1 = new SuperMap3D.Cartesian3.fromDegrees(
      116.454972817356,
      39.9120224613012,
      0
    );

    var spotLightOtionsludeng4_1 = {
      color: new SuperMap3D.Color(10.0, 1.0, 1.0, 1),
      distance: 100,
      decay: 3,
      intensity: 12,
      angle: Math.PI / 2,
    };
    let spotLightludeng4_1 = new SuperMap3D.SpotLight(
      spotLightPosludeng4_1,
      spotLightTargetPosludeng4_1,
      spotLightOtionsludeng4_1
    );
    // scene.addLightSource(spotLightludeng4_1);

    // 测试光照：
    //凌晨
    // viewer.clock.currentTime = SuperMap3D.JulianDate.fromDate(new Date(2023,3,5,0));
    viewer.clock.currentTime = SuperMap3D.JulianDate.fromDate(
      // new Date(2023, 3, 5, 10)
      new Date(2023, 4, 15, 10)
    );
    // scene.lightSource.ambientLightColor = new SuperMap3D.Color(0.0, 0.0, 0.0, 1);
    scene.sun.show = true;
    scene.envMapIntensity = 1.0;

    setTimeout(() => {
      var layer1 = scene.layers.find("Ground_smallRe");
      layer1.lodRangeScale = 0.1;

      // for (var layer of layers) {
      for (var layer of viewer.scene.layers.layerQueue) {
        layer.cullMode = SuperMap3D.WindingOrder.COUNTER_CLOCKWISE;
        // layer.envMapIntensity = 1.2;
        // layer.envMapIntensity = 0.0;
        // layer_envMapIntensity = 0.0;
        //开启阴影
        layer.shadowType = 2;

        // layer.lodRangeScale = 0.1;

        // 根节点驻留与不立即释放
        layer.residentRootTile = true;
        layer.clearMemoryImmediately = false;
      }

      // 针对单个图层的处理：
      var layer1 = scene.layers.find("RoadRe");
      //色相，默认是0，值域-1-1
      layer1.hue = 0;
      //亮度，默认0
      layer1.brightness = 0.95;
      // 对比度，默认1
      layer1.contrast = 1.5;
      // 饱和度，默认1
      layer1.saturation = 1;
      // gamma
      layer1.gamma = 1;

      var layer2 = scene.layers.find("Ground_smallRe");
      //色相，默认是0，值域-1-1
      layer2.hue = 0.0;
      //亮度，默认0
      layer2.brightness = 1.0;
      // 对比度，默认1
      layer2.contrast = 1.5;
      // 饱和度，默认1
      layer2.saturation = 0.5;
      // gamma
      layer2.gamma = 1;

      // var layer3 = scene.layers.find("Building_v1Re");
      // //色相，默认是0，值域-1-1
      // layer3.hue =0;
      // //亮度，默认0
      // layer3.brightness= 0.85;
      // // 对比度，默认1
      // layer3.contrast = 1.3;
      // // 饱和度，默认1
      // layer3.saturation = 0.5;
      // // gamma
      // layer3.gamma = 1;

      var layer4 = scene.layers.find("Building_v2_mainRe");
      //色相，默认是0，值域-1-1
      layer4.hue = -0.0;
      //亮度，默认0
      layer4.brightness = 1.0;
      // 对比度，默认1
      layer4.contrast = 1.0;
      // 饱和度，默认1
      layer4.saturation = 1.0;
      // gamma
      layer4.gamma = 1;

      // 找到水面的图层：
      var layer5 = scene.layers.find("Waters@CBD");
      //设置水面的颜色
      // layer5.waterColor = new SuperMap3D.Color(0/255,66/255,61/255,1);
      layer5.waterColor = new SuperMap3D.Color(0 / 255, 53 / 255, 43 / 255, 1);
      // 设置水面的波动速度
      layer5.waterSpeed = new SuperMap3D.Cartesian2(0.3, 0.3);
      //设置水面的波动幅度
      layer5.waterWaveScale = 1;

      var layer6 = scene.layers.find("Building_NoCBD_5huan_WebGL");
      //色相，默认是0，值域-1-1
      layer6.hue = -0.0;
      //亮度，默认0
      layer6.brightness = 0.8;
      // 对比度，默认1
      layer6.contrast = 1.2;
      // 饱和度，默认1
      layer6.saturation = 1.0;
      // gamma
      layer6.gamma = 1;
    }, 15000);

    // 光照等
    scene.fog.enabled = false;
    scene.globe.depthTestAgainstTerrain = false;
    scene.context.shaderPreprocess = true;
    viewer.resolutionScale = window.devicePixelRatio;

    // 整个场景的后处理
    var correction = scene.colorCorrection; //创建颜色校正对象
    correction.show = true; //开启颜色校正
    correction.brightness = 1.0;
    correction.contrast = 1.3;
    correction.saturation = 1.0;
    correction.hue = 0.0;

    //设置阴影的出现距离
    scene.shadowMap.maximumDistance = 2000;
    // SuperMap3D.S3MTaskManager.useMultiWebWorker = false;
    //设置为false之后，直接绘制到颜色缓冲区，效果更好，但有些分析功能不能用，操作场景拾取不准确，建议只在录制视频的时候使用
    scene.enableCompositor = false;

    //设置阴影的浓度，值越高，阴影越淡
    viewer.shadowMap.darkness = 0.4;
    //默认值是0.1，值越小越清晰
    viewer.shadowMap.penumbraRatio = 0.1;

    // scene.logarithmicDepthBuffer = false;

    //设置太阳光的颜色与强度
    // scene.lightSource.sunLightColor = new SuperMap3D.Color(0.996*2, 0.85*2, 0.675*2,  1);
    // scene.lightSource.sunLightColor = new SuperMap3D.Color(255/255*1.0, 224/255*1.0, 179/255*1.0,  1);
    scene.lightSource.sunLightColor = new SuperMap3D.Color(
      1 * 1,
      1 * 1,
      1 * 1,
      1
    );

    var L00 = new SuperMap3D.Cartesian3(
      0.255985647439957,
      0.324294656515121,
      0.448104858398438
    );
    var L1_1 = new SuperMap3D.Cartesian3(
      0.052135497331619,
      0.127489775419235,
      0.259717047214508
    );
    var L10 = new SuperMap3D.Cartesian3(
      -0.043244555592537,
      -0.037950038909912,
      -0.036239303648472
    );
    var L11 = new SuperMap3D.Cartesian3(
      0.014937655068934,
      -0.003836219897494,
      -0.021041290834546
    );
    var L2_2 = new SuperMap3D.Cartesian3(
      0.03790882602334,
      0.013326642103493,
      -0.008756417781115
    );
    var L2_1 = new SuperMap3D.Cartesian3(
      -0.040351137518883,
      -0.020264262333512,
      -0.004807807970792
    );
    var L20 = new SuperMap3D.Cartesian3(
      0.004116172902286,
      0.001403471920639,
      -0.004473014734685
    );
    var L21 = new SuperMap3D.Cartesian3(
      -0.039947938174009,
      -0.028241466730833,
      -0.01187295652926
    );
    var L22 = new SuperMap3D.Cartesian3(
      0.042825646698475,
      0.035332202911377,
      0.01450318377465
    );
    scene.specularEnvironmentMaps = "./skyBox/HongKong_sphere_original_1k.ktx2";

    var coefficients = [L00, L1_1, L10, L11, L2_2, L2_1, L20, L21, L22];
    scene.sphericalHarmonicCoefficients = coefficients;

    //创建天空盒
    //开启天空盒，必须关闭大气，否则会看不到天空盒的效果
    viewer.scene.skyAtmosphere.show = true;
    var blueskyBox = new SuperMap3D.SkyBox({
      sources: {
        positiveX:
          "./skyBox/kloofendal_48d_partly_cloudy_puresky_8k_4.right.jpg",
        negativeX:
          "./skyBox/kloofendal_48d_partly_cloudy_puresky_8k_4.left.jpg",
        positiveY:
          "./skyBox/kloofendal_48d_partly_cloudy_puresky_8k_4.front.jpg",
        negativeY:
          "./skyBox/kloofendal_48d_partly_cloudy_puresky_8k_4.back.jpg",
        positiveZ: "./skyBox/kloofendal_48d_partly_cloudy_puresky_8k_4.top.jpg",
        negativeZ:
          "./skyBox/kloofendal_48d_partly_cloudy_puresky_8k_4.bottom.jpg",
      },
    });

    blueskyBox.show = true;
    viewer.scene.skyBox = blueskyBox;

    // gradualChange(blueskyBox);

    let instanceLayer = new SuperMap3D.InstanceLayer(viewer.scene._context);
    viewer.scene.primitives.add(instanceLayer);
    //分到不同的地形块里面，
    instanceLayer.tileWidth = 100;
    //默认是2，范围是0-5，理解成lodscale
    instanceLayer.maxSSE = 0.75;

    // 导入树
    growTreeByJSON(house, instanceLayer);
    growTreeByJSON(road, instanceLayer);
  }
  if (item.name == "变电站") {
    let scene = viewer.scene;
    // scene.camera.frustum.fov = 1.57;
    // scene.camera.frustum.near = 0.01;
    viewer.clock.currentTime = SuperMap3D.JulianDate.fromDate(
      new Date(2023, 4, 15, 10)
    ); // 设定比当前时间更好的光照效果
    //帧率显示
    // scene.debugShowFramesPerSecond = true;
    // viewer.scene.hdrEnabled = true;
    var camera = scene.camera;

    //设置阴影的出现距离
    scene.shadowMap.maximumDistance = 200;

    //设置阴影的浓度，值越高，阴影越淡
    viewer.shadowMap.darkness = 0.3;
    //默认值是0.1，值越小越清晰
    viewer.shadowMap.penumbraRatio = 0.2;

    // scene.logarithmicDepthBuffer = false;

    //设置太阳光的颜色与强度
    scene.lightSource.sunLightColor = new SuperMap3D.Color(
      1 * 3,
      1 * 3,
      1 * 3,
      1
    );
    // scene.lightSource.sunLightColor = new SuperMap3D.Color(0.996 * 2, 0.85 * 2, 0.675 * 2, 1);
    scene.sun.show = true;

    var L00 = new SuperMap3D.Cartesian3(
      0.492085933685303,
      0.492085874080658,
      0.492085933685303
    );
    var L1_1 = new SuperMap3D.Cartesian3(
      0.078874699771404,
      0.078874610364437,
      0.078874692320824
    );
    var L10 = new SuperMap3D.Cartesian3(
      0.078090153634548,
      0.078090116381645,
      0.078090183436871
    );
    var L11 = new SuperMap3D.Cartesian3(
      0.025034775957465,
      0.025034755468369,
      0.02503477409482
    );
    var L2_2 = new SuperMap3D.Cartesian3(
      0.031029928475618,
      0.031029941514134,
      0.031029921025038
    );
    var L2_1 = new SuperMap3D.Cartesian3(
      0.035155173391104,
      0.035155214369297,
      0.035155173391104
    );
    var L20 = new SuperMap3D.Cartesian3(
      -0.00544067658484,
      -0.00544066214934,
      -0.005440671462566
    );
    var L21 = new SuperMap3D.Cartesian3(
      0.008016115985811,
      0.00801613368094,
      0.008016110397875
    );
    var L22 = new SuperMap3D.Cartesian3(
      -0.071910448372364,
      -0.071910388767719,
      -0.071910433471203
    );
    scene.specularEnvironmentMaps = "./skyBox/Studio_set2_02_KFJR.ktx2";

    // var L00 = new SuperMap3D.Cartesian3(0.255985647439957, 0.324294656515121, 0.448104858398438);
    // var L1_1 = new SuperMap3D.Cartesian3(0.052135497331619, 0.127489775419235, 0.259717047214508);
    // var L10 = new SuperMap3D.Cartesian3(-0.043244555592537, -0.037950038909912, -0.036239303648472);
    // var L11 = new SuperMap3D.Cartesian3(0.014937655068934, -0.003836219897494, -0.021041290834546);
    // var L2_2 = new SuperMap3D.Cartesian3(0.037908826023340, 0.013326642103493, -0.008756417781115);
    // var L2_1 = new SuperMap3D.Cartesian3(-0.040351137518883, -0.020264262333512, -0.004807807970792);
    // var L20 = new SuperMap3D.Cartesian3(0.004116172902286, 0.001403471920639, -0.004473014734685);
    // var L21 = new SuperMap3D.Cartesian3(-0.039947938174009, -0.028241466730833, -0.011872956529260);
    // var L22 = new SuperMap3D.Cartesian3(0.042825646698475, 0.035332202911377, 0.014503183774650);
    // scene.specularEnvironmentMaps = './CBD/天空盒/HongKong_sphere_original_1k.ktx2';

    var coefficients = [L00, L1_1, L10, L11, L2_2, L2_1, L20, L21, L22];
    scene.sphericalHarmonicCoefficients = coefficients;

    // 整个场景的后处理
    var correction = scene.colorCorrection; //创建颜色校正对象
    correction.show = true; //开启颜色校正
    correction.brightness = 1.0;
    correction.contrast = 1.15;
    correction.saturation = 1.0;
    correction.hue = 0.0;

    //来自西北平行光
    var position1 = new SuperMap3D.Cartesian3.fromDegrees(
      115.998460430547,
      40.0005740797481,
      3
    );
    var targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(
      115.999464851774,
      39.999780713494,
      3
    );
    var dirLightOptions1 = {
      targetPosition: targetPosition1,
      // color: new SuperMap3D.Color(0.996, 0.85, 0.675, 1),
      //color: new SuperMap3D.Color(1.0, 0.84, 0.57, 1),
      // color: new SuperMap3D.Color(230/255, 243/255, 255/255, 1),
      // color: new SuperMap3D.Color(255/255, 247/255, 255/255, 1),
      color: new SuperMap3D.Color(255 / 255, 237 / 255, 217 / 255, 1),
      intensity: 0,
    };
    //来自东北平行光
    var position2 = new SuperMap3D.Cartesian3.fromDegrees(
      116.000333104312,
      40.0005771848742,
      3
    );
    var targetPosition2 = new SuperMap3D.Cartesian3.fromDegrees(
      115.999464851774,
      39.999780713494,
      3
    );
    var dirLightOptions2 = {
      targetPosition: targetPosition2,
      // color: new SuperMap3D.Color(0.996, 0.85, 0.675, 1),
      //color: new SuperMap3D.Color(1.0, 0.84, 0.57, 1),
      // color: new SuperMap3D.Color(230/255, 243/255, 255/255, 1),
      // color: new SuperMap3D.Color(255/255, 247/255, 255/255, 1),
      // color: new SuperMap3D.Color(255/255, 237/255, 217/255, 1),
      intensity: 0,
    };

    let directionalLight_1 = new SuperMap3D.DirectionalLight(
      position1,
      dirLightOptions1
    );
    scene.addLightSource(directionalLight_1);
    let directionalLight_2 = new SuperMap3D.DirectionalLight(
      position2,
      dirLightOptions2
    );
    scene.addLightSource(directionalLight_2);

    scene.envMapIntensity = 0.55;
    viewer.scene.skyAtmosphere.show = true;
    var blueskyBox = new SuperMap3D.SkyBox({
      sources: {
        positiveX:
          "./skyBox/kloofendal_48d_partly_cloudy_puresky_8k_4.right.jpg",
        negativeX:
          "./skyBox/kloofendal_48d_partly_cloudy_puresky_8k_4.left.jpg",
        positiveY:
          "./skyBox/kloofendal_48d_partly_cloudy_puresky_8k_4.front.jpg",
        negativeY:
          "./skyBox/kloofendal_48d_partly_cloudy_puresky_8k_4.back.jpg",
        positiveZ: "./skyBox/kloofendal_48d_partly_cloudy_puresky_8k_4.top.jpg",
        negativeZ:
          "./skyBox/kloofendal_48d_partly_cloudy_puresky_8k_4.bottom.jpg",
      },
    });

    viewer.imageryLayers.addImageryProvider(
      new SuperMap3D.BingMapsImageryProvider({
        key: "AgYCj_VzN0MWJ-4pgJj3I7bZym9kmbb-HDWjG5cgHFJxNOokbRcSEtUwJM3uWweh", //可至官网（https://www.bingmapsportal.com/）申请key
        url: "//dev.virtualearth.net",
      })
    );

    blueskyBox.show = true;
    viewer.scene.skyBox = blueskyBox;

    // gradualChange(blueskyBox);s

    let instanceLayer = new SuperMap3D.InstanceLayer(viewer.scene._context);
    viewer.scene.primitives.add(instanceLayer);
    //分到不同的地形块里面，
    instanceLayer.tileWidth = 100;
    //默认是2，范围是0-5，理解成lodscale
    instanceLayer.maxSSE = 0.75;

    // 导入树
    growTreeByJSONBDZ(TreeData[0].child, instanceLayer);
  }
  // 如果是cbd的 添加天空盒等

  let type = item.type;
  switch (type) {
    case "REALSPACE":
      openScene(item.proxiedUrl, "REALSPACE");
      item.chooseType = true;
      break;
    case "MVT":
      addMvtLayer(item.proxiedUrl, item.VectorTilesMapName, "MVT");
      item.chooseType = true;
      break;
    case "ThematicMap":
      addBaiMo(item.proxiedUrl, item.name, "ThematicMap");
      item.chooseType = true;
      break;
  }
}

//相机上升到一定位置,天空盒出现渐变效果
function gradualChange(blueskyBox: any) {
  viewer.scene.postRender.addEventListener(skyListener(blueskyBox));
}

function skyListener(blueskyBox: any) {
  var cameraHeight = viewer.scene.camera.positionCartographic.height;

  var skyAtmosphereH1 = 22e4; // 大气开始渐变的最大高度
  var skyBoxH1 = 1e4; // 天空开始渐变的最大高度
  var skyBoxH2 = 0.5e4; // 天空开始渐变的最小高度
  var bufferHeight = 1e4;
  if (cameraHeight < skyAtmosphereH1 && SuperMap3D.defined(blueskyBox)) {
    var skyAtmosphereT =
      (cameraHeight - skyBoxH2) / (skyAtmosphereH1 - skyBoxH2);
    if (skyAtmosphereT > 1.0) {
      skyAtmosphereT = 1.0;
    } else if (skyAtmosphereT < 0.0) {
      skyAtmosphereT = 0.0;
    }
    var skyBoxT = (cameraHeight - skyBoxH2) / (skyBoxH1 - skyBoxH2);
    if (skyBoxT > 1.0) {
      skyBoxT = 1.0;
    } else if (skyBoxT < 0.0) {
      skyBoxT = 0.0;
    }
    blueskyBox.alpha = 1.0 - skyBoxT;
    if (cameraHeight > skyBoxH2) {
      viewer.scene.skyAtmosphere.show = true;
      viewer.scene.skyAtmosphere.alpha = skyAtmosphereT;
      viewer.scene.skyBox = blueskyBox;
    } else {
      viewer.scene.skyAtmosphere.show = false;
    }
  } else {
    viewer.scene.skyAtmosphere.alpha = 1.0;
    viewer.scene.skyBox = blueskyBox;
  }
}

// 根据传入的数据来种树
function growTreeByJSON(treeData: any, instanceLayer: any) {
  // debugger
  // 遍历点
  treeData.pointItems.forEach((pointItem) => {
    instanceLayer.add(pointItem.url, pointItem.options);
  });

  // 遍历线进行添加
  Object.keys(treeData.polylineItems).map((key) => {
    let polylineItems = treeData.polylineItems[key];

    polylineItems.forEach((polylineItem) => {
      if (polylineItem.options.position) {
        instanceLayer.add(polylineItem.url, polylineItem.options);
      }
    });
  });

  // 遍历面进行添加
  // Object.keys(treeData.polygonItems).map((key) => {
  //   let polygonItems = treeData.polygonItems[key];
  //   polygonItems.forEach((polygonItem) => {
  //     if (polygonItem.options.position) {
  //       instanceLayer.add(polygonItem.url, polygonItem.options);
  //     }
  //   });
  // });
}

// 根据传入的数据来种树
function growTreeByJSONBDZ(treeDataChild: any, instanceLayer: any) {
  treeDataChild.forEach((child) => {
    if (child.name === "单个添加") {
      // 遍历点
      child.child.forEach((pointItem) => {
        if (pointItem.options.position) {
          instanceLayer.add(pointItem.url, pointItem.options);
        }
      });
    } else if (child.name === "沿线添加") {
      // 遍历线进行添加
      child.child.forEach((polylineCollection) => {
        if (polylineCollection.child.length > 0) {
          polylineCollection.child.forEach((polylineItem) => {
            instanceLayer.add(polylineItem.url, polylineItem.options);
          });
        }
      });
    } else if (child.name === "区域添加") {
      // 遍历面进行添加
      child.child.forEach((polygonCollection) => {
        if (polygonCollection.child.length > 0) {
          polygonCollection.child.forEach((polygonItem) => {
            instanceLayer.add(polygonItem.url, polygonItem.options);
          });
        }
      });
    }
  });
}

// 检验url地址
function checkURL(url: string) {
  if (url === null || url === "") {
    return false;
  }
  if (url.charAt(0) == '"' || url.charAt(0) == "'") {
    let reg = /^['|"](.*)['|"]$/;
    url = url.replace(reg, "$1");
  }
  return true;
}

// 打开realSpace场景
function openScene(url: string, type: any) {
  if (checkURL(url)) {
    let promiseArray = [
      window.viewer.scene.open(url, undefined, { autoSetView: true }),
    ];
    Cesium.when.all(promiseArray, function (layers: any) {
      layerTreeStore.updatelayerList(type);
    });
  }
}

// 添加MVT服务
function addMvtLayer(LayerURL: string, name: string, type: any) {
  // 返回img图层layer
  let mvtMap = window.viewer.scene.addVectorTilesMap({
    url: LayerURL,
    canvasWidth: 512,
    name: name || "mvt",
    viewer: window.viewer,
  });

  Cesium.when(mvtMap.readyPromise, function (data: any) {
    var bounds = mvtMap.rectangle;
    window.viewer.scene.camera.flyTo({
      destination: new Cesium.Cartesian3.fromRadians(
        (bounds.east + bounds.west) * 0.5,
        (bounds.north + bounds.south) * 0.5,
        10000
      ),
      duration: 0,
      orientation: {
        heading: 0,
        roll: 0,
      },
    });
    layerTreeStore.updatelayerList(type);
  });
  return mvtMap;
}

// 添加白膜
function addBaiMo(url: string, sceneName: string, type: any) {
  window.viewer.scene
    .addS3MTilesLayerByScp(url, {
      name: sceneName,
    })
    .then((layer: any) => {
      window.viewer.flyTo(layer);
      layer.lodRangeScale = 5;
      layer.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
      let initialColor = "rgb(67,67,67)";
      layer.style3D.lineColor = Cesium.Color.fromCssColorString(initialColor);
      layer.wireFrameMode = Cesium.WireFrameType.Sketch; //草图模式,即线框
      layer._visibleDistanceMax = 60000;
      layerTreeStore.updatelayerList(type);
    });
}
</script>

<style lang="scss" scoped>
.layer-server-container {
  display: flex;
  flex-wrap: wrap;
  @include panelContainer(100%, 3.8rem);

  .ItemBox {
    width: 30%;
    color: $--SM--FontColor-Sub;
    font-size: $--SM--FontSize-Text;
    margin-bottom: 0.07rem;
    margin-right: 0.16rem;
    box-sizing: border-box;
    cursor: pointer;

    .img-box {
      width: 100%;
      height: 0.84rem;
      border-radius: 0.05rem;
      overflow: hidden;
      margin-bottom: 0.04rem;
      .img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .ItemBox:nth-child(3n) {
    margin-right: 0;
  }
  .isSelect {
    color: #3499e5;
    .img-box {
      border: 0.02rem solid #3499e5;
    }
  }
}
</style>