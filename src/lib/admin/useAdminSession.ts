import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AdminSession = {
  ready: boolean;
  session: Session | null;
  /** app_metadata is set by the owner in the database, never by the user. The database enforces
   *  the same check in every policy, so this flag only decides what the screen shows. */
  isAdmin: boolean;
  /** Opened from a "reset password" email: show the new-password form. */
  recovering: boolean;
};

export function useAdminSession(): AdminSession & { clearRecovery: () => void } {
  const [state, setState] = useState<AdminSession>({ ready: !supabase, session: null, isAdmin: false, recovering: false });

  useEffect(() => {
    if (!supabase) return;
    const apply = (session: Session | null, recovering?: boolean) =>
      setState((s) => ({
        ready: true,
        session,
        isAdmin: session?.user.app_metadata?.role === "admin",
        recovering: recovering ?? s.recovering,
      }));
    supabase.auth.getSession().then(({ data }) => apply(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, session) => apply(session, event === "PASSWORD_RECOVERY" ? true : undefined));
    return () => data.subscription.unsubscribe();
  }, []);

  return { ...state, clearRecovery: () => setState((s) => ({ ...s, recovering: false })) };
}
