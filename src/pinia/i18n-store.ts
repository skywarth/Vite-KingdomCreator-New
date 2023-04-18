import { defineStore } from 'pinia';
import { Language } from '../i18n/language';
import { i18n, setLocale, loadLocaleMessages } from '../i18n/i18n';
import type { I18n } from 'vue-i18n';
import { Settings } from '../i18n/settings';

export const usei18nStore = defineStore({
  id: 'i18nStore',
  state: () => ({
    language: Language.ENGLISH,
  }),
  actions: {
    async LOAD_DEFAULT_LANGUAGE() {
      const settings = Settings.load();
      return this.UPDATE_LANGUAGE(settings.language);
    },
    async UPDATE_LANGUAGE(language: Language) {
      this.SET_LANGUAGE(language);
      loadLocaleMessages(i18n as I18n, language);
    },
    SET_LANGUAGE (language: Language) {
      setLocale(i18n as I18n, language);
      this.language = language;
      new Settings(language).save();
    },
  },
});