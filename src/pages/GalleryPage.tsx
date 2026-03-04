import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import heroImg from "@/assets/gallery-4.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const GalleryPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        image={heroImg}
        title={t("page.gallery.title")}
        titleAccent={t("page.gallery.accent")}
        subtitle={t("page.gallery.subtitle")}
      />
      <GallerySection hideHeader />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default GalleryPage;
