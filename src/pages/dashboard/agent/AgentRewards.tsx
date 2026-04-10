import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift } from "lucide-react";

export default function AgentRewards() {
  const { user } = useAuth();

  const { data: rewards, isLoading } = useQuery({
    queryKey: ["agent-rewards", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_rewards")
        .select("*")
        .eq("agent_id", user!.id)
        .order("awarded_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">My Rewards</h1>
      {!rewards?.length ? (
        <div className="py-12 text-center text-muted-foreground">
          <Gift className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p>No rewards yet. Keep confirming orders!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {rewards.map(r => (
            <Card key={r.id}>
              <CardContent className="flex items-start gap-3 py-4">
                <Gift className="mt-1 h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-semibold">{r.gift_name}</p>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(r.awarded_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
