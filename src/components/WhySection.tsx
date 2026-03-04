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

const WhySection = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  return (
    <section id="why" className="section-padding bg-background">
      <div className="container mx-auto px-5 md:px-8 max-w-6xl">
        {!hideHeader && (
          <div className="text-center mb-10 md:mb-16">
            <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-4 md:mb-5">Tentang Kami</p>
            <h2 className="font-display text-2xl md:text-5xl text-foreground mb-5 md:mb-8">
              Why <span className="text-gold">Gallop Madinah</span>
            </h2>
            <p className="text-muted-foreground font-body text-sm md:text-base tracking-wide max-w-2xl mx-auto leading-relaxed">
              Pelopor layanan berkuda profesional di Madinah dengan pengalaman premium yang aman dan berkesan. Kami percaya setiap momen berharga layak dikenang.
            </p>
          </div>
        )}
        {hideHeader && (
          <div className="text-center mb-10 md:mb-16">
            <p className="text-muted-foreground font-body text-sm md:text-base tracking-wide max-w-2xl mx-auto leading-relaxed">
              Pelopor layanan berkuda profesional di Madinah dengan pengalaman premium yang aman dan berkesan. Kami percaya setiap momen berharga layak dikenang.
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-6xl mx-auto">
          {reasons.map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 border border-border rounded-full flex items-center justify-center group-hover:border-gold/60 transition-all duration-500">
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-body font-bold text-sm md:text-base text-foreground mb-2 md:mb-3 normal-case tracking-normal">{item.title}</h3>
              <p className="text-muted-foreground font-body text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
