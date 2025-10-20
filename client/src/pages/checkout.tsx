import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { customerOrderSchema, type CustomerOrder, type OrderItem } from "@shared/cart-types";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const [orderSuccess, setOrderSuccess] = useState(false);

  const form = useForm<CustomerOrder>({
    resolver: zodResolver(customerOrderSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      message: "",
      preferredTime: "",
    },
  });

  const createOrder = useMutation({
    mutationFn: async (data: CustomerOrder) => {
      const orderItems: OrderItem[] = items.map(item => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const orderData = {
        customerName: `${data.firstName} ${data.lastName}`,
        customerEmail: data.email,
        customerPhone: data.phone,
        items: JSON.stringify(orderItems),
        totalAmount: totalPrice.toString(),
        orderType: "pickup",
        notes: data.message 
          ? `${data.message}${data.preferredTime ? `\n\nPreferred Time: ${data.preferredTime}` : ''}`
          : data.preferredTime 
            ? `Preferred Time: ${data.preferredTime}` 
            : undefined,
      };

      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      setOrderSuccess(true);
      clearCart();
      toast({
        title: t("checkout.success"),
        description: t("checkout.successDesc"),
      });
      setTimeout(() => {
        setLocation("/");
      }, 3000);
    },
    onError: (error: any) => {
      toast({
        title: t("checkout.failed"),
        description: error.message || t("checkout.failedDesc"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CustomerOrder) => {
    createOrder.mutate(data);
  };

  if (items.length === 0 && !orderSuccess) {
    setLocation("/cart");
    return null;
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col" dir={dir}>
        <Navigation />
        <main className="flex-1 py-20 md:py-24 lg:py-32">
          <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <CheckCircle2 className="w-24 h-24 mx-auto text-green-500 mb-6" />
            <h1 className="text-4xl font-bold mb-4">{t("checkout.orderConfirmed")}</h1>
            <p className="text-lg text-muted-foreground mb-4">
              {t("checkout.thankYou")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("checkout.redirecting")}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <Navigation />
      <main className="flex-1 py-20 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">{t("checkout.title")}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("checkout.customerInfo")}</CardTitle>
                  <CardDescription>
                    {t("checkout.customerInfoDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("checkout.firstName")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="John" 
                                  {...field} 
                                  data-testid="input-firstname"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("checkout.lastName")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Doe" 
                                  {...field} 
                                  data-testid="input-lastname"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("checkout.email")}</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="john.doe@example.com" 
                                {...field} 
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("checkout.phone")}</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="+213 XXX XXX XXX" 
                                {...field} 
                                data-testid="input-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("checkout.preferredTime")}</FormLabel>
                            <FormControl>
                              <Input 
                                type="text" 
                                placeholder={t("checkout.preferredTimePlaceholder")}
                                {...field} 
                                data-testid="input-preferred-time"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("checkout.message")}</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={t("checkout.messagePlaceholder")}
                                className="min-h-24"
                                {...field} 
                                data-testid="input-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full"
                        disabled={createOrder.isPending}
                        data-testid="button-place-order"
                      >
                        {createOrder.isPending ? (
                          <>
                            <Loader2 className={`w-4 h-4 ${dir === "rtl" ? "ml-2" : "mr-2"} animate-spin`} />
                            {t("checkout.placingOrder")}
                          </>
                        ) : (
                          `${t("checkout.placeOrder")} - ${totalPrice.toFixed(2)} ${t("common.dzd")}`
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{t("cart.orderSummary")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          {(parseFloat(item.price) * item.quantity).toFixed(2)} {t("common.dzd")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{t("cart.total")}</span>
                    <span className="text-2xl font-bold text-primary" data-testid="text-checkout-total">
                      {totalPrice.toFixed(2)} {t("common.dzd")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
