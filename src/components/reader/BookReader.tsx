import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Maximize,
  Minimize,
  BookOpen,
  Columns,
  Square,
  Upload,
  RefreshCw,
  Sparkles,
  Shield,
  FileText,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { BrandMonogram } from '../ui/BrandMonogram';
import { pdfjsLib, getPdfDocumentOptions } from '../../lib/pdfWorker';
import { savePdfToStorage, loadPdfFromStorage, clearPdfFromStorage } from '../../lib/pdfStorage';
import { PdfPageCanvas } from './PdfPageCanvas';

interface BookReaderProps {
  onClose: () => void;
  defaultPdfUrl?: string;
}

export const BookReader: React.FC<BookReaderProps> = ({
  onClose,
  defaultPdfUrl = '/munira_web_compatible.pdf',
}) => {
  const { isRtl, language } = useLanguage();
  const readerRootRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Document state
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [fileName, setFileName] = useState<string>('دليل نجاح مشروع الأزياء — منيرة الحربي.pdf');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoadingDoc, setIsLoadingDoc] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Navigation & View state
  const initialPage = parseInt(localStorage.getItem('munira_reader_last_page') || '1', 10);
  const [currentPage, setCurrentPage] = useState<number>(Math.max(1, initialPage));
  const [isTwoPageMode, setIsTwoPageMode] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(0.95);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Touch Swipe & Pinch-to-zoom for Mobile
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchInitialDistRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(scale);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Responsive two-page vs single-page auto-detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsTwoPageMode(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save last-read page in localStorage
  useEffect(() => {
    if (currentPage >= 1) {
      localStorage.setItem('munira_reader_last_page', String(currentPage));
    }
  }, [currentPage]);

  // Load PDF from IndexedDB or static URL on mount
  useEffect(() => {
    let isCancelled = false;

    const initDocument = async () => {
      setIsLoadingDoc(true);
      setLoadError(null);

      try {
        // 1. Try to load from IndexedDB cache
        const cached = await loadPdfFromStorage();
        if (cached && cached.data) {
          const loadingTask = pdfjsLib.getDocument(getPdfDocumentOptions({ data: cached.data }));
          const doc = await loadingTask.promise;
          if (isCancelled) return;
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setFileName(cached.name);
          setIsLoadingDoc(false);
          return;
        }

        // 2. Try default PDF URLs (checking munira_web_compatible.pdf first)
        const candidateUrls = Array.from(
          new Set(['/munira_web_compatible.pdf', defaultPdfUrl, '/book.pdf'].filter(Boolean))
        ) as string[];

        for (const url of candidateUrls) {
          try {
            const resp = await fetch(url);
            if (resp.ok) {
              const buffer = await resp.arrayBuffer();
              if (buffer && buffer.byteLength > 100) {
                const header = new Uint8Array(buffer.slice(0, 5));
                const headerStr = String.fromCharCode(...header);
                if (headerStr.startsWith('%PDF')) {
                  const loadingTask = pdfjsLib.getDocument(getPdfDocumentOptions({ data: buffer }));
                  const doc = await loadingTask.promise;
                  if (isCancelled) return;
                  setPdfDoc(doc);
                  setTotalPages(doc.numPages);
                  setFileName('munira_web_compatible.pdf');
                  setIsLoadingDoc(false);
                  return;
                }
              }
            }
          } catch {
            // Static candidate not present, try next
          }
        }

        // 3. No document yet, show upload interface
        if (!isCancelled) {
          setIsLoadingDoc(false);
        }
      } catch (err: any) {
        console.error('Failed to load PDF document:', err);
        if (!isCancelled) {
          setLoadError(err?.message || 'تعذر تحميل ملف الـ PDF');
          setIsLoadingDoc(false);
        }
      }
    };

    initDocument();

    return () => {
      isCancelled = true;
    };
  }, [defaultPdfUrl]);

  // Handle local PDF file upload
  const handleFileUpload = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      alert(isRtl ? 'يرجى اختيار ملف PDF صالح' : 'Please select a valid PDF file');
      return;
    }

    setIsLoadingDoc(true);
    setLoadError(null);

    try {
      const buffer = await file.arrayBuffer();
      await savePdfToStorage(buffer, file.name);

      const loadingTask = pdfjsLib.getDocument(getPdfDocumentOptions({ data: buffer }));
      const doc = await loadingTask.promise;

      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setFileName(file.name);
      setCurrentPage(1);
      setIsLoadingDoc(false);
    } catch (err: any) {
      console.error('Error loading uploaded PDF:', err);
      setLoadError(err?.message || 'تعذر قراءة ملف الـ PDF المرفق');
      setIsLoadingDoc(false);
    }
  };

  // Change / Remove current PDF to upload another
  const handleResetPdf = async () => {
    if (confirm(isRtl ? 'هل تريدين إزالة الملف الحالي واختيار ملف آخر؟' : 'Replace current PDF?')) {
      await clearPdfFromStorage();
      setPdfDoc(null);
      setTotalPages(0);
      setCurrentPage(1);
      localStorage.removeItem('munira_reader_last_page');
    }
  };

  // Navigation Logic
  // In Two-Page spread:
  // Cover is Page 1 (alone on right).
  // Then spreads are: (2, 3), (4, 5), (6, 7), etc.
  const isCoverPage = currentPage === 1 && isTwoPageMode;
  const leftPageNumber = isTwoPageMode && !isCoverPage ? currentPage + 1 : null;
  const rightPageNumber = currentPage;

  const goToNextPage = useCallback(() => {
    if (!pdfDoc) return;
    setCurrentPage((prev) => {
      if (isTwoPageMode) {
        if (prev === 1) {
          return Math.min(2, totalPages);
        }
        return Math.min(prev + 2, totalPages);
      }
      return Math.min(prev + 1, totalPages);
    });
  }, [pdfDoc, isTwoPageMode, totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => {
      if (isTwoPageMode) {
        if (prev <= 3) {
          return 1;
        }
        return Math.max(1, prev - 2);
      }
      return Math.max(1, prev - 1);
    });
  }, [isTwoPageMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // In RTL Arabic reading:
      // Left Arrow advances forward into the book, Right Arrow goes backward
      // (or standard Next/Prev keys)
      if (e.key === 'ArrowLeft') {
        isRtl ? goToNextPage() : goToPrevPage();
      } else if (e.key === 'ArrowRight') {
        isRtl ? goToPrevPage() : goToNextPage();
      } else if (e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage, isRtl, onClose]);

  // Touch swipe & pinch-to-zoom support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      touchInitialDistRef.current = null;
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchInitialDistRef.current = dist;
      initialScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchInitialDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchInitialDistRef.current;
      const newScale = Math.min(Math.max(initialScaleRef.current * factor, 0.5), 2.4);
      setScale(parseFloat(newScale.toFixed(2)));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      touchInitialDistRef.current = null;
    }
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only respond to horizontal swipes
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swiped Left
        isRtl ? goToNextPage() : goToPrevPage();
      } else {
        // Swiped Right
        isRtl ? goToPrevPage() : goToNextPage();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Zoom helpers
  const handleZoomIn = () => setScale((s) => Math.min(s + 0.15, 2.0));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.15, 0.6));
  const handleFitPage = () => setScale(0.95);
  const handleFitWidth = () => setScale(1.35);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRootRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={readerRootRef}
      className="fixed inset-0 z-50 bg-[#140F0D] text-[#F7F2EA] flex flex-col select-none overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 
        ========================================================================
        READER TOP BAR (LUXURY ATELIER CHROME)
        ========================================================================
      */}
      <header className="h-16 shrink-0 bg-[#1C1614] border-b border-[#B99A61]/30 px-3 sm:px-6 flex items-center justify-between gap-3 z-30 shadow-2xl">
        
        {/* Left / Start Zone: Return to Landing Page Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#281F1B] border border-[#B99A61]/40 text-[#E6CA85] hover:bg-[#B99A61] hover:text-[#16110F] transition-all duration-200 text-xs sm:text-sm font-bold font-arabic-display shadow-md cursor-pointer group"
            aria-label="العودة للموقع"
          >
            {isRtl ? (
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
            )}
            <span>{isRtl ? 'العودة للموقع' : 'Back to Website'}</span>
          </button>

          <div className="hidden md:flex items-center gap-2 pr-2 border-r border-[#B99A61]/25 rtl:border-r-0 rtl:border-l rtl:pl-2">
            <BrandMonogram size={26} showWordmark={false} />
            <span className="text-xs font-editorial-serif tracking-widest text-[#B99A61] uppercase hidden xl:inline">
              ATELIER READER • DEMO
            </span>
          </div>
        </div>

        {/* Center Zone: Document Title & Page Counter */}
        <div className="flex flex-col items-center text-center truncate px-2">
          <span className="text-xs sm:text-sm font-bold font-arabic-display text-[#F7F2EA] truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {fileName}
          </span>
          {pdfDoc && totalPages > 0 && (
            <span className="text-[10px] sm:text-[11px] font-editorial-serif text-[#D8BF8A]">
              {isTwoPageMode && !isCoverPage && leftPageNumber && leftPageNumber <= totalPages
                ? `${isRtl ? 'الصفحات' : 'Pages'} ${rightPageNumber} - ${leftPageNumber} ${isRtl ? 'من' : 'of'} ${totalPages}`
                : `${isRtl ? 'صفحة' : 'Page'} ${currentPage} ${isRtl ? 'من' : 'of'} ${totalPages}`}
            </span>
          )}
        </div>

        {/* Right / End Zone: Reading Mode & Zoom Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {pdfDoc && (
            <>
              {/* Spread Mode Toggle (Only on >= 1024px desktop) */}
              <button
                onClick={() => setIsTwoPageMode((prev) => !prev)}
                className={`hidden lg:flex p-2 rounded-lg border transition-colors ${
                  isTwoPageMode
                    ? 'bg-[#B99A61]/20 border-[#B99A61] text-[#E6CA85]'
                    : 'bg-white/[0.04] border-[#B99A61]/25 text-[#E5DED1] hover:text-[#E6CA85]'
                }`}
                title={isTwoPageMode ? 'وضع الصفحة الواحدة' : 'وضع الصفحتين المزدوج'}
              >
                {isTwoPageMode ? <Columns className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              </button>

              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center gap-1 bg-white/[0.04] border border-[#B99A61]/25 rounded-lg p-0.5">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded text-[#E5DED1] hover:text-[#E6CA85] transition-colors"
                  title="تصغير"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-[#D8BF8A] px-1 min-w-[40px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded text-[#E5DED1] hover:text-[#E6CA85] transition-colors"
                  title="تكبير"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Fit to Page & Fit to Width Controls */}
              <div className="hidden xl:flex items-center gap-1">
                <button
                  onClick={handleFitPage}
                  className="px-2 py-1.5 rounded-lg bg-white/[0.04] border border-[#B99A61]/25 text-[#E5DED1] hover:text-[#E6CA85] transition-colors text-[11px] font-arabic-display flex items-center gap-1"
                  title={isRtl ? 'ملاءمة الصفحة' : 'Fit to Page'}
                >
                  <Minimize className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'ملء الصفحة' : 'Fit Page'}</span>
                </button>
                <button
                  onClick={handleFitWidth}
                  className="px-2 py-1.5 rounded-lg bg-white/[0.04] border border-[#B99A61]/25 text-[#E5DED1] hover:text-[#E6CA85] transition-colors text-[11px] font-arabic-display flex items-center gap-1"
                  title={isRtl ? 'ملاءمة العرض' : 'Fit to Width'}
                >
                  <Maximize className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'ملء العرض' : 'Fit Width'}</span>
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="hidden sm:flex p-2 rounded-lg bg-white/[0.04] border border-[#B99A61]/25 text-[#E5DED1] hover:text-[#E6CA85] transition-colors"
                title={isRtl ? 'ملء الشاشة' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Re-upload / Change PDF button */}
              <button
                onClick={handleResetPdf}
                className="p-2 rounded-lg bg-white/[0.04] border border-[#B99A61]/25 text-[#E5DED1] hover:text-[#E6CA85] transition-colors text-xs flex items-center gap-1"
                title={isRtl ? 'تغيير ملف الـ PDF' : 'Change PDF file'}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px] font-arabic-display">{isRtl ? 'ملف آخر' : 'Change'}</span>
              </button>
            </>
          )}

          {/* Dedicated Language Switcher inside reader toolbar */}
          <LanguageSwitcher className="hidden sm:inline-flex scale-90 origin-end" />
        </div>
      </header>

      {/* 
        ========================================================================
        READER MAIN STAGE
        ========================================================================
      */}
      <main
        className="flex-1 relative overflow-auto flex items-center justify-center p-3 sm:p-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* State A: Loading PDF document */}
        {isLoadingDoc && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full border-3 border-[#B99A61]/30 border-t-[#B99A61] animate-spin mb-4" />
            <h3 className="text-lg font-bold font-arabic-display text-[#F7F2EA] mb-1">
              {isRtl ? 'جارٍ تهيئة صفحات الدليل بدقة عالية…' : 'Preparing High-Res Canvas Pages…'}
            </h3>
            <p className="text-xs text-[#D8BF8A]">
              {isRtl ? 'معالجة عبر PDF.js بدون ضياع لأي تفصيلة' : 'Rendering with PDF.js engine'}
            </p>
          </div>
        )}

        {/* State B: No PDF loaded yet -> Luxury Atelier Local File Upload Zone */}
        {!isLoadingDoc && !pdfDoc && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className={`max-w-xl w-full p-6 sm:p-10 rounded-3xl bg-[#1D1714] border-2 shadow-2xl text-center flex flex-col items-center transition-all duration-300 ${
              isDraggingFile
                ? 'border-[#E6CA85] bg-[#2A201C] scale-[1.02]'
                : 'border-[#B99A61]/40'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#B99A61]/20 border border-[#B99A61]/60 flex items-center justify-center mb-6 text-[#E6CA85] shadow-inner">
              <BookOpen className="w-8 h-8" />
            </div>

            <span className="text-xs font-editorial-serif tracking-widest text-[#B99A61] uppercase block mb-2 font-semibold">
              MUNIRA ALHARBI • DEMO READER
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-arabic-display text-[#F7F2EA] mb-3 text-depth-arabic-title">
              {isRtl ? 'معاينة دليل نجاح مشروع الأزياء' : 'Preview The Fashion Business Guide'}
            </h3>

            <p className="text-xs sm:text-sm text-[#E5DED1]/85 font-arabic-body leading-relaxed max-w-md mb-8">
              {isRtl
                ? 'ارفعي ملف الـ PDF الأصلي الخاص بالدليل لمعاينته فوراً داخل قارئ الكتب التفاعلي، بنظام الصفحات المزدوجة ومطابقة 100% لتصميم الكتاب الأصلي.'
                : 'Upload the original PDF to preview it inside the interactive double-spread reader, 100% faithful to the original book design.'}
            </p>

            {/* Error notice if any */}
            {loadError && (
              <div className="w-full mb-6 p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-2 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loadError}</span>
              </div>
            )}

            {/* Dropzone & File Input Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="luxury-pulse-cta group w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B99A61] via-[#E6CA85] to-[#B99A61] text-[#16110F] font-bold text-base font-arabic-display shadow-2xl flex items-center justify-center gap-3 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="w-5 h-5 text-[#16110F]" />
              <span>{isRtl ? 'اختيار ملف PDF من جهازك' : 'Select PDF from Device'}</span>
            </button>

            <span className="text-[11px] text-[#D8BF8A]/75 mt-4 block">
              {isRtl
                ? '🔒 العرض مؤقت ومحمي على مستوى الواجهة دون تخزين على أي خوادم خارجية'
                : '🔒 Local canvas-rendered demo prototype'}
            </span>
          </div>
        )}

        {/* State C: Active PDF loaded -> Live Render Stage */}
        {!isLoadingDoc && pdfDoc && (
          <div className="relative flex items-center justify-center min-h-full">
            
            {/* Two-Page Spread Layout */}
            {isTwoPageMode ? (
              <div className="relative flex items-center justify-center">
                {isCoverPage ? (
                  /* Single Cover Page (Centered) */
                  <div className="relative group">
                    <PdfPageCanvas
                      pdfDoc={pdfDoc}
                      pageNumber={1}
                      scale={scale}
                      isCover={true}
                    />
                  </div>
                ) : (
                  /* Two-Page Spread (Arabic RTL: Right is Page N, Left is Page N+1) */
                  <div
                    className="relative flex items-center shadow-[0_30px_70px_rgba(0,0,0,0.9)] rounded-sm bg-[#181210]"
                    dir="rtl"
                  >
                    
                    {/* Arabic Right Page (Earlier Page N) */}
                    <div className="relative border-l border-black/40">
                      <PdfPageCanvas
                        pdfDoc={pdfDoc}
                        pageNumber={rightPageNumber}
                        scale={scale}
                      />
                    </div>

                    {/* Book Spine Center Fold Realistic Shadow */}
                    <div
                      className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-20"
                      style={{
                        background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.5) 100%)',
                      }}
                    />

                    {/* Arabic Left Page (Subsequent Page N+1 if exists) */}
                    {leftPageNumber && leftPageNumber <= totalPages ? (
                      <div className="relative border-r border-black/40">
                        <PdfPageCanvas
                          pdfDoc={pdfDoc}
                          pageNumber={leftPageNumber}
                          scale={scale}
                        />
                      </div>
                    ) : (
                      /* Blank placeholder for last odd page in spread */
                      <div
                        className="bg-[#1C1614] flex items-center justify-center border-r border-black/40"
                        style={{
                          width: `${Math.floor(360 * scale)}px`,
                          height: `${Math.floor(510 * scale)}px`,
                        }}
                      >
                        <BrandMonogram size={40} showWordmark={false} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Single Page Layout (Mobile / Tablet / Focused view) */
              <div className="relative flex items-center justify-center shadow-2xl">
                <PdfPageCanvas
                  pdfDoc={pdfDoc}
                  pageNumber={currentPage}
                  scale={scale}
                  isCover={currentPage === 1}
                />
              </div>
            )}

          </div>
        )}
      </main>

      {/* 
        ========================================================================
        READER BOTTOM CONTROL BAR (PAGINATION & SHORTCUTS)
        ========================================================================
      */}
      {pdfDoc && totalPages > 0 && (
        <footer className="h-16 shrink-0 bg-[#1C1614] border-t border-[#B99A61]/30 px-4 sm:px-8 flex items-center justify-between gap-4 z-30 shadow-2xl">
          
          {/* Previous Page Button (In RTL: Left Arrow goes forward in page, Right Arrow goes back) */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold font-arabic-display transition-all ${
              currentPage <= 1
                ? 'opacity-35 cursor-not-allowed border-white/10 text-white/40'
                : 'bg-[#281F1B] border-[#B99A61]/40 text-[#E6CA85] hover:bg-[#B99A61] hover:text-[#16110F] cursor-pointer'
            }`}
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span className="hidden sm:inline">{isRtl ? 'الصفحة السابقة' : 'Previous'}</span>
          </button>

          {/* Slider / Page Quick Select */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#D8BF8A] font-mono">
              1
            </span>
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
              className="w-24 sm:w-48 lg:w-64 accent-[#B99A61] cursor-pointer"
            />
            <span className="text-xs text-[#D8BF8A] font-mono">
              {totalPages}
            </span>
          </div>

          {/* Next Page Button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold font-arabic-display transition-all ${
              currentPage >= totalPages
                ? 'opacity-35 cursor-not-allowed border-white/10 text-white/40'
                : 'bg-[#281F1B] border-[#B99A61]/40 text-[#E6CA85] hover:bg-[#B99A61] hover:text-[#16110F] cursor-pointer'
            }`}
          >
            <span className="hidden sm:inline">{isRtl ? 'الصفحة التالية' : 'Next'}</span>
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </footer>
      )}
    </div>
  );
};
