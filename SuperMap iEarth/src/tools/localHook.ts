import { computed } from 'vue'
import { zhCN, dateZhCN, enUS,dateEnUS,jaJP, dateJaJP,ruRU,dateRuRU } from 'naive-ui'
import { useLangStoreCreate } from '@/store/langStore/langStore'
import { LangEnum } from '@/enums/styleEnum'



/**
 * * 设置naive-ui 语言
 */

// 返回语言
export const useLocaleHook = () => {
    const langStore = useLangStoreCreate()
    return computed(() => (
        langStore.lang == LangEnum.ZH ? { locale: zhCN, dateLocale: dateZhCN } : (
            langStore.lang == LangEnum.JA ? { locale: jaJP, dateLocale: dateJaJP } : (
                langStore.lang == LangEnum.RU ? { locale: ruRU, dateLocale: dateRuRU } :  { locale: enUS, dateLocale: dateEnUS }
            )
        )
    ))
}

// export const useLocaleHook = () => {
//     const langStore = useLangStoreCreate();
//     if(langStore.lang == LangEnum.ZH){
//         return { locale: zhCN, dateLocale: dateZhCN };       
//     }else if(langStore.lang == LangEnum.EN){
//         return { locale: enUS, dateLocale: dateEnUS };   
//     }else if(langStore.lang == LangEnum.JA){
//         return { locale: jaJP, dateLocale: dateJaJP };   
//     }else if(langStore.lang == LangEnum.RU){
//         return { locale: ruRU, dateLocale: dateRuRU };   
//     }else{
//         return { locale: enUS, dateLocale: dateEnUS };   
//     }
// }