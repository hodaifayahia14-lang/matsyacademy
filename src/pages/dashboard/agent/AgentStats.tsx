import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, CheckCircle, TrendingUp, Award } from "lucide-react";

export default function AgentStats() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["agent-stats", user?.id],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from("orders")
        .select("order_status, confirmed_at, created_at")
        .eq("assigned_agent_id", user!.id);

      const all = orders || [];
      const confirmed = all.filter(o => o.order_status === "confirmed");
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const confirmedThisWeek = confirmed.filter(o => o.confirmed_at && new Date(o.confirmed_at) >= weekAgo).length;
      const confirmedThisMonth = confirmed.filter(o => o.confirmed_at && new Date(o.confirmed_at) >= monthAgo).length;
      const rate = all.length > 0 ? Math.round((confirmed.length / all.length) * 100) : 0;

      return { total: all.length, confirmed: confirmed.length, confirmedThisWeek, confirmedThisMonth, rate };
    },
    enabled: !!user,
  });

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const cards = [
    { title: "Total Assigned", value: stats?.total || 0, icon: Phone, color: "text-blue-500" },
    { title: "Confirmed (All Time)", value: stats?.confirmed || 0, icon: CheckCircle, color: "text-green-500" },
    { title: "Confirmed This Week", value: stats?.confirmedThisWeek || 0, icon: TrendingUp, color: "text-amber-500" },
    { title: "Confirmation Rate", value: `${stats?.rate || 0}%`, icon: Award, color: "text-purple-500" },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">My Performance</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(c => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
