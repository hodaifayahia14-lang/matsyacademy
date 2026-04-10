import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, ChevronDown, Send, User, FileText, CheckCircle, Facebook, Instagram, Youtube, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Contact() {
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const isRtl = lang === "ar";
  const t = (ar: string, fr: string, en: string) => lang === "ar" ? ar : lang === "fr" ? fr : en;

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const phoneValid = form.phone === "" || /^0[567]\d{8}$/.test(form.phone);

  const subjects = [
    { value: "general", label: t("استفسار عام", "Demande générale", "General Inquiry") },
    { value: "course", label: t("معلومات عن دورة", "Infos cours", "Course Info") },
    { value: "partnership", label: t("شراكة", "Partenariat", "Partnership") },
    { value: "support", label: t("دعم تقني", "Support technique", "Technical Support") },
    { value: "trainer", label: t("أريد أن أصبح مدرباً", "Devenir formateur", "Become a Trainer") },
    { value: "other", label: t("أخرى", "Autre", "Other") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      const { error } = await supabase.from("contact_messages" as any).insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject || null,
        message: form.message,
      } as any);
      if (error) throw error;
      setSent(true);
    } catch {
      toast.error(t("حدث خطأ، حاول مرة أخرى", "Une erreur est survenue", "Something went wrong, please try again"));
    } finally {
      setSending(false);
    }
  };

  const faqs = [
    { q: t("كيف يمكنني التسجيل في دورة؟", "Comment m'inscrire à un cours ?", "How do I enroll in a course?"), a: t("تصفح الدورات واضغط على 'اشترِ الآن'، ثم أكمل نموذج الطلب وسيتواصل معك فريقنا.", "Parcourez les cours, cliquez sur 'Acheter' et remplissez le formulaire.", "Browse courses, click 'Buy Now', fill in the order form and our team will contact you.") },
    { q: t("ما هي طرق الدفع المتاحة؟", "Quels modes de paiement acceptez-vous ?", "What payment methods are accepted?"), a: t("نقبل الدفع عند التسليم، التحويل البنكي، و CCP.", "Paiement à la livraison, virement bancaire, et CCP.", "Cash on delivery, bank transfer, and CCP.") },
    { q: t("كيف أصبح مدرباً؟", "Comment devenir formateur ?", "How do I become a trainer?"), a: t("تواصل معنا عبر النموذج أعلاه وحدد 'أريد أن أصبح مدرباً' كموضوع.", "Contactez-nous via le formulaire et sélectionnez 'Devenir formateur'.", "Contact us via the form above and select 'Become a Trainer' as the subject.") },
    { q: t("هل تقدمون شهادات؟", "Délivrez-vous des certificats ?", "Do you offer certificates?"), a: t("نعم، تحصل على شهادة معتمدة عند إكمال كل دورة بنجاح.", "Oui, un certificat reconnu est délivré à la fin de chaque cours.", "Yes, you receive a recognized certificate upon completing each course.") },
    { q: t("ماذا لو واجهت مشكلة تقنية؟", "Que faire en cas de problème technique ?", "What if I have a technical issue?"), a: t("تواصل مع فريق الدعم عبر النموذج أو عبر البريد الإلكتروني وسنرد خلال 24 ساعة.", "Contactez le support par formulaire ou email, réponse sous 24h.", "Contact our support team via the form or email and we'll respond within 24 hours.") },
    { q: t("كيف أصبح شريكاً؟", "Comment devenir partenaire ?", "How can I become a partner?"), a: t("نرحب بالشراكات! تواصل معنا وسنناقش الفرص المتاحة.", "Nous accueillons les partenariats ! Contactez-nous pour en discuter.", "We welcome partnerships! Contact us to discuss opportunities.") },
  ];

  const contactCards = [
    { icon: Phone, title: t("اتصل بنا", "Appelez-nous", "Call Us"), value: "+213 XX XXX XXXX", sub: t("متاح من 8ص إلى 6م", "Disponible de 8h à 18h", "Available 8AM–6PM"), href: "tel:+213000000000" },
    { icon: Mail, title: t("راسلنا", "Écrivez-nous", "Email Us"), value: "contact@maisyacademy.dz", sub: t("نرد خلال 24 ساعة", "Réponse sous 24h", "Reply within 24 hours"), href: "mailto:contact@maisyacademy.dz" },
    { icon: MapPin, title: t("موقعنا", "Notre adresse", "Our Location"), value: t("الجزائر العاصمة", "Alger", "Algiers, Algeria"), sub: t("الجزائر", "Algérie", "Algeria"), href: "#" },
  ];

  const socials = [
    { icon: Facebook, color: "#1877f2", label: "Facebook" },
    { icon: Instagram, color: "#e4405f", label: "Instagram" },
    { icon: Youtube, color: "#ff0000", label: "YouTube" },
    { icon: Linkedin, color: "#0a66c2", label: "LinkedIn" },
  ];

  return (
    <div className="overflow-hidden">
      {/* ═══════ HERO ═══════ */}
      <section className="relative" style={{ background: "linear-gradient(135deg, #5B2D8E 0%, #1A0A3C 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, hsl(42 72% 55% / 0.3) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="container relative z-10 py-16 md:py-20 text-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 px-5 py-1.5 rounded-full text-sm font-bold" style={{ background: "hsl(42, 72%, 45%)", color: "#fff" }}>
            {t("تواصل معنا", "Contactez-nous", "Contact Us")}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3 font-display">
            {t("نحن هنا للمساعدة دائماً", "Nous sommes là pour vous aider", "We Are Always Here to Help")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-xl mx-auto">
            {t("تواصل معنا وسنرد عليك في أقرب وقت ممكن", "Contactez-nous et nous vous répondrons très vite", "Reach out and we'll get back to you shortly")}
          </motion.p>
        </div>
      </section>

      {/* ═══════ CONTACT CARDS ═══════ */}
      <section className="py-12">
        <div className="container grid gap-6 sm:grid-cols-3">
          {contactCards.map((card, i) => (
            <motion.a key={i} href={card.href} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="block rounded-2xl bg-card p-6 shadow-md text-center hover:-translate-y-1.5 hover:shadow-lg hover:border-t-4 transition-all duration-300"
              style={{ borderTopColor: "hsl(270, 52%, 34%)" }}>
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <card.icon className="h-6 w-6" style={{ color: "hsl(42, 72%, 55%)" }} />
              </div>
              <h3 className="font-display font-bold text-foreground mb-1">{card.title}</h3>
              <p className="text-sm font-medium text-primary">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ═══════ FORM + INFO ═══════ */}
      <section className="py-12">
        <div className={`container grid gap-10 lg:grid-cols-[55%_1fr] ${isRtl ? "lg:direction-rtl" : ""}`}>
          {/* FORM */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-2xl bg-card p-8 md:p-10 shadow-lg">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </motion.div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {t("تم إرسال رسالتك بنجاح!", "Message envoyé avec succès !", "Message sent successfully!")}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t("سنتواصل معك قريباً.", "Nous vous contacterons bientôt.", "We'll be in touch soon.")}
                  </p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); setCharCount(0); }}
                    className="text-primary font-medium hover:underline">
                    {t("إرسال رسالة أخرى", "Envoyer un autre message", "Send Another Message")}
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-primary mb-1">{t("أرسل لنا رسالة", "Envoyez-nous un message", "Send Us a Message")}</h2>
                    <p className="text-sm text-muted-foreground">{t("سنرد عليك في أقرب وقت ممكن", "Nous répondrons dès que possible", "We'll get back to you as soon as possible")}</p>
                  </div>

                  {/* Name */}
                  <div className="relative">
                    <User className="absolute start-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required minLength={3} maxLength={100}
                      placeholder={t("الاسم الكامل", "Nom complet", "Full Name")}
                      className="w-full rounded-xl border bg-background px-4 ps-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute start-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required maxLength={255}
                      placeholder={t("البريد الإلكتروني", "Adresse email", "Email Address")}
                      className={`w-full rounded-xl border bg-background px-4 ps-10 pe-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${form.email && (emailValid ? "focus:ring-green-500 border-green-300" : "focus:ring-destructive border-destructive/50")}`} />
                    {form.email && (
                      <span className="absolute end-3 top-3.5 text-sm">{emailValid ? "✅" : "❌"}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Phone className="absolute start-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} maxLength={10}
                      placeholder={t("رقم الهاتف (05/06/07XXXXXXXX)", "Numéro de téléphone", "Phone Number (05/06/07XXXXXXXX)")}
                      className={`w-full rounded-xl border bg-background px-4 ps-10 pe-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${form.phone && (phoneValid ? "focus:ring-green-500 border-green-300" : "focus:ring-destructive border-destructive/50")}`} />
                    {form.phone && (
                      <span className="absolute end-3 top-3.5 text-sm">{phoneValid ? "✅" : "❌"}</span>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="relative">
                    <FileText className="absolute start-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full rounded-xl border bg-background px-4 ps-10 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none transition-all">
                      <option value="">{t("اختر الموضوع", "Choisir le sujet", "Select Subject")}</option>
                      {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <ChevronDown className="absolute end-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <textarea value={form.message} onChange={e => { setForm({ ...form, message: e.target.value }); setCharCount(e.target.value.length); }}
                      required maxLength={500} rows={5} style={{ resize: "vertical" }}
                      placeholder={t("رسالتك...", "Votre message...", "Your message...")}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                    <span className="absolute end-3 bottom-3 text-xs text-muted-foreground">{charCount} / 500</span>
                  </div>

                  <Button type="submit" disabled={sending || !form.name || !form.email || !emailValid || !form.message}
                    className="w-full gradient-purple-gold text-white font-bold py-6 rounded-xl text-base hover:scale-[1.02] hover:shadow-lg transition-all"
                    size="lg">
                    {sending ? (
                      <>{t("جارٍ الإرسال...", "Envoi en cours...", "Sending...")} <span className="animate-spin ms-2">⏳</span></>
                    ) : (
                      <>{t("إرسال الرسالة", "Envoyer le message", "Send Message")} <Send className="ms-2 h-4 w-4" /></>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-6">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-md h-[300px] md:h-[350px] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d204302.84782560403!2d2.94!3d36.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb26977680d2b%3A0x42d81ca81fcab245!2sAlgiers%2C%20Algeria!5e0!3m2!1sen!2s!4v1"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                className="grayscale-[40%] contrast-[1.1]"
              />
            </div>

            {/* Social */}
            <div className="rounded-2xl bg-card p-6 shadow-md">
              <h3 className="font-display font-bold text-foreground mb-4">{t("تابعنا على", "Suivez-nous sur", "Follow Us On")}</h3>
              <div className="flex gap-3">
                {socials.map((s, i) => (
                  <button key={i} className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border text-muted-foreground hover:text-white hover:scale-110 transition-all duration-300"
                    style={{ "--hover-bg": s.color } as any}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = s.color; (e.currentTarget as HTMLElement).style.borderColor = s.color; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.borderColor = ""; }}>
                    <s.icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Working hours */}
            <div className="rounded-2xl p-6 shadow-md" style={{ background: "hsl(260 10% 97%)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-display font-bold text-foreground">{t("ساعات العمل", "Heures de travail", "Working Hours")}</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{t("الأحد – الخميس: 8:00ص – 6:00م", "Dim – Jeu : 8h00 – 18h00", "Sun – Thu: 8:00 AM – 6:00 PM")}</p>
                <p>{t("الجمعة – السبت: مغلق", "Ven – Sam : Fermé", "Fri – Sat: Closed")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="py-16 bg-secondary/30">
        <div className="container max-w-3xl">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center font-display text-3xl font-bold text-foreground mb-10">
            {t("الأسئلة الشائعة", "Questions fréquentes", "Frequently Asked Questions")}
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <AccordionItem value={`faq-${i}`} className="rounded-xl bg-card shadow-sm border-none overflow-hidden data-[state=open]:border-s-4 data-[state=open]:border-primary">
                  <AccordionTrigger className="px-5 py-4 font-display font-semibold text-foreground hover:bg-purple-light/30 hover:no-underline text-start">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4 text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-14 gradient-purple-gold">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            {t("مستعد للبدء؟", "Prêt à commencer ?", "Ready to Get Started?")}
          </h2>
          <Link to="/courses">
            <Button size="lg" className="bg-white text-primary font-bold px-8 py-6 rounded-xl hover:bg-white/90 transition-all">
              {t("استكشف الدورات", "Découvrir les cours", "Explore Courses")} <ArrowRight className="ms-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
