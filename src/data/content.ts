// Built-in copies of the content the owner can later edit in the Google Sheet.
// The site shows these whenever the Sheet is not connected or a section in it is broken.

import partnerValeoora from "@/assets/partner-valeoora.png";
import partner1 from "@/assets/partner-1.png";
import partner4 from "@/assets/partner-4.png";
import partner5 from "@/assets/partner-5.png";
import partner8 from "@/assets/partner-8.png";
import partnerAteena from "@/assets/partner-ateena.png";
import partnerLintas from "@/assets/partner-lintas.png";

/** Indonesian is required; the other languages are optional (see `pick` in siteData.ts). */
export type Bilingual = { id: string; en: string; ms?: string; ar?: string };

export type FaqItem = { q: Bilingual; a: Bilingual };

/** "normal" box, "large" for wide wordmarks that look small, "tall" for stacked logos. */
export type PartnerSize = "normal" | "large" | "tall";
export type Partner = { name: string; logo: string; size: PartnerSize };

// FAQ wording from the client (Indonesian); English, Malay and Arabic translated from it.
export const FALLBACK_FAQ: FaqItem[] = [
  {
    q: {
      id: "Apakah berkuda di Gallop Madinah cocok untuk pemula?",
      en: "Is riding at Gallop Madinah suitable for beginners?",
      ms: "Adakah menunggang kuda di Gallop Madinah sesuai untuk pemula?",
      ar: "هل ركوب الخيل في Gallop Madinah مناسب للمبتدئين؟",
    },
    a: {
      id: "Ya, pemula bisa ikut karena akan didampingi coach berkuda selama aktivitas berlangsung.",
      en: "Yes, beginners are welcome — a riding coach accompanies you throughout the activity.",
      ms: "Ya, pemula boleh menyertai kerana akan dibimbing oleh jurulatih sepanjang aktiviti.",
      ar: "نعم، يمكن للمبتدئين المشاركة، إذ يرافقهم مدرّب ركوب طوال النشاط.",
    },
  },
  {
    q: {
      id: "Berapa lama perjalanan dari hotel ke stable Gallop Madinah?",
      en: "How long is the trip from my hotel to the Gallop Madinah stable?",
      ms: "Berapa lama perjalanan dari hotel ke kandang Gallop Madinah?",
      ar: "كم تستغرق الطريق من الفندق إلى إسطبل Gallop Madinah؟",
    },
    a: {
      id: "Sekitar 30 menit, tergantung lokasi hotel dan kondisi lalu lintas.",
      en: "About 30 minutes, depending on your hotel's location and traffic.",
      ms: "Lebih kurang 30 minit, bergantung pada lokasi hotel dan keadaan lalu lintas.",
      ar: "حوالي 30 دقيقة، بحسب موقع الفندق وحركة المرور.",
    },
  },
  {
    q: {
      id: "Apa saja yang saya dapatkan dalam Paket Premium?",
      en: "What do I get with the Premium package?",
      ms: "Apakah yang saya dapat dalam Pakej Premium?",
      ar: "ماذا تشمل باقة البريميوم؟",
    },
    a: {
      id: "Paket Premium menawarkan fasilitas dan pengalaman berkuda eksklusif dengan benefit sesuai pilihan paket.",
      en: "The Premium package offers exclusive facilities and riding experience, with benefits according to the package you choose.",
      ms: "Pakej Premium menawarkan kemudahan dan pengalaman menunggang eksklusif dengan manfaat mengikut pakej yang dipilih.",
      ar: "تقدّم باقة البريميوم مرافق وتجربة ركوب حصرية، مع مزايا حسب الباقة التي تختارها.",
    },
  },
  {
    q: {
      id: "Apakah perlengkapan berkuda sudah disediakan?",
      en: "Is riding equipment provided?",
      ms: "Adakah peralatan menunggang disediakan?",
      ar: "هل تتوفر معدات الركوب؟",
    },
    a: {
      id: "Ya, kami menyediakan helm, sepatu berkuda, dan sorban untuk setiap peserta.",
      en: "Yes, we provide a helmet, riding boots and a shemagh (headscarf) for every rider.",
      ms: "Ya, kami menyediakan topi keledar, but menunggang dan serban untuk setiap peserta.",
      ar: "نعم، نوفّر لكل مشارك خوذة وحذاء ركوب وشماغًا.",
    },
  },
  {
    q: {
      id: "Berapa lama durasi aktivitas berkuda?",
      en: "How long does the ride last?",
      ms: "Berapa lama tempoh aktiviti menunggang?",
      ar: "كم تستغرق جولة الركوب؟",
    },
    a: {
      id: "Sekitar 1,5 jam dengan jarak tempuh kurang lebih 10 KM.",
      en: "About 1.5 hours, covering roughly 10 km.",
      ms: "Lebih kurang 1.5 jam dengan jarak lebih kurang 10 KM.",
      ar: "حوالي ساعة ونصف لمسافة تقارب 10 كم.",
    },
  },
  {
    q: {
      id: "Apakah anak-anak boleh ikut berkuda?",
      en: "Can children ride?",
      ms: "Bolehkah kanak-kanak menunggang?",
      ar: "هل يمكن للأطفال الركوب؟",
    },
    a: {
      id: "Ya, anak-anak dapat mengikuti aktivitas berkuda dengan ketentuan usia, kondisi fisik, dan pendampingan yang sesuai.",
      en: "Yes, children can join the ride, subject to age, physical condition and appropriate supervision.",
      ms: "Ya, kanak-kanak boleh menyertai tertakluk kepada syarat umur, keadaan fizikal dan pengawasan yang sesuai.",
      ar: "نعم، يمكن للأطفال المشاركة وفق شروط العمر والحالة البدنية والإشراف المناسب.",
    },
  },
  {
    q: {
      id: "Apakah tersedia dokumentasi foto dan video?",
      en: "Are photos and videos available?",
      ms: "Adakah dokumentasi foto dan video disediakan?",
      ar: "هل يتوفر تصوير بالصور والفيديو؟",
    },
    a: {
      id: "Silakan pilih paket yang tersedia untuk mengetahui fasilitas dokumentasi foto dan video.",
      en: "Please check the available packages to see which include photo and video documentation.",
      ms: "Sila semak pakej yang tersedia untuk mengetahui kemudahan dokumentasi foto dan video.",
      ar: "يرجى الاطلاع على الباقات المتاحة لمعرفة ما يشمل التصوير بالصور والفيديو.",
    },
  },
  {
    q: {
      id: "Apakah bisa berkuda bersama keluarga atau rombongan?",
      en: "Can I ride with my family or a group?",
      ms: "Bolehkah menunggang bersama keluarga atau rombongan?",
      ar: "هل يمكن الركوب مع العائلة أو المجموعة؟",
    },
    a: {
      id: "Tentu, kami menerima reservasi individu, keluarga, maupun rombongan.",
      en: "Of course — we welcome individual, family and group bookings.",
      ms: "Sudah tentu, kami menerima tempahan individu, keluarga dan rombongan.",
      ar: "بالتأكيد، نستقبل حجوزات الأفراد والعائلات والمجموعات.",
    },
  },
  {
    q: {
      id: "Apakah tersedia layanan antar-jemput hotel?",
      en: "Is hotel pick-up and drop-off available?",
      ms: "Adakah perkhidmatan ambil dan hantar dari hotel disediakan?",
      ar: "هل تتوفر خدمة التوصيل من الفندق وإليه؟",
    },
    a: {
      id: "Layanan transportasi dapat disediakan sesuai pilihan paket dan konfirmasi reservasi.",
      en: "Transportation can be arranged depending on your package and booking confirmation.",
      ms: "Pengangkutan boleh disediakan mengikut pakej yang dipilih dan pengesahan tempahan.",
      ar: "يمكن ترتيب النقل حسب الباقة المختارة وتأكيد الحجز.",
    },
  },
  {
    q: {
      id: "Apakah ada batasan usia atau berat badan peserta?",
      en: "Is there an age or weight limit?",
      ms: "Adakah had umur atau berat badan untuk peserta?",
      ar: "هل يوجد حد للعمر أو الوزن؟",
    },
    a: {
      id: "Ya, terdapat ketentuan tertentu untuk memastikan keselamatan dan kenyamanan selama berkuda.",
      en: "Yes, certain requirements apply to ensure safety and comfort while riding.",
      ms: "Ya, terdapat syarat tertentu untuk memastikan keselamatan dan keselesaan semasa menunggang.",
      ar: "نعم، هناك شروط معيّنة لضمان السلامة والراحة أثناء الركوب.",
    },
  },
];

export const FALLBACK_PARTNERS: Partner[] = [
  { name: "Valeoora Art", logo: partnerValeoora, size: "normal" },
  { name: "Partner 1", logo: partner1, size: "normal" },
  { name: "Partner 4", logo: partner4, size: "normal" },
  { name: "Partner 5", logo: partner5, size: "normal" },
  { name: "Umroh Moment", logo: partner8, size: "large" },
  { name: "Lintas Haramain Services", logo: partnerLintas, size: "normal" },
  { name: "Ateena Visual", logo: partnerAteena, size: "tall" },
];

/** Booking form settings. Empty `times` = offer "morning / afternoon" instead of exact slots. */
export type BookingSettings = { times: string[]; maxDaysAhead: number };
export const FALLBACK_BOOKING: BookingSettings = { times: [], maxDaysAhead: 90 };

/**
 * Safety rules shown on the registration form.
 * DRAFT: general rules only; replace with the owner's approved wording (Sheet tab "Aturan").
 * Age/weight limits stay null (no warnings) until the owner sets them.
 */
export type Safety = { rules: Bilingual[]; minAge: number | null; maxWeight: number | null };
export const FALLBACK_SAFETY: Safety = {
  rules: [
    {
      id: "Saya akan mengikuti semua arahan coach selama berada di area stable dan selama berkuda.",
      en: "I will follow every instruction from the coach at the stable and during the ride.",
      ms: "Saya akan mengikuti semua arahan jurulatih semasa berada di kawasan kandang dan semasa menunggang.",
      ar: "سألتزم بجميع تعليمات المدرّب في الإسطبل وأثناء الركوب.",
    },
    {
      id: "Saya memakai perlengkapan keselamatan yang diberikan dan pakaian yang nyaman untuk berkuda.",
      en: "I will wear the safety gear provided and clothing suitable for riding.",
      ms: "Saya akan memakai peralatan keselamatan yang diberikan dan pakaian yang selesa untuk menunggang.",
      ar: "سأرتدي معدات السلامة المقدَّمة وملابس مناسبة للركوب.",
    },
    {
      id: "Saya memberi tahu coach jika sedang sakit, hamil, atau punya kondisi kesehatan yang perlu diperhatikan.",
      en: "I will tell the coach if I am unwell, pregnant, or have a health condition to be aware of.",
      ms: "Saya akan memberitahu jurulatih jika sedang sakit, hamil atau mempunyai keadaan kesihatan yang perlu diberi perhatian.",
      ar: "سأُبلغ المدرّب إن كنت مريضًا أو حاملًا أو لدي حالة صحية تستدعي الانتباه.",
    },
    {
      id: "Anak-anak wajib didampingi orang tua atau wali selama kegiatan.",
      en: "Children must be accompanied by a parent or guardian throughout the activity.",
      ms: "Kanak-kanak wajib diiringi ibu bapa atau penjaga sepanjang aktiviti.",
      ar: "يجب أن يرافق الأطفالَ أحدُ الوالدين أو وليُّ الأمر طوال النشاط.",
    },
    {
      id: "Saya memahami bahwa berkuda memiliki risiko dan coach berhak menyesuaikan atau menghentikan kegiatan demi keselamatan.",
      en: "I understand riding carries risk and the coach may adjust or stop the activity for safety.",
      ms: "Saya faham bahawa menunggang kuda mempunyai risiko dan jurulatih berhak menyesuaikan atau menghentikan aktiviti demi keselamatan.",
      ar: "أدرك أن ركوب الخيل ينطوي على مخاطر، وأن للمدرّب الحق في تعديل النشاط أو إيقافه حفاظًا على السلامة.",
    },
  ],
  minAge: null,
  maxWeight: null,
};
