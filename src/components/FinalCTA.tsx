import { Phone } from "lucide-react";
import gallery5 from "@/assets/gallery-5.jpg";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const FinalCTA = () => {
  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={gallery5}
          alt="Desert horse riding experience"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>
      <div className="relative z-10 text-center px-5 md:px-4">
        <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-4 md:mb-5">Siap Memulai?</p>
        <h2 className="font-display text-2xl md:text-5xl lg:text-6xl text-white mb-3 md:mb-5 leading-tight">
          Abadikan Momen <span className="text-gold">Berharga</span> Anda
        </h2>
        <p className="text-white/50 font-body text-sm md:text-base tracking-wide max-w-lg mx-auto mb-8 md:mb-10 leading-relaxed">
          Hubungi kami sekarang untuk reservasi pengalaman berkuda di Madinah. Slot terbatas setiap hari.
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
    </section>
  );
};

export default FinalCTA;
