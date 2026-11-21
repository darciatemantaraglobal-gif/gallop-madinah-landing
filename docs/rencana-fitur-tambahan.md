# Rencana Pembangunan Fitur Tambahan — Gallop Madinah

Disepakati: 10 fitur (versi lite), total Rp 1.200.000. DP Rp 600.000 sudah diterima, pelunasan Rp 600.000 setelah semua live.
Penawaran: gallopmadinah.id/penawaran

> **Update:** penyimpanan data tidak lagi memakai Google Sheet + Apps Script, tetapi **Supabase** dengan panel admin di
> `/admin` (lihat `docs/setup-supabase.md` dan `docs/panduan-admin.md`). Bagian Google Sheet di bawah ini adalah rencana awal.

Urutan kerja:

| Tahap | Fitur | Perkiraan |
|---|---|---|
| 0 | Pondasi (helper WhatsApp, Google Sheet + Apps Script, `useSiteData`) | ½ hari |
| 1 | 4 Kalkulator · 10 Tracking · 8 Testimoni | hari 1–2 |
| 2 | 7 Panel Admin · 3 Booking · 6 Registrasi | hari 3–5 |
| 3 | 1 Membercard · 2 Sertifikat | hari 6–8 |
| 4 | 5 Portal Partner · 9 Bahasa Arab + Melayu | hari 9–11 |
| 5 | Tes menyeluruh, panduan admin, pelunasan | hari 12 |

Setiap tahap selesai → commit, push, kabari owner.

---

## Tahap 0 — Pondasi

Dipakai oleh hampir semua fitur, jadi dikerjakan sekali di awal.

### 0.1 Satu helper untuk link WhatsApp
Sekarang link `wa.me/628118880818` ditulis ulang di 7 file (Navbar, Hero, Pricelist, HowToBook, FinalCTA, FAQ, FloatingWhatsApp).

1. Buat `src/lib/whatsapp.ts` berisi `WA_NUMBER`, `waLink(text)`, dan `openWhatsApp(text, source)`.
2. `openWhatsApp` sekaligus mengirim event tracking (dipakai fitur 10) sebelum membuka WhatsApp.
3. Ganti ketujuh tempat tadi memakai helper ini.
4. **Selesai jika:** `grep wa.me src` hanya menemukan `whatsapp.ts`, dan semua tombol WhatsApp masih membuka chat dengan teks yang sama.

### 0.2 Google Sheet + Apps Script
1. Buat Google Sheet di **akun Google milik Gallop**, lalu undang developer sebagai editor.
2. Buat tab dengan kolom berikut:

| Tab | Kolom |
|---|---|
| `Harga` | paket, harga, min_orang, fitur (dipisah koma), unggulan (ya/tidak) |
| `HargaGrup` | dari, sampai, harga |
| `Addon` | nama, harga, satuan (per mobil / per booking) |
| `FAQ` | urutan, tanya_id, jawab_id, tanya_en, jawab_en |
| `Partner` | nama, logo_url, urutan |
| `Testimoni` | nama, asal, bintang, isi, tampil (ya/tidak) |
| `Jadwal` | jam (mis. 07:00, 16:00), aktif |
| `Member` | kode, nama_grup, tanggal, kuda, coach, peserta, foto (ID Drive, dipisah koma), video_url, drive_folder |
| `Agen` | kode, nama_travel, harga_agen_openTrip, harga_agen_premium, kontak |
| `Booking` | waktu, paket, tanggal, jam, jumlah, addon, total, nama, wa, kode_agen |
| `Registrasi` | waktu, nama, usia, berat, pengalaman, setuju, kode_booking |
| `Rekap` | rumus COUNTIF/SUMIF per kode_agen dari tab Booking |

3. Buat Apps Script (Extensions → Apps Script) dan deploy sebagai **Web App** (execute as: owner, akses: anyone):
   - `GET ?action=config` → harga, harga grup, add-on, FAQ, partner, testimoni, jadwal. Hasil disimpan di `CacheService` 5 menit agar cepat.
   - `GET ?action=member&kode=X` → satu baris member saja (data member lain tidak ikut terbuka).
   - `GET ?action=agen&kode=X` → satu baris agen saja.
   - `POST` `{action:"booking"|"registrasi", ...}` → tambah baris.
4. **Catatan teknis:** Apps Script tidak melayani CORS preflight. Kirim POST dengan `Content-Type: text/plain` berisi JSON agar browser tidak mengirim preflight.
5. Simpan URL Web App di Vercel sebagai `VITE_SHEET_API_URL` (dan `.env.local` untuk lokal).

### 0.3 `useSiteData()` dengan data cadangan
1. Buat `src/lib/siteData.ts`: memanggil `?action=config` lewat React Query (sudah terpasang), `staleTime` 5 menit.
2. Pindahkan harga, add-on, FAQ, partner yang sekarang tertulis di kode menjadi **data cadangan** `src/data/fallback.ts`.
3. Jika API gagal, lambat (> 4 detik), atau datanya tidak valid (dicek dengan `zod`, sudah terpasang) → pakai cadangan. Website tidak boleh rusak karena salah ketik di Sheet.
4. **Selesai jika:** mematikan `VITE_SHEET_API_URL` tetap menampilkan website persis seperti sekarang.

---

## Fitur 4 — Kalkulator Harga Grup

**Tujuan:** customer tahu total biaya tanpa menunggu admin.
**Butuh dari owner:** apakah GMC dihitung per mobil (berapa kursi per mobil?) atau per booking.

1. Buat `src/lib/pricing.ts` berisi satu fungsi `hitungTotal({paket, orang, addon})`. Aturan:
   - Premium: 1 orang 1.250 · 2–4 orang 850 · 5–10 orang 750 per orang · 11+ → "hubungi kami".
   - Open Trip: 350 per orang, minimal 20 orang (di bawah itu tampil peringatan).
   - Add-on: GMC 800, video drone 600 (sesuai satuan dari owner).
2. Tulis tes kecil untuk fungsi ini (1, 2, 4, 5, 10, 11, 19, 20 orang) karena ini yang paling mudah salah.
3. Buat `src/components/CalculatorSection.tsx`: pilih paket, tombol −/+ jumlah orang, centang add-on, tampil rincian (`7 × 750 = 5.250` + add-on = total).
4. Tombol **"Booking dengan total ini"** → ke `/booking?paket=premium&orang=7&addon=drone` (dipakai fitur 3). Sebelum fitur 3 jadi, sementara membuka WhatsApp berisi rincian.
5. Pasang di halaman depan dan `/prices`, tepat setelah tabel harga.
6. **Selesai jika:** hasil sama dengan hitungan manual untuk semua kasus tes, tampil rapi di HP 375 px.

## Fitur 10 — Tracking Klik WhatsApp (GA4 + Meta Pixel)

**Butuh dari owner:** ID GA4 (`G-XXXX`) dan ID Meta Pixel, atau izin membuatkan akun baru di akun Google/Meta milik Gallop.

1. Tambah `src/lib/analytics.ts`: memuat script GA4 dan Meta Pixel **hanya jika** `VITE_GA_ID` / `VITE_META_PIXEL_ID` diisi.
2. Kirim `page_view` setiap pindah halaman (website ini SPA, jadi harus manual lewat `useLocation`).
3. Di `openWhatsApp()` (Tahap 0.1) kirim event `wa_click` dengan parameter `source` (hero, navbar, pricelist, kalkulator, faq, floating) dan `paket`. Di Meta kirim sebagai `Contact`.
4. Event tambahan: `booking_submit`, `registrasi_submit`, `kalkulator_dipakai`.
5. Pastikan link dari iklan membawa UTM (contoh untuk owner: `?utm_source=instagram`).
6. **Selesai jika:** klik tombol WhatsApp muncul di GA4 Realtime dan Meta Events Manager → Test Events.

## Fitur 8 — Testimoni + Rating Google

**Butuh dari owner:** 3–5 testimoni asli (nama, asal, isi, izin ditampilkan) dan link Google Maps Gallop.

1. Isi tab `Testimoni`; sebelum Sheet siap, pakai data cadangan dari owner.
2. Buat `src/components/TestimonialSection.tsx`: kartu testimoni (geser ke samping di HP), bintang, nama + asal.
3. Tombol **"Lihat ulasan di Google"** ke link Google Maps, dan **"Tulis ulasan"** ke link review Google.
4. Section otomatis disembunyikan jika testimoni yang `tampil = ya` kurang dari 3 (lebih baik tidak tampil daripada kelihatan sepi).
5. Pasang di halaman depan sebelum Galeri.
6. **Selesai jika:** testimoni baru yang ditambah di Sheet muncul di website dalam ±5 menit.

## Fitur 7 — Panel Admin (Lite, lewat Google Sheet)

1. Hubungkan komponen ke `useSiteData()`:
   - `PricelistSection` → tab `Harga`, `HargaGrup`, `Addon`.
   - `FaqSection` → tab `FAQ`.
   - `PartnersSection` → tab `Partner`.
   - `pricing.ts` (fitur 4) ikut membaca harga dari Sheet, jadi kalkulator selalu sama dengan tabel.
2. Logo partner: kolom `logo_url` boleh link Google Drive; ubah otomatis ke format `drive.google.com/thumbnail?id=…`. File Drive harus "siapa saja yang punya link".
3. Validasi: harga harus angka, paket tidak boleh kosong. Baris yang salah dilewati (bukan merusak seluruh tabel).
4. Tulis **panduan admin 1 halaman**: tab mana untuk apa, contoh mengubah harga, berapa lama sampai tampil (±5 menit).
5. **Selesai jika:** mengubah harga Open Trip di Sheet mengubah tabel harga, kalkulator, dan pesan WhatsApp di website.

## Fitur 3 — Booking Online + Pilih Tanggal

**Butuh dari owner:** jam ride yang tersedia (isi tab `Jadwal`), hari libur, dan berapa hari ke depan boleh dipesan.

1. Buat halaman `src/pages/BookingPage.tsx` di route `/booking`.
2. Form (react-hook-form + zod, sudah terpasang):
   - paket, jumlah orang, add-on (otomatis terisi dari kalkulator lewat URL),
   - tanggal (komponen `calendar` yang sudah ada; tanggal lewat dan hari libur dimatikan),
   - jam (dari tab `Jadwal`), nama, nomor WhatsApp.
3. Total dihitung ulang dengan `pricing.ts` dan tampil di bawah form.
4. Saat kirim:
   1. POST ke Apps Script (`action: booking`), maksimal tunggu 3 detik, gagal pun tetap lanjut.
   2. Buka WhatsApp admin dengan pesan rapi: paket, tanggal, jam, jumlah orang, add-on, total, nama.
   3. Halaman terima kasih + link form registrasi (fitur 6).
5. Kode agen dari portal partner (`?agen=TRAVELX`) disimpan ke kolom `kode_agen`.
6. Ganti tombol "Booking" di sticky bar HP dan halaman harga agar menuju `/booking`.
7. **Selesai jika:** satu booking percobaan muncul di tab `Booking` dan pesan WhatsApp-nya lengkap.

## Fitur 6 — Form Registrasi + Persetujuan Keselamatan

**Butuh dari owner:** teks aturan keselamatan yang disetujui owner (batas usia, batas berat, larangan, dll).

1. Buat halaman `/registrasi` (bisa membawa `?booking=…` dari fitur 3).
2. Isi per peserta: nama, usia, berat badan, pengalaman (belum pernah / pernah / rutin). Tombol "tambah peserta" untuk rombongan.
3. Tampilkan aturan keselamatan dari owner, wajib dicentang sebelum kirim.
4. Peringatan otomatis jika usia/berat di luar batas yang ditentukan owner (tetap bisa kirim, coach yang memutuskan).
5. POST ke tab `Registrasi`, lalu tampil halaman sukses.
6. **Selesai jika:** coach bisa membuka tab `Registrasi`, menyaring per tanggal, dan melihat siapa yang pemula.

## Fitur 1 — Gallop Membercard

**Butuh dari owner:** satu contoh grup asli (foto, video, link folder Drive) untuk percobaan.

1. Buat halaman `src/pages/MemberPage.tsx` di route `/member/:kode` (`noindex`).
2. Ambil data lewat `?action=member&kode=X`. Kode acak 6–8 huruf/angka agar tidak bisa ditebak.
3. Tampilan:
   - header nama grup, tanggal, kuda, coach,
   - galeri foto pilihan (dari ID Drive → thumbnail Drive, file harus "siapa saja yang punya link"),
   - video (YouTube atau Drive embed),
   - tombol **"Semua foto & video"** ke folder Drive,
   - tombol share ke WhatsApp dan salin link, plus ajakan tag Instagram Gallop.
4. QR code: tambah library `qrcode` (npm), tampilkan QR halaman member dan tombol unduh QR (untuk ditunjukkan di lokasi).
5. Kode tidak ditemukan → halaman ramah "kode tidak ditemukan, hubungi admin".
6. Cara admin membuat member baru: isi satu baris di tab `Member` (dimasukkan ke panduan admin).
7. **Selesai jika:** admin menambah baris baru, membuka `/member/KODE`, dan foto langsung tampil di HP.

## Fitur 2 — Sertifikat "First Gallop"

**Butuh dari owner:** persetujuan desain dan teks sertifikat, nama kuda & coach (sudah ada di tab `Member`).

1. Desain sertifikat ukuran A4 landscape mengikuti identitas Gallop (hitam, emas, logo).
2. Buat `src/lib/certificate.ts`: menggambar sertifikat di `<canvas>` (1754 × 1240 px) berisi nama peserta, tanggal, nama kuda, coach, dan logo.
3. Tunggu `document.fonts.ready` sebelum menggambar, agar font Akira/Creato terpakai, bukan font cadangan.
4. Di halaman member: pilih nama dari daftar `peserta` (atau ketik nama), tampil pratinjau, tombol **Unduh** (PNG) dan **Bagikan** (Web Share API dengan file di HP; jika tidak didukung, unduh saja).
5. **Selesai jika:** sertifikat terunduh tajam, nama panjang tidak terpotong, dan bisa langsung dibagikan dari HP.

## Fitur 5 — Portal Partner Travel

**Butuh dari owner:** daftar travel partner, harga khusus agen per paket, kontak masing-masing.

1. Buat halaman `/partner/:kode` (`noindex`), data dari `?action=agen&kode=X`.
2. Tampilan: nama travel, harga agen per paket, materi promosi yang bisa diunduh (poster, foto pilihan), dan link booking khusus `gallopmadinah.id/booking?agen=KODE`.
3. Tombol salin link dan bagikan ke grup jamaah.
4. Booking yang masuk lewat link itu otomatis tercatat dengan `kode_agen` (fitur 3).
5. Tab `Rekap` di Sheet: jumlah booking, jumlah orang, dan total per agen per bulan (rumus Sheet, tanpa kode).
6. **Selesai jika:** booking percobaan lewat link agen muncul di tab `Rekap` agen tersebut.

## Fitur 9 — Bahasa Arab + Melayu

**Butuh dari owner:** siapa yang menyediakan/mengecek terjemahan Arab dan Melayu.

1. Perluas `LanguageContext`: bahasa `id | en | ar | ms`. Sekitar 300 teks perlu terjemahan.
2. Siapkan file terjemahan (spreadsheet) untuk diisi/dicek penerjemah, lalu dimasukkan ke kode.
3. Pemilih bahasa di Navbar berubah dari ID/EN menjadi 4 pilihan (dropdown di HP).
4. Bahasa Arab:
   - set `dir="rtl"` di `<html>`,
   - periksa class kiri/kanan (`left-`, `ml-`, `pl-`, `text-left`, dll) dan ganti ke versi logis (`start-`, `ms-`, `ps-`, `text-start`) atau tambah varian `rtl:`,
   - font Akira dan Creato **tidak punya huruf Arab** → tambah font Arab (misalnya Noto Kufi Arabic atau Tajawal dari Google Fonts) khusus saat bahasa Arab aktif.
5. FAQ dari Sheet: tambah kolom `tanya_ar`, `jawab_ar`, `tanya_ms`, `jawab_ms`.
6. **Selesai jika:** semua halaman rapi dalam 4 bahasa, versi Arab terbaca kanan-ke-kiri tanpa tata letak yang terbalik aneh.

---

## Tahap 5 — Serah Terima

1. Tes semua alur di HP (375 px) dan desktop: kalkulator → booking → registrasi → member → sertifikat; link agen → rekap.
2. Tes tanpa koneksi ke Sheet (data cadangan tetap tampil).
3. Kirim **panduan admin** (PDF/Google Doc): cara edit harga, FAQ, partner, testimoni, jadwal; cara membuat member; cara membaca booking, registrasi, rekap agen; cara membaca laporan GA4.
4. Kirim ringkasan ke owner + tagihan pelunasan Rp 600.000.

## Daftar Data dari Owner (satu kali kirim)

- [ ] Akun Google Gallop + undangan editor ke Sheet
- [ ] Satuan GMC (per mobil? berapa kursi?) dan video drone
- [ ] Jam ride, hari libur, batas hari pemesanan
- [ ] 3–5 testimoni + link Google Maps
- [ ] Teks aturan keselamatan, batas usia & berat
- [ ] Contoh 1 grup: foto, video, folder Drive
- [ ] Persetujuan desain sertifikat
- [ ] Daftar travel partner + harga agen
- [ ] Penerjemah / pengecek bahasa Arab & Melayu
- [ ] ID GA4 & Meta Pixel (atau izin membuatkan)
