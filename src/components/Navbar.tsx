import { Phone, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#why", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#services", label: "Services" },
    { href: "#pricelist", label: "Prices" },
    { href: "#gallery", label: "Gallery" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        <a href="#" className="font-display text-3xl font-bold tracking-wide" style={{ color: scrolled ? 'hsl(var(--foreground))' : 'white' }}>
          GALLOP <span className="text-gold">MADINAH</span>
        </a>
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-body text-xs tracking-[0.25em] uppercase transition-colors duration-300 hover:text-gold ${
                scrolled ? "text-muted-foreground" : "text-white/80"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 text-xs font-body tracking-[0.15em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
          >
            <Phone className="w-3.5 h-3.5" />
            Book Now
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{ color: scrolled ? 'hsl(var(--foreground))' : 'white' }}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card/98 backdrop-blur-md border-t border-border">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-body text-xs tracking-[0.25em] uppercase text-foreground hover:text-gold transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 text-xs font-body tracking-[0.15em] uppercase mt-2"
            >
              <Phone className="w-3.5 h-3.5" />
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
