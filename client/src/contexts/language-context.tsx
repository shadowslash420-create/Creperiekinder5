
import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ar" | "fr";

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
    fr: string;
  };
}

const translations: Translations = {
  // Navigation
  "nav.menu": { en: "Menu", ar: "القائمة", fr: "Menu" },
  "nav.about": { en: "About", ar: "من نحن", fr: "À propos" },
  "nav.reservations": { en: "Reservations", ar: "الحجوزات", fr: "Réservations" },
  "nav.contact": { en: "Contact", ar: "اتصل بنا", fr: "Contact" },
  "nav.cart": { en: "Cart", ar: "السلة", fr: "Panier" },
  "nav.reserve": { en: "Reserve Table", ar: "احجز طاولة", fr: "Réserver une table" },

  // Hero Section
  "hero.welcome": { en: "Welcome to", ar: "مرحبا بكم في", fr: "Bienvenue à" },
  "hero.title": { en: "Crêperie Kinder 5", ar: "كريب كيندر 5", fr: "Crêperie Kinder 5" },
  "hero.description": {
    en: "Experience the authentic taste of Algeria with our handcrafted crêpes. From sweet to savory, each creation is made with traditional recipes and the finest ingredients.",
    ar: "اختبر المذاق الأصيل للجزائر مع الكريب المصنوع يدويًا. من الحلو إلى المالح، كل إبداع مصنوع بوصفات تقليدية وأفضل المكونات.",
    fr: "Découvrez le goût authentique de l'Algérie avec nos crêpes artisanales. Du sucré au salé, chaque création est faite avec des recettes traditionnelles et les meilleurs ingrédients."
  },
  "hero.viewMenu": { en: "View Menu", ar: "عرض القائمة", fr: "Voir le menu" },
  "hero.reserveTable": { en: "Reserve Table", ar: "احجز طاولة", fr: "Réserver une table" },

  // Menu
  "menu.title": { en: "Our Menu", ar: "قائمتنا", fr: "Notre Menu" },
  "menu.subtitle": { en: "Discover our delicious crêpes, cheesecakes, donuts and drinks", ar: "اكتشف الكريب اللذيذ، الكيك، الدوناتس والمشروبات", fr: "Découvrez nos délicieuses crêpes, cheesecakes, donuts et boissons" },
  "menu.allCategories": { en: "All Categories", ar: "جميع الفئات", fr: "Toutes les catégories" },
  "menu.addToCart": { en: "Add to Cart", ar: "أضف إلى السلة", fr: "Ajouter au panier" },
  "menu.viewDetails": { en: "View Details", ar: "عرض التفاصيل", fr: "Voir les détails" },
  "menu.productDetails": { en: "Product Details", ar: "تفاصيل المنتج", fr: "Détails du produit" },
  "menu.popular": { en: "Popular", ar: "شائع", fr: "Populaire" },
  "menu.badge": { en: "Our Menu", ar: "قائمتنا", fr: "Notre Menu" },

  // Cart
  "cart.title": { en: "Shopping Cart", ar: "سلة التسوق", fr: "Panier" },
  "cart.empty": { en: "Your Cart is Empty", ar: "سلتك فارغة", fr: "Votre panier est vide" },
  "cart.emptyMessage": { en: "Start adding some delicious items from our menu!", ar: "ابدأ بإضافة بعض العناصر اللذيذة من قائمتنا!", fr: "Commencez à ajouter des articles délicieux de notre menu!" },
  "cart.continueShopping": { en: "Continue Shopping", ar: "متابعة التسوق", fr: "Continuer vos achats" },
  "cart.browseMenu": { en: "Browse Menu", ar: "تصفح القائمة", fr: "Parcourir le menu" },
  "cart.orderSummary": { en: "Order Summary", ar: "ملخص الطلب", fr: "Résumé de la commande" },
  "cart.total": { en: "Total", ar: "المجموع", fr: "Total" },
  "cart.checkout": { en: "Proceed to Checkout", ar: "متابعة إلى الدفع", fr: "Passer à la caisse" },
  "cart.remove": { en: "Remove", ar: "إزالة", fr: "Supprimer" },
  "cart.clearCart": { en: "Clear Cart", ar: "إفراغ السلة", fr: "Vider le panier" },
  "cart.items": { en: "items", ar: "عناصر", fr: "articles" },
  "cart.item": { en: "item", ar: "عنصر", fr: "article" },
  "cart.inYourCart": { en: "in your cart", ar: "في سلتك", fr: "dans votre panier" },

  // Checkout
  "checkout.title": { en: "Checkout", ar: "إتمام الطلب", fr: "Paiement" },
  "checkout.customerInfo": { en: "Customer Information", ar: "معلومات العميل", fr: "Informations client" },
  "checkout.customerInfoDesc": { en: "Please provide your contact details so we can process your order", ar: "يرجى تقديم تفاصيل الاتصال الخاصة بك حتى نتمكن من معالجة طلبك", fr: "Veuillez fournir vos coordonnées afin que nous puissions traiter votre commande" },
  "checkout.firstName": { en: "First Name", ar: "الاسم الأول", fr: "Prénom" },
  "checkout.lastName": { en: "Last Name", ar: "الاسم الأخير", fr: "Nom" },
  "checkout.phone": { en: "Phone Number", ar: "رقم الهاتف", fr: "Numéro de téléphone" },
  "checkout.email": { en: "Email", ar: "البريد الإلكتروني", fr: "Email" },
  "checkout.preferredTime": { en: "Preferred Pickup Time (Optional)", ar: "وقت الاستلام المفضل (اختياري)", fr: "Heure de retrait préférée (Optionnel)" },
  "checkout.preferredTimePlaceholder": { en: "e.g., Today at 3 PM, Tomorrow morning", ar: "مثال: اليوم الساعة 3 مساءً، غداً صباحاً", fr: "par ex., Aujourd'hui à 15h, Demain matin" },
  "checkout.message": { en: "Special Instructions (Optional)", ar: "تعليمات خاصة (اختياري)", fr: "Instructions spéciales (Optionnel)" },
  "checkout.messagePlaceholder": { en: "Any special requests or dietary requirements?", ar: "أي طلبات خاصة أو متطلبات غذائية؟", fr: "Des demandes spéciales ou des exigences alimentaires?" },
  "checkout.placeOrder": { en: "Place Order", ar: "تأكيد الطلب", fr: "Passer la commande" },
  "checkout.placingOrder": { en: "Placing Order...", ar: "جاري تأكيد الطلب...", fr: "Passage de la commande..." },
  "checkout.orderConfirmed": { en: "Order Confirmed!", ar: "تم تأكيد الطلب!", fr: "Commande confirmée!" },
  "checkout.thankYou": { en: "Thank you for your order. We've received your request and will contact you shortly.", ar: "شكراً لطلبك. لقد استلمنا طلبك وسنتصل بك قريباً.", fr: "Merci pour votre commande. Nous avons reçu votre demande et vous contacterons bientôt." },
  "checkout.redirecting": { en: "Redirecting to home page...", ar: "إعادة التوجيه إلى الصفحة الرئيسية...", fr: "Redirection vers la page d'accueil..." },
  "checkout.success": { en: "Order Placed Successfully!", ar: "تم تقديم الطلب بنجاح!", fr: "Commande passée avec succès!" },
  "checkout.successDesc": { en: "Thank you for your order. We will contact you shortly to confirm.", ar: "شكراً لطلبك. سنتصل بك قريباً للتأكيد.", fr: "Merci pour votre commande. Nous vous contacterons sous peu pour confirmer." },
  "checkout.failed": { en: "Order Failed", ar: "فشل الطلب", fr: "Échec de la commande" },
  "checkout.failedDesc": { en: "Please try again or contact us directly.", ar: "يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.", fr: "Veuillez réessayer ou nous contacter directement." },

  // About
  "about.title": { en: "About Us", ar: "من نحن", fr: "À propos de nous" },
  "about.badge": { en: "Our Story", ar: "قصتنا", fr: "Notre histoire" },
  "about.heading": { en: "Bringing Algeria to Your Table", ar: "نجلب الجزائر إلى طاولتك", fr: "Apporter l'Algérie à votre table" },
  "about.description": { 
    en: "Since opening our doors, Crêperie Kinder 5 has been dedicated to bringing the authentic taste of Algeria to our community. Our passion for traditional Algerian cuisine drives us to create exceptional crêpes that transport you to the streets of Algiers with every bite.",
    ar: "منذ افتتاحنا، كان كريب كيندر 5 مكرساً لجلب الطعم الأصيل للجزائر إلى مجتمعنا. شغفنا بالمطبخ الجزائري التقليدي يدفعنا لإنشاء كريب استثنائي ينقلك إلى شوارع الجزائر مع كل قضمة.",
    fr: "Depuis notre ouverture, Crêperie Kinder 5 s'est consacrée à apporter le goût authentique de l'Algérie à notre communauté. Notre passion pour la cuisine algérienne traditionnelle nous pousse à créer des crêpes exceptionnelles qui vous transportent dans les rues d'Alger à chaque bouchée."
  },
  "about.feature1Title": { en: "Traditional Recipes", ar: "وصفات تقليدية", fr: "Recettes traditionnelles" },
  "about.feature1Desc": { en: "Authentic Algerian techniques passed down through generations, ensuring every crêpe is perfect.", ar: "تقنيات جزائرية أصيلة متوارثة عبر الأجيال، لضمان كريب مثالي في كل مرة.", fr: "Techniques algériennes authentiques transmises de génération en génération, garantissant que chaque crêpe est parfaite." },
  "about.feature2Title": { en: "Fresh Ingredients", ar: "مكونات طازجة", fr: "Ingrédients frais" },
  "about.feature2Desc": { en: "We source the finest local and imported ingredients to create unforgettable flavors.", ar: "نحصل على أفضل المكونات المحلية والمستوردة لخلق نكهات لا تُنسى.", fr: "Nous nous approvisionnons en ingrédients locaux et importés de qualité pour créer des saveurs inoubliables." },
  "about.feature3Title": { en: "Made to Order", ar: "يُصنع حسب الطلب", fr: "Fait sur commande" },
  "about.feature3Desc": { en: "Each crêpe is prepared fresh when you order, guaranteeing quality and taste.", ar: "يتم تحضير كل كريب طازجاً عند الطلب، مما يضمن الجودة والطعم.", fr: "Chaque crêpe est préparée fraîche à la commande, garantissant qualité et goût." },

  // Contact
  "contact.title": { en: "Contact Us", ar: "اتصل بنا", fr: "Contactez-nous" },
  "contact.badge": { en: "Visit Us", ar: "زرنا", fr: "Visitez-nous" },
  "contact.heading": { en: "Contact & Location", ar: "الاتصال والموقع", fr: "Contact & Localisation" },
  "contact.subtitle": { en: "Come visit us and experience authentic Algerian crêpes in a warm, welcoming atmosphere", ar: "تعال لزيارتنا واختبر الكريب الجزائري الأصيل في أجواء دافئة ومرحبة", fr: "Venez nous rendre visite et découvrez les crêpes algériennes authentiques dans une atmosphère chaleureuse et accueillante" },
  "contact.hours": { en: "Opening Hours", ar: "ساعات العمل", fr: "Horaires d'ouverture" },
  "contact.info": { en: "Contact Information", ar: "معلومات الاتصال", fr: "Informations de contact" },
  "contact.address": { en: "Address", ar: "العنوان", fr: "Adresse" },
  "contact.addressValue": { en: "Crêperie Kinder 5, Algeria", ar: "كريب كيندر 5، الجزائر", fr: "Crêperie Kinder 5, Algérie" },
  "contact.getDirections": { en: "Get Directions", ar: "احصل على الاتجاهات", fr: "Obtenir l'itinéraire" },
  "contact.phone": { en: "Phone", ar: "الهاتف", fr: "Téléphone" },
  "contact.callUs": { en: "Call Us", ar: "اتصل بنا", fr: "Appelez-nous" },
  "contact.email": { en: "Email", ar: "البريد الإلكتروني", fr: "Email" },
  "contact.sendEmail": { en: "Send Email", ar: "إرسال بريد إلكتروني", fr: "Envoyer un email" },
  "contact.mondayThursday": { en: "Monday - Thursday", ar: "الاثنين - الخميس", fr: "Lundi - Jeudi" },
  "contact.fridaySaturday": { en: "Friday - Saturday", ar: "الجمعة - السبت", fr: "Vendredi - Samedi" },
  "contact.sunday": { en: "Sunday", ar: "الأحد", fr: "Dimanche" },

  // Reservations
  "reservations.title": { en: "Make a Reservation", ar: "احجز طاولة", fr: "Faire une réservation" },
  "reservations.badge": { en: "Book a Table", ar: "احجز طاولة", fr: "Réserver une table" },
  "reservations.subtitle": { en: "Reserve your table and get ready for an unforgettable dining experience", ar: "احجز طاولتك واستعد لتجربة طعام لا تُنسى", fr: "Réservez votre table et préparez-vous pour une expérience culinaire inoubliable" },
  "reservations.details": { en: "Reservation Details", ar: "تفاصيل الحجز", fr: "Détails de la réservation" },
  "reservations.detailsDesc": { en: "Fill out the form below and we'll confirm your reservation shortly", ar: "املأ النموذج أدناه وسنؤكد حجزك قريباً", fr: "Remplissez le formulaire ci-dessous et nous confirmerons votre réservation sous peu" },
  "reservations.fullName": { en: "Full Name", ar: "الاسم الكامل", fr: "Nom complet" },
  "reservations.partySize": { en: "Party Size", ar: "عدد الأشخاص", fr: "Nombre de personnes" },
  "reservations.date": { en: "Date", ar: "التاريخ", fr: "Date" },
  "reservations.time": { en: "Time", ar: "الوقت", fr: "Heure" },
  "reservations.selectTime": { en: "Select time", ar: "اختر الوقت", fr: "Sélectionner l'heure" },
  "reservations.specialRequests": { en: "Special Requests (Optional)", ar: "طلبات خاصة (اختياري)", fr: "Demandes spéciales (Optionnel)" },
  "reservations.specialRequestsPlaceholder": { en: "Any dietary restrictions or special occasions?", ar: "أي قيود غذائية أو مناسبات خاصة؟", fr: "Des restrictions alimentaires ou des occasions spéciales?" },
  "reservations.reserveTable": { en: "Reserve Table", ar: "احجز طاولة", fr: "Réserver une table" },
  "reservations.reserving": { en: "Reserving...", ar: "جاري الحجز...", fr: "Réservation en cours..." },
  "reservations.confirmed": { en: "Reservation Confirmed!", ar: "تم تأكيد الحجز!", fr: "Réservation confirmée!" },
  "reservations.confirmedDesc": { en: "We look forward to serving you. A confirmation email has been sent.", ar: "نتطلع لخدمتك. تم إرسال بريد إلكتروني للتأكيد.", fr: "Nous avons hâte de vous servir. Un email de confirmation a été envoyé." },
  "reservations.failed": { en: "Reservation Failed", ar: "فشل الحجز", fr: "Échec de la réservation" },
  "reservations.failedDesc": { en: "Please try again or call us directly.", ar: "يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.", fr: "Veuillez réessayer ou nous appeler directement." },

  // Footer
  "footer.quickLinks": { en: "Quick Links", ar: "روابط سريعة", fr: "Liens rapides" },
  "footer.contact": { en: "Contact", ar: "اتصل بنا", fr: "Contact" },
  "footer.hours": { en: "Opening Hours", ar: "ساعات العمل", fr: "Horaires d'ouverture" },
  "footer.rights": { en: "All rights reserved", ar: "جميع الحقوق محفوظة", fr: "Tous droits réservés" },

  // Common
  "common.loading": { en: "Loading...", ar: "جاري التحميل...", fr: "Chargement..." },
  "common.close": { en: "Close", ar: "إغلاق", fr: "Fermer" },
  "common.back": { en: "Back", ar: "رجوع", fr: "Retour" },
  "common.dzd": { en: "DZD", ar: "دج", fr: "DZD" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
