import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { MenuCategoriesSection } from "@/components/menu-categories-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <MenuCategoriesSection />
      </main>
      <Footer />
    </div>
  );
}
