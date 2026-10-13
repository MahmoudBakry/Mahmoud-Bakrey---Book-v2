import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, BookOpen, Eye } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface FAQSectionProps {
  onOpenReader?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenReader }) => {
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

        {/* Interactive Demo Book Preview Callout in the Last Section */}
        {onOpenReader && (
          <div className="mt-14 sm:mt-18 pt-8 border-t border-[#B99A61]/20 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#221A17]/80 border border-[#B99A61]/35 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-4 text-start">
              <div className="w-12 h-12 rounded-2xl bg-[#B99A61]/20 border border-[#B99A61]/60 flex items-center justify-center text-[#E6CA85] shrink-0 shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-editorial-serif tracking-widest uppercase text-[#B99A61] block font-semibold mb-0.5">
                  {isRtl ? 'نسخة تجريبية • DEMO PREVIEW' : 'DEMO PREVIEW'}
                </span>
                <h4 className="text-base sm:text-lg font-bold font-arabic-display text-[#F7F2EA]">
                  {isRtl ? 'معاينة تجربة قراءة الدليل الأصلي' : 'Preview The Original Fashion Guide'}
                </h4>
              </div>
            </div>

            <button
              onClick={onOpenReader}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B99A61] via-[#E6CA85] to-[#B99A61] text-[#16110F] font-extrabold text-sm sm:text-base font-arabic-display shadow-[0_10px_25px_rgba(185,154,97,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer border border-[#FFF0D0]"
              aria-label={isRtl ? 'عاين الكتاب' : 'Preview Book'}
            >
              <Eye className="w-4 h-4 text-[#16110F]" />
              <span>{isRtl ? 'عاين الكتاب' : 'Preview Book'}</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
