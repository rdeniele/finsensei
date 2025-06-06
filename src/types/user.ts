export interface UserData {
  id: number;
  name: string;
  email: string;
  currency?: string;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  name: string;
  email: string;
  currency?: string;
} 