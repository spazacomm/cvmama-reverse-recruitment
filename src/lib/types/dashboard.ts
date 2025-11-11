// src/lib/types/dashboard.ts
export interface CandidateDashboard {
    candidate_id: string;
    user_id: string;
    full_name: string;
    career_stage: string;
    created_at: string;
    
    // Match Info
    match_id: string | null;
    agent_name: string | null;
    agent_avatar: string | null;
    agent_specializations: string[] | null;
    agent_years_experience: number | null;
    
    // Subscription Info
    subscription_id: string | null;
    plan_name: string | null;
    subscription_status: string | null;
    current_period_end: string | null;
    jobs_used: number | null;
    jobs_limit: number | null;
    agent_hours_used: number | null;
    agent_hours_limit: number | null;
    
    // Stats
    saved_jobs: number;
    delegated_jobs: number;
    applied_jobs: number;
    interviewing_jobs: number;
    unread_messages: number;
  }
  
  export interface RecentActivity {
    id: string;
    activity_type: string;
    description: string;
    performed_by_role: string;
    metadata: any;
    created_at: string;
  }
  
  export interface RecentMessage {
    id: string;
    sender_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
    sender_name: string;
    sender_avatar: string;
  }
  
  export interface Document {
    id: string;
    file_name: string;
    document_type: string;
    file_size: number;
    is_shared_with_agent: boolean;
    created_at: string;
  }