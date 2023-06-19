import { EventDispatcher } from './EventDispatcher.js'
import EventConstant from './EventConstant.js'

export default class EventManager extends EventDispatcher {
    /**
     * 视图对象
     * @type {Viewer}
     */
    // viewer = null

    /**
     * 事件处理器
     * @type{Cesium.ScreenSpaceEventHandler}
     */
    // handler = null

    /**
     * 按下左键
     * @type {boolean}
     */
    // press = false

    /**
     * 创建事件管理工具
     * @param viewer
     */
    constructor (viewer) {
        super()
        this.viewer = viewer

        // 创建事件管理器
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)

        // 派发左键单击事件
        this.handler.setInputAction((e) => {
            this.dispatchEvent({
                type: EventConstant.CLICK,
                message: e
            })
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        // 左键按下事件
        this.handler.setInputAction((e) => {
            this.press = true
            this.dispatchEvent({
                type: EventConstant.LEFT_DOWN,
                message: e
            })
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

        // 右键按下事件
        this.handler.setInputAction((e) => {
            this.press = false
            this.dispatchEvent({
                type: EventConstant.LEFT_UP,
                message: e
            })
        }, Cesium.ScreenSpaceEventType.LEFT_UP)

        // 派发右键单击事件
        this.handler.setInputAction((e) => {
            this.dispatchEvent({
                type: EventConstant.RIGHT_CLICK,
                message: e
            })
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

        // 鼠标移动事件
        this.handler.setInputAction((e) => {
            // 左键按下移动事件
            if(this.press) {
                this.dispatchEvent({
                    type: EventConstant.LEFT_DOWN_MOUSE_MOVE,
                    message: e
                })
            }
            this.dispatchEvent({
                type: EventConstant.MOUSE_MOVE,
                message: e
            })
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

        // // 派发渲染事件
        // this.viewer.scene.postRender.addEventListener((e, time) => {
        //     TWEEN && TWEEN.update()
        //     this.viewer.stats && this.viewer.stats.update()
        //     this.dispatchEvent({
        //         type: EventConstant.RENDER,
        //         message: {
        //             scene: e,
        //             time: time
        //         }
        //     })
        // })

        // // 键盘抬起事件
        // document.addEventListener(EventConstant.KEYUP, (e) => {
        //     this.dispatchEvent({
        //         type: EventConstant.KEYUP,
        //         message: {
        //             e: e
        //         }
        //     })
        // })

        // // 键盘按下事件
        // document.addEventListener(EventConstant.KEYDOWN, (e) => {
        //     this.dispatchEvent({
        //         type: EventConstant.KEYDOWN,
        //         message: {
        //             e: e
        //         }
        //     })
        // })
    }

    /**
     * 添加相机位置监听方法
     * @param fn{Function} 监听方法
     */
    addCameraMoveListener (fn) {
        this.viewer.camera.changed.addEventListener(fn)
    }

    /**
     * 移除相机位置监听
     * @param fn{Function} 监听方法
     */
    removeCameraMoveListener (fn) {
        this.viewer.camera.changed.removeEventListener(fn)
    }
}
