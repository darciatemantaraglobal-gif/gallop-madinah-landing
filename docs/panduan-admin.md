# Panduan Admin Website Gallop Madinah

Semua dikelola di **gallopmadinah.id/admin** (bisa dari HP). Masuk dengan email dan password admin.
Lupa password: isi email di halaman login → **Lupa password?** → buka link di email.

Perubahan harga, FAQ, partner, testimoni, dan pengaturan langsung tampil di website (muat ulang halaman).
Kalau ada isian yang salah format, admin langsung memberi tanda merah dan tidak menyimpan.

## Booking

Setiap customer menekan **"Kirim booking via WhatsApp"** di website:
1. WhatsApp admin menerima pesan berisi **kode booking** (contoh `GM-7K2QX`), paket, tanggal, jam, jumlah orang, total, dan hotel.
2. Booking yang sama muncul di tab **Booking** dengan status **Baru**.

Di tab Booking:
- Ubah status: **Baru → Terkonfirmasi → Selesai** (atau **Batal**).
- Tulis catatan internal (tersimpan otomatis), mis. "DP sudah masuk".
- **WhatsApp** (jika customer mengisi nomor), **Data peserta**, dan **Buat halaman member** langsung dari kartunya.
- Filter: status, pencarian nama/kode/kode agen, dan "Mulai hari ini" untuk jadwal ke depan.

## Peserta

Data dari form registrasi (usia, berat, pengalaman), dikelompokkan per kode booking.
Peserta di bawah usia minimal atau di atas batas berat diberi **tanda merah** (batasnya diatur di Pengaturan).

## Member (dokumentasi + sertifikat)

Halaman `gallopmadinah.id/member/KODE` berisi foto, video, folder Drive, QR, dan Sertifikat First Gallop.
1. Dari tab Booking tekan **Buat halaman member** (kode, nama, tanggal, dan nama peserta otomatis terisi),
   atau tab Member → **Tambah member** (pakai kode booking agar tidak bisa ditebak).
2. **Upload foto** langsung dari HP (otomatis dikecilkan), atau tempel link Google Drive.
3. Isi link video (YouTube/Drive) dan link folder Drive berisi semua file.
4. **Simpan**, lalu tombol salin link → kirim ke grup customer.

## Agen (partner travel)

Tab Agen → **Tambah agen**: kode (mis. `LINTAS`), nama travel, harga agen, kontak.
- Kirim portal `gallopmadinah.id/partner/LINTAS` ke travel tersebut (berisi harga agen, link booking, QR, materi promosi).
- Booking lewat link travel tercatat dengan kode partnernya. Daftar agen menampilkan **jumlah booking dan orang bulan ini**.
- Nonaktifkan agen untuk menutup portalnya.

## Harga

- **Paket**: harga per orang, minimal orang, isi paket (`horse, helmet, boots, coach, rest, transport, videographer`).
- **Harga Grup**: harga Premium per orang sesuai jumlah orang. "Sampai" kosong = tanpa batas, harga kosong = "Hubungi kami".
- **Add-on**: GMC, video drone, dll.

Tabel harga, kalkulator, dan form booking selalu memakai harga yang sama.

## FAQ, Testimoni, Partner

- **FAQ**: hanya bahasa Indonesia yang wajib; kolom Inggris/Melayu/Arab boleh kosong.
- **Testimoni**: tampil di halaman depan setelah ada **minimal 3** yang dipublikasikan. Gunakan ulasan asli dengan izin customer.
- **Partner**: upload logo (PNG transparan paling bagus), pilih ukuran tampil, atur urutan.

## Pengaturan

- **Jam ride** yang bisa dipilih customer (kosong = Pagi/Sore) dan batas hari booking ke depan.
- **Usia minimal** dan **berat maksimal** peserta (kosong = tanpa peringatan).
- Link **Google Maps** dan **tulis ulasan** untuk section testimoni.
- **Aturan keselamatan** yang wajib disetujui peserta. **Ganti dengan teks resmi owner.**

## Bahasa

Pengunjung bisa memilih **ID / EN / MS / AR**. Teks website untuk Melayu dan Arab sudah diterjemahkan; sebaiknya
dicek penutur asli sebelum promosi besar. Sertifikat tersedia dalam bahasa Indonesia, Inggris, dan Melayu.

## Menambah admin

Lihat `docs/setup-supabase.md` langkah 4.
