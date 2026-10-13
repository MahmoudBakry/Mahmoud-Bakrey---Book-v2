import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../context/ThemeContext';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, toggleLanguage } = useLanguage();
  const { isLight } = useTheme();

  return (
    <button
      onClick={toggleLanguage}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-300 border backdrop-blur-md select-none ${
        isLight
          ? 'border-[#B99A61]/35 bg-[#F5EFE6] hover:bg-[#EAE0D2] hover:border-[#B99A61]/60 shadow-sm'
          : 'border-white/15 bg-white/[0.05] hover:bg-white/[0.1] hover:border-white/25'
      } ${className}`}
      aria-label={language === 'ar' ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
      title={language === 'ar' ? 'English' : 'العربية'}
    >
      <span
        className={`transition-colors duration-200 ${
          language === 'ar'
            ? isLight
              ? 'text-[#78561C] font-bold font-arabic-display text-[12px]'
              : 'text-[#F5DFB5] font-bold font-arabic-display text-[12px]'
            : isLight
              ? 'text-[#6B5A52] hover:text-[#1A1412] text-[11px]'
              : 'text-neutral-400 hover:text-neutral-200 text-[11px]'
        }`}
      >
        عربي
      </span>
      <span
        className={`text-[10px] select-none font-light ${
          isLight ? 'text-[#B99A61]/60' : 'text-white/20'
        }`}
      >
        |
      </span>
      <span
        className={`font-editorial-serif tracking-widest text-[11px] transition-colors duration-200 ${
          language === 'en'
            ? isLight
              ? 'text-[#78561C] font-bold'
              : 'text-[#F5DFB5] font-bold'
            : isLight
              ? 'text-[#6B5A52] hover:text-[#1A1412]'
              : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        EN
      </span>
    </button>
  );
};
