import React, { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

interface PdfPageCanvasProps {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  watermarkText?: string;
  isCover?: boolean;
}

export const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({
  pdfDoc,
  pageNumber,
  scale,
  watermarkText = 'نسخة تجريبية — MUNIRA ALHARBI',
  isCover = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    let isCancelled = false;

    const renderPage = async () => {
      if (!canvasRef.current || !pdfDoc || pageNumber < 1 || pageNumber > pdfDoc.numPages) {
        return;
      }

      setLoading(true);

      // Cancel any ongoing rendering task for this canvas
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      try {
        const page: PDFPageProxy = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);
        const viewport = page.getViewport({ scale: scale * pixelRatio });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const displayWidth = Math.floor(viewport.width / pixelRatio);
        const displayHeight = Math.floor(viewport.height / pixelRatio);
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        setDimensions({ width: displayWidth, height: displayHeight });

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const renderContext = {
          canvasContext: ctx,
          canvas,
          viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        if (!isCancelled) {
          setLoading(false);
        }
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error(`Error rendering page ${pageNumber}:`, err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [pdfDoc, pageNumber, scale]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden transition-all duration-300 ${
        isCover
          ? 'shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-r-sm'
          : 'shadow-[0_15px_40px_rgba(0,0,0,0.7)]'
      }`}
      style={{
        width: dimensions.width ? `${dimensions.width}px` : 'auto',
        height: dimensions.height ? `${dimensions.height}px` : 'auto',
        backgroundColor: '#1E1715',
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Loading Skeleton */}
      {loading && (
        <div
          className="absolute inset-0 bg-[#251D1A]/90 backdrop-blur-sm flex items-center justify-center z-10 animate-pulse"
          style={{ width: dimensions.width || 360, height: dimensions.height || 500 }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#B99A61]/30 border-t-[#B99A61] animate-spin" />
            <span className="text-[11px] font-editorial-serif text-[#D8BF8A]">
              صفحة {pageNumber}
            </span>
          </div>
        </div>
      )}

      {/* The Actual Rendered Canvas */}
      <canvas
        ref={canvasRef}
        className="block pointer-events-none mx-auto"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Subtle Luxury Security Watermark Overlay */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden"
        style={{
          background: 'transparent',
        }}
        aria-hidden="true"
      >
        <span
          className="font-editorial-serif tracking-widest text-[#B99A61] font-bold text-xs sm:text-sm uppercase opacity-[0.08] transform -rotate-45 select-none whitespace-nowrap"
        >
          {watermarkText} • صفحة {pageNumber}
        </span>
      </div>

      {/* Page Corner Number Indicator on Canvas bottom */}
      <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-[#D8BF8A] font-mono">
          {pageNumber}
        </span>
      </div>
    </div>
  );
};
