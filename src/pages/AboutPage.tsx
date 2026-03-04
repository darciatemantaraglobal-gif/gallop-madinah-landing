import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import WhySection from "@/components/WhySection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import heroImg from "@/assets/gallery-1.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        image={heroImg}
        title={t("page.about.title")}
        titleAccent={t("page.about.accent")}
        subtitle={t("page.about.subtitle")}
      />
      <WhySection hideHeader />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default AboutPage;
