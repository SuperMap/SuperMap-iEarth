var BaseTerrainModels;
import Resource from "../common/js/language" 
export default BaseTerrainModels = [
  {
    url : 'https://maptiles.supermapol.com/iserver/services/3D-local3DCache-GlobalTIN30M/rest/realspace/datas/Global_TIN_30M',
    name : Resource.supermapOnlineTerrain,
    thumbnail : '@/../static/images/baseLayer/SuperMap.jpg',
    title : 'Terrain',
    imgsrc:'@/../static/css/cross.png',
    type : 'supermapOnlineTerrain',
    chooseType:false,
    index :0
  },
  {
    url : '',
    token:"e90d56e5a09d1767899ad45846b0cefd",
    name : Resource.tiandituTerrain,
    thumbnail : '@/../static/images/baseLayer/tdt-1.jpg',
    title : 'Terrain',
    imgsrc:'@/../static/css/cross.png',
    type : 'tianDiTuTerrain',
    chooseType:false,
    index:1
    },
  {
    url : "https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path",
    name : Resource.stkTerrain,
    thumbnail : '@/../static/images/baseLayer/STK.jpg',
    title : 'Terrain',
    imgsrc:'@/../static/css/cross.png',
    type : 'StkTerrain',
    chooseType:false,
    index:2
  }
];
