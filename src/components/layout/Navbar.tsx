import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { NAVIGATION_ITEMS } from '../../config/navigation';
import { BrandMonogram } from '../ui/BrandMonogram';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ThemeToggle } from '../ui/ThemeToggle';
import { CTAButton } from '../ui/CTAButton';
import { trackEvent } from '../../lib/analytics';

interface NavbarProps {
  onOpenPreorder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPreorder }) => {
  const { content, isRtl, language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#09090B]/90 backdrop-blur-xl border-b border-white/[0.08] py-3 shadow-2xl shadow-black/30'
          : 'bg-transparent py-5 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          
          {/* ZONE 1: BRAND LOGO & WORDMARK */}
          <a
            href="#hero"
            className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B99A61]"
            aria-label="Munira Alharbi Home"
          >
            <BrandMonogram size={34} showWordmark={true} />
          </a>

          {/* ZONE 2: 4-5 CONCISE SINGLE-LINE NAVIGATION LINKS (DESKTOP) */}
          <nav
            className="hidden lg:flex items-center gap-8 text-xs xl:text-sm font-medium tracking-wide text-[#E5DED1]"
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
                className="relative py-1 whitespace-nowrap hover:text-[#B99A61] transition-colors duration-200 group"
              >
                <span>{item.label[language]}</span>
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B99A61] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </a>
            ))}
          </nav>

          {/* ZONE 3: THEME TOGGLE + LANGUAGE SWITCHER + 1 PRIMARY ACTION (CTA) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Toggle (Light / Dark mode switch) */}
            <ThemeToggle />

            {/* Simplified & Modern Language Switcher */}
            <LanguageSwitcher className="hidden sm:inline-flex" />

            {/* Simple & Attractive Primary Buy CTA */}
            <CTAButton
              variant="navbar"
              onClick={handleCtaClick}
              isRtl={isRtl}
            >
              {content.nav.ctaButton}
            </CTAButton>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-[#E5DED1] hover:text-[#B99A61] hover:bg-[#241D1A]/50 transition-colors focus:outline-none"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-[#1A1412]/98 border-b border-[#B99A61]/30 backdrop-blur-xl px-6 py-8 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-5">
            <div className="pb-3 border-b border-[#B99A61]/15 flex items-center justify-between">
              <span className="text-xs text-[#B99A61] font-editorial-serif tracking-widest uppercase">
                {isRtl ? 'القائمة الرئيسية' : 'NAVIGATION'}
              </span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>

            {NAVIGATION_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-base font-medium text-[#F7F2EA] hover:text-[#B99A61] transition-colors py-1 flex items-center justify-between"
              >
                <span>{item.label[language]}</span>
                <span className="text-[#B99A61]/40 text-xs font-editorial-serif">
                  {item.id === 'home' ? '01' : item.id === 'about' ? '02' : item.id === 'chapters' ? '03' : item.id === 'author' ? '04' : '05'}
                </span>
              </a>
            ))}

            <div className="pt-4 border-t border-[#B99A61]/20">
              <CTAButton
                variant="navbar"
                onClick={handleCtaClick}
                isRtl={isRtl}
                className="w-full text-center py-3 text-sm font-bold"
              >
                {content.nav.ctaButton} — {content.hero.priceFormatted}
              </CTAButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
