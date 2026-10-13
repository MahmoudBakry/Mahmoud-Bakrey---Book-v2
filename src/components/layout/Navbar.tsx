import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronLeft, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { NAVIGATION_ITEMS } from '../../config/navigation';
import { BRAND_CONFIG } from '../../config/brand';
import { BrandMonogram } from '../ui/BrandMonogram';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ThemeToggle } from '../ui/ThemeToggle';
import { CTAButton } from '../ui/CTAButton';
import { WhatsAppIcon } from '../ui/SocialIcons';
import { trackEvent } from '../../lib/analytics';

interface NavbarProps {
  onOpenPreorder: () => void;
  onOpenMyBook?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPreorder, onOpenMyBook }) => {
  const { content, isRtl, language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    trackEvent('select_buy_cta', { source: 'navbar' });
    onOpenPreorder();
  };

  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#140E0C]/95 backdrop-blur-xl border-b border-[#B99A61]/25 py-2.5 sm:py-3 shadow-2xl shadow-black/50'
            : 'bg-transparent py-4 sm:py-5 md:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            
            {/* ZONE 1: BRAND LOGO & WORDMARK */}
            <a
              href="#hero"
              className="flex items-center gap-2.5 shrink-0 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B99A61]"
              aria-label="Munira Alharbi Home"
            >
              <BrandMonogram size={32} showWordmark={true} />
            </a>

            {/* ZONE 2: DESKTOP NAVIGATION LINKS */}
            <nav
              className="hidden lg:flex items-center gap-7 xl:gap-8 text-xs xl:text-sm font-medium tracking-wide text-[#E5DED1]"
              aria-label="Main Navigation"
            >
              {NAVIGATION_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="relative py-1 whitespace-nowrap hover:text-[#B99A61] transition-colors duration-200 group cursor-pointer"
                >
                  <span>{item.label[language]}</span>
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B99A61] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                </a>
              ))}
            </nav>

            {/* ZONE 3: ACTIONS & CONTROLS */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Theme Toggle (Desktop only) */}
              <ThemeToggle className="hidden lg:inline-flex" />

              {/* "كتابي" (My Book) Reader Portal Access */}
              <button
                type="button"
                onClick={() => {
                  trackEvent('click_my_book', { source: 'navbar_desktop' });
                  onOpenMyBook?.();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#B99A61]/15 hover:bg-[#B99A61]/30 border border-[#B99A61]/50 text-[#E6CA85] hover:text-white transition-all duration-200 text-xs font-arabic-display font-semibold cursor-pointer active:scale-95 shadow-sm"
                aria-label={isRtl ? 'استعراض كتابي' : 'My Book'}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#E6CA85]" />
                <span>{isRtl ? 'كتابي' : 'My Book'}</span>
              </button>

              {/* Language Switcher (Visible on both Desktop and Mobile Header) */}
              <LanguageSwitcher />

              {/* Primary Buy CTA (Desktop only >= 1024px - Mobile has it inside the Side Menu to avoid cramming) */}
              <CTAButton
                variant="navbar"
                onClick={handleCtaClick}
                isRtl={isRtl}
                className="hidden lg:inline-flex text-xs px-4 py-2"
              >
                {content.nav.ctaButton}
              </CTAButton>

              {/* Prominent High-Visibility Mobile Hamburger Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#241D1A]/95 hover:bg-[#B99A61]/25 border border-[#B99A61]/60 hover:border-[#E6CA85] text-[#E6CA85] hover:text-[#FFF] transition-all duration-200 shadow-md active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B99A61]"
                aria-expanded={mobileMenuOpen}
                aria-label={isRtl ? 'فتح القائمة الرئيسية' : 'Open Navigation Menu'}
              >
                <Menu className="w-4 h-4 text-[#E6CA85]" />
                <span className="text-xs font-bold font-arabic-display text-[#F7F2EA]">
                  {isRtl ? 'القائمة' : 'Menu'}
                </span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 
        ========================================================================
        FULL-SCREEN LUXURY MOBILE NAVIGATION DRAWER
        ========================================================================
      */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 w-full h-full min-h-[100dvh] bg-[#140E0C]/98 backdrop-blur-2xl text-[#F7F2EA] flex flex-col justify-between p-5 sm:p-7 overflow-y-auto animate-fullscreen-drawer select-none"
          role="dialog"
          aria-modal="true"
          aria-label={isRtl ? 'القائمة الرئيسية للتنقل' : 'Main Navigation Menu'}
        >
          {/* Subtle Ambient Radial Gold Glow */}
          <div
            className="absolute top-0 right-0 w-[360px] h-[360px] pointer-events-none opacity-25 blur-[100px] -z-10"
            style={{
              background: 'radial-gradient(circle, rgba(185, 154, 97, 0.45) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 w-[300px] h-[300px] pointer-events-none opacity-15 blur-[90px] -z-10"
            style={{
              background: 'radial-gradient(circle, rgba(185, 154, 97, 0.35) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* Top Zone: Header with Brand & Close Button */}
          <div className="w-full">
            <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-[#B99A61]/25">
              <BrandMonogram size={32} showWordmark={true} />
              
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-[#B99A61] border border-[#B99A61]/40 hover:border-[#E6CA85] flex items-center justify-center text-[#E6CA85] hover:text-[#140E0C] transition-all duration-200 cursor-pointer active:scale-90 shadow-md"
                aria-label={isRtl ? 'إغلاق القائمة' : 'Close Menu'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Strip: Prominent Language Switcher & Theme Controls */}
            <div className="py-3.5 sm:py-4 border-b border-[#B99A61]/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="text-[11px] font-editorial-serif tracking-widest text-[#B99A61] uppercase font-semibold">
                  {isRtl ? 'اللغة' : 'Language'}:
                </span>
                <LanguageSwitcher />
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="text-[11px] font-editorial-serif tracking-widest text-[#B99A61] uppercase font-semibold">
                  {isRtl ? 'المظهر' : 'Theme'}:
                </span>
                <ThemeToggle />
              </div>
            </div>

            {/* Navigation Links List */}
            <nav className="py-4 sm:py-5 flex flex-col space-y-2 sm:space-y-2.5" aria-label="Mobile Navigation Links">
              {/* Highlighted "كتابي" Portal Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  trackEvent('click_my_book', { source: 'navbar_mobile_drawer' });
                  onOpenMyBook?.();
                }}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#B99A61]/25 via-[#241D1A] to-[#1D1715] border border-[#B99A61]/50 text-[#E6CA85] hover:text-white cursor-pointer active:scale-[0.99] transition-all text-start shadow-md mb-1"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#B99A61]/25 border border-[#B99A61]/40 flex items-center justify-center text-[#E6CA85] shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-arabic-display font-bold text-sm sm:text-base text-white">
                      {isRtl ? 'كتابي (استعراض المحتوى)' : 'My Book (Reader Access)'}
                    </span>
                    <span className="block text-[10px] sm:text-xs text-[#D8BF8A]">
                      {isRtl ? 'حالة التفعيل والوصول إلى الفصول' : 'Activation & Access Status'}
                    </span>
                  </div>
                </div>
                <ChevronIcon className="w-4 h-4 text-[#E6CA85]" />
              </button>
              {NAVIGATION_ITEMS.map((item, idx) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-[#241D1A]/90 border border-[#B99A61]/15 hover:border-[#B99A61]/50 transition-all duration-200 text-[#F7F2EA] hover:text-[#E6CA85] cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <span className="w-7 text-xs sm:text-sm font-editorial-serif font-bold text-[#B99A61]/70 group-hover:text-[#E6CA85] transition-colors">
                      0{idx + 1}
                    </span>
                    <span className="font-arabic-display font-semibold text-base sm:text-lg">
                      {item.label[language]}
                    </span>
                  </div>
                  <ChevronIcon className="w-4 h-4 text-[#B99A61]/50 group-hover:text-[#E6CA85] transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </a>
              ))}
            </nav>
          </div>

          {/* Bottom Zone: Big Primary CTA Button & Direct WhatsApp */}
          <div className="pt-4 sm:pt-5 border-t border-[#B99A61]/25 flex flex-col space-y-3 mt-4">
            {/* Primary CTA Button */}
            <button
              type="button"
              onClick={handleCtaClick}
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#B99A61] via-[#E6CA85] to-[#B99A61] text-[#140F0D] font-extrabold font-arabic-display text-sm sm:text-base shadow-xl shadow-[#B99A61]/25 flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all border border-[#FFF0D0]"
            >
              <span>{content.nav.ctaButton}</span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#140F0D]/20 text-[#140F0D] font-mono font-bold">
                {content.hero.priceFormatted}
              </span>
            </button>

            {/* Direct WhatsApp Concierge Button */}
            <a
              href={BRAND_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-5 rounded-full bg-[#25D366]/15 border border-[#25D366]/35 text-emerald-300 hover:bg-[#25D366]/25 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer active:scale-98"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current text-[#25D366]" />
              <span>{isRtl ? 'استفسار فوري عبر الواتساب (+965)' : 'Direct WhatsApp Concierge'}</span>
            </a>

            <span className="text-[10px] text-center text-[#D8BF8A]/60 font-editorial-serif tracking-widest uppercase pt-1">
              MUNIRA ALHARBI • THE FASHION BUSINESS SUCCESS GUIDE
            </span>
          </div>

        </div>
      )}
    </>
  );
};
