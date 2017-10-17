define(['./Container'],function(Container){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
        "<div id='tempStatis' style='display:none; z-index:100 '></div>",
        "<div id='toolbar1'>",
        "<select id='selectDiv' class='cesium-button' style='display: none'>",
        "<option value='heatmap'>heatmap</option>",
        "<option value='dotmap'>dotmap</option>",
        "</select>",
        "</div>",
        "<div id='toolbar2' style='display:none;z-index:100'>",
        "<p id='year' style='position: absolute; left: 0px;top: 20px; color: #ffffff;'>Year:2006</p>",
        "<p id='month' style='position: absolute; left: 0px;top: 40px; color: #ffffff'>Month:1</p>",
        "<table>",
        "<tbody>",
        "<tr>",
        "<td>Frame Rate</td>",
        "<td>",
        "<input type='range' min='1' max='60' step='1' data-bind='value: days, valueUpdate: 'input''>",
        "<input type='text' size='5' data-bind='value: days'>",
        "</td>",
        "</tr>",
        "</tbody>",
        "</table>",
        "</div>",
    ].join('');
    var VisTools = Container.extend({
        tagName: 'div',
        id: 'VisTools',
        template: _.template(htmlStr),
        initialize : function(options){
            this.viewer = options.sceneModel.viewer
            this.render();
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        }
    });
    return VisTools;
});
