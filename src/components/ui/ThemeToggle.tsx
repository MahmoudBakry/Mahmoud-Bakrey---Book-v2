import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme, isLight } = useTheme();
  const { language } = useLanguage();

  const titleText = isLight
    ? (language === 'ar' ? 'التحويل إلى الوضع الليلي' : 'Switch to Dark Mode')
    : (language === 'ar' ? 'التحويل إلى الوضع النهاري' : 'Switch to Light Mode');

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-full text-xs transition-all duration-300 border select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B99A61] ${
        isLight
          ? 'border-[#B99A61]/30 bg-[#F5EFE6] text-[#4B3732] hover:bg-[#EAE0D2] hover:border-[#B99A61]/60 shadow-sm'
          : 'border-white/15 bg-white/[0.05] text-[#D8BF8A] hover:bg-white/[0.1] hover:border-white/25 hover:text-white backdrop-blur-md'
      } ${className}`}
      aria-label={titleText}
      title={titleText}
    >
      {isLight ? (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 text-[#8C7243]" />
      ) : (
        <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45 text-[#F5DFB5]" />
      )}
    </button>
  );
};
