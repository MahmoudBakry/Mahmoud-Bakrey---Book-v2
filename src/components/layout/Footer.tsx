import React from 'react';
import { ArrowUp, MessageCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { BRAND_CONFIG } from '../../config/brand';
import { NAVIGATION_ITEMS } from '../../config/navigation';
import { BrandMonogram } from '../ui/BrandMonogram';
import { WhatsAppIcon, SnapchatIcon, TikTokIcon, InstagramIcon } from '../ui/SocialIcons';

interface FooterProps {
  onOpenPreorder?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPreorder }) => {
  const { content, isRtl, language } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      className="relative w-full bg-[#140F0D] text-[#F7F2EA] border-t border-[#B99A61]/25 select-none pt-16 sm:pt-20 pb-12 overflow-hidden"
      aria-label={isRtl ? 'تذييل الموقع والقنوات الرسمية' : 'Footer & Official Channels'}
    >
      {/* Ambient Atmospheric Lighting */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full pointer-events-none opacity-15 blur-[120px]"
        style={{
          background: 'radial-gradient(ellipse at center, #B99A61 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP SECTION: BRAND MONOGRAM + CONTACT & SOCIAL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-14 border-b border-[#B99A61]/20 items-start">
          
          {/* Brand Presentation (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-start text-start">
            <div className="flex items-center gap-3.5 mb-4">
              <BrandMonogram size={42} showWordmark={true} />
            </div>

            <p className="text-sm sm:text-base text-[#E5DED1]/85 font-arabic-body leading-relaxed max-w-md mb-6">
              {isRtl
                ? 'دليل نجاح مشروع الأزياء للأستاذة منيرة الحربي. خلاصة أكثر من عشرين عاماً من الخبرة العملية في بناء وتطوير دور الأزياء في دولة الكويت والخليج العربي.'
                : 'The Fashion Business Success Guide by Designer Munira Alharbi. Over 20 years of atelier mastery distilled into an actionable roadmap.'}
            </p>

            <span className="text-xs font-arabic-calligraphy text-[#D8BF8A] tracking-wide">
              «{content.brand.tagline}»
            </span>
          </div>

          {/* Quick Nav Links (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col text-start">
            <h4 className="text-xs font-editorial-serif tracking-[0.2em] text-[#E6CA85] uppercase mb-4 font-bold">
              {isRtl ? 'روابط الوصول السريع' : 'QUICK NAVIGATION'}
            </h4>
            <ul className="space-y-2.5 text-sm text-[#E5DED1]/80">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="hover:text-[#E6CA85] transition-colors cursor-pointer text-start font-arabic-body"
                  >
                    {item.label[language]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Social Channels & WhatsApp (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col text-start">
            <h4 className="text-xs font-editorial-serif tracking-[0.2em] text-[#E6CA85] uppercase mb-4 font-bold">
              {isRtl ? 'القنوات الرسمية والتواصل' : 'OFFICIAL CONTACT & SOCIAL'}
            </h4>

            {/* Direct WhatsApp Callout Card */}
            <a
              href={BRAND_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-[#1F1714] border border-[#B99A61]/40 hover:border-[#25D366] hover:bg-[#1F1714]/90 transition-all duration-300 flex items-center justify-between group shadow-lg mb-4"
              aria-label="Contact Munira Alharbi via WhatsApp"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform">
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#F7F2EA] block font-arabic-display group-hover:text-[#E6CA85] transition-colors">
                    {isRtl ? 'واتساب الأتيليه المباشر' : 'Direct Atelier WhatsApp'}
                  </span>
                  <span className="text-xs font-mono text-[#D8BF8A] dir-ltr inline-block">
                    {BRAND_CONFIG.whatsapp}
                  </span>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#25D366]/20 text-emerald-300 border border-[#25D366]/30 font-medium">
                {isRtl ? 'تواصل فوري' : 'Chat'}
              </span>
            </a>

            {/* Social Media Grid (Snapchat, TikTok, Instagram) */}
            <div className="grid grid-cols-3 gap-2.5">
              
              {/* Snapchat */}
              <a
                href={BRAND_CONFIG.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.03] border border-[#B99A61]/25 hover:border-[#FFFC00] hover:bg-[#FFFC00]/10 transition-all flex flex-col items-center justify-center text-center group"
                aria-label="Munira Alharbi Snapchat"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#B99A61] group-hover:text-[#FFFC00] transition-colors">
                  <SnapchatIcon className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] font-semibold text-[#E5DED1] group-hover:text-white transition-colors mt-1 font-editorial-serif">
                  Snapchat
                </span>
              </a>

              {/* TikTok */}
              <a
                href={BRAND_CONFIG.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.03] border border-[#B99A61]/25 hover:border-[#00F2FE] hover:bg-[#00F2FE]/10 transition-all flex flex-col items-center justify-center text-center group"
                aria-label="Munira Alharbi TikTok"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#B99A61] group-hover:text-[#00F2FE] transition-colors">
                  <TikTokIcon className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] font-semibold text-[#E5DED1] group-hover:text-white transition-colors mt-1 font-editorial-serif">
                  TikTok
                </span>
              </a>

              {/* Instagram */}
              <a
                href={BRAND_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.03] border border-[#B99A61]/25 hover:border-[#E1306C] hover:bg-[#E1306C]/10 transition-all flex flex-col items-center justify-center text-center group"
                aria-label="Munira Alharbi Instagram"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#B99A61] group-hover:text-[#E1306C] transition-colors">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-[#E5DED1] group-hover:text-white transition-colors mt-1 font-editorial-serif">
                  Instagram
                </span>
              </a>

            </div>

          </div>

        </div>

        {/* BOTTOM COPYRIGHT & BACK TO TOP BAR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E5DED1]/60">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-start">
            <span>
              © {new Date().getFullYear()} {content.brand.name} ({content.brand.nameEn}) — {isRtl ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}.
            </span>
            <span className="hidden sm:inline text-[#B99A61]/40">•</span>
            <span>{isRtl ? 'دولة الكويت' : 'State of Kuwait'}</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-editorial-serif uppercase tracking-wider text-[#D8BF8A] hover:text-white transition-colors cursor-pointer group"
            aria-label="Back to top"
          >
            <span>{isRtl ? 'العودة للأعلى' : 'BACK TO TOP'}</span>
            <ArrowUp className="w-3.5 h-3.5 transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
};
