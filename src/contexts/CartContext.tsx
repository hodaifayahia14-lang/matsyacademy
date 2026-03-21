import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface CartItem {
  id: string;
  course_id: string;
  course?: {
    id: string;
    title: string;
    cover_image: string | null;
    price: number;
    type: string;
    instructor_id: string;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  cartCount: number;
  addToCart: (courseId: string) => Promise<void>;
  removeFromCart: (courseId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (courseId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("cart_items")
      .select("id, course_id, courses:course_id(id, title, cover_image, price, type, instructor_id)")
      .eq("user_id", user.id);
    setItems((data as any) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (courseId: string) => {
    if (!user) return;
    if (!UUID_RE.test(courseId)) {
      toast.error("Invalid product ID");
      return;
    }
    const { error } = await supabase.from("cart_items").insert({ user_id: user.id, course_id: courseId });
    if (error) {
      if (error.code === "23505") toast.info("Already in cart");
      else toast.error(error.message || "Failed to add to cart");
      return;
    }
    toast.success("Added to cart");
    fetchCart();
  };

  const removeFromCart = async (courseId: string) => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id).eq("course_id", courseId);
    setItems((prev) => prev.filter((i) => i.course_id !== courseId));
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  };

  const isInCart = (courseId: string) => items.some((i) => i.course_id === courseId);

  return (
    <CartContext.Provider value={{ items, loading, cartCount: items.length, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
