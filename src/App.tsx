/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { ChallengesSection } from './components/sections/ChallengesSection';
import { ChaptersSection } from './components/sections/ChaptersSection';
import { AuthorSection } from './components/sections/AuthorSection';
import { FAQSection } from './components/sections/FAQSection';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { CheckoutView } from './components/checkout/CheckoutView';
import { MyBookModal } from './components/ui/MyBookModal';
import { AdminOrdersModal } from './components/admin/AdminOrdersModal';
import { Database } from 'lucide-react';
import { captureAttribution, trackEvent } from './lib/analytics';

function MainLayout() {
  const [currentView, setCurrentView] = useState<'landing' | 'checkout'>(() => {
    return window.location.hash === '#checkout' ? 'checkout' : 'landing';
  });
  const [isMyBookOpen, setIsMyBookOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(() => window.location.hash === '#admin');
  const { isRtl } = useLanguage();
  const { isLight } = useTheme();

  // Handle URL hash changes for deep linking and back-button friendliness
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#checkout') {
        setCurrentView('checkout');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Capture any incoming ad attribution (UTMs, gclid, fbclid, sc_click_id)
    captureAttribution();
    // Dispatch page view analytics
    trackEvent('page_view', {
      view: currentView,
      edition: 'Special Edition Fashion Guide',
      dir: isRtl ? 'rtl' : 'ltr',
    });
  }, [currentView, isRtl]);

  const handleOpenCheckout = () => {
    setCurrentView('checkout');
    window.location.hash = 'checkout';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('navigate_to_checkout', { source: 'cta_button' });
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
    if (window.location.hash === '#checkout') {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('navigate_to_landing', { source: 'checkout_header' });
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw] transition-colors duration-400 selection:bg-[#B99A61]/30 ${
        isLight
          ? 'bg-[#FAF6F0] text-[#241D1A] selection:text-[#241D1A]'
          : 'bg-[#1B1513] text-[#F7F2EA] selection:text-[#F7F2EA]'
      }`}
    >
      {/* 
        CONDITIONAL VIEW RENDERING:
        When currentView === 'checkout', render the Dedicated Full-Page Checkout View.
        Otherwise render the Main Interactive Landing Page.
      */}
      {currentView === 'checkout' ? (
        <CheckoutView
          onBackToHome={handleBackToHome}
          onOpenMyBook={() => setIsMyBookOpen(true)}
        />
      ) : (
        <>
          {/* Premium Top Navbar */}
          <Navbar
            onOpenPreorder={handleOpenCheckout}
            onOpenMyBook={() => setIsMyBookOpen(true)}
          />

          {/* Main Content Sections */}
          <main className="flex-1 overflow-x-hidden w-full">
            {/* Section 1: Cinematic Flagship Hero */}
            <HeroSection onOpenPreorder={handleOpenCheckout} />

            {/* Section 2: Interactive Challenges / Pain Points */}
            <ChallengesSection />

            {/* Section 3: Interactive Editorial Chapter Showcase */}
            <ChaptersSection onOpenPreorder={handleOpenCheckout} />

            {/* Section 4: Editorial About Author Section */}
            <AuthorSection />

            {/* Section 5: Editorial FAQ Section */}
            <FAQSection />
          </main>

          {/* Haute Couture Atelier Footer */}
          <Footer
            onOpenPreorder={handleOpenCheckout}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          {/* Floating Concierge WhatsApp Widget (+965 6907 3494) */}
          <FloatingWhatsApp />
        </>
      )}

      {/* Floating Discrete Admin Panel Trigger (Bottom Corner) */}
      <div className="fixed bottom-5 start-5 z-40">
        <button
          type="button"
          onClick={() => setIsAdminOpen(true)}
          className="group flex items-center gap-2 py-2 px-3.5 rounded-full bg-[#1A1412]/90 hover:bg-[#251D19] border border-[#B99A61]/35 hover:border-[#B99A61]/70 text-[#E6CA85] hover:text-white shadow-xl backdrop-blur-md text-xs font-mono transition-all cursor-pointer active:scale-95"
          title={isRtl ? 'لوحة إدارة طلبات وأكواد MongoDB' : 'MongoDB Orders & Codes Admin'}
        >
          <Database className="w-3.5 h-3.5 text-[#B99A61] group-hover:text-emerald-400 transition-colors" />
          <span className="font-semibold">
            {isRtl ? 'إدارة الطلبات (Admin)' : 'Orders Admin'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* "كتابي" (My Book) Reader Portal & Status Modal */}
      <MyBookModal
        isOpen={isMyBookOpen}
        onClose={() => setIsMyBookOpen(false)}
        onGoToCheckout={() => {
          setIsMyBookOpen(false);
          handleOpenCheckout();
        }}
      />

      {/* Admin Orders & Activation Codes Management Modal */}
      <AdminOrdersModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainLayout />
      </LanguageProvider>
    </ThemeProvider>
  );
}
