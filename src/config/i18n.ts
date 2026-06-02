import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import * as middleware from 'i18next-http-middleware';

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'hi'],
    backend: {
      loadPath: __dirname + '/../locales/{{lng}}/messages.json',
    },
    detection: {
      order: ['querystring', 'header'],
      caches: false,
    },
  });

export default i18next;
