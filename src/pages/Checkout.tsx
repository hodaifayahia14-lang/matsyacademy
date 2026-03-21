import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { CreditCard, Landmark, Smartphone, Check } from "lucide-react";
import { motion } from "framer-motion";

const paymentMethods = [
  { id: "baridimob", label: "BaridiMob", icon: Smartphone, color: "text-green-600",
    desc_ar: "ادفع عبر تطبيق بريدي موب", desc_fr: "Payez via BaridiMob", desc_en: "Pay via BaridiMob app" },
  { id: "ccp", label: "CCP / Poste Algérie", icon: Landmark, color: "text-yellow-600",
    desc_ar: "تحويل عبر الحساب البريدي CCP", desc_fr: "Virement CCP Poste Algérie", desc_en: "CCP bank transfer" },
  { id: "card", label: "EDAHABIA Card", icon: CreditCard, color: "text-blue-600",
    desc_ar: "الدفع ببطاقة الذهبية", desc_fr: "Payer par carte EDAHABIA", desc_en: "Pay with EDAHABIA card" },
];

export default function Checkout() {
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("baridimob");
  const [processing, setProcessing] = useState(false);

  const total = items.reduce((sum, item) => sum + ((item as any).courses?.price || 0), 0);

  const handleConfirm = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      // Create payments + enrollments for each item
      for (const item of items) {
        const course = (item as any).courses;
        if (!course) continue;
        await supabase.from("payments").insert({
          student_id: user.id, course_id: course.id, amount: course.price, status: "paid" as any, paid_at: new Date().toISOString(),
        });
        await supabase.from("enrollments").insert({
          student_id: user.id, course_id: course.id,
        });
      }
      await clearCart();
      navigate("/thank-you");
    } catch {
      toast.error("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) { navigate("/cart"); return null; }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-3xl">
        <h1 className="mb-8 font-display text-3xl font-bold">
          {lang === "ar" ? "إتمام الشراء" : lang === "fr" ? "Paiement" : "Checkout"}
        </h1>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3 space-y-4">
            <h2 className="font-display text-lg font-semibold mb-3">
              {lang === "ar" ? "اختر طريقة الدفع" : lang === "fr" ? "Méthode de paiement" : "Payment Method"}
            </h2>
            {paymentMethods.map((m) => (
              <motion.button key={m.id} whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(m.id)}
                className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-start transition-all ${
                  selected === m.id ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/30"
                }`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-card border ${m.color}`}>
                  <m.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "ar" ? m.desc_ar : lang === "fr" ? m.desc_fr : m.desc_en}
                  </p>
                </div>
                {selected === m.id && <Check className="h-5 w-5 text-primary" />}
              </motion.button>
            ))}

            {selected === "baridimob" && (
              <div className="rounded-lg border bg-secondary/30 p-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">
                  {lang === "ar" ? "تعليمات الدفع:" : "Payment Instructions:"}
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>{lang === "ar" ? "افتح تطبيق بريدي موب" : "Open BaridiMob app"}</li>
                  <li>{lang === "ar" ? "اختر تحويل إلى حساب" : "Select transfer to account"}</li>
                  <li>{lang === "ar" ? "أدخل رقم الحساب: 00799999001234567890" : "Enter account: 00799999001234567890"}</li>
                  <li>{lang === "ar" ? `أدخل المبلغ: ${total.toLocaleString()} دج` : `Enter amount: ${total.toLocaleString()} DZD`}</li>
                </ol>
              </div>
            )}
            {selected === "ccp" && (
              <div className="rounded-lg border bg-secondary/30 p-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">
                  {lang === "ar" ? "معلومات الحساب البريدي:" : "CCP Account Info:"}
                </p>
                <p>{lang === "ar" ? "رقم الحساب: 1234567890 / المفتاح: 12" : "Account: 1234567890 / Key: 12"}</p>
                <p>{lang === "ar" ? "باسم: أكاديمية ماتسي" : "Name: Maisy Academy"}</p>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="sticky top-20 rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-bold">
                {lang === "ar" ? "ملخص الطلب" : "Order Summary"}
              </h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => {
                  const c = (item as any).courses;
                  return c ? (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="line-clamp-1 flex-1 text-muted-foreground">{c.title}</span>
                      <span className="ms-2 font-semibold">{c.price.toLocaleString()} DZD</span>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-bold">
                <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
                <span className="text-primary">{total.toLocaleString()} DZD</span>
              </div>
              <Button className="mt-4 w-full gap-2" size="lg" onClick={handleConfirm} disabled={processing}>
                {processing ? (lang === "ar" ? "جاري المعالجة..." : "Processing...") : (lang === "ar" ? "تأكيد الطلب" : lang === "fr" ? "Confirmer" : "Confirm Order")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
