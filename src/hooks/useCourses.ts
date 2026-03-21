import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DBCourse {
  id: string;
  type: string;
  title: string;
  description: string | null;
  price: number;
  is_free: boolean;
  level: string;
  cover_image: string | null;
  language: string;
  status: string;
  file_url: string | null;
  page_count: number | null;
  instructor_id: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  subtitle: string | null;
  promo_video: string | null;
  tags: string[] | null;
  learning_outcomes: string[] | null;
  requirements: string[] | null;
  cpf_eligible: boolean;
  // joined
  category_name: string;
  category_name_en: string;
  category_name_fr: string;
  category_name_ar: string;
  instructor_name: string;
  instructor_avatar: string | null;
}

export function useCourses() {
  const [courses, setCourses] = useState<DBCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          categories:category_id(name, name_en, name_fr, name_ar),
          profiles:instructor_id(name, avatar_url)
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mapped: DBCourse[] = data.map((c: any) => ({
          ...c,
          category_name: c.categories?.name || "",
          category_name_en: c.categories?.name_en || "",
          category_name_fr: c.categories?.name_fr || "",
          category_name_ar: c.categories?.name_ar || "",
          instructor_name: c.profiles?.name || "",
          instructor_avatar: c.profiles?.avatar_url || null,
        }));
        setCourses(mapped);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { courses, loading };
}

export function useCourseDetail(id: string | undefined) {
  const [course, setCourse] = useState<DBCourse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          categories:category_id(name, name_en, name_fr, name_ar),
          profiles:instructor_id(name, avatar_url)
        `)
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        setCourse({
          ...data,
          category_name: (data as any).categories?.name || "",
          category_name_en: (data as any).categories?.name_en || "",
          category_name_fr: (data as any).categories?.name_fr || "",
          category_name_ar: (data as any).categories?.name_ar || "",
          instructor_name: (data as any).profiles?.name || "",
          instructor_avatar: (data as any).profiles?.avatar_url || null,
        } as DBCourse);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  return { course, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("categories").select("*").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);
  return categories;
}
