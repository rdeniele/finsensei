import { createTransaction, updateTransaction, deleteTransaction, getTransactions, getAccounts } from '@/lib/db';
import { TransactionValidator } from '@/lib/validation/transactionValidator';
import type { Transaction, Account } from '@/types/supabase';

export interface TransactionService {
  createTransaction: (userId: string, transaction: Partial<Transaction>) => Promise<{ data: Transaction | null; error: string | null }>;
  updateTransaction: (transactionId: string, userId: string, updates: Partial<Transaction>) => Promise<{ data: Transaction | null; error: string | null }>;
  deleteTransaction: (transactionId: string, userId: string) => Promise<{ error: string | null }>;
  getTransactions: (userId: string) => Promise<{ data: Transaction[] | null; error: string | null }>;
  validateTransaction: (transaction: Partial<Transaction>, accounts: Account[]) => Promise<{ isValid: boolean; errors: string[] }>;
}

class FinancialTransactionService implements TransactionService {
  
  async createTransaction(userId: string, transaction: Partial<Transaction>): Promise<{ data: Transaction | null; error: string | null }> {
    try {
      // Get user's accounts for validation
      const accounts = await getAccounts(userId);
      if (!accounts) {
        return { data: null, error: 'Unable to load accounts for validation' };
      }

      // Validate transaction
      const validation = TransactionValidator.validateTransaction(transaction, accounts);
      if (!validation.isValid) {
        return { data: null, error: TransactionValidator.getErrorMessage(validation.errors) };
      }

      // Create the transaction
      const result = await createTransaction(userId, {
        user_id: userId,
        account_id: transaction.account_id!,
        to_account_id: transaction.to_account_id || null,
        transaction_type: transaction.transaction_type! as 'income' | 'expense' | 'transfer',
        source: transaction.source!,
        amount: transaction.amount!,
        date: transaction.date!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Omit<Transaction, 'id'>);

      if (result.error) {
        return { data: null, error: result.error.message || 'Failed to create transaction' };
      }

      return { data: result.data, error: null };
    } catch (error) {
      console.error('TransactionService.createTransaction error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  async updateTransaction(transactionId: string, userId: string, updates: Partial<Transaction>): Promise<{ data: Transaction | null; error: string | null }> {
    try {
      // Get user's accounts for validation
      const accounts = await getAccounts(userId);
      if (!accounts) {
        return { data: null, error: 'Unable to load accounts for validation' };
      }

      // Validate updated transaction
      const validation = TransactionValidator.validateTransaction(updates, accounts);
      if (!validation.isValid) {
        return { data: null, error: TransactionValidator.getErrorMessage(validation.errors) };
      }

      // Update the transaction
      const result = await updateTransaction(transactionId, userId, updates);

      if (result.error) {
        const errorMessage = typeof result.error === 'object' && result.error && 'message' in result.error
          ? (result.error as any).message
          : 'Failed to update transaction';
        return { data: null, error: errorMessage };
      }

      return { data: result.data, error: null };
    } catch (error) {
      console.error('TransactionService.updateTransaction error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  async deleteTransaction(transactionId: string, userId: string): Promise<{ error: string | null }> {
    try {
      const result = await deleteTransaction(transactionId, userId);

      if (result.error) {
        const errorMessage = typeof result.error === 'object' && result.error && 'message' in result.error
          ? (result.error as any).message
          : 'Failed to delete transaction';
        return { error: errorMessage };
      }

      return { error: null };
    } catch (error) {
      console.error('TransactionService.deleteTransaction error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  async getTransactions(userId: string): Promise<{ data: Transaction[] | null; error: string | null }> {
    try {
      const result = await getTransactions(userId);

      if (result.error) {
        const errorMessage = typeof result.error === 'object' && result.error && 'message' in result.error
          ? (result.error as any).message
          : 'Failed to fetch transactions';
        return { data: null, error: errorMessage };
      }

      return { data: result.data, error: null };
    } catch (error) {
      console.error('TransactionService.getTransactions error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  async validateTransaction(transaction: Partial<Transaction>, accounts: Account[]): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const validation = TransactionValidator.validateTransaction(transaction, accounts);
      return {
        isValid: validation.isValid,
        errors: validation.errors.map(e => e.message)
      };
    } catch (error) {
      console.error('TransactionService.validateTransaction error:', error);
      return {
        isValid: false,
        errors: ['Validation failed due to an unexpected error']
      };
    }
  }
}

// Export singleton instance
export const transactionService = new FinancialTransactionService();
export default transactionService;
