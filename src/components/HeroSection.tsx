import heroImage from "@/assets/hero-desert.jpg";
import { Phone, ChevronDown } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Full Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Berkuda di padang pasir Madinah saat golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 md:px-4">
        <p className="font-body text-xs md:text-sm tracking-[0.35em] uppercase text-white/70 mb-6 md:mb-8">
          Madinah · Saudi Arabia
        </p>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] md:leading-[1.05] mb-3 md:mb-4 max-w-4xl text-shadow-hero">
          Gallop <span className="text-gold">Madinah</span>
        </h1>

        <p className="text-white/60 font-body text-sm md:text-base tracking-[0.15em] italic mb-8 md:mb-10">
          Premium Desert Horse Riding
        </p>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 md:gap-3 border border-gold/60 text-gold px-8 md:px-10 py-3 md:py-3.5 font-body text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
        >
          <Phone className="w-4 h-4" />
          Booking Now
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex flex-col items-center pb-8 md:pb-10 gap-2 animate-bounce">
        <span className="font-body text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/50">Scroll</span>
        <ChevronDown className="w-4 h-4 text-white/50" />
      </div>
    </section>
  );
};

export default HeroSection;
