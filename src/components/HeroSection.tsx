import heroImage from "@/assets/hero-desert.jpg";
import { Phone } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Berkuda di padang pasir Madinah saat golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      </div>
      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl animate-fade-in-up">
        <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-6">Premium Desert Horse Riding</p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6 text-shadow-hero">
          Rasakan Pengalaman Berkuda di Madinah dengan Nuansa Islami
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-body max-w-2xl mx-auto mb-10 leading-relaxed">
          Premium desert horse riding dengan coach profesional dan kuda Arabian terlatih.
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 gradient-gold text-primary-foreground px-10 py-4 rounded-full text-lg font-semibold font-body hover:shadow-gold transition-all duration-300 hover:scale-105"
        >
          <Phone className="w-5 h-5" />
          Book via WhatsApp
        </a>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-gold rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
