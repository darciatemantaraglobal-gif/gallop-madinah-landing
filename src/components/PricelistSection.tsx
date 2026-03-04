import { Phone, Star, Tent } from "lucide-react";
import galleryImg2 from "@/assets/gallery-2.jpg";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const PricelistSection = () => {
  return (
    <section id="pricelist" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4">Investasi Pengalaman</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">Pricelist</h2>
        </div>

        {/* Personal & Group */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Personal */}
          <div className="rounded-2xl border border-border bg-card/30 p-8">
            <h3 className="font-display text-2xl font-bold text-gold mb-6">Personal</h3>
            <div className="space-y-4">
              {[
                { label: "Single", price: "1.300 SAR" },
                { label: "Double", price: "2.150 SAR" },
                { label: "Triple", price: "2.550 SAR" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                  <span className="text-foreground font-body">{item.label}</span>
                  <span className="text-gold font-display font-bold text-lg">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Group */}
          <div className="rounded-2xl border border-gold/30 bg-card/30 p-8">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="font-display text-2xl font-bold text-gold">Group</h3>
              <Star className="w-5 h-5 text-gold" />
            </div>
            <div className="space-y-4">
              {[
                { label: "4–5 pax", price: "850 SAR / pax" },
                { label: "6–10 pax", price: "750 SAR / pax" },
                { label: "11+ pax", price: "650 SAR / pax" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                  <span className="text-foreground font-body">{item.label}</span>
                  <span className="text-gold font-display font-bold text-lg">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add On */}
        <div className="max-w-5xl mx-auto mb-12">
          <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">Add On</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Drone Documentation", price: "600 SAR" },
              { label: "GMC Experience", price: "800 SAR" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-card/30 p-6 flex justify-between items-center">
                <span className="text-foreground font-body">{item.label}</span>
                <span className="text-gold font-display font-bold">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Special Package */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border-2 border-gold/40 overflow-hidden">
            <div className="relative h-48 md:h-64">
              <img src={galleryImg2} alt="Arabian Camp Experience" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              <div className="absolute bottom-6 left-8 flex items-center gap-3">
                <Tent className="w-8 h-8 text-gold" />
                <h3 className="font-display text-3xl font-bold text-foreground">Arabian Camp Experience</h3>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display text-4xl font-bold text-gold">5.500 SAR</span>
                <span className="text-muted-foreground font-body text-sm">untuk 30 orang</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    <span className="text-muted-foreground font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 gradient-gold text-primary-foreground px-8 py-3 rounded-full font-semibold font-body mt-8 hover:shadow-gold transition-all duration-300 hover:scale-105"
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
