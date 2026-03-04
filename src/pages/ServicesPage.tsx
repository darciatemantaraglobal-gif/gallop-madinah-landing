import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import heroImg from "@/assets/gallery-5.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const ServicesPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        image={heroImg}
        title={t("page.svc.title")}
        titleAccent={t("page.svc.accent")}
        subtitle={t("page.svc.subtitle")}
      />
      <ServicesSection hideHeader />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ServicesPage;
