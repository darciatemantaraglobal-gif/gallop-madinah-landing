import { lazy, Suspense, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ExperiencePage from "./pages/ExperiencePage";
import ServicesPage from "./pages/ServicesPage";
import PricesPage from "./pages/PricesPage";
import GalleryPage from "./pages/GalleryPage";
import NotFound from "./pages/NotFound";
import RouteTracker from "./components/RouteTracker";

// Pages that are only opened from a button or a shared link load separately, so the home page
// stays light on phones (the booking calendar and date library live only in the booking chunk).
const BookingPage = lazy(() => import("./pages/BookingPage"));
const RegistrationPage = lazy(() => import("./pages/RegistrationPage"));
const ProposalPage = lazy(() => import("./pages/ProposalPage"));
const MemberPage = lazy(() => import("./pages/MemberPage"));
const PartnerPage = lazy(() => import("./pages/PartnerPage"));

const Lazy = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<div className="min-h-screen bg-background" />}>{children}</Suspense>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/prices" element={<PricesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/booking" element={<Lazy><BookingPage /></Lazy>} />
            <Route path="/registrasi" element={<Lazy><RegistrationPage /></Lazy>} />
            <Route path="/penawaran" element={<Lazy><ProposalPage /></Lazy>} />
            <Route path="/member/:kode" element={<Lazy><MemberPage /></Lazy>} />
            <Route path="/partner/:kode" element={<Lazy><PartnerPage /></Lazy>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
