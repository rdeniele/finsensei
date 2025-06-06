// Use relative URLs for API calls
const API_BASE_URL = '/api';

// Define interface types for API requests and responses
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  name: string;
  email: string;
}

export interface ErrorResponse {
  error: string;
}

export interface Account {
  id: number;
  account_name: string;
  balance: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  account: number;
  account_name: string;
  transaction_type: 'income' | 'expense' | 'transfer';
  source: string;
  amount: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Advice {
  content: string;
  timestamp: string;
}

export const api = {
  // Auth
  signup: async (data: SignupRequest): Promise<AuthResponse | ErrorResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  signin: async (data: SigninRequest): Promise<AuthResponse | ErrorResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signin/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Accounts
  getAccounts: async (token: string): Promise<Account[]> => {
    const response = await fetch(`${API_BASE_URL}/accounts/`, {
      headers: { 'Authorization': `Token ${token}` }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw 'Unauthorized';
      }
      throw new Error('Failed to fetch accounts');
    }
    
    return response.json();
  },

  createAccount: async (token: string, accountData: { account_name: string; balance: number }): Promise<Account> => {
    const response = await fetch(`${API_BASE_URL}/accounts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw 'Unauthorized';
      }
      throw new Error('Failed to create account');
    }

    return response.json();
  },

  updateAccount: async (token: string, accountId: number, accountData: { account_name: string; balance: number }): Promise<Account> => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw 'Unauthorized';
      }
      throw new Error('Failed to update account');
    }

    return response.json();
  },

  deleteAccount: async (token: string, accountId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw 'Unauthorized';
      }
      throw new Error('Failed to delete account');
    }
  },
  
  // Transactions
  getTransactions: async (token: string): Promise<Transaction[]> => {
    const response = await fetch(`${API_BASE_URL}/transactions/`, {
      headers: { 'Authorization': `Token ${token}` }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw 'Unauthorized';
      }
      throw new Error('Failed to fetch transactions');
    }
    
    return response.json();
  },

  createTransaction: async (token: string, transactionData: {
    account: number;
    transaction_type: 'income' | 'expense' | 'transfer';
    source: string;
    amount: number;
    date: string;
  }): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/transactions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw 'Unauthorized';
      }
      throw new Error('Failed to create transaction');
    }

    return response.json();
  },

  updateTransaction: async (token: string, transactionId: number, transactionData: {
    account: number;
    transaction_type: 'income' | 'expense' | 'transfer';
    source: string;
    amount: number;
    date: string;
  }): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw 'Unauthorized';
      }
      throw new Error('Failed to update transaction');
    }

    return response.json();
  },

  deleteTransaction: async (token: string, transactionId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw 'Unauthorized';
      }
      throw new Error('Failed to delete transaction');
    }
  },

  getFinancialAdvice: async (token: string): Promise<Response> => {
    return fetch(`${API_BASE_URL}/coach/advice/`, {
      headers: { 'Authorization': `Token ${token}` }
    });
  }
};