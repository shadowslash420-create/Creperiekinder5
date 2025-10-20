import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { CategoryCarousel } from "@/components/category-carousel";
import { KinderEgg3D } from "@/components/kinder-egg-3d";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        
        {/* 3D Model Section */}
        <section className="py-20 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                Interactive 3D
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Experience Kinder Magic
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Drag to rotate and explore our signature Kinder creations
              </p>
            </div>
            <KinderEgg3D />
          </div>
        </section>

        <CategoryCarousel />
      </main>
      <Footer />
    </div>
  );
}
