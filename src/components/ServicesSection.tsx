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
    <section id="services" className="py-24 bg-deeper-green">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4">Layanan Kami</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">Our Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-border bg-card/30 hover:border-gold/40 transition-all duration-300 group"
            >
              <item.icon className="w-8 h-8 text-gold mb-5 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
