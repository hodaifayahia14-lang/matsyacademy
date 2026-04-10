import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { algerianWilayas, statusOptions } from "@/data/algerianWilayas";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
  full_name: z.string().trim().min(3, "الاسم مطلوب (3 أحرف على الأقل)"),
  phone: z.string().regex(/^0[567]\d{8}$/, "رقم هاتف جزائري غير صحيح (05/06/07xxxxxxxx)"),
  wilaya_code: z.string().min(1, "الولاية مطلوبة"),
  baladiya: z.string().trim().min(2, "البلدية مطلوبة"),
  status_label: z.string().min(1, "الحالة مطلوبة"),
});

type FormData = z.infer<typeof schema>;

export default function OrderForm() {
  const { courseId } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language as "ar" | "fr" | "en";
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [course, setCourse] = useState<{ title: string; price: number; cover_image: string | null } | null>(null);

  useEffect(() => {
    if (!courseId) return;
    supabase.from("courses").select("title, price, cover_image").eq("id", courseId).single()
      .then(({ data }) => { if (data) setCourse(data); });
  }, [courseId]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", phone: "", wilaya_code: "", baladiya: "", status_label: "" },
  });

  const onSubmit = async (data: FormData) => {
    if (!courseId) return;
    setSubmitting(true);
    const wilaya = algerianWilayas.find(w => w.code === Number(data.wilaya_code));
    const { error } = await supabase.from("orders").insert({
      course_id: courseId,
      full_name: data.full_name,
      phone: data.phone,
      wilaya_code: Number(data.wilaya_code),
      wilaya_name: wilaya?.name || "",
      baladiya: data.baladiya.trim(),
      status_label: data.status_label,
      order_status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast.error("حدث خطأ، حاول مجدداً");
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl p-1"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
          }}
        >
          <div className="rounded-xl bg-card px-6 py-10 text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-9 w-9 text-green-500" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                {lang === "ar" ? "تم إرسال طلبك بنجاح!" : lang === "fr" ? "Commande envoyée avec succès !" : "Order submitted successfully!"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {lang === "ar" ? "سيتصل بك فريقنا قريباً." : lang === "fr" ? "Notre équipe vous contactera bientôt." : "Our team will contact you soon."}
              </p>
            </div>
            <Link to={courseId ? `/courses/${courseId}` : "/courses"}>
              <Button className="w-full gradient-gold text-accent-foreground font-bold rounded-full" size="lg">
                {lang === "ar" ? "العودة إلى الدورة" : "Back to Course"}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const priceText = course && Number(course.price) > 0
    ? `${Number(course.price).toLocaleString()} DZD`
    : (lang === "ar" ? "مجاني" : "Free");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-card shadow-2xl overflow-hidden"
      >
        {/* Course info header */}
        {course && (
          <div className="flex items-center gap-4 px-6 pt-6 pb-4 border-b border-border">
            {course.cover_image && (
              <img src={course.cover_image} alt="" className="h-16 w-16 rounded-lg object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0 text-end">
              <p className="font-display font-bold text-sm text-foreground truncate">{course.title}</p>
              <p className="text-accent font-bold text-sm mt-0.5">{priceText}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="px-6 py-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="full_name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-end block font-semibold">{lang === "ar" ? "الاسم الكامل" : "Full Name"}</FormLabel>
                  <FormControl><Input placeholder={lang === "ar" ? "محمد أحمد" : "Enter your full name"} className="rounded-lg" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-end block font-semibold">{lang === "ar" ? "رقم الهاتف" : "Phone Number"}</FormLabel>
                  <FormControl><Input placeholder="05XXXXXXXX" dir="ltr" className="rounded-lg" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="wilaya_code" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-end block font-semibold">{lang === "ar" ? "الولاية" : "Wilaya"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="rounded-lg"><SelectValue placeholder={lang === "ar" ? "الجزائر" : "Select wilaya"} /></SelectTrigger></FormControl>
                    <SelectContent className="max-h-60">
                      {algerianWilayas.map(w => (
                        <SelectItem key={w.code} value={String(w.code)}>
                          {String(w.code).padStart(2, "0")} - {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="baladiya" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-end block font-semibold">{lang === "ar" ? "البلدية" : "Municipality"}</FormLabel>
                  <FormControl><Input placeholder={lang === "ar" ? "سيدي امحمد" : "Enter municipality"} className="rounded-lg" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status_label" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-end block font-semibold">{lang === "ar" ? "الحالة المهنية" : "Status"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="rounded-lg"><SelectValue placeholder={lang === "ar" ? "اختر الحالة" : "Select status"} /></SelectTrigger></FormControl>
                    <SelectContent>
                      {statusOptions.map(s => (
                        <SelectItem key={s.value} value={s.value}>
                          {lang === "ar" ? s.labelAr : lang === "fr" ? s.labelFr : s.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <Button
                type="submit"
                className="w-full font-bold rounded-full text-white"
                size="lg"
                disabled={submitting}
                style={{
                  background: "linear-gradient(90deg, hsl(var(--accent)), hsl(var(--primary)))",
                }}
              >
                {submitting
                  ? (lang === "ar" ? "جاري الإرسال..." : "Submitting...")
                  : (lang === "ar" ? "تأكيد الطلب / Confirmer la commande" : "Confirm Order")}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}