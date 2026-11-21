import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ar } from "@/i18n/ar";
import { ms } from "@/i18n/ms";

export type Lang = "id" | "en" | "ms" | "ar";

/** Languages in the switcher, in display order. Arabic is written right-to-left. */
export const LANGUAGES: { code: Lang; label: string; name: string }[] = [
  { code: "id", label: "ID", name: "Bahasa Indonesia" },
  { code: "en", label: "EN", name: "English" },
  { code: "ms", label: "MS", name: "Bahasa Melayu" },
  { code: "ar", label: "AR", name: "العربية" },
];

export const isRtl = (lang: Lang) => lang === "ar";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

// Indonesian and English live here; Malay and Arabic are in src/i18n/ (same keys).
// A key missing in Malay/Arabic falls back to English.
export const translations: Record<string, { id: string; en: string }> = {
  // Navbar
  "nav.home": { id: "Home", en: "Home" },
  "nav.about": { id: "About", en: "About" },
  "nav.experience": { id: "Experience", en: "Experience" },
  "nav.services": { id: "Services", en: "Services" },
  "nav.prices": { id: "Prices", en: "Prices" },
  "nav.gallery": { id: "Gallery", en: "Gallery" },
  "nav.booking": { id: "Booking", en: "Booking" },

  // Hero
  "hero.booking": { id: "Booking Now", en: "Book Now" },
  "hero.scroll": { id: "Scroll", en: "Scroll" },
  "hero.eyebrow": { id: "Desert Horse Riding · Madinah", en: "Desert Horse Riding · Madinah" },
  "hero.tagline": {
    id: "Berkuda di padang pasir Madinah bersama kuda Arabian terlatih dan coach profesional.",
    en: "Ride across the Madinah desert on trained Arabian horses, guided by professional coaches.",
  },
  "hero.packages": { id: "Lihat Paket", en: "View Packages" },
  "hero.stat1": { id: "Trek Gurun 8–10 KM", en: "8–10 KM Desert Trek" },
  "hero.stat2": { id: "Kuda Arabian Terlatih", en: "Trained Arabian Horses" },
  "hero.stat3": { id: "Coach Profesional", en: "Professional Coaches" },
  "hero.slide": { id: "Foto", en: "Slide" },

  // Why Section
  "why.subtitle": { id: "Tentang Kami", en: "About Us" },
  "why.title1": { id: "Why", en: "Why" },
  "why.title2": { id: "Gallop Madinah", en: "Gallop Madinah" },
  "why.desc": {
    id: "Pelopor layanan berkuda profesional di Madinah dengan pengalaman premium yang aman dan berkesan. Kami percaya setiap momen berharga layak dikenang.",
    en: "The pioneer of professional horse riding services in Madinah with a premium, safe, and memorable experience. We believe every precious moment deserves to be remembered.",
  },
  "why.r1.title": { id: "Pelopor di Madinah", en: "Pioneer in Madinah" },
  "why.r1.desc": {
    id: "Layanan berkuda profesional pertama di Madinah dengan standar internasional.",
    en: "The first professional horse riding service in Madinah with international standards.",
  },
  "why.r2.title": { id: "Coach Berpengalaman", en: "Experienced Coaches" },
  "why.r2.desc": {
    id: "Didampingi coach bersertifikat yang siap membimbing di setiap langkah.",
    en: "Accompanied by certified coaches ready to guide you at every step.",
  },
  "why.r3.title": { id: "Kuda Arabian Pribadi", en: "Private Arabian Horses" },
  "why.r3.desc": {
    id: "Kuda Arabian terlatih milik pribadi yang jinak dan terawat sempurna.",
    en: "Privately owned, well-trained Arabian horses that are gentle and perfectly cared for.",
  },
  "why.r4.title": { id: "Aman untuk Keluarga", en: "Family Friendly" },
  "why.r4.desc": {
    id: "Program yang aman dan nyaman untuk pemula, anak-anak, dan keluarga.",
    en: "Safe and comfortable programs for beginners, children, and families.",
  },

  // Experience Section
  "exp.subtitle": { id: "The Experience", en: "The Experience" },
  "exp.title1": { id: "Desert", en: "Desert" },
  "exp.title2": { id: "Horse Riding", en: "Horse Riding" },
  "exp.desc": {
    id: "Nikmati perjalanan berkuda melintasi padang pasir Madinah dengan suasana yang membawa Anda merasakan nuansa zaman Nabi.",
    en: "Enjoy a horseback journey across the Madinah desert with an atmosphere that transports you to the era of the Prophet.",
  },
  "exp.e1.text": { id: "Trek Padang Pasir", en: "Desert Trek" },
  "exp.e1.desc": { id: "Menyusuri jalur gurun sepanjang 8–10 km yang menakjubkan", en: "Traverse an amazing 8–10 km desert trail" },
  "exp.e2.text": { id: "Durasi ±1,5–2 Jam", en: "Duration ±1.5–2 Hours" },
  "exp.e2.desc": { id: "Waktu yang cukup untuk menikmati setiap momen perjalanan", en: "Enough time to enjoy every moment of the journey" },
  "exp.e3.text": { id: "Suasana Islami", en: "Islamic Atmosphere" },
  "exp.e3.desc": { id: "Nuansa zaman Nabi yang membawa ketenangan spiritual", en: "An atmosphere reminiscent of the Prophet's era, bringing spiritual tranquility" },
  "exp.e4.text": { id: "Area Istirahat Arab", en: "Arabian Rest Area" },
  "exp.e4.desc": { id: "Nikmati kopi dan hidangan khas Arab di tengah gurun", en: "Enjoy Arabic coffee and traditional dishes in the middle of the desert" },

  // Services Section
  "svc.subtitle": { id: "Layanan Kami", en: "Our Services" },
  "svc.title1": { id: "Fasilitas", en: "Facilities" },
  "svc.title2": { id: "& Layanan", en: "& Services" },
  "svc.s1.title": { id: "Kuda Arabian Terlatih", en: "Trained Arabian Horses" },
  "svc.s1.desc": { id: "Kuda pilihan yang jinak dan tangguh untuk segala medan", en: "Hand-picked gentle and sturdy horses for all terrains" },
  "svc.s2.title": { id: "Antar Jemput Hotel", en: "Hotel Transfer" },
  "svc.s2.desc": { id: "Layanan penjemputan pagi atau sore dari hotel Anda", en: "Morning or afternoon pickup service from your hotel" },
  "svc.s3.title": { id: "Private Coaching", en: "Private Coaching" },
  "svc.s3.desc": { id: "Bimbingan personal dari coach berpengalaman", en: "Personal guidance from experienced coaches" },
  "svc.s4.title": { id: "Dokumentasi Profesional", en: "Professional Documentation" },
  "svc.s4.desc": { id: "Foto dan video estetik sebagai kenangan berharga", en: "Aesthetic photos and videos as precious memories" },
  "svc.s5.title": { id: "Snack & Drinks", en: "Snacks & Drinks" },
  "svc.s5.desc": { id: "Hidangan ringan dan minuman khas Arab tersedia", en: "Light snacks and traditional Arabian drinks available" },
  "svc.s6.title": { id: "Trek 8–10 KM", en: "8–10 KM Trek" },
  "svc.s6.desc": { id: "Menyusuri jalur gurun sepanjang 8–10 km yang menakjubkan", en: "Traverse an amazing 8–10 km desert trail" },

  // Pricelist Section
  "price.subtitle": { id: "Investment", en: "Investment" },
  "price.title1": { id: "Price", en: "Price" },
  "price.title2": { id: "List", en: "List" },
  "price.perperson": { id: "/ orang", en: "/ person" },
  "price.items": { id: "Fasilitas", en: "Includes" },
  "price.included": { id: "Termasuk", en: "Included" },
  "price.notincluded": { id: "Tidak termasuk", en: "Not included" },
  "price.book": { id: "Booking", en: "Book" },
  "price.complete": { id: "Paling Lengkap", en: "Most Complete" },
  "price.min": { id: "Min. {n} orang", en: "Min. {n} people" },
  "price.people.one": { id: "1 orang", en: "1 person" },
  "price.people.n": { id: "{n} orang", en: "{n} people" },
  "price.people.range": { id: "{a}–{b} orang", en: "{a}–{b} people" },
  "price.people.plus": { id: "{n}+ orang", en: "{n}+ people" },
  "price.f.horse": { id: "1 kuda", en: "1 horse" },
  "price.f.horse.desc": {
    id: "Kuda Arabian terlatih, disesuaikan dengan kemampuan Anda",
    en: "A trained Arabian horse matched to your level",
  },
  "price.f.helmet": { id: "Helm berkuda", en: "Riding helmet" },
  "price.f.helmet.desc": { id: "Helm pengaman agar berkuda tetap aman", en: "A safety helmet for every ride" },
  "price.f.boots": { id: "Boots berkuda", en: "Riding boots" },
  "price.f.boots.desc": {
    id: "Pijakan di sanggurdi lebih mantap dan nyaman",
    en: "A firmer, more comfortable footing in the stirrups",
  },
  "price.f.coach": { id: "Coach pendamping", en: "Accompanying coach" },
  "price.f.coach.desc": {
    id: "Didampingi coach berpengalaman selama berkuda",
    en: "An experienced coach guides you throughout the ride",
  },
  "price.f.transport": { id: "Private transportation", en: "Private transportation" },
  "price.f.transport.desc": { id: "Antar-jemput dari hotel Anda di Madinah", en: "Pick-up and drop-off at your hotel in Madinah" },
  "price.f.videographer": { id: "Videografer profesional", en: "Professional videographer" },
  "price.f.videographer.desc": {
    id: "Foto & video momen berkuda Anda, siap dibagikan",
    en: "Photos and video of your ride, ready to share",
  },
  "price.f.rest": { id: "Istirohah", en: "Istirahah (rest lounge)" },
  "price.f.rest.desc": {
    id: "Tempat santai bergaya majlis Arab untuk rehat sebelum & sesudah berkuda",
    en: "An Arabian majlis-style lounge to relax before and after your ride",
  },
  "price.group.title": { id: "Harga Grup", en: "Group Rates" },
  "price.group.desc": {
    id: "Premium Experience makin hemat kalau datang bareng keluarga atau rombongan. Harga per orang:",
    en: "The Premium Experience costs less per person when you come as a family or group:",
  },
  "price.group.ask": { id: "Hubungi kami", en: "Contact us" },
  "price.addons": { id: "Additional Services", en: "Additional Services" },
  "price.addons.desc": {
    id: "Bisa ditambahkan ke paket mana pun",
    en: "Can be added to any package",
  },
  "price.a.gmc": { id: "Mobil GMC", en: "GMC car" },
  "price.a.drone": { id: "Video drone", en: "Drone video" },
  "price.arabian.title1": { id: "Arabian Camp", en: "Arabian Camp" },
  "price.arabian.title2": { id: "Experience", en: "Experience" },
  "price.arabian.for30": { id: "SAR — untuk 30 orang", en: "SAR — for 30 people" },
  "price.arabian.book": { id: "Book Paket Spesial", en: "Book Special Package" },
  "price.camp1": { id: "Camping place", en: "Camping place" },
  "price.camp2": { id: "1 Horse experience", en: "1 Horse experience" },
  "price.camp3": { id: "Coach dan muthawif", en: "Coach and muthawif" },
  "price.camp4": { id: "Horse education session", en: "Horse education session" },
  "price.camp5": { id: "Meals untuk 30 orang", en: "Meals for 30 people" },
  "price.camp6": { id: "Snacks & drinks", en: "Snacks & drinks" },
  "price.camp7": { id: "Arabic coffee & tea", en: "Arabic coffee & tea" },
  "price.camp8": { id: "Transportation (bus)", en: "Transportation (bus)" },

  // How to book
  "how.subtitle": { id: "Mudah & Cepat", en: "Quick & Easy" },
  "how.title1": { id: "Cara", en: "How to" },
  "how.title2": { id: "Booking", en: "Book" },
  "how.step": { id: "Langkah", en: "Step" },
  "how.s1.title": { id: "Pilih paket", en: "Pick a package" },
  "how.s1.desc": {
    id: "Open Trip (min. 20 orang) atau Premium Experience. Tambah layanan lain kalau perlu.",
    en: "Open Trip (min. 20 people) or Premium Experience. Add extra services if you need them.",
  },
  "how.s2.title": { id: "Chat via WhatsApp", en: "Chat on WhatsApp" },
  "how.s2.desc": {
    id: "Kirim tanggal dan jumlah orang. Tim kami konfirmasi jadwal dan ketersediaan kuda.",
    en: "Send your date and group size. Our team confirms the schedule and horse availability.",
  },
  "how.s3.title": { id: "Datang & berkuda", en: "Arrive & ride" },
  "how.s3.desc": {
    id: "Datang ke lokasi atau dijemput (Private Transportation), lalu berkuda bersama coach.",
    en: "Come to the site or get picked up (Private Transportation), then ride with your coach.",
  },
  "how.cta": { id: "Booking via WhatsApp", en: "Book on WhatsApp" },
  "how.note": { id: "Tanya-tanya dulu juga boleh, gratis.", en: "Questions are welcome too — no obligation." },

  // Brand poster section
  "story.eyebrow": { id: "Gallop Pertama", en: "Your First Gallop" },
  "story.title1": { id: "Satu Gallop", en: "One Gallop" },
  "story.title2": { id: "Mengubah Segalanya", en: "Changes Everything" },
  "story.body": {
    id: "Awalnya ragu, lalu berubah jadi semangat. Tiba-tiba Anda bergerak seirama dengan kuda Arabian di tengah gurun Madinah, dan rasanya tidak akan terlupakan.",
    en: "What starts as hesitation turns into excitement. Suddenly you're moving in sync with an Arabian horse across the Madinah desert, and it stays with you.",
  },
  "story.cta": { id: "Lihat Paket", en: "See Packages" },

  // Price calculator
  "calc.subtitle": { id: "Kalkulator", en: "Calculator" },
  "calc.title1": { id: "Hitung", en: "Estimate" },
  "calc.title2": { id: "Biaya", en: "Your Cost" },
  "calc.desc": {
    id: "Pilih paket dan jumlah orang, total biayanya langsung muncul.",
    en: "Pick a package and group size to see the total right away.",
  },
  "calc.package": { id: "Paket", en: "Package" },
  "calc.from": { id: "mulai", en: "from" },
  "calc.people": { id: "Jumlah orang", en: "Number of people" },
  "calc.less": { id: "Kurangi orang", en: "Fewer people" },
  "calc.more": { id: "Tambah orang", en: "More people" },
  "calc.nudge": {
    id: "Tambah {n} orang lagi, harga jadi {price} SAR per orang",
    en: "Add {n} more and it's {price} SAR per person",
  },
  "calc.addons": { id: "Tambahan (opsional)", en: "Add-ons (optional)" },
  "calc.noaddon": { id: "tanpa tambahan", en: "none" },
  "calc.result": { id: "Rincian", en: "Breakdown" },
  "calc.total": { id: "Estimasi total", en: "Estimated total" },
  "calc.belowmin": {
    id: "{pkg} minimal {n} orang.",
    en: "{pkg} needs at least {n} people.",
  },
  "calc.switch": { id: "Hitung sebagai {pkg}: {total} SAR", en: "Price as {pkg}: {total} SAR" },
  "calc.onrequest": {
    id: "Untuk {n} orang atau lebih ada harga khusus. Kami kirim penawarannya lewat WhatsApp.",
    en: "Groups of {n} or more get a special rate. We'll send it on WhatsApp.",
  },
  "calc.book": { id: "Booking dengan total ini", en: "Book with this total" },
  "calc.ask": { id: "Minta harga grup", en: "Ask for group rate" },
  "calc.note": { id: "Estimasi. Harga final dikonfirmasi admin.", en: "Estimate. Final price confirmed by our team." },
  // Membercard (/member/:kode)
  "member.subtitle": { id: "Member Gallop", en: "Gallop Member" },
  "member.demo": {
    id: "Ini halaman contoh. Data member asli diisi admin lewat panel admin.",
    en: "This is a sample page. Real member pages are created by our team in the admin panel.",
  },
  "member.card": { id: "Membercard", en: "Membercard" },
  "member.code": { id: "Kode", en: "Code" },
  "member.riders": { id: "Peserta", en: "Riders" },
  "member.qr": { id: "QR code halaman member", en: "QR code for this member page" },
  "member.qr.download": { id: "Unduh QR", en: "Download QR" },
  "member.share": { id: "Bagikan", en: "Share" },
  "member.share.text": {
    id: "Dokumentasi berkuda {group} di Gallop Madinah 🐎",
    en: "{group}'s desert ride at Gallop Madinah 🐎",
  },
  "member.copy": { id: "Salin link", en: "Copy link" },
  "member.copied": { id: "Link tersalin", en: "Link copied" },
  "member.photos": { id: "Foto Pilihan", en: "Selected Photos" },
  "member.photo": { id: "Foto", en: "Photo" },
  "member.close": { id: "Tutup", en: "Close" },
  "member.prev": { id: "Foto sebelumnya", en: "Previous photo" },
  "member.next": { id: "Foto berikutnya", en: "Next photo" },
  "member.video": { id: "Video", en: "Video" },
  "member.video.open": { id: "Tonton video", en: "Watch the video" },
  "member.drive": { id: "Semua foto & video", en: "All photos & videos" },
  "member.drive.desc": { id: "Buka folder Google Drive untuk mengunduh semuanya", en: "Open the Google Drive folder to download everything" },
  "member.instagram": {
    id: "Bagikan momenmu di Instagram dan tag @gallopmadinah",
    en: "Share your moment on Instagram and tag @gallopmadinah",
  },
  "member.loading": { id: "Memuat data member…", en: "Loading member page…" },
  "member.notfound.title": { id: "Kode tidak ditemukan", en: "Code not found" },
  "member.notfound.desc": {
    id: "Kami tidak menemukan member dengan kode {code}. Periksa lagi link-nya atau hubungi admin.",
    en: "We couldn't find a member with code {code}. Check the link or contact our team.",
  },
  "member.unavailable.title": { id: "Halaman belum bisa dibuka", en: "Page unavailable" },
  "member.unavailable.desc": {
    id: "Data member sedang tidak bisa dimuat. Coba lagi sebentar lagi atau hubungi admin.",
    en: "Member data can't be loaded right now. Please try again shortly or contact our team.",
  },
  "member.help": { id: "Hubungi admin", en: "Contact us" },
  "member.help.wa": {
    id: "Halo Gallop Madinah, saya tidak bisa membuka halaman member dengan kode {code}.",
    en: "Hello Gallop Madinah, I can't open the member page with code {code}.",
  },

  // Travel partner portal (/partner/:kode)
  "partner.subtitle": { id: "Portal Partner", en: "Partner Portal" },
  "partner.demo": {
    id: "Ini halaman contoh. Data partner asli dan harga agen diisi admin lewat panel admin.",
    en: "This is a sample page. Real partner details and agent prices are set by our team in the admin panel.",
  },
  "partner.desc": {
    id: "Bagikan link booking di bawah ke jamaah Anda. Setiap booking lewat link ini tercatat atas nama travel Anda.",
    en: "Share the booking link below with your guests. Every booking made through it is recorded under your agency.",
  },
  "partner.link.title": { id: "Link booking khusus Anda", en: "Your booking link" },
  "partner.link.desc": {
    id: "Jamaah memilih paket, tanggal, dan jumlah orang sendiri. Kode partner Anda ikut terkirim otomatis.",
    en: "Guests pick the package, date and group size themselves. Your partner code is sent along automatically.",
  },
  "partner.qr": { id: "QR code link booking", en: "QR code for the booking link" },
  "partner.share.wa": { id: "Bagikan ke WhatsApp", en: "Share on WhatsApp" },
  "partner.prices.title": { id: "Harga agen", en: "Agent prices" },
  "partner.prices.public": { id: "Umum", en: "Public" },
  "partner.prices.agent": { id: "Agen", en: "Agent" },
  "partner.prices.ask": { id: "Tanya admin", en: "Ask us" },
  "partner.prices.note": {
    id: "Harga per orang dalam SAR. Harga agen diterapkan admin saat mengonfirmasi booking yang masuk lewat link Anda. Halaman ini khusus untuk partner, mohon tidak disebarkan ke jamaah.",
    en: "Prices per person in SAR. Agent prices are applied by our team when confirming bookings made through your link. This page is for partners only; please don't share it with guests.",
  },
  "partner.promo.title": { id: "Pesan siap kirim", en: "Ready-to-send message" },
  "partner.promo.desc": {
    id: "Salin dan kirim ke grup jamaah Anda. Link booking Anda sudah ada di dalamnya.",
    en: "Copy and send it to your guest groups. Your booking link is already inside.",
  },
  "partner.promo.text": {
    id: "Assalamu'alaikum 🙏\n\nMau merasakan berkuda kuda Arabian di padang pasir Madinah? Bersama Gallop Madinah, didampingi coach berpengalaman, cocok juga untuk pemula dan keluarga.\n\nPilih paket dan jadwalnya di sini:\n{link}",
    en: "Assalamu'alaikum 🙏\n\nWould you like to ride an Arabian horse in the desert of Madinah? Gallop Madinah's experienced coaches guide every rider, and beginners and families are welcome.\n\nPick your package and date here:\n{link}",
  },
  "partner.promo.copy": { id: "Salin pesan", en: "Copy message" },
  "partner.media.title": { id: "Materi promosi", en: "Promo material" },
  "partner.media.download": { id: "Unduh", en: "Download" },
  "partner.how.title": { id: "Cara kerjanya", en: "How it works" },
  "partner.how.1": {
    id: "Bagikan link atau QR booking Anda ke jamaah.",
    en: "Share your booking link or QR code with your guests.",
  },
  "partner.how.2": {
    id: "Jamaah mengisi form booking; admin Gallop mengonfirmasi lewat WhatsApp.",
    en: "Guests fill in the booking form; the Gallop team confirms on WhatsApp.",
  },
  "partner.how.3": {
    id: "Setiap booking tercatat dengan kode partner Anda. Rekap bulanan dikirim oleh admin.",
    en: "Every booking is recorded with your partner code. Our team sends you a monthly summary.",
  },
  "partner.contact": { id: "Hubungi admin Gallop", en: "Contact the Gallop team" },
  "partner.contact.wa": {
    id: "Halo Gallop Madinah, saya dari {name} (kode partner {code}). ",
    en: "Hello Gallop Madinah, this is {name} (partner code {code}). ",
  },
  "partner.notfound.desc": {
    id: "Kami tidak menemukan partner dengan kode {code}. Periksa lagi link-nya atau hubungi admin.",
    en: "We couldn't find a partner with code {code}. Check the link or contact our team.",
  },

  // First Gallop certificate
  "cert.title": { id: "Sertifikat First Gallop", en: "First Gallop Certificate" },
  "cert.desc": {
    id: "Pilih nama peserta, lalu simpan atau bagikan sertifikatnya.",
    en: "Pick a rider's name, then save or share the certificate.",
  },
  "cert.pick": { id: "Nama di sertifikat", en: "Name on certificate" },
  "cert.other": { id: "Nama lain", en: "Other name" },
  "cert.name.ph": { id: "Ketik nama peserta", en: "Type the rider's name" },
  "cert.download": { id: "Unduh sertifikat", en: "Download certificate" },
  "cert.share": { id: "Bagikan", en: "Share" },
  "cert.share.text": { id: "Sertifikat First Gallop dari Gallop Madinah 🐎", en: "My First Gallop certificate from Gallop Madinah 🐎" },

  // Rider registration (/registrasi)
  "reg.subtitle": { id: "Registrasi", en: "Registration" },
  "reg.title1": { id: "Data", en: "Rider" },
  "reg.title2": { id: "Peserta", en: "Details" },
  "reg.desc": {
    id: "Diisi sebelum hari berkuda, supaya coach bisa menyiapkan kuda yang sesuai untuk setiap peserta.",
    en: "Fill this in before your ride so the coach can prepare the right horse for every rider.",
  },
  "reg.code": { id: "Kode booking (opsional)", en: "Booking code (optional)" },
  "reg.rider": { id: "Peserta {n}", en: "Rider {n}" },
  "reg.name": { id: "Nama", en: "Name" },
  "reg.age": { id: "Usia (tahun)", en: "Age (years)" },
  "reg.weight": { id: "Berat badan (kg)", en: "Weight (kg)" },
  "reg.exp": { id: "Pengalaman berkuda", en: "Riding experience" },
  "reg.exp.none": { id: "Belum pernah", en: "Never" },
  "reg.exp.some": { id: "Pernah beberapa kali", en: "A few times" },
  "reg.exp.regular": { id: "Rutin berkuda", en: "Ride regularly" },
  "reg.add": { id: "Tambah peserta", en: "Add rider" },
  "reg.remove": { id: "Hapus", en: "Remove" },
  "reg.warn.age": {
    id: "Di bawah usia minimal {n} tahun. Coach akan memastikan apakah bisa ikut.",
    en: "Below the minimum age of {n}. The coach will confirm whether they can ride.",
  },
  "reg.warn.weight": {
    id: "Di atas batas berat {n} kg. Coach akan menyiapkan kuda yang sesuai atau menghubungi Anda.",
    en: "Above the {n} kg weight limit. The coach will arrange a suitable horse or contact you.",
  },
  "reg.err.fields": { id: "Lengkapi data yang ditandai merah.", en: "Please complete the fields marked in red." },
  "reg.rules": { id: "Aturan keselamatan", en: "Safety rules" },
  "reg.agree": {
    id: "Saya sudah membaca dan menyetujui aturan di atas untuk semua peserta yang saya daftarkan.",
    en: "I have read and agree to the rules above for every rider I am registering.",
  },
  "reg.err.agree": { id: "Centang persetujuan dulu.", en: "Please tick the agreement." },
  "reg.submit": { id: "Kirim data peserta", en: "Send rider details" },
  "reg.done.title": { id: "Data peserta terkirim", en: "Rider details sent" },
  "reg.done.desc": { id: "Terima kasih. Sampai jumpa di Gallop Madinah!", en: "Thank you. See you at Gallop Madinah!" },
  "reg.done.wa": {
    id: "Data belum bisa tersimpan otomatis. Tekan tombol di bawah untuk mengirimnya ke admin lewat WhatsApp.",
    en: "The details couldn't be saved automatically. Tap below to send them to our team on WhatsApp.",
  },
  "reg.done.wa.title": { id: "Satu langkah lagi", en: "One more step" },
  "reg.back": { id: "Kembali ke beranda", en: "Back to home" },
  "reg.wa": { id: "Halo Gallop Madinah, ini data peserta", en: "Hello Gallop Madinah, here are the rider details" },
  "reg.wa.for": { id: "untuk booking", en: "for booking" },
  "reg.wa.agree": { id: "Semua peserta menyetujui aturan keselamatan.", en: "All riders agree to the safety rules." },
  "reg.wa.yo": { id: "th", en: "y/o" },

  // Booking form (/booking)
  "booking.subtitle": { id: "Booking", en: "Booking" },
  "booking.title1": { id: "Pesan", en: "Book Your" },
  "booking.title2": { id: "Jadwal Berkuda", en: "Ride" },
  "booking.desc": {
    id: "Isi data singkat di bawah. Setelah dikirim, WhatsApp admin terbuka dengan rincian booking Anda.",
    en: "Fill in the short form below. When you send it, WhatsApp opens with your booking details for our team.",
  },
  "booking.step1": { id: "Paket & rombongan", en: "Package & group" },
  "booking.step2": { id: "Tanggal & waktu", en: "Date & time" },
  "booking.step3": { id: "Data pemesan", en: "Your details" },
  "booking.date": { id: "Tanggal", en: "Date" },
  "booking.date.pick": { id: "Pilih tanggal di kalender", en: "Pick a date on the calendar" },
  "booking.time": { id: "Waktu", en: "Time" },
  "booking.time.pagi": { id: "Pagi", en: "Morning" },
  "booking.time.sore": { id: "Sore", en: "Afternoon" },
  "booking.time.note": { id: "Jam pastinya dikonfirmasi admin.", en: "Exact time is confirmed by our team." },
  "booking.name": { id: "Nama pemesan", en: "Your name" },
  "booking.phone": { id: "Nomor WhatsApp (opsional)", en: "WhatsApp number (optional)" },
  "booking.hotel": { id: "Nama hotel di Madinah (untuk antar-jemput)", en: "Hotel in Madinah (for pick-up)" },
  "booking.notes": { id: "Catatan (opsional)", en: "Notes (optional)" },
  "booking.notes.ph": { id: "Misalnya: ada anak-anak, pemula semua", en: "e.g. children in the group, all beginners" },
  "booking.err.date": { id: "Pilih tanggal dulu.", en: "Please pick a date." },
  "booking.err.time": { id: "Pilih waktu.", en: "Please pick a time." },
  "booking.err.name": { id: "Isi nama pemesan.", en: "Please enter your name." },
  "booking.err.phone": { id: "Nomor WhatsApp belum benar.", en: "That WhatsApp number doesn't look right." },
  "booking.err.pkg": { id: "Paket ini belum bisa untuk jumlah orang tersebut.", en: "This package isn't available for that group size." },
  "booking.summary": { id: "Ringkasan", en: "Summary" },
  "booking.agent": { id: "Kode partner", en: "Partner code" },
  "booking.submit": { id: "Kirim booking via WhatsApp", en: "Send booking via WhatsApp" },
  "booking.submit.note": {
    id: "Belum ada pembayaran di sini. Admin mengonfirmasi jadwal dan cara bayar lewat WhatsApp.",
    en: "No payment here. Our team confirms the schedule and payment on WhatsApp.",
  },
  "booking.total.request": { id: "harga grup (mohon info)", en: "group rate (please advise)" },
  "booking.done.title": { id: "Booking terkirim", en: "Booking sent" },
  "booking.done.desc": {
    id: "Lanjutkan percakapan di WhatsApp. Admin akan mengonfirmasi jadwal dan cara pembayaran.",
    en: "Carry on in WhatsApp. Our team will confirm the schedule and how to pay.",
  },
  "booking.done.code": { id: "Kode booking", en: "Booking code" },
  "booking.done.blocked": {
    id: "WhatsApp belum terbuka? Tekan tombol di bawah.",
    en: "WhatsApp didn't open? Tap the button below.",
  },
  "booking.done.openwa": { id: "Buka WhatsApp", en: "Open WhatsApp" },
  "booking.done.reg.title": { id: "Satu langkah lagi", en: "One more step" },
  "booking.done.reg.desc": {
    id: "Isi data peserta (usia, berat, pengalaman) supaya coach bisa menyiapkan kuda yang tepat.",
    en: "Add each rider's age, weight and experience so the coach can prepare the right horses.",
  },
  "booking.done.reg.btn": { id: "Isi data peserta", en: "Add rider details" },
  "booking.done.new": { id: "Buat booking lain", en: "Make another booking" },
  "booking.wa": {
    id: "Halo Gallop Madinah, saya ingin booking:",
    en: "Hello Gallop Madinah, I would like to book:",
  },
  "booking.wa.end": { id: "Mohon konfirmasinya. Terima kasih 🙏", en: "Please confirm. Thank you 🙏" },
  "booking.wa.code": { id: "Kode", en: "Code" },
  "booking.wa.pkg": { id: "Paket", en: "Package" },
  "booking.wa.people": { id: "Jumlah", en: "Group" },
  "booking.wa.addons": { id: "Tambahan", en: "Add-ons" },
  "booking.wa.total": { id: "Estimasi total", en: "Estimated total" },
  "booking.wa.phone": { id: "No. WA", en: "WhatsApp" },
  "booking.wa.hotel": { id: "Hotel", en: "Hotel" },
  "calc.wa.ask": {
    id: "Halo Gallop Madinah, saya ingin harga grup untuk paket {pkg}, {people}. Mohon info harga dan jadwalnya. Terima kasih 🙏",
    en: "Hello Gallop Madinah, I'd like a group rate for the {pkg} package, {people}. Please share the price and schedule. Thank you 🙏",
  },

  // Testimonials
  "testi.subtitle": { id: "Kata Mereka", en: "Testimonials" },
  "testi.title1": { id: "Cerita", en: "Rider" },
  "testi.title2": { id: "Para Rider", en: "Stories" },
  "testi.swipe": { id: "Geser untuk melihat lainnya", en: "Swipe to see more" },
  "testi.google": { id: "Lihat ulasan di Google", en: "Read reviews on Google" },
  "testi.write": { id: "Tulis ulasan", en: "Write a review" },

  // FAQ (wording from the client)
  "faq.subtitle": { id: "FAQ", en: "FAQ" },
  "faq.title1": { id: "Pertanyaan", en: "Frequently Asked" },
  "faq.title2": { id: "Umum", en: "Questions" },
  "faq.more": { id: "Masih ada pertanyaan? Chat kami di WhatsApp", en: "Still have a question? Chat with us on WhatsApp" },

  // Sticky mobile bar
  "bar.prices": { id: "Lihat Harga", en: "See Prices" },
  "bar.book": { id: "Booking", en: "Book Now" },

  // Gallery
  "gallery.subtitle": { id: "Captured Moments", en: "Captured Moments" },
  "gallery.title1": { id: "Our", en: "Our" },
  "gallery.title2": { id: "Gallery", en: "Gallery" },
  "gallery.viewall": { id: "Lihat Semua Foto", en: "View All Photos" },

  // CTA
  "cta.title1": { id: "Come As A Guest,", en: "Come As A Guest," },
  "cta.title2": { id: "Leave As A Friend", en: "Leave As A Friend" },
  "cta.desc": {
    id: "Let's make your Arabian Experience unforgettable",
    en: "Let's make your Arabian Experience unforgettable",
  },
  "cta.booking": { id: "Booking Now", en: "Book Now" },

  // Partners
  "partners.title": { id: "Documentation Partner", en: "Documentation Partner" },

  // Footer
  "footer.tagline": { id: "Premium Desert Horse Riding · Madinah, Saudi Arabia", en: "Premium Desert Horse Riding · Madinah, Saudi Arabia" },
  "footer.rights": { id: "© 2026 Gallop Madinah. All rights reserved.", en: "© 2026 Gallop Madinah. All rights reserved." },

  // Page Heroes
  "page.about.subtitle": { id: "Tentang Kami", en: "About Us" },
  "page.about.title": { id: "Why", en: "Why" },
  "page.about.accent": { id: "Gallop Madinah", en: "Gallop Madinah" },
  "page.exp.subtitle": { id: "The Experience", en: "The Experience" },
  "page.exp.title": { id: "Desert", en: "Desert" },
  "page.exp.accent": { id: "Horse Riding", en: "Horse Riding" },
  "page.svc.subtitle": { id: "Layanan Kami", en: "Our Services" },
  "page.svc.title": { id: "Fasilitas", en: "Facilities" },
  "page.svc.accent": { id: "& Layanan", en: "& Services" },
  "page.gallery.subtitle": { id: "Captured Moments", en: "Captured Moments" },
  "page.gallery.title": { id: "Our", en: "Our" },
  "page.gallery.accent": { id: "Gallery", en: "Gallery" },

  // WhatsApp templates
  "wa.template": {
    id: "Halo Gallop Madinah, saya ingin booking paket *{pkg}*. Mohon info ketersediaan dan jadwalnya. Terima kasih 🙏",
    en: "Hello Gallop Madinah, I would like to book the *{pkg}* package. Please share availability and schedule. Thank you 🙏",
  },
  "wa.camp.template": {
    id: "Halo Gallop Madinah, saya ingin booking *Arabian Camp Experience* untuk 30 orang. Mohon info ketersediaan dan jadwalnya. Terima kasih 🙏",
    en: "Hello Gallop Madinah, I would like to book the *Arabian Camp Experience* for 30 people. Please share availability and schedule. Thank you 🙏",
  },
  "wa.aria": { id: "Chat via WhatsApp", en: "Chat on WhatsApp" },

  // 404
  "notfound.title": { id: "Halaman Tidak Ditemukan", en: "Page Not Found" },
  "notfound.desc": {
    id: "Sepertinya kudanya salah belok. Halaman yang Anda cari tidak ada.",
    en: "Looks like the horse took a wrong turn. The page you're looking for doesn't exist.",
  },
  "notfound.back": { id: "Kembali ke Beranda", en: "Back to Home" },

  "wa.general": {
    id: "Halo Gallop Madinah, saya ingin booking berkuda",
    en: "Hello Gallop Madinah, I would like to book horse riding",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** Akira and Creato have no Arabic letters; load an Arabic face only when Arabic is chosen. */
function loadArabicFont() {
  if (document.getElementById("font-arabic")) return;
  const link = document.createElement("link");
  link.id = "font-arabic";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700&display=swap";
  document.head.appendChild(link);
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Remember the visitor's language choice across pages/visits.
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("lang");
      return LANGUAGES.some((l) => l.code === saved) ? (saved as Lang) : "id";
    } catch {
      return "id";
    }
  });

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = isRtl(lang) ? "rtl" : "ltr";
    if (lang === "ar") loadArabicFont();
    try {
      localStorage.setItem("lang", lang);
    } catch {
      /* storage blocked: language still works for this visit */
    }
  }, [lang]);

  const t = (key: string) => {
    const base = translations[key];
    if (lang === "id" || lang === "en") return base?.[lang] ?? key;
    const dict = lang === "ar" ? ar : ms;
    return dict[key] ?? base?.en ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
