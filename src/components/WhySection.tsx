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
    <section id="why" className="section-padding bg-background">
      <div className="container mx-auto px-5 md:px-4">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="font-display text-3xl md:text-6xl font-light text-foreground mb-4 md:mb-6">
            Why <span className="italic font-medium">Gallop Madinah</span>
          </h2>
          <p className="text-muted-foreground font-body text-xs md:text-sm tracking-wide max-w-xl mx-auto leading-relaxed">
            Pelopor layanan berkuda profesional di Madinah dengan pengalaman premium yang aman dan berkesan.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {reasons.map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-4 md:mb-8 rounded-full border-2 border-gold/30 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-all duration-500">
                <item.icon className="w-6 h-6 md:w-8 md:h-8 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-base md:text-2xl font-medium text-foreground mb-2 md:mb-3">{item.title}</h3>
              <p className="text-muted-foreground font-body text-[11px] md:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
