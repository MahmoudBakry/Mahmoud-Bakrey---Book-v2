import React, { useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { FashionOpeningScene } from './bookPreview/FashionOpeningScene';

interface BookPreviewSectionProps {
  onOpenPreorder?: () => void;
  onOpenReader?: () => void;
}

export const BookPreviewSection: React.FC<BookPreviewSectionProps> = ({ onOpenPreorder, onOpenReader }) => {
  const { isRtl } = useLanguage();
  const sectionRootRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRootRef}
      id="book-preview"
      className="relative w-full bg-[#1B1513] text-[#F7F2EA] overflow-hidden"
      aria-label={isRtl ? 'معاينة سينمائية تفاعلية للدليل' : 'Cinematic Interactive Book Preview'}
    >
      {/* 
        ========================================================================
        SCENE 01 — THE WORLD OF FASHION & CONNECTED PRIMARY CTA
        Full-bleed opening fashion film feel, macro fabric texture, gold thread
        ========================================================================
      */}
      <FashionOpeningScene onOpenPreorder={onOpenPreorder} onOpenReader={onOpenReader} />

      {/* Section Bottom Aesthetic Boundary Bleed */}
      <div
        className="w-full h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #1B1513 0%, #15100E 100%)',
        }}
        aria-hidden="true"
      />
    </section>
  );
};
