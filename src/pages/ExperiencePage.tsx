import Navbar from "@/components/Navbar";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import horsePortrait from "@/assets/horse-portrait.jpg";

const ExperiencePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 md:pt-28">
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img src={horsePortrait} alt="Horse riding experience" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>
      <div className="py-6 md:py-10 container mx-auto px-5 md:px-4 max-w-3xl">
        <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">The Experience</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight">
          Desert <span className="text-gold">Horse Riding</span>
        </h2>
      </div>
      <ExperienceSection hideHeader />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ExperiencePage;
