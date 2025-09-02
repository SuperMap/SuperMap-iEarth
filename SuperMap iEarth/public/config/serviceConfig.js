const layerServiceData = {
    // 公共服务列表 - 场景
    publicServiceList: [
        {
            /** 配置场景类型的示例 */
            type: "REALSPACE", // 场景类型
            thumbnail: "./images/addData/CBD.jpg", // 缩略图相对地址
            proxiedUrl: 'https://www.supermapol.com/realspace/services/3D-0523/rest/realspace', // 场景服务链接
            name: "BeijingCBD", // vue-i18n中国际化的名称,设置后可跟随浏览器语言环境1变化而变化：./locale/zh.js-BeijingCBD
            chooseType: false // 面板中图片是否选中（默认false即可）
        },
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/Sophia.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-suofeiya_church-2/rest/realspace",
            name: "SophiaChurch",
            chooseType: false
        },
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/ZfTerranAndImagery.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace",
            name: "MountEverest",
            chooseType: false
        },
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/BIM.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-BIMbuilding-2/rest/realspace",
            name: "BIMBuilding",
            chooseType: false
        },
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/PointCloud.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-cloud-2/rest/realspace",
            name: "Pointcloud",
            chooseType: false
        },
        {
            type: "MVT",
            thumbnail: "./images/addData/MVT.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/map-mvt-JingJinDiQuDiTu/restjsr/v1/vectortile/maps/%E4%BA%AC%E6%B4%A5%E5%9C%B0%E5%8C%BA%E5%9C%B0%E5%9B%BE",
            name: "JingJinMVT",
            VectorTilesMapName: 'JingJinMVT',
            chooseType: false
        },
        {
            type: "ThematicMap",
            thumbnail: "./images/addData/cqbm.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-CQmodel_wireframe_2000-2/rest/realspace/datas/wireFrame/config",
            name: "ChongqingBaimo",
            S3MLayer: true,
            chooseType: false
        },
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/Petroleum.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-PowerPlant-2/rest/realspace",
            name: "transformerStation",
            chooseType: false
        },
        // {
        //     type: "REALSPACE",
        //     thumbnail: "./images/addData/CBD.jpg",
        //     proxiedUrl: 'https://www.supermapol.com/realspace/services/3D-CBD/rest/realspace',
        //     name: "originCBD",
        //     chooseType: false
        // },
    ],
    // 在线底图服务 - 影像
    onlineBaseLayerList: [
        /** 配置影像类型的示例 */
        {
            url: './images/baseMap/baseImage.jpg', // 影像服务链接
            name: "LocalImage", // vue-i18n中国际化的名称
            thumbnail: './images/baseMap/locate.png', // 缩略图相对地址
            type: 'LocalImage', // 影像图层类型
            chooseType: false, // 面板中图片是否选中（默认false即可）
        },
        {
            url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            name: "gaodeMap",
            thumbnail: './images/baseMap/BingMap.png',
            type: 'UrlTemplateImageryProvider',
            chooseType: false,
        },
        // {
        //     url: '//dev.virtualearth.net/',
        //     name: "BingMap",
        //     thumbnail: './images/baseMap/BingMap.png',
        //     type: 'BingMap',
        //     chooseType: false,
        // },
        {
            url: 'https://[subdomain].tianditu.gov.cn/img_w/wmts',
            name: "TIANDITU",
            thumbnail: './images/baseMap/tianditu.png',
            type: 'TIANDITU',
            chooseType: false,
        },
        {
            name: "GRIDIMAGERY",
            thumbnail: './images/baseMap/grad.png',
            type: 'GRIDIMAGERY',
            chooseType: false,
        },
        {
            url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            name: "OSM",
            thumbnail: './images/baseMap/OSM.png',
            type: 'OSM',
            subdomains: ["a", "b", "c", "d"],
            chooseType: false,
        },
        // {
        //     url: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
        //     name: "japanStand",
        //     thumbnail: './images/baseMap/standard_jp.png',
        //     type: 'UrlTemplateImageryProvider',
        //     chooseType: false,
        // },
        // {
        //     url: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
        //     name: "japanPale",
        //     thumbnail: './images/baseMap/tinge_jp.png',
        //     type: 'UrlTemplateImageryProvider',
        //     chooseType: false,
        // },
        // {
        //     url: 'https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png',
        //     name: "japanBlank",
        //     thumbnail: './images/baseMap/grad.png',
        //     type: 'UrlTemplateImageryProvider',
        //     chooseType: false,
        // },
        // {
        //     url: 'https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg',
        //     name: "japanImage",
        //     thumbnail: './images/baseMap/image_jp.png',
        //     type: 'UrlTemplateImageryProvider',
        //     chooseType: false,
        // },

    ],
    // 在线地形服务 - 地形
    onlineTerrainLayerList: [
        /** 配置地形类型的示例 */
        {
            proxiedUrl: 'https://maptiles.supermapol.com/iserver/services/3D-local3DCache-GlobalTIN30M/rest/realspace/datas/Global_TIN_30M', // 地形服务链接
            thumbnail: './images/terrainLayers/SuperMapOnline.png', // 缩略图相对地址
            name: "SuperMapOnlineTerrain", // vue-i18n中国际化的名称
            type: 'supermapOnlineTerrain', // 地形服务类型
            chooseType: false, // 面板中图片是否选中（默认false即可）
        },
        // {
        //     proxiedUrl: '',
        //     thumbnail: './images/terrainLayers/tianditu_terrain.png',
        //     name: "tiandituTerrain",
        //     type: 'tianDiTuTerrain',
        //     chooseType: false
        // },
        {
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path",
            thumbnail: './images/terrainLayers/STK_terrain.png',
            name: "stkTerrain",
            type: 'STKTerrain',
            chooseType: false
        }
    ]
}

window.layerServiceData = layerServiceData;