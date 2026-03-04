import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "id" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
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
  "svc.title1": { id: "Paket", en: "Service" },
  "svc.title2": { id: "Layanan", en: "Packages" },
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
  "price.single": { id: "Single", en: "Single" },
  "price.double": { id: "Double", en: "Double" },
  "price.triple": { id: "Triple", en: "Triple" },
  "price.single.desc": { id: "1 orang rider", en: "1 rider" },
  "price.double.desc": { id: "2 orang rider", en: "2 riders" },
  "price.triple.desc": { id: "3 orang rider", en: "3 riders" },
  "price.group": { id: "Group", en: "Group" },
  "price.packages": { id: "Packages", en: "Packages" },
  "price.bestvalue": { id: "Best Value", en: "Best Value" },
  "price.perorang": { id: "Per orang", en: "Per person" },
  "price.booknow": { id: "Book Now", en: "Book Now" },
  "price.addons": { id: "Add-Ons", en: "Add-Ons" },
  "price.drone": { id: "Drone Documentation", en: "Drone Documentation" },
  "price.gmc": { id: "GMC Experience", en: "GMC Experience" },
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

  // Gallery
  "gallery.subtitle": { id: "Captured Moments", en: "Captured Moments" },
  "gallery.title1": { id: "Our", en: "Our" },
  "gallery.title2": { id: "Gallery", en: "Gallery" },

  // CTA
  "cta.title1": { id: "Come As A Guest,", en: "Come As A Guest," },
  "cta.title2": { id: "Leave As A Friend", en: "Leave As A Friend" },
  "cta.desc": {
    id: "Let's make your Arabian Experience unforgettable",
    en: "Let's make your Arabian Experience unforgettable",
  },
  "cta.booking": { id: "Booking Now", en: "Book Now" },

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
  "page.svc.title": { id: "Paket", en: "Service" },
  "page.svc.accent": { id: "Layanan", en: "Packages" },
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
  "wa.general": {
    id: "Halo Gallop Madinah, saya ingin booking berkuda",
    en: "Hello Gallop Madinah, I would like to book horse riding",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("id");

  const t = (key: string) => {
    return translations[key]?.[lang] ?? key;
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
