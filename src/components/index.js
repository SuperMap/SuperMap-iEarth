import axios from '../../static/js/axios.min';
import common from "../common/js/common"; //公共封装js
import installDrag from "../common/js/drag"; //拖拽
window.axios = axios;
window.common = common;
window.axios.jsonp = common.axiosJsonp; //拓展axios

// 三维分析部分组件
import viewer from "./viewer/index.js";
import Profile3D from "./3danalysis/profile3D/index.js";
import ShadowQuery from "./3danalysis/shadowquery/index.js";
import SightLine from "./3danalysis/sightline/index.js";
import SkyLine from "./3danalysis/skyline/index.js";
import ViewShed from "./3danalysis/viewshed/index.js";

//添加图层功能组件
import WebServicePan from "./addlayer/webservicepan/index";
import CustomServicePan from "./addlayer/customservicepan/index";
import LocalFilePan from "./addlayer/localfilepan/index";

//场景设置
import basicOptions from "./sceneatttribute/basicoptions/index";
import sceneCamera from "./sceneatttribute/camera/index";
import sceneLight from "./sceneatttribute/light/index";
import ParticleSystem from "./sceneatttribute/particlesystem/index";
import otherOptions from "./sceneatttribute/otheroptions/index";

// 裁剪部分组件
import ClipBox from "./clip/clipbox/index.js";
import ClipCross from "./clip/clipcross/index.js";
import ClipPlane from "./clip/cliplane/index.js";
import ClipPolygon from "./clip/clipolygon/index.js";
import ClipBoxByEditor from "./clip/clpboxbyeditor/index";

// 地形部分组件
import TerrainOperation from "./terrainanalysis/terrainoperation/index.js";
import TerrainFlood from "./terrainanalysis/terrainflood/index.js";
import TerrainSlope from "./terrainanalysis/terrainslope/index.js";
import TerrainIsoLine from "./terrainanalysis/terrainisoline/index.js";

// 编辑部分组件
import addPonit from "./onlinedit/addponit/index.js";
import addPolyline from "./onlinedit/addpolyline/index.js";
import addPolygon from "./onlinedit/addpolygon/index.js";
import addGeometry from "./onlinedit/addgeometry/index.js";

// 自定义组件
import compass from "./combinations/compass/index";
//特效
import airlinesTrailLines from "./specialeffects/airlinestrailines/index";
import scanEffect from "./specialeffects/scaneffect/index";
import windParticle from "./specialeffects/windparticle/index";
import rainAndSnow from './specialeffects/rainandsnow/index';

//热点
import ChinaEpidemicMap from "./hotspot/chinaepidemicmap/index";
import WorldEpidemicMap from "./hotspot/worldepidemicmap/index";

//组合组件
import LayerManage from "./combinations/layermanage/index"
import addLayers from "./combinations/addlayerscombination/index";
import addBaseLayer from "./combinations/addbaselayer/index";
import TerrainAnalysis from "./combinations/terraincombination/index";
import ClipAnalysis from "./combinations/clipcombination/index";
import Analysis_3D from "./combinations/analysiscombination/index";
import toolBar from "./combinations/toolbar/index";
import LayerAttribute from './combinations/layerattribute/index'
import Measure from "./combinations/measure/index.js";
import initEcharts from "./combinations/initecharts/index.js";
import OnlineEdit from "./combinations/onlineditcombination/index.js";

import sceneAtttribute from "./combinations/sceneatttribute/index.js";

//全局注册
const components = [
    viewer,
    //分析
    Profile3D,
    ShadowQuery,
    SightLine,
    SkyLine,
    ViewShed,
    //场景
    basicOptions,
    sceneCamera,
    sceneLight,
    ParticleSystem,
    otherOptions,
    // 裁剪
    ClipBox,
    ClipCross,
    ClipPlane,
    ClipPolygon,
    ClipBoxByEditor,
    // 地形
    TerrainOperation,
    TerrainFlood,
    TerrainSlope,
    TerrainIsoLine,
    //编辑
    addPonit,
    addPolyline,
    addPolygon,
    addGeometry,
    // 组合
    LayerManage,
    addLayers,
    TerrainAnalysis,
    ClipAnalysis,
    Analysis_3D,
    toolBar,
    addBaseLayer,
    LayerAttribute,
    Measure,
    initEcharts,
    OnlineEdit,
    sceneAtttribute,
    compass,
    //添加图层
    WebServicePan,
    CustomServicePan,
    LocalFilePan,
    //特效
    airlinesTrailLines,
    scanEffect,
    windParticle,
    rainAndSnow,
    // 热点
    ChinaEpidemicMap,
    WorldEpidemicMap
]

const install = function(Vue, opts = {}) {
    if (install.installed) return;
    install.installed = true;
    components.forEach(component => {
        Vue.component(component.name, component);
    });
    installDrag(Vue);
}
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    components
}
