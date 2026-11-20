# Panduan Admin Website Gallop Madinah

Semua yang bisa diubah sendiri ada di **Google Sheet "Gallop Madinah — Data Website"**.
Ubah isi sel → tunggu ±5 menit → website ikut berubah. Tidak perlu menghubungi developer.

> Kalau ada yang salah ketik (misalnya harga ditulis huruf), website **tidak rusak**: baris yang salah dilewati
> atau website kembali memakai data bawaan. Cek website setelah mengubah sesuatu.

## Mengubah harga

Tab **`Harga`** (satu baris per paket)
- `harga`: angka saja, tanpa titik juga boleh (`1250` atau `1.250`).
- `min_orang`: minimal peserta. Open Trip = `20`.
- `fitur`: isi tabel centang, dipisah koma: `horse, helmet, boots, coach, rest, transport, videographer`.

Tab **`HargaGrup`** (harga Premium per orang sesuai jumlah)
- Contoh: `2 | 4 | 850` berarti 2–4 orang, 850 SAR per orang.
- `sampai` dikosongkan = tanpa batas atas. `harga` dikosongkan = tampil "Hubungi kami".

Tab **`Addon`**: GMC, video drone, dan tambahan lain beserta harganya.

Harga di tabel, kalkulator, dan form booking selalu sama karena membaca dari tab yang sama.

## Mengubah FAQ

Tab **`FAQ`**: satu baris per pertanyaan. `urutan` menentukan posisi.
Kolom bahasa Inggris boleh dikosongkan.

## Logo partner

Tab **`Partner`**
1. Upload logo (PNG transparan paling bagus) ke Google Drive.
2. Klik kanan → Bagikan → **Siapa saja yang memiliki link** → Salin link.
3. Tempel di kolom `logo_url`.
4. `ukuran`: `normal`; pakai `large` kalau logonya terlihat kecil, `tall` untuk logo bertumpuk.

## Testimoni

Tab **`Testimoni`**: nama, asal, bintang (1–5), isi, tampil (`ya`/`tidak`).
Section testimoni muncul di website setelah ada **minimal 3** testimoni dengan `tampil = ya`.
Gunakan testimoni asli dan minta izin customer.

Tab **`Pengaturan`**: link Google Maps (`google_maps_url`) dan link tulis ulasan (`google_review_url`).

## Jadwal booking

- Tab **`Jadwal`**: jam yang bisa dipilih customer, misalnya `07:00`, `16:30`. Kosongkan `aktif` atau isi `tidak` untuk menyembunyikan.
- `Pengaturan` → `hari_booking_maks`: berapa hari ke depan tanggal bisa dipilih (bawaan 90).

## Booking yang masuk

Setiap customer menekan **"Kirim booking via WhatsApp"**:
1. WhatsApp admin menerima pesan berisi kode booking (contoh `GM-7K2QX`), paket, tanggal, jam, jumlah orang, tambahan, total, nama, dan hotel.
2. Jika Sheet sudah tersambung, baris baru muncul di tab **`Booking`** dengan status `baru`.

Admin mengonfirmasi lewat WhatsApp, lalu boleh mengubah kolom `status` (mis. `terkonfirmasi`, `selesai`, `batal`).
Kode booking yang sama dipakai di WhatsApp dan di Sheet, jadi mudah dicocokkan.

## Data peserta & aturan keselamatan

Setelah booking, customer diarahkan ke form **Data Peserta** (`gallopmadinah.id/registrasi`).
Link ini juga bisa dikirim manual ke customer.

- Hasilnya masuk ke tab **`Registrasi`**: nama, usia, berat, pengalaman, dan persetujuan aturan, lengkap dengan kode booking.
- Coach bisa menyaring per kode booking atau tanggal untuk melihat siapa yang pemula.
- Tab **`Aturan`**: teks aturan keselamatan yang harus disetujui. **Isi dengan teks yang disetujui owner.**
- `Pengaturan` → `usia_min` dan `berat_maks`: jika diisi, form menampilkan peringatan untuk peserta di luar batas
  (customer tetap bisa mengirim; keputusan tetap di coach).

## Membercard: membuat halaman dokumentasi untuk satu grup

Setiap grup bisa punya halaman sendiri: `gallopmadinah.id/member/KODE` berisi foto pilihan, video, link folder Drive,
QR code, dan **Sertifikat First Gallop** yang bisa diunduh setiap peserta.
Contoh tampilannya: `gallopmadinah.id/member/DEMO`.

Langkah setelah sesi berkuda:
1. Buat folder di Google Drive untuk grup tersebut, upload semua foto & video.
2. Folder → Bagikan → **Siapa saja yang memiliki link** (file di dalamnya ikut terbuka).
3. Pilih 6–12 foto terbaik. Untuk tiap foto: klik kanan → Bagikan → Salin link.
4. Di tab **`Member`**, isi satu baris:
   - `kode`: kode booking grup itu (contoh `GM-7K2QX`). Jangan pakai kode yang mudah ditebak seperti nama grup.
   - `nama_grup`, `tanggal` (`2026-12-20`), `kuda`, `coach`.
   - `peserta`: semua nama dipisah koma (muncul sebagai pilihan nama di sertifikat).
   - `foto`: link foto pilihan, dipisah koma.
   - `video_url`: link YouTube atau link file video di Drive (boleh kosong).
   - `drive_folder`: link folder dari langkah 2.
5. Buka `gallopmadinah.id/member/KODE` untuk mengecek, lalu kirim link itu ke grup WhatsApp customer.
   Di halaman itu juga ada tombol **Unduh QR** untuk ditunjukkan atau dicetak di lokasi.

Kalau foto tidak muncul, hampir selalu karena file belum dibagikan "Siapa saja yang memiliki link".

## Portal partner travel

Setiap travel mitra punya halaman sendiri: `gallopmadinah.id/partner/KODE`, berisi link booking khusus + QR,
harga agen, pesan promosi siap kirim, dan foto/poster yang bisa diunduh. Contoh: `gallopmadinah.id/partner/DEMO`.

1. Tambah satu baris di tab **`Agen`**: `kode` (mis. `LINTAS`), `nama_travel`, harga agen Open Trip & Premium, kontak.
2. Kirim link `gallopmadinah.id/partner/LINTAS` ke travel tersebut (link ini **khusus partner**, berisi harga agen).
3. Travel membagikan **link booking**-nya (`gallopmadinah.id/booking?agen=LINTAS`) ke jamaah.
4. Setiap booking dari link itu masuk ke tab `Booking` dengan `kode_agen = LINTAS`, dan pesan WhatsApp-nya
   menyebut "Kode partner: LINTAS". Terapkan harga agen saat konfirmasi.
5. Lihat jumlah booking per travel di tab **`Rekap`** (rumus contoh ada di README Apps Script).

## Bahasa: Indonesia, Inggris, Melayu, Arab

Pengunjung bisa memilih **ID / EN / MS / AR** di pojok kanan atas. Versi Arab otomatis dibaca dari kanan ke kiri.
- Teks website untuk Melayu dan Arab sudah diterjemahkan, tetapi **sebaiknya dicek penutur asli** sebelum promosi besar.
- FAQ dan aturan keselamatan di Sheet punya kolom `_ms` dan `_ar`. Boleh dikosongkan: Melayu menampilkan versi Indonesia,
  Arab menampilkan versi Inggris.
- Sertifikat First Gallop tersedia dalam bahasa Indonesia, Inggris, dan Melayu (pengunjung berbahasa Arab mendapat versi Inggris).

## Perubahan belum muncul?

1. Tunggu 5 menit, lalu muat ulang halaman.
2. Masih belum? Buka Sheet → **Extensions → Apps Script** → pilih fungsi `clearCache` → **Run**.
3. Pastikan judul kolom (baris 1) tidak berubah.
