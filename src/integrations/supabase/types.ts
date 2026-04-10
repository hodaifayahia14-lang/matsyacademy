export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agent_compensation: {
        Row: {
          agent_id: string
          amount: number
          created_at: string
          id: string
          pay_type: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          amount?: number
          created_at?: string
          id?: string
          pay_type?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          amount?: number
          created_at?: string
          id?: string
          pay_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_compensation_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_rewards: {
        Row: {
          agent_id: string
          awarded_at: string
          awarded_by: string | null
          description: string | null
          gift_name: string
          id: string
        }
        Insert: {
          agent_id: string
          awarded_at?: string
          awarded_by?: string | null
          description?: string | null
          gift_name: string
          id?: string
        }
        Update: {
          agent_id?: string
          awarded_at?: string
          awarded_by?: string | null
          description?: string | null
          gift_name?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_rewards_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_rewards_awarded_by_fkey"
            columns: ["awarded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content_ar: string
          content_en: string
          content_fr: string
          cover_image: string | null
          created_at: string
          excerpt_ar: string
          excerpt_en: string
          excerpt_fr: string
          id: string
          published_at: string | null
          status: string
          title_ar: string
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content_ar?: string
          content_en?: string
          content_fr?: string
          cover_image?: string | null
          created_at?: string
          excerpt_ar?: string
          excerpt_en?: string
          excerpt_fr?: string
          id?: string
          published_at?: string | null
          status?: string
          title_ar?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content_ar?: string
          content_en?: string
          content_fr?: string
          cover_image?: string | null
          created_at?: string
          excerpt_ar?: string
          excerpt_en?: string
          excerpt_fr?: string
          id?: string
          published_at?: string | null
          status?: string
          title_ar?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          course_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          name_ar: string
          name_en: string
          name_fr: string
          slug: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          name_ar?: string
          name_en?: string
          name_fr?: string
          slug: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          name_ar?: string
          name_en?: string
          name_fr?: string
          slug?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_uid: string
          course_id: string
          id: string
          issued_at: string
          student_id: string
        }
        Insert: {
          certificate_uid?: string
          course_id: string
          id?: string
          issued_at?: string
          student_id: string
        }
        Update: {
          certificate_uid?: string
          course_id?: string
          id?: string
          issued_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          lesson_id: string
          parent_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          lesson_id: string
          parent_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lesson_id?: string
          parent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          expiry_date: string | null
          id: string
          max_uses: number | null
          uses_count: number
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          expiry_date?: string | null
          id?: string
          max_uses?: number | null
          uses_count?: number
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          expiry_date?: string | null
          id?: string
          max_uses?: number | null
          uses_count?: number
          value?: number
        }
        Relationships: []
      }
      courses: {
        Row: {
          category_id: string | null
          cover_image: string | null
          cpf_eligible: boolean
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          instructor_id: string
          is_free: boolean
          language: string
          learning_outcomes: string[] | null
          level: Database["public"]["Enums"]["course_level"]
          page_count: number | null
          price: number
          promo_video: string | null
          requirements: string[] | null
          status: Database["public"]["Enums"]["course_status"]
          subtitle: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          cover_image?: string | null
          cpf_eligible?: boolean
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          instructor_id: string
          is_free?: boolean
          language?: string
          learning_outcomes?: string[] | null
          level?: Database["public"]["Enums"]["course_level"]
          page_count?: number | null
          price?: number
          promo_video?: string | null
          requirements?: string[] | null
          status?: Database["public"]["Enums"]["course_status"]
          subtitle?: string | null
          tags?: string[] | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          cover_image?: string | null
          cpf_eligible?: boolean
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          instructor_id?: string
          is_free?: boolean
          language?: string
          learning_outcomes?: string[] | null
          level?: Database["public"]["Enums"]["course_level"]
          page_count?: number | null
          price?: number
          promo_video?: string | null
          requirements?: string[] | null
          status?: Database["public"]["Enums"]["course_status"]
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress_percent: number
          student_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress_percent?: number
          student_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress_percent?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      instruction_progress: {
        Row: {
          completed: boolean
          id: string
          instruction_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          id?: string
          instruction_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          id?: string
          instruction_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instruction_progress_instruction_id_fkey"
            columns: ["instruction_id"]
            isOneToOne: false
            referencedRelation: "instructions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instruction_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      instructions: {
        Row: {
          body_ar: string
          body_en: string
          body_fr: string
          created_at: string
          id: string
          sort_order: number
          title_ar: string
          title_en: string
          title_fr: string
        }
        Insert: {
          body_ar?: string
          body_en?: string
          body_fr?: string
          created_at?: string
          id?: string
          sort_order?: number
          title_ar?: string
          title_en?: string
          title_fr?: string
        }
        Update: {
          body_ar?: string
          body_en?: string
          body_fr?: string
          created_at?: string
          id?: string
          sort_order?: number
          title_ar?: string
          title_en?: string
          title_fr?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string
          id: string
          lesson_id: string
          student_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_id: string
          student_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          created_at: string
          duration_minutes: number
          id: string
          is_preview: boolean
          order: number
          section_id: string
          title: string
          type: Database["public"]["Enums"]["lesson_type"]
        }
        Insert: {
          content?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          is_preview?: boolean
          order?: number
          section_id: string
          title: string
          type?: Database["public"]["Enums"]["lesson_type"]
        }
        Update: {
          content?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          is_preview?: boolean
          order?: number
          section_id?: string
          title?: string
          type?: Database["public"]["Enums"]["lesson_type"]
        }
        Relationships: [
          {
            foreignKeyName: "lessons_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          assigned_agent_id: string | null
          baladiya: string
          confirmed_at: string | null
          confirmed_by: string | null
          course_id: string | null
          created_at: string
          full_name: string
          id: string
          notes: string | null
          order_status: string
          phone: string
          status_label: string
          wilaya_code: number
          wilaya_name: string
        }
        Insert: {
          assigned_agent_id?: string | null
          baladiya?: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          course_id?: string | null
          created_at?: string
          full_name: string
          id?: string
          notes?: string | null
          order_status?: string
          phone: string
          status_label?: string
          wilaya_code: number
          wilaya_name: string
        }
        Update: {
          assigned_agent_id?: string | null
          baladiya?: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          course_id?: string | null
          created_at?: string
          full_name?: string
          id?: string
          notes?: string | null
          order_status?: string
          phone?: string
          status_label?: string
          wilaya_code?: number
          wilaya_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          course_id: string
          created_at: string
          id: string
          paid_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          stripe_session_id: string | null
          student_id: string
        }
        Insert: {
          amount: number
          course_id: string
          created_at?: string
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_session_id?: string | null
          student_id: string
        }
        Update: {
          amount?: number
          course_id?: string
          created_at?: string
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_session_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          social_links: Json | null
          specialization: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id: string
          is_active?: boolean
          name?: string
          phone?: string | null
          social_links?: Json | null
          specialization?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          social_links?: Json | null
          specialization?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      qa_answers: {
        Row: {
          body: string
          created_at: string
          id: string
          is_accepted: boolean
          question_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_accepted?: boolean
          question_id: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_accepted?: boolean
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "qa_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_questions: {
        Row: {
          body: string
          course_id: string | null
          created_at: string
          id: string
          is_answered: boolean
          title: string
          upvotes: number
          user_id: string
        }
        Insert: {
          body: string
          course_id?: string | null
          created_at?: string
          id?: string
          is_answered?: boolean
          title: string
          upvotes?: number
          user_id: string
        }
        Update: {
          body?: string
          course_id?: string | null
          created_at?: string
          id?: string
          is_answered?: boolean
          title?: string
          upvotes?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          attempted_at: string
          id: string
          passed: boolean
          quiz_id: string
          score: number
          student_id: string
        }
        Insert: {
          attempted_at?: string
          id?: string
          passed?: boolean
          quiz_id: string
          score?: number
          student_id: string
        }
        Update: {
          attempted_at?: string
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          id: string
          options: Json
          order: number
          question: string
          quiz_id: string
        }
        Insert: {
          correct_answer: string
          id?: string
          options?: Json
          order?: number
          question: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string
          id?: string
          options?: Json
          order?: number
          question?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          passing_score: number
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          passing_score?: number
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          passing_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          course_id: string
          created_at: string
          id: string
          rating: number
          student_id: string
        }
        Insert: {
          comment?: string | null
          course_id: string
          created_at?: string
          id?: string
          rating: number
          student_id: string
        }
        Update: {
          comment?: string | null
          course_id?: string
          created_at?: string
          id?: string
          rating?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          course_id: string
          created_at: string
          id: string
          order: number
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          order?: number
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value_ar: string
          value_en: string
          value_fr: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value_ar?: string
          value_en?: string
          value_fr?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value_ar?: string
          value_en?: string
          value_fr?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          course_id: string
          created_at: string
          id: string
          student_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          student_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_course_id_for_lesson: {
        Args: { _lesson_id: string }
        Returns: string
      }
      get_course_id_for_section: {
        Args: { _section_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_enrolled_in_course: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      is_instructor_of_course: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "instructor" | "admin" | "confirmation_agent"
      course_level: "beginner" | "intermediate" | "advanced"
      course_status: "draft" | "pending" | "published"
      discount_type: "percentage" | "fixed"
      lesson_type: "video" | "text" | "quiz"
      payment_status: "pending" | "paid" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "instructor", "admin", "confirmation_agent"],
      course_level: ["beginner", "intermediate", "advanced"],
      course_status: ["draft", "pending", "published"],
      discount_type: ["percentage", "fixed"],
      lesson_type: ["video", "text", "quiz"],
      payment_status: ["pending", "paid", "failed"],
    },
  },
} as const
