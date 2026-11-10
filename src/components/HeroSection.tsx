import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, ChevronRight } from "lucide-react";
import gallopTitle from "@/assets/gallop-title-2.png";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import heroM1 from "@/assets/hero-m1.jpg";
import heroM2 from "@/assets/hero-m2.jpg";
import heroM3 from "@/assets/hero-m3.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

// Real Gallop Madinah photos. Landscape shots for desktop, portrait shots for phones.
const slides = [
  { desktop: hero1, mobile: heroM1, alt: "Rider crossing the Madinah desert at dusk", focus: "50% 60%" },
  { desktop: hero2, mobile: heroM2, alt: "Rider on a chestnut Arabian horse at golden hour", focus: "50% 40%" },
  { desktop: hero3, mobile: heroM3, alt: "Grey Arabian horse trotting through the dust", focus: "50% 55%" },
];

const SLIDE_MS = 6500;

const HeroSection = () => {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const WHATSAPP_LINK = `https://wa.me/628118880818?text=${encodeURIComponent(t("wa.general"))}`;

  useEffect(() => {
    const id = window.setInterval(() => setActive((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => window.clearInterval(id);
  }, [active]); // restart the timer when a slide is picked manually

  const stats = [t("hero.stat1"), t("hero.stat2"), t("hero.stat3")];

  return (
    <section className="relative h-[100svh] min-h-[640px] flex flex-col overflow-hidden bg-background">
      {/* Left panel glow (desktop): keeps the text side rich instead of flat black */}
      <div className="absolute inset-0 hidden md:block bg-[radial-gradient(ellipse_at_10%_50%,hsl(var(--forest)/0.75),transparent_60%)]" />

      {/* Slides: full-bleed on phones, right ~60% on desktop so riders are never behind the text */}
      <div
        className="absolute inset-x-0 top-0 bottom-[30%] md:bottom-0 md:left-[36%] [mask-image:linear-gradient(to_bottom,black_60%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_35%)]"
        aria-hidden="true"
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${i === active ? "opacity-100" : "opacity-0"}`}
          >
            <picture>
              <source media="(max-width: 767px)" srcSet={s.mobile} />
              <img
                src={s.desktop}
                alt={s.alt}
                loading={i === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover animate-ken-burns motion-reduce:animate-none will-change-transform"
                style={{ objectPosition: s.focus, animationDelay: `${-i * 4}s` }}
              />
            </picture>
          </div>
        ))}
        {/* Grade: warm brand tint, fade into the text panel (desktop) / into the text area (phone) */}
        <div className="absolute inset-0 bg-[#112919]/35 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/40 md:from-background/80 md:to-background/40" />
      </div>
      {/* Phones: darken the lower half where the title and buttons sit */}
      <div className="absolute inset-0 md:hidden bg-gradient-to-t from-background via-background/70 via-45% to-transparent to-75%" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-end md:items-center">
        {/* Top padding clears the fixed navbar so the content never slides under it on short screens */}
        <div className="container mx-auto px-5 md:px-8 max-w-6xl pt-24 pb-8 md:pt-28 md:pb-6">
          <div className="flex flex-col items-center text-center md:items-start md:text-left md:max-w-[440px] lg:max-w-[480px]">
        {/* Phones: the eyebrow sits on bright sand, so it gets a dark glass pill. Desktop: plain line + text on the dark panel. */}
        <div className="mb-5 md:mb-8 opacity-0 animate-fade-in-up [animation-delay:150ms]">
          <span className="md:hidden inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/55 backdrop-blur-md px-4 py-1.5 text-gold-highlight font-body text-[10px] tracking-[0.25em] uppercase whitespace-nowrap">
            <span className="w-1 h-1 rotate-45 bg-gold" />
            {t("hero.eyebrow")}
          </span>
          <span className="hidden md:flex items-center gap-4">
            <span className="w-12 h-px bg-gold/70" />
            <span className="text-gold font-body text-xs tracking-[0.4em] uppercase whitespace-nowrap">{t("hero.eyebrow")}</span>
          </span>
        </div>

        <img
          src={gallopTitle}
          alt="Gallop Madinah"
          className="w-56 sm:w-64 md:w-[min(16rem,30vh)] lg:w-[min(300px,34vh)] mb-5 md:mb-[min(2rem,3vh)] drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-0 animate-fade-in-up [animation-delay:300ms]"
        />

        <p className="text-white/75 font-body text-sm md:text-base lg:text-lg max-w-md leading-relaxed mb-7 md:mb-10 opacity-0 animate-fade-in-up [animation-delay:500ms]">
          {t("hero.tagline")}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto opacity-0 animate-fade-in-up [animation-delay:700ms]">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto justify-center whitespace-nowrap inline-flex items-center gap-2.5 bg-gold text-primary-foreground px-8 lg:px-10 py-3.5 font-body font-bold text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-gold-highlight transition-colors duration-300 shadow-gold"
          >
            <Phone className="w-4 h-4" />
            {t("hero.booking")}
          </a>
          <Link
            to="/prices"
            className="w-full sm:w-auto justify-center whitespace-nowrap inline-flex items-center gap-2 border border-white/40 text-white px-8 lg:px-10 py-3.5 font-body text-xs md:text-sm tracking-[0.2em] uppercase backdrop-blur-sm hover:border-gold hover:text-gold transition-colors duration-300"
          >
            {t("hero.packages")}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
          </div>
        </div>
      </div>

      {/* Bottom bar: highlights, slide progress, scroll cue */}
      <div className="relative z-10 container mx-auto px-5 md:px-8 max-w-6xl pb-7 md:pb-10">
        <div className="flex items-end justify-between gap-6 border-t border-white/15 pt-5 md:pt-6">
          <ul className="hidden lg:flex items-center gap-8 xl:gap-12">
            {stats.map((s) => (
              <li key={s} className="flex items-center gap-2.5 text-white/75 font-body text-xs tracking-[0.15em] uppercase">
                <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
                {s}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 mx-auto md:mx-0">
            <span className="font-body text-xs text-white/60 tabular-nums tracking-widest whitespace-nowrap">
              <span className="text-gold">0{active + 1}</span> / 0{slides.length}
            </span>
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="relative w-8 md:w-12 h-6 flex items-center group"
                  aria-label={`${t("hero.slide")} ${i + 1}`}
                  aria-current={i === active}
                >
                  <span className="absolute inset-x-0 h-px bg-white/25 group-hover:bg-white/50 transition-colors" />
                  {i === active && (
                    <span
                      key={`p-${active}`}
                      className="absolute inset-x-0 h-px bg-gold origin-left animate-progress-fill motion-reduce:animate-none"
                      style={{ animationDuration: `${SLIDE_MS}ms` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center gap-2">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50">{t("hero.scroll")}</span>
            <span className="relative w-px h-10 bg-white/15 overflow-hidden">
              <span className="absolute inset-0 bg-gold animate-scroll-line motion-reduce:animate-none" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
