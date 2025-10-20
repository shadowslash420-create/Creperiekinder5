import { useState } from "react";
import { Link } from "wouter";
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

  const navItems = [
    { label: "Menu", path: "/menu" },
    { label: "About", path: "/about" },
    { label: "Reservations", path: "/reservations" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md bg-background/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-tight hover-elevate active-elevate-2 rounded-lg px-2 py-1 -ml-2" data-testid="link-home">
            Crêperie Kinder 5
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded-md px-3 py-2" data-testid={`link-${item.label.toLowerCase()}`}>
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
            <Link href="/reservations">
              <Button data-testid="button-reserve-cta">
                Reserve Table
              </Button>
            </Link>
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
                    <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)} className="text-lg font-medium hover-elevate rounded-md px-4 py-3 text-left" data-testid={`link-mobile-${item.label.toLowerCase()}`}>
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/reservations">
                    <Button className="w-full" data-testid="button-mobile-reserve" onClick={() => setIsOpen(false)}>
                      Reserve Table
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
