import { Phone } from "lucide-react";
import gallery3 from "@/assets/gallery-3.jpg";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const ParallaxCTA = () => {
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={gallery3}
          alt="Berkuda di padang pasir saat sunset"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 text-center px-4">
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
          Ride In <span className="italic font-medium">Style</span>
        </h2>
        <p className="font-body text-xs tracking-[0.3em] uppercase text-white/60 mb-10">
          Giving you the wings you need
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gold text-primary-foreground px-10 py-4 font-body text-xs tracking-[0.2em] uppercase hover:bg-gold-highlight transition-all duration-300"
        >
          <Phone className="w-4 h-4" />
          Start Today
        </a>
      </div>
    </section>
  );
};

export default ParallaxCTA;
