import horsePortrait from "@/assets/horse-portrait.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import { MapPin, Clock, Moon, Camera, Coffee, Waypoints, Car, UserCheck, UtensilsCrossed } from "lucide-react";

const experiences = [
  { icon: MapPin, text: "Trek Padang Pasir", desc: "Menyusuri jalur gurun sepanjang 8–10 km yang menakjubkan" },
  { icon: Clock, text: "Durasi ±1,5–2 Jam", desc: "Waktu yang cukup untuk menikmati setiap momen perjalanan" },
  { icon: Moon, text: "Suasana Islami", desc: "Nuansa zaman Nabi yang membawa ketenangan spiritual" },
  { icon: Camera, text: "Dokumentasi Profesional", desc: "Foto dan video estetik sebagai kenangan berharga" },
  { icon: Coffee, text: "Area Istirahat Arab", desc: "Nikmati kopi dan hidangan khas Arab di tengah gurun" },
];

const services = [
  { icon: Waypoints, title: "Kuda Arabian Terlatih", desc: "Kuda pilihan yang jinak dan tangguh untuk segala medan" },
  { icon: Car, title: "Antar Jemput Hotel", desc: "Layanan penjemputan dari hotel Anda" },
  { icon: UserCheck, title: "Private Coaching", desc: "Bimbingan personal dari coach berpengalaman" },
  { icon: UtensilsCrossed, title: "Snack & Drinks", desc: "Hidangan ringan dan minuman khas Arab" },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="section-padding bg-card">
      <div className="container mx-auto px-5 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* Images */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={horsePortrait}
                alt="Kuda Arabian di padang pasir"
                className="w-full object-cover aspect-[3/4] max-h-[60vh] md:max-h-none"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-56 z-20 hidden lg:block">
              <img
                src={gallery1}
                alt="Berkuda di gurun"
                className="w-full h-full object-cover border-2 border-background shadow-xl"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">The Experience</p>
            <h2 className="font-display text-2xl md:text-4xl text-foreground mb-2 leading-tight">
              Desert <span className="text-gold">Horse Riding</span>
            </h2>
            <div className="w-12 h-[1px] bg-gold/40 mb-6 md:mb-8" />
            <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed mb-8 md:mb-10 max-w-md">
              Nikmati perjalanan berkuda melintasi padang pasir Madinah dengan suasana yang membawa Anda merasakan nuansa zaman Nabi. Pengalaman tak terlupakan untuk semua level pengendara.
            </p>

            <div className="space-y-3">
              {experiences.map((item, i) => (
                <div key={i} className="bg-background border border-border p-4 md:p-5 flex items-center gap-4 hover:border-gold/30 transition-all duration-500 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 border border-border rounded-full flex items-center justify-center flex-shrink-0 group-hover:border-gold/40 transition-colors duration-500">
                    <item.icon className="w-4 h-4 md:w-5 md:h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-body font-bold text-sm md:text-base text-foreground normal-case tracking-normal">{item.text}</h3>
                    <p className="text-muted-foreground font-body text-xs md:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="mt-10 md:mt-16">
          <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-4 md:mb-6 text-center">Layanan Kami</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {services.map((item, i) => (
              <div
                key={i}
                className="bg-background border border-border p-3 md:p-5 group hover:border-gold/30 transition-all duration-500"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 border border-border rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:border-gold/40 transition-colors duration-500">
                  <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-body font-bold text-xs md:text-sm text-foreground mb-1 normal-case tracking-normal">{item.title}</h3>
                <p className="text-muted-foreground font-body text-[10px] md:text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
