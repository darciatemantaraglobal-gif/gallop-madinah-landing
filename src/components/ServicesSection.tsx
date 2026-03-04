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
    <section id="services" className="section-padding bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <p className="text-gold font-body text-xs tracking-[0.4em] uppercase mb-4">What We Offer</p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-secondary-foreground">
            Our <span className="italic font-medium">Services</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px max-w-5xl mx-auto bg-white/10">
          {services.map((item, i) => (
            <div
              key={i}
              className="p-10 bg-secondary hover:bg-white/5 transition-all duration-500 group text-center"
            >
              <item.icon className="w-10 h-10 text-gold mx-auto mb-6 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.2} />
              <h3 className="font-display text-xl font-medium text-secondary-foreground mb-3">{item.title}</h3>
              <p className="text-white/50 font-body text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
