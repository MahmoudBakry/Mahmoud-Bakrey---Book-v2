import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { BRAND_CONFIG } from '../../config/brand';
import { WhatsAppIcon } from './SocialIcons';

export const FloatingWhatsApp: React.FC = () => {
  const { isRtl } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`fixed bottom-5 sm:bottom-6 z-40 flex items-center gap-3 ${
        isRtl ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
      }`}
    >
      {/* Floating Hover Tooltip Pill */}
      <a
        href={BRAND_CONFIG.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-full bg-[#1A1412]/95 border border-[#B99A61]/50 text-[#F7F2EA] shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl hover:border-[#25D366] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
        aria-label="Chat on WhatsApp +965 6907 3494"
      >
        {/* Pulsing Emerald Dot */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]" />
        </span>

        {/* WhatsApp Icon */}
        <div className="w-8 h-8 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
          <WhatsAppIcon className="w-4 h-4 fill-current" />
        </div>

        {/* Text Details (Hidden on tiny screens, visible on sm+) */}
        <div className="hidden sm:flex flex-col text-start pr-1 pl-1">
          <span className="text-[11px] font-bold text-[#F7F2EA] font-arabic-display group-hover:text-[#E6CA85] transition-colors leading-tight">
            {isRtl ? 'استفسار عبر الواتساب' : 'WhatsApp Concierge'}
          </span>
          <span className="text-[10px] text-[#D8BF8A] font-mono leading-none mt-0.5">
            {BRAND_CONFIG.whatsapp}
          </span>
        </div>
      </a>
    </div>
  );
};
