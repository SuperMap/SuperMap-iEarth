import i18n from '@/locale/index'
import { defineStore } from 'pinia'
import { StorageEnum } from '@/enums/storageEnum'
import { LangEnum } from '@/enums/styleEnum'
import { LangStateType } from './langStore.d'
import { setLocalStorage, getLocalStorage } from '@/utils'

const { SM_LANG_STORE } = StorageEnum;
const storageLang: LangStateType = getLocalStorage(SM_LANG_STORE);
const lang = LangEnum.ZH;
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
      this.lang = lang
      i18n.global.locale = lang
      setLocalStorage(SM_LANG_STORE, this.$state);
    }
  }
})
