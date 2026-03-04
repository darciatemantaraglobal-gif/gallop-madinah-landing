import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import heroImg from "@/assets/horse-portrait.jpg";

const ExperiencePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        image={heroImg}
        title="Desert"
        titleAccent="Horse Riding"
        subtitle="The Experience"
      />
      <ExperienceSection hideHeader />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ExperiencePage;
