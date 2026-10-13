import React from 'react';
import { X, Check, BookOpen, Layers, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { CTAButton } from '../ui/CTAButton';

interface ChaptersPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBuy: () => void;
}

export const ChaptersPreviewModal: React.FC<ChaptersPreviewModalProps> = ({
  isOpen,
  onClose,
  onSelectBuy,
}) => {
  const { isRtl } = useLanguage();

  if (!isOpen) return null;

  const chapters = isRtl
    ? [
        {
          num: '01',
          title: 'التأسيس وبناء الهوية الإبداعية لعلامتك',
          desc: 'كيف تنطلقين من فكرة أصيلة إلى هوية مميزة تحجز مكانتها في سوق الأزياء.',
        },
        {
          num: '02',
          title: 'دراسة السوق الكويتي والخليجي وتحديد العميل المثالي',
          desc: 'فهم سلوك المشترية الخليجية، فئات الطلب، وفجوات السوق غير المستغلة.',
        },
        {
          num: '03',
          title: 'أسرار اختيار الأقمشة وتطوير العينات الأولى',
          desc: 'معايير جودة الخامات، مصادر التوريد، واختبار القطع الأولية قبل الإنتاج.',
        },
        {
          num: '04',
          title: 'إدارة المشاغل وعلاقات المصانع وتفادي أخطاء التنفيذ',
          desc: 'كيفية التعامل مع الخياطين والمصانع، مراقبة الجودة، وضبط الجداول الزمنية.',
        },
        {
          num: '05',
          title: 'معادلات التسعير الواقعية وهوامش الربح للأزياء الفاخرة',
          desc: 'حساب التكاليف الخفية، تسعير التجزئة، وتجنب خسائر التسعير العشوائي.',
        },
        {
          num: '06',
          title: 'صناعة المحتوى والتسويق لعلامة أزياء مرغوبة',
          desc: 'استراتيجيات التصوير الإبداعي، التعاون مع المؤثرات، وحملات الإطلاق الناجحة.',
        },
        {
          num: '07',
          title: 'إطلاق المجموعة، إدارة الطلبات وتجربة العميل المميزة',
          desc: 'يوم الإطلاق، خدمة ما بعد البيع، التغليف الفاخر، وبناء ولاء مستمر للعلامة.',
        },
      ]
    : [
        {
          num: '01',
          title: 'Foundations & Creative Identity Blueprint',
          desc: 'Transforming an initial spark into an unmistakable luxury signature.',
        },
        {
          num: '02',
          title: 'GCC Market Intelligence & Client Archetypes',
          desc: 'Decoding customer psychology, seasonal buying cycles, and commercial gaps.',
        },
        {
          num: '03',
          title: 'Textile Sourcing & Prototype Development',
          desc: 'Material composition standards, drapery testing, and sample perfection.',
        },
        {
          num: '04',
          title: 'Atelier Management & Factory Quality Control',
          desc: 'Production scheduling, technical specifications, and error mitigation.',
        },
        {
          num: '05',
          title: 'Realistic Fashion Pricing & Profit Margins',
          desc: 'Hidden overhead formulas, tiered markups, and margin sustainability.',
        },
        {
          num: '06',
          title: 'Editorial Visuals & Coveted Brand Marketing',
          desc: 'Couture storytelling, campaign art direction, and influencer synergy.',
        },
        {
          num: '07',
          title: 'Collection Launch & White-Glove Client Care',
          desc: 'Drop execution, luxury packaging, client retention, and repeat acquisition.',
        },
      ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#1A1412] border border-[#B99A61]/40 text-[#F7F2EA] shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#B99A61]/20">
          <div>
            <span className="text-[11px] font-editorial-serif tracking-widest text-[#B99A61] uppercase block mb-1">
              {isRtl ? 'نظرة شاملة على المحتوى' : 'CURRICULUM OVERVIEW'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-arabic-display text-white">
              {isRtl ? 'فصول دليل نجاح مشروع الأزياء' : '7 Core Chapters + Supplier Guide'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#B99A61]/80 hover:text-white hover:bg-[#241D1A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Chapters List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {chapters.map((ch) => (
            <div
              key={ch.num}
              className="p-4 rounded-xl bg-[#231B18]/70 border border-[#B99A61]/20 hover:border-[#B99A61]/40 transition-colors"
            >
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-sm font-editorial-serif font-bold text-[#B99A61]">
                  {ch.num}.
                </span>
                <h4 className="text-sm sm:text-base font-semibold text-[#F7F2EA] font-arabic-display">
                  {ch.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#D8BF8A]/80 leading-relaxed ps-7">
                {ch.desc}
              </p>
            </div>
          ))}

          {/* Supplier Directory Bonus Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#2B1F1B] to-[#201815] border border-[#B99A61]/50 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#B99A61]" />
              <span className="text-xs font-bold text-[#B99A61] uppercase tracking-wider">
                {isRtl ? 'ملحق عملي استثنائي' : 'EXCLUSIVE PRACTICAL APPENDIX'}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold mb-1">
              {isRtl
                ? 'دليل الموردين ومصانع الأقمشة المعتمد (الكويت والخليج)'
                : 'Verified Supplier & Textile Mill Directory (Kuwait & GCC)'}
            </h4>
            <p className="text-xs text-[#D8BF8A]/90">
              {isRtl
                ? 'قائمة منتقاة لأفضل مصادر الخامات، المشاغل الموثوقة، وخدمات التغليف الفاخر المعتمدة في مشاريع المصممة منيرة الحربي.'
                : 'A hand-selected directory of premium fabric mills, trusted ateliers, and luxury packaging ateliers.'}
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-[#B99A61]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-start">
            <span className="text-xs text-[#B99A61] block">
              {isRtl ? 'قيمة الدليل الرقمي' : 'Digital Guide Price'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-editorial-serif text-white">
                50 {isRtl ? 'د.ك' : 'KWD'}
              </span>
              <span className="text-xs text-[#B99A61]">
                {isRtl ? '🎁 استشارة مجانية لأول 3' : '🎁 Free consult for first 3'}
              </span>
            </div>
          </div>

          <CTAButton
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              onSelectBuy();
            }}
            isRtl={isRtl}
          >
            {isRtl ? 'احصلي على نسختك الآن' : 'Acquire Your Edition Now'}
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
