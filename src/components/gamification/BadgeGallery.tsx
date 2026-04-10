import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { MilestoneRule } from "./MilestoneRuleCard";

export default function BadgeGallery({ rules }: { rules: MilestoneRule[] }) {
  const [filter, setFilter] = useState<"all" | "earned" | "disabled">("all");

  const { data: badgeCounts, isLoading } = useQuery({
    queryKey: ["badge-earner-counts"],
    queryFn: async () => {
      const { data } = await supabase.from("agent_badges").select("milestone_rule_id");
      const counts: Record<string, number> = {};
      data?.forEach(b => { counts[b.milestone_rule_id] = (counts[b.milestone_rule_id] || 0) + 1; });
      return counts;
    },
  });

  const filtered = rules.filter(r => {
    if (filter === "disabled") return !r.is_active;
    if (filter === "earned") return (badgeCounts?.[r.id] || 0) > 0;
    return true;
  });

  if (isLoading) return <Skeleton className="h-40" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🏅 All Badges Overview</CardTitle>
        <div className="flex gap-2 mt-2">
          {(["all", "earned", "disabled"] as const).map(f => (
            <Badge key={f} variant={filter === f ? "default" : "outline"} className="cursor-pointer capitalize" onClick={() => setFilter(f)}>{f}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
            {filtered.map(r => (
              <Tooltip key={r.id}>
                <TooltipTrigger asChild>
                  <div className={`flex flex-col items-center gap-1 rounded-xl p-3 transition hover:bg-muted ${!r.is_active ? "opacity-40" : ""}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full text-2xl" style={{ backgroundColor: r.color + "22" }}>{r.icon}</div>
                    <span className="text-[10px] text-center text-muted-foreground truncate w-full">{r.name_en}</span>
                    <span className="text-[10px] font-semibold">{badgeCounts?.[r.id] || 0} earned</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{r.name_en}</p>
                  <p className="text-xs">Target: {r.target_value} · {r.milestone_type}</p>
                  <p className="text-xs">{badgeCounts?.[r.id] || 0} agents earned</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
        {filtered.length === 0 && <p className="py-8 text-center text-muted-foreground">No badges match this filter</p>}
      </CardContent>
    </Card>
  );
}
