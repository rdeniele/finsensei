import { fetchFinancialAdvice } from '@/services/gemini';
import type { Account, Transaction } from '@/types/supabase';
import type { LearningTip } from '@/services/gemini';

interface FinancialData {
  accounts: Account[];
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  currency: string;
}

export async function getFinancialAdvice(accounts: Account[], transactions: Transaction[], currency: string = 'USD'): Promise<LearningTip[]> {
  try {
    const totalIncome = transactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

    const financialData: FinancialData = {
      accounts,
      transactions,
      totalIncome,
      totalExpenses,
      netBalance,
      currency
    };
    return await fetchFinancialAdvice(financialData);
  } catch (error) {
    console.error('Error getting financial advice:', error);
    throw new Error('Failed to get financial advice');
  }
}

export async function getChatResponse(messages: { role: 'user' | 'assistant'; content: string }[], accounts: Account[], transactions: Transaction[], currency: string = 'USD'): Promise<LearningTip[]> {
  try {
    const totalIncome = transactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

    const financialData: FinancialData = {
      accounts,
      transactions,
      totalIncome,
      totalExpenses,
      netBalance,
      currency
    };
    return await fetchFinancialAdvice(financialData);
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw new Error('Failed to get chat response');
  }
}

export async function getTransactionInsights(transactions: Transaction[], currency: string = 'USD'): Promise<LearningTip[]> {
  try {
    const totalIncome = transactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const financialData: FinancialData = {
      accounts: [],
      transactions,
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      currency
    };
    return await fetchFinancialAdvice(financialData);
  } catch (error) {
    console.error('Error getting transaction insights:', error);
    throw new Error('Failed to get transaction insights');
  }
}

export async function getAccountInsights(accounts: Account[], transactions: Transaction[], currency: string = 'USD'): Promise<LearningTip[]> {
  try {
    const totalIncome = transactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

    const financialData: FinancialData = {
      accounts,
      transactions,
      totalIncome,
      totalExpenses,
      netBalance,
      currency
    };
    return await fetchFinancialAdvice(financialData);
  } catch (error) {
    console.error('Error getting account insights:', error);
    throw new Error('Failed to get account insights');
  }
}

export async function getBudgetRecommendations(accounts: Account[], transactions: Transaction[], currency: string = 'USD'): Promise<LearningTip[]> {
  try {
    const totalIncome = transactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

    const financialData: FinancialData = {
      accounts,
      transactions,
      totalIncome,
      totalExpenses,
      netBalance,
      currency
    };
    return await fetchFinancialAdvice(financialData);
  } catch (error) {
    console.error('Error getting budget recommendations:', error);
    throw new Error('Failed to get budget recommendations');
  }
}