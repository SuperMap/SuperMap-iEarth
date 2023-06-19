// 场景viewer
export { default as SmViewer } from './viewer/index';

// 量算组件
export { default as SmMeasureCalculate } from './measure/index';

// 添加数据组件：场景、底图、地形、自定义服务 
export { default as SmLayerBase } from './addData/layer-base/index';
export { default as SmLayerService } from './addData/layer-service/index';
export { default as SmLayerTerrain } from './addData/layer-terrain/index';
export { default as SmLayerCustom } from './addData/layer-custom/index';

// 三维分析功能组件
export { default as SmAnalyseSightLine } from './analyse3d/analyse-sightLine/index';
export { default as SmAnalyseViewshed } from './analyse3d/analyse-viewshed/index';
export { default as SmAnalyseShadow } from './analyse3d/analyse-shadow/index';
export { default as SmAnalyseProfile } from './analyse3d/analyse-profile/index';
export { default as SmAnalyseSkyline } from './analyse3d/analyse-skyline/index';
export { default as SmAnalyseHeatmap } from './analyse3d/analyse_heatmap/index';

// 裁剪功能组件 
export { default as SmClipBox } from './clip/clip-box/index';
export { default as SmClipCross } from './clip/clip-cross/index';
export { default as SmClipPlane } from './clip/clip-plane/index';
export { default as SmClipPolygon } from './clip/clip-polygon/index';

// 地形操作组件
export { default as SmTerrainOperation } from './terrain/terrain-operation/index';
export { default as SmTerrainInundation } from './terrain/terrain-inundation/index';
export { default as SmTerrainIsoline } from './terrain/terrain-isoline/index';
export { default as SmTerrainSlope } from './terrain/terrain-slope/index';

// 场景属性组件
export { default as SmSceneAttribute } from './sceneSet/scene-attribute/index';
export { default as SmSceneLight } from './sceneSet/scene-light/index';
export { default as SmSceneSpecialEffect } from './sceneSet/scene-specialEffect/index';
export { default as SmSceneViewPort } from './sceneSet/scene-viewPort/index';
export { default as SmFlyRoute } from './sceneSet/fly-route/index';

// 对象绘制组件
export { default as SmDrawLine } from './objectPainting/draw-line/index';
export { default as SmDrawSurface } from './objectPainting/draw-surface/index';
export { default as SmDrawSkit } from './objectPainting/draw-skit/index';
export { default as SmDrawParticle } from './objectPainting/draw-particle/index';

// iportal相关组件
// export { default as  SmSceneSave} from './iportal/sence-save/index';
export { default as SmSceneSave } from './senceSave/index';

// 公共布局组件
export { default as RowLayOut } from './common/rowLayOut/index';
export { default as BtnGroup } from './common/btnGroup/index';

// 封装的第三方库组件
export { default as ColorPick } from './common/color-pick/index';