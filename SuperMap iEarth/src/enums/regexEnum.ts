// 填写资源地址的格式提示枚举
export enum UrlFormatEnum {
    S3M = "http://<server>:<port>/iserver/services/<component>/rest/realspace/datas/<layerName>/config",
    Image = "http://<server>:<port>/realspace/services/<component>/rest/(realspace/datas)|(maps)/<layerName>",
    MVT = "http://<server>:<port>/iserver/services/<component>/restjsr/v1/vectortile/maps/<layerName>",
    Terrain = "http://<server>:<port>/realspace/services/<component>/rest/realspace/datas/<layerName>",
    ArcGIS = "http://<server>:<port>/arcgis/rest/services/<layerName>/MapServer",
    WMTS = "http://<server>:<port>/iserver/services/{serviceName}/wmts100",
    RealSpace = "http://<server>:<port>/realspace/services/<component>/rest/realspace",
    DataService = "http://<server>:<port>/iserver/services/<component>/rest/data",
}

// 图层地址正则匹配枚举
export const UrlRegexEnum = {
    S3M: /^https?:\/\/.*?\/realspace\/datas\/(.*?)\/config$/,
    Image: /^https?:\/\/.*?\/(realspace\/datas|maps)\/(.*?)$/,
    MVT: /^https?:\/\/.*?\/restjsr\/v1\/vectortile\/maps\/(.*?)$/,
    Terrain: /^https?:\/\/.*?\/realspace\/datas\/(.*?)$/,
    ArcGIS: /^https?:\/\/.*?\/services\/(.*?)\/MapServer$/,
    WMTS: /^https?:\/\/.*?\/services\/(.*?)\/wmts100$/,
    RealSpace: /^https?:\/\/.*?\/services\/(.*?)\/realspace$/,
    DataService: /^https?:\/\/.*?\/services\/(.*?)\/data$/,
}