import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

const schema = z.object({ email: z.string().trim().email("Invalid email address") });

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setSubmitting(true);
    const { error } = await resetPassword(data.email);
    setSubmitting(false);
    if (error) { toast.error(error.message); } else { setSent(true); }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4">
            <span className="font-display text-2xl font-bold text-primary">Matsy<span className="text-foreground"> Academy</span></span>
          </Link>
          <CardTitle className="text-2xl">{t("auth.resetPassword")}</CardTitle>
          <CardDescription>{sent ? t("auth.checkEmail") : t("auth.resetDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!sent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>{t("auth.email")}</FormLabel><FormControl>
                    <div className="relative"><Mail className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="you@example.com" className="ps-10" {...field} /></div>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? t("auth.sending") : t("auth.sendResetLink")}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center text-sm text-muted-foreground">{t("auth.emailSent")}</div>
          )}
          <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> {t("auth.backToLogin")}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
