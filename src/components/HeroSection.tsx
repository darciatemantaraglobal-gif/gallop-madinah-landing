import heroImage from "@/assets/hero-desert.jpg";
import { Phone } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Berkuda di padang pasir Madinah saat golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      </div>

      <div className="relative z-10 container mx-auto px-5 md:px-4 pb-20 md:pb-32 animate-fade-in-up">
        <h1 className="font-display text-3xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05] md:leading-[0.95] mb-8 md:mb-10 max-w-4xl">
          Rasakan Pengalaman
          <br />
          <span className="font-semibold italic">Berkuda di Madinah</span>
        </h1>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 md:gap-3 bg-gold text-primary-foreground px-7 md:px-10 py-3.5 md:py-4 font-body text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase hover:bg-gold-highlight transition-all duration-300"
        >
          <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Book via WhatsApp
        </a>
      </div>

      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-[1px] h-10 md:h-16 bg-white/30" />
      </div>
    </section>
  );
};

export default HeroSection;
