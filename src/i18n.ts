import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'uk', // ukrain
    fallbackLng: 'uk',
    supportedLngs: ['uk', 'en'],
    debug: import.meta.env.DEV,
    interpolation: { escapeValue: false },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    load: 'languageOnly',
    detection: {
      order: ['navigator', 'cookie', 'localStorage'],
      caches: ['cookie', 'localStorage'],
    },
  });

export default i18n;
