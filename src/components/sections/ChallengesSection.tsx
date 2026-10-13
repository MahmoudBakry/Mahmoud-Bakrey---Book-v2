import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  ArrowDown,
  TrendingUp,
  Store,
  Layers,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Compass,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

export const ChallengesSection: React.FC = () => {
  const { content, isRtl, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | '01' | '02' | '03'>('all');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ [key: number]: { x: number; y: number } }>({});

  const sectionRef = useRef<HTMLElement>(null);
  const transitionBridgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const challenges = content.challenges.items;

  // Handle card mouse spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos((prev) => ({
      ...prev,
      [index]: { x, y },
    }));
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Seamless Bridge Ambient Entrance
      if (transitionBridgeRef.current) {
        gsap.fromTo(
          transitionBridgeRef.current.querySelectorAll('.bridge-elem'),
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: transitionBridgeRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Main Editorial Headline Stagger Reveal
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current.querySelectorAll('.reveal-elem'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. Ultra-Modern Cards 3D Entrance Reveal
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.challenge-card-item');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 55, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section
      ref={sectionRef}
      id="about-guide"
      className="relative w-full pt-8 sm:pt-12 pb-16 sm:pb-20 overflow-hidden select-none bg-[#1B1513] text-[#F7F2EA]"
    >
      {/* 
        ========================================================================
        ATMOSPHERIC ATELIER AMBIENT GLOW
        ========================================================================
      */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] pointer-events-none opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(185, 154, 97, 0.45) 0%, rgba(75, 55, 50, 0.2) 60%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Floating Couture Gold Thread Background Accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 800"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d={
              isRtl
                ? 'M 1440,100 C 1100,280 750,80 400,450 C 180,680 50,600 0,750'
                : 'M 0,100 C 340,280 690,80 1040,450 C 1260,680 1390,600 1440,750'
            }
            stroke="url(#challenges-gold-ribbon)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          <defs>
            <linearGradient id="challenges-gold-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B99A61" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#E6CA85" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#B99A61" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 
        ========================================================================
        EDITORIAL SECTION KICKER BADGE
        ========================================================================
      */}
      <div
        ref={transitionBridgeRef}
        className="relative z-20 mb-8 sm:mb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="bridge-elem inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#241D1A]/85 border border-[#B99A61]/40 shadow-xl backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#B99A61]" />
          <span className="text-xs sm:text-sm font-arabic-display tracking-wide text-[#D8BF8A] font-semibold">
            {isRtl ? 'المحطة الثانية: تفكيك تحديات السوق' : 'Phase 02: Deconstructing Industry Realities'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#B99A61]" />
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER: HIGH-CONTRAST MONUMENTAL EDITORIAL */}
        <div ref={headlineRef} className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          {/* Section Eyebrow */}
          <div className="reveal-elem inline-flex items-center gap-2 mb-3.5 px-3.5 py-1 rounded-full bg-[#241D1A]/60 border border-[#B99A61]/25 text-xs font-editorial-serif tracking-[0.2em] text-[#B99A61] uppercase">
            <span className="font-arabic-display font-bold">{content.challenges.eyebrow}</span>
          </div>

          {/* Monumental Headline in Pure Luxury Ivory */}
          <h2 className="reveal-elem text-3xl sm:text-5xl md:text-6xl font-bold font-arabic-display tracking-tight text-[#F7F2EA] leading-[1.18] mb-4 text-depth-arabic-title">
            {content.challenges.mainHeadline}
          </h2>

          {/* Supporting Headline in Warm Radiant Calligraphy */}
          <p className="reveal-elem text-xl sm:text-2xl md:text-3xl font-arabic-calligraphy text-[#D8BF8A] mb-5">
            "{content.challenges.supportingHeadline}"
          </p>

          {/* Intro Prose in Soft Ivory Sand */}
          <p className="reveal-elem text-sm sm:text-base md:text-lg text-[#E5DED1]/85 leading-relaxed max-w-2xl mx-auto font-arabic-body">
            {content.challenges.introText}
          </p>

          {/* Interactive Modern Pill Filter Controls */}
          <div className="reveal-elem flex items-center justify-center gap-2 mt-8 flex-wrap">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-arabic-display font-medium transition-all duration-300 ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-[#B99A61] to-[#D8BF8A] text-[#1B1513] font-bold shadow-lg shadow-[#B99A61]/25 scale-105 border border-[#E6CA85]'
                  : 'bg-[#241D1A]/80 hover:bg-[#2A221E] text-[#E5DED1]/80 hover:text-white border border-[#B99A61]/25 hover:border-[#B99A61]/50 backdrop-blur-md shadow-sm'
              }`}
            >
              {isRtl ? 'جميع التحديات الثلاثة' : 'All Three Challenges'}
            </button>
            {challenges.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveFilter(ch.number as '01' | '02' | '03')}
                className={`px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-arabic-display font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  activeFilter === ch.number
                    ? 'bg-gradient-to-r from-[#B99A61] to-[#D8BF8A] text-[#1B1513] font-bold shadow-lg shadow-[#B99A61]/25 scale-105 border border-[#E6CA85]'
                    : 'bg-[#241D1A]/80 hover:bg-[#2A221E] text-[#E5DED1]/80 hover:text-white border border-[#B99A61]/25 hover:border-[#B99A61]/50 backdrop-blur-md shadow-sm'
                }`}
              >
                <span className={`font-editorial-serif font-bold text-xs ${activeFilter === ch.number ? 'text-[#1B1513]' : 'text-[#B99A61]'}`}>
                  {ch.number}
                </span>
                <span>{ch.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 
          ========================================================================
          ULTRA-MODERN 3-CARD EDITORIAL SHOWCASE (Haute Dark Couture Cards)
          ========================================================================
        */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {challenges.map((ch, idx) => {
            const isVisible = activeFilter === 'all' || activeFilter === ch.number;
            const isHovered = hoveredCard === idx;
            const pos = mousePos[idx] || { x: 0, y: 0 };

            if (!isVisible) return null;

            return (
              <div
                key={ch.id}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                className={`challenge-card-item group relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 transition-all duration-500 overflow-hidden cursor-default ${
                  isHovered
                    ? '-translate-y-2 shadow-[0_25px_50px_rgba(185,154,97,0.18)] border-[#B99A61]/80'
                    : 'shadow-xl border-[#B99A61]/30 hover:border-[#B99A61]/60'
                } bg-[#241D1A]/90 backdrop-blur-xl border`}
                style={{
                  background: isHovered
                    ? `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(42,34,30,0.98), rgba(36,29,26,0.95))`
                    : 'rgba(36, 29, 26, 0.88)',
                }}
              >
                {/* Luminous Mouse-Follow Ambient Spotlight Glow */}
                <div
                  className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(185, 154, 97, 0.15), transparent 60%)`,
                  }}
                  aria-hidden="true"
                />

                {/* Oversized Background Watermark Numeral */}
                <div
                  className="absolute -bottom-6 -right-4 font-editorial-serif font-black text-[120px] text-white/[0.03] select-none pointer-events-none leading-none transition-transform duration-700 group-hover:scale-110 group-hover:text-[#B99A61]/[0.08]"
                  aria-hidden="true"
                >
                  {ch.number}
                </div>

                {/* TOP ROW: Badge, Category, and Index */}
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-t-0 border-b border-[#B99A61]/20">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#1B1513] text-[#D8BF8A] border border-[#B99A61]/40 flex items-center justify-center font-editorial-serif font-bold text-sm shadow-md group-hover:bg-[#B99A61] group-hover:text-[#1B1513] transition-colors duration-300">
                        {ch.number}
                      </div>
                      <span className="text-xs font-arabic-display font-semibold text-[#D8BF8A] tracking-wide">
                        {ch.category}
                      </span>
                    </div>

                    {/* Micro-Icon */}
                    <div className="w-8 h-8 rounded-full bg-[#1B1513] border border-[#B99A61]/30 flex items-center justify-center text-[#B99A61] group-hover:border-[#B99A61]/70 transition-colors">
                      {idx === 0 && <DollarSign className="w-4 h-4" />}
                      {idx === 1 && <Layers className="w-4 h-4" />}
                      {idx === 2 && <Store className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Primary Question (The Core Pain Point) */}
                  <h3 className="text-xl sm:text-2xl font-bold font-arabic-display text-[#F7F2EA] leading-snug mb-3.5 group-hover:text-[#D8BF8A] transition-colors">
                    "{ch.question}"
                  </h3>

                  {/* Supporting Dilemma Copy */}
                  <p className="text-sm sm:text-base text-[#E5DED1]/80 leading-relaxed mb-6 font-arabic-body">
                    {ch.supporting}
                  </p>
                </div>

                {/* 
                  ==============================================================
                  INTERACTIVE BESPOKE MICRO-WIDGET FOR EACH CHALLENGE
                  ==============================================================
                */}
                <div className="my-2 space-y-4">
                  {/* Card 01: Pricing Architecture Breakdown */}
                  {idx === 0 && (
                    <div className="p-4 rounded-2xl bg-[#1B1513]/90 border border-[#B99A61]/30 shadow-inner">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#E5DED1] mb-2 font-arabic-display">
                        <span>{isRtl ? 'هيكلة السعر الاحترافي' : 'Pricing Architecture'}</span>
                        <span className="text-[#D8BF8A] font-editorial-serif font-bold">100% Value</span>
                      </div>
                      {/* Visual Formula Progress Bar */}
                      <div className="h-2 w-full rounded-full bg-[#2A221E] overflow-hidden flex mb-2.5 border border-[#B99A61]/20">
                        <div className="bg-[#4B3732] h-full w-[35%]" title="Materials 35%" />
                        <div className="bg-[#B99A61] h-full w-[25%]" title="Craftsmanship 25%" />
                        <div className="bg-[#E6CA85] h-full w-[40%]" title="Brand Equity & Margin 40%" />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#E5DED1]/70 font-arabic-display">
                        <span>{isRtl ? 'خامات (35%)' : 'Fabrics'}</span>
                        <span>{isRtl ? 'قص وتنفيذ (25%)' : 'Craft'}</span>
                        <span className="font-bold text-[#D8BF8A]">{isRtl ? 'هامش ربح (40%)' : 'Margin'}</span>
                      </div>
                    </div>
                  )}

                  {/* Card 02: Supplier & Fabric Sourcing Verification */}
                  {idx === 1 && (
                    <div className="p-4 rounded-2xl bg-[#1B1513]/90 border border-[#B99A61]/30 shadow-inner">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#E5DED1] mb-2 font-arabic-display">
                        <span>{isRtl ? 'معايير اختيار الموردين' : 'Supplier Verification'}</span>
                        <ShieldCheck className="w-4 h-4 text-[#B99A61]" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-[#E5DED1]/85 font-arabic-display">
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#241D1A] border border-[#B99A61]/25">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B99A61] shrink-0" />
                          <span>{isRtl ? 'فحص عيّنات الأقمشة' : 'Fabric Swatch Test'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#241D1A] border border-[#B99A61]/25">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B99A61] shrink-0" />
                          <span>{isRtl ? 'اعتماد خياطة المشغل' : 'Atelier Stitch QC'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card 03: Business Model Compass (Online vs Studio) */}
                  {idx === 2 && (
                    <div className="p-4 rounded-2xl bg-[#1B1513]/90 border border-[#B99A61]/30 shadow-inner">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#E5DED1] mb-2 font-arabic-display">
                        <span>{isRtl ? 'مصفوفة القرار الاستراتيجي' : 'Strategic Model Matrix'}</span>
                        <Compass className="w-4 h-4 text-[#B99A61]" />
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[11px] font-arabic-display">
                        <div className="flex-1 text-center p-2 rounded-xl bg-[#241D1A] border border-[#B99A61]/25">
                          <span className="block font-bold text-[#F7F2EA] mb-0.5">{isRtl ? 'أونلاين' : 'Online'}</span>
                          <span className="text-[#E5DED1]/60 text-[10px]">{isRtl ? 'مرونة وتكلفة أقل' : 'Lean & Agile'}</span>
                        </div>
                        <span className="text-[#B99A61] font-bold">vs</span>
                        <div className="flex-1 text-center p-2 rounded-xl bg-[#241D1A] border border-[#B99A61]/25">
                          <span className="block font-bold text-[#F7F2EA] mb-0.5">{isRtl ? 'أتيليه' : 'Atelier'}</span>
                          <span className="text-[#E5DED1]/60 text-[10px]">{isRtl ? 'تجربة حية وهيبة' : 'Prestige Experience'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Field Reality Insight Badge ("الواقع الميداني في السوق") */}
                  {ch.detailNote && (
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#1B1513]/90 border border-[#B99A61]/35 shadow-sm relative overflow-hidden">
                      <div className="flex items-center gap-1.5 mb-1.5 text-[#D8BF8A]">
                        <Sparkles className="w-3.5 h-3.5 text-[#B99A61]" />
                        <span className="text-xs font-bold font-arabic-display">
                          {isRtl ? 'الحقيقة من واقع السوق' : 'Field Reality Insight'}
                        </span>
                      </div>
                      <p className="text-xs text-[#E5DED1]/80 leading-relaxed font-arabic-body">
                        {ch.detailNote}
                      </p>
                    </div>
                  )}
                </div>

                {/* BOTTOM FOOTER: Atelier Assurance Link */}
                <div className="pt-5 mt-4 border-t border-[#B99A61]/20 flex items-center justify-between text-xs">
                  <span className="text-[#B99A61]/70 font-editorial-serif tracking-wider font-medium">
                    Atelier Munira · Case #{ch.number}
                  </span>
                  <button
                    onClick={() => {
                      document.getElementById('chapters')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-[#D8BF8A] hover:text-white transition-colors"
                  >
                    <span>{isRtl ? 'الحل داخل الدليل' : 'Solution in Guide'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Subtle bottom separator line */}
      <div className="mt-12 sm:mt-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#B99A61]/25 to-transparent" />
      </div>
    </section>
  );
};
