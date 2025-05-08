import i18next from "i18next";
import Backend from 'i18next-http-backend'
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector"


i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
        debug: true,
        fallbackLng: 'en',
        lng: localStorage.getItem("i18nextLng") || 'en',
        saveMissing: true,
        supportedLngs: ['ru','en','ka']
    })