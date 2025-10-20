import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MenuItem, Category } from "@shared/schema";

export function CategoryCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems, isLoading: itemsLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const isLoading = categoriesLoading || itemsLoading;

  const getItemsByCategory = (categoryId: string) => {
    return menuItems?.filter((item) => item.categoryId === categoryId && item.available) || [];
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const categoriesWithItems = categories?.filter(
    (category) => getItemsByCategory(category.id).length > 0
  );

  return (
    <section className="py-20 md:py-24 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4" data-testid="badge-categories">
            Our Categories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Discover Our Menu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Swipe through our delicious selection of crêpes, desserts, and beverages
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-32 mx-auto" />
            <Skeleton className="h-96" />
          </div>
        ) : (
          <>
            {categoriesWithItems && categoriesWithItems.length > 0 && (
              <div className="mb-8 text-center">
                <Badge variant="outline" className="text-lg px-4 py-2" data-testid="category-counter">
                  {selectedIndex + 1}/{categoriesWithItems.length}
                </Badge>
              </div>
            )}

            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {categoriesWithItems?.map((category) => {
                    const items = getItemsByCategory(category.id);
                    
                    return (
                      <div
                        key={category.id}
                        className="flex-[0_0_100%] min-w-0 px-2"
                        data-testid={`carousel-category-${category.id}`}
                      >
                        <div className="mb-8">
                          <h3 className="text-3xl font-bold mb-2 text-center">{category.name}</h3>
                          {category.description && (
                            <p className="text-muted-foreground text-lg text-center mb-8">
                              {category.description}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {items.slice(0, 6).map((item) => (
                            <Card
                              key={item.id}
                              className="hover-elevate transition-shadow overflow-hidden"
                              data-testid={`carousel-item-${item.id}`}
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
                              <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <CardTitle className="text-xl mb-2 flex items-center gap-2 flex-wrap">
                                      {item.name}
                                      {item.popular && (
                                        <Badge variant="secondary" className="text-xs">
                                          Popular
                                        </Badge>
                                      )}
                                    </CardTitle>
                                    <CardDescription className="text-base leading-relaxed">
                                      {item.description}
                                    </CardDescription>
                                  </div>
                                  <span
                                    className="text-xl font-bold text-primary whitespace-nowrap"
                                    data-testid={`price-${item.id}`}
                                  >
                                    {item.price} DZD
                                  </span>
                                </div>
                              </CardHeader>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {categoriesWithItems && categoriesWithItems.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-12 w-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm disabled:opacity-50"
                    onClick={scrollPrev}
                    disabled={selectedIndex === 0}
                    data-testid="button-prev-category"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-12 w-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm disabled:opacity-50"
                    onClick={scrollNext}
                    disabled={selectedIndex === categoriesWithItems.length - 1}
                    data-testid="button-next-category"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>

            {categoriesWithItems && categoriesWithItems.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === selectedIndex
                        ? "bg-primary w-8"
                        : "bg-muted-foreground/30 w-2"
                    }`}
                    onClick={() => emblaApi?.scrollTo(index)}
                    data-testid={`dot-${index}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
