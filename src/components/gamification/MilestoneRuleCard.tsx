import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Copy, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export interface MilestoneRule {
  id: string;
  name_ar: string;
  name_fr: string;
  name_en: string;
  milestone_type: string;
  target_value: number;
  reward_config: any;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  show_on_leaderboard: boolean;
  show_on_agent_dashboard: boolean;
  is_repeatable: boolean;
  repeat_period: string | null;
}

interface Props {
  rule: MilestoneRule;
  lang: string;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggle: (active: boolean) => void;
}

export default function MilestoneRuleCard({ rule, lang, onEdit, onDuplicate, onDelete, onToggle }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: rule.id });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const name = lang === "ar" ? rule.name_ar : lang === "fr" ? rule.name_fr : rule.name_en;

  const typeLabels: Record<string, string> = {
    total_confirmations: "Total Confirmations",
    monthly_confirmations: "Monthly",
    weekly_confirmations: "Weekly",
    confirmation_rate: "Rate %",
    streak: "Streak",
    speed: "Speed",
  };

  return (
    <motion.div ref={setNodeRef} style={style} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <Card className={`flex items-center gap-3 p-4 ${!rule.is_active ? "opacity-50" : ""} ${isDragging ? "shadow-lg ring-2 ring-primary/30" : ""}`}>
        <button {...attributes} {...listeners} className="cursor-grab touch-none text-muted-foreground hover:text-foreground">
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: rule.color + "22", color: rule.color }}>
          {rule.icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{name || rule.name_en}</p>
          <p className="text-xs text-muted-foreground">
            {typeLabels[rule.milestone_type] || rule.milestone_type} · Target: {rule.target_value}
          </p>
        </div>

        <Switch checked={rule.is_active} onCheckedChange={onToggle} />

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={onDuplicate}><Copy className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      </Card>
    </motion.div>
  );
}
