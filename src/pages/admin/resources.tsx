import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ResourceConfig } from "@/components/admin/ResourceEditor";
import type { Row } from "@/lib/admin/fields";
import { formatSar } from "@/lib/pricing";
import { imageUrl } from "@/lib/drive";

// What each admin list edits. Labels and help texts are for the owner/admin, in Indonesian.

const ID_PATTERN = /^[a-z0-9_]{2,30}$/;
const sortField = { key: "sort", label: "Urutan", type: "number" as const, min: 0, max: 999, help: "Angka kecil tampil lebih dulu." };
const price = (n: unknown) => (typeof n === "number" ? `${formatSar(n)} SAR` : "—");

const copyLink = (path: string) => {
  const url = `${window.location.origin}${path}`;
  navigator.clipboard?.writeText(url).then(
    () => toast.success("Link disalin"),
    () => toast.error("Tidak bisa menyalin, salin manual: " + url),
  );
};

const LinkActions = ({ path }: { path: string }) => (
  <>
    <Button size="icon" variant="ghost" aria-label="Salin link" onClick={() => copyLink(path)}>
      <Copy className="w-4 h-4" />
    </Button>
    <Button size="icon" variant="ghost" aria-label="Buka halaman" asChild>
      <a href={path} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="w-4 h-4" />
      </a>
    </Button>
  </>
);

export const packagesConfig: ResourceConfig = {
  table: "packages",
  title: "Paket",
  description: "Kolom di tabel harga. Harga dalam SAR per orang.",
  itemName: "paket",
  pk: "id",
  pkMode: "text",
  order: [{ column: "sort" }],
  affectsSite: true,
  defaults: { min_people: 1, features: ["horse", "coach", "rest"], featured: false, tiered: false, sort: 10 },
  fields: [
    { key: "id", label: "ID", type: "text", required: true, createOnly: true, pattern: ID_PATTERN, patternHelp: "ID: huruf kecil/angka/garis bawah, contoh open_trip.", help: "Tidak bisa diubah setelah dibuat." },
    { key: "name", label: "Nama lengkap", type: "text", required: true, maxLength: 80, placeholder: "Premium Experience" },
    { key: "short_name", label: "Nama pendek (HP)", type: "text", required: true, maxLength: 40, placeholder: "Premium" },
    { key: "price", label: "Harga per orang (SAR)", type: "number", required: true, min: 1 },
    { key: "min_people", label: "Minimal orang", type: "number", required: true, min: 1, max: 200 },
    sortField,
    {
      key: "features",
      label: "Isi paket (dipisah koma)",
      type: "tags",
      wide: true,
      help: "Pilihan: horse, helmet, boots, coach, rest, transport, videographer",
    },
    { key: "featured", label: "Tandai \"Paling Lengkap\"", type: "boolean" },
    { key: "tiered", label: "Harga ikut Harga Grup", type: "boolean", help: "Untuk Premium: harga per orang turun sesuai jumlah orang." },
  ],
  rowTitle: (r) => String(r.name),
  rowSubtitle: (r) => `${price(r.price)} / orang${Number(r.min_people) > 1 ? ` · min. ${r.min_people} orang` : ""}`,
};

export const tiersConfig: ResourceConfig = {
  table: "group_tiers",
  title: "Harga Grup",
  description: "Harga per orang untuk paket yang memakai harga grup (Premium).",
  itemName: "tingkat harga",
  pk: "id",
  pkMode: "identity",
  order: [{ column: "from_people" }],
  affectsSite: true,
  fields: [
    { key: "from_people", label: "Dari (orang)", type: "number", required: true, min: 1, max: 200 },
    { key: "to_people", label: "Sampai (orang)", type: "number", min: 1, max: 200, help: "Kosongkan = tanpa batas (mis. 11+)." },
    { key: "price", label: "Harga per orang (SAR)", type: "number", min: 1, help: "Kosongkan = tampil \"Hubungi kami\"." },
  ],
  rowTitle: (r) => (r.to_people === null ? `${r.from_people}+ orang` : r.from_people === r.to_people ? `${r.from_people} orang` : `${r.from_people}–${r.to_people} orang`),
  rowSubtitle: (r) => (r.price === null ? "Hubungi kami" : `${price(r.price)} / orang`),
};

export const addonsConfig: ResourceConfig = {
  table: "addons",
  title: "Tambahan (Add-on)",
  itemName: "add-on",
  pk: "id",
  pkMode: "text",
  order: [{ column: "sort" }],
  affectsSite: true,
  defaults: { sort: 10 },
  fields: [
    { key: "id", label: "ID", type: "text", required: true, createOnly: true, pattern: ID_PATTERN, patternHelp: "ID: huruf kecil/angka/garis bawah, contoh gmc.", help: "gmc dan drone punya nama 4 bahasa bawaan." },
    { key: "name", label: "Nama", type: "text", required: true, maxLength: 60 },
    { key: "price", label: "Harga (SAR)", type: "number", required: true, min: 1 },
    sortField,
  ],
  rowTitle: (r) => String(r.name),
  rowSubtitle: (r) => price(r.price),
};

const langFields = (base: string, label: string, textarea = false) =>
  (["en", "ms", "ar"] as const).map((l) => ({
    key: `${base}_${l}`,
    label: `${label} (${{ en: "Inggris", ms: "Melayu", ar: "Arab" }[l]})`,
    type: textarea ? ("textarea" as const) : ("text" as const),
    wide: true,
    maxLength: textarea ? 2000 : 300,
  }));

export const faqsConfig: ResourceConfig = {
  table: "faqs",
  title: "FAQ",
  description: "Hanya bahasa Indonesia yang wajib. Bahasa lain kosong → tampil versi Indonesia/Inggris.",
  itemName: "pertanyaan",
  pk: "id",
  pkMode: "identity",
  order: [{ column: "sort" }, { column: "id" }],
  affectsSite: true,
  defaults: { sort: 99 },
  fields: [
    sortField,
    { key: "q_id", label: "Pertanyaan (Indonesia)", type: "text", required: true, wide: true, maxLength: 300 },
    { key: "a_id", label: "Jawaban (Indonesia)", type: "textarea", required: true, maxLength: 2000 },
    ...langFields("q", "Pertanyaan"),
    ...langFields("a", "Jawaban", true),
  ],
  rowTitle: (r) => String(r.q_id),
  rowSubtitle: (r) => ["en", "ms", "ar"].filter((l) => r[`q_${l}`]).map((l) => l.toUpperCase()).join(" · ") || "Hanya Indonesia",
};

export const rulesConfig: ResourceConfig = {
  table: "safety_rules",
  title: "Aturan keselamatan",
  description: "Wajib disetujui peserta di form registrasi.",
  itemName: "aturan",
  pk: "id",
  pkMode: "identity",
  order: [{ column: "sort" }, { column: "id" }],
  affectsSite: true,
  defaults: { sort: 99 },
  fields: [
    sortField,
    { key: "text_id", label: "Aturan (Indonesia)", type: "textarea", required: true, maxLength: 500 },
    ...langFields("text", "Aturan", true).map((f) => ({ ...f, maxLength: 500 })),
  ],
  rowTitle: (r) => String(r.text_id),
};

export const partnersConfig: ResourceConfig = {
  table: "partners",
  title: "Logo partner",
  description: "Documentation Partner di halaman depan. PNG transparan paling bagus.",
  itemName: "partner",
  pk: "id",
  pkMode: "identity",
  order: [{ column: "sort" }, { column: "id" }],
  affectsSite: true,
  defaults: { size: "normal", sort: 99 },
  fields: [
    { key: "name", label: "Nama", type: "text", required: true, maxLength: 80 },
    sortField,
    { key: "logo_url", label: "Logo", type: "image", required: true, folder: "partners", wide: true },
    {
      key: "size",
      label: "Ukuran tampil",
      type: "select",
      options: [
        { value: "normal", label: "Normal" },
        { value: "large", label: "Besar (logo lebar yang terlihat kecil)" },
        { value: "tall", label: "Tinggi (logo bertumpuk)" },
      ],
    },
  ],
  rowTitle: (r) => String(r.name),
  rowImage: (r) => imageUrl(String(r.logo_url ?? ""), 300),
};

export const testimonialsConfig: ResourceConfig = {
  table: "testimonials",
  title: "Testimoni",
  description: "Section testimoni tampil setelah ada minimal 3 yang dipublikasikan. Pakai ulasan asli dengan izin customer.",
  itemName: "testimoni",
  pk: "id",
  pkMode: "identity",
  order: [{ column: "created_at", ascending: false }],
  affectsSite: true,
  defaults: { rating: "5", published: true },
  fields: [
    { key: "name", label: "Nama", type: "text", required: true, maxLength: 80 },
    { key: "origin", label: "Asal (kota / rombongan)", type: "text", maxLength: 80 },
    {
      key: "rating",
      label: "Bintang",
      type: "select",
      options: ["5", "4", "3", "2", "1"].map((v) => ({ value: v, label: `${v} bintang` })),
    },
    { key: "published", label: "Tampilkan di website", type: "boolean" },
    { key: "body", label: "Isi ulasan", type: "textarea", required: true, maxLength: 1000 },
  ],
  rowTitle: (r) => `${r.name}${r.origin ? ` · ${r.origin}` : ""}`,
  rowSubtitle: (r) => `${"★".repeat(Number(r.rating) || 0)} ${r.published ? "" : "· disembunyikan"}`,
};

export const membersConfig: ResourceConfig = {
  table: "members",
  title: "Member",
  description: "Halaman dokumentasi per grup: gallopmadinah.id/member/KODE. Pakai kode booking agar tidak bisa ditebak.",
  itemName: "member",
  pk: "code",
  pkMode: "text",
  order: [{ column: "created_at", ascending: false }],
  fields: [
    {
      key: "code",
      label: "Kode",
      type: "text",
      required: true,
      upper: true,
      createOnly: true,
      pattern: /^[A-Z0-9-]{3,20}$/,
      patternHelp: "Kode: huruf besar/angka/-, 3–20 karakter (contoh GM-7K2QX).",
      placeholder: "GM-7K2QX",
    },
    { key: "group_name", label: "Nama grup", type: "text", maxLength: 120, placeholder: "Rombongan Lintas Haramain" },
    { key: "ride_date", label: "Tanggal berkuda", type: "date" },
    { key: "horse", label: "Kuda", type: "text", maxLength: 80 },
    { key: "coach", label: "Coach", type: "text", maxLength: 80 },
    { key: "riders", label: "Nama peserta (dipisah koma)", type: "tags", wide: true, help: "Jadi pilihan nama di sertifikat." },
    { key: "photos", label: "Foto pilihan", type: "images", folder: "members", max: 30 },
    { key: "video_url", label: "Link video (YouTube / Drive)", type: "url", wide: true },
    { key: "drive_folder", label: "Link folder Google Drive (semua file)", type: "url", wide: true },
  ],
  rowTitle: (r) => `${r.code}${r.group_name ? ` · ${r.group_name}` : ""}`,
  rowSubtitle: (r) =>
    [r.ride_date, `${(r.photos as unknown[] | null)?.length ?? 0} foto`, `${(r.riders as unknown[] | null)?.length ?? 0} peserta`].filter(Boolean).join(" · "),
  rowImage: (r) => {
    const first = (r.photos as string[] | null)?.[0];
    return first ? imageUrl(first, 200) || first : "";
  },
  rowActions: (r) => <LinkActions path={`/member/${r.code}`} />,
};

export const agentsConfig = (recap: Record<string, { bookings: number; people: number }>): ResourceConfig => ({
  table: "agents",
  title: "Partner travel (agen)",
  description: "Portal: gallopmadinah.id/partner/KODE · Link booking untuk jamaah: gallopmadinah.id/booking?agen=KODE",
  itemName: "agen",
  pk: "code",
  pkMode: "text",
  order: [{ column: "created_at", ascending: false }],
  defaults: { active: true },
  fields: [
    {
      key: "code",
      label: "Kode",
      type: "text",
      required: true,
      upper: true,
      createOnly: true,
      pattern: /^[A-Z0-9-]{2,20}$/,
      patternHelp: "Kode: huruf besar/angka/-, 2–20 karakter (contoh LINTAS).",
      placeholder: "LINTAS",
    },
    { key: "name", label: "Nama travel", type: "text", required: true, maxLength: 120 },
    { key: "price_open_trip", label: "Harga agen Open Trip (SAR/orang)", type: "number", min: 1 },
    { key: "price_premium", label: "Harga agen Premium (SAR/orang)", type: "number", min: 1 },
    { key: "contact", label: "Kontak", type: "text", maxLength: 120 },
    { key: "active", label: "Aktif", type: "boolean", help: "Nonaktif = portal tidak bisa dibuka." },
  ],
  rowTitle: (r: Row) => `${r.code} · ${r.name}`,
  rowSubtitle: (r: Row) => {
    const s = recap[String(r.code)];
    const month = s ? `${s.bookings} booking · ${s.people} orang bulan ini` : "Belum ada booking bulan ini";
    return `${month}${r.active ? "" : " · nonaktif"}`;
  },
  rowActions: (r: Row) => <LinkActions path={`/partner/${r.code}`} />,
});
