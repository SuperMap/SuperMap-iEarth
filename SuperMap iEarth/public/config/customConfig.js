const customConfig = {
    // superMapImageryProvider_maximumLevel: 10, // 影像最大层级：此项用于添加数据-自定义服务-图层-影像图层
    s3mLayer_residentRootTile: false, // 是否开启根节点驻留内存（屏幕区域外不清除根节点内存）
    dbQuery_special_field:'ModelName', // DB属性查询中展示表格里面特殊指定的字段名称
    s3mLayer_visibleDistanceMax:9000000, // S3M图层的最大可见距离
    s3mLayer_visibleAltitudeMax:9000000, // S3M图层的最大可见距离
    orderIndependentTranslucency:true, // 设置场景OIT-老版本
    useSuperMapOIT:true, // 设置场景OIT-新版本 - 新版设为false，老版本才起效果 // 体积云要起作用，需要设置 useSuperMapOIT 为true
    f2_cameaPosition: {  // 点击F2调整相机到指定位置
        "position": {
            "longitude": 0.00046569024418889355,
            "latitude": -0.00017044682922301928,
            "height": 1994.2841030014679
        },
        "heading": 0.10346562631583378,
        "pitch": -0.9604954371162333,
        "roll": 6.283185307179586
    },
    targetFrameRate: undefined, // 锁帧 ：锁帧和反走样会造成mouseMove-pickposition的时候场景疯狂闪烁，建议先关闭锁帧,即使用默认值undefined
    enableCollisionDetection: true, // 开启或者关闭相机与地形的碰撞检测【默认开启】
    minimumDetectDistance: 0.5, // 最小室内碰撞检测距离【默认0.5】
    isDisplayFrameRate:false, // 是否开启帧率控件
    ignoreNormal:false,// 获取或者设置是否在GPU中自动计算法线，默认值为false。值为true时，在GPU中自动计算法线，不使用数据自带的法线。值为false时,在GPU中不自动计算法线，使用数据自带的法线。
    ignoreVertexColor:false,//是否忽略顶点颜色
    // minTransparentAlpha:0.8,//最小透明度阈值
    // maximumScreenSpaceError:19, // 用于驱动细节级细化的最大屏幕空间误差。较高的值将提供更好的性能，但较低的视觉质量。
    // LoadingPriority:1, // 获取或者设置加载的优先级模式，分为深度优先、层优先、空间索引、深度优先非线性切换。默认值为3
    // cacheSize:1024, // 设置缓存空间大小，单位MB，默认为0
    useAutoOpenPresetScene: false, // 是否使用自动打开本地预设场景json：如果为false其config文件夹下的presetSceneConfig.json将不再初始化时打开
    useLayerTreeAutoUpdate: true, // 是否使用图层目录树每两秒自动刷新一次；关闭后如果出现图层树删除后仍然遗留没有刷新，请关闭图层目录树组件重新打开
    lightModelSize: 5, // 自定义灯光中，灯光模型的缩放比例
}

window.customConfig = customConfig;