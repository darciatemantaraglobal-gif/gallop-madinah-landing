import { Award, Shield, Heart, Users } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Pelopor di Madinah",
    desc: "Layanan berkuda profesional pertama di Madinah dengan standar internasional.",
  },
  {
    icon: Shield,
    title: "Coach Berpengalaman",
    desc: "Didampingi coach bersertifikat yang siap membimbing di setiap langkah.",
  },
  {
    icon: Heart,
    title: "Kuda Arabian Pribadi",
    desc: "Kuda Arabian terlatih milik pribadi yang jinak dan terawat sempurna.",
  },
  {
    icon: Users,
    title: "Aman untuk Keluarga",
    desc: "Program yang aman dan nyaman untuk pemula, anak-anak, dan keluarga.",
  },
];

const WhySection = () => {
  return (
    <section id="why" className="py-24 bg-deeper-green">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4">Mengapa Kami</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Why Gallop Madinah
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, i) => (
            <div
              key={i}
              className="text-center p-8 rounded-2xl bg-card/50 border border-border hover:border-gold/30 transition-all duration-300 group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-gold flex items-center justify-center group-hover:shadow-gold transition-all duration-300">
                <item.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
