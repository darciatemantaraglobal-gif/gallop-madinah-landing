import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";
import gallery9 from "@/assets/gallery-9.jpg";
import gallery10 from "@/assets/gallery-10.jpg";
import gallery11 from "@/assets/gallery-11.jpg";
import gallery12 from "@/assets/gallery-12.jpg";
import gallery13 from "@/assets/gallery-13.jpg";
import gallery14 from "@/assets/gallery-14.jpg";
import gallery15 from "@/assets/gallery-15.jpg";
import gallery16 from "@/assets/gallery-16.jpg";
import gallery17 from "@/assets/gallery-17.jpg";
import gallery18 from "@/assets/gallery-18.jpg";
import gallery19 from "@/assets/gallery-19.jpg";
import gallery20 from "@/assets/gallery-20.jpg";
import galleryBg from "@/assets/gallery-bg.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

// Spans are on a fixed-height row grid (grid-flow-dense fills gaps).
// Wide = landscape photos, tall = portrait photos.
const WIDE = "col-span-2";
const TALL = "row-span-2";
const BIG = "col-span-2 row-span-2";

// Order matters: every block below fills complete rows of the 4-column grid
// (and of the 2-column mobile grid), so there are no holes.
const images = [
  // Rows 1–5: the home-page preview (PREVIEW_COUNT). Leads with the 8 latest photos (gallery-7…14).
  { src: gallery13, alt: "Three riders waving on grey horses", span: BIG },
  { src: gallery14, alt: "Riders galloping into the desert sunset", span: TALL },
  { src: gallery7, alt: "Smiling young rider in a helmet", span: "" },
  { src: gallery11, alt: "Woman resting her head against a white horse", span: "" },
  { src: gallery8, alt: "Young rider on a white horse among desert rocks", span: BIG },
  { src: gallery10, alt: "Woman leading a white Arabian horse", span: TALL },
  { src: gallery12, alt: "Rider on a grey Arabian horse", span: TALL },
  { src: gallery9, alt: "Rider framed by a desert tree", span: WIDE },
  { src: gallery2, alt: "Smiling horse rider", span: "" },
  { src: gallery3, alt: "Black horse rider in desert", span: "" },
  // Rows 6–7
  { src: gallery1, alt: "Desert horse riding with mountain backdrop", span: BIG },
  { src: gallery4, alt: "Two riders galloping in desert", span: TALL },
  { src: gallery5, alt: "Riding across the desert", span: "" },
  { src: gallery6, alt: "White-robed rider in desert", span: "" },
  // Rows 8–11: from the Drive shoots
  { src: gallery20, alt: "Riders and coaches at the stable at golden hour", span: BIG },
  { src: gallery18, alt: "Rider on a black Arabian horse among desert rocks", span: TALL },
  { src: gallery19, alt: "Rider on a white Arabian horse beside red rocks", span: TALL },
  { src: gallery17, alt: "Two riders on white horses on the rocks", span: BIG },
  { src: gallery15, alt: "Rider silhouetted against the desert mountains", span: WIDE },
  { src: gallery16, alt: "Grey Arabian horse kicking up dust", span: WIDE },
];

const PREVIEW_COUNT = 10;

const GallerySection = ({ hideHeader = false, preview = false }: { hideHeader?: boolean; preview?: boolean }) => {
  const { t } = useLanguage();
  // Home page shows the first rows plus a link; the Gallery page shows everything.
  const shown = preview ? images.slice(0, PREVIEW_COUNT) : images;
  const [selected, setSelected] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) => new Set(prev).add(index));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    itemRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  // Lightbox keyboard: Esc closes, arrows move between photos.
  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const step = (dir: number) =>
    setSelected((s) => (s === null ? s : (s + dir + shown.length) % shown.length));

  return (
    <section id="gallery" className="section-padding relative">
      <div className="absolute inset-0">
        <img src={galleryBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75" />
      </div>
      <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10">
        {!hideHeader && (
          <div className="text-center mb-12 md:mb-20">
            <p className="text-white font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-4 md:mb-5">{t("gallery.subtitle")}</p>
            <h2 className="font-display text-2xl md:text-5xl text-white">
              {t("gallery.title1")} <span className="text-gold">{t("gallery.title2")}</span>
            </h2>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-dense auto-rows-[150px] sm:auto-rows-[200px] md:auto-rows-[230px] gap-1 md:gap-2">
          {shown.map((img, i) => (
            <div
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              data-index={i}
              className={`group relative overflow-hidden cursor-pointer ${img.span} transition-all duration-700 ease-out ${
                visibleItems.has(i) ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
              }`}
              style={{ transitionDelay: `${(i % 4) * 100}ms` }}
              onClick={() => setSelected(i)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(i); } }}
              role="button"
              tabIndex={0}
              aria-label={img.alt}
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
            </div>
          ))}
        </div>
        {preview && (
          <div className="text-center mt-10 md:mt-14">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 border border-gold/60 text-gold px-8 py-3 font-body text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
            >
              {t("gallery.viewall")}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
      {selected !== null && (
        <div className="fixed inset-0 z-[70] bg-background/95 flex items-center justify-center p-4 md:p-16 animate-in fade-in duration-200" onClick={() => setSelected(null)}>
          <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10" aria-label="Close">
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-white/60 hover:text-gold transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-white/60 hover:text-gold transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <img
            key={selected}
            src={shown[selected].src}
            alt={shown[selected].alt}
            className="max-w-full max-h-[85vh] object-contain animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-body text-xs tracking-widest text-white/60 tabular-nums">
            <span className="text-gold">{selected + 1}</span> / {shown.length}
          </span>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
