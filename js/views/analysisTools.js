define(['./Container','../lib/Semantic/semantic','../lib/knob','../lib/viewshed3D','../lib/skyline','../lib/shadowQuery','../3DGIS/sightline','drag','spectrum','slider','../3DGIS/profile'],function(Container, semantic, knob, viewshed, skyLine, shadow, sgline, drag, spectrum, slider, profile){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var init = false;
    var viewer;
    var parentContainer;
    var htmlStr = [
  '<main style="position : absolute;left : 75%; top : 5%;width: 300px">',
  '<button aria-label="Close" id="closeMain" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button>',

    '<input id="tab3" type="radio" name="tabs" checked>',
    '<label for="tab3" style="font-size: 13px">' + "通视" + '</label>',

    '<input id="tab1" type="radio" name="tabs" >',
    '<label for="tab1" style="font-size: 13px">' + "可视域" + '</label>',

    '<input id="tab2" type="radio" name="tabs">',
    '<label for="tab2" style="font-size: 13px">' + "阴影" + '</label>',

    '<input id="tab5" type="radio" name="tabs">',
    '<label for="tab5" style="font-size: 13px">' + "剖面" + '</label>',

    '<input id="tab4" type="radio" name="tabs">',
    '<label for="tab4" style="font-size: 13px">' + Resource.skyline + '</label>',

 '<section id="content1">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<a class="ui blue ribbon label">观察者信息</a>',
        '<div>',
            '<div>',
               '<label>'+"观察点位置" +'</label>',
               '<div class="coord"><label>X</label><input type="number" id="viewX" value="0.0" step="0.0001"/></div>',
               '<div class="coord"><label>Y</label><input type="number" id="viewY" value="0.0" step="0.0001"/></div><br><br>',
               '<div class="coord"><label>Z</label><input type="number" id="viewZ" value="0.0"/></div>',
            '</div>',

            '<div>',
               '<label>'+"附加高度(米)" +'</label>',
               '<input type="number" id="heightView" class="input"  step="1" value="0.0" title="附近高度">',
            '</div>',

            '<div>',
               '<label>'+"可视距离(米)" +'</label>',
               '<input type="number" id="distance" class="input" min="0" step="1" value="0.0" title='+Resource.distance +' data-bind="value: distance, valueUpdate: "input"">',
            '</div>',

             '<div>',
               '<label>'+"方向角(度)" +'</label>',
               '<input type="number" id="direction" class="input" min="0" max="360" step="1.0" value="0.0" title='+Resource.direction +' data-bind="value: direction, valueUpdate: "input"">',
            '</div>',

             '<div>',
               '<label >'+"俯仰角度(度)" +'</label>',
               '<input type="number" id="pitch" class="input" min="-90" max="90" step="1.0" value="0.0" title='+Resource.roll +' data-bind="value: pitch, valueUpdate: "input"">',
             '</div>',

        '</div><br>',
        '<a class="ui teal ribbon label">参数设置</a>',
        '<div>',
               '<div>',
                   '<label >'+"水平视角(度)" +'</label>',
                   '<input type="number" id="horizonalFov" class="input" min="1" max="120" step="1.0" value="90" title='+Resource.horizontalFov +' data-bind="value: horizontalFov, valueUpdate: "input"">',
               '</div>',
               '<div>',
                   '<label >'+ "垂直视角(度)" +'</label>',
                  '<input type="number" id="verticalFov"  class="input" min="1" max="90" step="1.0" value="60" title='+ Resource.verticalFov +' data-bind="value: verticalFov, valueUpdate: "input"">',
               '</div>',
                '<div class="square">',
                   '<label  style="width:100%;">'+ "可见区域颜色" +'</label><input class="colorPicker" data-bind="value: visibleAreaColor,valueUpdate: "input""  id="colorPicker1"/>',
                '</div>',
                '<div class="square">',
                   '<label style="width:100%;">'+ "不可见区域颜色" +'</label><input class="colorPicker" data-bind="value: invisibleAreaColor,valueUpdate: "input""  id="colorPicker2"/>',
                '</div>',
        '<div style="float: right;margin-top: -20px">',
              '<button type="button"  class="btn btn-info" id="chooseView" style="">'+ "分析" +'</button>',
              '<button type="button"  class="btn btn-info" id="clearVS" style="">'+ "清理" +'</button>',
        '</div>',
        '</div>',
'</section>',

'<section id="content2">',
    '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
    '<a class="ui blue ribbon label">时间</a>',
    '<div style="">',
        '<label>'+ Resource.date +'</label>',
        '<input id="selDate" type="date" value="2017-05-13"/>',
    '</div>',
    '<div>',
        '<label>'+ Resource.startTime +'</label>',
       '<select id="startTime">',
            '<option value="0">0:00</option>',
            '<option value="2">2:00</option>',
           ' <option value="4">4:00</option>',
            '<option value="6">6:00</option>',
            '<option value="8">8:00</option>',
            '<option value="10">10:00</option>',
            '<option value="12" selected>12:00</option>',
            '<option value="14">14:00</option>',
            '<option value="16">16:00</option>',
            '<option value="18">18:00</option>',
           ' <option value="20">20:00</option>',
           ' <option value="22">22:00</option>',
       '</select>',
        '</div>',
    '<div>',
        '<label>'+ Resource.endTime +'</label>',
        '<select id="endTime" >',
            '<option value="2">2:00</option>',
            '<option value="4">4:00</option>',
            '<option value="6">6:00</option>',
            '<option value="8">8:00</option>',
            '<option value="10">10:00</option>',
            '<option value="12">12:00</option>',
            '<option value="14">14:00</option>',
            '<option value="16">16:00</option>',
            '<option value="18" selected>18:00</option>',
            '<option value="20">20:00</option>',
            '<option value="22">22:00</option>',
            '<option value="24">24:00</option>',
        '</select>',
        '</div><br>',
   '<a class="ui teal ribbon label">高度</a>',
   '<div style="">',
       '<label>'+ "底部高程(米)" +'</label>',
        '<input id="bottomHeight" class="input" value="20" style="width: 55%"/><button id="clickQuery" class="btn btn-info" style="margin-top: -5px">点击查询高程</button>',
    '</div>',
    '<div style="">',
        '<label>'+ "拉伸高度(米)" +'</label>',
        '<input id="extrudeHeight" class="input" value="20"/>',
   '</div><br>',

    '<button type="button"  class="btn btn-info" id="clear" style="float: right">'+ Resource.clear +'</button>',
    '<button type="button"  class="btn btn-info" id="sunlight" style="float: right">'+ Resource.sunlight +'</button>',
    '<button type="button"  class="btn btn-info"  id="shadowAnalysis" style="float: right">'+ Resource.shadowAnalysis +'</button>',
    '</div>',

 '</section>',

  '<section id="content3">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<a class="ui blue ribbon label">观察者信息</a><br><br>',
    '<div >',
        '<div class="coord"><label>X</label><input type="number" id="viewPointX" value="0.0" step="0.0001"/></div>',
        '<div class="coord"><label>Y</label><input type="number" id="viewPointY" value="0.0" step="0.0001"/></div><br><br>',
        '<div class="coord"><label>Z</label><input type="number" id="viewPointZ" value="0.0"/></div><br><br>',
        // '<table  border="0" align="left">',
        // '<tr>',
        // '<th>',
        // '<input type="checkbox" id="dyAnalysis" style="width: auto;height: auto">',
        // '</th>',
        // '<td>',
        // '<div style="float: left;font-size: 12px">动态</div>',
        // '</td>',
        // '</tr>',
        // '</table>',
    '</div><br>',

'<a class="ui teal ribbon label">参数设置</a>',
 '<div >',
    '<div class="square">',
      '<label  style="width:100%;">'+ Resource.visibleColor +'</label><input class="colorPicker" data-bind="value: visibleColor,valueUpdate: "input""  id="visibleColor"/>',
   '</div>',
    '<div class="square">',
      '<label  style="width:100%;">'+ Resource.hideenColor +'</label><input class="colorPicker" data-bind="value: hiddenColor,valueUpdate: "input""  id="hiddenColor"/>',
    '</div>',
 '</div>',

    '<button type="button"  class="btn btn-info" id="clearSL" style="float: right">'+ "清理" +'</button>',
    '<button type="button"  class="btn btn-info" id="addViewpoint" style="float: right">'+ "分析" +'</button>',

'</div>',
'</section>',

  '<section id="content4">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<a class="ui blue ribbon label">观察者信息</a><br>',
    '<div style=" margin-top: 10px; margin-bottom: 10px;">',
        '<div class="coord" ><label>X</label><input type="number" id="skyviewX" value="0.0" step="0.0001"/></div>',
        '<div class="coord"><label>Y</label><input type="number" id="skyviewY" value="0.0" step="0.0001"/></div><br><br>',
       '<div class="coord"><label>Z</label><input type="number" id="skyviewZ" value="0.0"/></div>',
    '</div>',
      '<a class="ui teal ribbon label">参数设置</a><br>',
      '<div class="square">',
        '<label style="width:100%; padding-left: 0;">'+ Resource.displayMode +'</label>',
         '<select id="skylineMode" style="width:70%;">',
            '<option value="0" selected>'+ Resource.polyline +'</option>',
            '<option value="1">'+ Resource.polygon +'</option>',
        '</select>',
      '</div>',
      '<div class="square">',
        '<label style="width:100%; padding-left: 0;">'+ Resource.skylineColor +'</label><input class="colorPicker" data-bind="value: skylineColor,valueUpdate: "input""  id="skylineColor"/>',
      "</div>",
        '<div class="square">',
            '<label style="width:100%; padding-left: 0;">'+ Resource.skylineRadius +'</label><input class="input" type="number" value="1000" step="10" id="skylineRadius"/>',
        '</div>',
        '<div style="overflow: hidden;">',
        '<button  class="btn btn-info" id="clearSkyline" style="float: right">'+ Resource.clear +'</button>',
        '<button  class="btn btn-info" id="getSkyline2D" style="float: right">'+ Resource.graphDisplay +'</button>',
        '<button  class="btn btn-info"  id="getSkyline" style="float: right">'+ Resource.skyline +'</button>',
        ' </div>',
  '</section>',

    '<section id="content5">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<div>',
        '<a class="ui blue ribbon label">起点信息</a><br>',
        '<label>经度(度)</label>',
        '<input type="number" id="profileLong1" class="input"  value="0.0" step="0.0001">',
        '<label>纬度(度)</label>',
        '<input type="number" id="profileLat1" class="input"  value="0.0" step="0.0001">',
        '<label>高程(米)</label>',
        '<input type="number" id="profileAlt1" class="input"  value="0.0" ><br><br>',
        '</div>',
        '<div>',
        '<a class="ui teal ribbon label">终点信息</a><br>',
        '<label>经度(度)</label>',
        '<input type="number" id="profileLong2" class="input"  value="0.0"  step="0.0001">',
        '<label>纬度(度)</label>',
        '<input type="number" id="profileLat2" class="input"  value="0.0" step="0.0001">',
        '<label>高程(米)</label>',
        '<input type="number" id="profileAlt2" class="input"  value="0.0" ><br><br>',
        '<input type="button" id="profileDel" class="btn btn-info" style="float:right" value="清理">',
        '<input type="button" id="profile" class="btn btn-info" style="float:right" value="分析">',
        '</div>',
        '</div>',
    '</section>',

'</main>'
    ].join('');
    var analysisTools = Container.extend({
        tagName: 'div',
        id: 'analysisTools',
        template: _.template(htmlStr),
        events : {
            'click #closeMain'  : 'onCloseMainClk',
            'click #tab1' : 'onCheckTab1',
            'click #tab2' : 'onCheckTab2',
            'click #tab3' : 'onCheckTab3',
            'click #tab4' : 'onCheckTab4',
            'click #addViewpoint'  : 'onAddViewpointClk',
            'click #profile'  : 'onProfileClk',
            'click #profileDel'  : 'onProfileDelClk',
            'click #clickQuery'  : 'onClickQueryClk',
        },
        initialize : function(options){
            this.viewer = options.sceneModel.viewer
            parentContainer = options.parent;
            this.render();
            this.on('componentAdded',function(parent){
                viewer = this.viewer;
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
                $(".colorPicker").spectrum({
                    color: "#fff",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette
                });
                $("#visibleColor").spectrum({
                    change:function(){
                        $('#visibleColor').trigger('input');
                    },
                    color: "rgb(0, 200, 0, 100)",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette
                });
                $("#hiddenColor").spectrum({
                    change:function(){
                        $('#hiddenColor').trigger('input');
                    },
                    color: "rgb(200, 0, 0, 100)",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette
                });
                $("#selDate").val(getNowFormatDate());
                if (!init){   //不能这样写。。。分开
                    viewshed.initializing(viewer);
                    shadow.initializing(viewer);
                    skyLine.initializing(viewer,parentContainer);
                    init = true;
                }
            });
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },
        onCloseMainClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            this.$el.hide();
            var viewer = this.viewer;
            viewshed.remove(viewer);
            // skyLine.remove(viewer);
            sgline.remove(viewer);
            // skyLine.remove(viewer);
            return false;
        },
        onCheckTab1 : function(){
            var viewer = this.viewer;
            shadow.remove(viewer);
            // skyLine.remove(viewer);
            sgline.remove(viewer);
        },
        onCheckTab2 : function(){
            var viewer = this.viewer;
            viewshed.remove(viewer);
            // skyLine.remove(viewer);
            sgline.remove(viewer);
            shadow.start(viewer);
        },
        onCheckTab3 : function(){
            var viewer = this.viewer;
            shadow.remove(viewer);
            // skyLine.remove(viewer);
            viewshed.remove(viewer);
            sgline.start(viewer);
        },
        onCheckTab4 : function(){
            var viewer = this.viewer;
            viewshed.remove(viewer);
            // skyLine.remove(viewer);
            sgline.remove(viewer);
            // skyLine.start(viewer);
        },
        onAddViewpointClk : function(){
            sgline.initializing(viewer);
        },
        onProfileClk : function(evt){
            profile.initializing(viewer,parentContainer);
        },
        onProfileDelClk : function(evt){
            profile.remove(viewer,parentContainer);
        },
        onClickQueryClk : function(evt){
            var scene = viewer.scene;
            var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function(e) {
                var position = scene.pickPosition(e.position);
                var cartographic = Cesium.Cartographic.fromCartesian(position);
                var height = cartographic.height;
                $("#bottomHeight").val(height.toFixed(9));
                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        },

    });

    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    return analysisTools;
});
