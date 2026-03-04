import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import heroImg from "@/assets/gallery-5.jpg";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        image={heroImg}
        title="Paket"
        titleAccent="Layanan"
        subtitle="Layanan Kami"
      />
      <ServicesSection />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ServicesPage;
