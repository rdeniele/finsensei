import { GoogleGenerativeAI } from '@google/generative-ai';
import { Account, Transaction } from './supabase';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export interface FinancialData {
  accounts: Account[];
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  currency: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Helper function to format currency
function formatCurrency(amount: number, currency?: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD', // fallback to USD
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export async function fetchFinancialAdvice(data: FinancialData): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.');
    throw new Error('Gemini API key is not configured');
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const prompt = `
      Based on the following financial data (all amounts in ${data.currency}), provide a brief analysis and recommendations:
      
      Accounts:
      ${data.accounts.map(acc => `- ${acc.account_name}: ${formatCurrency(Number(acc.balance), data.currency)}`).join('\n')}
      
      Recent Transactions:
      ${data.transactions.slice(0, 5).map(t => 
        `- ${t.date}: ${t.transaction_type} of ${formatCurrency(Number(t.amount), data.currency)} for ${t.source}`
      ).join('\n')}
      
      Summary:
      - Total Income: ${formatCurrency(data.totalIncome, data.currency)}
      - Total Expenses: ${formatCurrency(data.totalExpenses, data.currency)}
      - Net Balance: ${formatCurrency(data.netBalance, data.currency)}
      
      Please provide:
      1. A brief analysis of the current financial situation
      2. 2-3 specific recommendations for improvement
      3. Tips for better financial management
      4. Any areas of concern that need attention
      
      Keep the response concise and actionable. All monetary values should be in ${data.currency}.
    `;

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log('Received response from Gemini API');
    return response.text();
  } catch (error) {
    console.error('Error in fetchFinancialAdvice:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to get financial advice: ${error.message}`);
    }
    throw new Error('Failed to get financial advice. Please try again later.');
  }
}

export async function sendChatMessage(messages: ChatMessage[], financialData: FinancialData): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.');
    throw new Error('Gemini API key is not configured');
  }

  try {
    console.log('Initializing Gemini API...');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // For the free version, we'll use a simpler approach without chat history
    const context = `
      You are a financial advisor assistant. Here is the user's current financial situation (all amounts in ${financialData.currency}):
      
      Accounts:
      ${financialData.accounts.map(acc => `- ${acc.account_name}: ${formatCurrency(Number(acc.balance), financialData.currency)}`).join('\n')}
      
      Recent Transactions:
      ${financialData.transactions.slice(0, 5).map(t => 
        `- ${t.date}: ${t.transaction_type} of ${formatCurrency(Number(t.amount), financialData.currency)} for ${t.source}`
      ).join('\n')}
      
      Summary:
      - Total Income: ${formatCurrency(financialData.totalIncome, financialData.currency)}
      - Total Expenses: ${formatCurrency(financialData.totalExpenses, financialData.currency)}
      - Net Balance: ${formatCurrency(financialData.netBalance, financialData.currency)}

      Previous conversation:
      ${messages.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}

      Please provide a helpful and concise response to the user's latest message. All monetary values should be in ${financialData.currency}.
    `;

    console.log('Sending message to Gemini API...');
    const result = await model.generateContent(context);
    const response = await result.response;
    console.log('Received response from Gemini API');
    return response.text();
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Gemini API key is not configured correctly. Please check your .env.local file.');
      }
      throw new Error(`Failed to get response: ${error.message}`);
    }
    throw new Error('Failed to get response. Please try again later.');
  }
} 