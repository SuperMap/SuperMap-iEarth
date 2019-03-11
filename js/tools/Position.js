define(["backbone"], function(Backbone) {
    var Position = Backbone.Model.extend({
        defaults : {
            x : 0,
            y : 0,
            position : "absolute",
            mode : "lt"
        },
        getStyle : function(style) {
            var x = this.get("x"), y = this.get("y"), position = this.get("position"), mode = this.get("mode");
            style = style || {};
            style.position = style.position || position;
            switch (mode) {
                case "rt":
                    style.right = x;
                    style.top = y;
                    break;
                case "rb":
                    style.right = x;
                    style.bottom = y;
                    break;
                case "lb":
                    style.left = x;
                    style.bottom = y;
                    break;
                case "lt":
                default:
                    style.left = x;
                    style.top = y;
                    break;
            }
            return style;
        }
    });
    return Position;
});
