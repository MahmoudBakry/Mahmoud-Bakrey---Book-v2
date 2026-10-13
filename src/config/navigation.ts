import { PricingConfig, NavItem } from '../types';

export const PRICING_CONFIG: PricingConfig = {
  currency: {
    ar: 'د.ك',
    en: 'KWD',
  },
  currentPrice: 50,
  originalPrice: 85,
  discountPercentage: 40,
  consultationPrice: 70,
  badgeText: {
    ar: 'عرض الإطلاق الخاص',
    en: 'Exclusive Launch Offer',
  },
};

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: {
      ar: 'الرئيسية',
      en: 'Home',
    },
    href: '#hero',
  },
  {
    id: 'about',
    label: {
      ar: 'عن الدليل',
      en: 'About the Guide',
    },
    href: '#about-guide',
  },
  {
    id: 'chapters',
    label: {
      ar: 'محتوى الكتاب',
      en: 'Chapters',
    },
    href: '#chapters',
  },
  {
    id: 'author',
    label: {
      ar: 'عن المؤلفة',
      en: 'About Author',
    },
    href: '#author',
  },
  {
    id: 'faq',
    label: {
      ar: 'الأسئلة الشائعة',
      en: 'FAQ',
    },
    href: '#faq',
  },
];
