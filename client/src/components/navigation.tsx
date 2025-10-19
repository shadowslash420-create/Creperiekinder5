import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const navItems = [
    { label: "Menu", id: "menu" },
    { label: "About", id: "about" },
    { label: "Location", id: "location" },
    { label: "Reservations", id: "reservations" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md bg-background/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-xl md:text-2xl font-bold tracking-tight hover-elevate active-elevate-2 rounded-lg px-2 py-1 -ml-2"
            data-testid="link-home"
          >
            Crêperie Kinder 5
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded-md px-3 py-2"
                data-testid={`link-${item.id}`}
              >
                {item.label}
              </button>
            ))}
            <ThemeToggle />
            <Button
              onClick={() => scrollToSection("reservations")}
              data-testid="button-reserve-cta"
            >
              Reserve Table
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
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
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-lg font-medium hover-elevate rounded-md px-4 py-3 text-left"
                      data-testid={`link-mobile-${item.id}`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <Button
                    onClick={() => scrollToSection("reservations")}
                    className="w-full"
                    data-testid="button-mobile-reserve"
                  >
                    Reserve Table
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
