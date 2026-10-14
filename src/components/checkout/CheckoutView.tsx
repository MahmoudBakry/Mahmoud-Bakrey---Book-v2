import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  Sparkles,
  Phone,
  User,
  Mail,
  Copy,
  Check,
  Clock,
  ExternalLink,
  BookOpen,
  KeyRound,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { BRAND_CONFIG } from '../../config/brand';
import { BrandMonogram } from '../ui/BrandMonogram';
import { WhatsAppIcon } from '../ui/SocialIcons';
import { trackEvent } from '../../lib/analytics';

interface CheckoutViewProps {
  onBackToHome: () => void;
  onOpenMyBook?: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onBackToHome,
  onOpenMyBook,
}) => {
  const { isRtl } = useLanguage();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [hasPaidMock, setHasPaidMock] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedActivationCode, setCopiedActivationCode] = useState(false);
  const [assignedActivationCode, setAssignedActivationCode] = useState('');
  const [orderId] = useState(() => `BK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`);

  const ArrowBackIcon = isRtl ? ArrowRight : ArrowLeft;
  const ArrowForwardIcon = isRtl ? ArrowLeft : ArrowRight;

  // Dynamic WhatsApp prefilled text
  const cleanPhone = phoneNumber.trim() || '—';
  const cleanName = fullName.trim() || '—';
  const whatsappMessage = encodeURIComponent(
    `مرحباً أستاذة منيرة، قمت بسداد رسوم "دليل نجاح مشروع الأزياء" وحجز نسختي في الموقع:\n` +
      `• الاسم: ${cleanName}\n` +
      `• رقم الهاتف: ${cleanPhone}\n` +
      `• رقم الطلب: ${orderId}\n` +
      (assignedActivationCode ? `• كود التفعيل المربوط: ${assignedActivationCode}\n` : '') +
      `• المبلغ: 50 د.ك\n` +
      `يرجى تأكيد الحجز وتفعيل الكود لفتح الكتاب.`
  );
  const dynamicWhatsAppUrl = `https://wa.me/96569073494?text=${whatsappMessage}`;

  const handleMockPaymentClick = () => {
    setHasPaidMock(true);
    trackEvent('mock_payment_completed', { orderId, amount: 50, currency: 'KWD' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setValidationError(isRtl ? 'يرجى كتابة الاسم الكريم' : 'Please enter your name');
      return;
    }
    if (!phoneNumber.trim()) {
      setValidationError(
        isRtl
          ? 'يرجى إدخال رقم الهاتف (المسجل على واتساب)'
          : 'Please enter your phone number (with active WhatsApp)'
      );
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    let receivedCode = '';

    try {
      // Save order into MongoDB Atlas via backend REST API & auto-generate linked activation code
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderId,
          bookTitle: 'أسرار وتناغم الأزياء الراقية - الإصدار الحصري',
          customerName: fullName.trim(),
          phone: phoneNumber.trim(),
          email: email.trim(),
          amount: 50,
          currency: 'KWD',
          paymentMethod: hasPaidMock ? 'online_paid_mock' : 'tap_payment_link',
        }),
      });

      const data = await response.json();
      if (data.success && data.activationCode?.code) {
        receivedCode = data.activationCode.code;
        setAssignedActivationCode(receivedCode);
      }
    } catch (err) {
      console.warn('Order sync to MongoDB backend noted:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }

    trackEvent('purchase_order_submitted', {
      orderId,
      customer_name: fullName,
      customer_phone: phoneNumber,
      has_mock_paid: hasPaidMock,
      activation_code: receivedCode,
    });

    // Open WhatsApp in a new tab for a fast, frictionless flow
    try {
      const targetUrl = receivedCode
        ? `https://wa.me/96569073494?text=${encodeURIComponent(
            `مرحباً أستاذة منيرة، قمت بسداد رسوم "دليل نجاح مشروع الأزياء" وحجز نسختي في الموقع:\n` +
              `• الاسم: ${cleanName}\n` +
              `• رقم الهاتف: ${cleanPhone}\n` +
              `• رقم الطلب: ${orderId}\n` +
              `• كود التفعيل المربوط: ${receivedCode}\n` +
              `• المبلغ: 50 د.ك\n` +
              `يرجى تأكيد الحجز وتفعيل الكود لفتح الكتاب.`
          )}`
        : dynamicWhatsAppUrl;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Fallback if popup blocked, button remains prominent
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const copyActivationCode = () => {
    if (!assignedActivationCode) return;
    navigator.clipboard.writeText(assignedActivationCode);
    setCopiedActivationCode(true);
    setTimeout(() => setCopiedActivationCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#140E0C] text-[#F7F2EA] flex flex-col selection:bg-[#B99A61]/30">
      {/* =========================================================================
          TOP MINIMAL HEADER
          ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#17110F]/90 backdrop-blur-md border-b border-[#B99A61]/20 py-3 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Back to Home Button */}
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6CA85] hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-full hover:bg-white/[0.05]"
          >
            <ArrowBackIcon className="w-4 h-4" />
            <span>{isRtl ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>

          {/* Brand Logo & Atelier Monogram */}
          <div className="flex items-center gap-2.5">
            <BrandMonogram size={28} showWordmark={true} />
          </div>

          {/* Secure & Fast Badge */}
          <div className="flex items-center gap-1.5 text-xs text-[#D8BF8A]">
            <Lock className="w-3.5 h-3.5 text-[#B99A61]" />
            <span className="hidden sm:inline font-mono">
              {isRtl ? 'طلب فوري ومباشر' : 'Instant Activation'}
            </span>
            <span className="sm:hidden font-mono font-bold text-[#E6CA85]">50 د.ك</span>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN STREAMLINED CONTENT
          ========================================================================= */}
      <main className="flex-1 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col justify-center">
        {/* If Order Submitted: Show Clean Confirmation & Direct WhatsApp Call */}
        {isSubmitted ? (
          <div className="max-w-xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="rounded-3xl bg-[#1C1513] border border-[#B99A61]/35 p-6 sm:p-9 shadow-2xl relative overflow-hidden text-center">
              {/* Radial Glow */}
              <div
                className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 pointer-events-none opacity-20 blur-[80px]"
                style={{
                  background: 'radial-gradient(circle, rgba(185, 154, 97, 0.7) 0%, transparent 70%)',
                }}
                aria-hidden="true"
              />

              {/* Status Icon */}
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <span className="text-[11px] font-editorial-serif tracking-widest uppercase text-[#B99A61] font-bold">
                {isRtl ? 'تم تسجيل طلبك بنجاح' : 'Registration Received'}
              </span>

              <h2 className="text-xl sm:text-2xl font-extrabold font-arabic-display text-white mt-1 mb-2">
                {isRtl ? 'خطوتك الأخيرة: استلام كود التفعيل' : 'Final Step: Receive Your Code'}
              </h2>

              <p className="text-xs sm:text-sm text-[#C8BFB5] max-w-md mx-auto leading-relaxed mb-5">
                {isRtl
                  ? 'تم تجهيز رسالتك المباشرة للمصممة. اضغطي على زر الواتساب أدناه لإرسالها واستلام كود تفعيل الكتاب فوراً.'
                  : 'Your request is ready. Click the WhatsApp button below to send it and receive your activation code instantly.'}
              </p>

              {/* Order Reference Card */}
              <div className="bg-[#140E0C]/90 border border-[#B99A61]/25 rounded-2xl p-4 mb-6 text-start space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#B99A61]/15">
                  <span className="text-xs text-[#B99A61]">
                    {isRtl ? 'رقم الطلب المرجعي:' : 'Order ID:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white tracking-wider">
                      {orderId}
                    </span>
                    <button
                      type="button"
                      onClick={copyOrderId}
                      className="p-1 text-[#E6CA85] hover:text-white transition-colors cursor-pointer"
                      title={isRtl ? 'نسخ رقم الطلب' : 'Copy Order ID'}
                    >
                      {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Linked Activation Code */}
                {assignedActivationCode && (
                  <div className="flex items-center justify-between pb-2 border-b border-[#B99A61]/15 bg-[#B99A61]/10 -mx-4 px-4 py-1.5">
                    <span className="text-xs font-semibold text-[#E6CA85] flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#B99A61]" />
                      <span>{isRtl ? 'كود التفعيل المربوط:' : 'Activation Code:'}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-extrabold text-white tracking-wider">
                        {assignedActivationCode}
                      </span>
                      <button
                        type="button"
                        onClick={copyActivationCode}
                        className="p-1 text-[#E6CA85] hover:text-white transition-colors cursor-pointer"
                        title={isRtl ? 'نسخ كود التفعيل' : 'Copy Activation Code'}
                      >
                        {copiedActivationCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-[#E5DED1]">
                  <span>{isRtl ? 'الاسم:' : 'Name:'}</span>
                  <span className="font-semibold">{fullName}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#E5DED1]">
                  <span>{isRtl ? 'الهاتف (واتساب):' : 'Phone (WhatsApp):'}</span>
                  <span className="font-mono font-semibold">{phoneNumber}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#E5DED1]">
                  <span>{isRtl ? 'الكتاب المحجوز:' : 'Book:'}</span>
                  <span className="font-semibold text-[#D8BF8A] truncate max-w-[200px]">
                    {isRtl ? 'أسرار وتناغم الأزياء الراقية' : 'Haute Couture Fashion Guide'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#E5DED1]">
                  <span>{isRtl ? 'المبلغ المطلوب:' : 'Amount:'}</span>
                  <span className="font-mono font-bold text-[#E6CA85]">50 KWD (د.ك)</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#E5DED1] pt-1 border-t border-[#B99A61]/10">
                  <span>{isRtl ? 'حالة التفعيل:' : 'Status:'}</span>
                  <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>{isRtl ? 'قيد المراجعة واعتماد الإدارة' : 'Pending Admin Approval'}</span>
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Concierge CTA */}
              <div className="space-y-3">
                <a
                  href={dynamicWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold font-arabic-display text-sm sm:text-base shadow-xl shadow-[#25D366]/25 flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 transition-all"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                  <span>
                    {isRtl
                      ? 'مراسلة المصممة عبر واتساب واستلام الكود'
                      : 'Open WhatsApp & Get Activation Code'}
                  </span>
                </a>

                <p className="text-[11px] text-[#A69C8E]">
                  {isRtl
                    ? 'ستظهر لك أيقونة "كتابي" في الشريط العلوي بمجرد إرسال الكود واعتماده.'
                    : '"My Book" in the top bar will activate once confirmed.'}
                </p>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="w-full sm:w-auto py-2 px-5 rounded-xl border border-[#B99A61]/30 text-[#E6CA85] hover:text-white hover:bg-white/[0.05] text-xs font-semibold transition-all cursor-pointer"
                  >
                    {isRtl ? 'العودة للرئيسية' : 'Return to Home'}
                  </button>

                  {onOpenMyBook && (
                    <button
                      type="button"
                      onClick={onOpenMyBook}
                      className="w-full sm:w-auto py-2 px-5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#E5DED1] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#B99A61]" />
                      <span>{isRtl ? 'عرض نافذة (كتابي)' : 'View My Book Modal'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ===================================================================
              FAST, SIMPLIFIED 2-COLUMN VIEW (Summary + Quick Checkout)
              =================================================================== */
          <div className="space-y-6">
            {/* Quick Header Banner */}
            <div className="text-center max-w-xl mx-auto">
              <span className="text-[11px] font-editorial-serif tracking-widest uppercase text-[#B99A61] font-bold">
                {isRtl ? 'إتمام الطلب في دقيقة واحدة' : 'Instant Checkout in 1 Minute'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-arabic-display text-white mt-1">
                {isRtl ? 'احصلي على نسختك الكاملة من الدليل' : 'Get Your Full Copy of The Guide'}
              </h1>
              <p className="text-xs sm:text-sm text-[#C8BFB5] mt-1.5">
                {isRtl
                  ? 'سجلي بياناتك، وسددي الرسوم لتحصلي على كود التفعيل المباشر عبر واتساب.'
                  : 'Enter your details, complete payment, and receive your instant code on WhatsApp.'}
              </p>
            </div>

            {/* Main Form & Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-4xl mx-auto w-full">
              
              {/* LEFT / MAIN COLUMN (7 cols): The Single Unified Quick Form */}
              <div className="lg:col-span-7 bg-[#1C1513] border border-[#B99A61]/35 rounded-3xl p-5 sm:p-7 shadow-2xl relative">
                
                {/* Simulated Payment Link Button (Simple, direct, not a whole separate step page) */}
                <div className="mb-5 pb-5 border-b border-[#B99A61]/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#E6CA85] font-arabic-display">
                      {isRtl ? '١. سداد الرسوم (50 د.ك):' : '1. Guide Fee (50 KWD):'}
                    </span>
                    {hasPaidMock && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'تم السداد' : 'Verified'}</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleMockPaymentClick}
                    className={`w-full py-3 px-4 rounded-xl font-arabic-display font-bold text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer border ${
                      hasPaidMock
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-gradient-to-r from-[#B99A61] via-[#E6CA85] to-[#B99A61] text-[#140E0C] border-[#FFF0D0] hover:scale-[1.01] active:scale-98 shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span>
                        {hasPaidMock
                          ? (isRtl ? 'تم تأكيد السداد بنجاح (KNET / بطاقة بنكية)' : 'Payment Simulated (KNET / Card)')
                          : (isRtl ? 'اضغط هنا للدفع الإلكتروني السريع (50 د.ك)' : 'Pay via Payment Link (50 KWD)')}
                      </span>
                    </span>

                    {hasPaidMock ? (
                      <span className="text-[11px] underline text-[#B99A61]" onClick={(e) => { e.stopPropagation(); setHasPaidMock(false); }}>
                        {isRtl ? 'إعادة' : 'Reset'}
                      </span>
                    ) : (
                      <ArrowForwardIcon className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                  <p className="text-[11px] text-[#A69C8E] mt-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#B99A61]" />
                    <span>{isRtl ? 'بوابة دفع إلكترونية آمنة ومعتمدة' : 'Secure and verified payment gateway'}</span>
                  </p>
                </div>

                {/* The Contact Details Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#E6CA85] font-arabic-display">
                      {isRtl ? '٢. بيانات التسجيل واستلام الكود:' : '2. Your Contact Information:'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      {isRtl ? 'التفعيل عبر واتساب' : 'WhatsApp Delivery'}
                    </span>
                  </div>

                  {validationError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">
                      {validationError}
                    </div>
                  )}

                  {/* 1. Full Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#D8BF8A] mb-1">
                      {isRtl ? 'الاسم الكريم *' : 'Full Name *'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-[#B99A61]" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={isRtl ? 'اسمك الكريم' : 'Your Name'}
                        className="w-full py-2.5 ps-10 pe-3 rounded-xl bg-[#241D1A] border border-[#B99A61]/30 focus:border-[#E6CA85] focus:outline-none text-white text-xs sm:text-sm transition-colors"
                      />
                    </div>
                  </div>

                  {/* 2. Phone Number (WhatsApp required) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-[#D8BF8A]">
                        {isRtl ? 'رقم الهاتف (واتساب) *' : 'Phone (WhatsApp) *'}
                      </label>
                      <span className="text-[10px] text-amber-300">
                        {isRtl ? 'ضروري لاستلام كود التفعيل' : 'Required for activation code'}
                      </span>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-emerald-400" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={isRtl ? 'مثال: +965 9999 9999' : '+965 9999 9999'}
                        className="w-full py-2.5 ps-10 pe-3 rounded-xl bg-[#241D1A] border border-[#B99A61]/30 focus:border-[#E6CA85] focus:outline-none text-white text-xs sm:text-sm font-mono transition-colors"
                      />
                    </div>
                  </div>

                  {/* 3. Email (Optional) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A69C8E] mb-1">
                      {isRtl ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-[#B99A61]/60" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isRtl ? 'your.name@example.com (اختياري)' : 'Optional email'}
                        className="w-full py-2.5 ps-10 pe-3 rounded-xl bg-[#241D1A] border border-[#B99A61]/20 focus:border-[#E6CA85] focus:outline-none text-white text-xs sm:text-sm font-mono transition-colors"
                      />
                    </div>
                  </div>

                  {/* The Single Master Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold font-arabic-display text-sm sm:text-base shadow-lg shadow-[#25D366]/20 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <WhatsAppIcon className="w-5 h-5 fill-current" />
                      )}
                      <span>
                        {isSubmitting
                          ? (isRtl ? 'جاري تسجيل الطلب...' : 'Registering order...')
                          : (isRtl
                              ? 'تأكيد الطلب والتواصل على واتساب لاستلام الكود'
                              : 'Confirm & Get Code on WhatsApp')}
                      </span>
                    </button>
                  </div>

                  {/* Reassurance Micro-Footer */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#A69C8E] border-t border-[#B99A61]/15">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#B99A61]" />
                      {isRtl ? 'حجز رسمي موثق' : 'Official Atelier Checkout'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {isRtl ? 'تفعيل فوري للكتاب' : 'Instant Activation'}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#E6CA85]" />
                      {isRtl ? 'ظهور أيقونة (كتابي) فوراً' : '"My Book" Unlocked'}
                    </span>
                  </div>
                </form>

              </div>

              {/* RIGHT COLUMN (5 cols): Compact Book & Value Summary */}
              <div className="lg:col-span-5 bg-[#17110F] border border-[#B99A61]/25 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                
                <div>
                  <span className="text-[10px] font-editorial-serif tracking-widest uppercase text-[#B99A61] font-bold block mb-1">
                    {isRtl ? 'ملخص النسخة الكاملة' : 'Edition Summary'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-arabic-display text-white">
                    {BRAND_CONFIG.bookTitleAr}
                  </h3>
                  <p className="text-xs text-[#D8BF8A] mt-0.5">
                    {BRAND_CONFIG.authorAr}
                  </p>
                </div>

                {/* Price Tag Box */}
                <div className="p-3.5 rounded-2xl bg-[#140E0C] border border-[#B99A61]/30">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#C8BFB5]">
                      {isRtl ? 'السعر المخفض:' : 'Offer Price:'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-[#B99A61]/50 line-through font-mono">
                        85 د.ك
                      </span>
                      <span className="text-2xl font-extrabold text-[#E6CA85] font-mono">
                        50 د.ك
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold pt-1 text-end">
                    {isRtl ? 'وفر 35 د.ك (خصم 41%)' : 'Save 35 KWD (41% OFF)'}
                  </div>
                </div>

                {/* 3 Concise Benefit Bullets */}
                <div className="space-y-2 text-xs text-[#E5DED1]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B99A61] shrink-0" />
                    <span>{isRtl ? 'النسخة الرقمية لجميع الفصول السبعة' : 'Full access to all 7 chapters'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B99A61] shrink-0" />
                    <span>{isRtl ? 'دليل الموردين والمشاغل المعتمد' : 'Verified Suppliers Directory'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B99A61] shrink-0" />
                    <span>{isRtl ? 'استشارة مباشرة مع المصممة عبر واتساب' : 'Direct consultation with the designer'}</span>
                  </div>
                </div>

                {/* Quick note */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-[#B99A61]/15 text-[11px] text-[#A69C8E] leading-relaxed">
                  {isRtl
                    ? 'بعد إرسال البيانات وسداد الرسوم، سيتواصل معك الفريق عبر واتساب لمنحك كود التفعيل الخاص بك لتصفح الكتاب في أي وقت.'
                    : 'After submitting, you will receive your code via WhatsApp to view the book anytime.'}
                </div>

              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};
