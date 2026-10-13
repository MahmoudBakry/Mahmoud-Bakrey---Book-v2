/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { ChallengesSection } from './components/sections/ChallengesSection';
import { ChaptersSection } from './components/sections/ChaptersSection';
import { BookPreviewSection } from './components/sections/BookPreviewSection';
import { AuthorSection } from './components/sections/AuthorSection';
import { FAQSection } from './components/sections/FAQSection';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { BookReader } from './components/reader/BookReader';
import { PreorderDrawer } from './components/ui/PreorderDrawer';
import { captureAttribution, trackEvent } from './lib/analytics';

function MainLayout() {
  const [isPreorderOpen, setIsPreorderOpen] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const savedScrollY = useRef(0);
  const { isRtl } = useLanguage();
  const { isLight } = useTheme();

  const handleOpenReader = () => {
    savedScrollY.current = window.scrollY;
    setIsReaderOpen(true);
    trackEvent('open_book_reader_demo', {
      source: 'preview_button',
    });
  };

  const handleCloseReader = () => {
    setIsReaderOpen(false);
    // Faithfully restore scroll position to previous state
    setTimeout(() => {
      window.scrollTo({ top: savedScrollY.current, behavior: 'instant' });
    }, 20);
  };

  useEffect(() => {
    // Capture any incoming ad attribution (UTMs, gclid, fbclid, sc_click_id)
    captureAttribution();
    // Dispatch page view analytics
    trackEvent('page_view', {
      page: 'chapters_phase_3',
      edition: 'Special Edition Fashion Guide',
      dir: isRtl ? 'rtl' : 'ltr',
    });
  }, [isRtl]);

  return (
    <>
      {/* Full-Screen Dedicated Interactive Book Reader View */}
      {isReaderOpen && (
        <BookReader onClose={handleCloseReader} />
      )}

      {/* Main Landing Page (Hidden when reader is open to preserve DOM and exact scroll position) */}
      <div
        className={`relative min-h-screen flex flex-col transition-colors duration-400 selection:bg-[#B99A61]/30 ${
          isReaderOpen ? 'hidden' : ''
        } ${
          isLight
            ? 'bg-[#FAF6F0] text-[#241D1A] selection:text-[#241D1A]'
            : 'bg-[#1B1513] text-[#F7F2EA] selection:text-[#F7F2EA]'
        }`}
      >
        {/* Premium Top Navbar */}
        <Navbar onOpenPreorder={() => setIsPreorderOpen(true)} />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* Section 1: Cinematic Flagship Hero */}
          <HeroSection onOpenPreorder={() => setIsPreorderOpen(true)} />

          {/* Section 2: Interactive Challenges / Pain Points */}
          <ChallengesSection />

          {/* Section 3: Interactive Editorial Chapter Showcase */}
          <ChaptersSection onOpenPreorder={() => setIsPreorderOpen(true)} />

          {/* Section 4: Cinematic Interactive Book Preview */}
          <BookPreviewSection
            onOpenPreorder={() => setIsPreorderOpen(true)}
            onOpenReader={handleOpenReader}
          />

          {/* Section 5: Editorial About Author Section */}
          <AuthorSection />

          {/* Section 6: Editorial FAQ Section */}
          <FAQSection onOpenReader={handleOpenReader} />
        </main>

        {/* Haute Couture Atelier Footer */}
        <Footer onOpenPreorder={() => setIsPreorderOpen(true)} />

        {/* Floating Concierge WhatsApp Widget (+965 6907 3494) */}
        <FloatingWhatsApp />

        {/* Conversion-Focused Checkout & Priority Reservation Drawer */}
        <PreorderDrawer
          isOpen={isPreorderOpen}
          onClose={() => setIsPreorderOpen(false)}
        />
      </div>
    </>
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
