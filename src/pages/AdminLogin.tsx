import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import maisyLogo from "@/assets/maisy-logo.png";

const schema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function AdminLogin() {
  const { signIn, user, roles } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && roles.length > 0) {
      if (roles.includes("admin")) navigate("/dashboard/admin", { replace: true });
      else if (roles.includes("confirmation_agent")) navigate("/dashboard/agent", { replace: true });
    }
  }, [user, roles, navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const { error } = await signIn(data.email, data.password);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img src={maisyLogo} alt="Maisy Academy" className="mx-auto h-16 w-16 rounded-xl object-contain" />
          </div>
          <CardTitle className="text-2xl">Staff Login</CardTitle>
          <CardDescription>Admin & Agent access only</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl>
                  <div className="relative"><Mail className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="admin@example.com" className="ps-10" {...field} /></div>
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl>
                  <div className="relative">
                    <Lock className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type={showPass ? "text" : "password"} placeholder="••••••••" className="ps-10 pe-10" {...field} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute end-3 top-3 text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
