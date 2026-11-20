# Google Sheet + Apps Script (data website Gallop Madinah)

Website membaca harga (dan nanti FAQ, partner, testimoni, member, agen) dari Google Sheet milik Gallop.
Kalau Sheet belum disambungkan atau sedang error, website memakai data bawaan di `src/data/siteData.ts`.

## Setup sekali

1. Login ke **akun Google Gallop**, buat Google Sheet baru bernama `Gallop Madinah — Data Website`.
2. Buat tab dan baris judul (baris 1) persis seperti di bawah. Huruf besar/kecil judul tidak masalah.
3. **Extensions → Apps Script**, hapus isi bawaan, tempel isi `Code.gs`, simpan.
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Salin URL yang berakhiran `/exec`, lalu di Vercel: **Settings → Environment Variables**
   `VITE_SHEET_API_URL = <url /exec>` → Redeploy. Untuk lokal, isi juga di `.env.local`.
6. Undang developer sebagai **Editor** di Sheet.

Setiap kali `Code.gs` diubah: **Deploy → Manage deployments → Edit → Version: New version**. URL tetap sama.

## Tab yang dipakai sekarang

### `Harga`
| id | nama | nama_pendek | harga | min_orang | fitur | unggulan | harga_grup |
|---|---|---|---|---|---|---|---|
| open_trip | Open Trip | Open Trip | 350 | 20 | horse, coach, rest | tidak | tidak |
| premium | Premium Experience | Premium | 1250 | 1 | horse, helmet, boots, coach, rest, transport, videographer | ya | ya |

`fitur` memakai kode baris tabel harga: `horse, helmet, boots, coach, rest, transport, videographer`.
`harga_grup = ya` berarti harga per orang mengikuti tab `HargaGrup`.

### `HargaGrup`
| dari | sampai | harga |
|---|---|---|
| 1 | 1 | 1250 |
| 2 | 4 | 850 |
| 5 | 10 | 750 |
| 11 | | |

`sampai` kosong = tanpa batas atas. `harga` kosong = "Hubungi kami".

### `Addon`
| id | nama | harga |
|---|---|---|
| gmc | GMC | 800 |
| drone | Video drone | 600 |

### `Testimoni`
| nama | asal | bintang | isi | tampil |
|---|---|---|---|---|
| Aisyah | Jakarta | 5 | Saya pemula, coachnya sabar sekali. | ya |

Hanya baris dengan `tampil = ya` yang muncul. Section testimoni di website **baru tampil kalau ada minimal 3** testimoni.
`bintang` 1–5. Baris yang isinya kosong atau bintangnya di luar 1–5 dilewati.
Pakai testimoni asli dan minta izin customer sebelum ditampilkan.

### `Pengaturan`
| kunci | nilai |
|---|---|
| google_maps_url | https://maps.app.goo.gl/… (halaman Gallop di Google Maps) |
| google_review_url | https://g.page/r/…/review (link "tulis ulasan" dari Google Business Profile) |
| hari_booking_maks | 90 (berapa hari ke depan tanggal bisa dipilih di form booking) |
| usia_min | 6 (kosongkan = tidak ada peringatan usia) |
| berat_maks | 110 (kg; kosongkan = tidak ada peringatan berat) |

Link harus diawali `https://`.

### `FAQ`
| urutan | tanya_id | jawab_id | tanya_en | jawab_en | tanya_ms | jawab_ms | tanya_ar | jawab_ar |
|---|---|---|---|---|---|---|---|---|
| 1 | Apakah cocok untuk pemula? | Ya, … | Is it suitable for beginners? | Yes, … | Adakah sesuai untuk pemula? | Ya, … | هل هو مناسب للمبتدئين؟ | نعم، … |

Hanya kolom Indonesia yang wajib. Kolom bahasa lain boleh kosong: Inggris → tampil Indonesia, Melayu → tampil Indonesia,
Arab → tampil Inggris (atau Indonesia). Kalau tab ini kosong, website memakai FAQ bawaan (sudah 4 bahasa).

### `Partner`
| urutan | nama | logo_url | ukuran |
|---|---|---|---|
| 1 | Lintas Haramain Services | https://drive.google.com/file/d/…/view | normal |

`logo_url` boleh link Google Drive (file harus "siapa saja yang punya link") atau link gambar `https://` lain.
`ukuran`: `normal`, `large` (logo lebar yang terlihat kecil), atau `tall` (logo bertumpuk). Kalau tab kosong, website memakai logo bawaan.

### `Jadwal`
| jam | aktif |
|---|---|
| 07:00 | ya |
| 16:30 | ya |

Pilihan jam di form booking. `aktif` kosong atau `ya` = tampil. Kalau tab kosong, form menawarkan "Pagi / Sore".

### `Aturan`
| urutan | aturan_id | aturan_en | aturan_ms | aturan_ar |
|---|---|---|---|---|
| 1 | Saya akan mengikuti semua arahan coach. | I will follow every instruction from the coach. | Saya akan mengikuti semua arahan jurulatih. | سألتزم بجميع تعليمات المدرّب. |

Aturan keselamatan di form registrasi. **Isi dengan teks yang sudah disetujui owner.** Kalau tab kosong, website memakai aturan umum bawaan.

## Tab yang diisi otomatis oleh website

Buat tab ini dengan baris judul saja; website yang menambah barisnya.

### `Booking`
| waktu | kode | paket | tanggal | jam | jumlah | addon | total | nama | wa | hotel | catatan | kode_agen | status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

`status` diisi "baru"; admin boleh mengubahnya (mis. "terkonfirmasi", "batal").

### `Registrasi`
| waktu | kode_booking | nama | usia | berat | pengalaman | setuju |
|---|---|---|---|---|---|---|

### `Member` (halaman `/member/KODE`)
| kode | nama_grup | tanggal | kuda | coach | peserta | foto | video_url | drive_folder |
|---|---|---|---|---|---|---|---|---|
| GM-7K2QX | Rombongan Lintas Haramain | 2026-12-20 | Zahra | Fahd | Aisyah, Budi, Fatimah | link Drive foto 1, link Drive foto 2, … | https://youtu.be/… | https://drive.google.com/drive/folders/… |

- `kode`: **pakai kode booking** (`GM-…`) supaya tidak bisa ditebak orang lain. Huruf besar, angka, dan `-` saja.
- `tanggal`: format `2026-12-20` (atau sel bertipe tanggal).
- `peserta`: nama dipisah koma; dipakai sebagai pilihan nama di sertifikat.
- `foto`: link atau ID file Google Drive, dipisah koma, maksimal 30. Setiap file harus **"Siapa saja yang memiliki link"**.
- `video_url`: YouTube atau link file Google Drive (akan diputar di halaman). Boleh kosong.
- `drive_folder`: link folder Google Drive berisi semua file. Boleh kosong.

Website hanya meminta **satu baris** berdasarkan kode, jadi data grup lain tidak ikut terbuka.
Contoh tampilan tanpa Sheet: `gallopmadinah.id/member/DEMO`.

### `Agen` (portal `/partner/KODE`)
| kode | nama_travel | harga_agen_open_trip | harga_agen_premium | kontak |
|---|---|---|---|---|
| LINTAS | Lintas Haramain Services | 300 | 700 | +62 … |

- `kode`: huruf besar/angka/`-`, 2–20 karakter. Link booking partner: `gallopmadinah.id/booking?agen=KODE`.
- Harga agen per orang (SAR). Kosong = tampil "Tanya admin".
- Contoh tampilan tanpa Sheet: `gallopmadinah.id/partner/DEMO`.

### `Rekap` (rumus, diisi sendiri oleh Sheet)
Contoh untuk satu agen per bulan (baris 2, kode agen di kolom A, bulan `2026-12` di kolom B):

| A: kode_agen | B: bulan | C: jumlah booking | D: jumlah orang |
|---|---|---|---|
| LINTAS | 2026-12 | `=COUNTIFS(Booking!M:M,A2,Booking!D:D,B2&"*")` | `=SUMIFS(Booking!F:F,Booking!M:M,A2,Booking!D:D,B2&"*")` |

(Kolom di tab `Booking`: D = tanggal, F = jumlah, M = kode_agen.)

## Kapan perubahan muncul?

Data di-cache 5 menit. Untuk menampilkan perubahan segera: buka Apps Script → pilih fungsi `clearCache` → Run.
