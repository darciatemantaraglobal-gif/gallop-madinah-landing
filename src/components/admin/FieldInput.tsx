import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Link2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/admin/image";
import { imageUrl } from "@/lib/drive";
import type { Field, FormValue } from "@/lib/admin/fields";

const selectCls =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** One form control for a field definition. */
const FieldInput = ({
  field,
  value,
  onChange,
  disabled,
  error,
}: {
  field: Field;
  value: FormValue;
  onChange: (v: FormValue) => void;
  disabled?: boolean;
  error?: string;
}) => {
  const id = `f-${field.key}`;
  const invalid = error ? "border-red-400" : "";

  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = (
        <Textarea id={id} value={String(value)} onChange={(e) => onChange(e.target.value)} rows={3} disabled={disabled} placeholder={field.placeholder} className={invalid} />
      );
      break;
    case "boolean":
      control = (
        <div className="flex items-center gap-3 h-10">
          <Switch id={id} checked={Boolean(value)} onCheckedChange={(c) => onChange(c)} disabled={disabled} />
          <span className="text-sm text-muted-foreground">{value ? "Ya" : "Tidak"}</span>
        </div>
      );
      break;
    case "select":
      control = (
        <select id={id} value={String(value)} onChange={(e) => onChange(e.target.value)} disabled={disabled} className={`${selectCls} ${invalid}`}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "image":
      control = <ImageInput field={field} value={String(value)} onChange={onChange} disabled={disabled} />;
      break;
    case "images":
      control = <ImagesInput field={field} value={Array.isArray(value) ? value : []} onChange={onChange} disabled={disabled} />;
      break;
    default:
      control = (
        <Input
          id={id}
          type={field.type === "date" ? "date" : "text"}
          inputMode={field.type === "number" ? "numeric" : field.type === "url" ? "url" : undefined}
          value={String(value)}
          onChange={(e) => onChange(field.upper ? e.target.value.toUpperCase() : e.target.value)}
          disabled={disabled}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          className={invalid}
        />
      );
  }

  return (
    <div className={field.wide || field.type === "textarea" || field.type === "images" ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="block text-xs font-body text-muted-foreground mb-1.5">
        {field.label}
        {field.required && <span className="text-gold"> *</span>}
      </label>
      {control}
      {field.help && !error && <p className="text-[11px] text-muted-foreground mt-1">{field.help}</p>}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};

/** Single image: upload or paste a link, with preview. */
const ImageInput = ({ field, value, onChange, disabled }: { field: Field; value: string; onChange: (v: string) => void; disabled?: boolean }) => {
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file, field.folder ?? "uploads"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-14 flex-shrink-0 rounded border border-border bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
        {value ? <img src={value} alt="" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" /> : <ImagePlus className="w-5 h-5 text-muted-foreground" />}
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… atau upload" disabled={disabled || busy} />
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={disabled || busy}>
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />} Upload
        </Button>
      </div>
    </div>
  );
};

/** Photo list: upload several at once, add Drive links, reorder, remove. */
const ImagesInput = ({ field, value, onChange, disabled }: { field: Field; value: string[]; onChange: (v: string[]) => void; disabled?: boolean }) => {
  const [busy, setBusy] = useState(0);
  const [link, setLink] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const max = field.max ?? 30;

  const uploadMany = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, Math.max(0, max - value.length));
    if (list.length < files.length) toast.warning(`Maksimal ${max} foto.`);
    setBusy(list.length);
    const urls: string[] = [];
    for (const f of list) {
      try {
        urls.push(await uploadImage(f, field.folder ?? "uploads"));
      } catch (e) {
        toast.error(`${f.name}: ${e instanceof Error ? e.message : "upload gagal"}`);
      }
      setBusy((n) => n - 1);
    }
    onChange([...value, ...urls]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <ul className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {value.map((src, i) => (
            <li key={`${src}-${i}`} className="relative aspect-square rounded overflow-hidden border border-border bg-card group">
              {/* Drive share links are turned into thumbnail links, as on the member page */}
              <img src={imageUrl(src, 400) || src} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/70 p-0.5">
                <button type="button" onClick={() => move(i, -1)} disabled={disabled || i === 0} className="p-1 text-white disabled:opacity-30" aria-label="Geser ke kiri">
                  <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                </button>
                <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} disabled={disabled} className="p-1 text-red-300" aria-label="Hapus foto">
                  <X className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={disabled || i === value.length - 1} className="p-1 text-white disabled:opacity-30" aria-label="Geser ke kanan">
                  <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <input ref={fileRef} type="file" multiple accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => uploadMany(e.target.files)} />
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={disabled || busy > 0 || value.length >= max}>
          {busy > 0 ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          {busy > 0 ? `Mengupload… (${busy})` : "Upload foto"}
        </Button>
        <div className="flex flex-1 gap-2">
          <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="atau tempel link Google Drive" disabled={disabled} />
          <Button
            type="button"
            variant="outline"
            disabled={disabled || !link.trim() || value.length >= max}
            onClick={() => {
              onChange([...value, link.trim()]);
              setLink("");
            }}
          >
            <Link2 className="w-4 h-4" /> Tambah
          </Button>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        {value.length}/{max} foto. Foto pertama jadi foto utama. Link Drive harus "siapa saja yang punya link".
      </p>
    </div>
  );
};

export default FieldInput;
