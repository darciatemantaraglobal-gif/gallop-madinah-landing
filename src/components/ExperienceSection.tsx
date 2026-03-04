import horsePortrait from "@/assets/horse-portrait.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import { MapPin, Clock, Moon, Coffee } from "lucide-react";

const experiences = [
{ icon: MapPin, text: "Trek Padang Pasir", desc: "Menyusuri jalur gurun sepanjang 8–10 km yang menakjubkan" },
{ icon: Clock, text: "Durasi ±1,5–2 Jam", desc: "Waktu yang cukup untuk menikmati setiap momen perjalanan" },
{ icon: Moon, text: "Suasana Islami", desc: "Nuansa zaman Nabi yang membawa ketenangan spiritual" },

{ icon: Coffee, text: "Area Istirahat Arab", desc: "Nikmati kopi dan hidangan khas Arab di tengah gurun" }];


const ExperienceSection = ({ hideHeader = false }: {hideHeader?: boolean;}) => {
  return (
    <section id="experience" className="section-padding bg-card">
      <div className="container mx-auto px-5 md:px-4 max-w-3xl">
        {!hideHeader &&
        <>
            <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">The Experience</p>
            <h2 className="font-display text-2xl md:text-4xl text-foreground mb-2 leading-tight">
              Desert <span className="text-gold">Horse Riding</span>
            </h2>
            <div className="w-12 h-[1px] bg-gold/40 mb-6 md:mb-8" />
          </>
        }
        <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed mb-8 md:mb-10 max-w-md">
          Nikmati perjalanan berkuda melintasi padang pasir Madinah dengan suasana yang membawa Anda merasakan nuansa zaman Nabi. Pengalaman tak terlupakan untuk semua level pengendara.
        </p>

        <div className="space-y-3">
          {experiences.map((item, i) =>
          <div key={i} className="bg-background border border-border p-4 md:p-5 flex items-center gap-4 hover:border-gold/30 transition-all duration-500 group">
              <div className="w-10 h-10 md:w-12 md:h-12 border border-border rounded-full flex items-center justify-center flex-shrink-0 group-hover:border-gold/40 transition-colors duration-500">
                <item.icon className="w-4 h-4 md:w-5 md:h-5 text-gold" strokeWidth={1.5} />
              </div>
              


            
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default ExperienceSection;