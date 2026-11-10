import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhySection from "@/components/WhySection";
import ExperienceSection from "@/components/ExperienceSection";
import PricelistSection from "@/components/PricelistSection";
import HowToBookSection from "@/components/HowToBookSection";
import GallerySection from "@/components/GallerySection";
import FinalCTA from "@/components/FinalCTA";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

// Mobile-first flow: who we are → what the ride is → prices → how to book → proof → book.
// The facilities list lives on /services (its items are already in the package cards).
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <WhySection />
      <ExperienceSection />
      <PricelistSection />
      <HowToBookSection />
      <GallerySection preview />
      <FinalCTA />
      <PartnersSection />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
