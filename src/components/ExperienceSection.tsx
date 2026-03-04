import horsePortrait from "@/assets/horse-portrait.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import { MapPin, Clock, Moon, Camera, Coffee } from "lucide-react";

const experiences = [
  { icon: MapPin, text: "Trek Padang Pasir", desc: "Menyusuri jalur gurun sepanjang 8–10 km yang menakjubkan" },
  { icon: Clock, text: "Durasi ±1,5–2 Jam", desc: "Waktu yang cukup untuk menikmati setiap momen perjalanan" },
  { icon: Moon, text: "Suasana Islami", desc: "Nuansa zaman Nabi yang membawa ketenangan spiritual" },
  { icon: Camera, text: "Dokumentasi Profesional", desc: "Foto dan video estetik sebagai kenangan berharga" },
  { icon: Coffee, text: "Area Istirahat Arab", desc: "Nikmati kopi dan hidangan khas Arab di tengah gurun" },
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

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {experiences.map((item, i) => (
                <div key={i} className="text-center group">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 border border-border rounded-full flex items-center justify-center group-hover:border-gold/60 transition-all duration-500">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-gold" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-body font-bold text-sm md:text-base text-foreground mb-2 md:mb-3 normal-case tracking-normal">{item.text}</h3>
                  <p className="text-muted-foreground font-body text-xs md:text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
