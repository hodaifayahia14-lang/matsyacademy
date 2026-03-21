import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

type FormData = z.infer<typeof schema>;

export default function Register() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState<"student" | "instructor">("student");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const { error } = await signUp(data.email, data.password, data.name, role);
    setSubmitting(false);
    if (error) { toast.error(error.message); }
    else { toast.success(t("auth.accountCreated")); navigate("/login"); }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4">
            <span className="font-display text-2xl font-bold text-primary">Matsy<span className="text-foreground"> Academy</span></span>
          </Link>
          <CardTitle className="text-2xl">{t("auth.createAccount")}</CardTitle>
          <CardDescription>{t("auth.startJourney")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
            <svg className="me-2 h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t("auth.continueGoogle")}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{t("auth.orRegister")}</span></div>
          </div>
          <div className="flex rounded-lg border p-1">
            <button type="button" onClick={() => setRole("student")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${role === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t("auth.student")}
            </button>
            <button type="button" onClick={() => setRole("instructor")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${role === "instructor" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t("auth.instructor")}
            </button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>{t("auth.fullName")}</FormLabel><FormControl>
                  <div className="relative"><User className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="John Doe" className="ps-10" {...field} /></div>
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>{t("auth.email")}</FormLabel><FormControl>
                  <div className="relative"><Mail className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="you@example.com" className="ps-10" {...field} /></div>
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>{t("auth.password")}</FormLabel><FormControl>
                  <div className="relative">
                    <Lock className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type={showPass ? "text" : "password"} placeholder="••••••••" className="ps-10 pe-10" {...field} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute end-3 top-3 text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem><FormLabel>{t("auth.confirmPassword")}</FormLabel><FormControl>
                  <div className="relative"><Lock className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="••••••••" className="ps-10" {...field} /></div>
                </FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? t("auth.creatingAccount") : t("auth.createAccount")}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground">
            {t("auth.hasAccount")}{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">{t("auth.signIn")}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
