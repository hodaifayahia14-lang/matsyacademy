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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Check if Q&A data already exists
    const { count } = await supabase.from("qa_questions").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      return new Response(JSON.stringify({ message: "Q&A data already seeded", count }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find a user to use as author
    const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ error: "No users found. Create a user first." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = profiles[0].id;

    // Seed 6 Q&A questions
    const questions = [
      {
        user_id: userId,
        title: "How to prepare for the HSE certification exam?",
        body: "I'm planning to take the HSE safety agent certification exam. What topics should I focus on and how long does the preparation typically take? Any study tips from those who have passed?",
        is_answered: true,
        upvotes: 12,
      },
      {
        user_id: userId,
        title: "What PPE is required for industrial inspections?",
        body: "I'm starting my first industrial site inspection next week. What personal protective equipment do I need to bring? Are there specific standards for PPE in Algerian industrial facilities?",
        is_answered: true,
        upvotes: 8,
      },
      {
        user_id: userId,
        title: "Hajj guide course — is it suitable for beginners?",
        body: "I have basic Islamic knowledge but no professional guide experience. Is the Professional Hajj & Umrah Guide course suitable for complete beginners, or should I have some prior experience?",
        is_answered: false,
        upvotes: 15,
      },
      {
        user_id: userId,
        title: "Can I get the certificate before completing all modules?",
        body: "I've completed 80% of the Safety Agent course. Is there a way to get a partial certificate, or do I need to complete all modules including the final assessment?",
        is_answered: true,
        upvotes: 6,
      },
      {
        user_id: userId,
        title: "What is the difference between Agent and Inspector courses?",
        body: "I'm confused about the difference between the Workplace Safety Agent course and the Inspector course. Which one should I take first? Can I take both?",
        is_answered: false,
        upvotes: 20,
      },
      {
        user_id: userId,
        title: "Are there group discounts for companies?",
        body: "Our company wants to enroll 15 employees in the HSE Safety Agent course. Do you offer group discounts or corporate training packages?",
        is_answered: false,
        upvotes: 4,
      },
    ];

    const { data: insertedQuestions, error: qError } = await supabase
      .from("qa_questions")
      .insert(questions)
      .select("id");

    if (qError) throw qError;

    // Seed answers for answered questions (indices 0, 1, 3)
    const answeredIndices = [0, 1, 3];
    const answers: any[] = [];

    // Answers for Q1: HSE certification prep
    answers.push({
      question_id: insertedQuestions[0].id,
      user_id: userId,
      body: "Focus on these key areas: 1) HSE regulations and Algerian labor laws, 2) Risk assessment methodologies, 3) Fire safety and emergency procedures, 4) PPE standards. The Maisy Academy course covers all these topics comprehensively. I studied for about 3 months and passed on my first try!",
      is_accepted: true,
    });
    answers.push({
      question_id: insertedQuestions[0].id,
      user_id: userId,
      body: "I recommend taking practice quizzes after each module. The final assessment format is similar to the quizzes in the course. Also, pay special attention to the practical scenarios — they make up about 40% of the exam.",
      is_accepted: false,
    });

    // Answers for Q2: PPE for inspections
    answers.push({
      question_id: insertedQuestions[1].id,
      user_id: userId,
      body: "For industrial site inspections, you'll need: hard hat (EN 397), safety glasses (EN 166), high-visibility vest (EN ISO 20471), steel-toe boots (EN ISO 20345), and hearing protection if noise exceeds 85dB. Always check the specific site requirements beforehand.",
      is_accepted: true,
    });

    // Answers for Q4: Certificate before completion
    answers.push({
      question_id: insertedQuestions[3].id,
      user_id: userId,
      body: "Unfortunately, the certificate is only issued upon 100% completion of all modules and passing the final assessment with a minimum score of 70%. However, you can track your progress and download a progress report at any time. Keep going — you're almost there!",
      is_accepted: true,
    });

    const { error: aError } = await supabase.from("qa_answers").insert(answers);
    if (aError) throw aError;

    return new Response(
      JSON.stringify({ message: "Q&A data seeded successfully", questions: insertedQuestions.length, answers: answers.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
