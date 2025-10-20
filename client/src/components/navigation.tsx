import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useCart } from "@/contexts/cart-context";
import { useLanguage } from "@/contexts/language-context";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RotatingModel } from "@/components/rotating-model";
import kinderEggModel from "@assets/kinder_surprise_egg_1760976354678.glb";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const { t, dir } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t("nav.menu"), path: "/menu" },
    { label: t("nav.about"), path: "/about" },
    { label: t("nav.reservations"), path: "/reservations" },
    { label: t("nav.contact"), path: "/contact" },
  ];

  return (
    <nav dir={dir} className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
      scrolled 
        ? 'bg-background/95 shadow-lg' 
        : 'bg-background/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-14 md:h-16' : 'h-16 md:h-20'
        }`}>
          <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight hover-elevate active-elevate-2 rounded-lg px-2 py-1 -ml-2" data-testid="link-home">
            <div className={`rounded-full overflow-hidden shadow-md flex items-center justify-center logo-transition transition-all duration-300 ${
              scrolled ? 'w-12 h-12 md:w-14 md:h-14' : 'w-16 h-16 md:w-20 md:h-20'
            }`}>
              <RotatingModel
                modelPath={kinderEggModel}
                className="w-full h-full"
                scale={2.5}
                rotationSpeed={0.02}
                cameraPosition={[0, 0, 3]}
              />
            </div>
            <span className={`hidden sm:inline transition-all duration-300 ${scrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>Crêperie Kinder 5</span>
            <span className={`sm:hidden transition-all duration-300 ${scrolled ? 'text-base' : 'text-lg'}`}>Kinder 5</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded-md px-3 py-2" data-testid={`link-${item.label.toLowerCase()}`}>
                {item.label}
              </Link>
            ))}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="badge-cart-count"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/reservations">
              <Button data-testid="button-reserve-cta">
                {t("nav.reserve")}
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-mobile-cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="badge-mobile-cart-count"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-6 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)} className="text-lg font-medium hover-elevate rounded-md px-4 py-3 text-left" data-testid={`link-mobile-${item.label.toLowerCase()}`}>
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/reservations">
                    <Button className="w-full" data-testid="button-mobile-reserve" onClick={() => setIsOpen(false)}>
                      {t("nav.reserve")}
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
