export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  organization?: string;
  job_title?: string;
  experience_level?: string;
  languages?: string[];
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  total_practice_time: number;
  scenarios_completed: number;
  average_score: number;
  streak_days: number;
  last_practice_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  session_type: 'scenario' | 'warmup' | 'drill' | 'baseline';
  scenario_id?: string;
  duration: number;
  pitch_score?: number;
  pace_score?: number;
  volume_score?: number;
  overall_score?: number;
  notes?: string;
  completed_at: string;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  badge_name: string;
  badge_description?: string;
  earned_at: string;
}

export interface BaselineAssessment {
  id: string;
  user_id: string;
  pitch_baseline: number;
  pace_baseline: number;
  volume_baseline: number;
  tone_profile?: string;
  strengths?: string[];
  areas_for_improvement?: string[];
  completed_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface Scenario {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  description: string;
  image?: string;
  context: string;
  rolePrompt: string;
}

export interface Expert {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  bio: string;
  image?: string;
  audioUrl?: string;
  tip: string;
}

export interface VocalMetrics {
  pitch: number;
  pace: number;
  volume: number;
}
