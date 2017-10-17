/**
 * 容器基类模块
 */
define([
    "./UIComponent"], function(UIComponent) {
    /**
     * 容器基类
     */
    var Container = UIComponent.extend({
        /**
         * 容器类中用来装载子类的容器体
         */
        $container : null,
        components : [],
        initialize : function() {
            this.setContainerElement(this.el);
        },
        /**
         * 设置容器体
         *
         * @param container
         */
        setContainerElement : function(container) {
            if (!container) {
                return;
            }
            this.$container = $(container);
        },
        /**
         * 往容器里添加UI组件
         *
         * @param component
         *            UI组件
         * @param position
         *            要设置的位置
         * @returns {Container}
         */
        addComponent : function(component, position) {
            if (!component) {
                return;
            }
            component.position = position && position.clone();
            var $cel = component.$el;
            component.setPosition();
            this.$container.append($cel);
            this.components.push(component);
            component.parent = this;
            component.trigger("componentAdded", this);
            return this;
        },
        /**
         * 从容器组件中移除UI组件
         *
         * @param component
         *            要移除的UI组件
         * @returns {Container}
         */
        removeComponent : function(component) {
            var index = _.indexOf(this.components, component);
            component.remove();
            this.components.splice(index, 1);
            component.parent = null;
            component.trigger("componentRemoved", this);
            return this;
        },
        /**
         * 移除所有的UI组件
         *
         * @returns {Container}
         */
        removeAllComponents : function() {
            var components = this.components;
            for (var i = 0, len = components.length; i < len; i++) {
                var component = components[i];
                component.remove();
                component.parent = null;
                component.trigger("componentRemoved", this);
            }
            this.components = [];
            this.trigger("allComponentsRemoved", this);
            return this;
        }
    });
    return Container;
});
