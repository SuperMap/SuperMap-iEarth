class AIFunction {
    constructor(viewer) {
        this.viewer = viewer;
        let lastLength = this.viewer.scene.layers.layerQueue.length;
        this.init();
        let stableTime = 0;
        let delayTime = 5000;
        const layerQueueInterval = setInterval(() => {
            const currentLength = this.viewer.scene.layers.layerQueue.length;
            if (currentLength === lastLength) {
                if (stableTime >= delayTime) {
                    stableTime = 0;
                    window.parent.postMessage(JSON.stringify("layerQueueFinished"), "*");
                    clearInterval(layerQueueInterval);
                } else {
                    stableTime += 100;
                }
            } else {
                lastLength = currentLength;
                stableTime = 0;
            }
        }, 100);
    }

    // 初始化
    init() {
        this.isCoexist = true; // 是否支持同时存在多个分析功能
        this.viewshed3D = undefined;
        this.skyline = undefined;
        this.shadowQuery = undefined;
        this.sightline = undefined;
        this.viewshedOptions = {};
        this.skylineOptions = {};
        this.shadowOptions = {};
        this.sightLineOptions = {};
        this.updateViewShed3D_Bind = undefined;
        this.updateSkyline_Bind = undefined;
        this.updateShadowQuery_Bind = undefined;
        this.updateSightLine_Bind = undefined;
        this.handleAllTilesLoaded_Bind = undefined;
        this.isAllTilesLoaded = false;
        this.triggerCount = 0;
    }

    startListenIFramePostMessage() {
        // 通过bind将this强制绑定为aifuntion实例对象，否则默认为window
        window.addEventListener(
            "message",
            this.postMessageFunction.bind(this),
            false
        );
    }

    // 监听S3M图层的allTilesLoaded事件，一旦超过阈值说明图层已经加载到合适的程度
    handleAllTilesLoaded() {
        this.triggerCount++;
        console.log("triggerCount:", this.triggerCount);
        if (this.triggerCount >= this.tilesLoadedthreshold) {
            this.isAllTilesLoaded = true;
            clearTimeout(this.clearID);
            console.log("所有瓦片已加载至阙值");
            this.iframeEvent.source.postMessage(
                {
                    message: "所有瓦片已加载至阙值",
                    status: "SceneReady",
                },
                this.iframeEvent.origin
            );

            this.viewer.scene.layers.layerQueue.forEach((layer) => {
                layer.allTilesLoaded.removeEventListener(
                    this.handleAllTilesLoaded_Bind
                );
            });
        }
    }

    // iframe-Postmessage-回调事件
    postMessageFunction(event) {
        if (!event || !event.data) return;
        let eventDataString = event.data;
        if(typeof eventDataString !== 'string'){
            eventDataString = JSON.stringify(eventDataString, null, '\t');
        }
        if (eventDataString.includes("sdk")) return; // vite打包后会这个错，这里做个规避
        this.iframeEvent = event;

        // 获取通过iFrame-Postmessage传入的分析参数
        let data = JSON.parse(eventDataString);
        if (window.iEarthConsole) console.log("分析功能接受到的信息: ", data);

        // 用来处理监听当前S3M图层是否加载完成
        if (data && data.message == "isAllTilesLoadedReady") {
            // 重置状态
            this.isAllTilesLoaded = false;
            this.triggerCount = 0;
            // 计算阈值和timeout时间
            this.tilesLoadedthreshold = data.tilesLoadedthreshold
                ? Number(data.tilesLoadedthreshold)
                : this.viewer.scene.layers.layerQueue.length;
            this.maxTimeOutNumber = data.maxTimeOutNumber
                ? Number(data.maxTimeOutNumber)
                : 10000;
            // 事件监听
            this.handleAllTilesLoaded_Bind =
                this.handleAllTilesLoaded.bind(this);
            this.viewer.scene.layers.layerQueue.forEach((layer) => {
                layer.allTilesLoaded.addEventListener(
                    this.handleAllTilesLoaded_Bind
                );
            });

            // 一旦等待瓦片加载超时，直接返回
            this.clearID = setTimeout(() => {
                console.log("等待瓦片加载超时");
                this.viewer.scene.layers.layerQueue.forEach((layer) => {
                    layer.allTilesLoaded.removeEventListener(
                        this.handleAllTilesLoaded_Bind
                    );
                });
                this.iframeEvent.source.postMessage(
                    {
                        message: `等待瓦片加载超时: ${this.maxTimeOutNumber}s`,
                        status: "SceneReady",
                    },
                    this.iframeEvent.origin
                );
            }, this.maxTimeOutNumber);

            return;
        }

        // 返回信息
        this.iframeEvent.source.postMessage(
            {
                message: "iEarth Got Params",
                data: data,
            },
            this.iframeEvent.origin
        );

        // 设置分析功能是否能够共存
        if (Object.keys(data).includes("isCoexist"))
            this.isCoexist = data.isCoexist;

        // 清除当前存在的分析
        this.clearExitAnalyses();

        // 执行可视域分析
        if (data.viewshedOption) {
            this.initViewShed3D(data.viewshedOption);
        }

        // 执行天际线分析
        if (data.skylineOption) {
            this.initSkyline(data.skylineOption);
        }

        // 执行阴影查询分析
        if (data.shadowOption) {
            this.initShadow(data.shadowOption);
        }

        // 执行通视分析
        if (data.sightLineOption) {
            this.initSightLine(data.sightLineOption);
        }
    }

    // 清除其他分析功能
    clearExitAnalyses() {
        if (this.viewshed3D) {
            this.viewshed3D.distance = 0.00001;
            this.viewshed3D.viewPosition = [0, 0, 0];
            this.viewshed3D = undefined;
            if (!this.isCoexist)
                this.viewer.camera.moveEnd.removeEventListener(
                    this.updateViewShed3D_Bind
                );
        }

        if (this.skyline) {
            this.skyline.clear();
            this.skyline = undefined;
            if (!this.isCoexist)
                this.viewer.camera.moveEnd.removeEventListener(
                    this.updateSkyline_Bind
                );
        }

        if (this.shadowQuery) {
            this.shadowQuery.clear();
            this.shadowQuery.destroy();
            this.shadowQuery = undefined;
            this.viewer.shadows = false;
            let layers = viewer.scene.layers.layerQueue;
            for (let i = 0; i < layers.length; i++) {
                layers[i].shadowType = SuperMap3D.ShadowType.NONE;
            }
            if (!this.isCoexist)
                this.viewer.camera.moveEnd.removeEventListener(
                    this.updateShadowQuery_Bind
                );
        }

        if (this.sightline) {
            this.sightline.destroy();
            this.sightline = undefined;
            if (!this.isCoexist)
                this.viewer.camera.moveEnd.removeEventListener(
                    this.updateSightLine_Bind
                );
        }
    }

    // 初始化可视域分析
    initViewShed3D(viewshedOption) {
        const viewshedParams = viewshedOption.option;
        if (!viewshedParams.observerPosition) return; // 没有观察点,无法执行可视域分析

        // 计算包围盒
        const observerPosition = viewshedParams.observerPosition;
        const targetPosition = this.computedTargetPositionByDistance(
            observerPosition,
            viewshedParams.distance
        );
        const boundingSphere = this.computedBoundingSphereFromPoints([
            observerPosition,
            targetPosition,
        ]);
        this.viewer.camera.flyToBoundingSphere(boundingSphere, {
            duration: 2,
        });

        this.viewshedOptions = {
            observerPosition: observerPosition,
            targetPosition: targetPosition,
            option: viewshedParams,
        };
        this.updateViewShed3D_Bind = this.updateViewShed3D.bind(this); // bind返回一个新函数，导致removeEventListener无效
        this.viewer.camera.moveEnd.addEventListener(this.updateViewShed3D_Bind); // bind绑定this，不然里面的this是undefined
    }

    // 初始化天际线分析
    initSkyline(skylineOption) {
        const skylineParams = skylineOption.option;
        const cameraPosition = skylineParams.cameraPosition;
        if (cameraPosition && cameraPosition.destination) {
            // 如果参数携带了坐标，将定位后执行天际线分析
            const destination = cameraPosition.destination;
            if (destination instanceof Array && destination.length === 3) {
                const position = SuperMap3D.Cartesian3.fromDegrees(
                    destination[0],
                    destination[1],
                    destination[0]
                );
                cameraPosition.destination = position;
                this.viewer.camera.flyTo(cameraPosition);
            }
        }

        this.skylineOptions = {
            option: skylineParams,
        };
        this.updateSkyline(); // 由于不一定有定位相机跳转，所以这里直接执行一次
        this.updateSkyline_Bind = this.updateSkyline.bind(this);
        this.viewer.camera.moveEnd.addEventListener(this.updateSkyline_Bind);
    }

    // 初始化阴影查询分析
    initShadow(shadowOption) {
        const shadowParams = shadowOption.option;
        const region = shadowParams.region;
        if (!region || region.length < 3) return; // 没有分析区域或分析区域不满足要求
        const boundingSphere = this.computedBoundingSphereFromPoints(region);
        this.viewer.camera.flyToBoundingSphere(boundingSphere, {
            duration: 2,
        });

        this.shadowOptions = {
            option: shadowParams,
        };
        this.updateShadowQuery_Bind = this.updateShadowQuery.bind(this);
        this.viewer.camera.moveEnd.addEventListener(
            this.updateShadowQuery_Bind
        );
    }

    // 初始化通视分析
    initSightLine(sightLineOption) {
        const sightLineParams = sightLineOption.option;
        if (!sightLineParams.observerPosition) return; // 必须要有观察点和至少一个目标点
        if (
            !sightLineParams.targetPositions ||
            sightLineParams.targetPositions.length < 1
        )
            return;
        const points = [];
        points.push(sightLineParams.observerPosition);
        sightLineParams.targetPositions.forEach((targetPoint) =>
            points.push(targetPoint)
        );
        const boundingSphere = this.computedBoundingSphereFromPoints(points);
        this.viewer.camera.flyToBoundingSphere(boundingSphere, {
            duration: 2,
        });

        this.sightLineOptions = {
            option: sightLineParams,
        };
        this.updateSightLine_Bind = this.updateSightLine.bind(this);
        this.viewer.camera.moveEnd.addEventListener(this.updateSightLine_Bind);
    }

    // 更新可视域分析效果
    updateViewShed3D() {
        const { observerPosition, targetPosition, option } =
            this.viewshedOptions;
        if (!this.viewshed3D)
            this.viewshed3D = new SuperMap3D.ViewShed3D(this.viewer.scene); // 初始化
        this.viewshed3D.viewPosition = observerPosition;
        this.viewshed3D.build();
        this.viewshed3D.setDistDirByPoint(targetPosition);
        this.viewshed3D.horizontalFov = option.horizontalFov || 90;
        this.viewshed3D.verticalFov = option.verticalFov || 60;
        this.viewshed3D.hintLineColor = SuperMap3D.Color.fromCssColorString(
            option.hintLineColor || "rgb(212,202,45)"
        );
        this.viewshed3D.visibleAreaColor = SuperMap3D.Color.fromCssColorString(
            option.visibleAreaColor || "rgba(9,199,112,0.4)"
        );
        this.viewshed3D.hiddenAreaColor = SuperMap3D.Color.fromCssColorString(
            option.hiddenAreaColor || "rgba(238,114,22,0.4)"
        );
    }

    // 更新天际线分析效果
    updateSkyline() {
        const { option } = this.skylineOptions;
        if (!this.skyline)
            this.skyline = new SuperMap3D.Skyline(this.viewer.scene); // 初始化
        this.skyline.clear();
        this.skyline.radius = option.radius || 10000;
        this.skyline.ignoreGlobe = option.ignoreGlobe || true; //地球表面不参与分析
        this.skyline.color = SuperMap3D.Color.fromCssColorString(
            option.skylineColor || "rgb(200, 0, 0, 1.0)"
        );
        this.skyline.displayStyle = option.displayStyle || 0;
        this.skyline.lineWidth = option.lineWidth || 2;
        let cartographic = this.viewer.scene.camera.positionCartographic;
        let lon = SuperMap3D.Math.toDegrees(cartographic.longitude);
        let lat = SuperMap3D.Math.toDegrees(cartographic.latitude);
        let hei = cartographic.height;
        let observerObj = {
            viewPosition: [lon, lat, hei],
            pitch: SuperMap3D.Math.toDegrees(this.viewer.scene.camera.pitch),
            direction: SuperMap3D.Math.toDegrees(
                this.viewer.scene.camera.heading
            ),
        };
        this.skyline.viewPosition = observerObj.viewPosition;
        this.skyline.pitch = observerObj.pitch;
        this.skyline.direction = observerObj.direction;
        this.skyline.build();
    }

    // 更新阴影查询分析效果
    updateShadowQuery() {
        const { option } = this.shadowOptions;
        if (!this.shadowQuery)
            this.shadowQuery = new SuperMap3D.ShadowQueryPoints(
                this.viewer.scene
            ); // 初始化
        this.viewer.shadows = true;
        const layers = this.viewer.scene.layers.layerQueue;
        for (let i = 0; i < layers.length; i++) {
            layers[i].selectEnabled = false;
            layers[i].shadowType = 2; // 设置图层的阴影模式
        }

        //设置分析对象的开始结束时间
        const startTime = new Date(
            (option.startTime && option.startTime.date) || "2017-05-13"
        );
        startTime.setHours(
            Number((option.startTime && option.startTime.hour) || 10)
        ); // 10点
        this.shadowQuery.startTime = SuperMap3D.JulianDate.fromDate(startTime);
        const endTime = new Date(
            (option.endTime && option.endTime.date) || "2017-05-13"
        );
        endTime.setHours(Number((option.endTime && option.endTime.hour) || 12)); // 12点
        this.shadowQuery.endTime = SuperMap3D.JulianDate.fromDate(endTime);

        // 计算分析区域点
        let points = [];
        option.region.forEach((point) => {
            points.push(point[0]);
            points.push(point[1]);
        });

        // 执行阴影率分析
        this.shadowQuery.spacing = Number(option.spacing || 10);
        this.shadowQuery.timeInterval = Number(option.timeInterval || 60);
        this.shadowQuery.qureyRegion({
            position: points, // 分析区域:由包含经度、纬度的数组表示
            bottom: Number(option.bottom || 20), // 底部高程
            extend: Number(option.extend || 30), // 拉伸高度
        });
        this.shadowQuery.build();
    }

    // 更新通视分析效果
    updateSightLine() {
        const { option } = this.sightLineOptions;
        if (!this.sightline)
            this.sightline = new SuperMap3D.Sightline(this.viewer.scene); // 初始化
        this.sightline.build();
        this.sightline.removeAllTargetPoint();
        this.sightline.lineWidth = option.lineWidth || 5;
        this.sightline.viewPosition = option.observerPosition;
        option.targetPositions.forEach((targetPoint, index) => {
            this.sightline.addTargetPoint({
                position: targetPoint,
                name: `point-${index}-${new Date().getTime()}`, // 必须加上index,因为执行速度太快name相同导致其他目标点没有参与分析
            });
        });
    }

    // 笛卡尔转经纬度
    cartesiantoDegrees(cartesian3) {
        let array = [].concat(cartesian3);
        let positions = [];
        for (let i = 0, len = array.length; i < len; i++) {
            let cartographic = SuperMap3D.Cartographic.fromCartesian(array[i]);
            let longitude = Number(
                SuperMap3D.Math.toDegrees(cartographic.longitude)
            );
            let latitude = Number(
                SuperMap3D.Math.toDegrees(cartographic.latitude)
            );
            let height = Number(cartographic.height);
            if (
                positions.indexOf(longitude) == -1 &&
                positions.indexOf(latitude) == -1
            ) {
                positions.push(longitude);
                positions.push(latitude);
                positions.push(height);
            }
        }
        return positions;
    }

    // 计算传入的经纬点数组的包围盒:[[longitude, latitude, height],[]]
    computedBoundingSphereFromPoints(points, height = 100) {
        if (points instanceof Array && points.length >= 2) {
            let points_c3 = [];
            points.forEach((point) => {
                if (!point[2]) point[2] = height;
                const c3 = SuperMap3D.Cartesian3.fromDegrees(
                    point[0],
                    point[1],
                    point[2]
                );
                points_c3.push(c3);
            });
            const boundingSphere =
                SuperMap3D.BoundingSphere.fromPoints(points_c3);
            boundingSphere.radius = boundingSphere.radius * 1.5;
            return boundingSphere;
        }
    }

    // 基于观察点和距离计算目标点[longitude, latitude, height]
    computedTargetPositionByDistance(position, distance = 300) {
        const observerPosition_C3 = SuperMap3D.Cartesian3.fromDegrees(
            position[0],
            position[1],
            position[2]
        );
        const transform = SuperMap3D.Transforms.eastNorthUpToFixedFrame(
            observerPosition_C3,
            SuperMap3D.Ellipsoid.WGS84,
            new SuperMap3D.Matrix4()
        );
        const offset_C3 = new SuperMap3D.Cartesian3(0, Number(distance), 0);
        const targetPosition_C3 = SuperMap3D.Matrix4.multiplyByPoint(
            transform,
            offset_C3,
            new SuperMap3D.Cartesian3()
        );
        return this.cartesiantoDegrees(targetPosition_C3);
    }

    // 销毁
    destroy() {
        this.clearExitAnalyses();
        this.viewshedOptions = {};
        this.skylineOptions = {};
        this.shadowOptions = {};
        this.updateViewShed3D_Bind = undefined;
        this.updateSkyline_Bind = undefined;
        this.updateShadowQuery_Bind = undefined;
        this.updateSightLine_Bind = undefined;
        this.handleAllTilesLoaded_Bind = undefined;
    }
}

export default AIFunction;
