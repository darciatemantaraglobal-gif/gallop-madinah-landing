import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhySection from "@/components/WhySection";
import ExperienceSection from "@/components/ExperienceSection";
import ServicesSection from "@/components/ServicesSection";

import PricelistSection from "@/components/PricelistSection";
import GallerySection from "@/components/GallerySection";
import FinalCTA from "@/components/FinalCTA";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <WhySection />
      <ExperienceSection />
      <ServicesSection />
      
      <PricelistSection />
      <GallerySection preview />
      <FinalCTA />
      <PartnersSection />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
