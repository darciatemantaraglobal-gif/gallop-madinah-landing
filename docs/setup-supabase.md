# Setup Supabase (database + panel /admin)

Sekali saja, ±20 menit. Setelah ini owner/admin mengelola semuanya di **gallopmadinah.id/admin**.

## 1. Buat project

1. Daftar/masuk di https://supabase.com (sebaiknya pakai **email Gallop**, supaya datanya milik Gallop).
2. **New project** → nama `gallop-madinah` → region **Singapore** atau **Frankfurt** → buat password database yang kuat dan simpan.
3. Tunggu sampai project siap.

## 2. Pasang struktur database

1. Buka **SQL Editor** → **New query**.
2. Salin seluruh isi `supabase/migrations/20261120084424_admin_panel.sql`, tempel, lalu **Run**.
   Ini membuat semua tabel, aturan keamanan (RLS), fungsi pencarian member/agen, tempat upload foto (`media`),
   dan mengisi harga, FAQ, logo partner, serta aturan keselamatan yang tampil sekarang.
3. Cek **Table Editor**: harus ada `packages`, `bookings`, `members`, dll.

## 3. Amankan login

**Authentication → Sign In / Providers → Email**
- Matikan **Allow new users to sign up** (hanya admin yang dibuat manual yang bisa masuk).

**Authentication → URL Configuration**
- Site URL: `https://gallopmadinah.id`
- Redirect URLs: tambahkan `https://gallopmadinah.id/admin`

## 4. Buat akun admin

1. **Authentication → Users → Add user → Create new user**: isi email admin dan password (min. 10 karakter),
   centang **Auto Confirm User**.
2. **SQL Editor**, jalankan (ganti emailnya):

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
where email = 'admin@contoh.com';
```

3. Ulangi untuk setiap admin. Mencabut akses: ganti `"admin"` menjadi `"none"` lalu minta admin itu keluar-masuk.

> Akses admin disimpan di `app_metadata`, yang hanya bisa diubah dari SQL Editor, bukan oleh pengguna sendiri.

## 5. Sambungkan website

1. **Project Settings → API Keys**: salin **Project URL** dan **Publishable key** (`sb_publishable_…`).
   **Jangan** pakai Secret key (`sb_secret_…`) di website.
2. Vercel → project → **Settings → Environment Variables** (Production):
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = Publishable key
3. **Deployments → Redeploy**.

## 6. Cek

- [ ] `gallopmadinah.id/admin` → login dengan akun admin → tab Booking terbuka.
- [ ] Ubah harga Open Trip di tab **Harga** → halaman depan ikut berubah (muat ulang halaman).
- [ ] Booking percobaan di `/booking` → muncul di tab **Booking** → ubah statusnya → hapus.
- [ ] Isi data peserta percobaan di `/registrasi` → muncul di tab **Peserta**.
- [ ] Tab **Member** → buat member dengan 1 foto → buka `/member/KODE`.
- [ ] Tab **Agen** → buat agen → buka `/partner/KODE`.
- [ ] Ganti teks **aturan keselamatan** di tab Pengaturan dengan teks resmi owner.

## Catatan

- **Paket gratis Supabase** cukup untuk awal (500 MB database, 1 GB foto). Project gratis bisa "tidur" kalau
  sama sekali tidak dipakai 7 hari; selama website dikunjungi, ini tidak terjadi. Paket Pro: USD 25/bulan.
- **Backup**: paket gratis tidak punya backup otomatis harian yang bisa dipulihkan sendiri. Sesekali ekspor
  tabel `bookings` dan `members` (Table Editor → Export to CSV).
- **Spam booking**: siapa pun bisa mengirim form booking (memang begitu tujuannya). Jika ada spam, booking
  bisa dihapus di admin; kalau sering, tambahkan captcha.
- Struktur database ada di `supabase/migrations/`. Perubahan berikutnya ditambahkan sebagai file migrasi baru.
