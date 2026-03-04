const Footer = () => {
  return (
    <footer className="py-10 md:py-16 bg-card border-t border-border">
      <div className="container mx-auto px-5 md:px-4">
        <div className="text-center">
          <p className="font-display text-xl md:text-2xl text-foreground mb-2">
            Gallop <span className="text-gold">Madinah</span>
          </p>
          <div className="w-10 h-[1px] bg-gold/30 mx-auto my-4 md:my-6" />
          <p className="text-muted-foreground font-body text-xs md:text-sm tracking-[0.2em] uppercase mb-5 md:mb-6">
            Premium Desert Horse Riding · Madinah, Saudi Arabia
          </p>
          <div className="flex justify-center gap-5 md:gap-8 mb-6 md:mb-8 flex-wrap">
            <a href="#why" className="text-muted-foreground hover:text-gold font-body text-xs md:text-sm tracking-wider uppercase transition-colors">About</a>
            <a href="#services" className="text-muted-foreground hover:text-gold font-body text-xs md:text-sm tracking-wider uppercase transition-colors">Services</a>
            <a href="#pricelist" className="text-muted-foreground hover:text-gold font-body text-xs md:text-sm tracking-wider uppercase transition-colors">Prices</a>
            <a href="#gallery" className="text-muted-foreground hover:text-gold font-body text-xs md:text-sm tracking-wider uppercase transition-colors">Gallery</a>
          </div>
          <p className="text-muted-foreground/50 font-body text-[10px] md:text-xs tracking-wider uppercase">
            © 2025 Gallop Madinah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
