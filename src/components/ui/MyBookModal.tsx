import React from 'react';
import { BookOpen, X, Clock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { BRAND_CONFIG } from '../../config/brand';
import { WhatsAppIcon } from './SocialIcons';
import { BrandMonogram } from './BrandMonogram';

interface MyBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCheckout: () => void;
}

export const MyBookModal: React.FC<MyBookModalProps> = ({
  isOpen,
  onClose,
  onGoToCheckout,
}) => {
  const { isRtl } = useLanguage();

  if (!isOpen) return null;

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-book-title"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#1A1412] border border-[#B99A61]/40 text-[#F7F2EA] shadow-2xl p-6 sm:p-8 overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Radial Gold Glow */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 pointer-events-none opacity-20 blur-[80px]"
          style={{
            background: 'radial-gradient(circle, rgba(185, 154, 97, 0.6) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Top Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 end-5 w-9 h-9 rounded-full bg-white/[0.05] hover:bg-[#B99A61]/20 border border-[#B99A61]/30 flex items-center justify-center text-[#E6CA85] hover:text-white transition-all cursor-pointer"
          aria-label={isRtl ? 'إغلاق' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Monogram & Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B99A61]/25 to-[#241D1A] border border-[#B99A61]/40 flex items-center justify-center text-[#E6CA85] shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase font-editorial-serif text-[#B99A61] font-semibold">
                {isRtl ? 'بوابة القراء الرقمية' : 'Digital Reader Access'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#B99A61]/15 text-[#E6CA85] border border-[#B99A61]/30">
                {BRAND_CONFIG.specialEditionAr}
              </span>
            </div>
            <h3 id="my-book-title" className="text-xl sm:text-2xl font-bold font-arabic-display text-[#FFF]">
              {isRtl ? 'كتابي: دليل نجاح مشروع الأزياء' : 'My Book: Fashion Business Guide'}
            </h3>
          </div>
        </div>

        {/* Activation Status Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-[#241D1A]/90 border border-[#B99A61]/30 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <h4 className="font-bold text-[#E6CA85] mb-1 font-arabic-display">
              {isRtl ? 'حالة التفعيل: بانتظار موافقة الإدارة' : 'Status: Pending Admin Activation'}
            </h4>
            <p className="text-[#C8BFB5] leading-relaxed">
              {isRtl
                ? 'لا يتم فتح واستعراض الكتاب إلا بعد إتمام عملية الشراء وتأكيد كود التفعيل عبر الواتساب من قِبل الإدارة.'
                : 'The complete book unlocks only after payment completion and WhatsApp concierge verification by the administrator.'}
            </p>
          </div>
        </div>

        {/* 3 Steps to Unlock */}
        <div className="space-y-3 mb-6 text-xs sm:text-sm">
          <h4 className="text-[11px] font-editorial-serif tracking-widest text-[#B99A61] uppercase font-bold">
            {isRtl ? 'كيف يتم فتح نسختك؟' : 'How to unlock your copy:'}
          </h4>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="w-5 h-5 rounded-full bg-[#B99A61]/20 text-[#E6CA85] font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                1
              </span>
              <span className="text-[#E5DED1]">
                {isRtl
                  ? 'سدد الرسوم عبر رابط الدفع وسجل اسمك ورقم هاتفك (واتساب).'
                  : 'Complete payment via the link and submit your name & WhatsApp phone.'}
              </span>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="w-5 h-5 rounded-full bg-[#B99A61]/20 text-[#E6CA85] font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                2
              </span>
              <span className="text-[#E5DED1]">
                {isRtl
                  ? 'تواصل مع فريق الدعم عبر الواتساب للحصول على كود التفعيل المباشر.'
                  : 'Message our concierge on WhatsApp to receive your instant activation code.'}
              </span>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="w-5 h-5 rounded-full bg-[#B99A61]/20 text-[#E6CA85] font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                3
              </span>
              <span className="text-[#E5DED1]">
                {isRtl
                  ? 'فور اعتماد الإدارة، سيتم فتح الكتاب وتصفحه مباشرة من هذا الحساب.'
                  : 'Once approved by admin, the volume unlocks permanently for your account.'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#B99A61]/20">
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToCheckout();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#B99A61] to-[#E6CA85] text-[#140F0D] font-bold font-arabic-display text-sm shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isRtl ? 'الذهاب إلى صفحة الشراء' : 'Go to Checkout'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>

          <a
            href={BRAND_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/35 text-emerald-300 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer active:scale-98"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current text-[#25D366]" />
            <span>{isRtl ? 'تواصل عبر واتساب' : 'WhatsApp Concierge'}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
