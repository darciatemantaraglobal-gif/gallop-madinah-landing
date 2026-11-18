import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IdCard, Award, CalendarDays, Calculator, Handshake, ClipboardCheck,
  Settings2, Star, Languages, BarChart3, Check, Printer, TicketPercent, X, ChevronDown, Plus,
} from "lucide-react";
import logo from "@/assets/logo-landscape.png";

// Feature proposal for the owner. Not linked from the site and kept out of search results.

type Feature = {
  no: number;
  icon: typeof IdCard;
  name: string;
  price: number;
  days: string;
  why: string; // the benefit in one plain sentence
  story: string; // a concrete everyday example of that benefit
  scope: string[];
};

const FEATURES: Feature[] = [
  {
    no: 1, icon: IdCard, name: "Gallop Membercard", price: 450_000, days: "3–5 hari",
    why: "Customer dapat foto & video berkudanya lewat satu link. Admin tidak perlu kirim file satu per satu.",
    story: "Pak Ahmad datang bersama 8 jamaah. Selesai berkuda, admin cukup kirim satu link ke grup WhatsApp mereka. Semua jamaah bisa melihat dan menyimpan fotonya sendiri, lalu membagikannya ke Instagram dengan nama Gallop Madinah ikut terbawa. Foto customer jadi promosi gratis.",
    scope: [
      "Halaman member per customer/grup, misalnya gallopmadinah.id/member/ABC123",
      "QR code untuk dibagikan di lokasi",
      "Beberapa foto & video pilihan, selengkapnya lewat link Google Drive",
      "Data ride: tanggal, nama kuda, nama coach",
      "Tombol share ke WhatsApp & Instagram",
      "Data diisi admin lewat Google Sheet",
    ],
  },
  {
    no: 2, icon: Award, name: "Sertifikat \"First Gallop\" Digital", price: 200_000, days: "1–2 hari",
    why: "Peserta pulang membawa bukti \"saya pernah berkuda di Madinah\" yang senang mereka pamerkan.",
    story: "Seorang anak 10 tahun baru pertama kali naik kuda. Orang tuanya menerima sertifikat berisi nama anaknya, tanggal, dan nama kudanya. Sertifikat itu dipasang di status WhatsApp keluarga, lalu teman-temannya bertanya, \"Ini di mana? Mau ke sana juga.\"",
    scope: [
      "Sertifikat otomatis dari nama peserta & tanggal",
      "Bisa diunduh (gambar/PDF) dan dibagikan",
      "Desain mengikuti identitas Gallop Madinah",
      "Harga Rp 150.000 jika diambil bersama Membercard",
    ],
  },
  {
    no: 3, icon: CalendarDays, name: "Booking Online + Pilih Tanggal", price: 350_000, days: "3–4 hari",
    why: "Customer bisa pesan kapan saja, dan data yang sampai ke admin sudah lengkap.",
    story: "Sekarang: customer chat \"kak mau booking\", lalu admin menanyakan paket, tanggal, jam, dan jumlah orang satu per satu. Dengan fitur ini, customer mengisi form sekitar 1 menit dan admin langsung menerima pesan rapi: \"Premium, 5 orang, Jumat 20 Desember, jam 16.00, tambah GMC.\" Admin tinggal konfirmasi.",
    scope: [
      "Form pilih paket, tanggal, jam, dan jumlah orang",
      "Pilihan add-on (GMC, video drone)",
      "Hasil terkirim rapi ke WhatsApp admin",
      "Versi lite: belum ada cek slot penuh otomatis",
    ],
  },
  {
    no: 4, icon: Calculator, name: "Kalkulator Harga Grup", price: 200_000, days: "1 hari",
    why: "Customer langsung tahu total biayanya tanpa menunggu admin membalas.",
    story: "Rombongan 7 orang ingin tahu biayanya. Mereka memilih \"7 orang, Premium, tambah video drone\" dan langsung muncul: 7 × 750 = 5.250 SAR, ditambah 600 SAR, total 5.850 SAR. Orang yang sudah tahu harganya biasanya lebih cepat memutuskan.",
    scope: [
      "Isi jumlah orang & paket, total langsung muncul",
      "Mengikuti harga grup (1 / 2–4 / 5–10 orang) dan minimal Open Trip",
      "Tambahan add-on ikut terhitung",
      "Tombol lanjut booking dengan total yang sudah terisi",
    ],
  },
  {
    no: 5, icon: Handshake, name: "Portal Partner Travel", price: 450_000, days: "4–5 hari",
    why: "Travel umrah lebih mudah menjual Gallop ke jamaahnya, dan setiap jamaah yang dibawa tercatat.",
    story: "Sebuah travel membawa sekitar 40 jamaah per bulan. Mereka punya halaman sendiri dengan harga agen dan kode booking, misalnya \"TRAVELX\". Setiap booking dengan kode itu tercatat, jadi di akhir bulan Gallop dan travel sama-sama tahu berapa jamaah yang sudah dibawa. Tidak ada lagi hitung manual.",
    scope: [
      "Halaman khusus agen dengan harga agen",
      "Kode booking per travel partner",
      "Rekap jamaah per travel lewat Google Sheet",
      "Versi lite: tanpa login agen",
    ],
  },
  {
    no: 6, icon: ClipboardCheck, name: "Form Registrasi + Persetujuan Keselamatan", price: 200_000, days: "2 hari",
    why: "Coach sudah mengenal pesertanya sebelum mereka datang, jadi berkuda lebih aman.",
    story: "Sehari sebelum jadwal, coach membuka daftar peserta: 3 pemula, 1 anak 8 tahun, dan 1 orang dengan berat 95 kg. Coach bisa menyiapkan kuda yang tenang untuk pemula dan kuda yang kuat untuk peserta yang lebih berat. Semua peserta juga sudah menyetujui aturan keselamatan sebelum naik kuda.",
    scope: [
      "Form nama, usia, berat badan, pengalaman berkuda",
      "Centang persetujuan aturan keselamatan",
      "Data masuk otomatis ke Google Sheet",
    ],
  },
  {
    no: 7, icon: Settings2, name: "Panel Admin (Lite)", price: 400_000, days: "3–4 hari",
    why: "Harga dan isi website bisa diubah sendiri dalam hitungan menit, tanpa menunggu developer.",
    story: "Owner ingin mengubah harga Open Trip dari 350 menjadi 400 SAR. Cukup buka Google Sheet, ganti angkanya, lalu simpan. Beberapa menit kemudian website sudah menampilkan harga baru. Begitu juga untuk menambah FAQ atau logo partner.",
    scope: [
      "Harga paket, harga grup, add-on, FAQ, dan partner diedit dari Google Sheet",
      "Website ikut berubah otomatis",
      "Panduan singkat cara mengedit",
    ],
  },
  {
    no: 8, icon: Star, name: "Testimoni + Rating Google", price: 150_000, days: "1 hari",
    why: "Calon customer lebih percaya karena membaca cerita dari orang yang sudah datang.",
    story: "Calon customer yang masih ragu membaca ulasan: \"Saya pemula dan awalnya takut, tapi coachnya sabar sekali. Anak saya minta datang lagi!\" Di sebelahnya ada rating bintang dari Google. Keraguannya berkurang, dan ia menekan tombol booking.",
    scope: [
      "Section testimoni di halaman depan",
      "Tombol ke ulasan Google Maps",
      "Testimoni bisa ditambah lewat Google Sheet (jika ambil Panel Admin)",
    ],
  },
  {
    no: 9, icon: Languages, name: "Bahasa Arab + Melayu", price: 300_000, days: "3–4 hari",
    why: "Pengunjung dari Malaysia dan negara Arab bisa membaca website dalam bahasa mereka sendiri.",
    story: "Jamaah dari Malaysia membuka website dan langsung melihat tombol \"Tempah Sekarang\". Pengunjung dari Saudi melihat versi bahasa Arab yang dibaca dari kanan ke kiri. Orang yang paham isi websitenya jauh lebih mungkin memesan.",
    scope: [
      "Dua bahasa tambahan di samping Indonesia & Inggris",
      "Tampilan kanan-ke-kiri untuk bahasa Arab",
      "Teks terjemahan disediakan klien atau dicek penutur asli",
    ],
  },
  {
    no: 10, icon: BarChart3, name: "Tracking Klik WhatsApp", price: 100_000, days: "1 hari",
    why: "Owner tahu promosi mana yang benar-benar mendatangkan customer, jadi uang iklan tidak terbuang.",
    story: "Contoh laporan bulanan: 120 orang menekan tombol booking. 70 datang dari Instagram, 30 dari TikTok, dan 20 dari Google. Paket Premium paling sering diklik. Dari situ owner tahu harus fokus promosi di mana bulan depan.",
    scope: [
      "Google Analytics 4 + Meta Pixel",
      "Tracking klik tiap tombol booking & paket",
      "Laporan sumber pengunjung (Instagram, TikTok, Google)",
    ],
  },
];

// Price when all 10 features are taken together
const ALL_PRICE = 2_400_000;

const BUNDLES = [
  { name: "Starter", items: [4, 8, 10], price: 375_000, note: "Kecil, cepat jadi, hasilnya langsung terasa." },
  { name: "Member Experience", items: [1, 2, 6], price: 700_000, note: "Paling terasa untuk customer." },
  { name: "Operasional", items: [3, 7], price: 650_000, note: "Booking lebih rapi, isi website dikelola sendiri." },
  { name: "Semua Fitur", items: FEATURES.map((f) => f.no), price: ALL_PRICE, note: "Seluruh 10 fitur sekaligus.", featured: true },
];

const TERMS = [
  "Pembayaran: DP 50% di awal, pelunasan 50% setelah fitur selesai dan live.",
  "Revisi: maksimal 2 kali per fitur. Revisi berikutnya Rp 100.000 per revisi.",
  "Semua fitur di penawaran ini adalah versi lite. Upgrade ke versi penuh (cek slot otomatis, login agen, dashboard) dihitung sebagai proyek terpisah.",
  "Biaya bulanan: Rp 0. Semua berjalan di hosting gratis (Vercel) dan Google Sheet.",
  "Perawatan bulanan (opsional): Rp 300.000/bulan untuk update harga, foto, dan revisi kecil.",
  "Konten (foto, video, teks terjemahan, testimoni) disediakan oleh pihak Gallop Madinah.",
  "Penawaran berlaku 14 hari sejak tanggal dibuat.",
];

const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");
const sameSet = (a: number[], b: number[]) => a.length === b.length && b.every((x) => a.includes(x));

// Discount codes for this proposal (code -> share taken off every price).
// A link like /penawaran?kode=GALLOP50 opens the page with the code already applied.
const DISCOUNT_CODES: Record<string, number> = { GALLOP50: 0.5 };

const ProposalPage = () => {
  const [picked, setPicked] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);
  const toggleExpanded = (no: number) =>
    setExpanded((e) => (e.includes(no) ? e.filter((x) => x !== no) : [...e, no]));
  const [codeInput, setCodeInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [codeError, setCodeError] = useState(false);
  const rate = appliedCode ? DISCOUNT_CODES[appliedCode] : 0;
  // Price after the discount code (unchanged when no code is applied)
  const d = (n: number) => Math.round(n * (1 - rate));

  const applyCode = (raw: string) => {
    const code = raw.trim().toUpperCase();
    if (DISCOUNT_CODES[code] !== undefined) {
      setAppliedCode(code);
      setCodeError(false);
    } else {
      setAppliedCode(null);
      setCodeError(true);
    }
  };

  // Pre-apply ?kode=... from the link
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("kode");
    if (code) {
      setCodeInput(code.toUpperCase());
      applyCode(code);
    }
  }, []);

  // Keep this page out of search engines; it is shared by link only.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Penawaran Fitur Tambahan · Gallop Madinah";
    return () => {
      meta.remove();
      document.title = prevTitle;
    };
  }, []);

  const toggle = (no: number) =>
    setPicked((p) => (p.includes(no) ? p.filter((x) => x !== no) : [...p, no]));

  const total = useMemo(() => {
    const sum = FEATURES.filter((f) => picked.includes(f.no)).reduce((a, f) => a + f.price, 0);
    // Certificate is cheaper when taken with the Membercard
    const certDiscount = picked.includes(1) && picked.includes(2) ? 50_000 : 0;
    // Exactly a bundle's features picked → charge the bundle price
    const bundle = BUNDLES.find((b) => sameSet(picked, b.items)) ?? null;
    return { sum, final: bundle ? bundle.price : sum - certDiscount, bundle, certDiscount };
  }, [picked]);

  const fullSum = FEATURES.reduce((a, f) => a + f.price, 0);
  // Fixed issue date: the 14-day validity counts from here, so it must not change on every visit.
  const today = "18 November 2026";

  return (
    <div className="proposal-print min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-5 md:px-8 max-w-5xl flex items-center justify-between h-16 md:h-20">
          <Link to="/" aria-label="Gallop Madinah">
            <img src={logo} alt="Gallop Madinah" className="h-8 md:h-10 w-auto" />
          </Link>
          <button
            onClick={() => window.print()}
            className="print:hidden inline-flex items-center gap-2 border border-gold/50 text-gold px-4 py-2 font-body text-[11px] tracking-[0.15em] uppercase hover:bg-gold hover:text-primary-foreground transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Simpan PDF
          </button>
        </div>
      </header>

      <main className="container mx-auto px-5 md:px-8 max-w-5xl pb-36 md:pb-24">
        {/* Title */}
        <section className="pt-12 md:pt-20 pb-10 md:pb-14 border-b border-border">
          <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-4">Penawaran</p>
          <h1 className="font-display text-3xl md:text-5xl leading-tight mb-6">
            Fitur Tambahan <span className="text-gold">Website</span>
          </h1>
          <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed max-w-2xl">
            Sepuluh fitur untuk gallopmadinah.id yang membantu customer memesan lebih cepat, menyimpan
            kenangan berkudanya, dan membantu admin mengelola booking serta harga sendiri. Semua fitur
            bisa diambil satuan atau dalam paket.
          </p>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mt-8 md:mt-10">
            {[
              ["Untuk", "Gallop Madinah"],
              ["Tanggal", today],
              ["Berlaku", "14 hari"],
              ["Biaya bulanan", "Rp 0"],
            ].map(([k, v]) => (
              <div key={k} className="bg-background px-4 py-3 md:px-5 md:py-4">
                <dt className="text-muted-foreground font-body text-[11px] tracking-[0.2em] uppercase mb-1">{k}</dt>
                <dd className="font-body font-bold text-sm md:text-base">{v}</dd>
              </div>
            ))}
          </dl>

          {/* Discount code */}
          <div className="mt-6 md:mt-8 border border-border bg-card p-4 md:p-5">
            {appliedCode ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <TicketPercent className="w-5 h-5 text-gold flex-shrink-0" strokeWidth={1.5} />
                  <p className="font-body text-sm">
                    <span className="font-bold text-gold">Diskon {Math.round(rate * 100)}%</span>{" "}
                    <span className="text-muted-foreground">sudah diterapkan ke semua harga (kode {appliedCode})</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setAppliedCode(null); setCodeInput(""); }}
                  className="print:hidden flex-shrink-0 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground font-body text-xs"
                  aria-label="Hapus kode diskon"
                >
                  <X className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            ) : (
              <form
                className="print:hidden"
                onSubmit={(e) => { e.preventDefault(); applyCode(codeInput); }}
              >
                <label htmlFor="kode" className="flex items-center gap-2 text-muted-foreground font-body text-[11px] tracking-[0.2em] uppercase mb-2">
                  <TicketPercent className="w-4 h-4 text-gold" strokeWidth={1.5} /> Punya kode diskon?
                </label>
                <div className="flex gap-2">
                  <input
                    id="kode"
                    value={codeInput}
                    onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setCodeError(false); }}
                    placeholder="Masukkan kode"
                    autoComplete="off"
                    className="flex-1 min-w-0 bg-background border border-border focus:border-gold outline-none px-3 py-2.5 font-body text-sm tracking-[0.1em] uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 bg-gold text-primary-foreground px-5 font-body font-bold text-xs tracking-[0.15em] uppercase hover:bg-gold-highlight transition-colors"
                  >
                    Terapkan
                  </button>
                </div>
                {codeError && <p className="text-red-400 font-body text-xs mt-2">Kode tidak valid. Periksa lagi penulisannya.</p>}
              </form>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-10 md:py-14">
          <div className="mb-5 md:mb-8 md:flex md:items-end md:justify-between md:gap-4">
            <h2 className="font-display text-xl md:text-2xl">Daftar Fitur</h2>
            <p className="print:hidden text-muted-foreground font-body text-xs md:text-sm mt-1.5 md:mt-0">
              Tekan <span className="text-gold">Pilih</span> pada fitur yang diminati, totalnya muncul di bawah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {FEATURES.map((f) => {
              const on = picked.includes(f.no);
              const open = expanded.includes(f.no);
              return (
                <article
                  key={f.no}
                  className={`flex flex-col bg-card border transition-colors break-inside-avoid ${
                    on ? "border-gold" : "border-border"
                  }`}
                >
                  <div className="p-4 md:p-6 flex-1 flex flex-col">
                    {/* Title */}
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-forest/50 border border-forest-light/40 flex items-center justify-center">
                        <f.icon className="w-4 h-4 md:w-[18px] md:h-[18px] text-gold" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gold/80 font-body text-[10px] md:text-[11px] tracking-[0.18em] uppercase mb-0.5">
                          Fitur {String(f.no).padStart(2, "0")} · {f.days}
                        </p>
                        <h3 className="font-body font-bold text-[15px] md:text-base leading-snug">{f.name}</h3>
                      </div>
                    </div>

                    {/* Benefit + example */}
                    <p className="text-foreground font-body font-bold text-[15px] leading-snug mb-3">{f.why}</p>
                    <div className="border-l-2 border-gold/60 bg-background/60 pl-3 pr-3 py-2.5 mb-3 md:mb-4">
                      <p className="text-gold/90 font-body text-[10px] tracking-[0.2em] uppercase mb-1">Contohnya</p>
                      <p className="text-foreground/80 font-body text-[13.5px] md:text-sm leading-relaxed">{f.story}</p>
                    </div>

                    {/* Scope: folded on phones to keep the page short, always open on desktop and in print */}
                    <button
                      type="button"
                      onClick={() => toggleExpanded(f.no)}
                      aria-expanded={open}
                      className="md:hidden print:hidden flex items-center justify-between w-full py-2 text-muted-foreground font-body text-xs tracking-[0.12em] uppercase"
                    >
                      Yang didapat ({f.scope.length})
                      <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`${open ? "block" : "hidden"} md:block print:block`}>
                      <p className="hidden md:block print:block text-muted-foreground font-body text-[10px] tracking-[0.2em] uppercase mb-2">Yang didapat</p>
                      <ul className="space-y-1.5 pb-1 md:pb-0 md:mb-5">
                        {f.scope.map((s) => (
                          <li key={s} className="flex gap-2.5 text-muted-foreground font-note font-light text-[13px] leading-snug">
                            <span className="mt-[7px] w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Price + select */}
                  <div className="flex items-stretch border-t border-border mt-auto">
                    <div className="flex-1 px-4 md:px-6 py-3 flex items-baseline flex-wrap gap-x-2.5">
                      <span className="font-body font-bold text-lg md:text-xl text-gold">{rupiah(d(f.price))}</span>
                      {rate > 0 && <span className="text-muted-foreground font-body text-xs line-through">{rupiah(f.price)}</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(f.no)}
                      aria-pressed={on}
                      className={`print:hidden flex-shrink-0 min-w-[108px] inline-flex items-center justify-center gap-1.5 px-4 font-body font-bold text-xs tracking-[0.12em] uppercase transition-colors ${
                        on ? "bg-gold text-primary-foreground" : "border-l border-border text-gold hover:bg-gold/10"
                      }`}
                    >
                      {on ? <><Check className="w-4 h-4" strokeWidth={3} /> Dipilih</> : <><Plus className="w-4 h-4" /> Pilih</>}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Bundles */}
        <section className="py-10 md:py-14 border-t border-border">
          <h2 className="font-display text-xl md:text-2xl mb-2">Paket Hemat</h2>
          <p className="text-muted-foreground font-body text-sm mb-5 md:mb-8">
            Mengambil beberapa fitur sekaligus lebih murah daripada satuan. Tekan paket untuk memilih isinya.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
            {BUNDLES.map((b) => {
              const normal = FEATURES.filter((f) => b.items.includes(f.no)).reduce((a, f) => a + f.price, 0);
              const active = sameSet(picked, b.items);
              return (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => setPicked(active ? [] : [...b.items])}
                  aria-pressed={active}
                  className={`text-left border p-4 md:p-5 flex sm:flex-col gap-4 sm:gap-0 items-center sm:items-stretch break-inside-avoid transition-colors ${
                    active ? "border-gold bg-forest/40" : b.featured ? "border-gold/60 bg-forest/25" : "border-border bg-card hover:border-gold/40"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-body font-bold text-[15px] md:text-base mb-0.5 sm:mb-1 flex items-center gap-2">
                      {b.name}
                      {active && <Check className="w-4 h-4 text-gold" strokeWidth={3} />}
                    </h3>
                    <p className="text-muted-foreground font-note font-light text-[12.5px] md:text-[13px] leading-snug sm:mb-4">{b.note}</p>
                    <p className="text-muted-foreground font-body text-[11px] md:text-xs mt-1 sm:mt-0 sm:mb-4">
                      Fitur {b.items.length === FEATURES.length ? "01–10" : b.items.map((n) => String(n).padStart(2, "0")).join(", ")}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right sm:text-left sm:mt-auto">
                    <p className="text-muted-foreground font-body text-[11px] md:text-xs line-through">{rupiah(normal)}</p>
                    <p className="font-body font-bold text-lg md:text-xl text-gold whitespace-nowrap">{rupiah(d(b.price))}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Terms */}
        <section className="py-10 md:py-14 border-t border-border">
          <h2 className="font-display text-xl md:text-2xl mb-6 md:mb-8">Ketentuan</h2>
          <ol className="space-y-3 max-w-3xl">
            {TERMS.map((term, i) => (
              <li key={term} className="flex gap-4 font-body text-sm leading-relaxed text-foreground/85">
                <span className="text-gold font-bold w-5 flex-shrink-0">{i + 1}.</span>
                {term}
              </li>
            ))}
          </ol>
        </section>

        {/* Summary table for print / quick read */}
        <section className="py-10 md:py-14 border-t border-border">
          <h2 className="font-display text-xl md:text-2xl mb-6 md:mb-8">Ringkasan Harga</h2>
          <div className="border border-border">
            {FEATURES.map((f) => (
              <div key={f.no} className="flex items-center justify-between gap-4 px-4 md:px-5 py-3 border-b border-border font-body text-sm">
                <span className="text-foreground/85">
                  <span className="text-muted-foreground mr-2">{String(f.no).padStart(2, "0")}</span>
                  {f.name}
                </span>
                <span className="whitespace-nowrap">
                  {rate > 0 && <span className="text-muted-foreground line-through text-xs mr-2">{rupiah(f.price)}</span>}
                  <span className="font-bold">{rupiah(d(f.price))}</span>
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 px-4 md:px-5 py-3 border-b border-border font-body text-sm text-muted-foreground">
              <span>Total satuan</span>
              <span className="line-through whitespace-nowrap">{rupiah(fullSum)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 md:px-5 py-4 font-body">
              <span className="font-bold">Semua fitur (paket){rate > 0 && ` · diskon ${Math.round(rate * 100)}%`}</span>
              <span className="font-bold text-lg text-gold whitespace-nowrap">{rupiah(d(ALL_PRICE))}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Running total of the selected features */}
      <div className="print:hidden fixed bottom-0 inset-x-0 z-40 border-t border-gold/30 bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="container mx-auto px-5 md:px-8 max-w-5xl flex items-center justify-between gap-4 py-3 md:py-4">
          <div className="min-w-0">
            <p className="text-foreground font-body font-bold text-[13px] md:text-sm">
              {picked.length ? `${picked.length} fitur dipilih` : "Belum ada fitur dipilih"}
            </p>
            <p className="font-body text-[11.5px] md:text-xs text-muted-foreground truncate">
              {rate > 0 && <span className="text-gold">Diskon {Math.round(rate * 100)}% · </span>}
              {total.bundle
                ? `Harga Paket ${total.bundle.name}`
                : total.certDiscount
                  ? "Termasuk potongan sertifikat"
                  : picked.length
                    ? "Harga satuan"
                    : "Tekan Pilih pada fitur"}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            {picked.length > 0 && (total.final !== total.sum || rate > 0) && (
              <p className="text-muted-foreground font-body text-xs line-through">{rupiah(total.sum)}</p>
            )}
            <p className="font-body font-bold text-xl md:text-2xl text-gold">{rupiah(d(total.final))}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalPage;
