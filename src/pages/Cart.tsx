import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Cart() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const { items, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-4 font-display text-2xl font-bold">
          {lang === "ar" ? "سجّل دخولك لعرض السلة" : lang === "fr" ? "Connectez-vous pour voir le panier" : "Sign in to view your cart"}
        </h1>
        <Link to="/login"><Button>{t("navbar.login")}</Button></Link>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + ((item as any).courses?.price || 0), 0);

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-4 font-display text-2xl font-bold">
          {lang === "ar" ? "سلتك فارغة" : lang === "fr" ? "Votre panier est vide" : "Your cart is empty"}
        </h1>
        <Link to="/courses"><Button>{lang === "ar" ? "تصفح المنتجات" : lang === "fr" ? "Parcourir les produits" : "Browse Products"}</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <h1 className="mb-8 font-display text-3xl font-bold">
          {lang === "ar" ? "سلة المشتريات" : lang === "fr" ? "Panier" : "Shopping Cart"} ({items.length})
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item, i) => {
              const course = (item as any).courses;
              if (!course) return null;
              return (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex gap-4 rounded-xl border bg-card p-4 shadow-sm">
                  <img src={course.cover_image || "/placeholder.svg"} alt={course.title}
                    className="h-20 w-28 flex-shrink-0 rounded-lg object-cover" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1">{course.title}</h3>
                      <span className="text-xs text-muted-foreground capitalize">{course.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">{course.price > 0 ? `${course.price.toLocaleString()} DZD` : (lang === "ar" ? "مجاني" : "Free")}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.course_id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-bold">
                {lang === "ar" ? "ملخص الطلب" : lang === "fr" ? "Résumé" : "Order Summary"}
              </h2>
              <div className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span className="font-semibold">{total.toLocaleString()} DZD</span>
                </div>
              </div>
              <div className="mb-4 flex justify-between border-t pt-4 text-lg font-bold">
                <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
                <span className="text-primary">{total.toLocaleString()} DZD</span>
              </div>
              <Button className="w-full gap-2" size="lg" onClick={() => navigate("/checkout")}>
                {lang === "ar" ? "إتمام الشراء" : lang === "fr" ? "Passer la commande" : "Proceed to Checkout"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
