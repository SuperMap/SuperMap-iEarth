export const layerServiceData = {
    // 以后可能会弄成从json文件读取的形式,方便配置
    // 公共服务
    publicServiceList: [
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/CBD.jpg",
            proxiedUrl: 'http://www.supermapol.com/realspace/services/3D-CBD-2/rest/realspace',
            // proxiedUrl: 'http://localhost:8090/iserver/services/3D-0523/rest/realspace',
            name: "北京CBD",
            layers: [{ type: 'S3M', layerName: 'Building@CBD' }, { type: 'S3M', layerName: 'Tree@CBD' }, { type: 'S3M', layerName: 'Xiaopin@CBD' }, { type: 'S3M', layerName: 'Lake@CBD' }, { type: 'S3M', layerName: 'Ground@CBD' }, { type: 'S3M', layerName: 'Ground2@CBD' }, { type: 'S3M', layerName: 'Bridge@CBD' }],
            chooseType: false
        },
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/Sophia.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-suofeiya_church/rest/realspace",
            name: "索菲亚教堂",
            chooseType: false
        },
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/ZfTerranAndImagery.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace",
            name: "珠峰地形影像",
            layers: [{ type: 'IMG', layerName: 'image' }, { type: 'TERRAIN', layerName: 'srtm_54_07%40zhufeng' }],
            chooseType: false
        },
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/BIM.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-wireFrame/rest/realspace",
            name: "BIM建筑",
            layers: [{ type: 'S3M', layerName: "wireFrame" }],
            chooseType: false
        },
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/PointCloud.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-cloud/rest/realspace",
            name: "global.Pointcloud",
            layers: [{ type: 'S3M', layerName: 'POINTCLOUD23' }],
            chooseType: false
        },
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/Histogram.jpg",
            proxiedUrl: " https://www.supermapol.com/realspace/services/3D-Histogram/rest/realspace",
            name: "点云",
            chooseType: false
        },
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/Household.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-QingXieSheYingMoXing/rest/realspace",
            name: "柱状图",
            layers: [{ type: 'S3M', layerName: 'qingxie' }],
            chooseType: false
        },

        // {
        //     "id": 9,
        //     "type": "SCP",
        //     "thumbnail": "./images/addData/Household.jpg",
        //     "proxiedUrl": "https://www.supermapol.com/realspace/services/3D-FCFH_Shangdong/rest/realspace/datas/config/config",
        //     "name": "倾斜分层分户",
        //     "state": 0
        // },


        {
            type: "MVT",
            thumbnail: "./images/addData/MVT.jpg",
            proxiedUrl: "http://www.supermapol.com/realspace/services/map-mvt-JingJinDiQuDiTu/restjsr/v1/vectortile/maps/%E4%BA%AC%E6%B4%A5%E5%9C%B0%E5%8C%BA%E5%9C%B0%E5%9B%BE",
            name: "京津地区MVT",
            VectorTilesMapName: 'JingJinMVT',
            layers: [{ type: 'MVT', layerName: '京津地区MVT' }],
            chooseType: false
        },
        // {
        //     "id": 10,
        //     "type": "REALSPACE",
        //     "thumbnail": "./images/addData/VectorThematicMap.jpg",
        //     "proxiedUrl": "https://www.supermapol.com/realspace/services/3D-five-vector/rest/realspace",
        //     "name": "矢量专题图",
        //     "state": 0
        // },

        {
            type: "ThematicMap",
            thumbnail: "./images/addData/cqbm.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-CQmodel_wireframe_2000/rest/realspace/datas/CQmodel/config",
            name: "重庆白模",
            S3MLayer: true,
            chooseType: false
        },
        {
            type: "ThematicMap",
            thumbnail: "./images/addData/hbbm.jpg",
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-XinBaiMo-2/rest/realspace/datas/%E4%B8%80%E8%88%AC%E5%AE%B6%E5%B1%8B/config",
            name: "横滨白模",
            S3MLayer: true,
            chooseType: false
        },
        {
            type: "REALSPACE",
            thumbnail: "./images/addData/Sophia.jpg",
            proxiedUrl: "http://localhost:8090/iserver/services/3D-bdz/rest/realspace",
            name: "变电站",
            chooseType: false
        },
    ],
    // 在线底图服务
    onlineBaseLayerList: [{
        url: './images/baseLayers/baseImage.png',
        name: '本地图片',
        thumbnail: './images/baseLayers/image.jpg',
        title: '本地图片',
        type: 'IMAGE',
        imgsrc: '@/../static/css/cross.png',
        chooseType: false,
        isMultipleChoose: false,
        index: 0
    },
    {
        url: '//dev.virtualearth.net/',
        name: '必应底图',
        thumbnail: './images/baseLayers/BingMap.jpg',
        title: '必应底图',
        type: 'BINGMAP',
        imgsrc: '@/../static/css/cross.png',
        key: "Aq0D7MCY5ErORA9vrwFtfE9aancUq5J6uNjw0GieF0ostaIrVuJZ8ScXxNHHvEwS",
        chooseType: false,
        isMultipleChoose: false,
        index: 1
    },
    {
        url: 'https://[subdomain].tianditu.gov.cn/img_w/wmts',
        name: '天地图',
        thumbnail: './images/baseLayers/tianditu.jpg',
        token: '7933ae29d47bcf1440889ad983dbe0af',
        title: '天地图',
        type: 'TIANDITU',
        imgsrc: '@/../static/css/cross.png',
        chooseType: false,
        isMultipleChoose: false,
        index: 2
    },
    {
        url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        name: 'OSM底图',
        thumbnail: './images/baseLayers/OSM.jpg',
        title: 'OSM底图',
        type: 'OSM',
        imgsrc: '@/../static/css/cross.png',
        subdomains: ["a", "b", "c", "d"],
        chooseType: false,
        isMultipleChoose: false,
        index: 3
    },
    {
        name: '经纬底图',
        thumbnail: './images/baseLayers/grad.jpg',
        title: '经纬底图',
        type: 'GRIDIMAGERY',
        imgsrc: '@/../static/css/cross.png',
        chooseType: false,
        isMultipleChoose: false,
        index: 4
    }
    ],
    // 在线地形
    onlineTerrainLayerList: [
        {
            proxiedUrl: 'https://maptiles.supermapol.com/iserver/services/3D-local3DCache-GlobalTIN30M/rest/realspace/datas/Global_TIN_30M',
            name: '超图在线地形',
            thumbnail: './images/terrainLayers/SuperMapOnline.png',
            title: '超图在线地形',
            type: 'supermapOnlineTerrain',
            chooseType: false,
        },
        {
            proxiedUrl: '',
            name: '天地图地形',
            thumbnail: './images/terrainLayers/tianditu_terrain.png',
            title: '天地图地形',
            type: 'tianDiTuTerrain',
            chooseType: false
        },
        {
            proxiedUrl: "https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path",
            name: 'STK地形',
            thumbnail: './images/terrainLayers/STK_terrain.png',
            title: 'STK地形',
            type: 'STKTerrain',
            chooseType: false
        }

    ]
}