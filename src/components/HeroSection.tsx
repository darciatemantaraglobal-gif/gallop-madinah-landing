import heroImage from "@/assets/hero-desert.jpg";
import gallopTitle from "@/assets/gallop-title-2.png";
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#112919]/[0.92] to-[#193B2C]/[0.92]" />
        {/* Subtle geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D4AF37' stroke-width='0.8'%3E%3C!-- Kawung motif --%3E%3Cellipse cx='30' cy='30' rx='12' ry='18' transform='rotate(45 30 30)'/%3E%3Cellipse cx='30' cy='30' rx='12' ry='18' transform='rotate(-45 30 30)'/%3E%3Ccircle cx='30' cy='30' r='5' fill='%23D4AF37' fill-opacity='0.3'/%3E%3Cellipse cx='90' cy='30' rx='12' ry='18' transform='rotate(45 90 30)'/%3E%3Cellipse cx='90' cy='30' rx='12' ry='18' transform='rotate(-45 90 30)'/%3E%3Ccircle cx='90' cy='30' r='5' fill='%23D4AF37' fill-opacity='0.3'/%3E%3Cellipse cx='30' cy='90' rx='12' ry='18' transform='rotate(45 30 90)'/%3E%3Cellipse cx='30' cy='90' rx='12' ry='18' transform='rotate(-45 30 90)'/%3E%3Ccircle cx='30' cy='90' r='5' fill='%23D4AF37' fill-opacity='0.3'/%3E%3Cellipse cx='90' cy='90' rx='12' ry='18' transform='rotate(45 90 90)'/%3E%3Cellipse cx='90' cy='90' rx='12' ry='18' transform='rotate(-45 90 90)'/%3E%3Ccircle cx='90' cy='90' r='5' fill='%23D4AF37' fill-opacity='0.3'/%3E%3C!-- Connector lines --%3E%3Cellipse cx='60' cy='60' rx='12' ry='18' transform='rotate(45 60 60)'/%3E%3Cellipse cx='60' cy='60' rx='12' ry='18' transform='rotate(-45 60 60)'/%3E%3Ccircle cx='60' cy='60' r='5' fill='%23D4AF37' fill-opacity='0.3'/%3E%3Cellipse cx='0' cy='60' rx='12' ry='18' transform='rotate(45 0 60)'/%3E%3Cellipse cx='0' cy='60' rx='12' ry='18' transform='rotate(-45 0 60)'/%3E%3Cellipse cx='120' cy='60' rx='12' ry='18' transform='rotate(45 120 60)'/%3E%3Cellipse cx='120' cy='60' rx='12' ry='18' transform='rotate(-45 120 60)'/%3E%3Cellipse cx='60' cy='0' rx='12' ry='18' transform='rotate(45 60 0)'/%3E%3Cellipse cx='60' cy='0' rx='12' ry='18' transform='rotate(-45 60 0)'/%3E%3Cellipse cx='60' cy='120' rx='12' ry='18' transform='rotate(45 60 120)'/%3E%3Cellipse cx='60' cy='120' rx='12' ry='18' transform='rotate(-45 60 120)'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 md:px-4">
        <img
          src={gallopTitle}
          alt="Gallop Madinah"
          className="w-56 md:w-80 lg:w-[420px] xl:w-[480px] mb-8 md:mb-10"
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
