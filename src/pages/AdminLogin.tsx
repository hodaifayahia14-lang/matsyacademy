import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import maisyLogo from "@/assets/maisy-logo-v2.png";

const schema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function AdminLogin() {
  const { signIn, user, roles } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [remember, setRemember] = useState(false);

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5B2D8E] via-[#7B3FA0] to-[#C9971C]" />
      {/* Noise / soft overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(91,45,142,0.8),transparent_60%),radial-gradient(ellipse_at_70%_80%,rgba(201,151,28,0.6),transparent_60%)]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        {/* Logo */}
        <div className="mb-2 flex flex-col items-center">
          <img src={maisyLogo} alt="Maisy Academy" className="h-16 w-16 object-contain" />
          <div className="mt-2 flex items-center gap-2 text-center">
            <span className="font-display text-lg font-bold text-[#C9971C]">Maisy</span>
            <span className="font-display text-lg font-bold text-[#5B2D8E]">Academy</span>
            <span className="font-display text-lg font-bold text-[#5B2D8E]">أكاديمية مايسي</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-6 text-center font-display text-2xl font-bold text-[#5B2D8E]">
          Admin & Agent Login
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5B2D8E]/50" />
                    <Input
                      placeholder="Email Address"
                      className="h-12 rounded-xl border-2 border-[#C9971C]/40 bg-white ps-12 text-base placeholder:text-muted-foreground/60 focus:border-[#C9971C] focus:ring-2 focus:ring-[#C9971C]/20"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Password */}
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5B2D8E]/50" />
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="Password"
                      className="h-12 rounded-xl border-2 border-border bg-white ps-12 pe-12 text-base placeholder:text-muted-foreground/60 focus:border-[#5B2D8E] focus:ring-2 focus:ring-[#5B2D8E]/20"
                      {...field}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(v === true)}
                className="border-muted-foreground/40"
              />
              <label htmlFor="remember" className="text-sm text-foreground/70 cursor-pointer select-none">
                Remember Me
              </label>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-[#5B2D8E] to-[#C9971C] text-base font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
            >
              {submitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        {/* Footer text */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Staff portal only. Unauthorized access prohibited.
        </p>
      </div>
    </div>
  );
}
