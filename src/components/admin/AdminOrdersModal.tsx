import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Database,
  ExternalLink,
  ShieldCheck,
  Send,
  User,
  Phone,
  Mail,
  Calendar,
  KeyRound,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { WhatsAppIcon } from '../ui/SocialIcons';

interface OrderItem {
  _id: string;
  orderNumber: string;
  bookTitle: string;
  customerName: string;
  phone: string;
  email?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'approved' | 'rejected';
  bookingDate: string;
  activationCode?: string;
  paymentMethod?: string;
  whatsappContacted?: boolean;
  approvedAt?: string;
  createdAt: string;
}

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({ isOpen, onClose }) => {
  const { isRtl } = useLanguage();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingOrderNum, setUpdatingOrderNum] = useState<string | null>(null);

  // Test Code Verification State
  const [testCodeInput, setTestCodeInput] = useState('');
  const [testVerifyResult, setTestVerifyResult] = useState<any>(null);
  const [isVerifyingTest, setIsVerifyingTest] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders?limit=100');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateStatus = async (orderNumber: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    setUpdatingOrderNum(orderNumber);
    try {
      const res = await fetch(`/api/orders/${orderNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((ord) =>
            ord.orderNumber === orderNumber
              ? {
                  ...ord,
                  status: newStatus,
                  approvedAt: newStatus === 'approved' ? new Date().toISOString() : ord.approvedAt,
                }
              : ord
          )
        );
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingOrderNum(null);
    }
  };

  const handleTestVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testCodeInput.trim()) return;
    setIsVerifyingTest(true);
    setTestVerifyResult(null);

    try {
      const res = await fetch('/api/activation/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: testCodeInput.trim().toUpperCase() }),
      });
      const data = await res.json();
      setTestVerifyResult({ status: res.status, ...data });
    } catch (err: any) {
      setTestVerifyResult({ success: false, message: err?.message || 'Error communicating with server' });
    } finally {
      setIsVerifyingTest(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = statusFilter === 'all' || order.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;

    const matchesSearch =
      order.customerName.toLowerCase().includes(q) ||
      order.phone.toLowerCase().includes(q) ||
      order.orderNumber.toLowerCase().includes(q) ||
      (order.activationCode && order.activationCode.toLowerCase().includes(q)) ||
      (order.email && order.email.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const approvedCount = orders.filter((o) => o.status === 'approved' || o.status === 'paid').length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#17110F] border border-[#B99A61]/40 text-[#F7F2EA] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#B99A61]/25 flex flex-wrap items-center justify-between gap-4 bg-[#140E0C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B99A61]/20 border border-[#B99A61]/40 flex items-center justify-center text-[#E6CA85]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-wider uppercase text-[#B99A61] font-semibold">
                  MongoDB Atlas Cluster
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono">Connected</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-arabic-display text-white">
                {isRtl ? 'لوحة إدارة الحجوزات والطلبات وأكواد التفعيل' : 'Orders & Activation Codes Management'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchOrders}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#E6CA85] hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title={isRtl ? 'تحديث البيانات' : 'Refresh'}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRtl ? 'تحديث' : 'Refresh'}</span>
            </button>

            <button
              onClick={onClose}
              type="button"
              className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-[#B99A61]/20 border border-[#B99A61]/30 flex items-center justify-center text-[#E6CA85] hover:text-white transition-all cursor-pointer"
              aria-label={isRtl ? 'إغلاق' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats & Filter Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#B99A61]/15 bg-[#1C1412] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#E5DED1]">
              {isRtl ? 'إجمالي الطلبات:' : 'Total:'}{' '}
              <strong className="text-white font-mono">{orders.length}</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
              {isRtl ? 'قيد الانتظار:' : 'Pending:'}{' '}
              <strong className="font-mono">{pendingCount}</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              {isRtl ? 'معتمدة / مفعلة:' : 'Approved:'}{' '}
              <strong className="font-mono">{approvedCount}</strong>
            </span>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#B99A61] text-[#140E0C]'
                    : 'text-[#C8BFB5] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {st === 'all' && (isRtl ? 'الكل' : 'All')}
                {st === 'pending' && (isRtl ? 'معلقة' : 'Pending')}
                {st === 'approved' && (isRtl ? 'معتمدة' : 'Approved')}
                {st === 'rejected' && (isRtl ? 'مرفوضة' : 'Rejected')}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar + Quick Code Tester */}
        <div className="p-4 sm:p-6 pb-2 grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#17110F]">
          {/* Orders Search Input */}
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-[#B99A61]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isRtl
                  ? 'بحث بالاسم، رقم الهاتف، رقم الطلب، أو كود التفعيل...'
                  : 'Search by name, phone, order ID, or code...'
              }
              className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-black/40 border border-[#B99A61]/30 text-white placeholder-[#8C8276] text-xs focus:outline-none focus:border-[#E6CA85]"
            />
          </div>

          {/* Activation Code Test Tool */}
          <div className="md:col-span-5">
            <form onSubmit={handleTestVerifyCode} className="flex gap-2">
              <input
                type="text"
                value={testCodeInput}
                onChange={(e) => setTestCodeInput(e.target.value)}
                placeholder={isRtl ? 'جرّب كود تفعيل (مثال: ACT-XXXXXX)' : 'Test code (e.g. ACT-XXXXXX)'}
                className="flex-1 px-3 py-2.5 rounded-xl bg-black/40 border border-[#B99A61]/30 text-white font-mono placeholder-[#8C8276] text-xs uppercase focus:outline-none focus:border-[#E6CA85]"
              />
              <button
                type="submit"
                disabled={isVerifyingTest || !testCodeInput.trim()}
                className="px-3.5 py-2.5 rounded-xl bg-[#B99A61]/25 hover:bg-[#B99A61]/40 border border-[#B99A61]/40 text-[#E6CA85] hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isRtl ? 'اختبار الكود' : 'Verify'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Code Verification Result Banner (if tested) */}
        {testVerifyResult && (
          <div className="mx-4 sm:mx-6 mb-2 p-3 rounded-xl bg-black/60 border border-white/10 text-xs flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              {testVerifyResult.accessGranted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : testVerifyResult.status === 'pending' ? (
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold text-white block">{testVerifyResult.message}</span>
                {testVerifyResult.details && (
                  <span className="text-[11px] text-[#C8BFB5] block mt-0.5">
                    العميل: {testVerifyResult.details.customerName} | الهاتف: {testVerifyResult.details.customerPhone}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTestVerifyResult(null)}
              className="text-[#A69C8E] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Orders List Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {isLoading && orders.length === 0 ? (
            <div className="py-16 text-center text-[#B99A61] flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#E6CA85]" />
              <span className="text-sm font-semibold">
                {isRtl ? 'جاري جلب الطلبات من MongoDB...' : 'Loading orders from MongoDB...'}
              </span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-[#A69C8E] border border-dashed border-[#B99A61]/25 rounded-2xl">
              <Database className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#B99A61]" />
              <p className="text-sm font-medium">
                {isRtl ? 'لا توجد طلبات مطابقة للبحث حالياً.' : 'No matching orders found.'}
              </p>
              <p className="text-xs text-[#8C8276] mt-1">
                {isRtl
                  ? 'يمكنك تجربة إرسال طلب جديد من صفحة الشراء لترى تسجيله اللحظي هنا.'
                  : 'Submit a new order on checkout to view it live here.'}
              </p>
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const formattedDate = ord.createdAt
                ? new Date(ord.createdAt).toLocaleString(isRtl ? 'ar-KW' : 'en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : '—';

              const isUpdating = updatingOrderNum === ord.orderNumber;
              const waUrl = `https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `مرحباً ${ord.customerName}، بخصوص طلبك رقم ${ord.orderNumber} لكتاب أسرار وتناغم الأزياء الراقية، كود التفعيل المربوط بك هو: ${ord.activationCode}`
              )}`;

              return (
                <div
                  key={ord._id || ord.orderNumber}
                  className="rounded-2xl bg-[#140E0C] border border-[#B99A61]/25 hover:border-[#B99A61]/50 p-4 sm:p-5 transition-all shadow-md text-start relative group"
                >
                  {/* Top Bar: Order ID + Status + Amount */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#B99A61]/15">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-white tracking-wide">
                        {ord.orderNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(ord.orderNumber, ord.orderNumber)}
                        className="p-1 text-[#E6CA85] hover:text-white transition-colors cursor-pointer"
                        title={isRtl ? 'نسخ رقم الطلب' : 'Copy Order Number'}
                      >
                        {copiedId === ord.orderNumber ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          ord.status === 'approved' || ord.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : ord.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {ord.status === 'approved' || ord.status === 'paid' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{isRtl ? 'معتمد ومفعل' : 'Approved'}</span>
                          </>
                        ) : ord.status === 'rejected' ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>{isRtl ? 'مرفوض' : 'Rejected'}</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>{isRtl ? 'قيد الانتظار (Pending)' : 'Pending'}</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Amount & Currency */}
                    <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-[#E6CA85]">
                      <span>{ord.amount}</span>
                      <span className="text-xs text-[#B99A61]">{ord.currency}</span>
                    </div>
                  </div>

                  {/* Customer & Order Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 py-3 text-xs text-[#E5DED1]">
                    {/* Customer Name */}
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#B99A61] shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#A69C8E] block">{isRtl ? 'العميل' : 'Customer'}</span>
                        <span className="font-semibold text-white">{ord.customerName}</span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#B99A61] shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#A69C8E] block">{isRtl ? 'الهاتف' : 'Phone'}</span>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono font-semibold text-emerald-400 hover:underline inline-flex items-center gap-1"
                          title="Open WhatsApp chat"
                        >
                          <span>{ord.phone}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#B99A61] shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#A69C8E] block">{isRtl ? 'الإيميل' : 'Email'}</span>
                        <span className="text-[#C8BFB5]">{ord.email || '—'}</span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#B99A61] shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#A69C8E] block">{isRtl ? 'وقت الطلب' : 'Booked At'}</span>
                        <span className="text-[#C8BFB5] font-mono text-[11px]">{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Linked Activation Code Highlight Card */}
                  <div className="p-3 rounded-xl bg-[#1C1412] border border-[#B99A61]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#B99A61]/20 border border-[#B99A61]/40 flex items-center justify-center text-[#E6CA85]">
                        <KeyRound className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#B99A61] block font-semibold">
                          {isRtl ? 'كود التفعيل المربوط بهذا الأوردر:' : 'Linked Activation Code:'}
                        </span>
                        <span className="font-mono font-extrabold text-sm text-[#FFF] tracking-wider">
                          {ord.activationCode || '—'}
                        </span>
                      </div>
                      {ord.activationCode && (
                        <button
                          type="button"
                          onClick={() => handleCopy(ord.activationCode!, `code-${ord.orderNumber}`)}
                          className="p-1 text-[#E6CA85] hover:text-white transition-colors cursor-pointer"
                          title={isRtl ? 'نسخ الكود' : 'Copy Code'}
                        >
                          {copiedId === `code-${ord.orderNumber}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Admin Actions */}
                    <div className="flex items-center gap-2">
                      {ord.status !== 'approved' && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(ord.orderNumber, 'approved')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-sm disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'موافقة وتفعيل الكود' : 'Approve & Activate'}</span>
                        </button>
                      )}

                      {ord.status === 'approved' && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(ord.orderNumber, 'pending')}
                          className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200 text-xs transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'إعادة كـ معلق' : 'Set Pending'}</span>
                        </button>
                      )}

                      {ord.status !== 'rejected' && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(ord.orderNumber, 'rejected')}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-300 text-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isRtl ? 'رفض' : 'Reject'}
                        </button>
                      )}

                      {/* WhatsApp direct chat button */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/35 text-emerald-400 border border-[#25D366]/40 transition-colors"
                        title={isRtl ? 'محادثة العميل عبر واتساب' : 'Chat on WhatsApp'}
                      >
                        <WhatsAppIcon className="w-4 h-4 fill-current" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3.5 px-6 border-t border-[#B99A61]/20 bg-[#140E0C] text-[11px] text-[#A69C8E] flex flex-wrap items-center justify-between gap-2">
          <span>
            {isRtl
              ? 'يتم تحديث وحفظ الطلبات والأكواد بشكل دائم ومباشر في MongoDB Atlas.'
              : 'Orders and activation codes are persisted in MongoDB Atlas.'}
          </span>
          <span className="font-mono text-[#D8BF8A]">API: /api/orders & /api/codes</span>
        </div>
      </div>
    </div>
  );
};
