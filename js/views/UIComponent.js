/**
 * UI组件模块
 */
define([ "backbone"], function(Backbone) {
    /**
     * UI组件的基类
     */
    var UIComponent = Backbone.View.extend({
        position : null,
        parent : null,
        /**
         * 根据UI组件的position属性设置其css中的位置
         */
        setPosition : function() {
            var position = this.position, style = position && position.getStyle();
            style && this.$el.css(style);
        },
        render : function() {
            return this;
        }
    });
    return UIComponent;
});
