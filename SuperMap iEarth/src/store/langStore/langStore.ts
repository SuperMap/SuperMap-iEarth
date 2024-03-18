import i18n from '@/locale/index';
import { defineStore } from 'pinia';
import { getLanguage } from '@/tools/getLanguage';

let lang = getLanguage();
export const useLangStoreCreate = defineStore({
  id: 'useLangStoreState',
  state: () =>({
    lang:lang
  }),
  getters: {
    getLang(): string{
      return this.lang;
    }
  },
  actions: {
    changeLang(lang:string): void {
      this.lang = lang;
      i18n.global.locale = lang;
    }
  }
})
