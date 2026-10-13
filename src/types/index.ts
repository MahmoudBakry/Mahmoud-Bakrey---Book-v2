export type Language = 'ar' | 'en';

export interface NavItem {
  id: string;
  label: {
    ar: string;
    en: string;
  };
  href: string;
}

export interface PricingConfig {
  currency: {
    ar: string;
    en: string;
  };
  currentPrice: number;
  originalPrice: number;
  discountPercentage: number;
  consultationPrice: number;
  badgeText: {
    ar: string;
    en: string;
  };
}

export interface HeroContent {
  eyebrow: string;
  mainTitle: string;
  emotionalHeadline: string;
  description: string;
  primaryCTA: string;
  secondaryCTA: string;
  priceFormatted: string;
  originalPriceFormatted: string;
  savingsNote: string;
  highlights: {
    iconName: string;
    number: string;
    label: string;
  }[];
  editionBadge: string;
  authorLabel: string;
  authorName: string;
}

export interface ChallengeItem {
  id: string;
  number: string;
  question: string;
  supporting: string;
  detailNote?: string;
  category: string;
}

export interface ChallengesContent {
  eyebrow: string;
  mainHeadline: string;
  supportingHeadline: string;
  introText: string;
  items: ChallengeItem[];
  closingStatement: string;
  nextSectionTeaser: string;
}

export interface ChapterItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
}

export interface SupplierDirectoryContent {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  markets: string[];
}

export interface ChaptersShowcaseContent {
  eyebrow: string;
  mainHeadline: string;
  supportingDescription: string;
  chapters: ChapterItem[];
  supplierDirectory: SupplierDirectoryContent;
  ctaButtonText: string;
  ctaSubtext: string;
}

export interface BookPreviewPageItem {
  id: string;
  pageNumber: number;
  label: string;
  chapterTitle: string;
  summaryQuote: string;
  highlights: string[];
  image: string;
  isSamplePlaceholder: boolean;
}

export interface BookPreviewSectionContent {
  eyebrow: string;
  scene1: {
    headline: string;
    secondaryLine: string;
    caption: string;
  };
  scene2: {
    headline: string;
    supportingCopy: string;
    sketchNotes: string[];
  };
  scene3: {
    headline: string;
    supportingCopy: string;
    readerNotice: string;
    ctaButton: string;
    priceFormatted: string;
    originalPriceFormatted: string;
    savingsBadge: string;
  };
  samplePages: BookPreviewPageItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  eyebrow: string;
  mainTitle: string;
  items: FaqItem[];
}

export interface AuthorContent {
  eyebrow: string;
  headline: string;
  bioParagraph: string;
  quoteParagraph: string;
  signature: string;
  credentials: {
    number: string;
    label: string;
  }[];
}

export interface SiteContent {
  brand: {
    name: string;
    nameEn: string;
    tagline: string;
    instagramUrl: string;
    snapchatUrl: string;
    tiktokUrl: string;
    whatsappNumber: string;
    whatsappUrl: string;
  };
  nav: {
    home: string;
    aboutGuide: string;
    chapters: string;
    aboutAuthor: string;
    faq: string;
    ctaButton: string;
  };
  hero: HeroContent;
  challenges: ChallengesContent;
  chaptersShowcase: ChaptersShowcaseContent;
  bookPreview: BookPreviewSectionContent;
  author: AuthorContent;
  faq: FaqContent;
  drawer: {
    title: string;
    subtitle: string;
    editionInfo: string;
    formatNote: string;
    instantAccessNotice: string;
    confirmButton: string;
    closeButton: string;
    featurePoints: string[];
    guaranteeText: string;
    consultationBonusBadge?: string;
    consultationBonusTitle?: string;
    consultationBonusDesc?: string;
  };
  consultationOffer?: {
    bonusBadge: string;
    bonusTitle: string;
    bonusDescription: string;
    subsequentPriceNote: string;
    whatsappSupportNote: string;
    supplierReferralNote: string;
  };
}

export interface AttributionParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  sc_click_id?: string;
  timestamp: number;
}
