export interface ToolStateType {
  toolShow:boolean;
  toolBarData:OptionType[],
  leftToolBarData:OptionType[],
  analyseSeries:OptionType[],
}

export type OptionType = {
  id: number | string
  title: string // 用于i18n国际化的提示
  label?: string // 标签
  name: string // 英文名称
  icon?: any // 图标
  iconName?: any // svg图标名称
}
