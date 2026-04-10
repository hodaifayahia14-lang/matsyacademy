import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft } from "lucide-react";

export default function CreateCourse() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("0");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data || [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("courses").insert({
        title,
        description,
        category_id: categoryId || null,
        price: Number(price),
        level,
        instructor_id: user!.id,
        status: "draft",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Course created");
      navigate("/dashboard/admin/courses");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-2xl font-bold">Create Course</h1>
      </div>

      <div className="space-y-4 rounded-xl border bg-card p-6">
        <div>
          <Label>Title *</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Price (DZD)</Label>
            <Input type="number" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div>
            <Label>Level</Label>
            <Select value={level} onValueChange={v => setLevel(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={() => create.mutate()} disabled={!title} className="w-full">
          Create Course
        </Button>
      </div>
    </div>
  );
}
