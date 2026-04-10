import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Search, UserPlus } from "lucide-react";

export default function OrdersManagement() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, courses(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: agents } = useQuery({
    queryKey: ["agents-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("user_id, profiles:user_id(id, name)")
        .eq("role", "confirmation_agent");
      return data?.map(r => (r.profiles as any)) || [];
    },
  });

  const assignAgent = useMutation({
    mutationFn: async ({ orderId, agentId }: { orderId: string; agentId: string }) => {
      const { error } = await supabase.from("orders").update({ assigned_agent_id: agentId }).eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Agent assigned");
    },
  });

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const filtered = orders?.filter(o =>
    !search || o.full_name.toLowerCase().includes(search.toLowerCase()) || o.phone.includes(search)
  ) || [];

  const byStatus = (s?: string) => s ? filtered.filter(o => o.order_status === s) : filtered;

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { pending: "secondary", called: "outline", confirmed: "default", cancelled: "destructive" };
    return map[s] || "outline";
  };

  const OrderTable = ({ items }: { items: typeof filtered }) => (
    <div className="rounded-xl border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Wilaya</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Assigned Agent</TableHead>
            <TableHead>Assign</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(o => (
            <TableRow key={o.id}>
              <TableCell className="font-medium">{o.full_name}</TableCell>
              <TableCell dir="ltr">{o.phone}</TableCell>
              <TableCell className="max-w-[120px] truncate">{(o.courses as any)?.title || "—"}</TableCell>
              <TableCell>{o.wilaya_name}</TableCell>
              <TableCell className="text-xs capitalize">{o.status_label}</TableCell>
              <TableCell><Badge variant={statusBadge(o.order_status) as any} className="capitalize">{o.order_status}</Badge></TableCell>
              <TableCell className="text-sm">{o.assigned_agent_id ? "✓" : "—"}</TableCell>
              <TableCell>
                <Select onValueChange={val => assignAgent.mutate({ orderId: o.id, agentId: val })}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue placeholder="Assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents?.map((a: any) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
          {!items.length && (
            <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No orders</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Orders Management</h1>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name or phone..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending ({byStatus("pending").length})</TabsTrigger>
          <TabsTrigger value="called">Called ({byStatus("called").length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({byStatus("confirmed").length})</TabsTrigger>
          <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
        </TabsList>
        {["pending", "called", "confirmed", "all"].map(tab => (
          <TabsContent key={tab} value={tab}>
            <OrderTable items={byStatus(tab === "all" ? undefined : tab)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
