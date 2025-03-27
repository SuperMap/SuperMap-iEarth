// 添加MVT服务
function addMvtLayer(LayerURL: string, name: string | undefined,  isLocate:boolean=true) {
  // 返回img图层layer
  let mvtMap = window.viewer.scene.addVectorTilesMap({
    url: LayerURL,
    canvasWidth: 512,
    name: name,
    viewer: window.viewer,
  });

  if(isLocate){
    SuperMap3D.when(mvtMap.readyPromise, function (data: any) {
      let bounds = mvtMap.rectangle;
      window.viewer.scene.camera.flyTo({
        destination: new SuperMap3D.Cartesian3.fromRadians(
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
    });
  }
  return mvtMap;
}

// 获取当前有那些S3M图层用于S3M选中
function getS3MLayerList(){
  let s3mLayerList:any = [];
  viewer.scene.layers.layerQueue.forEach((s3mLayer, index) => {
    s3mLayerList.push({
      label: s3mLayer.customName || s3mLayer.name,
      value: s3mLayer.name,
      // value: index,
    });
  });

  return s3mLayerList;
}

// // 获取当前场景有那些MVT图层
// function getMVTLayerList(){
//   let mvtLayerList:any = [];
//   viewer.scene._vectorTileMaps._layerQueue.forEach(mvtLayer => {
//     mvtLayerList.push({
//       label: mvtLayer.customName || mvtLayer.name,
//       value: mvtLayer.name,
//     });
//   });
//   return mvtLayerList;
// }

// 获取当前场景有那些MVT样式子图层
function getMVTStyleLayerList() {
  const mvtMapFirst = viewer.scene._vectorTileMaps._layerQueue[0];
  if (mvtMapFirst) {
    let mvtStyleLayerList: any = [];

    mvtMapFirst.mapboxStyle.layers.forEach((styleLayer: any) => {
      if(styleLayer.source){
        mvtStyleLayerList.push({
          label: styleLayer.customName || styleLayer.id,
          value: styleLayer.id,
        });
      }
    });

    return mvtStyleLayerList;
  }
}

// 基于样式子图层的source来获取对应的MVTLayer
function getMVTLayerByStyleSourceName(sourceName){
  const result = viewer.scene._vectorTileMaps._layerQueue.filter(mvtLayer => {
    if(mvtLayer && mvtLayer._sourceIds){
      return mvtLayer._sourceIds[0] == sourceName;
    }
  })

  if(result || result.length>0) {
    return result[0];
  }
}

export default {
  addMvtLayer,
  getS3MLayerList,
  getMVTStyleLayerList,
  getMVTLayerByStyleSourceName
}