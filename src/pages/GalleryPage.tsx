import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import heroImg from "@/assets/gallery-4.jpg";

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        image={heroImg}
        title="Our"
        titleAccent="Gallery"
        subtitle="Captured Moments"
      />
      <GallerySection />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default GalleryPage;
