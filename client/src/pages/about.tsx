import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Heart, Sparkles } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/contexts/language-context";
import kitchenImage from "@assets/generated_images/Creperie_kitchen_interior_scene_f29ea8c4.png";

export default function AboutPage() {
  const { t, dir } = useLanguage();
  
  const features = [
    {
      icon: ChefHat,
      title: t("about.feature1Title"),
      description: t("about.feature1Desc"),
    },
    {
      icon: Heart,
      title: t("about.feature2Title"),
      description: t("about.feature2Desc"),
    },
    {
      icon: Sparkles,
      title: t("about.feature3Title"),
      description: t("about.feature3Desc"),
    },
  ];

  return (
    <div className="min-h-screen" dir={dir}>
      <Navigation />
      <main className="py-20 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={kitchenImage}
                alt="Creperie kitchen with chef preparing fresh crepes"
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="img-about"
              />
            </div>

            <div className="order-1 lg:order-2">
              <Badge variant="secondary" className="mb-4" data-testid="badge-about">
                {t("about.badge")}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {t("about.heading")}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t("about.description")}
              </p>

              <div className="space-y-6">
                {features.map((feature) => (
                  <Card key={feature.title} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <feature.icon className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div>
                          <h2 className="font-semibold text-lg mb-2">
                            {feature.title}
                          </h2>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
