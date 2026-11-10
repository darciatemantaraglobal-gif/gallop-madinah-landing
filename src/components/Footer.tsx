import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-landscape-white.png";
import logo from "@/assets/logo-landscape.png";
import HorseIcon from "@/components/icons/HorseIcon";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-10 md:py-16 bg-card border-t border-border">
      <div className="container mx-auto px-5 md:px-8 max-w-6xl">
        <div className="text-center">
          <Link to="/" className="inline-block mb-2">
            <img src={logoWhite} alt="Gallop Madinah" className="h-8 md:h-10 mx-auto dark:block hidden" />
            <img src={logo} alt="Gallop Madinah" className="h-8 md:h-10 mx-auto dark:hidden block" />
          </Link>
          <div className="flex items-center justify-center gap-3 my-4 md:my-6">
            <span className="w-10 h-[1px] bg-gold/30" />
            <HorseIcon className="w-5 h-5 text-gold/70" />
            <span className="w-10 h-[1px] bg-gold/30" />
          </div>
          <p className="text-muted-foreground font-body text-xs md:text-sm tracking-[0.2em] uppercase mb-5 md:mb-6">
            {t("footer.tagline")}
          </p>
          <div className="flex items-center justify-center gap-4 mb-5 md:mb-6">
            <a
              href="https://instagram.com/gallopmadinah"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
              <span className="font-body text-xs tracking-wider">@gallopmadinah</span>
            </a>
            <span className="text-muted-foreground/30">|</span>
            <a
              href="https://tiktok.com/@gallopmadinah"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z"/></svg>
              <span className="font-body text-xs tracking-wider">@gallopmadinah</span>
            </a>
          </div>
          <p className="text-muted-foreground/50 font-body text-[10px] md:text-xs tracking-wider uppercase">
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
