import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Gift, Layers, CheckCircle2, BookOpen, Eye } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { BrandMonogram } from '../../ui/BrandMonogram';
import { trackEvent } from '../../../lib/analytics';

interface FashionPrimaryCTAProps {
  onOpenPreorder?: () => void;
  onOpenReader?: () => void;
}

export const FashionPrimaryCTA: React.FC<FashionPrimaryCTAProps> = ({ onOpenPreorder, onOpenReader }) => {
  const { content, isRtl } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const handleCtaClick = () => {
    trackEvent('select_buy_cta', {
      source: 'full_screen_open_fashion_cta',
      edition: 'launch_edition',
    });
    onOpenPreorder?.();
  };

  return (
    <div className="relative z-30 w-full select-none">
      
      {/* 
        ========================================================================
        CONNECTING NARRATIVE THREAD (NO CARD, OPEN SCREEN)
        Flows directly from "ومن التفاصيل تبدأ الحكاية"
        ========================================================================
      */}
      <div className="flex flex-col items-center mb-10 sm:mb-16">
        {/* Subtle Silk Thread Axis with Radiant Golden Node */}
        <div className="w-[1.5px] h-12 sm:h-16 bg-gradient-to-b from-[#B99A61] via-[#E6CA85] to-transparent relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#E6CA85] animate-ping opacity-60" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#B99A61]" />
        </div>

        {/* Minimal Editorial Bridge Pill */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.04] border border-[#B99A61]/35 backdrop-blur-xl mt-4 shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-[#E6CA85]" />
          <span className="text-xs sm:text-sm font-editorial-serif tracking-widest uppercase text-[#E6CA85]">
            {isRtl ? 'التفاصيل التي تصنع نجاح علامتك' : 'THE ESSENTIAL ATELIER BLUEPRINT'}
          </span>
        </div>
      </div>

      {/* 
        ========================================================================
        FULL-SCREEN OPEN WIDGET (ZERO CARD WRAPPER)
        Free-breathing 2-column spatial canvas across the entire screen
        ========================================================================
      */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full relative"
      >
        {/* Ambient Volumetric Studio Halos in the screen background */}
        <div
          className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full pointer-events-none opacity-25 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #B99A61 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #C28F89 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Main 2-Column Responsive Spatial Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* 
            ====================================================================
            COLUMN 1: THE 3D SPATIAL VISUAL HERO (FREE-FLOATING IN OPEN CANVAS)
            ====================================================================
          */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[420px] sm:min-h-[520px] py-6 sm:py-10">
            
            {/* Luminous Core Glow directly behind the 3D Book */}
            <div
              className="absolute w-[320px] sm:w-[460px] h-[320px] sm:h-[460px] rounded-full pointer-events-none opacity-45 blur-[90px]"
              style={{
                background: 'radial-gradient(circle, rgba(230, 202, 133, 0.4) 0%, rgba(185, 154, 97, 0.18) 50%, transparent 75%)',
              }}
            />

            {/* 
              ------------------------------------------------------------------
              3D PERSPECTIVE LUXURY ATELIER BOOK OBJECT (NATIVE CANVAS)
              ------------------------------------------------------------------
            */}
            <div
              className={`relative z-10 w-[260px] sm:w-[330px] h-[360px] sm:h-[450px] transition-transform duration-700 ease-out cursor-pointer ${
                isHovered ? 'scale-[1.05]' : 'scale-100'
              }`}
              style={{
                perspective: '1400px',
                transformStyle: 'preserve-3d',
                transform: isHovered
                  ? 'rotateY(-8deg) rotateX(4deg) translateZ(25px)'
                  : 'rotateY(-14deg) rotateX(6deg)',
              }}
              onClick={handleCtaClick}
            >
              {/* Realistic Page Thickness Layers (Right / Bottom rim) */}
              <div
                className="absolute inset-y-1.5 -right-3.5 sm:-right-4 w-4 sm:w-5 bg-gradient-to-r from-[#ECE2D2] via-[#F7F2EA] to-[#D5C7B0] rounded-r-sm shadow-xl"
                style={{
                  backgroundImage: 'repeating-linear-gradient(to right, #ECE2D2 0px, #ECE2D2 1px, #FFF 1px, #FFF 2px)',
                }}
              />

              {/* Main Hardcover Plate */}
              <div className="book-3d-shadow relative w-full h-full rounded-2xl bg-gradient-to-br from-[#1C1614] via-[#2A201C] to-[#140F0D] border border-[#B99A61]/60 p-7 sm:p-9 flex flex-col justify-between overflow-hidden">
                
                {/* Subtle Leather/Fabric Texture Grate */}
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #B99A61 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                />

                {/* Shimmer Light Reflection Sweep across cover */}
                <div
                  className="animate-gold-shimmer absolute inset-0 w-1/2 h-[250%] -top-1/2 pointer-events-none opacity-45"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 235, 190, 0.45) 50%, transparent 100%)',
                  }}
                />

                {/* Top Header: Monogram Emblem */}
                <div className="flex items-center justify-between z-10">
                  <BrandMonogram size={34} />
                  <span className="text-[10px] font-editorial-serif tracking-[0.25em] text-[#E6CA85] uppercase">
                    ATELIER EDITION
                  </span>
                </div>

                {/* Center Book Foil Title Lockup */}
                <div className="my-auto text-center z-10 py-6">
                  <span className="text-xs sm:text-sm font-editorial-serif tracking-widest text-[#B99A61] uppercase block mb-2 font-semibold">
                    MUNIRA ALHARBI
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-arabic-display text-[#F7F2EA] leading-[1.3] text-depth-arabic-title">
                    دليل نجاح
                    <br />
                    مشروع الأزياء
                  </h3>
                  <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#E6CA85] to-transparent mx-auto mt-5" />
                </div>

                {/* Bottom Spine Detail & Gold Thread Bookmark */}
                <div className="flex items-center justify-between text-[11px] text-[#D8BF8A]/90 font-arabic-body z-10 border-t border-[#B99A61]/25 pt-3.5">
                  <span>الكويت • 2026</span>
                  <span className="font-editorial-serif font-bold text-[#E6CA85]">VOLUME 01</span>
                </div>

                {/* Gold Silk Ribbon Bookmark hanging out */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4 sm:w-5 h-12 bg-gradient-to-b from-[#B99A61] via-[#E6CA85] to-[#B99A61] shadow-2xl rounded-b-sm" />
              </div>
            </div>

            {/* 
              ------------------------------------------------------------------
              FLOATING SATELLITE WIDGETS (BREATHING IN THE OPEN CANVAS)
              ------------------------------------------------------------------
            */}

            {/* Widget 1: Top Pulsing FOMO Urgency Pill */}
            <div
              className="animate-float-gentle absolute -top-3 sm:top-2 -right-1 sm:right-6 z-20 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#1F1714]/90 border border-[#B99A61]/60 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center gap-3"
              style={{ animationDelay: '0s' }}
            >
              {/* Radar Live Beacon */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-fomo-radar absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#F7F2EA] font-arabic-display whitespace-nowrap">
                {isRtl ? 'مقعدان متبقيان • استشارة خاصة مجانية' : 'Only 2 Slots Left • Free 1:1 Consultation'}
              </span>
            </div>

            {/* Widget 2: Bottom Floating VIP Consultation Card */}
            <div
              className="animate-float-opposite absolute -bottom-4 sm:bottom-4 -left-1 sm:left-4 z-20 p-3.5 sm:p-4 rounded-2xl bg-[#241A16]/95 border border-[#E6CA85]/50 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.7)] max-w-[220px] sm:max-w-[260px] flex items-center gap-3.5"
              style={{ animationDelay: '1.2s' }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#B99A61]/25 border border-[#B99A61]/60 flex items-center justify-center shrink-0 text-[#E6CA85] shadow-inner">
                <Gift className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-[#E6CA85] font-arabic-display leading-tight">
                  {isRtl ? 'استشارة شخصية 1:1' : '1:1 Private Guidance'}
                </span>
                <span className="text-[10px] sm:text-xs text-[#E5DED1]/85 font-arabic-body mt-0.5">
                  {isRtl ? 'مع المصممة منيرة الحربي' : 'With Munira Alharbi'}
                </span>
              </div>
            </div>

            {/* Widget 3: Side Floating Metric Chip */}
            <div
              className="animate-float-gentle absolute top-1/2 -translate-y-1/2 -left-4 sm:left-0 z-20 px-3.5 py-2 rounded-xl bg-[#1B1513]/90 border border-white/15 backdrop-blur-xl shadow-2xl hidden sm:flex items-center gap-2.5"
              style={{ animationDelay: '2.5s' }}
            >
              <Layers className="w-4 h-4 text-[#B99A61]" />
              <span className="text-xs font-semibold text-[#D8BF8A] font-arabic-display">
                {isRtl ? '20+ عاماً • 7 فصول حصرية' : '20+ Yrs • 7 Chapters'}
              </span>
            </div>

          </div>

          {/* 
            ====================================================================
            COLUMN 2: OPEN EDITORIAL ACTION SUITE (ZERO CARD, NATIVE CANVAS)
            ====================================================================
          */}
          <div className="lg:col-span-5 flex flex-col justify-center text-start">
            
            {/* Minimal Category Pill */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B99A61] animate-pulse" />
              <span className="text-xs sm:text-sm font-editorial-serif tracking-widest uppercase text-[#B99A61] font-bold">
                {isRtl ? 'الإصدار المحدود • 2026' : 'LIMITED RELEASE • 2026'}
              </span>
            </div>

            {/* Monumental Modern Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-[46px] font-extrabold font-arabic-display text-[#F7F2EA] leading-[1.2] mb-4 text-depth-arabic-title">
              {isRtl ? 'كل التفاصيل… بين يديكِ الآن' : 'Every Detail… In Your Hands'}
            </h2>

            {/* Modern Concise Subtext */}
            <p className="text-base sm:text-lg text-[#E5DED1]/85 font-arabic-body leading-relaxed mb-8 max-w-xl">
              {isRtl
                ? 'خلاصة أكثر من 20 عاماً في تأسيس الأتيليه، أسرار الباترون، الموردين المعتمدين، والتسعير المربح — تختصر عليك سنوات من التجربة والخطأ.'
                : 'The definitive blueprint covering atelier setup, suppliers, pattern mastery, and profitable pricing.'}
            </p>

            {/* Modern Open Price Lockup (No card box) */}
            <div className="flex items-baseline gap-4 mb-8 pb-6 border-b border-[#B99A61]/25">
              <span className="text-5xl sm:text-6xl font-black font-editorial-serif text-[#F7F2EA] tracking-tight text-depth-arabic-title">
                {content.hero.priceFormatted}
              </span>
              <span className="text-lg sm:text-xl text-[#8C7243] line-through font-editorial-serif">
                {content.hero.originalPriceFormatted}
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 font-arabic-display px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                {isRtl ? 'وفر 40% لفترة الإطلاق' : 'Save 40% Launch Price'}
              </span>
            </div>

            {/* 
              ------------------------------------------------------------------
              OUTCROWD-STYLE MODERN PILL PRIMARY CTA BUTTON
              Magnetic, prominent, arrow micro-interaction
              ------------------------------------------------------------------
            */}
            <button
              onClick={handleCtaClick}
              className="luxury-pulse-cta group relative w-full sm:max-w-md py-5 sm:py-6 px-8 sm:px-10 rounded-full bg-gradient-to-r from-[#B99A61] via-[#E6CA85] to-[#B99A61] text-[#16110F] font-extrabold text-lg sm:text-xl font-arabic-display shadow-[0_20px_50px_rgba(185,154,97,0.35)] cursor-pointer active:scale-[0.98] transition-all duration-300 flex items-center justify-between border border-[#FFF0D0]"
              aria-label={isRtl ? 'احصلي على دليلكِ الآن' : 'Get Your Guide Now'}
            >
              {/* Dynamic Shimmer Light Reflection */}
              <div
                className="animate-gold-shimmer absolute inset-0 w-1/3 h-[250%] -top-1/2 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.85) 50%, transparent 100%)',
                }}
              />

              {/* Button Label */}
              <span className="relative z-10">
                {isRtl ? 'احصلي على دليلكِ الآن' : 'Get Your Guide Now'}
              </span>

              {/* Animated Directional Arrow Pill Badge */}
              <div className="relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#16110F] text-[#E6CA85] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                {isRtl ? (
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:-translate-x-1 transition-transform duration-300" />
                ) : (
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                )}
              </div>
            </button>

            {/* DEMO BOOK READER PREVIEW BUTTON */}
            {onOpenReader && (
              <button
                onClick={onOpenReader}
                className="mt-3.5 group relative w-full sm:max-w-md py-3.5 px-6 rounded-full bg-[#241D1A]/80 hover:bg-[#B99A61]/20 text-[#E6CA85] hover:text-[#FFF] border border-[#B99A61]/40 hover:border-[#B99A61] font-bold text-sm font-arabic-display transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
                aria-label={isRtl ? 'عاين الكتاب' : 'Preview Book'}
              >
                <BookOpen className="w-4 h-4 text-[#B99A61] group-hover:text-[#E6CA85] transition-colors" />
                <span>{isRtl ? 'عاين الكتاب' : 'Preview Book'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B99A61]/25 text-[#E6CA85] border border-[#B99A61]/35">
                  {isRtl ? 'نسخة تجريبية' : 'Demo'}
                </span>
              </button>
            )}

            {/* Minimalist Trust & Access Note (NO payment words) */}
            <div className="mt-4 flex items-center gap-2.5 text-xs sm:text-sm text-[#D8BF8A] font-arabic-body">
              <Sparkles className="w-4 h-4 text-[#B99A61] shrink-0" />
              <span>
                {isRtl
                  ? 'وصول فوري ومباشر للدليل الرقمي • فرصة الاستشارة الخاصة'
                  : 'Instant digital access • Exclusive consultation bonus'}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
