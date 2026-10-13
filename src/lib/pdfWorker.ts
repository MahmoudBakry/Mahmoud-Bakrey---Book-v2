import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Use the local worker or fallback to Vite bundled worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl || `${window.location.origin}/pdf.worker.min.mjs`;
}

/**
 * Standard configuration for pdfjsLib.getDocument to ensure Arabic and complex RTL
 * scripts render with complete character mappings (CMaps), standard font definitions,
 * and proper glyph ligatures.
 */
export function getPdfDocumentOptions(source: { data?: ArrayBuffer | Uint8Array; url?: string }) {
  const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';

  return {
    ...source,
    // Predefined Adobe Character Maps for mapping CIDs and Unicode ligatures (essential for Arabic)
    cMapUrl: origin ? `${origin}/cmaps/` : '/cmaps/',
    cMapPacked: true,
    // Standard PDF font data (Liberation, Foxit serif/sans fallback glyphs)
    standardFontDataUrl: origin ? `${origin}/standard_fonts/` : '/standard_fonts/',
    // WebAssembly decoders for high-performance JPX/JBIG2/QCMS image rendering
    wasmUrl: origin ? `${origin}/wasm/` : '/wasm/',
    useWorkerFetch: true,
    enableXfa: true,
    useSystemFonts: true,
    // When PDFs contain visually reversed Arabic or non-standard glyph indices,
    // setting disableFontFace to false uses FontFace, while true renders glyph paths directly.
    disableFontFace: false,
  };
}

export { pdfjsLib };
