import Navbar from "@/components/Navbar";
import PricelistSection from "@/components/PricelistSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const PricesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PricelistSection />
      </div>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default PricesPage;
