import { Phone, Tent, Users, User, ChevronRight } from "lucide-react";
import galleryImg2 from "@/assets/gallery-2.jpg";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const personalPackages = [
  { label: "Single", price: "1.300", desc: "1 orang rider" },
  { label: "Double", price: "2.150", desc: "2 orang rider" },
  { label: "Triple", price: "2.550", desc: "3 orang rider" },
];

const groupPackages = [
  { label: "4–5 pax", price: "850", desc: "Per orang" },
  { label: "6–10 pax", price: "750", desc: "Per orang" },
  { label: "11+ pax", price: "650", desc: "Per orang" },
];

const addOns = [
  { label: "Drone Documentation", price: "600" },
  { label: "GMC Experience", price: "800" },
];

const PricelistSection = () => {
  return (
    <section id="pricelist" className="section-padding bg-background">
      <div className="container mx-auto px-5 md:px-4">
        <div className="text-center mb-12 md:mb-20">
          <p className="text-gold font-body text-[10px] md:text-xs tracking-[0.4em] uppercase mb-3 md:mb-4 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            Investment
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-light text-foreground">
            Price <span className="italic font-medium">List</span>
          </h2>
        </div>

        {/* Personal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto mb-10 md:mb-12">
          {personalPackages.map((item, i) => (
            <div key={`p-${i}`} className="bg-card rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm border border-border hover:shadow-md transition-shadow duration-300 group">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-secondary/10 flex items-center justify-center">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-secondary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display text-base md:text-lg font-medium text-foreground">{item.label}</h3>
                  <p className="text-muted-foreground font-body text-[10px] md:text-xs">{item.desc}</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-4 md:mb-5">
                <span className="font-display text-2xl md:text-3xl font-semibold text-foreground">{item.price}</span>
                <span className="text-muted-foreground font-body text-xs md:text-sm">SAR</span>
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground rounded-lg md:rounded-xl px-4 md:px-5 py-2.5 md:py-3 font-body text-[10px] md:text-xs tracking-[0.15em] uppercase hover:bg-gold transition-colors duration-300"
              >
                Book Now
                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Group Cards */}
        <div className="max-w-5xl mx-auto mb-10 md:mb-12">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-gold" strokeWidth={1.5} />
            <h3 className="font-display text-xl md:text-2xl font-light text-foreground">Group <span className="italic font-medium">Packages</span></h3>
            <span className="ml-2 bg-gold text-primary-foreground px-2.5 md:px-3 py-0.5 rounded-full font-body text-[9px] md:text-[10px] tracking-[0.15em] uppercase">Best Value</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {groupPackages.map((item, i) => (
              <div key={`g-${i}`} className="bg-card rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm border border-gold/30 hover:shadow-md transition-shadow duration-300 group">
                <p className="text-muted-foreground font-body text-[10px] md:text-xs mb-1">{item.desc}</p>
                <h3 className="font-display text-base md:text-lg font-medium text-foreground mb-3 md:mb-4">{item.label}</h3>
                <div className="flex items-baseline gap-1 mb-4 md:mb-5">
                  <span className="font-display text-2xl md:text-3xl font-semibold text-foreground">{item.price}</span>
                  <span className="text-muted-foreground font-body text-xs md:text-sm">SAR / pax</span>
                </div>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground rounded-lg md:rounded-xl px-4 md:px-5 py-2.5 md:py-3 font-body text-[10px] md:text-xs tracking-[0.15em] uppercase hover:bg-gold transition-colors duration-300"
                >
                  Book Now
                  <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Add-Ons */}
        <div className="max-w-5xl mx-auto mb-12 md:mb-16">
          <h3 className="font-display text-xl md:text-2xl font-light text-foreground mb-4 md:mb-6 text-center">Add-Ons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {addOns.map((item, i) => (
              <div key={i} className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 flex items-center justify-between shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
                <span className="text-foreground font-body text-xs md:text-sm tracking-wide">{item.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl md:text-2xl font-semibold text-gold">{item.price}</span>
                  <span className="text-muted-foreground font-body text-[10px] md:text-xs">SAR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Package Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gold/30">
            <div className="relative h-44 md:h-72">
              <img src={galleryImg2} alt="Arabian Camp Experience" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gold/20 backdrop-blur-sm flex items-center justify-center">
                  <Tent className="w-5 h-5 md:w-6 md:h-6 text-gold" strokeWidth={1.2} />
                </div>
                <h3 className="font-display text-2xl md:text-4xl font-light text-white">
                  Arabian Camp <span className="italic font-medium">Experience</span>
                </h3>
              </div>
            </div>
            <div className="p-5 md:p-10">
              <div className="flex items-baseline gap-2 md:gap-3 mb-6 md:mb-8">
                <span className="font-display text-3xl md:text-4xl font-semibold text-gold">5.500</span>
                <span className="text-muted-foreground font-body text-xs md:text-sm">SAR — untuk 30 orang</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3 mb-8 md:mb-10">
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
                  <div key={i} className="flex items-center gap-2.5 md:gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    <span className="text-muted-foreground font-body text-xs md:text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 md:gap-3 bg-secondary text-secondary-foreground rounded-lg md:rounded-xl px-7 md:px-10 py-3 md:py-4 font-body text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-300"
              >
                <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
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
