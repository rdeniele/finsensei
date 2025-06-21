export interface CoinPurchase {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  plan_type: 'bronze' | 'silver' | 'gold';
  coins_amount: number;
  price_usd: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_method?: string;
  payment_reference?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CoinTransaction {
  id: string;
  user_id: string;
  transaction_type: 'purchase' | 'usage' | 'refund' | 'bonus';
  coins_amount: number;
  description: string;
  reference_id?: string;
  created_at: string;
}

export interface CoinPlan {
  id: 'bronze' | 'silver' | 'gold';
  name: string;
  coins: number;
  chats: number;
  price_usd: number;
  price_per_chat: number;
  description: string;
  features: string[];
}

export const COIN_PLANS: CoinPlan[] = [
  {
    id: 'bronze',
    name: 'Bronze Plan',
    coins: 5000,
    chats: 250,
    price_usd: 5,
    price_per_chat: 0.02,
    description: 'Perfect for getting started with financial coaching',
    features: [
      '250 AI coaching sessions',
      'Basic financial insights',
      'Email support'
    ]
  },
  {
    id: 'silver',
    name: 'Silver Plan',
    coins: 10000,
    chats: 500,
    price_usd: 10,
    price_per_chat: 0.02,
    description: 'Great value for regular users',
    features: [
      '500 AI coaching sessions',
      'Advanced financial insights',
      'Priority email support',
      'Custom financial reports'
    ]
  },
  {
    id: 'gold',
    name: 'Gold Plan',
    coins: 30000,
    chats: 1500,
    price_usd: 25,
    price_per_chat: 0.016,
    description: 'Best value for power users',
    features: [
      '1500 AI coaching sessions',
      'Premium financial insights',
      'Priority support',
      'Custom financial reports',
      'Exclusive financial tools'
    ]
  }
];

export interface UserCoinBalance {
  coins: number;
  chats_remaining: number;
}

export interface DailyRefreshStatus {
  coins: number;
  last_refresh: string | null;
  can_refresh: boolean;
  next_refresh: string | null;
} 