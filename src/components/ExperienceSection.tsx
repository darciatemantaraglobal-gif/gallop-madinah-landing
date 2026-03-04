import horsePortrait from "@/assets/horse-portrait.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import { MapPin, Clock, Moon, Camera, Coffee } from "lucide-react";

const experiences = [
  { icon: MapPin, text: "Trek padang pasir 8–10 km" },
  { icon: Clock, text: "Durasi ±1,5–2 jam" },
  { icon: Moon, text: "Suasana Islami ala zaman Nabi" },
  { icon: Camera, text: "Dokumentasi estetik dan profesional" },
  { icon: Coffee, text: "Area istirahat khas Arab" },
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

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {experiences.map((item, i) => (
                <div
                  key={i}
                  className="bg-background border border-border p-4 flex flex-col items-center text-center gap-3 hover:border-gold/30 transition-all duration-500 group"
                >
                  <div className="w-10 h-10 border border-border rounded-full flex items-center justify-center group-hover:border-gold/40 transition-colors duration-500">
                    <item.icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <p className="text-foreground/80 font-body text-xs leading-snug">{item.text}</p>
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
