import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@assets/generated_images/Elegant_dessert_crepe_plating_aa7d0cbd.png";
import logoImage from "@assets/Screenshot_20251020_093011_Instagram_1760949023207.jpg";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Elegant French crepe with strawberries and cream"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-32 md:py-40 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logoImage}
            alt="Crêperie Kinder 5 Logo"
            className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-2xl"
            data-testid="img-logo"
          />
        </div>

        <Badge
          variant="secondary"
          className="mb-6 backdrop-blur-md bg-white/10 border-white/20 text-white"
          data-testid="badge-tagline"
        >
          Authentic French Cuisine
        </Badge>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
          Welcome to
          <br />
          Crêperie Kinder 5
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Experience the authentic taste of France with our handcrafted crêpes.
          From sweet to savory, each creation is made with traditional recipes
          and the finest ingredients.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/menu">
            <Button
              size="lg"
              className="text-base px-8 py-6"
              data-testid="button-view-menu"
            >
              View Menu
            </Button>
          </Link>
          <Link href="/reservations">
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20"
              data-testid="button-reserve-table"
            >
              Reserve Table
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
