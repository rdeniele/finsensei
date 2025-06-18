export interface Account {
  id: string;
  user_id: string;
  account_name: string;
  account_type: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  to_account_id: string | null;
  transaction_type: 'income' | 'expense' | 'transfer';
  source: string;
  amount: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface FinancialGoal {
  id: string;
  user_id: string;
  account_id: string | null;
  name: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  start_date: string;
  target_date: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface GoalContribution {
  id: string;
  goal_id: string;
  amount: number;
  contribution_date: string;
  notes: string | null;
  created_at: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      settings: {
        Row: {
          id: string
          email_notifications: boolean
          push_notifications: boolean
          two_factor_auth: boolean
          language: string
          timezone: string
          maintenance_mode: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email_notifications?: boolean
          push_notifications?: boolean
          two_factor_auth?: boolean
          language?: string
          timezone?: string
          maintenance_mode?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email_notifications?: boolean
          push_notifications?: boolean
          two_factor_auth?: boolean
          language?: string
          timezone?: string
          maintenance_mode?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 