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

      <div className="relative z-10 container mx-auto px-4 pb-24 md:pb-32 animate-fade-in-up">
        <p className="font-body text-xs tracking-[0.4em] uppercase text-white/70 mb-6">
          Premium Desert Horse Riding · Madinah
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[0.95] mb-8 max-w-4xl">
          Rasakan Pengalaman
          <br />
          <span className="font-semibold italic">Berkuda di Madinah</span>
        </h1>
        <p className="text-white/60 text-sm md:text-base font-body max-w-lg mb-10 leading-relaxed tracking-wide">
          Premium desert horse riding dengan coach profesional dan kuda Arabian terlatih. Nuansa Islami yang tak terlupakan.
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gold text-primary-foreground px-10 py-4 font-body text-xs tracking-[0.2em] uppercase hover:bg-gold-highlight transition-all duration-300"
        >
          <Phone className="w-4 h-4" />
          Book via WhatsApp
        </a>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-[1px] h-16 bg-white/30" />
      </div>
    </section>
  );
};

export default HeroSection;
