export type OptionType = {
  id: number | string
  title: string // 用于i18n国际化的提示
  label?: string // 标签
  name: string // 英文名称
  icon?: any // 图标
}
export type OptionsType = OptionType[]

