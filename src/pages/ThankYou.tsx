import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ThankYou() {
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl p-1"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
        }}
      >
        <div className="rounded-xl bg-card px-6 py-10 text-center space-y-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
          >
            <CheckCircle className="h-9 w-9 text-green-500" />
          </motion.div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground mb-2">
              {lang === "ar" ? "تم إرسال طلبك بنجاح!" : lang === "fr" ? "Commande envoyée avec succès !" : "Order submitted successfully!"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {lang === "ar" ? "سيتصل بك فريقنا قريباً." : lang === "fr" ? "Notre équipe vous contactera bientôt." : "Our team will contact you soon."}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/courses">
              <Button className="w-full gradient-gold text-accent-foreground font-bold rounded-full" size="lg">
                {lang === "ar" ? "العودة إلى الدورة" : lang === "fr" ? "Retour au cours" : "Back to Course"}
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}