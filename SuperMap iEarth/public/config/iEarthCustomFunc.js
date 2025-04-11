/**
 * 该文件的函数，将在Viewer初始化或者自定义服务中打开场景、单个S3M图层、影像图层后调用指定函数
 * 从而实现：在打包后能在指定时机执行指定代码，进行自定义修改，方便项目调试效果
 */

window.iEarthCustomFunc = {};

// 在viewer初始化后调用：可以根据需要设置比如锁帧、根节点驻留等其他全局属性
window.iEarthCustomFunc.afterViewerInit = function (viewer) {
  if (window.iEarthConsole) console.log('viewer初始化完成:', viewer);
  // 平面场景相机设置
  viewer.scene.screenSpaceCameraController._syncPickOnTiltCV = true;
  viewer.scene.screenSpaceCameraController.zoomFactor = 12;
  viewer.scene.screenSpaceCameraController.inertiaZoom = 0.9;

  // 设置碰撞检测
  viewer.scene.screenSpaceCameraController.enableCollisionDetection = window.customConfig.enableCollisionDetection;
  viewer.scene.screenSpaceCameraController.minimumDetectDistance = window.customConfig.minimumDetectDistance || 0.5;

  // globe批次问题
  viewer.scene.globe.maximumScreenSpaceError = window.customConfig.maximumScreenSpaceError || 2; // 默认为为2

  // 最大显存的接口
  if (window.customConfig.cacheSize) { SuperMap3D.MemoryManager.setCacheSize(window.customConfig.cacheSize) };

  // 设置环境光
  viewer.scene.lightSource.ambientLightColor = new SuperMap3D.Color(0.65,0.65,0.65,1);
}

// 在自定义服务中打开场景或S3M图层后调用：可以根据需要对S3M图层设置属性
window.iEarthCustomFunc.afterSceneOpen = function(s3mLayers){
  if(!viewer || !s3mLayers) return;
  if(s3mLayers.length > 0){
    if (window.iEarthConsole) console.log('场景打开成功:',s3mLayers);
    s3mLayers.forEach(layer => {
      layer.maxTransparentAlpha = 1;
    });
  }else if(s3mLayers instanceof SuperMap3D.S3MTilesLayer){ // 自定义添加S3M图层
    if (window.iEarthConsole) console.log('自定义S3M图层添加成功:',s3mLayers);
    s3mLayers.maxTransparentAlpha = 1;
  }

  // 也可以对当前场景中所有S3M图层做操作
  // viewer.scene.layers.layerQueue.forEach((s3mLayer,index) => {
  //   console.log(`图层索引号-${index}-${s3mLayer.name}}:`,s3mLayer)
  // });
}

// 在自定义服务中添加影像或Arcgis服务后调用：可以根据需要对影像图层设置属性
window.iEarthCustomFunc.afterImageLayerAdd = function(imageLayer){
  if(imageLayer){
    console.log('当前影像图层:',imageLayer)
  }

  // 这里也能访问viewer，做想要的操作
}