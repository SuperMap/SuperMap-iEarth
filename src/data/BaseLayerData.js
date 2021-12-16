var BaseLayerModels;
import Resource from "../common/js/language" 
export default BaseLayerModels = [
    {
        url : '@/../static/images/baseLayer/baseImage.png',
        name : Resource.localImage,
        thumbnail : '@/../static/images/baseLayer/image.jpg',
        title : 'Image',
        type : 'IMAGE',
        imgsrc:'@/../static/css/cross.png',
        chooseType:true,
        isMultipleChoose:false,
        index:0
    },
    {
        url : '//dev.virtualearth.net',
        name : Resource.bingMaps,
        thumbnail : '@/../static/images/baseLayer/BingMap.jpg',
        title : 'BingMap',
        type : 'BINGMAP',
        imgsrc:'@/../static/css/cross.png',
        key:"AhrJDRCi6VfUJWMk-_eZNGTfDSddoQfoUGRaf1PJg3KPejm6W3H0kjdhJFgIV948",
        chooseType:false,
        isMultipleChoose:false,
        index :1
    },
    {
        url : 'https://[subdomain].tianditu.gov.cn/img_w/wmts',
        name : Resource.tianditu,
        thumbnail : '@/../static/images/baseLayer/tianditu.jpg',
        token:'4a00a1dc5387b8ed8adba3374bd87e5e',
        title : '天地图',
        type : 'TIANDITU',
        imgsrc:'@/../static/css/cross.png',
        chooseType:false,
        isMultipleChoose:false,
        index:2
    },
    {
        url : 'https://a.tile.openstreetmap.org/',
        name : Resource.OpenStreetMap,
        thumbnail : '@/../static/images/baseLayer/OSM.jpg',
        title : 'Open Street Map',
        type : 'OSM',
        imgsrc:'@/../static/css/cross.png',
        chooseType:false,
        isMultipleChoose:false,
        index:3
    },
    {
        name : Resource.gridImagery,
        thumbnail : '@/../static/images/baseLayer/grad.jpg',
        title : 'Grid Image Map',
        type : 'GRIDIMAGERY',
        imgsrc:'@/../static/css/cross.png',
        chooseType:false,
        isMultipleChoose:false,
        index:4
    }
];
