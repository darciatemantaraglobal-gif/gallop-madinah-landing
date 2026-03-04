import horsePortrait from "@/assets/horse-portrait.jpg";
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
    <section id="experience" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src={horsePortrait}
              alt="Kuda Arabian di padang pasir"
              className="rounded-2xl w-full object-cover aspect-square shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 gradient-gold rounded-2xl flex items-center justify-center shadow-gold">
              <div className="text-center text-primary-foreground">
                <p className="font-display text-3xl font-bold">8+</p>
                <p className="font-body text-xs">KM Trek</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4">Pengalaman</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              The Desert Experience
            </h2>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-10">
              Nikmati perjalanan berkuda melintasi padang pasir Madinah dengan suasana yang membawa Anda merasakan nuansa zaman Nabi.
            </p>
            <div className="space-y-5">
              {experiences.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <p className="text-foreground font-body">{item.text}</p>
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
