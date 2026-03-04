import horsePortrait from "@/assets/horse-portrait.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import { MapPin, Clock, Moon, Coffee } from "lucide-react";

const experiences = [
  { icon: MapPin, text: "Trek Padang Pasir", desc: "Menyusuri jalur gurun sepanjang 8–10 km yang menakjubkan" },
  { icon: Clock, text: "Durasi ±1,5–2 Jam", desc: "Waktu yang cukup untuk menikmati setiap momen perjalanan" },
  { icon: Moon, text: "Suasana Islami", desc: "Nuansa zaman Nabi yang membawa ketenangan spiritual" },
  
  { icon: Coffee, text: "Area Istirahat Arab", desc: "Nikmati kopi dan hidangan khas Arab di tengah gurun" },
];

const ExperienceSection = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  return (
    <section id="experience" className="bg-card">
      {!hideHeader && (
        <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
          <img src={horsePortrait} alt="Kuda di padang pasir Madinah" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-5 md:px-8 pb-10 md:pb-16 max-w-6xl mx-auto">
            <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">The Experience</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3 leading-tight">
              Desert <span className="text-gold">Horse Riding</span>
            </h2>
            <div className="w-12 h-[1px] bg-gold/40 mb-4 md:mb-6" />
            <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed max-w-md md:max-w-lg">
              Nikmati perjalanan berkuda melintasi padang pasir Madinah dengan suasana yang membawa Anda merasakan nuansa zaman Nabi.
            </p>
          </div>
        </div>
      )}
      <div className="section-padding">
      <div className="container mx-auto px-5 md:px-8 max-w-6xl">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
    </section>
  );
};

export default ExperienceSection;
