// Google Analytics 4 (gtag) and Meta Pixel (fbq).
// Both load only when their ID is set in the environment (VITE_GA_ID, VITE_META_PIXEL_ID),
// so local development and previews send nothing. Every call is safe to make either way.

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; callMethod?: (...args: unknown[]) => void };
    _fbq?: unknown;
  }
}

const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined)?.trim();
const PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined)?.trim();

/** Pages that are not for customers (e.g. the owner proposal) are kept out of the stats. */
const UNTRACKED_PATHS = ["/penawaran"];

/** Meta Pixel standard events that some of our custom events map to. */
const META_STANDARD: Record<string, string> = {
  wa_click: "Contact",
  booking_submit: "Lead",
  registrasi_submit: "CompleteRegistration",
};

let started = false;

function loadScript(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/** Call once at startup. */
export function initAnalytics() {
  if (started || typeof window === "undefined") return;
  started = true;

  if (GA_ID && /^G-[A-Z0-9]+$/i.test(GA_ID)) {
    window.dataLayer = window.dataLayer || [];
    // gtag must push the `arguments` object itself, not an array copy.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    // Page views are sent by trackPageView on every route change (this is a single-page app).
    window.gtag("config", GA_ID, { send_page_view: false });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`);
  }

  if (PIXEL_ID && /^\d+$/.test(PIXEL_ID) && !window.fbq) {
    // Meta's standard bootstrap: queue calls until fbevents.js arrives.
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue!.push(args);
    } as NonNullable<Window["fbq"]> & { push?: unknown; loaded?: boolean; version?: string };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;
    loadScript("https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", PIXEL_ID);
  }
}

export function trackPageView(path: string) {
  if (UNTRACKED_PATHS.some((p) => path === p || path.startsWith(`${p}?`) || path.startsWith(`${p}/`))) return;
  try {
    window.gtag?.("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
    window.fbq?.("track", "PageView");
  } catch {
    /* analytics must never break the page */
  }
}

export function track(event: string, params: Params = {}) {
  if (UNTRACKED_PATHS.some((p) => window.location.pathname.startsWith(p))) return;
  try {
    window.gtag?.("event", event, params);
    const meta = META_STANDARD[event];
    if (meta) window.fbq?.("track", meta, params);
    else window.fbq?.("trackCustom", event, params);
  } catch {
    /* analytics must never break the page */
  }
}
