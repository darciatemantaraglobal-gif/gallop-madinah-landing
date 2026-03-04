import { Instagram } from "lucide-react";
import logoWhite from "@/assets/logo-landscape-white.png";
import logo from "@/assets/logo-landscape.png";

const Footer = () => {
  return (
    <footer className="py-10 md:py-16 bg-card border-t border-border">
      <div className="container mx-auto px-5 md:px-8 max-w-6xl">
        <div className="text-center">
          <a href="/" className="inline-block mb-2">
            <img src={logoWhite} alt="Gallop Madinah" className="h-8 md:h-10 mx-auto dark:block hidden" />
            <img src={logo} alt="Gallop Madinah" className="h-8 md:h-10 mx-auto dark:hidden block" />
          </a>
          <div className="w-10 h-[1px] bg-gold/30 mx-auto my-4 md:my-6" />
          <p className="text-muted-foreground font-body text-xs md:text-sm tracking-[0.2em] uppercase mb-5 md:mb-6">
            Premium Desert Horse Riding · Madinah, Saudi Arabia
          </p>
          <a
            href="https://instagram.com/gallopmadinah"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-5 md:mb-6"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
            <span className="font-body text-xs tracking-wider">@gallopmadinah</span>
          </a>
          <p className="text-muted-foreground/50 font-body text-[10px] md:text-xs tracking-wider uppercase">
            © 2026 Gallop Madinah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
