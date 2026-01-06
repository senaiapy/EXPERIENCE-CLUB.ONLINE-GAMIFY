import en from '@/translations/en.json';
import es from '@/translations/es.json';
import pt from '@/translations/pt.json';

export const resources = {
  es: {
    translation: es,
  },
  en: {
    translation: en,
  },
  pt: {
    translation: pt,
  },
};

export type Language = keyof typeof resources;
