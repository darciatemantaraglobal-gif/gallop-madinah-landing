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
    <section id="experience" className="section-padding bg-warm-white">
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
            <div className="absolute -bottom-8 -right-8 w-48 h-64 z-20 hidden lg:block">
              <img
                src={gallery1}
                alt="Berkuda di gurun"
                className="w-full h-full object-cover border-4 border-background shadow-xl"
              />
            </div>
            <div className="absolute top-8 -left-4 w-16 h-16 md:w-24 md:h-24 border-2 border-gold/30 z-0" />
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <p className="text-gold font-body text-[10px] md:text-xs tracking-[0.4em] uppercase mb-3 md:mb-4">The Experience</p>
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground mb-2 leading-tight">
              Desert <span className="italic font-medium">Horse Riding</span>
            </h2>
            <div className="w-12 md:w-16 h-[1px] bg-gold mb-6 md:mb-8" />
            <p className="text-muted-foreground font-body text-xs md:text-sm leading-relaxed mb-8 md:mb-12 max-w-md">
              Nikmati perjalanan berkuda melintasi padang pasir Madinah dengan suasana yang membawa Anda merasakan nuansa zaman Nabi. Pengalaman tak terlupakan untuk semua level pengendara.
            </p>
            <div className="space-y-4 md:space-y-6">
              {experiences.map((item, i) => (
                <div key={i} className="flex items-center gap-4 md:gap-5">
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-gold flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-foreground font-body text-xs md:text-sm tracking-wide">{item.text}</p>
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
