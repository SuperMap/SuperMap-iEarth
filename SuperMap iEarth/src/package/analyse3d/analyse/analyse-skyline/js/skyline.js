// 天际线封装类
export class SkylineAnalysis {
    /**
       * Creates an instance of Roaming.
       * @param {*} viewer 需要传入
       * @param {*} options.axios 体显示需要传入
       * @param {*} options  其他可不传，修改默认值
       * @memberof Roaming
       * @example
       * 
   */
    constructor(viewer, options) {
        this.viewer = viewer;
        this.initSkyline(viewer);
        this.updateOptionsParams(options);
        this.axios = options.axios;
    }

    /**
    * 初始化
    */
    initSkyline(viewer) {
        this.s3mInstance = new SuperMap3D.S3MInstanceCollection(viewer.scene._context);
        viewer.scene.primitives.add(this.s3mInstance);
        this.skyline = new SuperMap3D.Skyline(viewer.scene);
        this.skyline.ignoreGlobe = true;  //地球表面不参与分析
        this.skyline.viewPosition = [0, 0, 0];
        this.skyline.pitch = 0
        this.skyline.direction = 0
        this.skyline.radius = 10000;
        this.skyline.color = SuperMap3D.Color.fromCssColorString("rgb(200, 0, 0, 1.0)");
        this.skyline.displayStyle = 0;
        this.skyline.lineWidth = 2;
        this.skyBodyColor = SuperMap3D.Color.fromCssColorString("rgba(44,149,197,0.6)");   //天际体颜色
        this.barrierColor = SuperMap3D.Color.fromCssColorString("rgba(255, 186, 1, 1)");   //障碍物颜色
        this.highlightBarrier = false;   //是否显示高亮障碍物
        this.skylineMode = 'LINE';
        this.skylineSpatialUrl = 'http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/skylinesectorbody.json';
    }

    /**
       * 更新可配置的内部参数
       * @param {object} options 配置项
       */
    updateOptionsParams(options) {
        if (!options) return;
        if (SuperMap3D.defined(options.ignoreGlobe)) this.skyline.ignoreGlobe = options.ignoreGlobe;
        if (SuperMap3D.defined(options.viewPosition)) this.skyline.viewPosition = options.viewPosition;
        if (SuperMap3D.defined(options.pitch)) this.skyline.pitch = options.pitch;
        if (SuperMap3D.defined(options.direction)) this.skyline.direction = options.direction;
        if (SuperMap3D.defined(options.radius)) this.skyline.radius = options.radius;
        if (SuperMap3D.defined(options.lineWidth)) this.skyline.lineWidth = options.lineWidth;
        if (SuperMap3D.defined(options.color)) this.skyline.color = SuperMap3D.Color.fromCssColorString(options.color);
        if (SuperMap3D.defined(options.displayStyle)) this.skyline.displayStyle = options.displayStyle;
        if (SuperMap3D.defined(options.skyBodyColor)) this.skyBodyColor = options.skyBodyColor;
        if (SuperMap3D.defined(options.barrierColor)) this.barrierColor = options.barrierColor;
        if (SuperMap3D.defined(options.highlightBarrier)) this.highlightBarrier = options.highlightBarrier;
        if (SuperMap3D.defined(options.skylineSpatialUrl)) this.skylineSpatialUrl = options.skylineSpatialUrl;
    }

    /**
       * 开始执行分析
       */
    start() {
        this.clear();
        let cartographic = this.viewer.scene.camera.positionCartographic;
        let lon = SuperMap3D.Math.toDegrees(cartographic.longitude);
        let lat = SuperMap3D.Math.toDegrees(cartographic.latitude);
        let hei = cartographic.height;
        let observerObj = {
            viewPosition: [lon, lat, hei],
            pitch: SuperMap3D.Math.toDegrees(this.viewer.scene.camera.pitch),
            direction: SuperMap3D.Math.toDegrees(this.viewer.scene.camera.heading)
        };
        this.updateOptionsParams(observerObj);
        this.skyline.build();
        if (this.skylineMode === "BODY") setTimeout(() => this.setSkyLineBody(), 500);;
        if (this.highlightBarrier) setTimeout(() => this.setBarrierColor(this.barrierColor), 500);
    };

    /**
     * 设置天际线分析模式 LINE FACE BODY
     */
    setSkylineMode(type) {
        this.skylineMode = type;
        switch (type) {
            case "LINE":
                this.skyline.displayStyle = 0;
                this.s3mInstance.removeCollection("SkyLineBody");
                break;
            case "FACE":
                this.skyline.displayStyle = 1;
                this.s3mInstance.removeCollection("SkyLineBody");
                break;
            case "BODY":
                this.skyline.displayStyle = 0;
                this.setSkyLineBody()
                break;
        };
    }

    /**
       * 设置天际线体
       */
    setSkyLineBody() {
        if (!this.axios) {
            console.log('axios is required!');
            return;
        }
        let param = this.skyline.getSkylineSectorParameter();
        if (!SuperMap3D.defined(param)) return;
        let geometrySkylineSectorBodyPostParameter = {
            viewerPoint: param.viewPos,
            line3D: param.geoLine3D,
            height: 0,
            lonlat: true
        };
        let queryData = JSON.stringify(geometrySkylineSectorBodyPostParameter);
        this.axios
            .post(this.skylineSpatialUrl, queryData)
            .then(response => {
                //再发送一次GET请求  获取到运算结果
                this.axios
                    .get(response.data.newResourceLocation + ".json")
                    .then(response => {
                        let data = response.data;
                        if (data.geometry === null) return;
                        let uint8Array = new Uint8Array(data.geometry.model);
                        let buffer = uint8Array.buffer;
                        this.s3mInstance.add(
                            "SkyLineBody",
                            {
                                id: 1,
                                position: SuperMap3D.Cartesian3.fromDegrees(
                                    data.geometry.position.x,
                                    data.geometry.position.y,
                                    data.geometry.position.z
                                ),
                                hpr: new SuperMap3D.HeadingPitchRoll(0, 0, 0),
                                color: this.skyBodyColor
                            },
                            buffer, false
                        );
                        data.geometry.model = [4, 0, 0, 0].concat(data.geometry.model);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    /**
    * 设置天际线体
    */
    setSkyLineBodyColor(color) {
        this.s3mInstance.getInstance("SkyLineBody", 1).updateColor(color);
    }

    /**
    * 设置障碍物颜色
    */
    setBarrierColor(color) {
        this.barrierColor = color;
        let ObjectIds = this.skyline.getObjectIds();
        if (!SuperMap3D.defined(ObjectIds)) return;
        let layers = this.viewer.scene.layers._layerQueue;
        for (let index in ObjectIds) {
            layers.forEach(layer => {
                if (layer._id === Number(index)) {
                    layer.setObjsColor(ObjectIds[index], color);
                }
            });
        }
    }

    /**
        * 清除障碍物颜色
        */
    clearBarrierColor() {
        this.viewer.scene.layers._layerQueue.forEach((layer) => {
            layer.removeAllObjsColor();
        })
    }



    /**
       * 清除分析
       */
    clear() {
        this.skyline.clear();
        this.clearBarrierColor();
        this.s3mInstance.removeCollection("SkyLineBody");
    }

    /**
    * 销毁
    */
    destroy() {
        this.clear();
        this.skyline = undefined;
        this.s3mInstance = undefined;
    }
}

export default SkylineAnalysis