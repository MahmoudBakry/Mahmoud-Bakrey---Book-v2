import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Clock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
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
  const [activationInput, setActivationInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    success: boolean;
    valid?: boolean;
    accessGranted?: boolean;
    status?: string;
    message: string;
    details?: any;
  } | null>(null);

  if (!isOpen) return null;

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationInput.trim()) return;

    setIsVerifying(true);
    setVerifyResult(null);

    try {
      const res = await fetch('/api/activation/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activationInput.trim().toUpperCase() }),
      });
      const data = await res.json();
      setVerifyResult({
        success: data.success,
        valid: data.valid,
        accessGranted: data.accessGranted,
        status: data.status,
        message: data.message || 'تم فحص كود التفعيل',
        details: data.details,
      });
    } catch (err: any) {
      setVerifyResult({
        success: false,
        message: isRtl ? 'تعذر الاتصال بالسيرفر، يرجى المحاولة لاحقاً' : 'Connection error',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-book-title"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#1A1412] border border-[#B99A61]/40 text-[#F7F2EA] shadow-2xl p-6 sm:p-8 overflow-hidden select-none max-h-[90vh] overflow-y-auto"
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

        {/* Code Activation Form */}
        <div className="mb-6 p-4 rounded-2xl bg-[#241D1A]/90 border border-[#B99A61]/35">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="w-4 h-4 text-[#E6CA85]" />
            <h4 className="font-bold text-sm text-[#E6CA85] font-arabic-display">
              {isRtl ? 'تفعيل الدخول بكود التفعيل الخاص بك' : 'Enter Your Activation Code'}
            </h4>
          </div>
          <p className="text-xs text-[#C8BFB5] mb-3 leading-relaxed">
            {isRtl
              ? 'إذا حصلت على كود التفعيل المربوط بطلبك بعد اعتماد الإدارة، أدخله هنا لفتح الكتاب مباشرة:'
              : 'Enter the activation code linked to your order to unlock the book:'}
          </p>

          <form onSubmit={handleVerifySubmit} className="flex gap-2">
            <input
              type="text"
              value={activationInput}
              onChange={(e) => setActivationInput(e.target.value)}
              placeholder={isRtl ? 'مثال: ACT-XXXXXX' : 'e.g. ACT-XXXXXX'}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-[#B99A61]/30 focus:border-[#E6CA85] focus:outline-none text-white font-mono text-xs uppercase"
            />
            <button
              type="submit"
              disabled={isVerifying || !activationInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B99A61] to-[#E6CA85] text-[#140E0C] font-bold text-xs shadow-md hover:scale-[1.01] active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{isRtl ? 'تحقق وتفعيل' : 'Verify'}</span>
            </button>
          </form>

          {/* Verification Feedback */}
          {verifyResult && (
            <div
              className={`mt-3 p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
                verifyResult.accessGranted
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : verifyResult.status === 'pending'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              }`}
            >
              {verifyResult.accessGranted ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : verifyResult.status === 'pending' ? (
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <div className="flex-1">
                <span className="font-semibold block">{verifyResult.message}</span>
                {verifyResult.details?.customerName && (
                  <span className="text-[11px] opacity-80 block mt-0.5">
                    العميل: {verifyResult.details.customerName}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status / Instructions Card */}
        <div className="space-y-3 mb-6 text-xs sm:text-sm">
          <h4 className="text-[11px] font-editorial-serif tracking-widest text-[#B99A61] uppercase font-bold">
            {isRtl ? 'كيف يتم فتح نسختك؟' : 'How access works:'}
          </h4>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="w-5 h-5 rounded-full bg-[#B99A61]/20 text-[#E6CA85] font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                1
              </span>
              <span className="text-[#E5DED1]">
                {isRtl
                  ? 'سدد الرسوم وسجل بياناتك في صفحة الشراء لإنشاء طلبك وكودك المربوط تلقائياً.'
                  : 'Submit your details on checkout to generate your order & linked code.'}
              </span>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="w-5 h-5 rounded-full bg-[#B99A61]/20 text-[#E6CA85] font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                2
              </span>
              <span className="text-[#E5DED1]">
                {isRtl
                  ? 'تواصل عبر واتساب لإرسال رقم الطلب والكود المربوط لتأكيد السداد.'
                  : 'Send your order ID & code on WhatsApp to verify payment.'}
              </span>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="w-5 h-5 rounded-full bg-[#B99A61]/20 text-[#E6CA85] font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                3
              </span>
              <span className="text-[#E5DED1]">
                {isRtl
                  ? 'فور موافقة الإدارة وتفعيل الكود، يمكنك إدخاله هنا وتصفح الكتاب مباشرة.'
                  : 'Once admin approves, unlock and browse the book right here.'}
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
