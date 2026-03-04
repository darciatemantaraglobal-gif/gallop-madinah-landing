import { Phone, Star, Tent } from "lucide-react";
import galleryImg2 from "@/assets/gallery-2.jpg";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const PricelistSection = () => {
  return (
    <section id="pricelist" className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <p className="text-gold font-body text-xs tracking-[0.4em] uppercase mb-4">Investment</p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground">
            Price <span className="italic font-medium">List</span>
          </h2>
        </div>

        {/* Personal & Group */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto mb-20">
          {/* Personal */}
          <div className="border border-border p-10">
            <h3 className="font-display text-3xl font-light text-foreground mb-8 text-center">Personal</h3>
            <div className="space-y-0">
              {[
                { label: "Single", price: "1.300 SAR" },
                { label: "Double", price: "2.150 SAR" },
                { label: "Triple", price: "2.550 SAR" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-5 border-b border-border last:border-0">
                  <span className="text-foreground font-body text-sm tracking-wide">{item.label}</span>
                  <span className="text-gold font-display text-xl font-medium">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Group */}
          <div className="border border-gold/40 p-10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-primary-foreground px-4 py-1 font-body text-[10px] tracking-[0.2em] uppercase">
              Best Value
            </div>
            <div className="flex items-center justify-center gap-2 mb-8">
              <h3 className="font-display text-3xl font-light text-foreground">Group</h3>
              <Star className="w-4 h-4 text-gold" strokeWidth={1.5} />
            </div>
            <div className="space-y-0">
              {[
                { label: "4–5 pax", price: "850 SAR / pax" },
                { label: "6–10 pax", price: "750 SAR / pax" },
                { label: "11+ pax", price: "650 SAR / pax" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-5 border-b border-border last:border-0">
                  <span className="text-foreground font-body text-sm tracking-wide">{item.label}</span>
                  <span className="text-gold font-display text-xl font-medium">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add On */}
        <div className="max-w-4xl mx-auto mb-20">
          <h3 className="font-display text-2xl font-light text-foreground mb-8 text-center">Add-Ons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Drone Documentation", price: "600 SAR" },
              { label: "GMC Experience", price: "800 SAR" },
            ].map((item, i) => (
              <div key={i} className="border border-border p-6 flex justify-between items-center">
                <span className="text-foreground font-body text-sm tracking-wide">{item.label}</span>
                <span className="text-gold font-display text-lg font-medium">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Special Package */}
        <div className="max-w-4xl mx-auto">
          <div className="border border-gold/30 overflow-hidden">
            <div className="relative h-56 md:h-72">
              <img src={galleryImg2} alt="Arabian Camp Experience" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-8 left-10 flex items-center gap-4">
                <Tent className="w-8 h-8 text-gold" strokeWidth={1.2} />
                <h3 className="font-display text-3xl md:text-4xl font-light text-white">
                  Arabian Camp <span className="italic font-medium">Experience</span>
                </h3>
              </div>
            </div>
            <div className="p-10 md:p-12">
              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-display text-4xl font-medium text-gold">5.500 SAR</span>
                <span className="text-muted-foreground font-body text-sm">untuk 30 orang</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {[
                  "Camping place",
                  "1 Horse experience",
                  "Coach dan muthawif",
                  "Horse education session",
                  "Meals untuk 30 orang",
                  "Snacks & drinks",
                  "Arabic coffee & tea",
                  "Transportation (bus)",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                    <span className="text-muted-foreground font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-secondary text-secondary-foreground px-10 py-4 font-body text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                Book Paket Spesial
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricelistSection;
