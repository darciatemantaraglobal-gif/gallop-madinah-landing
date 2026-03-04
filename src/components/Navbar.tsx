import { Phone, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo-landscape.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/experience", label: t("nav.experience") },
    { href: "/services", label: t("nav.services") },
    { href: "/prices", label: t("nav.prices") },
    { href: "/gallery", label: t("nav.gallery") },
  ];

  const WHATSAPP_LINK = `https://wa.me/628118880818?text=${encodeURIComponent(t("wa.general"))}`;

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Full-screen mobile overlay */}
      <div
        className={`fixed inset-0 z-[55] md:hidden transition-all duration-500 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-background" />

        <div className="relative z-10 h-full flex flex-col justify-center px-8">
          <div className="space-y-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block font-display text-2xl py-3 transition-all duration-500 ${
                  isActive(link.href) ? "text-gold" : "text-foreground/90 hover:text-gold"
                } ${
                  mobileOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: mobileOpen ? `${i * 80 + 150}ms` : "0ms" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div
            className={`mt-10 transition-all duration-500 ${
              mobileOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: mobileOpen ? "600ms" : "0ms" }}
          >
            <div className="w-10 h-[1px] bg-gold/30 mb-6" />
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-gold/60 text-gold px-8 py-3 font-body text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              {t("nav.booking")}
            </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 transition-all duration-500 ${
          mobileOpen ? "z-[60]" : "z-50"
        } ${
          scrolled && !mobileOpen
            ? "bg-background/95 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-5 md:px-8 max-w-6xl py-4 md:py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Gallop Madinah" className="h-8 md:h-10 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-body text-xs tracking-[0.25em] uppercase transition-colors duration-300 ${
                  isActive(link.href) ? "text-gold" : "text-muted-foreground hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "id" ? "en" : "id")}
              className="flex items-center gap-1.5 font-body text-[10px] md:text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-gold transition-colors duration-300"
              aria-label="Toggle language"
            >
              <span className={lang === "id" ? "text-gold font-bold" : ""}>ID</span>
              <span className="text-border">/</span>
              <span className={lang === "en" ? "text-gold font-bold" : ""}>EN</span>
            </button>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 border border-gold/50 text-gold px-5 py-2.5 text-xs font-body tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
            >
              <Phone className="w-3.5 h-3.5" />
              {t("nav.booking")}
            </a>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-foreground"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span className={`transition-transform duration-300 ${mobileOpen ? 'rotate-90' : 'rotate-0'}`}>
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
