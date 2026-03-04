import Navbar from "@/components/Navbar";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 md:pt-24">
        <GallerySection />
      </div>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default GalleryPage;
