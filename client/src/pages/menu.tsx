import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Plus } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem, Category } from "@shared/schema";

export default function MenuPage() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems, isLoading: itemsLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const { addItem } = useCart();
  const { toast } = useToast();

  const isLoading = categoriesLoading || itemsLoading;

  const getItemsByCategory = (categoryId: string) => {
    return menuItems?.filter((item) => item.categoryId === categoryId && item.available) || [];
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="py-20 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4" data-testid="badge-menu">
              Our Menu
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Notre Menu
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Découvrez nos délicieuses crêpes, cheesecakes, donuts et boissons
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-12">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-6">
                  <Skeleton className="h-10 w-64" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-48" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {categories?.map((category, index) => {
                const items = getItemsByCategory(category.id);
                if (items.length === 0) return null;

                return (
                  <div key={category.id} id={category.id} data-testid={`category-${category.id}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-semibold">{category.name}</h2>
                      <Badge variant="outline" className="text-sm" data-testid={`category-counter-${category.id}`}>
                        {index + 1}/{categories.length}
                      </Badge>
                    </div>
                    {category.description && (
                      <p className="text-muted-foreground mb-8 text-lg">
                        {category.description}
                      </p>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {items.map((item) => (
                        <Card
                          key={item.id}
                          className="hover-elevate transition-shadow overflow-hidden"
                          data-testid={`menu-item-${item.id}`}
                        >
                          {item.imageUrl && (
                            <div className="aspect-square overflow-hidden bg-muted">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                data-testid={`img-${item.id}`}
                              />
                            </div>
                          )}
                          <CardContent className="p-4">
                            <div className="mb-3">
                              <CardTitle className="text-lg mb-1 flex items-center gap-2 flex-wrap">
                                {item.name}
                                {item.popular && (
                                  <Badge variant="secondary" className="text-xs py-0">
                                    Popular
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="text-sm leading-relaxed line-clamp-2">
                                {item.description}
                              </CardDescription>
                            </div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span
                                className="text-lg font-bold text-primary"
                                data-testid={`price-${item.id}`}
                              >
                                {item.price} DA
                              </span>
                            </div>
                            <Button 
                              onClick={() => handleAddToCart(item)}
                              size="sm"
                              className="w-full"
                              data-testid={`button-add-cart-${item.id}`}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
