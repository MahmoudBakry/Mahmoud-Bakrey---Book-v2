import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const FAQSection: React.FC = () => {
  const { content, isRtl } = useLanguage();
  // By default, first item is expanded, others can be toggled smoothly
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 2, 3]);

  const toggleItem = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqData = content.faq;

  return (
    <section
      id="faq"
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden bg-[#1B1513] text-[#F7F2EA] select-none"
      aria-label={isRtl ? 'الأسئلة الشائعة - قبل ما تطلبين' : 'Frequently Asked Questions - Before You Order'}
    >
      {/* Ambient Atelier Lighting in Background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px]"
        style={{
          background: 'radial-gradient(circle, #B99A61 0%, rgba(194, 143, 137, 0.15) 45%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Editorial Header Lockup (Matching Official PDF Document) */}
        <div className="text-center mb-12 sm:mb-16">
          {/* Eyebrow */}
          <span className="text-xs sm:text-sm font-editorial-serif tracking-widest text-[#B99A61] uppercase block mb-3 font-semibold">
            {faqData.eyebrow}
          </span>

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-arabic-display text-[#F7F2EA] leading-[1.25] text-depth-arabic-title">
            {faqData.mainTitle}
          </h2>

          {/* Subtle Golden Thread Line */}
          <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#E6CA85] to-transparent mx-auto mt-5" />
        </div>

        {/* Minimalist Editorial FAQ Stack with Dividing Lines */}
        <div className="divide-y divide-[#B99A61]/25 border-y border-[#B99A61]/25">
          {faqData.items.map((item, index) => {
            const isOpen = openIndices.includes(index);

            return (
              <div
                key={index}
                className="py-6 sm:py-8 transition-colors duration-200 group"
              >
                {/* Question Trigger Button */}
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-start justify-between gap-4 text-start focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B99A61] rounded-lg cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    {/* Golden Question Mark Accent */}
                    <span className="text-[#B99A61] text-xl sm:text-2xl font-black font-editorial-serif leading-none mt-0.5 shrink-0 group-hover:text-[#E6CA85] transition-colors">
                      ؟
                    </span>

                    {/* Question Title */}
                    <h3 className="text-base sm:text-xl md:text-2xl font-bold font-arabic-display text-[#F7F2EA] leading-snug group-hover:text-[#E6CA85] transition-colors">
                      {item.question.replace('؟', '').trim()}
                    </h3>
                  </div>

                  {/* Sleek Accordion Toggle Icon */}
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-[#B99A61]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#B99A61] group-hover:border-[#B99A61] group-hover:text-[#E6CA85] transition-all">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#E6CA85]' : 'rotate-0'
                      }`}
                    />
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className={`text-sm sm:text-base md:text-lg text-[#E5DED1]/90 font-arabic-body leading-relaxed ${
                      isRtl ? 'pr-7 sm:pr-9' : 'pl-7 sm:pl-9'
                    }`}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
