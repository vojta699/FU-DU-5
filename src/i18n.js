import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n.use(initReactI18next).use(Backend).init({
  backend: {
    loadPath: '/locales/{{lng}}/translation.json', // Cesta k překladům
  },
  fallbackLng: 'cz',
  lng: 'cz', // Výchozí jazyk
  interpolation: { escapeValue: false },
});



export default i18n;