class DragTool {
    constructor(viewer,options) {
        this.viewer = viewer;
        this.handler = new SuperMap3D.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.init(options);
    }

    // 初始化
    init(params={}) {
        this.dragFlagInID = params.dragFlagInID; // 实体ID只有含dragFlagInID的才可以被拖拽
        this.callback = params.callback; // 回调函数
        this.glueS3M = params.glueS3M; // 回调函数
        this.model = null; // 拖拽的实体
        this.follow = null; // 跟随传入的对象
        this.originColor = undefined; // 选中实体模型的原始颜色
    }

    // 开始拖拽
    startDrag(follow) {
        this.follow = follow;

        this.leftDownAction()
        this.mouseMoveAction()
        this.leftUpAction()
    }

    // 鼠标左键按下事件：选中实体
    leftDownAction() {
        this.handler.setInputAction(e => {
            const pick = this.viewer.scene.pick(e.position) || viewer.selectedEntity;
            if (!SuperMap3D.defined(pick)) return;
            if (pick.id && pick.primitive && pick.primitive instanceof SuperMap3D.S3MInstance) { // 选中的实体必须为S3MInstance
                if (!pick.id.includes(this.dragFlagInID)) return;

                this.model = pick.primitive;
                this.originColor = SuperMap3D.clone(this.model.color);
                this.model.updateColor(SuperMap3D.Color.RED); // 选中颜色不明显，API没有相关设置，直接改变实例颜色当做选中
                this.viewer.scene.screenSpaceCameraController.enableRotate = false;//锁定相机
            }
        }, SuperMap3D.ScreenSpaceEventType.LEFT_DOWN);
    }

    // 鼠标移动事件：改变实体位置
    mouseMoveAction() {
        this.handler.setInputAction(e => {
            if (this.model && this.model instanceof SuperMap3D.S3MInstance) {
                const cartesian = viewer.scene.pickPosition(e.endPosition);
                if(!cartesian) return;
                if(this.glueS3M){ // 贴S3M拖拽
                    const cartographic = SuperMap3D.Cartographic.fromCartesian(cartesian, SuperMap3D.Ellipsoid.WGS84, new SuperMap3D.Cartographic());
                    const height = viewer.scene.sampleHeightSupported ? viewer.scene.sampleHeight(cartographic, [this.model]) : undefined;
                    cartographic.height = height ? height : 0.0;

                    const reCartesian = SuperMap3D.Cartographic.toCartesian(cartographic, SuperMap3D.Ellipsoid.WGS84, new SuperMap3D.Cartesian3());
                    this.model.updatePosition(reCartesian); 
                }else{
                    this.model.updatePosition(cartesian); // 任意拖拽
                }
            }
        }, SuperMap3D.ScreenSpaceEventType.MOUSE_MOVE);
    }

    // 鼠标左键弹起事件：将实体位置更新到treeData中
    leftUpAction() {
        this.handler.setInputAction(e => {
            if (this.model && this.model instanceof SuperMap3D.S3MInstance) {
                this.viewer.scene.screenSpaceCameraController.enableRotate = true;//解锁相机
                
                // 执行回调
                if(this.callback && this.follow) this.callback(this.model,this.follow,['position']);

                if(this.model && this.originColor) this.model.updateColor(this.originColor); // 恢复之前选中实体的颜色
                this.model = null; // 拖拽结束后及时释放所选实体，避免出现对象暂留导致清除效果不对
            }
        }, SuperMap3D.ScreenSpaceEventType.LEFT_UP);
    }

    //清除拖拽事件
    cancelDrag() {
        this.handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_DOWN);
        this.handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_UP);
        this.handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.MOUSE_MOVE);
    }

    // 销毁
    destroy(){
        this.cancelDrag();
        this.model = null; 
        // this.follow = null; 
        this.originColor = undefined; 
        if(!this.handler.isDestroyed()) this.handler.destroy();
        this.handler = null;
    }
}

export default DragTool;