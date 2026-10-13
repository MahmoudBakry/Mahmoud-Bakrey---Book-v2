import { Language, SiteContent } from '../types';
import { AR_CONTENT } from './ar';
import { EN_CONTENT } from './en';

export const CONTENT_DICTIONARY: Record<Language, SiteContent> = {
  ar: AR_CONTENT,
  en: EN_CONTENT,
};

export const getContent = (lang: Language): SiteContent => {
  return CONTENT_DICTIONARY[lang] || AR_CONTENT;
};
