import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../../../hooks/useLanguage';
import { FashionPrimaryCTA } from './FashionPrimaryCTA';

interface FashionOpeningSceneProps {
  onOpenPreorder?: () => void;
  onOpenReader?: () => void;
}

export const FashionOpeningScene: React.FC<FashionOpeningSceneProps> = ({ onOpenPreorder, onOpenReader }) => {
  const { content, isRtl } = useLanguage();
  const sceneRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const secondaryRef = useRef<HTMLParagraphElement>(null);
  const threadSvgRef = useRef<SVGSVGElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const sceneData = content.bookPreview.scene1;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Cinematic entrance for image and text
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sceneRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      if (imageFrameRef.current) {
        tl.fromTo(
          imageFrameRef.current,
          { clipPath: 'inset(10% 14% 10% 14% round 24px)', scale: 1.08, opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out' }
        );
      }

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { y: 40, opacity: 0, filter: 'blur(8px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
          '-=0.8'
        );
      }

      if (secondaryRef.current) {
        tl.fromTo(
          secondaryRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          '-=0.6'
        );
      }

      // Animate flowing gold silk thread
      if (threadSvgRef.current) {
        const path = threadSvgRef.current.querySelector('path');
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sceneRef.current,
              start: 'top 65%',
              toggleActions: 'play none none none',
            },
          });
        }
      }
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sceneRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#1B1513] select-none"
    >
      {/* 1. Cinematic Background Image Layer with Mask */}
      <div
        ref={imageFrameRef}
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-1000"
      >
        <img
          src="/src/assets/images/cinematic_fabric_macro_1791809390855.jpg"
          alt="Haute couture luxury fabric macro photography"
          className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.12]"
          loading="eager"
        />
        {/* Cinematic Vignette & Atmospheric Radial Shading */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, rgba(27, 21, 19, 0.25) 0%, rgba(27, 21, 19, 0.78) 70%, #1B1513 100%),
              linear-gradient(180deg, rgba(27, 21, 19, 0.85) 0%, transparent 25%, transparent 75%, #1B1513 100%)
            `,
          }}
        />
      </div>

      {/* 2. Delicate Animated Gold Couture Thread (SVG) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <svg
          ref={threadSvgRef}
          className="w-full h-full"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d={
              isRtl
                ? 'M 1440,200 C 1100,320 850,150 600,480 C 380,750 150,680 0,820'
                : 'M 0,200 C 340,320 590,150 840,480 C 1060,750 1290,680 1440,820'
            }
            stroke="url(#scene1-gold-thread)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="scene1-gold-thread" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B99A61" stopOpacity="0.1" />
              <stop offset="40%" stopColor="#E6CA85" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#C28F89" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#B99A61" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 3. Pure Haute Editorial Typography */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-20 sm:pt-28 pb-8 sm:pb-12">
        
        {/* Monumental Cinematic Main Arabic Headline */}
        <h2
          ref={headlineRef}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-arabic-display text-[#F7F2EA] leading-[1.2] mb-5 tracking-tight text-depth-arabic-title max-w-4xl"
        >
          {sceneData.headline}
        </h2>

        {/* Secondary Calligraphic Line */}
        <p
          ref={secondaryRef}
          className="text-xl sm:text-2xl md:text-3xl font-arabic-calligraphy text-[#D8BF8A] leading-relaxed max-w-2xl text-depth-arabic-calligraphy"
        >
          {sceneData.secondaryLine}
        </p>
      </div>

      {/* 4. Full-Width Open Screen CTA Section (No enclosing card) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32">
        <FashionPrimaryCTA onOpenPreorder={onOpenPreorder} onOpenReader={onOpenReader} />
      </div>

      {/* Atmospheric Bottom Gradient Bleed */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, #1B1513 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
};
