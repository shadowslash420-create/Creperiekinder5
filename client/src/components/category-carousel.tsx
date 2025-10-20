import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { MenuItem, Category } from "@shared/schema";
import crepeImg from "@assets/generated_images/Chocolate_crepe_dessert_7dcc0141.png";
import cheesecakeImg from "@assets/generated_images/Strawberry_cheesecake_slice_f00164f4.png";
import donutImg from "@assets/generated_images/Colorful_glazed_donuts_99c8d4cb.png";
import pancakeImg from "@assets/generated_images/Mini_pancakes_stack_a442a392.png";
import fondantImg from "@assets/generated_images/Chocolate_fondant_dessert_cd16ade4.png";
import tiramisuImg from "@assets/Screenshot_20251020_105029_Instagram_1760953849027.jpg";

const categoryImages: Record<string, string> = {
  "crepe": crepeImg,
  "cheesecake": cheesecakeImg,
  "donuts": donutImg,
  "mini-pancakes": pancakeImg,
  "fondant": fondantImg,
  "tiramisu": tiramisuImg,
  "boissons-fraiches": "/attached_assets/stock_images/orange_juice_glass_9aef8a57.jpg",
  "boissons-chaudes": "/attached_assets/stock_images/coffee_cup_latte_8d49a53a.jpg",
};

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
                    const categoryImage = categoryImages[category.id];
                    
                    return (
                      <div
                        key={category.id}
                        className="flex-[0_0_100%] min-w-0 px-2"
                        data-testid={`carousel-category-${category.id}`}
                      >
                        <div className="mb-8">
                          <h3 className="text-3xl font-bold mb-2 text-center">{category.name}</h3>
                          {category.description && (
                            <p className="text-muted-foreground text-lg text-center mb-4">
                              {category.description}
                            </p>
                          )}
                        </div>

                        <Card className="overflow-hidden hover-elevate transition-all group cursor-pointer max-w-4xl mx-auto mb-8">
                          <Link href="/menu">
                            <div className="relative aspect-video overflow-hidden bg-muted">
                              <img
                                src={categoryImage}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                data-testid={`img-category-hero-${category.id}`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center p-8">
                                <Button size="lg" variant="secondary" className="gap-2" data-testid="button-view-category">
                                  View {category.name} Menu
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Link>
                        </Card>

                        <div className="text-center mb-6">
                          <Badge variant="outline" className="text-base px-4 py-2">
                            {items.length} {items.length === 1 ? 'item' : 'items'} available
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {items.slice(0, 4).map((item) => (
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
                              <CardContent className="p-3">
                                <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                                  {item.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-primary" data-testid={`price-${item.id}`}>
                                    {item.price} DA
                                  </span>
                                  {item.popular && (
                                    <Badge variant="secondary" className="text-xs py-0">
                                      Popular
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
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
