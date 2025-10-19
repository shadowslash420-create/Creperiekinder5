import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { MenuSection } from "@/components/menu-section";
import { AboutSection } from "@/components/about-section";
import { LocationSection } from "@/components/location-section";
import { ReservationSection } from "@/components/reservation-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <MenuSection />
        <AboutSection />
        <LocationSection />
        <ReservationSection />
      </main>
      <Footer />
    </div>
  );
}
