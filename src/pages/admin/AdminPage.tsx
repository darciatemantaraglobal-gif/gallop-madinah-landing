import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo-landscape.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ResourceEditor from "@/components/admin/ResourceEditor";
import { supabase } from "@/lib/supabase";
import { usePageMeta } from "@/lib/usePageMeta";
import { useAdminSession } from "@/lib/admin/useAdminSession";
import type { Row } from "@/lib/admin/fields";
import BookingsSection from "@/pages/admin/BookingsSection";
import RegistrationsSection from "@/pages/admin/RegistrationsSection";
import SettingsSection from "@/pages/admin/SettingsSection";
import {
  addonsConfig,
  agentsConfig,
  faqsConfig,
  membersConfig,
  packagesConfig,
  partnersConfig,
  testimonialsConfig,
  tiersConfig,
} from "@/pages/admin/resources";

const TABS = [
  { id: "booking", label: "Booking" },
  { id: "peserta", label: "Peserta" },
  { id: "member", label: "Member" },
  { id: "agen", label: "Agen" },
  { id: "harga", label: "Harga" },
  { id: "faq", label: "FAQ" },
  { id: "testimoni", label: "Testimoni" },
  { id: "partner", label: "Partner" },
  { id: "pengaturan", label: "Pengaturan" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const Centered = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-5">
    <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 space-y-5">
      <img src={logo} alt="Gallop Madinah" className="h-9 w-auto" />
      {children}
    </div>
  </div>
);

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) toast.error(error.message === "Invalid login credentials" ? "Email atau password salah." : error.message);
  };

  const forgot = async () => {
    if (!email.trim()) return toast.error("Isi email dulu, lalu tekan Lupa password.");
    const { error } = await supabase!.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin` });
    if (error) toast.error(error.message);
    else toast.success("Link ganti password dikirim ke email (cek juga folder spam).");
  };

  return (
    <Centered>
      <div>
        <h1 className="font-body font-bold text-lg text-foreground">Admin Gallop Madinah</h1>
        <p className="text-sm text-muted-foreground">Masuk untuk mengelola booking dan isi website.</p>
      </div>
      <form onSubmit={login} className="space-y-3">
        <Input type="email" autoComplete="username" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={busy}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />} Masuk
        </Button>
      </form>
      <button type="button" onClick={forgot} className="text-xs text-muted-foreground hover:text-gold">
        Lupa password?
      </button>
    </Centered>
  );
};

const NewPasswordForm = ({ onDone }: { onDone: () => void }) => {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Centered>
      <h1 className="font-body font-bold text-lg text-foreground">Buat password baru</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (password.length < 10) return toast.error("Password minimal 10 karakter.");
          setBusy(true);
          const { error } = await supabase!.auth.updateUser({ password });
          setBusy(false);
          if (error) toast.error(error.message);
          else {
            toast.success("Password diganti");
            onDone();
          }
        }}
        className="space-y-3"
      >
        <Input type="password" autoComplete="new-password" placeholder="Password baru (min. 10 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full" disabled={busy}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />} Simpan password
        </Button>
      </form>
    </Centered>
  );
};

/** Bookings per partner code for the current month, shown in the agent list. */
const AgentsSection = () => {
  const { data: recap = {} } = useQuery({
    queryKey: ["admin", "agent-recap"],
    queryFn: async () => {
      const now = new Date();
      const first = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      const { data, error } = await supabase!
        .from("bookings")
        .select("agent_code, people, status")
        .neq("agent_code", "")
        .gte("ride_date", first)
        .neq("status", "batal");
      if (error) throw error;
      const m: Record<string, { bookings: number; people: number }> = {};
      for (const b of data ?? []) {
        const k = String(b.agent_code);
        m[k] = { bookings: (m[k]?.bookings ?? 0) + 1, people: (m[k]?.people ?? 0) + Number(b.people) };
      }
      return m;
    },
  });
  return <ResourceEditor config={agentsConfig(recap)} />;
};

const AdminPage = () => {
  usePageMeta("Admin · Gallop Madinah", { noindex: true });
  const { ready, session, isAdmin, recovering, clearRecovery } = useAdminSession();
  const [tab, setTab] = useState<Tab>("booking");
  const [riderFilter, setRiderFilter] = useState("");
  const [memberPrefill, setMemberPrefill] = useState<Row | null>(null);

  if (!supabase)
    return (
      <Centered>
        <p className="text-sm text-foreground">Database belum tersambung.</p>
        <p className="text-xs text-muted-foreground">
          Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY di Vercel, lalu deploy ulang. Panduan ada di docs/setup-supabase.md.
        </p>
      </Centered>
    );

  if (!ready)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );

  if (recovering && session) return <NewPasswordForm onDone={clearRecovery} />;
  if (!session) return <LoginForm />;

  if (!isAdmin)
    return (
      <Centered>
        <div className="flex gap-2 text-sm text-foreground">
          <ShieldAlert className="w-5 h-5 text-gold flex-shrink-0" />
          Akun {session.user.email} belum diberi akses admin.
        </div>
        <p className="text-xs text-muted-foreground">Minta pemilik website menjalankan perintah pemberian akses admin (lihat docs/setup-supabase.md), lalu masuk ulang.</p>
        <Button variant="outline" onClick={() => supabase!.auth.signOut()}>
          <LogOut className="w-4 h-4" /> Keluar
        </Button>
      </Centered>
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img src={logo} alt="Gallop Madinah" className="h-7 w-auto" />
            <span className="text-xs text-gold font-bold tracking-[0.15em] uppercase">Admin</span>
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden sm:block text-xs text-muted-foreground truncate">{session.user.email}</span>
            <Button size="sm" variant="ghost" onClick={() => supabase!.auth.signOut()}>
              <LogOut className="w-4 h-4" /> Keluar
            </Button>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Menu admin">
          <ul className="flex gap-1 pb-2">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={tab === t.id ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                    tab === t.id ? "bg-gold text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
        {tab === "booking" && (
          <BookingsSection
            onShowRiders={(code) => {
              setRiderFilter(code);
              setTab("peserta");
            }}
            onCreateMember={(prefill) => {
              setMemberPrefill(prefill);
              setTab("member");
            }}
          />
        )}
        {tab === "peserta" && <RegistrationsSection filter={riderFilter} onFilter={setRiderFilter} />}
        {tab === "member" && <ResourceEditor config={membersConfig} prefill={memberPrefill} onPrefillUsed={() => setMemberPrefill(null)} />}
        {tab === "agen" && <AgentsSection />}
        {tab === "harga" && (
          <div className="space-y-10">
            <ResourceEditor config={packagesConfig} />
            <ResourceEditor config={tiersConfig} />
            <ResourceEditor config={addonsConfig} />
          </div>
        )}
        {tab === "faq" && <ResourceEditor config={faqsConfig} />}
        {tab === "testimoni" && <ResourceEditor config={testimonialsConfig} />}
        {tab === "partner" && <ResourceEditor config={partnersConfig} />}
        {tab === "pengaturan" && <SettingsSection />}
      </main>
    </div>
  );
};

export default AdminPage;
