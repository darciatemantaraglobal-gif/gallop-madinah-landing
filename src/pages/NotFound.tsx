import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import HorseIcon from "@/components/icons/HorseIcon";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="text-center">
        <HorseIcon className="w-14 h-14 md:w-16 md:h-16 text-gold mx-auto mb-6" />
        <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3">404</p>
        <h1 className="font-display text-2xl md:text-4xl text-foreground mb-4">{t("notfound.title")}</h1>
        <p className="text-muted-foreground font-body text-sm md:text-base mb-8 max-w-sm mx-auto">{t("notfound.desc")}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 border border-gold/60 text-gold px-8 py-3 font-body text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
        >
          {t("notfound.back")}
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
