import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ThankYou() {
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto p-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>
        <h1 className="mb-3 font-display text-3xl font-bold text-foreground">
          {lang === "ar" ? "شكراً لك!" : lang === "fr" ? "Merci !" : "Thank You!"}
        </h1>
        <p className="mb-6 text-muted-foreground">
          {lang === "ar" ? "تم تأكيد طلبك بنجاح. يمكنك الآن الوصول إلى دوراتك وكتبك من لوحة التحكم."
            : lang === "fr" ? "Votre commande a été confirmée. Accédez à vos cours depuis le tableau de bord."
            : "Your order has been confirmed. Access your courses from the dashboard."}
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/dashboard/student">
            <Button className="w-full gap-2" size="lg">
              {lang === "ar" ? "الذهاب إلى دوراتي" : lang === "fr" ? "Mes cours" : "Go to My Courses"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant="outline" className="w-full">
              {lang === "ar" ? "تصفح المزيد" : lang === "fr" ? "Parcourir plus" : "Browse More"}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
