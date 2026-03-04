import { Phone } from "lucide-react";
import gallery3 from "@/assets/gallery-3.jpg";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const ParallaxCTA = () => {
  return (
    <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={gallery3}
          alt="Berkuda di padang pasir saat sunset"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative z-10 text-center px-5 md:px-4">
        <h2 className="font-display text-2xl md:text-5xl lg:text-6xl text-white mb-3 md:mb-5 leading-tight">
          Ride In <span className="text-gold">Style</span>
        </h2>
        <p className="font-body text-xs md:text-sm tracking-[0.25em] uppercase text-white/50 mb-8 md:mb-10">
          Giving you the wings you need
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 md:gap-3 border border-gold/60 text-gold px-8 md:px-10 py-3 md:py-3.5 font-body text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
        >
          <Phone className="w-4 h-4" />
          Start Today
        </a>
      </div>
    </section>
  );
};

export default ParallaxCTA;
