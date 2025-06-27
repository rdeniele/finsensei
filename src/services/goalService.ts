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
    console.error('Error creating goal:', error);
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
    console.error('Error fetching goals:', error);
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
    console.error('Error updating goal:', error);
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
    console.error('Error deleting goal:', error);
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

    console.log('Adding contribution with data:', {
      goalId,
      amount,
      contributionDate,
      notes
    });

    // First, add the contribution record
    const contributionData = {
      goal_id: goalId,
      amount,
      contribution_date: contributionDate,
      notes: notes || ''
    };

    console.log('Inserting contribution data:', contributionData);

    const { data: contribution, error: contributionError } = await supabase
      .from('goal_contributions')
      .insert([contributionData])
      .select()
      .single();

    if (contributionError) {
      console.error('Error adding contribution record:', contributionError);
      console.error('Error details:', {
        code: contributionError.code,
        message: contributionError.message,
        details: contributionError.details,
        hint: contributionError.hint
      });
      throw new Error(`Failed to add contribution: ${contributionError.message}`);
    }

    console.log('Contribution added successfully:', contribution);

    // Then, update the goal's current amount
    console.log('Updating goal amount for goal:', goalId, 'with amount:', amount);
    
    const { error: updateError } = await supabase.rpc('update_goal_amount', {
      goal_id: goalId,
      contribution_amount: amount
    });

    if (updateError) {
      console.error('Error updating goal amount:', updateError);
      console.error('Update error details:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint
      });
      throw new Error(`Failed to update goal amount: ${updateError.message}`);
    }

    console.log('Goal amount updated successfully');

    return contribution;
  } catch (error) {
    console.error('Error in addContribution:', error);
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
    console.error('Error fetching contributions:', error);
    return [];
  }
} 