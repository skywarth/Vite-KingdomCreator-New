import { computed, watch } from "vue";
import { onBeforeMount } from "vue";
import type { I18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { usei18nStore } from "../pinia/i18n-store";

import { Language, getLanguage } from "../i18n/language";
import { i18n, getLocale } from "../i18n/i18n";

const useBase = () => {
  const i18nStore = usei18nStore();
  const route = useRoute();
  const router = useRouter();

  const languageStateStr = computed(() => getLocale(i18n as I18n));
  console.log("languageStateStr", languageStateStr.value)
  console.log("language Pinia ", i18nStore.language)
  
  const routeQueryLang = computed(() => route.query.lang);
  // console.log("Base - languageStr = ",languageStateStr.value)
  // console.log("Base - routeQueryLang = ",routeQueryLang.value)

  // function for onBeforeMount 
  const updateLanguageForQueryParam = () => {
    console.log("updateLanguageForQueryParam", languageStateStr.value, route.query.lang)
    const langStr = Array.isArray(route.query.lang)
      ? route.query.lang[0]
      : route.query.lang;
    if (langStr && typeof langStr === 'string' && langStr !== languageStateStr.value) {
      // loadLocaleMessages(i18n as I18n, getLanguage(langStr));
      // setI18nLanguage(i18n as I18n, langStr);
      i18nStore.UPDATE_LANGUAGE(getLanguage(langStr) as Language);
    }
  };

  // for Watch function : languageStateStr
  const onLanguageChanged = () => {
    console.log("onLanguageChanged", languageStateStr.value)
    if (route.query.lang === languageStateStr.value) { return; }
    if (getLanguage(languageStateStr.value) === Language.ENGLISH) {
      const { lang, ...query } = route.query;
      router.replace({ query });
    } else {
      router.replace({
        query: {
          ...route.query,
          lang: languageStateStr.value,
        },
      });
    }
  };

  // for Watch function : $route.query.lang
  const onLanguageQueryParameterChanged = () => {
    console.log("onLanguageQueryParameterChanged", route.query.lang)
    if (route.query.lang !== languageStateStr.value) {
      //loadLocaleMessages(i18n as I18n, (route.query.lang as any) as Language);
      //setI18nLanguage(i18n as I18n, (route.query.lang as any) as Language);
      i18nStore.UPDATE_LANGUAGE(route.query.lang as Language);
    }
  };

  watch(languageStateStr, onLanguageChanged);
  watch(routeQueryLang, onLanguageQueryParameterChanged);

  onBeforeMount(() => {
    if (route.query.lang) {
      updateLanguageForQueryParam();
    } else {
      console.log ("i18nStore", i18nStore.language)
      i18nStore.UPDATE_LANGUAGE(i18nStore.language);
    }
  });

  return {
    languageStateStr,
    routeQueryLang,
    onLanguageChanged,
    onLanguageQueryParameterChanged,
  };
}

export default useBase
