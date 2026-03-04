import Navbar from "@/components/Navbar";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const ExperiencePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 md:pt-24">
        <ExperienceSection />
      </div>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ExperiencePage;
