import { fetchFinancialAdvice } from './gemini';

export async function getFinancialAdvice(accounts: any[], transactions: any[]) {
  try {
    const financialData = {
      accounts,
      transactions
    };
    return await fetchFinancialAdvice(financialData);
  } catch (error) {
    console.error('Error getting financial advice:', error);
    throw new Error('Failed to get financial advice');
  }
}

export async function getTransactionInsights(transactions: any[]) {
  try {
    const financialData = {
      transactions
    };
    return await fetchFinancialAdvice(financialData);
  } catch (error) {
    console.error('Error getting transaction insights:', error);
    throw new Error('Failed to get transaction insights');
  }
}

export async function getBudgetRecommendations(accounts: any[], transactions: any[]) {
  try {
    const financialData = {
      accounts,
      transactions
    };
    return await fetchFinancialAdvice(financialData);
  } catch (error) {
    console.error('Error getting budget recommendations:', error);
    throw new Error('Failed to get budget recommendations');
  }
}