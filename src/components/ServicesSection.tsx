import { Waypoints, Car, UserCheck, Camera, UtensilsCrossed } from "lucide-react";

const services = [
  { icon: Waypoints, title: "Kuda Arabian Terlatih", desc: "Kuda pilihan yang jinak dan tangguh untuk segala medan" },
  { icon: Car, title: "Antar Jemput Hotel", desc: "Layanan penjemputan pagi atau sore dari hotel Anda" },
  { icon: UserCheck, title: "Private Coaching", desc: "Bimbingan personal dari coach berpengalaman" },
  { icon: Camera, title: "Dokumentasi Profesional", desc: "Foto dan video estetik sebagai kenangan berharga" },
  { icon: UtensilsCrossed, title: "Snack & Drinks", desc: "Hidangan ringan dan minuman khas Arab tersedia" },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-background">
      <div className="container mx-auto px-5 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 max-w-6xl mx-auto items-start">
          {/* Left side - heading */}
          <div className="lg:sticky lg:top-32">
            <p className="text-gold font-body text-[10px] md:text-xs tracking-[0.4em] uppercase mb-3 md:mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
              Our Services
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground leading-tight mb-4 md:mb-6">
              Layanan Premium <br />
              <span className="italic font-medium">Gallop Madinah</span>
            </h2>
            <p className="text-muted-foreground font-body text-xs md:text-sm leading-relaxed max-w-sm">
              Kami menyediakan layanan lengkap untuk pengalaman berkuda terbaik Anda di padang pasir Madinah.
            </p>
          </div>

          {/* Right side - cards stacked */}
          <div className="space-y-3 md:space-y-4">
            {services.map((item, i) => (
              <div
                key={i}
                className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 flex items-start gap-4 md:gap-5 shadow-sm border border-border hover:shadow-md transition-shadow duration-300 group"
              >
                <div className="flex-1">
                  <h3 className="font-display text-base md:text-xl font-medium text-foreground mb-1 md:mb-2">{item.title}</h3>
                  <p className="text-muted-foreground font-body text-[11px] md:text-sm leading-relaxed">{item.desc}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors duration-300">
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-secondary group-hover:text-secondary-foreground transition-colors duration-300" strokeWidth={1.5} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
