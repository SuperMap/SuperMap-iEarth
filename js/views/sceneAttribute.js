define(['./Container', 'Cesium','../3DGIS/flyRoute','drag','slider','../lib/tooltip'],function(Container, Cesium, flyRoute,drag, slider,tooltip){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var scene;
    var viewer;
    var camera;
    var handler;
    var labels;
    var label;

    var htmlStr = `
        <div class="tabs-vertical mainView" id="sceneForm" style="position: absolute;width:380px;z-index: 1;cursor: auto;">
            <label style="text-align: left;margin-bottom: 10px;margin-top: -10px;font-size: 13px;color: lightgrey;">${Resource.sceneOptions}</label>
            <button style="top: 10px;position: absolute;right: 1rem;" aria-label="Close" id="closeScene" class="myModal-close"
                    title="关闭"><span aria-hidden="true">×</span></button>
            <ul>
                <li><a class="tab-active" data-index="0" href="#">${Resource.basicOptions}</a></li>
                <li><a data-index="1" href="#">${Resource.otherOptions}</a></li>
                <li><a data-index="2" href="#">场景颜色</a></li>
                <li style="font-size: 12px"><a data-index="3" href="#">泛光</a></li>
                <li style="font-size: 12px"><a data-index="4" href="#">相机</a></li>
                <li style="font-size: 12px"><a data-index="5" href="#">关于</a></li>
            </ul>
            <div class="tabs-content-placeholder" style="height: 100%;" id="scene-placeholder">
        
                <section class="tab-content-active">
                    <label>${Resource.sceneName}</label>
                    <input type="text" class="input" disabled id="sceneName">
                    <div class="divider"></div>
                    <label>${Resource.viewMode}</label>
                    <select id="sceneMode" class="cesium-button">
                        <option value="3D">3D</option>
                        <option value="2D">2D</option>
                        <option value="columbusView">Columbus View</option>
                    </select>
                    <div class="divider"></div>
                    <label>${Resource.multiViewport}</label>
                    <select id="viewportType" class="cesium-button">
                        <option value="NONE" selected>${Resource.onePort}</option>
                        <option value="HORIZONTAL">${Resource.horizontalSnap}</option>
                        <option value="VERTICAL">${Resource.verticalSnap}</option>
                        <option value="TRIPLE">${Resource.tripeSnap}</option>
                        <option value="QUAD">${Resource.quadSnap}</option>
                    </select>
                    <div class="divider"></div>
                    <button class="btn btn-info" id="queryCoordinates">查询坐标值</button>
                    <div class="param-item"><span>经度</span><input type="text" class="input" style="width: 80%;margin-left: 0.5rem;" disabled id="scene-coordinate-longitude"/></div>
                    <div class="param-item"><span>纬度</span><input type="text" class="input" style="width: 80%;margin-left: 0.5rem;" disabled id="scene-coordinate-latitude"/></div>
                    <div class="param-item"><span>高度</span><input type="text" class="input" style="width: 80%;margin-left: 0.5rem;" disabled id="scene-coordinate-height"/></div>
                </section>
        
                <section>
                    <div class="square"><input type="checkbox" id="earth" checked/><label for="earth">${Resource.earth}</label>
                    </div>
                    <div class="square"><input type="checkbox" id="shadows" checked/><label
                            for="shadows">${Resource.shadowMap}</label></div>
                    <div class="square"><input type="checkbox" id="lightRender" checked/><label for="lightRender">${Resource.sun}</label>
                    </div>
                    <div class="square"><input type="checkbox" id="timeline"/><label for="timeline">${Resource.timeline}</label>
                    </div>
                    <div class="square"><input type="checkbox" id="atomsphereRender" checked/><label for="atmosphere">${Resource.skyAtmosphereEffect}</label>
                    </div>
                    <div class="square"><input type="checkbox" id="fogEnabled" checked/><label for="fogEnabled">${Resource.fogEffect}</label>
                    </div>
                    <div class="square"><input type="checkbox" id="depthAgainst" checked/><label for="depthAgainst">${Resource.depthAgainst}</label>
                    </div>
                    <div class="square"><input type="checkbox" id="icon" checked/><label for="icon">Logo</label></div>
                    <div class="square"><input type="checkbox" id="underground"/><label for="underground">地下</label></div>
                </section>
        
                <section>
                    <label>${Resource.brightness}</label>
                    <input type="number" min="0" max="3" step="0.02" value="1.0" id="brightness" class="input">
                    <label>${Resource.contrast}</label>
                    <input type="number" min="0" max="3" step="0.02" value="1.0" id="contrast" class="input">
                    <label>${Resource.hue}</label>
                    <input type="number" min="0" max="3" step="0.02" value="0.0" id="hue" class="input">
                    <label>${Resource.saturation}</label>
                    <input type="number" min="0" max="3" step="0.02" value="1.0" id="saturation" class="input">
                    <label>${Resource.gamma}</label>
                    <input type="number" min="0" max="3" step="0.02" value="1.0" id="gamma" class="input">
                </section>
        
        
                <section>
                    <label style="width: 60px;float: left; margin-top: -0.5px">场景泛光</label>
                    <input type="checkbox" id="bloom"/>
                    <label>亮度阈值</label>
                    <input type="number" id="threshold" class="input" min="0" max="1" value="0.9" step="0.01">
                    <label>泛光强度</label>
                    <input type="number" id="bloomIntensity" class="input" min="0" max="10" value="2.0" step="0.01">
                </section>
        
        
                <section>
                    <label>飞行线路</label><br><br>
                    <input style="background-color:#2EC5AD" type="file" id="flyFile" onchange="" accept=".fpf"/><br><br>
                    <button class="start" id="startFly" title="开始" style="background-color: transparent;border:none;"></button>
                    <button class="pause" id="pauseFly" title="暂停" style="background-color: transparent;border:none;"></button>
                    <button class="stop" id="stopFly" title="停止" style="background-color: transparent;border:none;"></button>
                    <br><br>
                    <select id="stopList" style="background-color:#2EC5AD;width: 100%">
                    </select>
                    <label>观察</label><br>
                    <table border="0" align="left">
                        <tr>
                            <th>
                                <button id="spin" class="btn btn-info" style="">绕点旋转</button>
                            </th>
                            <td>
                                <input type="checkbox" id="circulation" checked=true>
                                <label style="width: 60px;">循环旋转</label>
                            </td>
                        </tr>
                    </table>
                </section>
        
                <section>
                    <label style=" text-align: center; font-size: 20px">SuperMap iEarth</label>
                    <label style=" text-align: center; font-size: 16px">版本 ： 2.1.1</label><br><br><br><br>
                    <label>更新内容</label><br><br>
                    <textarea id="scenePortalDescription" style="width:220px;height:100px;resize: none;
                    margin-left: 15px;background:transparent">1、图层上支持倾斜模型开挖与压平\n\n2、完善分享模块\n\n3、体数据添加颜色说明
                    </textarea>
                </section>
            </div>
        </div>
    `;
    var sceneAttribute = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #closeScene'  : 'onCloseSceneClk',
            'change input[type=file]' : 'onInputChange',
            'click #queryCoordinates'  : 'onQueryCoordinatesClk',
            'click #startFly'  : 'onStartFlyClk',
            'click #pauseFly'  : 'onPauseFlyClk',
            'click #stopFly'  : 'onStopFlyClk',
            'click #spin'  : 'onSpinClk',
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;
            scene = viewer.scene;
            viewer.scene.bloomEffect.show = false;
            handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            camera = scene.camera;
            camera.flyCircleLoop = true;
            this.render();
            this.on('componentAdded',function(parent){
                var icon = true;
				$(document).ready(function() {
					var widget = $('#sceneForm');
					var tabs = widget.find('ul a'),
						content = widget.find('.tabs-content-placeholder > section');
					tabs.on('click', function (e) {
						e.preventDefault();
						// Get the data-index attribute, and show the matching content div
						var index = $(this).data('index');
						tabs.removeClass('tab-active');
						content.removeClass('tab-content-active');
						$(this).addClass('tab-active');
						content.eq(index).addClass('tab-content-active');
					});
				});
                $('#sceneForm').myDrag({
                    parent:'body',
                    randomPosition:false,
                    direction:'all',
                    handler:false,
                    dragStart:function(x,y){},
                    dragEnd:function(x,y){},
                    dragMove:function(x,y){}
                });
                var imageryLayers = viewer.imageryLayers;
                $("#atomsphereRender").click(function(evt){
                    scene.skyAtmosphere.show = !scene.skyAtmosphere.show;
                });
                $("#lightRender").click(function(evt){
                    scene.globe.enableLighting = !scene.globe.enableLighting;
                });
                $("#shadows").click(function(evt){
                    scene.shadows = !scene.shadows;
                });
                $("#fogEnabled").click(function(evt){
                    scene.fog.enabled = !scene.fog.enabled ;
                });
                $("#depthAgainst").click(function(evt){
                    scene.globe.depthTestAgainstTerrain = !scene.globe.depthTestAgainstTerrain;
                });
                $("#earth").click(function(evt){
                    scene.globe.show = !scene.globe.show;
                });
                $("#timeline").click(function(){
                    var timeline = viewer.timeline.container.style.visibility;
                    if(timeline == "visible"){
                        viewer.timeline.container.style.visibility = 'hidden';
                    }
                    else{
                        viewer.timeline.container.style.visibility = 'visible';
                    }
                });
                $("#icon").click(function(evt){
                    if(icon){
                        $(".cesium-viewer-bottom").hide();
                        icon = false;
                    }
                    else if(!icon){
                        $(".cesium-viewer-bottom").show();
                        icon = true;
                    }
                });
                $("#bloom").click(function(evt){
                    viewer.scene.bloomEffect.show = !viewer.scene.bloomEffect.show;
                });
                $("#threshold").on("input change",function(){
                    viewer.scene.bloomEffect.threshold = this.value;
                });
                $("#bloomIntensity").on("input change",function(){
                    viewer.scene.bloomEffect.bloomIntensity = this.value;
                });
                $("#underground").click(function(evt){
                    viewer.scene.undergroundMode = !viewer.scene.undergroundMode;
                });
                $('#circulation').on("input change",function(){
                    camera.flyCircleLoop = this.checked;
                });
                var sceneName = viewer.scene.name;
                if(sceneName){
                    $("#sceneName").val(sceneName);
                }
                else{
                    $("#sceneName")[0].value = "未命名";
                }
                $('#sceneMode').change(function(){
                    var value = $(this).val();
                    if(value=="2D"){
                        viewer.scene.mode= Cesium.SceneMode.SCENE2D;
                    }
                    else if(value=="3D"){
                        viewer.scene.mode= Cesium.SceneMode.SCENE3D;
                    }
                    else if(value=="columbusView"){
                        viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
                    }
                });
                $('#viewportType').change(function(){
                    var value = $(this).val();
                    scene.multiViewportMode = Cesium.MultiViewportMode[value];
                });

                var brightness = document.getElementById('brightness');
                brightness.oninput = function(){
                    if (imageryLayers.length > 0) {
                        var layer = imageryLayers.get(0);
                        layer['brightness'] = brightness.value;
                    }
                };
                var saturation = document.getElementById('saturation');
                saturation.oninput = function(){
                    if (imageryLayers.length > 0) {
                        var layer = imageryLayers.get(0);
                        layer['saturation'] = saturation.value;
                    }
                };
                var contrast = document.getElementById('contrast');
                contrast.oninput = function(){
                    if (imageryLayers.length > 0) {
                        var layer = imageryLayers.get(0);
                        layer['contrast'] = contrast.value;
                    }
                };
                var hue = document.getElementById('hue');
                hue.oninput = function(){
                    if (imageryLayers.length > 0) {
                        var layer = imageryLayers.get(0);
                        layer['hue'] = hue.value;
                    }
                };
                var gamma = document.getElementById('gamma');
                gamma.oninput = function(){
                    if (imageryLayers.length > 0) {
                        var layer = imageryLayers.get(0);
                        layer['gamma'] = gamma.value;
                    }
                };
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
            viewer.entities.removeAll();
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.$el.hide();
            return false;
        },
        onQueryCoordinatesClk : function(evt){
            var tooltip = createTooltip(document.body);
            handler.setInputAction(function(movement) {
                tooltip.showAt(movement.endPosition,'<p>点击查询坐标值</p>');
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            handler.setInputAction(function(e){
                var cartesian = scene.pickPosition(e.position);
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                $('#scene-coordinate-longitude').val(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6));
                $('#scene-coordinate-latitude').val(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6));
                $('#scene-coordinate-height').val(cartographic.height.toFixed(3));
                tooltip.setVisible(false);
                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            },Cesium.ScreenSpaceEventType.LEFT_CLICK);
        },
        onStartFlyClk : function(evt){
            flyRoute.initializing(viewer);
        },
        onPauseFlyClk : function(evt){
            flyRoute.pause(viewer);
        },
        onStopFlyClk : function(evt){
            flyRoute.stop(viewer);
        },
        onSpinClk : function(evt){
            var center = new Cesium.Cartesian3(0,0,0);
            var flyCircle = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Point);
            flyCircle.drawEvt.addEventListener(function(result){
                center = result.object.position;
                camera.flyCircle(center);
            });
            flyCircle.activate();
        }
    });
    return sceneAttribute;
});
