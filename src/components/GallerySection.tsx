import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const images = [
  { src: gallery1, alt: "Berkuda di padang pasir dengan latar pegunungan", span: "col-span-2 row-span-2" },
  { src: gallery2, alt: "Pengendara kuda dengan senyuman", span: "" },
  { src: gallery3, alt: "Galloping di pasir gurun", span: "" },
  { src: gallery4, alt: "Dua penunggang kuda berlari di gurun", span: "row-span-2" },
  { src: gallery5, alt: "Berkuda melintasi padang pasir", span: "" },
  { src: gallery6, alt: "Penunggang kuda berbaju putih di gurun", span: "" },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container mx-auto px-5 md:px-4">
        <div className="text-center mb-12 md:mb-20">
          <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-4 md:mb-5">Captured Moments</p>
          <h2 className="font-display text-2xl md:text-5xl text-foreground">
            Our <span className="text-gold">Gallery</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
          {images.map((img, i) => (
            <div key={i} className={`group relative overflow-hidden ${img.span}`}>
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
    </section>
  );
};

export default GallerySection;
