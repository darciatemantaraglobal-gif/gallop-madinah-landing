import heroImage from "@/assets/hero-desert.jpg";
import gallopTitle from "@/assets/gallop-title.png";
import { Phone, ChevronDown } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/628118880818?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

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
        <div className="absolute inset-0 bg-[#193B2C]/95" />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 md:px-4">
        <img
          src={gallopTitle}
          alt="Gallop Madinah"
          className="w-48 md:w-72 lg:w-80 mb-8 md:mb-10"
        />

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
