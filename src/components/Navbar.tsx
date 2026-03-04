import { Phone } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#" className="font-display text-2xl font-bold text-gold">
          Gallop Madinah
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#why" className="text-muted-foreground hover:text-gold transition-colors text-sm font-body tracking-wide uppercase">Tentang</a>
          <a href="#experience" className="text-muted-foreground hover:text-gold transition-colors text-sm font-body tracking-wide uppercase">Experience</a>
          <a href="#services" className="text-muted-foreground hover:text-gold transition-colors text-sm font-body tracking-wide uppercase">Layanan</a>
          <a href="#pricelist" className="text-muted-foreground hover:text-gold transition-colors text-sm font-body tracking-wide uppercase">Harga</a>
          <a href="#gallery" className="text-muted-foreground hover:text-gold transition-colors text-sm font-body tracking-wide uppercase">Galeri</a>
        </div>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-gold text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold font-body flex items-center gap-2 hover:shadow-gold transition-all duration-300"
        >
          <Phone className="w-4 h-4" />
          Book Now
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
