import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { FALLBACK_DATA, parseSiteData, type SiteData } from "@/data/siteData";
import { supabase, withTimeout } from "@/lib/supabase";
import { loadSiteRows } from "@/lib/backend";

// Prices, FAQ, partners, testimonials, booking settings and safety rules come from the database
// (edited in /admin). Anything missing, slow, or malformed falls back to FALLBACK_DATA, so a bad
// entry or an outage can never break the website.

const TIMEOUT_MS = 5000;

export async function fetchSiteData(client: SupabaseClient | null = supabase): Promise<SiteData> {
  if (!client) return FALLBACK_DATA;
  try {
    // Each section is taken from the database only if it is valid on its own.
    return parseSiteData(await withTimeout(loadSiteRows(client), TIMEOUT_MS));
  } catch {
    return FALLBACK_DATA;
  }
}

export const SITE_DATA_KEY = ["site-data"] as const;

export function useSiteData(): SiteData {
  const { data } = useQuery({
    queryKey: SITE_DATA_KEY,
    queryFn: () => fetchSiteData(),
    staleTime: 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
  // Render immediately with the fallback; swap to database data once it arrives.
  return data ?? FALLBACK_DATA;
}
