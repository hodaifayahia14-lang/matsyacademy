import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["student-wishlist", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlists")
        .select("*, courses(id, title, cover_image, price, is_free)")
        .eq("student_id", user!.id);
      if (error) throw error;
      return data;
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("wishlists").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student-wishlist"] });
      toast.success("Removed from wishlist");
    },
  });

  if (isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.student.wishlist")}</h1>
      {!items?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="mb-2 font-display text-lg font-semibold">{t("dashboard.student.noWishlist")}</h3>
          <p className="text-sm text-muted-foreground">{t("dashboard.student.noWishlistDesc")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((w: any) => (
            <div key={w.id} className="overflow-hidden rounded-xl border bg-card shadow-card">
              <div className="aspect-video bg-muted">
                {w.courses?.cover_image && <img src={w.courses.cover_image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="p-4">
                <h3 className="mb-2 font-display text-sm font-semibold line-clamp-2">{w.courses?.title}</h3>
                <p className="mb-3 font-display text-lg font-bold">
                  {w.courses?.is_free ? t("catalog.free") : `$${w.courses?.price}`}
                </p>
                <div className="flex gap-2">
                  <Link to={`/courses/${w.course_id}`} className="flex-1">
                    <Button size="sm" className="w-full">{t("catalog.viewCourse")}</Button>
                  </Link>
                  <Button size="sm" variant="outline" onClick={() => removeMutation.mutate(w.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
