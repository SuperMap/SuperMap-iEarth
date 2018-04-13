define(['Cesium','../lib/SuperMap','../lib/Convert'],function(Cesium, Super, Convert) {
    'use strict';

    /*
    * 空间查询对象
    *
    * */
    var viewer;
    var parent;
    var setUrl;
    var dataUrl;

    var SpatialProperty = function () {
    };

    SpatialProperty.remove = function(viewer){

    };

    SpatialProperty.initializing = function(vie,parents,urlName,dataSource,dataSet){
        viewer = vie;
        parent = parents;
        setUrl = dataSource + ':' + dataSet;
        dataUrl = urlName;
        var handlerPolygon = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon);
        handlerPolygon.activate();
        handlerPolygon.drawEvt.addEventListener(function(result){
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            //几何区获取
            var geometry = CesiumToSuperMap.convertPolygon(Cesium,SuperMap,result.object);
            spatialQuery(geometry);
        });

    }

    function spatialQuery(drawGeometryArgs){
        var getFeaturesByGeometryParameters, getFeaturesByGeometryService;
        //查询参数设置
        getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters({
            datasetNames: [setUrl],
            toIndex:-1,
            spatialQueryMode:SuperMap.REST.SpatialQueryMode.CONTAIN,
            geometry: drawGeometryArgs
        });
        getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(dataUrl, {
            eventListeners: {
                "processCompleted": processCompleted,
                "processFailed": processFailed
            }
        });
        getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
    }

    function processCompleted(queryEventArgs){
        //查询数据处理
        var selectedFeatures = queryEventArgs.originResult.features;
        viewer.entities.removeAll();
        for(var i = 0;i < selectedFeatures.length;i++ ){
            viewer.entities.add({
                position : Cesium.Cartesian3.fromDegrees(parseFloat(selectedFeatures[i].fieldValues["12"]),parseFloat(selectedFeatures[i].fieldValues["13"]),parseFloat(selectedFeatures[i].fieldValues["16"])),
                billboard :{
                    image : 'images/2.png',
                    width:30,
                    height:30,
                },
                name : selectedFeatures[i].fieldValues["11"],
            });
        }
        //调用图表窗口
        if(parent.graphingForm){
            parent.graphingForm.$el.show();
        }
        if(!parent.graphingForm) {
            require(['views/graphingForm'], function (graphingForm) {
                var graphingForm = new graphingForm({
                    sceneModel: parent.model,
                    isPCBroswer: parent.isPCBroswer
                });
                parent.parent.addComponent(graphingForm);
                parent.propertyForm = graphingForm;
                graphingForm.$el.show();
            });
        }

    }

    function processFailed(e) {
        alert(e.error.errorMsg);
    }

    return SpatialProperty;
});