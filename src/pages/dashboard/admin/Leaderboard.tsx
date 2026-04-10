import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Trophy, Gift, Medal } from "lucide-react";

interface AgentStat {
  id: string;
  name: string;
  total: number;
  confirmed: number;
  confirmedWeek: number;
  confirmedMonth: number;
  rate: number;
}

export default function Leaderboard() {
  const { roles, user } = useAuth();
  const isAdmin = roles.includes("admin");
  const qc = useQueryClient();
  const [giftAgent, setGiftAgent] = useState<{ id: string; name: string } | null>(null);
  const [giftName, setGiftName] = useState("");
  const [giftDesc, setGiftDesc] = useState("");

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      // Get all agents
      const { data: agentRoles } = await supabase
        .from("user_roles")
        .select("user_id, profiles:user_id(id, name)")
        .eq("role", "confirmation_agent");

      if (!agentRoles?.length) return [];

      const agentIds = agentRoles.map(r => (r.profiles as any).id);

      // Get all orders for these agents
      const { data: orders } = await supabase
        .from("orders")
        .select("assigned_agent_id, order_status, confirmed_at")
        .in("assigned_agent_id", agentIds);

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const stats: AgentStat[] = agentRoles.map(r => {
        const profile = r.profiles as any;
        const agentOrders = (orders || []).filter(o => o.assigned_agent_id === profile.id);
        const confirmed = agentOrders.filter(o => o.order_status === "confirmed");
        return {
          id: profile.id,
          name: profile.name || "Agent",
          total: agentOrders.length,
          confirmed: confirmed.length,
          confirmedWeek: confirmed.filter(o => o.confirmed_at && new Date(o.confirmed_at) >= weekAgo).length,
          confirmedMonth: confirmed.filter(o => o.confirmed_at && new Date(o.confirmed_at) >= monthAgo).length,
          rate: agentOrders.length > 0 ? Math.round((confirmed.length / agentOrders.length) * 100) : 0,
        };
      });

      return stats.sort((a, b) => b.confirmed - a.confirmed);
    },
  });

  const awardGift = useMutation({
    mutationFn: async () => {
      if (!giftAgent) return;
      const { error } = await supabase.from("agent_rewards").insert({
        agent_id: giftAgent.id,
        gift_name: giftName,
        description: giftDesc,
        awarded_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Reward awarded!");
      setGiftAgent(null);
      setGiftName("");
      setGiftDesc("");
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const topAgent = leaderboard?.[0];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold flex items-center gap-2">
        <Trophy className="h-6 w-6 text-amber-500" /> Leaderboard
      </h1>

      {topAgent && topAgent.confirmed > 0 && (
        <Card className="mb-6 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="flex items-center gap-4 py-4">
            <Medal className="h-10 w-10 text-amber-500" />
            <div>
              <p className="text-lg font-bold">🥇 {topAgent.name}</p>
              <p className="text-sm text-muted-foreground">Best Agent — {topAgent.confirmed} confirmed orders ({topAgent.rate}% rate)</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>This Week</TableHead>
              <TableHead>This Month</TableHead>
              <TableHead>All Time</TableHead>
              <TableHead>Rate</TableHead>
              {isAdmin && <TableHead>Reward</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard?.map((agent, i) => (
              <TableRow key={agent.id} className={agent.id === user?.id ? "bg-primary/5" : ""}>
                <TableCell className="font-bold">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</TableCell>
                <TableCell className="font-medium">{agent.name}</TableCell>
                <TableCell>{agent.confirmedWeek}</TableCell>
                <TableCell>{agent.confirmedMonth}</TableCell>
                <TableCell className="font-semibold">{agent.confirmed}</TableCell>
                <TableCell>{agent.rate}%</TableCell>
                {isAdmin && (
                  <TableCell>
                    <Dialog open={giftAgent?.id === agent.id} onOpenChange={open => { if (!open) setGiftAgent(null); }}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setGiftAgent({ id: agent.id, name: agent.name })}>
                          <Gift className="me-1 h-3.5 w-3.5" /> Award
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Award Gift to {giftAgent?.name}</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                          <Input placeholder="Gift name" value={giftName} onChange={e => setGiftName(e.target.value)} />
                          <Textarea placeholder="Description" value={giftDesc} onChange={e => setGiftDesc(e.target.value)} />
                          <Button className="w-full" onClick={() => awardGift.mutate()} disabled={!giftName.trim()}>Award Gift</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {!leaderboard?.length && (
              <TableRow><TableCell colSpan={isAdmin ? 7 : 6} className="py-8 text-center text-muted-foreground">No agents yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
