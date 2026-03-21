import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Find test users
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const student = users?.find(u => u.email === "student@matsy.test");
  const instructor = users?.find(u => u.email === "instructor@matsy.test");
  const admin = users?.find(u => u.email === "admin@matsy.test");

  if (!student || !instructor) {
    return new Response(JSON.stringify({ error: "Test users not found. Run create-test-users first." }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const questions = [
    { title: "How to prepare for the HSE certification exam?", body: "I want to take the HSE Safety Agent certification. What topics should I focus on? Are there practice tests available?", user_id: student.id, is_answered: true, upvotes: 12 },
    { title: "What PPE is required for industrial inspections?", body: "I'm starting the Inspector course. What personal protective equipment do I need for the practical assessments?", user_id: student.id, is_answered: true, upvotes: 8 },
    { title: "Hajj guide course — is it suitable for beginners?", body: "I have no prior experience in religious guidance. Can I still enroll in the Professional Hajj & Umrah Guide course?", user_id: student.id, is_answered: false, upvotes: 15 },
    { title: "Can I get the certificate before completing all modules?", body: "I've completed 80% of the course. Is there a way to get a provisional certificate for my employer?", user_id: student.id, is_answered: true, upvotes: 5 },
    { title: "What is the difference between Agent and Inspector courses?", body: "Both HSE courses seem similar. What are the key differences in terms of content and career opportunities?", user_id: student.id, is_answered: false, upvotes: 20 },
    { title: "Are there group discounts for companies?", body: "Our company wants to enroll 15 employees in the HSE Safety Agent course. Do you offer corporate pricing?", user_id: admin?.id || student.id, is_answered: false, upvotes: 7 },
  ];

  const insertedQuestions = [];
  for (const q of questions) {
    const { data, error } = await supabase.from("qa_questions").insert(q).select().single();
    if (error) console.error("Q insert error:", error);
    else insertedQuestions.push(data);
  }

  // Add answers to answered questions
  const answers = [
    { question_id: insertedQuestions[0]?.id, user_id: instructor.id, body: "Focus on fire safety regulations, risk assessment methodologies, and emergency response procedures. The course covers all exam topics in detail. Practice tests are included in Module 5.", is_accepted: true },
    { question_id: insertedQuestions[0]?.id, user_id: admin?.id || instructor.id, body: "I'd also recommend reviewing the Algerian workplace safety regulations (decree 05-09). The exam includes questions about local legislation.", is_accepted: false },
    { question_id: insertedQuestions[1]?.id, user_id: instructor.id, body: "For the Inspector course practical assessments, you'll need: safety helmet (EN 397), high-visibility vest, safety boots (EN ISO 20345), safety glasses, and hearing protection. The academy provides a detailed list in the course materials.", is_accepted: true },
    { question_id: insertedQuestions[3]?.id, user_id: instructor.id, body: "Unfortunately, certificates are only issued upon 100% completion of all modules and passing all quizzes with the minimum required score. However, you can download a progress report from your dashboard to show your employer.", is_accepted: true },
  ];

  for (const a of answers) {
    if (a.question_id) {
      const { error } = await supabase.from("qa_answers").insert(a);
      if (error) console.error("A insert error:", error);
    }
  }

  return new Response(JSON.stringify({ 
    success: true, 
    questionsInserted: insertedQuestions.length,
    answersInserted: answers.filter(a => a.question_id).length 
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
