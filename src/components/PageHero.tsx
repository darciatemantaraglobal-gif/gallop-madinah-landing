interface PageHeroProps {
  image: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
}

const PageHero = ({ image, title, titleAccent, subtitle }: PageHeroProps) => {
  return (
    <section className="relative h-[50vh] md:h-[60vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />
      {/* Netflix-style gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-5 md:px-4 pb-10 md:pb-16">
        {subtitle && (
          <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">
            {subtitle}
          </p>
        )}
        <h1 className="font-display text-3xl md:text-6xl lg:text-7xl text-foreground leading-tight text-shadow-hero">
          {title}{" "}
          {titleAccent && <span className="text-gold">{titleAccent}</span>}
        </h1>
        <div className="w-16 h-[2px] bg-gold/60 mt-5 md:mt-8" />
      </div>
    </section>
  );
};

export default PageHero;
