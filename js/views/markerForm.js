define(['./Container',
    'Cesium',
    'spectrum'
     ],function(Container,
     Cesium
   ){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var s3mInstanceColc;
    var defaultUrl;
    var handlerPoint;
    var isPCBroswer;
    var me;
    var htmlStr = [
        '<main style="position : absolute;" class="mainView">',
        '<button style="top: 10px;position: absolute;left: 90%;background-color: rgba(38, 38, 38, 0.75);" aria-label="Close" id="closeScene" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button>',
        '<input id="objectTab1" type="radio" name="objectTab" checked>',
        '<label for="objectTab1" id = "objectLabel1" style="font-size: 13px">' + Resource.AddPoint + '</label>',
        '<input id="objectTab2" type="radio" name="objectTab">',
        '<label for="objectTab2" id = "objectLabel2" style="font-size: 13px">' + Resource.AddLine + '</label>',
        '<input id="objectTab3" type="radio" name="objectTab" >',
        '<label for="objectTab3" id = "objectLabel3" style="font-size: 13px">' + Resource.AddFaces + '</label>',
        // '<input id="objectTab4" type="radio" name="objectTab" >',
        // '<label for="objectTab4" style="font-size: 13px">' + "添加粒子" + '</label>',
        '<section id="objectContent1">',
        '<div class="adaptation">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<a class="ui blue ribbon label">'+ Resource.symbolicLibrary +'</a><br><br>',
        '<div style="border:1px solid #2EC5AD">',
        '<p id="icons"></p>',
        '</div>',
        '<div>',
        '<label style="font-size:13px">'+ Resource.colorPicker +'</label><input  class="colorPicker" size="8" data-bind="value: material," id="colorPicker">',
        '</div><br>',
        '<a class="ui teal ribbon label">'+ Resource.conversion +'</a>',
            '<label id="markerX" style="font-size:13px;">'+ Resource.Xrotation +'</label>',
            '<input id="pitch" class="input" type="number" min="0" max="360" step="1.0" value="0" title="pitch">',
            '<label id="markerY" style="font-size:13px;">'+ Resource.Yrotation +'</label>',
            '<input id="roll" class="input" type="number" min="0" max="360" step="1.0" value="0" title="roll">',
            '<label id="markerZ" style="font-size:13px;">'+ Resource.Zrotation +'</label>',
            '<input id="heading" class="input" type="number" min="0" max="360" step="1.0" value="0" title="heading">',
            '<label id="markerR" style="font-size:13px;">'+ Resource.zoom +'</label>',
            '<input type="number" id="scale" class="input" step="0.1" min="0.1" value="1" title="模型缩放比例"><br><br>',
            '<button type="button" id="del1" class="btn btn-info" style="float: right">'+ Resource.eliminate +'</button>',
        '</div>',
        '</div>',
       '</section>',
        '<section id="objectContent2">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547;">',
        '<a class="ui blue ribbon label">'+ Resource.symbolicLibrary +'</a><br><br>',
        '<div style="border:1px solid #2EC5AD">',
        '<table>',
        '<tbody>',
        '<tr>',
        '<td><a style="font-size: 25px" id="fullLine" class="iconfont icon-line"></a><label style="margin-right: -18px">'+ Resource.fulline +'</label></td>',
        '<td><a style="font-size: 25px" id="dottedLine" class="iconfont icon-xuxian"></a><label style="margin-right: -10px">'+ Resource.Virtuallinear +'</label></td>',
        '<td><a style="font-size: 25px" id="outline" class="iconfont icon-xiantiao"></a><label style="margin-right: -10px">'+ Resource.contourline +'</label></td>',
        '<td><a style="font-size: 25px" id="arrowLine" class="iconfont icon-line-arrow"></a><label style="margin-right: -10px">'+ Resource.arrowline +'</label></td>',
        '</tr>',
        '<tr>',
        '<td style="padding-top: 20px"><a style="font-size:25px;" id="glowLine" class="iconfont icon-xiancai5"></a><label style="margin-right: -10px">'+ Resource.Haloline +'</label></td>',
        '<td style="padding-top: 20px"><a style="font-size:25px;" id="TrailLine" class="iconfont icon-yuanxuxian"></a><label style="margin-right: -10px">'+ Resource.Wakeline +'</label></td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '</div><br>',
        '<a class="ui teal ribbon label">'+ Resource.parameterSetting +'</a>',
        '<label style="font-size:13px;">'+ Resource.lineWidth +'</label>',
        '<input id="lineWidth" class="input" type="number" value="5.0" min="0.1" step="0.1" style="width: 75%;"><span>&nbsp;&nbsp;' + Resource.pixel + '</span>',
        '<label style="font-size:13px;">'+ Resource.outlineWidth +'</label>',
        '<input id="outline-width" class="input" type="number" value="1.0" min="0.1" step="0.1" style="width: 75%;"><span>&nbsp;&nbsp;' + Resource.pixel + '</span>',
        '<label style="font-size:13px;">'+ Resource.polylineDashSectionLength +'</label>',
        '<input id="polyline-dash-section-length" class="input" type="number" min="1"  step="1.0" value="16.0" style="width: 75%;"><span>&nbsp;&nbsp;' + Resource.pixel + '</span>',
        '<label style="font-size:13px;">'+ Resource.polylineTrailPeriod +'</label>',
        '<input id="polyline-trail-period" class="input" type="number" min="1"  step="1.0" value="2" style="width: 75%;"><span>&nbsp;&nbsp;' + Resource.second + '</span>',
        '<label style="font-size:13px;">'+ Resource.polylineTrailPercent +'</label>',
        '<input id="polyline-trail-percent" class="input" type="number" min="0.1" max="1" step="0.1" value="0.3" style="width: 75%;"><span>&nbsp;&nbsp;%</span>',
        '<div class="square">',
        '<label  style="width:100%;">'+ Resource.LineColor +'</label><input class="colorPicker" id="lineColor"/>',
        '</div>',
        '<div class="square">',
        '<label style="width:100%;">'+ Resource.outlineColor +'</label><input class="colorPicker" id="outlineColor"/>',
        '</div>',
        '<button type="button" id="delAllLine" class="btn btn-info" style="float: right">'+ Resource.eliminate +'</button>',
        '</div><br>',
        '</section>',
        '<section id="objectContent3">',
        '<div class="ui raised segment" style="margin: 10px;background: #3b4547;">',
        '<a class="ui blue ribbon label">'+ Resource.symbolicLibrary +'</a><br><br>',
        '<div style="border:1px solid #2EC5AD">',
        '<table>',
        '<tbody>',
        '<tr>',
        '<td style="padding-top: 10px"><a style="font-size: 25px" id="pureColor" class="iconfont icon-lansekuangicon"></a><label style="margin-right: -18px">'+ Resource.pureColor +'</label></td>',
        '<td style="padding-top: 10px"><a style="font-size: 25px" id="gridding" class="iconfont icon-plus-gridview"></a><label style="margin-right: -10px">'+ Resource.gridding +'</label></td>',
        '<td style="padding-top: 10px"><a style="font-size: 25px" id="stripe" class="iconfont icon-ic_texture_px"></a><label style="margin-right: -10px">'+ Resource.stripe +'</label></td>',
        '</tr>',
        '</tbody>',
        '</table><br><br><br>',
        '</div><br>',
        '<a class="ui teal ribbon label">'+ Resource.parameterSetting +'</a>',
        '<label style="font-size:13px;">'+ Resource.polygonSymbolColor +'</label>',
        '<input type="text" class="colorPicker" id="polygon-symbol-color"/>',
        '<div>',
        '<button type="button" id="delAllPolygon" class="btn btn-info" style="float: right">'+ Resource.eliminate +'</button>',
        '</div>',
        '</div>',
        '</section>',
        '</main>',
    ].join('');
    var markerForm = Container.extend({
        tagName: 'div',
        id: 'marker-form',
        events : {
            'click #closeScene'  : 'onCloseSceneClk',
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;
            viewer.infobox = false;
            var scene = viewer.scene;
            isPCBroswer = options.isPCBroswer;
            me = this;
            handlerPoint = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
            s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
            scene.primitives.add(s3mInstanceColc);
            this.render();
            this.on('componentAdded',function(parent){
                $('main').each(function(index){
                    $(this).myDrag({
                        parent:'body',
                        randomPosition:false,
                        direction:'all',
                        handler:false,
                        dragStart:function(x,y){},
                        dragEnd:function(x,y){},
                        dragMove:function(x,y){}
                    });
                });
                $("#colorPicker").spectrum({
                    color: "2EC5AD",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette
                });
                $("#lineColor").spectrum({
                    color: "FFFF00",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette
                });
                $("#outlineColor").spectrum({
                    color: "CC0000",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette
                });

                $("#pitch,#roll,#heading").on("input propertychange", updatePointMarkerRotation);
                $("#pitch,#roll,#heading").on("blur", function(){
                    if($.trim(this.value) === ""){
                        $(this).val("0");
                        updatePointMarkerRotation();
                    }
                });

                $("#scale").on("input propertychange", updatePointMarkerScale);
                $("#scale").blur(function(){
                    if($.trim(this.value) === ""){
                        $(this).val("1");
                        updatePointMarkerScale();
                    }
                });
                $("#colorPicker").on("input propertychange",function(){
                    var color = Cesium.Color.fromCssColorString(this.value);
                    if(viewer.selectedEntity){
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateColor(color,index);
                    }
                });
                $("#del1").on("click",function(){
                    if(viewer.selectedEntity){
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateScale(new Cesium.Cartesian3(0,0,0),index);
                    }
                });
                $("#delAllLine").on("click",function(){
                    var entities =  viewer.entities.values;
                    for(var i = 0;i < entities.length;i++){
                        if(entities[i].polyline){
                            entities[i].polyline.show = false;
                        }
                    }
                });
                $("#delAllPolygon").on("click",function(){
                    var entities =  viewer.entities.values;
                    for(var i = 0;i < entities.length;i++){
                        if(entities[i].polygon){
                            entities[i].polygon.show = false;
                        }
                    }
                });
                $("#fullLine").on("click",function(){
                   createLineType(0,this);
                });
                $("#dottedLine").on("click",function(){
                    createLineType(1,this);
                });
                $("#outline").on("click",function(){
                    createLineType(2,this);
                });
                $("#arrowLine").on("click",function(){
                    createLineType(3,this);
                });
                $("#glowLine").on("click",function(){
                    createLineType(4,this);
                });
                $("#TrailLine").on("click",function(){
                    createLineType(5,this);
                });

                $("#lineWidth").blur(function(){
                    if($.trim(this.value) === ""){
                        $(this).val("1.0");
                    }
                });

                $("#pureColor").on("click",function(){
                    createPolygonType(0,this);
                });
                $("#gridding").on("click",function(){
                    createPolygonType(1,this);
                });
                $("#stripe").on("click",function(){
                    createPolygonType(2,this);
                });

                $("#polygon-symbol-color").spectrum({
                    color: "#fff", // 默认颜色
                    showPalette: true, //用于存储过往选择的颜色
                    palette: palette,
                    showAlpha: true, // 支持透明度选择
                    chooseText: "选择",
                    cancelText: "取消"
                });
            });

            Cesium.loadJson('data/models.json').then(function(data){
                var result = data.s3mModels;
                for(var i = 0,j = result.length;i < j;i++){
                    addItem(result[i]);
                }
            });

            handlerPoint.drawEvt.addEventListener(function(result){
                handlerPoint.clear(); // 不显示绘制的点
                var point = result.object;
                s3mInstanceColc.add(defaultUrl,{
                    position : point.position,
                    hpr : new Cesium.HeadingPitchRoll(parseFloat($("#heading").val()),parseFloat($("#pitch").val()),parseFloat($("#roll").val())),
                    scale : new Cesium.Cartesian3(parseFloat($("#scale").val()),parseFloat($("#scale").val()),parseFloat($("#scale").val())),
                });
                handlerPoint && handlerPoint.deactivate();
            });
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },
        onCloseSceneClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            this.$el.hide();
            return false;
        },

    });
    function addItem(data){
        var str = '<a class="marker"><img style="width: 10%;height: 100%; margin:8px" title=' + data.name + ' src={thumbnail} id={name}></a>'.replace('{thumbnail}',data.thumbnail).replace('{name}', data.name);
        $('#icons').append(str);
        var $child =$("#"+data.name);
        $child.on('click',function(){
            if(!isPCBroswer){
                me.$el.hide();
            }
            defaultUrl = data.path;
            if($("img").hasClass("selected")){
                $("img").removeClass("selected");
            }
            else{
                $(this).addClass("selected");
            }
            $("#heading").val(0);
            $("#pitch").val(0);
            $("#roll").val(0);
            $("#scale").val(1);
            handlerPoint.activate();
        });
    };
    function createLineType(type,line) {
        if(!isPCBroswer){
            me.$el.hide();
        }
        if($("a").hasClass("selected")){
            $("a").removeClass("selected");
        }
        else{
            $(line).addClass("selected");
        }
        var  handlerLine = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Line);
        handlerLine.activeEvt.addEventListener(function(isActive){
            if(isActive == true){
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            }
            else{
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        handlerLine.drawEvt.addEventListener(function(result){
            handlerLine.polyline.show = false;
            var linecolor = Cesium.Color.fromCssColorString($("#lineColor").spectrum('get').toRgbString());
            var outlinecolor = Cesium.Color.fromCssColorString($("#outlineColor").spectrum('get').toRgbString());
            var lineWidth = parseFloat($("#lineWidth").val());
            var outlineWidth = parseFloat($("#outline-width").val());
            var dashSectionLength = parseFloat($("#polyline-dash-section-length").val());
            var polylineTrailPeriod = parseFloat($("#polyline-trail-period").val());
            var polylineTrailPercent = parseFloat($("#polyline-trail-percent").val());
            var array = [].concat(result.object.positions);
            var position = [];
            for(var i = 0, len = array.length; i < len; i ++){
                var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var h=cartographic.height;
                if(position.indexOf(longitude)==-1&&position.indexOf(latitude)==-1){
                    position.push(longitude);
                    position.push(latitude);
                    position.push(h);
                }
            }
            switch (type){
                case 0:
                    viewer.entities.add({
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : lineWidth,
                            material: linecolor?linecolor:Cesium.Color.YELLOW,
                        }
                    }); break;
                case 1:
                    viewer.entities.add({
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : lineWidth,
                            material : new Cesium.PolylineDashMaterialProperty({
                                dashLength: dashSectionLength,
                                color: linecolor?linecolor:Cesium.Color.YELLOW,
                            })
                        }
                    }); break;
                case 2:
                    viewer.entities.add({
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : lineWidth,
                            material : new Cesium.PolylineOutlineMaterialProperty({
                                color : linecolor?linecolor:Cesium.Color.YELLOW,
                                outlineWidth : outlineWidth,
                                outlineColor : outlinecolor?outlinecolor:Cesium.Color.FIREBRICK,
                            })
                        }
                    }); break;
                case 3:
                    viewer.entities.add({
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : lineWidth*2.0,
                            followSurface : false,
                            material : new Cesium.PolylineArrowMaterialProperty(linecolor?linecolor:Cesium.Color.YELLOW)
                        }
                    }); break;
                case 4:
                    viewer.entities.add({
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : lineWidth*2.0,
                            material : new Cesium.PolylineGlowMaterialProperty({
                                glowPower : 0.25,
                                color : linecolor?linecolor:Cesium.Color.YELLOW,
                            })
                        }
                    }); break;
                case 5:
                    viewer.entities.add({
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : lineWidth,
                            material : new Cesium.PolylineTrailMaterialProperty({
                                 color: linecolor?linecolor:Cesium.Color.YELLOW,
                                 trailLength : polylineTrailPercent,
                                 period :polylineTrailPeriod
                              })
                        }
                    }); break;
                default:break;
            }
        });
        handlerLine.activate();
    }

    function createPolygonType(type,polygon) {
        if(!isPCBroswer){
            me.$el.hide();
        }
        if($("a").hasClass("selected")){
            $("a").removeClass("selected");
        }
        else{
            $(polygon).addClass("selected");
        }
        var handlerPolygon = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon,0);
        handlerPolygon.activeEvt.addEventListener(function(isActive){
            if(isActive == true){
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            }
            else{
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        handlerPolygon.drawEvt.addEventListener(function(result){
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            var array = [].concat(result.object.positions);
            var position = [];
            for(var i = 0, len = array.length; i < len; i ++){
                var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var h=cartographic.height;
                if(position.indexOf(longitude)==-1&&position.indexOf(latitude)==-1){
                    position.push(longitude);
                    position.push(latitude);
                    position.push(h);
                }
            }
            var polygonColor = Cesium.Color.fromCssColorString($("#polygon-symbol-color").spectrum('get').toRgbString());
            switch (type){
                case 0:
                    viewer.entities.add({
                        polygon : {
                            perPositionHeight :true,
                            hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            material : polygonColor
                        }
                    });break;
                case 1:
                    viewer.entities.add({
                        polygon : {
                            perPositionHeight :true,
                            hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            material : new Cesium.GridMaterialProperty({
                                color: polygonColor
                            })
                        }
                    });break;
                case 2:
                    viewer.entities.add({
                        polygon : {
                            perPositionHeight :true,
                            hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            material : new Cesium.StripeMaterialProperty({
                                evenColor: polygonColor,
                                repeat : 30.0
                            })
                        }
                    });break;
                default:break;
            }

        });
        handlerPolygon.activate();
    }

    function updatePointMarkerRotation(){
        if($("#heading").val() === "" || $("#pitch").val() === "" || $("#roll").val() === ""){
            return;
        }
        var headingValue = Cesium.Math.toRadians($("#heading").val());
        var pitchValue = Cesium.Math.toRadians($("#pitch").val());
        var rollValue = Cesium.Math.toRadians($("#roll").val());
        if(viewer.selectedEntity){
            var instance = viewer.selectedEntity.primitive;
            var index = viewer.selectedEntity.index;
            instance.updateRotation(new Cesium.HeadingPitchRoll(headingValue, pitchValue, rollValue), index);
        }
    }

    function updatePointMarkerScale(){
        if($.trim($("#scale").val()) === ""){
            return;
        }
        var scale = Number($("#scale").val());
        if(viewer.selectedEntity){
            var instance = viewer.selectedEntity.primitive;
            var index = viewer.selectedEntity.index;
            instance.updateScale(new Cesium.Cartesian3(scale,scale,scale),index);
        }
    }
    return markerForm;
});
