import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import PricelistSection from "@/components/PricelistSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import heroImg from "@/assets/arabian-camp.jpg";

const PricesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        image={heroImg}
        title="Price"
        titleAccent="List"
        subtitle="Investment"
      />
      <PricelistSection hideHeader />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default PricesPage;
