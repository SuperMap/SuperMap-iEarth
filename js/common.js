requirejs.config({
    waitSeconds : 60,
    paths : {
        Cesium : '../Build/Cesium/Cesium',
        Zlib : '../Build/Cesium/Workers/zlib.min',
        jquery : "lib/jquery.min",
        underscore : "lib/underscore-min.1.4.4",
        backbone : "lib/backbone-min",
        Config : 'Config',
        bootstrapTree : 'lib/bootstrap-treeview',
        iScroll : 'lib/iscroll',
        Tabs : 'views/tabs',
        dropdown : 'views/dropdown',
        CesiumHeatmap : 'lib/heatmap.min',
        echarts : 'lib/echarts.simple.min',
        echartsMin :'lib/echarts.min',
        colorPicker:'lib/jquery.colorpicker',
        spectrum : 'lib/spectrum',
        drag :'lib/drag',
        slider : 'lib/slider',
        popLayer: 'lib/layer/src/layer'
    },
    shim : {
        underscore : {
            deps : [],
            exports : "_"
        },
        backbone : {
            deps : [ "jquery", "underscore" ],
            exports : "Backbone"
        },
        CesiumHeatmap : {
            exports : "CesiumHeatmap"
        },
        echarts : {
            exports : "echarts"
        },
        echartsMin : {
            exports : "echartsMin"
        },
        Cesium: {
            exports: 'Cesium'
        },
        Zlib : {
            exports : 'Zlib'
        },
        colorPicker:{
            exports : 'colorPicker'
        },
        bootstrapTree : {
            exports : 'bootstrapTree'
        },
        iScroll : {
        	exports : 'iScroll'
        },
        Tabs : {
        	exports : 'Tabs',
        	deps : ['jquery']
        },
        dropdown : {
        	exports : 'dropdown',
        	deps : ['jquery']
        },
        spectrum :{
            exports : 'spectrum'
        },
        slider :{
            exports :'slider'
        },
        popLayer: {
            deps : [ "jquery"],
            exports: "mylayer"
        }

    }
});