import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Clock, IdCard, Loader2, MessageCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { dbErrorMessage } from "@/components/admin/ResourceEditor";
import { formatSar } from "@/lib/pricing";
import { isoDate } from "@/lib/booking";
import type { Row } from "@/lib/admin/fields";

export const STATUSES = [
  { value: "baru", label: "Baru", cls: "bg-gold/15 text-gold border-gold/40" },
  { value: "terkonfirmasi", label: "Terkonfirmasi", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
  { value: "selesai", label: "Selesai", cls: "bg-white/10 text-foreground/80 border-white/20" },
  { value: "batal", label: "Batal", cls: "bg-red-500/10 text-red-300 border-red-500/30" },
];

const LANG = { id: "ID", en: "EN", ms: "MS", ar: "AR" } as Record<string, string>;
const PAGE = 50;

/** Letters, digits, spaces and dashes only, so it can go inside a PostgREST filter safely. */
const cleanSearch = (s: string) => s.replace(/[^\p{L}\p{N}\s-]/gu, "").trim().slice(0, 40);

type Props = {
  onShowRiders: (bookingCode: string) => void;
  onCreateMember: (prefill: Row) => void;
};

const BookingsSection = ({ onShowRiders, onCreateMember }: Props) => {
  const qc = useQueryClient();
  const [status, setStatus] = useState("aktif");
  const [search, setSearch] = useState("");
  const [upcoming, setUpcoming] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const s = cleanSearch(search);

  const { data: rows = [], isLoading, error, isFetching } = useQuery({
    queryKey: ["admin", "bookings", status, s, upcoming, limit],
    queryFn: async () => {
      let q = supabase!.from("bookings").select("*").order("created_at", { ascending: false }).limit(limit);
      if (status === "aktif") q = q.in("status", ["baru", "terkonfirmasi"]);
      else if (status !== "semua") q = q.eq("status", status);
      if (upcoming) q = q.gte("ride_date", isoDate(new Date()));
      if (s) q = q.or(`name.ilike.%${s}%,code.ilike.%${s}%,agent_code.ilike.%${s}%`);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: number; patch: Row }) => {
      const { error } = await supabase!.from("bookings").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tersimpan");
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
      qc.invalidateQueries({ queryKey: ["admin", "agent-recap"] });
    },
    onError: (e) => toast.error(dbErrorMessage(e)),
  });

  const makeMember = async (b: Row) => {
    const { data } = await supabase!.from("registrations").select("name").eq("booking_code", String(b.code)).order("id");
    onCreateMember({
      code: b.code,
      group_name: b.name,
      ride_date: b.ride_date,
      riders: (data ?? []).map((r) => r.name),
    });
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-body font-bold text-lg text-foreground">Booking</h2>
        <p className="text-sm text-muted-foreground">Booking dari website. Konfirmasi lewat WhatsApp, lalu ubah statusnya di sini.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setLimit(PAGE);
          }}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm sm:w-48"
          aria-label="Filter status"
        >
          <option value="aktif">Baru + terkonfirmasi</option>
          <option value="semua">Semua status</option>
          {STATUSES.map((st) => (
            <option key={st.value} value={st.value}>
              {st.label}
            </option>
          ))}
        </select>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, kode booking, atau kode agen" />
        <label className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap px-1">
          <input type="checkbox" checked={upcoming} onChange={(e) => setUpcoming(e.target.checked)} className="accent-[hsl(var(--gold))]" />
          Mulai hari ini
        </label>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Memuat…
        </div>
      ) : error ? (
        <p className="text-sm text-red-400">{dbErrorMessage(error)}</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Tidak ada booking.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((b) => (
            <BookingCard
              key={String(b.id)}
              b={b}
              saving={update.isPending}
              onPatch={(patch) => update.mutate({ id: Number(b.id), patch })}
              onShowRiders={() => onShowRiders(String(b.code))}
              onCreateMember={() => makeMember(b)}
            />
          ))}
        </ul>
      )}

      {rows.length >= limit && (
        <Button variant="outline" className="w-full" onClick={() => setLimit((l) => l + PAGE)} disabled={isFetching}>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin" />} Muat lebih banyak
        </Button>
      )}
    </section>
  );
};

const BookingCard = ({
  b,
  saving,
  onPatch,
  onShowRiders,
  onCreateMember,
}: {
  b: Row;
  saving: boolean;
  onPatch: (patch: Row) => void;
  onShowRiders: () => void;
  onCreateMember: () => void;
}) => {
  const [note, setNote] = useState(String(b.admin_note ?? ""));
  const st = STATUSES.find((x) => x.value === b.status) ?? STATUSES[0];
  const phoneDigits = String(b.phone ?? "").replace(/\D/g, "");
  const rideDate = b.ride_date ? new Date(`${b.ride_date}T00:00:00`) : null;
  const created = new Date(String(b.created_at));
  const addons = (b.addons as string[] | null) ?? [];

  return (
    <li className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-body font-bold text-foreground">
            {String(b.name)} <span className="text-gold font-normal tracking-wide">· {String(b.code)}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Masuk {created.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })} · bahasa {LANG[String(b.lang)] ?? "ID"}
          </p>
        </div>
        <select
          value={String(b.status)}
          onChange={(e) => onPatch({ status: e.target.value })}
          disabled={saving}
          className={`h-8 rounded-full border px-3 text-xs font-bold ${st.cls}`}
          aria-label="Status booking"
        >
          {STATUSES.map((x) => (
            <option key={x.value} value={x.value} className="bg-background text-foreground">
              {x.label}
            </option>
          ))}
        </select>
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-gold" />
          {rideDate ? rideDate.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "-"}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gold" /> {String(b.ride_time)}
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-gold" /> {String(b.people)} orang
        </div>
        <div className="font-bold text-gold">{typeof b.total === "number" ? `${formatSar(b.total)} SAR` : "Harga grup"}</div>
      </dl>

      <div className="text-sm text-foreground/85 space-y-0.5">
        <p>
          {String(b.package)}
          {addons.length > 0 && <span className="text-muted-foreground"> + {addons.join(", ")}</span>}
        </p>
        {b.hotel && <p className="text-muted-foreground">Hotel: {String(b.hotel)}</p>}
        {b.agent_code && <p className="text-muted-foreground">Partner: <span className="text-gold">{String(b.agent_code)}</span></p>}
        {b.notes && <p className="text-muted-foreground">Catatan: {String(b.notes)}</p>}
      </div>

      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value.slice(0, 1000))}
        onBlur={() => note !== String(b.admin_note ?? "") && onPatch({ admin_note: note })}
        placeholder="Catatan admin (otomatis tersimpan)"
        rows={2}
        className="text-sm"
      />

      <div className="flex flex-wrap gap-2">
        {phoneDigits.length >= 8 && (
          <Button size="sm" variant="outline" asChild>
            <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" /> WhatsApp {String(b.phone)}
            </a>
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={onShowRiders}>
          <Users className="w-4 h-4" /> Data peserta
        </Button>
        <Button size="sm" variant="outline" onClick={onCreateMember}>
          <IdCard className="w-4 h-4" /> Buat halaman member
        </Button>
      </div>
    </li>
  );
};

export default BookingsSection;
