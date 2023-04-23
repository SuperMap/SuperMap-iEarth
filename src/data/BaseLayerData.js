var BaseLayerModels;
import Resource from "../common/js/language"
export default BaseLayerModels = [{
        url: '@/../static/images/baseLayer/baseImage.png',
        name: Resource.localImage,
        thumbnail: '@/../static/images/baseLayer/image.jpg',
        title: 'Image',
        type: 'IMAGE',
        imgsrc: '@/../static/css/cross.png',
        chooseType: true,
        isMultipleChoose: false,
        index: 0
    },
    {
        url: '//dev.virtualearth.net',
        name: Resource.bingMaps,
        thumbnail: '@/../static/images/baseLayer/BingMap.jpg',
        title: 'BingMap',
        type: 'BINGMAP',
        imgsrc: '@/../static/css/cross.png',
        key: "Aq0D7MCY5ErORA9vrwFtfE9aancUq5J6uNjw0GieF0ostaIrVuJZ8ScXxNHHvEwS",
        chooseType: false,
        isMultipleChoose: false,
        index: 1
    },
    {
        url: 'https://[subdomain].tianditu.gov.cn/img_w/wmts',
        name: Resource.tianditu,
        thumbnail: '@/../static/images/baseLayer/tianditu.jpg',
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
        name: Resource.OpenStreetMap,
        thumbnail: '@/../static/images/baseLayer/OSM.jpg',
        title: 'Open Street Map',
        type: 'OSM',
        imgsrc: '@/../static/css/cross.png',
        subdomains:["a", "b", "c", "d"],
        chooseType: false,
        isMultipleChoose: false,
        index: 3
    },
    {
        name: Resource.gridImagery,
        thumbnail: '@/../static/images/baseLayer/grad.jpg',
        title: 'Grid Image Map',
        type: 'GRIDIMAGERY',
        imgsrc: '@/../static/css/cross.png',
        chooseType: false,
        isMultipleChoose: false,
        index: 4
    }
    // ,
    // {
    //     url: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
    //     name: Resource.japanStand,
    //     thumbnail: '@/../static/images/baseLayer/grad.jpg',
    //     title: 'Grid Image Map',
    //     type: 'UrlTemplateImageryProvider',
    //     imgsrc: '@/../static/css/cross.png',
    //     chooseType: false,
    //     isMultipleChoose: false,
    //     index: 5
    // },
    // {
    //     url: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
    //     name: Resource.japanPale,
    //     thumbnail: '@/../static/images/baseLayer/grad.jpg',
    //     title: 'Grid Image Map',
    //     type: 'UrlTemplateImageryProvider',
    //     imgsrc: '@/../static/css/cross.png',
    //     chooseType: false,
    //     isMultipleChoose: false,
    //     index: 6
    // },
    // {
    //     url: 'https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png',
    //     name: Resource.japanBlank,
    //     thumbnail: '@/../static/images/baseLayer/grad.jpg',
    //     title: 'Grid Image Map',
    //     type: 'UrlTemplateImageryProvider',
    //     imgsrc: '@/../static/css/cross.png',
    //     chooseType: false,
    //     isMultipleChoose: false,
    //     index: 7
    // },
    // {
    //     url: 'https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg',
    //     name: Resource.japanImage,
    //     thumbnail: '@/../static/images/baseLayer/grad.jpg',
    //     title: 'Grid Image Map',
    //     type: 'UrlTemplateImageryProvider',
    //     imgsrc: '@/../static/css/cross.png',
    //     chooseType: false,
    //     isMultipleChoose: false,
    //     index: 8
    // }
];