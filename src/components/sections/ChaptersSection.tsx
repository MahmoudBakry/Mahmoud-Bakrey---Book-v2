import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles, MapPin, Globe, Compass, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { CTAButton } from '../ui/CTAButton';
import { trackEvent } from '../../lib/analytics';

gsap.registerPlugin(ScrollTrigger);

interface ChaptersSectionProps {
  onOpenPreorder: () => void;
}

export const ChaptersSection: React.FC<ChaptersSectionProps> = ({ onOpenPreorder }) => {
  const { content, isRtl, language } = useLanguage();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const visualPanelRef = useRef<HTMLDivElement>(null);
  const imageParallaxRef = useRef<HTMLImageElement>(null);
  const textPanelRef = useRef<HTMLDivElement>(null);
  const directoryRef = useRef<HTMLDivElement>(null);
  const threadSvgRef = useRef<SVGSVGElement>(null);
  const tabsTrackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const chaptersData = content.chaptersShowcase.chapters;
  const currentChapter = chaptersData[activeChapterIndex] || chaptersData[0];
  const nextChapter = chaptersData[(activeChapterIndex + 1) % chaptersData.length];
  const supplierDir = content.chaptersShowcase.supplierDirectory;

  // Auto-scroll active tab into view
  useEffect(() => {
    if (tabsTrackRef.current) {
      const activeBtn = tabsTrackRef.current.children[activeChapterIndex] as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeChapterIndex]);

  // Header entrance animation & Slow-Speed Image Parallax with ScrollTrigger
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Header reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.querySelectorAll('.header-reveal'),
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Slow-Speed Editorial Image Parallax
      if (imageParallaxRef.current && visualPanelRef.current) {
        gsap.fromTo(
          imageParallaxRef.current,
          { y: -30 },
          {
            y: 30,
            ease: 'none',
            scrollTrigger: {
              trigger: visualPanelRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      // 3. Gold Couture Thread drawing
      if (threadSvgRef.current) {
        const path = threadSvgRef.current.querySelector('path');
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          });
        }
      }

      // 4. Directory card reveal
      if (directoryRef.current) {
        gsap.fromTo(
          directoryRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: directoryRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [language, activeChapterIndex]);

  // Transition animation when active chapter changes
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (textPanelRef.current && visualPanelRef.current) {
      gsap.fromTo(
        textPanelRef.current.querySelectorAll('.chapter-text-anim'),
        { opacity: 0, x: isRtl ? 20 : -20 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }
      );

      gsap.fromTo(
        visualPanelRef.current,
        { opacity: 0.7, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [activeChapterIndex, isRtl]);

  const handleNext = () => {
    setActiveChapterIndex((prev) => (prev + 1) % chaptersData.length);
  };

  const handlePrev = () => {
    setActiveChapterIndex((prev) => (prev - 1 + chaptersData.length) % chaptersData.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped Left
        if (isRtl) {
          handlePrev();
        } else {
          handleNext();
        }
      } else {
        // Swiped Right
        if (isRtl) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    touchStartX.current = null;
  };

  const handleImageError = (chapterId: string) => {
    setImageErrorMap((prev) => ({ ...prev, [chapterId]: true }));
  };

  const handleCtaClick = () => {
    trackEvent('select_buy_cta', { source: 'chapters_showcase' });
    onOpenPreorder();
  };

  return (
    <section
      ref={sectionRef}
      id="chapters"
      className="relative w-full pt-6 sm:pt-10 pb-20 sm:pb-28 overflow-hidden select-none bg-[#1B1513] text-[#F7F2EA]"
    >
      {/* 
        ========================================================================
        ATMOSPHERIC ATELIER AMBIENT LIGHT
        Pure Espresso #1B1513 base with soft Champagne Gold #B99A61 glow
        ========================================================================
      */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[340px] pointer-events-none opacity-20 blur-[100px]"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(185, 154, 97, 0.45) 0%, rgba(75, 55, 50, 0.2) 55%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Haute Couture Thread SVG Ribbon crossing the section */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
        <svg
          ref={threadSvgRef}
          className="w-full h-full"
          viewBox="0 0 1440 1000"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d={
              isRtl
                ? 'M 1440,80 C 1050,220 800,120 500,450 C 250,720 100,650 0,850'
                : 'M 0,80 C 390,220 640,120 940,450 C 1190,720 1340,650 1440,850'
            }
            stroke="url(#chapters-gold-ribbon)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="chapters-gold-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B99A61" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#E6CA85" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#C28F89" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#B99A61" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER: HIGH-CONTRAST MODERN EDITORIAL CREST */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
          <div className="header-reveal inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#241D1A]/85 border border-[#B99A61]/40 shadow-xl backdrop-blur-md text-xs font-editorial-serif tracking-[0.25em] text-[#D8BF8A] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#B99A61]" />
            <span className="font-arabic-display font-semibold">{content.chaptersShowcase.eyebrow}</span>
          </div>

          <h2 className="header-reveal text-3xl sm:text-5xl md:text-6xl font-bold font-arabic-display tracking-tight text-[#F7F2EA] leading-[1.2] mb-4 text-depth-arabic-title">
            {content.chaptersShowcase.mainHeadline}
          </h2>

          <p className="header-reveal text-sm sm:text-base md:text-lg text-[#E5DED1]/85 leading-relaxed max-w-2xl mx-auto font-arabic-body">
            {content.chaptersShowcase.supportingDescription}
          </p>
        </div>

        {/* CHAPTERS NAVIGATION TRACK (HAUTE COUTURE FLOATING DOCK) */}
        <div className="mb-8 sm:mb-12 overflow-x-auto pb-3 pt-1 scrollbar-none">
          <div
            ref={tabsTrackRef}
            className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-[#241D1A]/90 border border-[#B99A61]/30 shadow-2xl backdrop-blur-xl min-w-max mx-auto"
          >
            {chaptersData.map((ch, idx) => {
              const isActive = idx === activeChapterIndex;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`group relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full transition-all duration-300 flex items-center gap-2.5 text-xs sm:text-sm font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-[#B99A61] via-[#E6CA85] to-[#D8BF8A] text-[#1B1513] font-bold shadow-lg shadow-[#B99A61]/30 scale-[1.03] border border-[#F5DFB5]'
                      : 'text-[#E5DED1]/75 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-[#B99A61]/30'
                  }`}
                  aria-pressed={isActive}
                >
                  <span
                    className={`font-editorial-serif font-bold text-xs sm:text-sm ${
                      isActive ? 'text-[#1B1513]' : 'text-[#B99A61]'
                    }`}
                  >
                    {ch.number}
                  </span>
                  <span className="font-arabic-display whitespace-nowrap">
                    {ch.title}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B1513] animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN EDITORIAL CHAPTER SHOWCASE SPREAD (Cinema Haute Couture Look) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch rounded-3xl sm:rounded-[2rem] p-6 sm:p-10 md:p-12 relative overflow-hidden bg-gradient-to-br from-[#241D1A]/95 via-[#1F1816]/90 to-[#241D1A]/95 border border-[#B99A61]/35 backdrop-blur-2xl shadow-2xl ring-1 ring-[#B99A61]/20 ring-inset"
        >
          {/* GIGANTIC WATERMARK CHAPTER NUMBER */}
          <div
            className="absolute -top-10 -start-8 text-[180px] sm:text-[240px] md:text-[320px] font-editorial-serif font-black text-white/[0.03] pointer-events-none select-none leading-none z-0 transition-opacity duration-500"
            aria-hidden="true"
          >
            {currentChapter.number}
          </div>

          {/* LEFT: TEXT CONTENT & CHAPTER EDITORIAL CURATION */}
          <div
            ref={textPanelRef}
            className="lg:col-span-7 flex flex-col justify-between z-10 space-y-6 sm:space-y-8 order-2 lg:order-1"
          >
            <div className="space-y-5">
              {/* Category Kicker & Index */}
              <div className="chapter-text-anim flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B1513]/90 border border-[#B99A61]/40 text-[#D8BF8A] text-xs font-editorial-serif font-bold tracking-widest uppercase shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-[#B99A61] animate-pulse" />
                  <span>{isRtl ? `الفصل ${currentChapter.number} من 07` : `CHAPTER ${currentChapter.number} OF 07`}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#B99A61] font-arabic-display font-semibold px-3 py-1 rounded-full bg-[#B99A61]/10 border border-[#B99A61]/25">
                  <Sparkles className="w-3 h-3 text-[#B99A61]" />
                  {currentChapter.tag}
                </span>
              </div>

              {/* Main Chapter Title */}
              <h3 className="chapter-text-anim text-2xl sm:text-4xl md:text-5xl font-bold font-arabic-display text-[#F7F2EA] leading-[1.25] text-depth-arabic-title">
                {currentChapter.title}
              </h3>

              {/* Subtitle in Warm Calligraphy with Accent Bar */}
              <div className="chapter-text-anim border-s-2 border-[#B99A61] ps-4 py-0.5">
                <p className="text-base sm:text-xl font-arabic-calligraphy text-[#D8BF8A] leading-relaxed">
                  "{currentChapter.subtitle}"
                </p>
              </div>

              {/* Detailed Chapter Blueprint Description */}
              <p className="chapter-text-anim text-sm sm:text-base md:text-lg text-[#E5DED1]/90 leading-relaxed font-arabic-body">
                {currentChapter.description}
              </p>

              {/* Practical Venture Impact Box */}
              <div className="chapter-text-anim p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1B1513]/95 to-[#241D1A]/85 border border-[#B99A61]/35 flex items-start gap-3.5 shadow-xl backdrop-blur-md">
                <div className="p-2 rounded-xl bg-[#B99A61]/15 border border-[#B99A61]/30 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#E6CA85]" />
                </div>
                <div className="text-xs sm:text-sm text-[#E5DED1] leading-relaxed font-arabic-display">
                  <span className="text-[#D8BF8A] font-bold block mb-1">
                    {isRtl ? 'الأثر العملي لمشروعك:' : 'Practical Venture Impact:'}
                  </span>
                  {isRtl
                    ? 'خطوات منهجية عملية ومجربة تمنع الهدر المالي وتختصر سنوات من التجربة والخطأ في السوق الكويتي والخليجي.'
                    : 'Systematic frameworks preventing capital misallocation, shaving years off trial-and-error in regional fashion business.'}
                </div>
              </div>
            </div>

            {/* ULTRA-MODERN INTERACTIVE SLIDER CONTROLS BAR */}
            <div className="pt-6 border-t border-[#B99A61]/25 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              {/* Stepper info & Interactive Segmented Track */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="font-editorial-serif text-xl sm:text-2xl font-bold text-white leading-none">
                    {currentChapter.number}
                  </span>
                  <span className="font-editorial-serif text-xs text-[#B99A61]/50 font-bold">
                    / 07
                  </span>
                </div>

                {/* 7-Segmented Interactive Scrubber */}
                <div className="flex items-center gap-1.5 flex-1 max-w-[220px] sm:max-w-[260px]" role="tablist" aria-label="Chapter progress">
                  {chaptersData.map((_, idx) => {
                    const isPast = idx < activeChapterIndex;
                    const isCurrent = idx === activeChapterIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveChapterIndex(idx)}
                        className="group/segment relative flex-1 h-3 py-1 flex items-center focus:outline-none"
                        title={isRtl ? `الانتقال إلى الفصل ${idx + 1}` : `Go to Chapter ${idx + 1}`}
                        aria-label={`Chapter ${idx + 1}`}
                        aria-selected={isCurrent}
                      >
                        <span
                          className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                            isCurrent
                              ? 'bg-gradient-to-r from-[#B99A61] via-[#E6CA85] to-[#D8BF8A] shadow-md shadow-[#B99A61]/50 h-2'
                              : isPast
                              ? 'bg-[#B99A61]/80 hover:bg-[#B99A61]'
                              : 'bg-[#B99A61]/20 hover:bg-[#B99A61]/45'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Teaser + Tactile Navigation Circles */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                {/* Next chapter subtle teaser */}
                <div className="hidden sm:flex flex-col text-start pe-1 max-w-[150px]">
                  <span className="text-[10px] font-editorial-serif tracking-widest text-[#B99A61] uppercase font-bold">
                    {isRtl ? 'التالي' : 'NEXT'}
                  </span>
                  <span className="text-xs font-arabic-display text-[#E5DED1]/85 truncate font-medium">
                    {nextChapter.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-11 h-11 rounded-full bg-[#1B1513]/90 border border-[#B99A61]/35 text-[#D8BF8A] hover:text-white hover:bg-[#241D1A] hover:border-[#B99A61]/60 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md flex items-center justify-center focus:outline-none"
                    aria-label="Previous Chapter"
                  >
                    <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-11 h-11 rounded-full bg-gradient-to-r from-[#B99A61] via-[#E6CA85] to-[#D8BF8A] text-[#1B1513] font-bold hover:shadow-lg hover:shadow-[#B99A61]/35 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none"
                    aria-label="Next Chapter"
                  >
                    <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: EDITORIAL FASHION PHOTOGRAPHY VISUAL */}
          <div
            ref={visualPanelRef}
            className="lg:col-span-5 relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[3/4] max-h-[520px] lg:max-h-none border border-[#B99A61]/40 shadow-2xl z-10 order-1 lg:order-2 group bg-[#1B1513] ring-1 ring-[#B99A61]/30 ring-inset"
          >
            {/* High-Fidelity Fashion Visual Image */}
            {!imageErrorMap[currentChapter.id] ? (
              <img
                ref={imageParallaxRef}
                src={currentChapter.image}
                alt={currentChapter.title}
                onError={() => handleImageError(currentChapter.id)}
                referrerPolicy="no-referrer"
                className="w-full h-[116%] -top-[8%] relative object-cover object-center filter brightness-[0.9] contrast-[1.1] will-change-transform transition-[scale] duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              /* Fallback Container */
              <div
                className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#241D1A] to-[#1B1513]"
              >
                <BookOpen className="w-12 h-12 text-[#B99A61] mb-4" />
                <span className="font-editorial-serif text-3xl font-bold text-white mb-2">
                  {currentChapter.number}
                </span>
                <span className="font-arabic-display text-lg text-[#D8BF8A]">
                  {currentChapter.title}
                </span>
              </div>
            )}

            {/* Gradient Scrim for Legibility & Cinema Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(27, 21, 19, 0.9) 0%, rgba(27, 21, 19, 0.25) 45%, transparent 80%)',
              }}
            />

            {/* Corner Editorial Stamp */}
            <div className="absolute top-4 end-4 px-3.5 py-1.5 rounded-full bg-[#1B1513]/90 backdrop-blur-md border border-[#B99A61]/40 text-[10px] font-editorial-serif tracking-widest text-[#D8BF8A] uppercase font-bold shadow-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B99A61]" />
              <span>Munira Alharbi Atelier</span>
            </div>

            {/* Bottom Floating Visual Caption */}
            <div className="absolute bottom-4 inset-x-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#1B1513]/90 backdrop-blur-md border border-[#B99A61]/35 shadow-xl">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-editorial-serif tracking-widest uppercase text-[#B99A61] font-bold">
                  {isRtl ? 'محور تطبيقي معتمد' : 'CURATED PRACTICAL PILLAR'}
                </span>
                <span className="text-[11px] font-editorial-serif text-[#D8BF8A] font-bold">
                  {currentChapter.number} / 07
                </span>
              </div>
              <span className="text-xs sm:text-sm font-arabic-display font-semibold text-[#F7F2EA] truncate block">
                {currentChapter.title} — {currentChapter.subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* 4. BONUS CONTENT: SUPPLIER DIRECTORY CONCLUDING HIGHLIGHT */}
        <div
          ref={directoryRef}
          className="mt-14 sm:mt-20 p-8 sm:p-12 rounded-3xl bg-[#241D1A]/90 border border-[#B99A61]/40 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle gold shimmer top line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#B99A61] to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 8 Cols: Directory Info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1B1513] border border-[#B99A61]/40 text-xs font-editorial-serif tracking-wider text-[#D8BF8A]">
                <Sparkles className="w-3.5 h-3.5 text-[#B99A61]" />
                <span>{supplierDir.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-arabic-display text-white text-depth-arabic-title">
                {supplierDir.title}
              </h3>

              <div className="flex items-center gap-2 text-sm sm:text-base font-editorial-serif tracking-widest text-[#D8BF8A] font-semibold">
                <Globe className="w-4 h-4 text-[#B99A61]" />
                <span>{supplierDir.subtitle}</span>
              </div>

              <p className="text-sm sm:text-base text-[#E5DED1]/85 leading-relaxed max-w-2xl font-arabic-body">
                {supplierDir.description}
              </p>

              {/* Markets pills */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                {supplierDir.markets.map((market, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1B1513] border border-[#B99A61]/35 shadow-sm text-[#F7F2EA]">
                    <MapPin className="w-3.5 h-3.5 text-[#B99A61]" />
                    <span className="font-arabic-display font-medium">{market}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 Cols: CTA Action Dock */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center pt-6 lg:pt-0 border-t lg:border-t-0 border-[#B99A61]/25">
              <div className="text-center lg:text-end mb-4">
                <span className="text-xs text-[#E5DED1]/70 block mb-1 font-arabic-display">
                  {isRtl ? 'قيمة الدليل الرقمي الكامل' : 'Full Digital Guide Access'}
                </span>
                <span className="text-2xl font-bold font-editorial-serif text-white text-depth-arabic-title">
                  50 {isRtl ? 'د.ك' : 'KWD'}
                </span>
                <span className="text-[11px] text-[#B99A61] block mt-0.5 font-medium">
                  {isRtl ? '🎁 أول 3 مشتركات يحصلن على استشارة مجانية' : '🎁 Free consultation for first 3 buyers'}
                </span>
              </div>

              <CTAButton
                variant="primary"
                size="lg"
                onClick={handleCtaClick}
                isRtl={isRtl}
                className="w-full sm:w-auto text-sm px-8 py-3.5 shadow-xl shadow-[#B99A61]/25 hover:shadow-[#B99A61]/40"
              >
                {content.chaptersShowcase.ctaButtonText}
              </CTAButton>

              <span className="text-[11px] text-[#D8BF8A]/70 mt-2 text-center lg:text-end block font-arabic-display">
                {content.chaptersShowcase.ctaSubtext}
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
