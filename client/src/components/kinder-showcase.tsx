import { ModelViewer } from "@/components/model-viewer";
import { useLanguage } from "@/contexts/language-context";

export function KinderShowcase() {
  const { t, dir } = useLanguage();

  return (
    <section dir={dir} className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            {t("kinder.title") || "Kinder Surprise Experience"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("kinder.description") || "Discover our signature Kinder creations. Interact with the 3D model below!"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg shadow-lg border">
                <h3 className="text-2xl font-bold mb-3">🍫 Crêpe Kinder 5</h3>
                <p className="text-muted-foreground mb-4">
                  {t("kinder.product1.description") || "Our signature Kinder crepe, filled with rich chocolate and topped with a surprise Kinder treat. Made fresh daily with premium ingredients."}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-primary">12.50 DT</span>
                  <span className="text-sm text-muted-foreground">⭐ 4.9/5</span>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-lg border">
                <h3 className="text-xl font-bold mb-3">✨ {t("kinder.features") || "What Makes It Special"}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t("kinder.feature1") || "Authentic Kinder chocolate"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t("kinder.feature2") || "Fresh handmade crepes"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t("kinder.feature3") || "Surprise Kinder egg topping"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t("kinder.feature4") || "Perfect for all ages"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2" data-testid="container-3d-model">
            <ModelViewer 
              modelPath="/models/kinder-egg.glb"
              scale={2.5}
              autoRotate={true}
              className="shadow-2xl"
            />
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            💡 {t("kinder.tip") || "Tip: Drag the model to rotate, scroll to zoom"}
          </p>
        </div>
      </div>
    </section>
  );
}
