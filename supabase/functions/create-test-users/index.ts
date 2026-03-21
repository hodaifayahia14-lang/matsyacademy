import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const users = [
      { email: "admin@matsy.test", password: "Admin123!", name: "Admin User", extraRole: "admin" },
      { email: "instructor@matsy.test", password: "Instructor123!", name: "Instructor User", extraRole: "instructor" },
      { email: "student@matsy.test", password: "Student123!", name: "Student User", extraRole: null },
    ];

    const results = [];

    for (const u of users) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((eu: any) => eu.email === u.email);
      
      if (existing) {
        results.push({ email: u.email, status: "already_exists", id: existing.id });
        // Still ensure roles are correct
        if (u.extraRole) {
          await supabaseAdmin.from("user_roles").upsert(
            { user_id: existing.id, role: u.extraRole },
            { onConflict: "user_id,role" }
          );
        }
        continue;
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { name: u.name },
      });

      if (error) {
        results.push({ email: u.email, status: "error", error: error.message });
        continue;
      }

      // The handle_new_user trigger adds 'student' role automatically
      // Add extra role if needed
      if (u.extraRole && data.user) {
        await supabaseAdmin.from("user_roles").insert({
          user_id: data.user.id,
          role: u.extraRole,
        });
      }

      results.push({ email: u.email, status: "created", id: data.user?.id });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
