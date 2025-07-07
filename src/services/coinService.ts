import { supabase } from '@/lib/supabase';
import type { CoinPurchase, CoinTransaction, UserCoinBalance, DailyRefreshStatus } from '@/types/coin';

export const coinService = {
  // Get user's coin balance
  async getUserCoins(userId: string): Promise<UserCoinBalance> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_coins', { user_uuid: userId });

      if (error) throw error;

      const coins = data || 0;
      const chats_remaining = Math.floor(coins / 20);

      return {
        coins,
        chats_remaining
      };
    } catch (error) {
      throw new Error('Failed to get coin balance');
    }
  },

  // Create a coin purchase request
  async createCoinPurchase(
    userId: string,
    userEmail: string,
    userName: string,
    planType: 'bronze' | 'silver' | 'gold',
    coinsAmount: number,
    priceUsd: number
  ): Promise<CoinPurchase> {
    try {
      const { data, error } = await supabase
        .from('coin_purchases')
        .insert([
          {
            user_id: userId,
            user_email: userEmail,
            user_name: userName,
            plan_type: planType,
            coins_amount: coinsAmount,
            price_usd: priceUsd,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Failed to create coin purchase');
    }
  },

  // Get user's coin purchases
  async getUserCoinPurchases(userId: string): Promise<CoinPurchase[]> {
    try {
      const { data, error } = await supabase
        .from('coin_purchases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error('Failed to get coin purchases');
    }
  },

  // Get user's coin transactions
  async getUserCoinTransactions(userId: string): Promise<CoinTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error('Failed to get coin transactions');
    }
  },

  // Use coins for chat (deduct 20 coins)
  async useCoinsForChat(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('use_coins_for_chat', { user_uuid: userId, coins_to_deduct: 20 });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Failed to use coins for chat');
    }
  },

  // Check if user has enough coins for chat
  async hasEnoughCoinsForChat(userId: string): Promise<boolean> {
    try {
      const balance = await this.getUserCoins(userId);
      return balance.coins >= 20;
    } catch (error) {
      return false;
    }
  },

  // Admin: Get all pending coin purchases
  async getPendingCoinPurchases(): Promise<CoinPurchase[]> {
    try {
      const { data, error } = await supabase
        .from('coin_purchases')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error('Failed to get pending coin purchases');
    }
  },

  // Admin: Complete a coin purchase
  async completeCoinPurchase(purchaseId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('complete_coin_purchase', { purchase_id: purchaseId });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Failed to complete coin purchase');
    }
  },

  // Admin: Update coin purchase status
  async updateCoinPurchaseStatus(
    purchaseId: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
    adminNotes?: string
  ): Promise<CoinPurchase> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      const { data, error } = await supabase
        .from('coin_purchases')
        .update(updateData)
        .eq('id', purchaseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Failed to update coin purchase status');
    }
  },

  // Get all coin purchases (admin only)
  async getAllCoinPurchases(): Promise<CoinPurchase[]> {
    try {
      const { data, error } = await supabase
        .from('coin_purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return [];
    }
  },

  // Get all coin transactions (admin only)
  async getAllCoinTransactions(): Promise<CoinTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('coin_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return [];
    }
  }
};

export const getDailyRefreshStatus = async (): Promise<DailyRefreshStatus | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .rpc('get_daily_refresh_status', { user_uuid: user.id });

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
};

export const refreshDailyCoins = async (): Promise<number | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .rpc('check_and_refresh_daily_coins', { user_uuid: user.id });

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
};

export const refreshDailyCoinsForAllUsers = async (): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .rpc('refresh_daily_coins_for_all_users');

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}; 