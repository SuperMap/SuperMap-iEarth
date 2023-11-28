import { defineStore } from 'pinia'
import { LangStateType } from './langStore.d'
import { LangEnum } from '@/enums/styleEnum'
import i18n from '@/locale/index'
import { setLocalStorage, getLocalStorage } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import { langGlobal } from '@/locale/index'
// import { GlobalStoreCreate } from '@/store/global/global';

// const GlobalStore = GlobalStoreCreate();

const { SM_LANG_STORE } = StorageEnum
const storageLang: LangStateType = getLocalStorage(SM_LANG_STORE)
const lang = LangEnum.ZH;
// 语言
export const useLangStoreCreate = defineStore({
  id: 'useLangStoreState',
  state: (): LangStateType =>
    storageLang || {
      lang,
    },
  getters: {
    getLang(): LangEnum {
      return this.lang
    }
  },
  actions: {
    changeLang(lang: LangEnum): void {
      // if (this.lang === lang) return
      this.lang = lang
      i18n.global.locale = lang
      setLocalStorage(SM_LANG_STORE, this.$state)

      // GlobalStore.currentLanguage = lang;
      // 有两种方式来切换语言：控件切换、初始化根据浏览器环境自动切换，都会经过这里来实现具体切换，在这里我们把语言包绑定在window对象上，以便在TS代码中使用
      // window.LangGlobal = langGlobal[lang];
      window.LangGlobal = langGlobal[this.lang];
      window.GlobalLang = window.LangGlobal.global;
    }
  }
})
