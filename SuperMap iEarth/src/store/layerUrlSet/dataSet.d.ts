export interface DataSetType {
  publicServiceList:any,
  onlineBaseLayerList:any,
  onlineTerrainLayerList:any
}

export type OptionType = {
  url?: string; // 服务资源路径url
  thumbnail:string; // 缩略图
  title: string; // 标题
  type: string; // 类型
  imgsrc: string; // css png
  key?: string; // 密钥
  chooseType:boolean; // 是否选择
  isMultipleChoose:boolean; // 是否多选
  index:number; // 索引
  token?:string; // token
  subdomains?:string[],
  name?:stirng // 图层名称
}