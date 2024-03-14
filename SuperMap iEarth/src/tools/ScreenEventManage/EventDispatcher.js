function EventDispatcher() { }

Object.assign(EventDispatcher.prototype, {

    /**
     * 添加监听器
     * @param type{string} 监听器类型
     * @param listener{function} 方法
     * @param mutexStatus{boolean} 互斥开关
     */
    addEventListener: function (type, listener, mutexStatus = false) {
        if (this._listeners === undefined) this._listeners = {}
        this._mutex = this._mutex || {}
        const mutex = this._mutex
        var listeners = this._listeners

        if (listeners[type] === undefined) {
            listeners[type] = []
        }

        if (listeners[type].indexOf(listener) === -1) {
            // 如果启用功能互斥
            if (mutexStatus) {
                mutex[type] = listener
            }
            listeners[type].push(listener)
        }
    },

    hasEventListener: function (type, listener) {
        if (this._listeners === undefined) return false

        var listeners = this._listeners

        return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1
    },

    removeEventListener: function (type, listener) {
        if (this._listeners === undefined) return

        var listeners = this._listeners
        var listenerArray = listeners[type]

        // 移除指定的功能互斥
        if (this._mutex[type] === listener) {
            this._mutex[type] = null
        }

        if (listenerArray !== undefined) {
            var index = listenerArray.indexOf(listener)

            if (index !== -1) {
                listenerArray.splice(index, 1)
            }
        }
    },

    /**
     * 派发事件
     * @param event{{type: string, message?: *}}
     */
    dispatchEvent: function (event) {
        if (this._listeners === undefined) return

        var listeners = this._listeners
        var listenerArray = listeners[event.type]

        if (listenerArray !== undefined) {
            event.target = this

            // Make a copy, in case listeners are removed while iterating.
            var array = listenerArray.slice(0)
            if (this._mutex[event.type]) {
                const find = array.find(item => item === this._mutex[event.type])
                find.call(this, event)
                return
            }
            for (var i = 0, l = array.length; i < l; i++) {
                array[i].call(this, event)
            }
        }
    },

    removeAllListener() {
        this._mutex = {}
        for (const key in this._listeners) {
            this._listeners[key] = []
        }
    }

})

export { EventDispatcher };