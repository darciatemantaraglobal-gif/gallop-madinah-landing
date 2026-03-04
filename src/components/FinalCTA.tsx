import { Phone } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const FinalCTA = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-5 md:px-4 text-center">
        <h2 className="font-display text-3xl md:text-6xl font-light text-foreground mb-3 md:mb-4 leading-tight">
          Slot Terbatas <span className="italic font-medium">Setiap Hari</span>
        </h2>
        <div className="w-12 md:w-16 h-[1px] bg-gold mx-auto mb-6 md:mb-8" />
        <p className="text-muted-foreground font-body text-xs md:text-sm tracking-wide max-w-lg mx-auto mb-8 md:mb-12 leading-relaxed">
          Konsultasikan jadwal berkuda Anda sekarang dan rasakan pengalaman berkuda yang tak terlupakan di Madinah.
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 md:gap-3 bg-gold text-primary-foreground px-8 md:px-12 py-4 md:py-5 font-body text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase hover:bg-gold-highlight transition-all duration-300"
        >
          <Phone className="w-4 h-4 md:w-5 md:h-5" />
          Chat WhatsApp
        </a>
      </div>
    </section>
  );
};

export default FinalCTA;
