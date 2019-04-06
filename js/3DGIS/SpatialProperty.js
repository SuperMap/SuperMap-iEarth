define(['Cesium','../lib/Convert'],function(Cesium, Convert) {
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
        $("#urlName").val("");
        $("#dataSource option:not(:first)").remove();
        $("#dataSet option:not(:first)").remove();
        $("#dataLongitude option").remove();
        $("#dataLatitude option").remove();
        $("#dataHeight option").remove();
        if(parent.graphingForm){
            parent.graphingForm.$el.hide();
        }
        viewer.entities.removeAll();
    };

    SpatialProperty.initializing = function(viewerContainer,parents,urlName,dataSource,dataSet){
        viewer = viewerContainer;
        parent = parents;
        setUrl = dataSource + ':' + dataSet;
        dataUrl = urlName;
        var handlerPolygon = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon);
        handlerPolygon.activate();
        handlerPolygon.drawEvt.addEventListener(function(result){
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
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
        var selectedFeatures = queryEventArgs.result.features;
        viewer.entities.removeAll();
        for(var i = 0;i < selectedFeatures.length;i++ ){
            viewer.entities.add({
                id:queryEventArgs.result.features[i].data.SMID,
                position : Cesium.Cartesian3.fromDegrees(parseFloat(selectedFeatures[i].data[$('#dataLongitude option:selected').text().toUpperCase()]),parseFloat(selectedFeatures[i].data[$('#dataLatitude option:selected').text().toUpperCase()]),parseFloat(selectedFeatures[i].data[$('#dataHeight option:selected').text().toUpperCase()])),
                billboard :{
                    image : 'images/2.png',
                    width:30,
                    height:30,
                },
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
                    dataset:queryEventArgs,
                    isPCBroswer: parent.isPCBroswer
                });
                parent.parent.addComponent(graphingForm);
                parent.graphingForm = graphingForm;
                graphingForm.$el.show();
            });
        }

    }

    function processFailed(e) {
        alert(e.error.errorMsg);
    }

    return SpatialProperty;
});