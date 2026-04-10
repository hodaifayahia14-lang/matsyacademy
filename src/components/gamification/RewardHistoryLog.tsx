import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, Gift } from "lucide-react";
import type { MilestoneRule } from "./MilestoneRuleCard";

export default function RewardHistoryLog({ rules }: { rules: MilestoneRule[] }) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["reward-distribution-log"],
    queryFn: async () => {
      const { data } = await supabase
        .from("reward_distribution_log")
        .select("*, profiles:agent_id(name)")
        .order("created_at", { ascending: false })
        .limit(100);
      return data || [];
    },
  });

  const rulesMap = Object.fromEntries(rules.map(r => [r.id, r]));

  const exportCSV = () => {
    if (!logs?.length) return;
    const rows = logs.map((l: any) => [
      l.profiles?.name || l.agent_id,
      rulesMap[l.milestone_rule_id]?.name_en || l.milestone_rule_id,
      l.reward_type,
      l.delivery_status,
      new Date(l.created_at).toLocaleDateString(),
    ]);
    const csv = "Agent,Milestone,Reward Type,Status,Date\n" + rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "reward_log.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <Skeleton className="h-40" />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">📋 Reward Distribution Log</CardTitle>
        <Button variant="outline" size="sm" onClick={exportCSV}><Download className="me-1 h-4 w-4" />CSV</Button>
      </CardHeader>
      <CardContent>
        {!logs?.length ? (
          <div className="py-12 text-center text-muted-foreground">
            <Gift className="mx-auto mb-3 h-12 w-12 opacity-50" />
            <p>No rewards distributed yet. Set up your first milestone above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l: any) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.profiles?.name || "—"}</TableCell>
                    <TableCell>{rulesMap[l.milestone_rule_id]?.name_en || "—"}</TableCell>
                    <TableCell>{l.reward_type}</TableCell>
                    <TableCell>{l.delivery_status}</TableCell>
                    <TableCell>{new Date(l.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
