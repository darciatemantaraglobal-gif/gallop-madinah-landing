import gallery1 from "@/assets/gallery-1.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import horsePortrait from "@/assets/horse-portrait.jpg";

const images = [
  { src: gallery1, alt: "Berkuda melintasi padang pasir" },
  { src: gallery3, alt: "Siluet berkuda saat sunset" },
  { src: gallery4, alt: "Kuda galloping di gurun" },
  { src: horsePortrait, alt: "Kuda Arabian close up" },
  { src: gallery5, alt: "Kuda di oasis" },
  { src: gallery6, alt: "Keluarga berkuda" },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-24 bg-deeper-green">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4">Momen Berharga</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">Gallery</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl aspect-[4/3]">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
