import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import galleryBg from "@/assets/gallery-bg.jpg";

const images = [
  { src: gallery1, alt: "Berkuda di padang pasir dengan latar pegunungan", span: "col-span-2 row-span-2" },
  { src: gallery2, alt: "Pengendara kuda dengan senyuman", span: "" },
  { src: gallery3, alt: "Penunggang kuda hitam di gurun", span: "" },
  { src: gallery4, alt: "Dua penunggang kuda berlari di gurun", span: "row-span-2" },
  { src: gallery5, alt: "Berkuda melintasi padang pasir", span: "" },
  { src: gallery6, alt: "Penunggang kuda berbaju putih di gurun", span: "" },
];

const GallerySection = ({ hideHeader = false }: { hideHeader?: boolean }) => {
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

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="gallery" className="section-padding relative">
      <div className="absolute inset-0">
        <img src={galleryBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10">
        {!hideHeader && (
          <div className="text-center mb-12 md:mb-20">
            <p className="text-white font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-4 md:mb-5">Captured Moments</p>
            <h2 className="font-display text-2xl md:text-5xl text-white">
              Our <span className="text-gold">Gallery</span>
            </h2>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
          {images.map((img, i) => (
            <div
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              data-index={i}
              className={`group relative overflow-hidden cursor-pointer ${img.span} transition-all duration-700 ease-out ${
                visibleItems.has(i)
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-6 scale-95"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
              onClick={() => setSelected(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={images[selected].src}
            alt={images[selected].alt}
            className="max-w-full max-h-[90vh] object-contain animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default GallerySection;
