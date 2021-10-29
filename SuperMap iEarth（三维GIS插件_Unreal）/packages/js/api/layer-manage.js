
// 添加s3m
function addS3mLayer(url, name) {
    if (!checkURL(url)) return;
    let type = SuperMap.Web.Realspace.Layer3DType.OSGB;
    let promise = getScene().get_layer3Ds().add(url, name, name, type);
    return promise
};

// 添加影像
function addImageLayer(url, name) {    // 返回img图层layer
    if (!checkURL(url)) return;
    let type = SuperMap.Web.Realspace.Layer3DType.IMAGE;
    let promise = getScene().get_layer3Ds().add(url, name, name, type);
    return promise
};


// 添加地形
function addTerrainLayer(url, name) {
    if (!checkURL(url)) return;
    let promise = getScene().get_terrainLayers().add(url, name, name);
    return promise
};

// 根据图层类型添加
function addLayerByType(layerType, layerUrl, layerName) {
    let promise = new Promise((resolve, reject) => resolve(undefined));
    switch (layerType) {
        case "S3M":
            promise = addS3mLayer(layerUrl, layerName);
            break;
        case "IMG":
            promise = addImageLayer(layerUrl, layerName);
            break;
        case "TERRAIN":
            if (getScene().get_terrainLayers().get_count() === 0) //已经有地形就加不上了
                promise = addTerrainLayer(layerUrl, layerName);
            break;
        default:
            promise = new Promise((resolve, reject) => resolve(undefined));
    }
    return promise
}

//   检验url地址
function checkURL(url) {
    if (!url || url === null || url === "") {
        console.log("error: url undefined");
        return false;
    }
    if (url.charAt(0) == '"' || url.charAt(0) == "'") {
        let reg = /^['|"](.*)['|"]$/;
        url = url.replace(reg, "$1");
    }
    return true
};

//   删除图层
function layersDelete(type, name) {
    switch (type) {
        case "S3M":
        case "IMG":
            getScene().get_layer3Ds().removeAt(name);
            break;
        case "TERRAIN":
            getScene().get_terrainLayers().removeAt(name);
            break;
        default:
            null;
    }
}


function getScene() {
    if (viewer) return viewer.get_scene();
    else 'viewer error:' + viewer;
}


export default {
    addS3mLayer,
    addTerrainLayer,
    addImageLayer,
    layersDelete,
    addLayerByType,
    getScene
};
