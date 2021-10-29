var otherTerrainAndImageModels;
import Resource from "../common/js/language" 
export default otherTerrainAndImageModels = {

  "6":{          //"6"为根据公共数据中的id获取，就像对数据库中的表建立关联一样。
    "terrain":
      {
        name : Resource.ZFTerrain,
        type : 'Terrain',
        chooseType:false,
        index :3
      },
    "imagery":
      {
        name : Resource.ZFImagery,
        type : 'IMG',
        chooseType:false,
        isMultipleChoose:false,
        index:5
      }
  }
};
