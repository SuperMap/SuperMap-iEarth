//语言
import { createI18n } from 'vue-i18n';
import { getLanguage } from '@/tools/getLanguage';
import { getRootUrl } from '@/tools/iportal/portalTools';
import { getLocale } from '@supermapgis/portal-locale';

// 获取index.html通过<script>标签引入的语言资源文件
const lang_data = window.lang_data;
const lang_support_list: string[] = window.lang_support_list || [];
const lang_default: string = window.lang_default || 'en';

const lang = getLanguage();

// 设置页面语言与文字方向：阿拉伯语等RTL语言自动镜像（优先使用portal-locale返回的direction）
export const setPageDirection = (lang: string, direction?: 'ltr' | 'rtl') => {
  document.documentElement.lang = lang;
  document.documentElement.dir = direction ?? (lang === 'ar' ? 'rtl' : 'ltr');
};

setPageDirection(lang);

const i18n = createI18n({
  locale: lang,
  messages: lang_data
})

/**
 * iPortal环境下优先使用@supermapgis/portal-locale获取服务端语言配置（用户配置 -> cookie -> 浏览器语言，多级降级不抛异常），
 * 异步校正初始语言与RTL镜像方向；非iPortal环境不发起请求，保持现有同步逻辑。
 * @returns 校正后的语言；无需校正时返回null
 */
export const initPortalLocale = async (): Promise<string | null> => {
  if (location.href.indexOf('/apps') === -1) return null; // 仅iPortal环境生效

  const config = await getLocale(getRootUrl());
  const uiLocale = config?.uiLocale;
  if (!uiLocale) return null;

  // 服务端语言不在本地支持列表时（如iPortal配置了本地无资源的语言），使用默认语言
  const target = lang_support_list.indexOf(uiLocale) !== -1 ? uiLocale : lang_default;

  if (target !== i18n.global.locale) {
    i18n.global.locale = target;
  }
  setPageDirection(target, config?.direction);
  return target;
};

export default i18n;
