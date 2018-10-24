define(['./Container','spectrum','drag','slider'],function(Container,spectrum,drag,slider){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
        '<div class="tabs-vertical mainView" id="layerForm" style="position: absolute;width:350px;;z-index: 1;cursor: auto; display:none">',
        '<label style="text-align: left;margin-bottom: 10px;margin-top: -10px;font-size: 13px;color: lightgrey;">'+ Resource.layerOptions +'</label>',
        '<button aria-label="Close" id="layerClose" class="myModal-close" title='+ Resource.close +' style="top: 10px;position: absolute;left: 90%;"><span aria-hidden="true">×</span></button>',
        '<ul><li><a class="tab-active" data-index="0" href="#">'+ Resource.basicOptions +'</a></li>',
        '<li><a data-index="1" href="#">'+ Resource.visibility +'</a></li>',
        '<li><a data-index="2" href="#">'+ Resource.styleSetting +'</a></li>',
        '<li><a data-index="3" href="#">'+ "图层操作" +'</a></li></ul>',
        '<div class="tabs-content-placeholder" style="height:350px" id="layer-placeholder">',
        '<div class="tab-content-active">',
        '<label>'+ Resource.layerName +'</label>',
        '<input id="layerName" class="cesium-button" type="text" placeholder="显示图层名称" readonly >',
        '<label> '+ Resource.shadowMode +'</label>',
        '<select id="shadowType" class="cesium-button" class="selectpicker show-tick form-control" >',
        '<option value="noShadow" selected>'+ Resource.noShadow +'</option>',
        '<option value="chooseShadow">'+ Resource.setSelectionShadow +'</option>',
        '<option value="allShadow" >'+ Resource.setShadow +'</option>',
        '</select>',
        '<label>'+ Resource.shadowDarkness +'</label>',
        '<input type="range" id="darkness" min="0.1" max="0.9" step="0.01" value="0.3">',
        '<label>LOD</label>',
        '<input type="range"  min="0.1" max="10" step="0.5" id="LODScale" >',
        '<div class="square" ><input type="checkbox" id="display" checked/><label for="display">'+ Resource.display +'</label></div>',
        '<div class="square" ><input type="checkbox" id="multiChoose" checked/><label for="multiChoose">'+ Resource.multiSelection +'</label></div>',
        '<div class="square" ><input type="checkbox" id="cullEnabled"/><label for="cullEnabled">'+ Resource.cullEnabled +'</label></div>',
        '<div class="square" style="width:47%"><input type="checkbox" id="breleaseColor" checked/><label style="width:72px;" for="releaseMemory">'+ Resource.bReleaseColor +'</label></div>',
        '</div>',
        '<div>',
        '<label >'+ Resource.visibleDistanceMin +'</label>',
        '<input type="number" class="input" id="min-visible-height" style="width: 90%;" title="不输入则默认为0米"><span> 米</span>',
        '<label >'+ Resource.visibleDistanceMax +'</label>',
        '<input type="number" class="input" id="max-visible-height" style="width: 90%;" title="不输入则默认为无穷大"><span> 米</span>',
        '<label>'+ Resource.selectColorType +'</label>',
        '<select id="colorStyle" class="cesium-button" class="selectpicker show-tick form-control" >',
        '<option value="0" selected>'+ Resource.mix +'</option>',
        '<option value="1">'+ Resource.replace +'</option>',
        '</select>',
        '<label>'+ Resource.selectColor +'</label>',
        '<input class="colorPicker" readonly="readonly"  id="selectColorPicker">',
        '<div class="square" id="choosenDisplay" ><input type="radio" name="choosenDisHidd"><label >'+ Resource.onlyShowSlection +'</label></div>',
        '<div class="square" id="chooseHidden" ><input type="radio" name="choosenDisHidd" ><label>'+ Resource.onlyHideSlection +'</label></div>',
        '<div class="square" id="initialize"><input type="radio" name="choosenDisHidd"><label>'+ Resource.showAll +'</label></div>',
        '</div>',
        '<div>',
        '<label >'+ Resource.bottomAltitude +'</label>',
        '<input  type="text" class="cesium-button" id="bottomAltitude" value="0">',
        '<label>'+ Resource.fillStyle +'</label>',
        '<select  id="fillStyle" class="cesium-button" class="selectpicker show-tick form-control">',
        '<option value="0" selected>'+ Resource.fillMode +'</option>',
        '<option value="1">'+ Resource.lineMode +'</option>',
        '<option value="2" >'+ Resource.fillAndLine +'</option>',
        '</select>',
        '<label >'+ Resource.foreColor +'</label>',
        '<input class="colorPicker"  id="foreColorPicker">',
        '<label >'+ Resource.lineColor +'</label>',
        '<input class="colorPicker" id="lineColorPicker">',
        '<label >'+ "模型透明度" +'</label>',
        '<input type="number" class="input" id="modelAlpha" min="0" max="1.0" step="0.01" value="1.0" style="width: 100%;">',
        '</div>',
        '<div>',
        '<label style="font-size: 13px;color: #ffffff;border-bottom: 1px solid #2EC5AD;width: 50%">'+ "倾斜摄影开挖" +'</label><br><br>',

        '<input type="button" class="btn btn-info" style="margin-left: 85px" id="excavationRegion" value="执行开挖">',
        '<input type="button" class="btn btn-info"  id="delExcavationRegion" value="清除开挖">',
        '<label style="font-size: 13px;color: #ffffff;border-bottom: 1px solid #2EC5AD;width: 50%">'+ "倾斜摄影压平" +'</label><br><br>',
        '<input type="button" class="btn btn-info" style="margin-left: 85px" id="flattenRegion" value="模型压平">',
        '<input type="button" class="btn btn-info" id="delFlattenRegion" value="清除压平">',

        '<label style="font-size: 13px;color: #ffffff;border-bottom: 1px solid #2EC5AD;width: 50%">淹没分析</label><br><br>',
        '<label>最大高度 (米):</label>',
        '<input type="number" class="input" id="flood-max-height" value="71" required="required"/>',
        '<label>最小高度 (米):</label>',
        '<input type="number" class="input" id="flood-min-height" value="1" required="required"/>',
        '<label>淹没速度(米/秒):</label>',
        '<input type="number" class="input" id="flood-speed" value="1" required="required"/>',
        '<input type="button" class="btn btn-info" style="margin-left: 85px" id="execute-flood" value="执行淹没">',
        '<input type="button" class="btn btn-info" id="clear-flood" value="清除淹没">',

        '<label style="font-size: 13px;color: #ffffff;border-bottom: 1px solid #2EC5AD;width: 50%">选中偏移</label><br><br>',
        '<div class="square" ><input type="checkbox" id="choose-offset"/><label for="choose-offset">'+ "开启选中偏移" +'</label></div>',
        '<label>沿X轴偏移:</label>',
        '<input type="number" class="input" id="choose-x-offset" min="-50" max="50" step="1" value="0">',
        '<label>沿Y轴偏移:</label>',
        '<input type="number" class="input" id="choose-y-offset" min="-50" max="50" step="1" value="0">',
        '<label>沿Z轴偏移:</label>',
        '<input type="number" class="input" id="choose-z-offset" min="-50" max="50" step="1" value="0">',

        '<label style="font-size: 13px;color: #ffffff;border-bottom: 1px solid #2EC5AD;width: 50%">图层颜色</label><br><br>',
        '<label>亮度:</label>',
        '<input type="number" class="input" id="layer-brightness" min="0" max="3" step="0.1">',
        '<label>对比度:</label>',
        '<input type="number" class="input" id="layer-contrast" min="0" max="5" step="0.1">',
        '<label>色调:</label>',
        '<input type="number" class="input" id="layer-hue" min="0" max="5" step="0.1">',
        '<label>饱和度:</label>',
        '<input type="number" class="input" id="layer-saturation" min="0" max="50" step="1">',

        '<label style="font-size: 13px;color: #ffffff;border-bottom: 1px solid #2EC5AD;width: 60%">填充风格和线框模式</label><br><br>',
        '<label>填充风格:</label>',
        '<div style="display: block;"><input type="radio" id="layer-fill-mode" name="layer-fill-style" value="fill"/><label for="layer-fill-mode" style="width: auto;margin-left:0.5rem;">填充模式</label></div>',
        '<div style="display: block;"><input type="radio" id="layer-wireframe-mode" name="layer-fill-style" value="wireframe"/><label for="layer-wireframe-mode" style="width: auto;margin-left:0.5rem;">线框模式</label></div>',
        '<div style="display: block;"><input type="radio" id="layer-fill-and-wireframe-mode" name="layer-fill-style" value="fill-and-wireframe"/><label for="layer-fill-and-wireframe-mode" style="width: auto;margin-left:0.5rem;">填充和线框模式</label></div>',
        '<label>线框模式:</label>',
        '<div style="display: block;"><input type="radio" id="triangle-wireframe-mode" name="layer-wireframe-mode" value="triangle"/><label for="triangle-wireframe-mode" style="width: auto;margin-left:0.5rem;">三角面线框</label></div>',
        '<div style="display: block;"><input type="radio" id="quad-wireframe-mode" name="layer-wireframe-mode" value="quad"/><label for="quad-wireframe-mode" style="width: auto;margin-left:0.5rem;">四边形线框</label></div>',
        '<div style="display: block;"><input type="radio" id="sketch-wireframe-mode" name="layer-wireframe-mode" value="sketch"/><label for="sketch-wireframe-mode" style="width: auto;margin-left:0.5rem;">草图模式</label></div>',

        '<label style="font-size: 13px;color: #ffffff;border-bottom: 1px solid #2EC5AD;width: 60%">多边形偏移</label><br><br>',
        '<label>偏移因子:</label>',
        '<input type="number" class="input" id="layer-polygon-factor" min="-100" max="100" step="1" value="0">',
        '<label>偏移单位:</label>',
        '<input type="number" class="input" id="layer-polygon-unit" min="-100" max="100" step="1" value="0">',



        '</div>',
        '</div></div>'
    ].join('');
    var layerAttribute = Container.extend({
        tagName: 'div',
        id: 'layerAttribute',
        template: _.template(htmlStr),
        initialize : function(options){
            this.viewer = options.sceneModel.viewer;
            this.render();
            this.on('componentAdded',function(parent){
				$(document).ready(function() {
					var widget = $('#layerForm');
					var tabs = widget.find('ul a'),
						content = widget.find('.tabs-content-placeholder > div');
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
                var shadowMap = this.viewer.shadowMap;
                shadowMap.darkness = 0.3;
                shadowMap.size = 2048;
                shadowMap.softShadows = false;
                var shadowDarkness = document.getElementById("darkness");
                shadowDarkness.oninput = function(){
                    var darkness = shadowDarkness.value;
                    shadowMap.darkness = darkness;
                };
                $('#layerForm').myDrag({
                    parent:'body', //定义拖动不能超出的外框,拖动范围
                    randomPosition:false, //初始化随机位置
                    direction:'all', //方向
                    handler:false, //把手
                    dragStart:function(x,y){}, //拖动开始 x,y为当前坐标
                    dragEnd:function(x,y){}, //拖动停止 x,y为当前坐标
                    dragMove:function(x,y){} //拖动进行中 x,y为当前坐标
                });
                $("#lineColorPicker").spectrum({
                    change:function(){
                        $('#lineColorPicker').trigger('input');
                    },
                    color: "#fff",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette
                });
                $("#selectColorPicker").spectrum({
                    change:function(){
                        $('#selectColorPicker').trigger('input');
                    },
                    color: "#fff",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette
                });
                $("#choose-offset-color").spectrum({
                    change:function(){
                        $('#choose-offset-color').trigger('input');
                    },
                    color: "#fff",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette
                });
            });
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        }
    });
    return layerAttribute;
});
