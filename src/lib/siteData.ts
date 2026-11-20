import { useQuery } from "@tanstack/react-query";
import { FALLBACK_DATA, parseSiteData, type SiteData } from "@/data/siteData";
import { SHEET_API_URL } from "@/lib/sheetApi";

// Reads prices (and later FAQ, partners, testimonials) from the Google Sheet through the
// Apps Script web app. Anything missing, slow, or malformed falls back to FALLBACK_DATA,
// so a typo in the Sheet can never break the website.

const API_URL = SHEET_API_URL;
const TIMEOUT_MS = 4000;

export async function fetchSiteData(url = API_URL): Promise<SiteData> {
  if (!url) return FALLBACK_DATA;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${url}?action=config`, { signal: controller.signal });
    if (!res.ok) return FALLBACK_DATA;
    // Each section is taken from the Sheet only if it is valid on its own.
    return parseSiteData(await res.json());
  } catch {
    return FALLBACK_DATA;
  } finally {
    clearTimeout(timer);
  }
}

export function useSiteData(): SiteData {
  const { data } = useQuery({
    queryKey: ["site-data"],
    queryFn: () => fetchSiteData(),
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
  // Render immediately with the fallback; swap to Sheet data once it arrives.
  return data ?? FALLBACK_DATA;
}
