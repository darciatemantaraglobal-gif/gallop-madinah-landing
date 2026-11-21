import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import FieldInput from "@/components/admin/FieldInput";
import ResourceEditor, { dbErrorMessage } from "@/components/admin/ResourceEditor";
import { supabase } from "@/lib/supabase";
import { SITE_DATA_KEY } from "@/lib/siteData";
import { checkForm, emptyForm, formToRow, rowToForm, type Field, type FormValues } from "@/lib/admin/fields";
import { rulesConfig } from "@/pages/admin/resources";

const FIELDS: Field[] = [
  {
    key: "booking_times",
    label: "Jam ride yang bisa dipilih",
    type: "tags",
    wide: true,
    placeholder: "07:00, 16:30",
    help: "Dipisah koma. Kosongkan = customer memilih Pagi / Sore.",
  },
  { key: "max_days_ahead", label: "Booking paling jauh (hari ke depan)", type: "number", required: true, min: 1, max: 365 },
  { key: "min_age", label: "Usia minimal peserta", type: "number", min: 1, max: 99, help: "Kosongkan = tanpa peringatan usia." },
  { key: "max_weight", label: "Berat maksimal (kg)", type: "number", min: 20, max: 300, help: "Kosongkan = tanpa peringatan berat." },
  { key: "maps_url", label: "Link Google Maps Gallop", type: "url", wide: true, placeholder: "https://maps.app.goo.gl/…" },
  { key: "review_url", label: "Link \"tulis ulasan\" Google", type: "url", wide: true, placeholder: "https://g.page/r/…/review" },
];

const SettingsSection = () => {
  const qc = useQueryClient();
  const [values, setValues] = useState<FormValues>(() => emptyForm(FIELDS, { max_days_ahead: 90 }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase!.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) setValues(rowToForm(FIELDS, data));
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const row = { id: 1, ...formToRow(FIELDS, values, { creating: true }) };
      const { error } = await supabase!.from("site_settings").upsert(row);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Pengaturan tersimpan");
      qc.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      qc.invalidateQueries({ queryKey: SITE_DATA_KEY });
    },
    onError: (e) => toast.error(dbErrorMessage(e)),
  });

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div>
          <h2 className="font-body font-bold text-lg text-foreground">Pengaturan</h2>
          <p className="text-sm text-muted-foreground">Jadwal booking, batas peserta, dan link ulasan Google.</p>
        </div>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
            <Loader2 className="w-4 h-4 animate-spin" /> Memuat…
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const errs = checkForm(FIELDS, values);
              setErrors(errs);
              if (Object.keys(errs).length === 0) save.mutate();
            }}
            className="rounded-lg border border-border bg-card p-4 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {FIELDS.map((f) => (
                <FieldInput key={f.key} field={f} value={values[f.key]} error={errors[f.key]} onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))} />
              ))}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={save.isPending}>
                {save.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Simpan pengaturan
              </Button>
            </div>
          </form>
        )}
      </section>

      <ResourceEditor config={rulesConfig} />
    </div>
  );
};

export default SettingsSection;
