import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, BookOpen, Gift, MessageCircle, Truck } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { BrandMonogram } from './BrandMonogram';
import { BRAND_CONFIG } from '../../config/brand';
import { trackEvent } from '../../lib/analytics';

interface PreorderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreorderDrawer: React.FC<PreorderDrawerProps> = ({ isOpen, onClose }) => {
  const { content, isRtl } = useLanguage();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setErrorMsg(isRtl ? 'يرجى إدخال الاسم والبريد الإلكتروني' : 'Please provide your name and email');
      return;
    }

    trackEvent('begin_checkout', {
      product: 'The Fashion Business Success Guide',
      price: 50,
      currency: 'KWD',
      customer_email: email,
      customer_name: name,
    });

    setIsSubmitted(true);
    setErrorMsg('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1D1715] border border-[#B99A61]/40 text-[#F7F2EA] shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#B99A61]/70 hover:text-white hover:bg-[#241D1A] transition-colors"
          aria-label={content.drawer.closeButton}
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#B99A61]/20 border border-[#B99A61] flex items-center justify-center mb-5 text-[#B99A61]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-arabic-display text-white mb-2">
              {isRtl ? 'تم تسجيل اهتمامك وحجز مقعدك بنجاح' : 'Your Priority Allocation is Reserved'}
            </h3>
            <p className="text-sm text-[#D8BF8A] max-w-md mx-auto leading-relaxed mb-6">
              {isRtl
                ? 'شكراً لكِ. سنرسل لكِ رابط الدخول المباشر للقراءة الرقمية وكود التفعيل عبر البريد فور إطلاق بوابة القراءة.'
                : 'Thank you. We will deliver your direct reading access link and activation credentials once the reading portal activates.'}
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="py-3 px-8 rounded-lg bg-[#B99A61] text-[#140F0D] font-bold text-sm hover:bg-[#D8BF8A] transition-colors"
            >
              {content.drawer.closeButton}
            </button>
          </div>
        ) : (
          <div>
            {/* Header Lockup */}
            <div className="flex items-center gap-3 mb-4">
              <BrandMonogram size={32} />
              <div>
                <span className="text-[11px] font-editorial-serif tracking-widest text-[#B99A61] uppercase block">
                  {content.drawer.editionInfo}
                </span>
                <h3 id="drawer-title" className="text-xl sm:text-2xl font-bold font-arabic-display text-white">
                  {content.drawer.title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#D8BF8A] mb-6 leading-relaxed">
              {content.drawer.subtitle}
            </p>

            {/* Launch Price Card */}
            <div className="p-4 rounded-xl bg-[#271F1B] border border-[#B99A61]/35 flex items-center justify-between mb-4 shadow-lg">
              <div>
                <div className="text-[11px] text-[#B99A61] uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'قيمة الدليل الرقمي' : 'Digital Guide Price'}</span>
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-editorial-serif text-depth-arabic-title">
                    {content.hero.priceFormatted}
                  </span>
                  <span className="text-sm text-[#8C7243] line-through font-editorial-serif">
                    {content.hero.originalPriceFormatted}
                  </span>
                </div>
              </div>
              <div className="text-end">
                <span className="text-[11px] text-[#B99A61]/90 block font-medium">
                  {content.drawer.formatNote}
                </span>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  {isRtl ? 'حساب قراءة تفاعلي آمن' : 'Secure Digital Reader Account'}
                </span>
              </div>
            </div>

            {/* Exclusive VIP Consultation Bonus Box */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#2D221D] to-[#201815] border-2 border-[#B99A61]/60 mb-5 shadow-xl relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#B99A61]/25 border border-[#B99A61]/60 flex items-center justify-center shrink-0 text-[#E5C992]">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#E5C992] font-arabic-display">
                      {isRtl ? '🎁 ميزة حصرية لأول 3 مشتركات' : '🎁 Exclusive: First 3 Subscribers'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B99A61]/25 text-[#F7F2EA] border border-[#B99A61]/40">
                      {isRtl ? 'استشارة مجانية' : 'Free Consultation'}
                    </span>
                  </div>
                  <p className="text-xs text-[#F7F2EA] leading-relaxed mb-2">
                    {isRtl
                      ? 'أول 3 مشتركات يحصلن على استشارة خاصة مجانية مع المصممة منيرة الحربي.'
                      : 'The first 3 subscribers receive a complimentary 1-on-1 private consultation with Designer Munira Alharbi.'}
                  </p>
                  <div className="pt-2 border-t border-[#B99A61]/20 flex flex-col gap-1 text-[11px] text-[#D8BF8A]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B99A61]" />
                      <span>
                        {isRtl
                          ? 'بعد ذلك، قيمة الاستشارة 70 د.ك'
                          : 'After that, the private consultation fee is 70 KWD'}
                      </span>
                    </div>
                    <a
                      href={BRAND_CONFIG.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                      <span>
                        {isRtl
                          ? `تشمل المتابعة عبر الواتساب (${BRAND_CONFIG.whatsapp}) والتوصية بالمورد`
                          : `Includes WhatsApp follow-up (${BRAND_CONFIG.whatsapp}) & supplier referral`}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Points */}
            <div className="space-y-2 mb-5 text-xs text-[#F7F2EA]/90">
              {content.drawer.featurePoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#B99A61] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Lead / Priority Reservation Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 mb-4">
              <div>
                <label className="block text-xs font-medium text-[#D8BF8A] mb-1">
                  {isRtl ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isRtl ? 'مثال: نورة المطيري' : 'e.g. Sarah Al-Sabah'}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#140F0D] border border-[#B99A61]/30 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#B99A61]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D8BF8A] mb-1">
                  {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRtl ? 'name@example.com' : 'name@example.com'}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#140F0D] border border-[#B99A61]/30 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#B99A61]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D8BF8A] mb-1">
                  {isRtl ? 'رقم الهاتف / واتساب (اختياري)' : 'Phone / WhatsApp (Optional)'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+965 9XXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#140F0D] border border-[#B99A61]/30 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#B99A61]"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-lg font-bold text-sm bg-gradient-to-r from-[#E5C992] via-[#B99A61] to-[#8C7243] text-[#140F0D] hover:opacity-95 transition-opacity shadow-lg"
              >
                {content.drawer.confirmButton}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#B99A61]/70">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{content.drawer.guaranteeText}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
