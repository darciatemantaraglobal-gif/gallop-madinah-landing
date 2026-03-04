import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import WhySection from "@/components/WhySection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import heroImg from "@/assets/gallery-1.jpg";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        image={heroImg}
        title="Why"
        titleAccent="Gallop Madinah"
        subtitle="Tentang Kami"
      />
      <WhySection hideHeader />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default AboutPage;
