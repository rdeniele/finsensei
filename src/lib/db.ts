import type { Account, Transaction } from './supabase';
import { supabase } from './supabase';

// Verify connection
async function verifyConnection() {
  try {
    const { data, error } = await supabase.from('accounts').select('count').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    return false;
  }
}

// Account CRUD operations
export async function getAccounts(userId: string): Promise<Account[]> {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    throw error;
  }
}

export async function createAccount(
  userId: string, 
  accountName: string, 
  balance: number, 
  accountType: string = 'checking', 
  currency: string = 'USD'
): Promise<Account> {
  try {
    // First, try to create with all columns
    let insertData: any = {
      user_id: userId,
      account_name: accountName,
      balance: balance
    };
    
    // Try to add the new columns if they exist
    try {
      insertData.account_type = accountType;
      insertData.currency = currency;
    } catch (e) {
      // New columns might not exist yet, creating with basic fields only
    }
    
    const { data, error } = await supabase
      .from('accounts')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      // If the error is about missing columns, try again without them
      if (error.message.includes('column') && (insertData.account_type || insertData.currency)) {
        const { data: retryData, error: retryError } = await supabase
          .from('accounts')
          .insert([{
            user_id: userId,
            account_name: accountName,
            balance: balance
          }])
          .select()
          .single();
          
        if (retryError) {
          throw new Error(`Database error: ${retryError.message}`);
        }
        
        if (!retryData) {
          throw new Error('No data returned from account creation');
        }
        
        return retryData;
      }
      
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from account creation');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateAccount(accountId: string, updates: Partial<Account>) {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', accountId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteAccount(accountId: string) {
  try {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', accountId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Transaction CRUD operations
export async function getTransactions(userId: string) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // Validate required fields
    if (!transaction.account_id || !transaction.amount || !transaction.transaction_type) {
      throw new Error('Missing required transaction fields');
    }
    
    // Validate amount
    if (transaction.amount <= 0) {
      throw new Error('Transaction amount must be positive');
    }
    
    // Get source account details
    const { data: sourceAccount, error: sourceError } = await supabase
      .from('accounts')
      .select('balance, currency')
      .eq('id', transaction.account_id)
      .single();

    if (sourceError) {
      throw new Error(`Failed to get source account: ${sourceError.message}`);
    }

    if (!sourceAccount) {
      throw new Error('Source account not found');
    }

    let newSourceBalance = Number(sourceAccount.balance);
    let destinationUpdates: { id: string; balance: number } | null = null;

    // Calculate balance changes based on transaction type
    if (transaction.transaction_type === 'income') {
      newSourceBalance += transaction.amount;
    } else if (transaction.transaction_type === 'expense') {
      if (newSourceBalance < transaction.amount) {
        throw new Error('Insufficient balance for this expense');
      }
      newSourceBalance -= transaction.amount;
    } else if (transaction.transaction_type === 'transfer') {
      if (!transaction.to_account_id) {
        throw new Error('Destination account is required for transfers');
      }
      
      if (newSourceBalance < transaction.amount) {
        throw new Error('Insufficient balance for this transfer');
      }

      // Get destination account
      const { data: destAccount, error: destError } = await supabase
        .from('accounts')
        .select('balance, currency')
        .eq('id', transaction.to_account_id)
        .single();

      if (destError) {
        throw new Error(`Failed to get destination account: ${destError.message}`);
      }

      if (!destAccount) {
        throw new Error('Destination account not found');
      }

      newSourceBalance -= transaction.amount;
      destinationUpdates = {
        id: transaction.to_account_id,
        balance: Number(destAccount.balance) + transaction.amount
      };
    }

    // Create transaction record
    const { data: newTransaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        ...transaction,
        user_id: userId
      }])
      .select()
      .single();

    if (transactionError) {
      throw new Error(`Failed to create transaction: ${transactionError.message}`);
    }

    // Update source account balance
    const { error: sourceUpdateError } = await supabase
      .from('accounts')
      .update({ balance: newSourceBalance })
      .eq('id', transaction.account_id);

    if (sourceUpdateError) {
      // Rollback transaction if balance update fails
      await supabase
        .from('transactions')
        .delete()
        .eq('id', newTransaction.id);
      throw new Error(`Failed to update source account balance: ${sourceUpdateError.message}`);
    }

    // Update destination account balance for transfers
    if (destinationUpdates) {
      const { error: destUpdateError } = await supabase
        .from('accounts')
        .update({ balance: destinationUpdates.balance })
        .eq('id', destinationUpdates.id);

      if (destUpdateError) {
        // Rollback transaction and source account update
        await supabase
          .from('transactions')
          .delete()
          .eq('id', newTransaction.id);
        await supabase
          .from('accounts')
          .update({ balance: sourceAccount.balance })
          .eq('id', transaction.account_id);
        throw new Error(`Failed to update destination account balance: ${destUpdateError.message}`);
      }
    }

    return { data: newTransaction, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}

export async function updateTransaction(transactionId: string, userId: string, updates: Partial<Transaction>) {
  try {
    // Get the original transaction first
    const { data: originalTransaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (fetchError) throw fetchError;

    // Get current account balance
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', originalTransaction.account_id)
      .single();

    if (accountError) throw accountError;

    // Calculate the net adjustment needed
    let currentBalance = Number(account.balance);
    
    // Revert original transaction effect
    if (originalTransaction.transaction_type === 'income') {
      currentBalance -= originalTransaction.amount; // Remove original income
    } else if (originalTransaction.transaction_type === 'expense') {
      currentBalance += originalTransaction.amount; // Add back original expense
    }
    
    // Apply new transaction effect
    if (updates.transaction_type === 'income') {
      currentBalance += updates.amount!;
    } else if (updates.transaction_type === 'expense') {
      if (currentBalance < updates.amount!) {
        throw new Error('Insufficient balance');
      }
      currentBalance -= updates.amount!;
    }

    // Update the transaction
    const { data: updatedTransaction, error: updateError } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', transactionId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update account balance with the final calculated balance
    const { error: finalUpdateError } = await supabase
      .from('accounts')
      .update({ balance: currentBalance })
      .eq('id', updates.account_id || originalTransaction.account_id);

    if (finalUpdateError) throw finalUpdateError;

    return { data: updatedTransaction, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteTransaction(transactionId: string, userId: string) {
  try {
    // Get the transaction first to know the amount and type
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (fetchError) throw fetchError;

    // Get current account balance
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', transaction.account_id)
      .single();

    if (accountError) throw accountError;

    // Calculate new balance
    const newBalance = Number(account.balance) - (transaction.transaction_type === 'income' ? transaction.amount : -transaction.amount);

    // Delete the transaction
    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    // Update account balance
    const { error: updateError } = await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', transaction.account_id);

    if (updateError) throw updateError;

    return { error: null };
  } catch (error) {
    return { error };
  }
}