import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 md:pt-24">
        <ServicesSection />
      </div>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ServicesPage;
