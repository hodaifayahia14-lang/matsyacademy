import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Phone, CheckCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AgentOrders() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [noteOrderId, setNoteOrderId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["agent-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, courses(title)")
        .eq("assigned_agent_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateOrder = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const update: any = { order_status: status };
      if (status === "confirmed") {
        update.confirmed_by = user!.id;
        update.confirmed_at = new Date().toISOString();
      }
      if (notes !== undefined) update.notes = notes;
      const { error } = await supabase.from("orders").update(update).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agent-orders"] });
      toast.success("Order updated");
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

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">My Orders Queue</h1>
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
            <div className="rounded-xl border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Wilaya</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byStatus(tab === "all" ? undefined : tab).map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.full_name}</TableCell>
                      <TableCell dir="ltr">{order.phone}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{(order.courses as any)?.title || "—"}</TableCell>
                      <TableCell>{order.wilaya_name}</TableCell>
                      <TableCell><Badge variant={statusBadge(order.order_status) as any} className="capitalize">{order.order_status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {order.order_status === "pending" && (
                            <Button size="sm" variant="outline" onClick={() => updateOrder.mutate({ id: order.id, status: "called" })}>
                              <Phone className="me-1 h-3.5 w-3.5" /> Called
                            </Button>
                          )}
                          {(order.order_status === "pending" || order.order_status === "called") && (
                            <Button size="sm" onClick={() => updateOrder.mutate({ id: order.id, status: "confirmed" })}>
                              <CheckCircle className="me-1 h-3.5 w-3.5" /> Confirm
                            </Button>
                          )}
                          <Dialog open={noteOrderId === order.id} onOpenChange={open => { if (!open) setNoteOrderId(null); }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => { setNoteOrderId(order.id); setNoteText(order.notes || ""); }}>Notes</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Order Notes</DialogTitle></DialogHeader>
                              <Textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={4} />
                              <Button onClick={() => { updateOrder.mutate({ id: order.id, status: order.order_status, notes: noteText }); setNoteOrderId(null); }}>Save</Button>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {byStatus(tab === "all" ? undefined : tab).length === 0 && (
                    <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No orders</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
