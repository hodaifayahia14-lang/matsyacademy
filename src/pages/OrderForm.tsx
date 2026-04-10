import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { algerianWilayas, statusOptions } from "@/data/algerianWilayas";
import { CheckCircle } from "lucide-react";

const schema = z.object({
  full_name: z.string().trim().min(3, "الاسم مطلوب (3 أحرف على الأقل)"),
  phone: z.string().regex(/^0[567]\d{8}$/, "رقم هاتف جزائري غير صحيح (05/06/07xxxxxxxx)"),
  wilaya_code: z.string().min(1, "الولاية مطلوبة"),
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
    defaultValues: { full_name: "", phone: "", wilaya_code: "", status_label: "" },
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
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12 space-y-4">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="font-display text-2xl font-bold">
              {lang === "ar" ? "تم إرسال طلبك بنجاح!" : lang === "fr" ? "Commande envoyée avec succès!" : "Order submitted successfully!"}
            </h2>
            <p className="text-muted-foreground">
              {lang === "ar" ? "سيتم التواصل معك قريباً لتأكيد الطلب" : lang === "fr" ? "Nous vous contacterons bientôt pour confirmer" : "We will contact you shortly to confirm"}
            </p>
            <Link to="/courses"><Button variant="outline">
              {lang === "ar" ? "تصفح المزيد من الدورات" : "Browse more courses"}
            </Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const priceText = course && Number(course.price) > 0
    ? `${Number(course.price).toLocaleString()} DZD`
    : (lang === "ar" ? "مجاني" : "Free");

  return (
    <div className="container max-w-lg py-8 sm:py-12">
      {course && (
        <Card className="mb-6">
          <CardContent className="flex items-center gap-4 py-4">
            {course.cover_image && <img src={course.cover_image} alt="" className="h-16 w-16 rounded-lg object-cover" />}
            <div className="flex-1">
              <p className="font-semibold">{course.title}</p>
              <p className="text-lg font-bold text-primary">{priceText}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{lang === "ar" ? "نموذج الطلب" : lang === "fr" ? "Formulaire de commande" : "Order Form"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="full_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>{lang === "ar" ? "الاسم الكامل" : "Full Name"}</FormLabel>
                  <FormControl><Input placeholder={lang === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>{lang === "ar" ? "رقم الهاتف" : "Phone Number"}</FormLabel>
                  <FormControl><Input placeholder="05xxxxxxxx" dir="ltr" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="wilaya_code" render={({ field }) => (
                <FormItem>
                  <FormLabel>{lang === "ar" ? "الولاية" : "Wilaya"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder={lang === "ar" ? "اختر الولاية" : "Select wilaya"} /></SelectTrigger></FormControl>
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
              <FormField control={form.control} name="status_label" render={({ field }) => (
                <FormItem>
                  <FormLabel>{lang === "ar" ? "الحالة المهنية" : "Status"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder={lang === "ar" ? "اختر الحالة" : "Select status"} /></SelectTrigger></FormControl>
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
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting
                  ? (lang === "ar" ? "جاري الإرسال..." : "Submitting...")
                  : (lang === "ar" ? "إرسال الطلب" : lang === "fr" ? "Envoyer la commande" : "Submit Order")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
