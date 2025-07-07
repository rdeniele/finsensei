import type { Transaction, Account } from '@/types/supabase';

export interface TransactionValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: TransactionValidationError[];
}

export class TransactionValidator {
  static validateAmount(amount: number): TransactionValidationError[] {
    const errors: TransactionValidationError[] = [];
    
    if (amount === undefined || amount === null) {
      errors.push({ field: 'amount', message: 'Amount is required' });
    } else if (isNaN(amount)) {
      errors.push({ field: 'amount', message: 'Amount must be a valid number' });
    } else if (amount <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be greater than zero' });
    } else if (amount > 999999999.99) {
      errors.push({ field: 'amount', message: 'Amount is too large' });
    }
    
    return errors;
  }

  static validateAccount(accountId: string, accounts: Account[]): TransactionValidationError[] {
    const errors: TransactionValidationError[] = [];
    
    if (!accountId) {
      errors.push({ field: 'account_id', message: 'Account is required' });
    } else if (!accounts.find(account => account.id === accountId)) {
      errors.push({ field: 'account_id', message: 'Selected account does not exist' });
    }
    
    return errors;
  }

  static validateTransactionType(type: string): TransactionValidationError[] {
    const errors: TransactionValidationError[] = [];
    const validTypes = ['income', 'expense', 'transfer'];
    
    if (!type) {
      errors.push({ field: 'transaction_type', message: 'Transaction type is required' });
    } else if (!validTypes.includes(type)) {
      errors.push({ field: 'transaction_type', message: 'Invalid transaction type' });
    }
    
    return errors;
  }

  static validateSource(source: string): TransactionValidationError[] {
    const errors: TransactionValidationError[] = [];
    
    if (!source || !source.trim()) {
      errors.push({ field: 'source', message: 'Transaction description is required' });
    } else if (source.length > 200) {
      errors.push({ field: 'source', message: 'Description is too long (max 200 characters)' });
    }
    
    return errors;
  }

  static validateDate(date: string): TransactionValidationError[] {
    const errors: TransactionValidationError[] = [];
    
    if (!date) {
      errors.push({ field: 'date', message: 'Date is required' });
    } else {
      const transactionDate = new Date(date);
      const today = new Date();
      
      if (isNaN(transactionDate.getTime())) {
        errors.push({ field: 'date', message: 'Invalid date format' });
      } else if (transactionDate > today) {
        errors.push({ field: 'date', message: 'Transaction date cannot be in the future' });
      }
    }
    
    return errors;
  }

  static validateBalance(
    amount: number,
    transactionType: string,
    sourceAccount: Account,
    destinationAccount?: Account
  ): TransactionValidationError[] {
    const errors: TransactionValidationError[] = [];
    
    if (transactionType === 'expense' || transactionType === 'transfer') {
      if (sourceAccount.balance < amount) {
        errors.push({ 
          field: 'amount', 
          message: `Insufficient balance. Available: ${sourceAccount.balance.toFixed(2)}` 
        });
      }
    }
    
    if (transactionType === 'transfer' && !destinationAccount) {
      errors.push({ field: 'to_account_id', message: 'Destination account is required for transfers' });
    }
    
    return errors;
  }

  static validateTransfer(
    sourceAccountId: string,
    destinationAccountId: string | null,
    accounts: Account[]
  ): TransactionValidationError[] {
    const errors: TransactionValidationError[] = [];
    
    if (!destinationAccountId) {
      errors.push({ field: 'to_account_id', message: 'Destination account is required for transfers' });
      return errors;
    }
    
    if (sourceAccountId === destinationAccountId) {
      errors.push({ field: 'to_account_id', message: 'Source and destination accounts cannot be the same' });
    }
    
    const destAccount = accounts.find(account => account.id === destinationAccountId);
    if (!destAccount) {
      errors.push({ field: 'to_account_id', message: 'Destination account does not exist' });
    }
    
    return errors;
  }

  static validateTransaction(
    transaction: Partial<Transaction>,
    accounts: Account[]
  ): ValidationResult {
    const errors: TransactionValidationError[] = [];
    
    // Validate all fields
    errors.push(...this.validateAmount(transaction.amount || 0));
    errors.push(...this.validateAccount(transaction.account_id || '', accounts));
    errors.push(...this.validateTransactionType(transaction.transaction_type || ''));
    errors.push(...this.validateSource(transaction.source || ''));
    errors.push(...this.validateDate(transaction.date || ''));
    
    // Find source account for balance validation
    const sourceAccount = accounts.find(account => account.id === transaction.account_id);
    if (sourceAccount && transaction.amount && transaction.transaction_type) {
      const destinationAccount = transaction.to_account_id 
        ? accounts.find(account => account.id === transaction.to_account_id)
        : undefined;
      
      errors.push(...this.validateBalance(
        transaction.amount,
        transaction.transaction_type,
        sourceAccount,
        destinationAccount
      ));
    }
    
    // Validate transfer-specific rules
    if (transaction.transaction_type === 'transfer') {
      errors.push(...this.validateTransfer(
        transaction.account_id || '',
        transaction.to_account_id || null,
        accounts
      ));
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getErrorMessage(errors: TransactionValidationError[]): string {
    if (errors.length === 0) return '';
    if (errors.length === 1) return errors[0].message;
    return `Multiple errors: ${errors.map(e => e.message).join(', ')}`;
  }
}

export default TransactionValidator;
