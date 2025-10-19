import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { MenuItem, Category } from "@shared/schema";

export function MenuSection() {
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

  return (
    <section id="menu" className="py-20 md:py-24 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4" data-testid="badge-menu">
            Our Menu
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Handcrafted Crêpes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Each crêpe is made to order using traditional French techniques and
            the finest ingredients
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
            {categories?.map((category) => {
              const items = getItemsByCategory(category.id);
              if (items.length === 0) return null;

              return (
                <div key={category.id} data-testid={`category-${category.id}`}>
                  <h3 className="text-3xl font-semibold mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-muted-foreground mb-8 text-lg">
                      {category.description}
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item) => (
                      <Card
                        key={item.id}
                        className="hover-elevate transition-shadow"
                        data-testid={`menu-item-${item.id}`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2 flex items-center gap-2">
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
                              €{item.price}
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
        )}
      </div>
    </section>
  );
}
