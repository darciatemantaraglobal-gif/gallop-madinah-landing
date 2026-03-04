import Navbar from "@/components/Navbar";
import WhySection from "@/components/WhySection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 md:pt-24">
        <WhySection />
      </div>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default AboutPage;
