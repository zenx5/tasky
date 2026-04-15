import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./langs/enUS";
import ptBR from "./langs/ptBR";
import esVE from "./langs/esVE";

const resources = {
  en: enUS,
  pt: ptBR,
  es: esVE
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt",
    interpolation: {
      escapeValue: false
    }
  });

  export default i18n;