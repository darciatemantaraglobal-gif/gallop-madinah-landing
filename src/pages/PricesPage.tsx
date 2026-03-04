import Navbar from "@/components/Navbar";
import PricelistSection from "@/components/PricelistSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const PricesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 md:pt-36 pb-6 md:pb-10 container mx-auto px-5 md:px-4 max-w-5xl text-center">
        <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">Investment</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight">
          Price <span className="text-gold">List</span>
        </h2>
      </div>
      <PricelistSection hideHeader />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default PricesPage;
