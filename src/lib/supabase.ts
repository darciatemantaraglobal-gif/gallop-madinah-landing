import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// One shared Supabase client. Uses the publishable key (sb_publishable_…), which is safe in the
// browser: row level security in the database decides what each visitor or admin may do.
// Without the env vars the site still works on its built-in data (and bookings go by WhatsApp only).

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? "";
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim() ?? "";

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

export const backendConnected = () => supabase !== null;

/** Public URL bucket for partner logos and member photos. */
export const MEDIA_BUCKET = "media";

/** Rejects after `ms` so a slow network never holds up the page. */
export function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    Promise.resolve(promise).then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}
