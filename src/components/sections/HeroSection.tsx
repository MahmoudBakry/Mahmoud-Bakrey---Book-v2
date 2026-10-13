import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Gift, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useMouseParallax } from '../../animations/useMouseParallax';
import { AnimatedBook } from '../ui/AnimatedBook';
import { KineticTypography } from '../ui/KineticTypography';
import { FashionSVGAnimation } from '../ui/FashionSVGAnimation';
import { CTAButton } from '../ui/CTAButton';
import { trackEvent } from '../../lib/analytics';
// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onOpenPreorder: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenPreorder }) => {
  const { content, isRtl, language } = useLanguage();
  const mouse = useMouseParallax();
  
  const heroRootRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLHeadingElement>(null);
  const emotionalHeadlineRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const leftAnnotationRef = useRef<HTMLDivElement>(null);
  const rightAnnotationRef = useRef<HTMLDivElement>(null);
  const ctaButtonsRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance & Stagger Reveal Animation Sequence
  useEffect(() => {
    // Respect reduced motion settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Eyebrow Badge Reveal
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: -16, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65 },
          0.1
        );
      }

      // 2. Main Title Words Stagger (3D Pop Up)
      if (titleContainerRef.current) {
        const words = titleContainerRef.current.querySelectorAll('.stagger-word');
        tl.fromTo(
          words,
          {
            opacity: 0,
            y: 30,
            rotateX: -25,
            transformOrigin: '50% 100%',
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.75,
            stagger: 0.05,
          },
          '-=0.4'
        );
      }

      // 3. Emotional Headline Reveal
      if (emotionalHeadlineRef.current) {
        tl.fromTo(
          emotionalHeadlineRef.current,
          { opacity: 0, y: 16, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 },
          '-=0.4'
        );
      }

      // 4. Asymmetric Floating Editorial Cards
      if (leftAnnotationRef.current && rightAnnotationRef.current) {
        tl.fromTo(
          [leftAnnotationRef.current, rightAnnotationRef.current],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 },
          '-=0.35'
        );
      }

      // 5. Descriptive Text Reveal
      if (descriptionRef.current) {
        tl.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.4'
        );
      }

      // 6. Action CTA Buttons Reveal
      if (ctaButtonsRef.current) {
        tl.fromTo(
          ctaButtonsRef.current,
          { opacity: 0, y: 16, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65 },
          '-=0.4'
        );
      }

      // 7. Supporting Highlights Strip
      if (highlightsRef.current) {
        const highlightItems = highlightsRef.current.querySelectorAll('.highlight-item');
        tl.fromTo(
          highlightItems,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 },
          '-=0.35'
        );
      }
    }, heroRootRef);

    return () => ctx.revert();
  }, [language]);

  const handlePrimaryCta = () => {
    trackEvent('select_buy_cta', { source: 'hero_primary' });
    onOpenPreorder();
  };

  // Split title into words for individual staggered reveal
  const titleWords = content.hero.mainTitle.split(' ');

  return (
    <section
      ref={heroRootRef}
      id="hero"
      className="relative min-h-[100dvh] w-full overflow-hidden bg-[#1C1614] select-none flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8"
      style={{
        backgroundImage: `
          radial-gradient(circle 900px at 50% 20%, rgba(245, 223, 181, 0.28) 0%, rgba(185, 154, 97, 0.2) 28%, rgba(85, 62, 55, 0.45) 55%, #1C1614 100%),
          radial-gradient(ellipse 700px 500px at 85% 60%, rgba(194, 143, 137, 0.18) 0%, transparent 60%),
          radial-gradient(ellipse 700px 500px at 15% 70%, rgba(216, 191, 138, 0.16) 0%, transparent 60%)
        `,
      }}
    >
      {/* WARM OVERHEAD STUDIO SPOTLIGHT SPILL */}
      <div
        className="absolute top-0 inset-x-0 h-[380px] pointer-events-none opacity-80 select-none z-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(245, 223, 181, 0.24) 0%, rgba(185, 154, 97, 0.1) 50%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* 1. LAYER: FASHION ATELIER SVG SKETCHES & THREADS */}
      <FashionSVGAnimation />

      {/* 2. LAYER: KINETIC TYPOGRAPHY BEHIND THE BOOK WITH SMOOTH PARALLAX */}
      <KineticTypography
        isRtl={isRtl}
        mouseX={mouse.x}
        mouseY={mouse.y}
      />

      {/* 
        3. LAYER: MAIN HERO EDITORIAL CONTENT & 3D BOOK STAGE
        Clean vertical flex flow with healthy padding so nothing ever overlaps:
        Header block -> 3D Book stage -> Editorial Copy & CTA Dock
      */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between items-center gap-6 sm:gap-8 md:gap-10">
        
        {/* TOP EDITORIAL CREST & MONUMENTAL HEADLINES */}
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center shrink-0">
          {/* Eyebrow with Luxury Gold Diamond Accents */}
          <div
            ref={eyebrowRef}
            className="inline-flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 px-3.5 sm:px-4 py-1 rounded-full bg-[#241D1A]/85 border border-[#B99A61]/40 backdrop-blur-md shadow-sm"
          >
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B99A61]" />
            <span className="text-xs sm:text-sm font-arabic-display tracking-wider text-[#D8BF8A] text-depth-arabic-eyebrow">
              {content.hero.eyebrow}
            </span>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B99A61]" />
          </div>

          {/* Main Book Title: Prominent, clear, with plenty of breathing room */}
          <h1
            ref={titleContainerRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-arabic-display tracking-tight text-[#F7F2EA] leading-[1.2] mb-2 sm:mb-2.5 text-depth-arabic-title"
          >
            {titleWords.map((word, idx) => (
              <span
                key={idx}
                className="stagger-word inline-block px-1 preserve-3d"
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Emotional Headline with Rich Calligraphic Shadow */}
          <p
            ref={emotionalHeadlineRef}
            className="text-lg sm:text-xl md:text-2xl font-arabic-calligraphy text-[#D8BF8A] tracking-normal text-depth-arabic-calligraphy"
          >
            "{content.hero.emotionalHeadline}"
          </p>
        </div>

        {/* CENTER STAGE: IMMERSIVE 3D BOOK & SIDE EDITORIAL ANNOTATIONS */}
        <div className="relative w-full flex items-center justify-center my-2 sm:my-4">
          
          {/* Left Editorial Floating Annotation (Desktop) */}
          <div
            ref={leftAnnotationRef}
            className="hidden lg:flex flex-col gap-3 absolute left-0 xl:left-6 top-1/2 -translate-y-1/2 max-w-[210px] xl:max-w-[230px] text-start z-20 pointer-events-auto"
            style={{
              transform: `translate(${mouse.x * -10}px, calc(-50% + ${mouse.y * -6}px))`,
              transition: 'transform 0.4s ease-out',
            }}
          >
            <div className="p-3.5 rounded-xl bg-[#241D1A]/90 border border-[#B99A61]/40 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-1.5 text-[#B99A61] mb-1">
                <Award className="w-3.5 h-3.5" />
                <span className="text-[10px] font-editorial-serif tracking-widest uppercase font-semibold text-depth-gold-shimmer">
                  {content.hero.editionBadge}
                </span>
              </div>
              <p className="text-[11px] text-[#E5DED1] leading-relaxed">
                {isRtl
                  ? 'رؤية عملية متكاملة من المصممة منيرة الحربي لبناء علامة كويتية وخليجية منافسة.'
                  : 'An authoritative strategic blueprint crafted to launch coveted luxury fashion houses.'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#241D1A]/70 border border-[#B99A61]/25 backdrop-blur-sm">
              <span className="text-[9px] text-[#B99A61] block mb-0.5 font-medium">
                {content.hero.authorLabel}
              </span>
              <span className="text-xs xl:text-sm font-arabic-display font-semibold text-[#F7F2EA]">
                {content.hero.authorName}
              </span>
            </div>
          </div>

          {/* THE 3D BOOK HERO OBJECT */}
          <div className="relative z-10 w-full max-w-[420px] flex justify-center items-center">
            <AnimatedBook
              isInteractive={true}
              mouseX={mouse.x}
              mouseY={mouse.y}
            />
          </div>

          {/* Right Editorial Floating Annotation: Launch Special Price (Desktop) */}
          <div
            ref={rightAnnotationRef}
            className="hidden lg:flex flex-col gap-3 absolute right-0 xl:right-6 top-1/2 -translate-y-1/2 max-w-[210px] xl:max-w-[230px] text-end z-20 pointer-events-auto"
            style={{
              transform: `translate(${mouse.x * 10}px, calc(-50% + ${mouse.y * 6}px))`,
              transition: 'transform 0.4s ease-out',
            }}
          >
            {/* Price Box */}
            <div className="p-3.5 rounded-xl bg-[#241D1A]/95 border border-[#B99A61]/45 backdrop-blur-md shadow-xl text-end">
              <span className="text-[9px] tracking-widest uppercase font-semibold text-[#B99A61] block mb-0.5">
                {isRtl ? 'قيمة الدليل الرقمي' : 'DIGITAL GUIDE ACCESS'}
              </span>
              <div className="flex items-baseline justify-end gap-2">
                <span className="text-2xl xl:text-3xl font-bold text-white font-editorial-serif text-depth-arabic-title">
                  {content.hero.priceFormatted}
                </span>
                <span className="text-xs xl:text-sm line-through text-[#8C7243] font-editorial-serif">
                  {content.hero.originalPriceFormatted}
                </span>
              </div>
              <span className="text-[11px] text-[#D8BF8A] mt-0.5 block">
                {content.hero.savingsNote}
              </span>
            </div>

            {/* VIP Consultation Bonus Badge */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#2D211C] to-[#201815] border border-[#B99A61]/50 backdrop-blur-md text-end shadow-lg">
              <div className="flex items-center justify-end gap-1.5 text-[#E5C992] mb-1">
                <span className="text-[10px] font-bold font-arabic-display">
                  {isRtl ? '🎁 أول 3 مشتركات' : '🎁 First 3 Subscribers'}
                </span>
                <Gift className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white block mb-0.5 font-arabic-display">
                {isRtl ? 'استشارة خاصة مجانية' : 'Free Private Consultation'}
              </span>
              <p className="text-[10px] text-[#D8BF8A]/90 leading-tight">
                {isRtl
                  ? 'ثم 70 د.ك تشمل الواتساب والتوصية بالمورد'
                  : 'Then 70 KWD incl. WhatsApp & supplier referral'}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: EDITORIAL COPY + SINGLE CTA DOCK + METADATA STRIP */}
        <div className="relative z-20 max-w-3xl mx-auto text-center flex flex-col items-center shrink-0 w-full">
          
          {/* Mobile Pricing Badge (visible on small devices) */}
          <div className="lg:hidden flex flex-col items-center gap-1.5 mb-3">
            <div className="flex items-center gap-2.5 p-1.5 px-3.5 rounded-lg bg-[#241D1A]/90 border border-[#B99A61]/35 backdrop-blur-md">
              <span className="text-[11px] text-[#B99A61]">
                {isRtl ? 'قيمة الدليل الرقمي:' : 'Digital Guide:'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-white font-editorial-serif text-depth-arabic-title">
                  {content.hero.priceFormatted}
                </span>
                <span className="text-[11px] line-through text-[#8C7243] font-editorial-serif">
                  {content.hero.originalPriceFormatted}
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] text-[#E5C992] px-3 py-0.5 rounded-full bg-[#B99A61]/20 border border-[#B99A61]/35 font-arabic-display">
              <Gift className="w-3 h-3 text-[#B99A61]" />
              <span>
                {isRtl ? '🎁 أول 3 مشتركات: استشارة خاصة مجانية' : '🎁 First 3: Free Private Consultation'}
              </span>
            </div>
          </div>

          {/* Description Prose - Clear & comfortably spaced */}
          <p
            ref={descriptionRef}
            className="text-xs sm:text-sm md:text-base text-[#E5DED1]/90 leading-relaxed max-w-2xl mx-auto mb-4"
          >
            {content.hero.description}
          </p>

          {/* Action CTA: Single Ultra-Clear & Attractive Button */}
          <div
            ref={ctaButtonsRef}
            className="flex items-center justify-center w-full sm:w-auto mb-4 sm:mb-5"
          >
            <CTAButton
              size="lg"
              variant="primary"
              onClick={handlePrimaryCta}
              isRtl={isRtl}
              className="w-full sm:w-auto text-sm sm:text-base px-8 sm:px-10 py-3 sm:py-3.5 shadow-xl shadow-[#B99A61]/25 hover:shadow-[#B99A61]/40"
            >
              {content.hero.primaryCTA}
            </CTAButton>
          </div>

          {/* Supporting Highlights Strip */}
          <div
            ref={highlightsRef}
            className="w-full max-w-2xl mx-auto pt-3 border-t border-[#B99A61]/20 flex flex-wrap items-center justify-center gap-y-2 gap-x-3 sm:gap-8 md:gap-10 text-xs sm:text-sm text-[#D8BF8A]"
          >
            {content.hero.highlights.map((highlight, index) => (
              <div key={index} className="highlight-item flex items-center gap-1.5 sm:gap-2">
                <span className="font-editorial-serif font-bold text-sm sm:text-base text-white tracking-wide">
                  {highlight.number}
                </span>
                <span className="text-[#E5DED1]/90 font-arabic-display font-normal text-xs sm:text-sm">
                  {highlight.label}
                </span>
                {index < content.hero.highlights.length - 1 && (
                  <span className="text-[#B99A61]/40 select-none mx-1.5 sm:mx-2 font-serif">·</span>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
