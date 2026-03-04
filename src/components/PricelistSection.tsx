import { Phone, Tent, Users, User, ChevronRight } from "lucide-react";
import arabianCampImg from "@/assets/arabian-camp.jpg";

const WHATSAPP_LINK = "https://wa.me/628118880818?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

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

const PricelistSection = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  return (
    <section id="pricelist" className="section-padding bg-card">
      <div className="container mx-auto px-5 md:px-4">
        {!hideHeader && (
          <div className="text-center mb-10 md:mb-20">
            <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-4 md:mb-5">Investment</p>
            <h2 className="font-display text-2xl md:text-5xl text-foreground">
              Price <span className="text-gold">List</span>
            </h2>
          </div>
        )}

        {/* Personal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-4 max-w-5xl mx-auto mb-6 md:mb-10">
          {personalPackages.map((item, i) => (
            <div key={`p-${i}`} className="bg-background border border-border p-3 md:p-4 hover:border-gold/30 transition-all duration-500 group">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="flex items-center gap-2.5">
                  <User className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-body font-bold text-sm text-foreground normal-case tracking-normal">{item.label}</h3>
                    <p className="text-muted-foreground font-body text-[11px]">{item.desc}</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-body font-bold text-lg md:text-2xl text-foreground normal-case tracking-normal">{item.price}</span>
                  <span className="text-muted-foreground font-body text-[10px] md:text-xs">SAR</span>
                </div>
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-gold/50 text-gold px-3 py-1.5 md:px-4 md:py-2 font-body text-[10px] md:text-xs tracking-[0.15em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
              >
                Book Now
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>

        {/* Group Cards */}
        <div className="max-w-5xl mx-auto mb-8 md:mb-14">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6 justify-center">
            <Users className="w-4 h-4 text-gold" strokeWidth={1.5} />
            <h3 className="font-display text-lg md:text-xl text-foreground">Group <span className="text-gold">Packages</span></h3>
            <span className="ml-1 border border-gold/60 text-gold px-3 py-0.5 font-body text-[9px] md:text-[10px] tracking-[0.2em] uppercase">Best Value</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-4">
            {groupPackages.map((item, i) => (
              <div key={`g-${i}`} className="bg-background border border-gold/20 p-3 md:p-4 hover:border-gold/40 transition-all duration-500 group">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div>
                    <p className="text-muted-foreground font-body text-[11px] mb-0.5">{item.desc}</p>
                    <h3 className="font-body font-bold text-sm text-foreground normal-case tracking-normal">{item.label}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-body font-bold text-lg md:text-2xl text-foreground normal-case tracking-normal">{item.price}</span>
                    <span className="text-muted-foreground font-body text-[10px] md:text-xs">SAR/pax</span>
                  </div>
                </div>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-gold/50 text-gold px-3 py-1.5 md:px-4 md:py-2 font-body text-[10px] md:text-xs tracking-[0.15em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
                >
                  Book Now
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Add-Ons */}
        <div className="max-w-5xl mx-auto mb-10 md:mb-16">
          <h3 className="font-display text-lg md:text-xl text-foreground mb-4 md:mb-5 text-center">Add-Ons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
            {addOns.map((item, i) => (
              <div key={i} className="bg-background border border-border p-4 md:p-5 flex items-center justify-between hover:border-gold/30 transition-all duration-500">
                <span className="text-foreground/80 font-body text-xs md:text-sm tracking-wide">{item.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-body font-bold text-xl md:text-2xl text-gold normal-case tracking-normal">{item.price}</span>
                  <span className="text-muted-foreground font-body text-xs">SAR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Package Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-background border border-gold/20 overflow-hidden">
            <div className="relative h-36 md:h-72">
              <img src={arabianCampImg} alt="Arabian Camp Experience" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 flex items-center gap-2 md:gap-3">
                <Tent className="w-4 h-4 md:w-6 md:h-6 text-gold" strokeWidth={1.2} />
                <h3 className="font-display text-lg md:text-3xl text-white">
                  Arabian Camp <span className="text-gold">Experience</span>
                </h3>
              </div>
            </div>
            <div className="p-4 md:p-10">
              <div className="flex items-baseline gap-2 mb-4 md:mb-8">
                <span className="font-body font-bold text-2xl md:text-4xl text-gold normal-case tracking-normal">5.500</span>
                <span className="text-muted-foreground font-body text-xs md:text-sm">SAR — untuk 30 orang</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-1.5 md:gap-2.5 mb-5 md:mb-10">
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
                  <div key={i} className="flex items-center gap-1.5 md:gap-2.5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-gold flex-shrink-0" />
                    <span className="text-muted-foreground font-body text-[11px] md:text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gold/60 text-gold px-6 py-2.5 md:px-8 md:py-3 font-body text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
              >
                <Phone className="w-3 h-3 md:w-3.5 md:h-3.5" />
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
