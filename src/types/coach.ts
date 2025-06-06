// filepath: finsensei/frontend/src/types/coach.ts
export interface FinancialAdvice {
  id: string;
  advice: string;
  category: string;
  createdAt: string;
}

export interface CoachResponse {
  success: boolean;
  data: FinancialAdvice[];
  message?: string;
}

export interface Advice {
  content: string;
  timestamp: string;
}