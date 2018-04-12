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
    var handlerPolygon;
    var htmlStr = [
        '<main style="position : absolute;left : 75%; top : 5%;width: 300px">',
        '<button style="top: 10px;position: absolute;left: 90%;background-color: rgba(38, 38, 38, 0.75);" aria-label="Close" id="closeScene" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button>',
        '<input id="objectTab1" type="radio" name="objectTab" checked>',
        '<label for="objectTab1" style="font-size: 13px">' + "添加点" + '</label>',
        '<input id="objectTab2" type="radio" name="objectTab">',
        '<label for="objectTab2" style="font-size: 13px">' + "添加线" + '</label>',
        '<input id="objectTab3" type="radio" name="objectTab" >',
        '<label for="objectTab3" style="font-size: 13px">' + "添加面" + '</label>',
        '<section id="objectContent1">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<a class="ui blue ribbon label">符号库</a><br><br>',
        '<div style="border:1px solid #2EC5AD">',
        '<p id="icons"></p>',
        '</div>',
        '<div>',
        '<label style="font-size:13px">颜色选择器：</label><input  class="colorPicker" size="8" data-bind="value: material," id="colorPicker">',
        '</div><br>',
        '<a class="ui blue ribbon label">变换</a>',
            '<label id="markerX" style="font-size:13px;">绕X轴旋转</label>',
            '<input id="pitch" class="input" type="number" min="0" max="360" step="1.0" value="0" title="pitch">',
            '<label id="markerY" style="font-size:13px;">绕Y轴旋转</label>',
            '<input id="roll" class="input" type="number" min="0" max="360" step="1.0" value="0" title="roll">',
            '<label id="markerZ" style="font-size:13px;">绕Z轴旋转</label>',
            '<input id="heading" class="input" type="number" min="0" max="360" step="1.0" value="0" title="heading">',
            '<label id="markerR" style="font-size:13px;">缩放</label>',
            '<input type="number" id="scale" class="input" step="0.1" value="1" title="模型缩放比例"><br><br>',
            '<button type="button" id="del1" class="btn btn-info" style="float: right">'+ "删除" +'</button>',
           '<button type="button" id="addition1" class="btn btn-info" style="float: right">'+ "添加" +'</button>',
        '</div>',
       '</section>',
        '<section id="objectContent2">',
        '<h1 class="title"></h1>',
        '<div>',
        '<select id="lineMode" class="cesium-button">',
        '<option value="calModeal1">光晕线</option>',
        '<option value="calModeal2">轮廓线</option>',
        '<option value="calModeal3">指向线</option>',
        '<option value="calModeal4">虚线型</option>',
        '</select>',
        '<button type="button" id="del2" class="btn btn-info" style="float: right">'+ "删除" +'</button>',
        '<button type="button" id="addition2" class="btn btn-info" style="float: right">'+ "添加" +'</button>',
        '</div><br>',
        '</section>',
        '<section id="objectContent3">',
        '<div>',
        '<h1 class="title"></h1>',
        '</div>',
        '<div>',
        // '<select id="polygonMode" class="cesium-button">',//cesium 当前版本发现fromDegreesArrayHeights对高度无效，暂不开启样式
        // '<option value="polygonMode1">纯色状</option>',
        // '<option value="polygonMode2">条纹状</option>',
        // '<option value="polygonMode3">格网状</option>',
        // '</select>',
        '<button type="button" id="del3" class="btn btn-info" style="float: right">'+ "删除" +'</button>',
        '<button type="button" id="addition3" class="btn btn-info" style="float: right">'+ "添加" +'</button>',
        '</div>',
        '</section>',
        '</main>',
    ].join('');
    var defaultUrl;
    function addItem(data){
        var str = '<a id="marker"><img style="width: 10%;height: 100%; margin:8px" title=data.name src={thumbnail} id={name}></a>'.replace('{thumbnail}',data.thumbnail).replace('{name}', data.name);
        $('#icons').append(str);
        var $child =$("#"+data.name);
        $child.on('click',function(){
            defaultUrl = data.path;
            if($("img").hasClass("selected")){
                $("img").removeClass("selected");
            }
            else{
                $(this).addClass("selected");
            }
        });
    }
    var markerForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #closeScene'  : 'onCloseSceneClk',
            'click #addition1'  : 'onAddition1Clk',
            'click #addition2'  : 'onAddition2Clk',
            'click #addition3'  : 'onAddition3Clk',
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;
            viewer.infobox = false;
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
                $("#pitch").on("input change",function(){
                    var rotationValue = Cesium.Math.toRadians(this.value);
                    if(viewer.selectedEntity){
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateRotation(new Cesium.HeadingPitchRoll(0,rotationValue,0),index);
                    }
                });
                $("#roll").on("input change",function(){
                    var rotationValue = Cesium.Math.toRadians(this.value);
                    if(viewer.selectedEntity){
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateRotation(new Cesium.HeadingPitchRoll(0,0,rotationValue),index);
                    }
                });
                $("#heading").on("input change",function(){
                    var rotationValue = Cesium.Math.toRadians(this.value);
                    if(viewer.selectedEntity){
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateRotation(new Cesium.HeadingPitchRoll(rotationValue,0,0),index);
                    }
                });
                $("#scale").on("input change",function(){
                    var scale = parseFloat(this.value);
                    if(viewer.selectedEntity){
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateScale(new Cesium.Cartesian3(scale,scale,scale),index);
                    }
                });
                $("#colorPicker").on("input change",function(){
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
                $("#del2").on("click",function(){
                    viewer.entities.removeById("en0") ;
                    viewer.entities.removeById("en1") ;
                    viewer.entities.removeById("en2") ;
                    viewer.entities.removeById("en3") ;
                });
                $("#del3").on("click",function(){
                    if(handlerPolygon){
                        handlerPolygon.clear();
                    }
                });
            });
            Cesium.loadJson('data/models.json').then(function(data){
                var result = data.s3mModels;
                for(var i = 0,j = result.length;i < j;i++){
                    addItem(result[i]);
                }
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
        onAddition1Clk : function(evt){
            var scene = viewer.scene;
            var handlerPoint = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Point);
            var instance = new Cesium.S3MInstanceCollection(scene._context);
            scene.primitives.add(instance);
            handlerPoint.drawEvt.addEventListener(function(result){
                handlerPoint.clear();
                var point = result.object;
                instance.add(defaultUrl,{
                    position : point.position,
                    hpr : new Cesium.HeadingPitchRoll(parseFloat($("#heading").val()),parseFloat($("#pitch").val()),parseFloat($("#roll").val())),
                    scale : new Cesium.Cartesian3(parseFloat($("#scale").val()),parseFloat($("#scale").val()),parseFloat($("#scale").val())),
                });
                handlerPoint && handlerPoint.deactivate();

            });
            handlerPoint.activate();
        },
        onAddition2Clk : function(evt){
            var handlerLine = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Line);
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
            handlerLine.movingEvt.addEventListener(function(windowPosition){

            });
            handlerLine.drawEvt.addEventListener(function(result){
                handlerLine.polyline.show = false;
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
                var index = document.getElementById("lineMode").selectedIndex;
                switch (index){
                    case 0:
                    viewer.entities.add({
                        id : "en0",
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : 10,
                            material : new Cesium.PolylineGlowMaterialProperty({
                                glowPower : 0.25,
                                color : Cesium.Color.YELLOW
                            })
                        }
                    }); break;
                    case 1:
                        viewer.entities.add({
                        id : "en1",
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : 5,
                            material : new Cesium.PolylineOutlineMaterialProperty({
                                color : Cesium.Color.ORANGE,
                                outlineWidth : 2,
                                outlineColor : Cesium.Color.RED
                            })
                        }
                    }); break;
                    case 2:
                        viewer.entities.add({
                        id : "en2",
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : 10,
                            followSurface : false,
                            material : new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE)
                        }
                    }); break;
                    case 3:
                         viewer.entities.add({
                            id : "en3",
                            polyline : {
                                positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                                width : 4,
                                material : new Cesium.PolylineDashMaterialProperty({
                                    color: Cesium.Color.RED
                                })
                            }
                        }); break;
                    default:break;
                }
            });
            handlerLine.activate();
        },
        onAddition3Clk : function(evt){
            handlerPolygon = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon,0);
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
                // var array = [].concat(result.object.positions);
                // var position = [];
                // for(var i = 0, len = array.length; i < len; i ++){
                //     var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
                //     var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                //     var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                //     var h=1000000;
                //     if(position.indexOf(longitude)==-1&&position.indexOf(latitude)==-1){
                //         position.push(longitude);
                //         position.push(latitude);
                //         position.push(h);
                //     }
                // }
                handlerPolygon.polygon.show = true;
                handlerPolygon.polyline.show = true;

                // var index = document.getElementById("polygonMode").selectedIndex;
                // switch (index){
                //     case 0:
                //         handlerPolygon.polygon.show = true;
                //         handlerPolygon.polyline.show = true; break;
                //     case 1:
                //         handlerPolygon.polygon.show = false;
                //         handlerPolygon.polyline.show = false;
                //         viewer.entities.add({
                //             polygon : {
                //                 hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                //                 material : new Cesium.StripeMaterialProperty({
                //                     evenColor : Cesium.Color.WHITE.withAlpha(0.5),
                //                     oddColor : Cesium.Color.BLUE.withAlpha(0.5),
                //                     repeat : 30.0
                //                 })
                //             }
                //         });
                //         break;
                //     case 2:   ; break;
                //     default:break;
                // }

            });
            handlerPolygon.activate();
        },

    });
    return markerForm;
});
