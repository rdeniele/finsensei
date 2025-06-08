import { createBrowserClient } from '@supabase/ssr';
import type { Account, Transaction } from './supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Create Supabase client with retry logic
const createSupabaseClient = () => {
  try {
    const client = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return client;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw new Error('Failed to initialize database connection');
  }
};

const supabase = createSupabaseClient();

// Verify connection
async function verifyConnection() {
  try {
    const { data, error } = await supabase.from('accounts').select('count').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Account CRUD operations
export async function getAccounts(userId: string) {
  try {
    // Verify connection first
    const isConnected = await verifyConnection();
    if (!isConnected) {
      throw new Error('Unable to connect to database');
    }

    console.log('Fetching accounts for user:', userId);
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching accounts:', error);
      throw error;
    }

    console.log('Accounts fetched successfully:', data);
    return { data, error: null };
  } catch (error: any) {
    console.error('Error fetching accounts:', error);
    return { 
      data: null, 
      error: error.message || 'Failed to fetch accounts. Please try again.' 
    };
  }
}

export async function createAccount(userId: string, accountName: string, balance: number) {
  try {
    // Verify connection first
    const isConnected = await verifyConnection();
    if (!isConnected) {
      throw new Error('Unable to connect to database');
    }

    console.log('Creating account with:', { userId, accountName, balance });
    
    // Validate inputs
    if (!userId) throw new Error('User ID is required');
    if (!accountName) throw new Error('Account name is required');
    if (isNaN(balance)) throw new Error('Invalid balance amount');

    const { data, error } = await supabase
      .from('accounts')
      .insert([
        {
          user_id: userId,
          account_name: accountName,
          balance: balance,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating account:', error);
      throw error;
    }

    console.log('Account created successfully:', data);
    return { data, error: null };
  } catch (error: any) {
    console.error('Error creating account:', error);
    return { 
      data: null, 
      error: error.message || 'Failed to create account. Please try again.' 
    };
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
    console.error('Error updating account:', error);
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
    console.error('Error deleting account:', error);
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
    console.error('Error fetching transactions:', error);
    return { data: null, error };
  }
}

export async function createTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // Start a transaction
    const { data: newTransaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Get current account balance
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', transaction.account_id)
      .single();

    if (accountError) throw accountError;

    // Calculate new balance based on transaction type
    let newBalance = Number(account.balance);
    if (transaction.transaction_type === 'income') {
      newBalance += transaction.amount;
    } else if (transaction.transaction_type === 'expense') {
      if (newBalance < transaction.amount) {
        throw new Error('Insufficient balance');
      }
      newBalance -= transaction.amount;
    } else if (transaction.transaction_type === 'transfer') {
      if (!transaction.to_account_id) {
        throw new Error('Destination account is required for transfer');
      }
      if (newBalance < transaction.amount) {
        throw new Error('Insufficient balance for transfer');
      }

      // Get destination account
      const { data: toAccount, error: toAccountError } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', transaction.to_account_id)
        .single();

      if (toAccountError) throw toAccountError;

      // Update source account balance
      const { error: updateSourceError } = await supabase
        .from('accounts')
        .update({ balance: newBalance - transaction.amount })
        .eq('id', transaction.account_id);

      if (updateSourceError) throw updateSourceError;

      // Update destination account balance
      const { error: updateDestError } = await supabase
        .from('accounts')
        .update({ balance: Number(toAccount.balance) + transaction.amount })
        .eq('id', transaction.to_account_id);

      if (updateDestError) throw updateDestError;

      return { data: newTransaction, error: null };
    }

    // Update account balance for income/expense
    const { error: updateError } = await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', transaction.account_id);

    if (updateError) throw updateError;

    return { data: newTransaction, error: null };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { data: null, error };
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
    console.error('Error updating transaction:', error);
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
    console.error('Error deleting transaction:', error);
    return { error };
  }
}