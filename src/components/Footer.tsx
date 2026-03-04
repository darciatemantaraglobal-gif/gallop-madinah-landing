const Footer = () => {
  return (
    <footer className="py-10 md:py-16 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-5 md:px-4">
        <div className="text-center">
          <p className="font-display text-2xl md:text-3xl font-light text-secondary-foreground mb-2">
            GALLOP <span className="text-gold">MADINAH</span>
          </p>
          <div className="w-10 md:w-12 h-[1px] bg-gold/40 mx-auto my-4 md:my-6" />
          <p className="text-white/50 font-body text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase mb-5 md:mb-6">
            Premium Desert Horse Riding · Madinah, Saudi Arabia
          </p>
          <div className="flex justify-center gap-5 md:gap-8 mb-6 md:mb-8 flex-wrap">
            <a href="#why" className="text-white/40 hover:text-gold font-body text-[10px] md:text-xs tracking-wider uppercase transition-colors">About</a>
            <a href="#services" className="text-white/40 hover:text-gold font-body text-[10px] md:text-xs tracking-wider uppercase transition-colors">Services</a>
            <a href="#pricelist" className="text-white/40 hover:text-gold font-body text-[10px] md:text-xs tracking-wider uppercase transition-colors">Prices</a>
            <a href="#gallery" className="text-white/40 hover:text-gold font-body text-[10px] md:text-xs tracking-wider uppercase transition-colors">Gallery</a>
          </div>
          <p className="text-white/20 font-body text-[9px] md:text-[10px] tracking-wider uppercase">
            © 2025 Gallop Madinah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
