class WMTSParse {
    constructor(axios, xml2js, option) {
        this.axios = axios;
        this.xml2js = xml2js;

        this.init(option);
    }

    init(parmas) {
        this.xml2jsOption = {
            attrkey: '_attributes'
        }
        if (!parmas) return;

        if (parmas.xml2jsOption) {
            this.xml2jsOption = option.xml2jsOption
        }
    }

    async checkURLAccess(url) {
        try {
            const response = await this.axios.get(url);
            return response.status === 200; // 200表示请求成功
        } catch (error) {
            return false; // 请求失败则URL不可访问
        }
    }

    async getXml(url) {
        if (!this.axios) return;
        const isAccess = await this.checkURLAccess(url)
        if (isAccess) {
            const response = await this.axios.get(url);
            return Promise.resolve(response.data);
        }
    }

    async xmlToJson(xmlData) {
        if (!xmlData) return
        const jsonData = await this.xml2js.parseStringPromise(xmlData, this.xml2jsOption);
        return Promise.resolve(jsonData);
    }

    async getWMTSInfo(url) {
        const xmlData = await this.getXml(url);
        const jsonData = await this.xmlToJson(xmlData);

        const wmtsInfo = this.computedWMTSInfo(jsonData);
        return Promise.resolve(wmtsInfo);
    }

    computedWMTSInfo(wmtsObj) {
        if (!wmtsObj || !wmtsObj.Capabilities) return;
        
        // 判断是否为SuperMap iServer 发布的 WMTS 服务
        const ServiceIdentificationList = wmtsObj.Capabilities["ows:ServiceIdentification"];
        if(ServiceIdentificationList && ServiceIdentificationList.length > 0){
            const ServiceIdentification = ServiceIdentificationList[0];
            const AbstractList = ServiceIdentification["ows:Abstract"]
            if(AbstractList && AbstractList.length>0){
                const Abstract = AbstractList[0];
                if(Abstract.includes("SuperMap iServer")){
                    console.log("SuperMap iServer 发布的 WMTS 服务");
                }else{return "not iServer release";}
            }else{return "not iServer release";}
        }else{return "not iServer release";}

        const WMTSXML = 'http://www.opengis.net/wmts/1.0'
        const wmstInfo = {}

        const { _attributes, Contents } = wmtsObj.Capabilities
        if (_attributes?.xmlns !== WMTSXML) {
            return
        }
        const { Layer, TileMatrixSet } = Contents[0]
        if (!Layer || !TileMatrixSet) {
            return
        }

        // 图层信息
        const layerInfoList = this.computedLayerInfo(Layer);

        // 瓦片矩阵信息：坐标系和比例尺
        const tileMatrixSetList = this.computedTileMatrixSetInfo(TileMatrixSet);

        wmstInfo.layerList = layerInfoList;
        wmstInfo.tileSetList = tileMatrixSetList;

        return wmstInfo;
    }

    // 计算图层信息
    computedLayerInfo(layerData) {
        let layers = layerData

        if (!Array.isArray(layers)) {
            layers = [layers]
        }

        const infoList = [];
        layers.forEach(layer => {
            const info = {
                style: null,
                format: null,
                layer: null,
                tileMatrixSetIDs: [],
                boundingBox: null,
            }

            // 风格样式：TODO支持其他风格类型
            if (layer.Style) {
                layer.Style.forEach(element => {
                    info.style = element['ows:Identifier'][0];
                    // info.styles.push(value);
                })
            }

            // 格式format + urlTemplate
            let resourceURL = layer?.ResourceURL
            if (!Array.isArray(resourceURL)) {
                resourceURL = [resourceURL]
            }
            info.format = 'image/png' || layer?.Format
            const resourceURLItem = resourceURL.filter(s => s._attributes.resourceType === 'tile')
            let pngResource = resourceURLItem.find(s => s._attributes.format.endsWith('png')) || resourceURLItem[0]
            if (pngResource) {
                info.urlTemplate = pngResource?._attributes?.template
                info.format = pngResource?._attributes?.format
            }

            // 图层名称
            const Identifier = layer['ows:Identifier'];
            if (Identifier) {
                info.layer = Identifier[0]
            }

            // tileMatrixSetID 
            const TileMatrixSetLink = layer['TileMatrixSetLink'];
            if (TileMatrixSetLink) {
                TileMatrixSetLink.forEach(element => {
                    const tileMatrixSetID = element.TileMatrixSet[0];
                    info.tileMatrixSetIDs.push(tileMatrixSetID);
                });
            }

            // 区域范围
            let wgsBox = layer['ows:WGS84BoundingBox'] || layer['ows:BoundingBox']
            if (wgsBox) {
                if (Array.isArray(wgsBox)) wgsBox = wgsBox[0]
                const lower = wgsBox['ows:LowerCorner'][0].split(' ').map(s => Number(s))
                const upper = wgsBox['ows:UpperCorner'][0].split(' ').map(s => Number(s))
                info.boundingBox = {
                    lowerCorner: lower,
                    upperCorner: upper,
                }
            }
            infoList.push(info)
        })

        return infoList;
    }

    // 计算瓦片矩阵集信息：包含坐标系类型和比例尺信息
    computedTileMatrixSetInfo(tileSetData) {
        let TileMatrixSets = tileSetData

        if (!Array.isArray(TileMatrixSets)) {
            TileMatrixSets = [TileMatrixSets]
        }

        const infoList = [];
        TileMatrixSets.forEach(tileSet => {
            const info = {};
            info.tileMatrixSetID = tileSet['ows:Identifier'][0]
            info.crs = tileSet['ows:SupportedCRS'][0]
            // info.tileMatrixLabels = tileSet.TileMatrix.map(s => s['ows:Identifier'])
            info.scaleDenominators = tileSet.TileMatrix.map(s => s['ScaleDenominator'][0])
            if(tileSet["TileMatrix"] && tileSet["TileMatrix"].length>0){
                info.topLeftCorner = tileSet["TileMatrix"][0].TopLeftCorner;
            }
            infoList.push(info);
        });

        return infoList;
    }


}

export default WMTSParse;