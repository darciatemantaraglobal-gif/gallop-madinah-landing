import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useSiteData } from "@/lib/siteData";
import { dbErrorMessage } from "@/components/admin/ResourceEditor";
import type { Row } from "@/lib/admin/fields";

const EXPERIENCE: Record<string, string> = { none: "Belum pernah", some: "Pernah beberapa kali", regular: "Rutin berkuda" };

/** Rider details from /registrasi, grouped per booking code, with the owner's age/weight limits flagged. */
const RegistrationsSection = ({ filter, onFilter }: { filter: string; onFilter: (code: string) => void }) => {
  const { safety } = useSiteData();
  const code = filter.trim().toUpperCase();

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["admin", "registrations", code],
    queryFn: async () => {
      let q = supabase!.from("registrations").select("*").order("created_at", { ascending: false }).limit(300);
      if (code) q = q.eq("booking_code", code);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const qc = useQueryClient();
  // Deletes exactly the rows shown (by id), never "everything with this code" beyond the list.
  const remove = useMutation({
    mutationFn: async (ids: Array<string | number>) => {
      const { error } = await supabase!.from("registrations").delete().in("id", ids);
      if (error) throw error;
      return ids.length;
    },
    onSuccess: (n) => {
      toast.success(n > 1 ? `${n} peserta dihapus` : "Peserta dihapus");
      qc.invalidateQueries({ queryKey: ["admin", "registrations"] });
    },
    onError: (e) => toast.error(dbErrorMessage(e)),
  });

  const groups = useMemo(() => {
    const m = new Map<string, Row[]>();
    for (const r of rows) {
      const k = String(r.booking_code || "(tanpa kode)");
      m.set(k, [...(m.get(k) ?? []), r]);
    }
    return [...m.entries()];
  }, [rows]);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-body font-bold text-lg text-foreground">Data peserta</h2>
        <p className="text-sm text-muted-foreground">
          Diisi customer di form registrasi. {safety.minAge || safety.maxWeight ? "Yang di luar batas usia/berat diberi tanda." : "Batas usia/berat bisa diatur di Pengaturan."}
        </p>
      </div>

      <div className="flex gap-2">
        <Input value={filter} onChange={(e) => onFilter(e.target.value)} placeholder="Filter kode booking, contoh GM-7K2QX" />
        {filter && (
          <Button variant="ghost" size="icon" onClick={() => onFilter("")} aria-label="Hapus filter">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Memuat…
        </div>
      ) : error ? (
        <p className="text-sm text-red-400">{dbErrorMessage(error)}</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Belum ada data peserta{code ? ` untuk ${code}` : ""}.</p>
      ) : (
        <ul className="space-y-3">
          {groups.map(([k, list]) => (
            <li key={k} className="rounded-lg border border-border bg-card">
              <div className="px-4 py-2 border-b border-border flex items-center justify-between gap-3">
                <p className="font-body font-bold text-sm text-gold">
                  {k} <span className="text-muted-foreground font-normal">· {list.length} peserta</span>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={remove.isPending}
                  className="h-8 px-2 text-red-300 hover:text-red-200 hover:bg-red-500/10"
                  onClick={() => {
                    if (window.confirm(`Hapus semua ${list.length} peserta di ${k}? Data yang dihapus tidak bisa dikembalikan.`)) {
                      remove.mutate(list.map((r) => r.id as string | number));
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" /> Hapus semua
                </Button>
              </div>
              <ul className="divide-y divide-border">
                {list.map((r) => {
                  const young = safety.minAge !== null && Number(r.age) < safety.minAge;
                  const heavy = safety.maxWeight !== null && Number(r.weight) > safety.maxWeight;
                  return (
                    <li key={String(r.id)} className="px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="font-bold text-foreground min-w-[8rem]">{String(r.name)}</span>
                      <span className={young ? "text-red-300" : "text-muted-foreground"}>{String(r.age)} th</span>
                      <span className={heavy ? "text-red-300" : "text-muted-foreground"}>{String(r.weight)} kg</span>
                      <span className="text-muted-foreground">{EXPERIENCE[String(r.experience)] ?? String(r.experience)}</span>
                      {(young || heavy) && (
                        <span className="inline-flex items-center gap-1 text-red-300 text-xs">
                          <AlertTriangle className="w-3.5 h-3.5" /> {young ? "di bawah usia minimal" : "di atas batas berat"}
                        </span>
                      )}
                      <button
                        type="button"
                        disabled={remove.isPending}
                        aria-label={`Hapus ${String(r.name)}`}
                        title="Hapus peserta"
                        className="ms-auto p-2 -me-2 rounded-md text-muted-foreground hover:text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                        onClick={() => {
                          if (window.confirm(`Hapus peserta "${String(r.name)}"? Data yang dihapus tidak bisa dikembalikan.`)) {
                            remove.mutate([r.id as string | number]);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RegistrationsSection;
