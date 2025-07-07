import { supabase } from '@/lib/supabase';
import type { FinancialGoal, GoalContribution } from '@/types/supabase';

export async function createGoal(
  userId: string,
  accountId: string,
  name: string,
  description: string,
  targetAmount: number,
  startDate: string,
  targetDate: string
): Promise<FinancialGoal | null> {
  const { data, error } = await supabase
    .from('financial_goals')
    .insert([
      {
        user_id: userId,
        account_id: accountId,
        name,
        description,
        target_amount: targetAmount,
        current_amount: 0,
        start_date: startDate,
        target_date: targetDate,
        status: 'active'
      }
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getGoals(userId: string): Promise<FinancialGoal[]> {
  const { data, error } = await supabase
    .from('financial_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function updateGoal(
  goalId: string,
  accountId: string,
  name: string,
  description: string,
  targetAmount: number,
  startDate: string,
  targetDate: string
): Promise<FinancialGoal | null> {
  const { data, error } = await supabase
    .from('financial_goals')
    .update({
      account_id: accountId,
      name,
      description,
      target_amount: targetAmount,
      start_date: startDate,
      target_date: targetDate
    })
    .eq('id', goalId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteGoal(goalId: string): Promise<boolean> {
  const { error } = await supabase
    .from('financial_goals')
    .delete()
    .eq('id', goalId);

  if (error) {
    throw error;
  }

  return true;
}

export async function addContribution(
  goalId: string,
  amount: number,
  contributionDate: string,
  notes: string
): Promise<GoalContribution | null> {
  try {
    // Validate inputs
    if (!goalId) {
      throw new Error('Goal ID is required');
    }
    if (!amount || amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (!contributionDate) {
      throw new Error('Contribution date is required');
    }

    // First, add the contribution record
    const contributionData = {
      goal_id: goalId,
      amount,
      contribution_date: contributionDate,
      notes: notes || ''
    };

    const { data: contribution, error: contributionError } = await supabase
      .from('goal_contributions')
      .insert([contributionData])
      .select()
      .single();

    if (contributionError) {
      throw new Error(`Failed to add contribution: ${contributionError.message}`);
    }

    // Then, update the goal's current amount
    const { error: updateError } = await supabase.rpc('update_goal_amount', {
      goal_id: goalId,
      contribution_amount: amount
    });

    if (updateError) {
      throw new Error(`Failed to update goal amount: ${updateError.message}`);
    }

    return contribution;
  } catch (error) {
    throw error;
  }
}

export async function getContributions(goalId: string): Promise<GoalContribution[]> {
  try {
    const { data, error } = await supabase
      .from('goal_contributions')
      .select('*')
      .eq('goal_id', goalId)
      .order('contribution_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    return [];
  }
} 