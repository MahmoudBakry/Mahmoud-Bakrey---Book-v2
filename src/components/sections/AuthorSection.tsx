import React from 'react';
import { Award, Compass, Sparkles, BookOpen, ShieldCheck, Quote } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { BrandMonogram } from '../ui/BrandMonogram';
import { BRAND_CONFIG } from '../../config/brand';
import { WhatsAppIcon, SnapchatIcon, TikTokIcon, InstagramIcon } from '../ui/SocialIcons';

export const AuthorSection: React.FC = () => {
  const { content, isRtl } = useLanguage();
  const authorData = content.author;

  return (
    <section
      id="author"
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden bg-[#1B1513] text-[#F7F2EA] select-none border-t border-[#B99A61]/20"
      aria-label={isRtl ? 'عن المؤلفة — المصممة منيرة الحربي' : 'About the Author — Designer Munira Alharbi'}
    >
      {/* Ambient Atelier Atmospheric Radial Halos */}
      <div
        className="absolute top-1/3 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #B99A61 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-32 w-[550px] h-[550px] rounded-full pointer-events-none opacity-15 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #C28F89 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* 
            ====================================================================
            COLUMN 1: THE EDITORIAL STORY & AUTHENTIC TESTIMONY (7 Cols)
            Directly verbatim from the official PDF document
            ====================================================================
          */}
          <div className="lg:col-span-7 flex flex-col justify-center text-start">
            
            {/* Eyebrow from PDF */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#B99A61]" />
              <span className="text-xs sm:text-sm font-editorial-serif tracking-widest uppercase text-[#B99A61] font-semibold">
                {authorData.eyebrow}
              </span>
            </div>

            {/* Headline from PDF */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-arabic-display text-[#F7F2EA] leading-[1.25] mb-6 text-depth-arabic-title">
              {authorData.headline}
            </h2>

            {/* Primary Bio Paragraph from PDF */}
            <p className="text-base sm:text-lg lg:text-xl text-[#E5DED1]/90 font-arabic-body leading-relaxed mb-6 font-normal">
              {authorData.bioParagraph}
            </p>

            {/* Elegant Divider Line (Matching PDF Document) */}
            <div className="w-full h-[1px] bg-gradient-to-r from-[#B99A61]/40 via-[#E6CA85]/20 to-transparent my-2" />

            {/* Quote Block with Ambient Styling */}
            <div className="relative my-6 pl-4 sm:pl-6 border-r-2 border-[#B99A61] rtl:border-r-2 rtl:border-l-0 ltr:border-l-2 ltr:border-r-0">
              <Quote className="w-6 h-6 text-[#B99A61]/35 mb-2 transform -scale-x-100" />
              <p className="text-base sm:text-lg lg:text-xl text-[#F7F2EA] font-arabic-body leading-relaxed italic font-medium">
                «{authorData.quoteParagraph}»
              </p>
              
              {/* Signature from PDF */}
              <span className="block mt-4 text-sm sm:text-base font-arabic-calligraphy text-[#D8BF8A] text-depth-arabic-calligraphy font-semibold">
                {authorData.signature}
              </span>
            </div>

            {/* Practical Field Experience Badges (Demonstrating Authority Without Personal Portrait) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-2">
              {authorData.credentials.map((cred, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-[#B99A61]/25 backdrop-blur-md flex flex-col justify-between hover:border-[#B99A61]/60 transition-colors"
                >
                  <span className="text-2xl sm:text-3xl font-black font-editorial-serif text-[#E6CA85] tracking-tight mb-1 text-depth-arabic-title">
                    {cred.number}
                  </span>
                  <span className="text-xs text-[#E5DED1]/80 font-arabic-body leading-snug">
                    {cred.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Verified Official Channels Bar */}
            <div className="mt-8 pt-6 border-t border-[#B99A61]/20 flex flex-wrap items-center gap-3">
              <span className="text-xs font-editorial-serif tracking-widest text-[#B99A61] uppercase font-semibold">
                {isRtl ? 'القنوات الرسمية:' : 'OFFICIAL CHANNELS:'}
              </span>

              {/* WhatsApp */}
              <a
                href={BRAND_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-emerald-300 hover:bg-[#25D366]/20 transition-all text-xs font-semibold"
                aria-label="WhatsApp Munira Alharbi"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current text-[#25D366]" />
                <span className="font-mono text-[11px] dir-ltr">{BRAND_CONFIG.whatsapp}</span>
              </a>

              {/* Snapchat */}
              <a
                href={BRAND_CONFIG.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-[#B99A61]/25 text-[#E5DED1] hover:border-[#FFFC00] hover:text-[#FFFC00] transition-all text-xs"
                aria-label="Snapchat Munira Alharbi"
              >
                <SnapchatIcon className="w-3.5 h-3.5 fill-current" />
                <span className="font-editorial-serif text-[11px]">Snapchat</span>
              </a>

              {/* TikTok */}
              <a
                href={BRAND_CONFIG.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-[#B99A61]/25 text-[#E5DED1] hover:border-[#00F2FE] hover:text-[#00F2FE] transition-all text-xs"
                aria-label="TikTok Munira Alharbi"
              >
                <TikTokIcon className="w-3.5 h-3.5 fill-current" />
                <span className="font-editorial-serif text-[11px]">TikTok</span>
              </a>

              {/* Instagram */}
              <a
                href={BRAND_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-[#B99A61]/25 text-[#E5DED1] hover:border-[#E1306C] hover:text-[#E1306C] transition-all text-xs"
                aria-label="Instagram Munira Alharbi"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span className="font-editorial-serif text-[11px]">Instagram</span>
              </a>
            </div>

          </div>

          {/* 
            ====================================================================
            COLUMN 2: ATELIER EMBLEM & BRAND CREST (5 Cols)
            Matches the official right-hand card in the PDF document
            ====================================================================
          */}
          <div className="lg:col-span-5 flex items-center justify-center">
            
            {/* Outer Soft Ambient Glow */}
            <div className="relative w-full max-w-[360px] sm:max-w-[400px]">
              
              {/* Radial Luminous Halo */}
              <div
                className="absolute inset-0 rounded-[32px] pointer-events-none opacity-30 blur-2xl"
                style={{ background: 'radial-gradient(circle, #B99A61 0%, transparent 70%)' }}
              />

              {/* The Prestigious Atelier Monogram Plaque (Matching PDF Screenshot) */}
              <div className="relative rounded-[32px] bg-gradient-to-b from-[#221A17] via-[#1A1412] to-[#120D0C] border-2 border-[#B99A61]/50 p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-center overflow-hidden min-h-[460px] sm:min-h-[520px]">
                
                {/* Subtle Geometric Atelier Watermark in Plaque Background */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #B99A61 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Shimmer Light Reflection Sweep */}
                <div
                  className="animate-gold-shimmer absolute inset-0 w-1/2 h-[250%] -top-1/2 pointer-events-none opacity-35"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 235, 190, 0.4) 50%, transparent 100%)',
                  }}
                />

                {/* Top Subtle Seal Tag */}
                <div className="mb-auto pb-4">
                  <span className="text-[10px] font-editorial-serif tracking-[0.3em] uppercase text-[#B99A61] border-b border-[#B99A61]/30 pb-1">
                    MAISON DE COUTURE • KUWAIT
                  </span>
                </div>

                {/* Center Luxury Monogram & Wordmark (Exact Recreation of PDF Image) */}
                <div className="my-auto py-8 flex flex-col items-center">
                  
                  {/* Distinctive Haute Couture Monogram */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#2D211C] to-[#16100E] border border-[#B99A61]/60 flex items-center justify-center shadow-2xl mb-6 relative group">
                    <BrandMonogram size={56} showWordmark={false} />
                    {/* Corner Gold Notches */}
                    <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-[#E6CA85]" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t border-r border-[#E6CA85]" />
                    <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 border-b border-l border-[#E6CA85]" />
                    <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-[#E6CA85]" />
                  </div>

                  {/* Gold Foil Wordmark */}
                  <h3 className="font-editorial-serif tracking-[0.22em] text-xl sm:text-2xl font-bold text-[#F7F2EA] uppercase text-depth-arabic-title">
                    MUNIRA
                  </h3>
                  <span className="font-editorial-serif tracking-[0.28em] text-sm sm:text-base font-semibold text-[#D8BF8A] uppercase mt-1">
                    ALHARBI
                  </span>

                  <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#E6CA85] to-transparent my-5" />

                  <span className="text-xs font-arabic-display text-[#E5DED1]/75 font-medium">
                    دار ومشاغل منيرة الحربي للأزياء
                  </span>
                </div>

                {/* Bottom Authenticity Guarantee */}
                <div className="mt-auto pt-4 border-t border-[#B99A61]/25 w-full flex items-center justify-center gap-2 text-[11px] text-[#B99A61] font-editorial-serif">
                  <ShieldCheck className="w-4 h-4 text-[#B99A61]" />
                  <span>20+ YEARS OF ATELIER MASTERY</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
