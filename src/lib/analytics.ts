import { AttributionParams } from '../types';

export type AnalyticsEventName =
  | 'page_view'
  | 'view_item'
  | 'select_buy_cta'
  | 'explore_chapters_cta'
  | 'preview_page_viewed'
  | 'open_book_reader_demo'
  | 'begin_checkout'
  | 'payment_proof_submitted'
  | 'purchase';

export interface AnalyticsEventPayload {
  eventName: AnalyticsEventName;
  properties?: Record<string, unknown>;
  timestamp: number;
  eventId?: string;
}

const ATTRIBUTION_STORAGE_KEY = 'munira_fashion_attribution';

/**
 * Capture campaign attribution parameters from the current URL query string.
 * Preserves UTMs and ad click IDs (gclid, fbclid, sc_click_id) for conversion modeling.
 */
export const captureAttribution = (): AttributionParams | null => {
  if (typeof window === 'undefined') return null;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmContent = urlParams.get('utm_content');
    const utmTerm = urlParams.get('utm_term');
    const gclid = urlParams.get('gclid');
    const fbclid = urlParams.get('fbclid');
    const scClickId = urlParams.get('sc_click_id');

    if (
      utmSource ||
      utmMedium ||
      utmCampaign ||
      utmContent ||
      utmTerm ||
      gclid ||
      fbclid ||
      scClickId
    ) {
      const attribution: AttributionParams = {
        utm_source: utmSource || undefined,
        utm_medium: utmMedium || undefined,
        utm_campaign: utmCampaign || undefined,
        utm_content: utmContent || undefined,
        utm_term: utmTerm || undefined,
        gclid: gclid || undefined,
        fbclid: fbclid || undefined,
        sc_click_id: scClickId || undefined,
        timestamp: Date.now(),
      };

      sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
      return attribution;
    }

    // Retrieve existing attribution if not present in current URL
    const existing = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (existing) {
      return JSON.parse(existing);
    }
  } catch {
    // Non-fatal if storage is unavailable
  }

  return null;
};

/**
 * Typed client-side analytics event dispatcher.
 * In development, logs events to console. Ready to connect to GA4, Meta Pixel, Snapchat Pixel in future backend phases.
 */
export const trackEvent = (
  eventName: AnalyticsEventName,
  properties: Record<string, unknown> = {}
): void => {
  const attribution = captureAttribution();
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const payload: AnalyticsEventPayload = {
    eventName,
    properties: {
      ...properties,
      attribution,
    },
    timestamp: Date.now(),
    eventId,
  };

  // Safe developer inspection log
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[Fashion Analytics Dispatch]', payload);
  }

  // Prepared hooks for future pixel/CAPI forwarding:
  // e.g. window.gtag?.('event', eventName, payload.properties);
  // e.g. window.fbq?.('trackCustom', eventName, payload.properties);
};
