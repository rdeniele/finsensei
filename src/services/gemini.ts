import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Account } from '@/lib/supabase';
import type { Transaction } from '@/lib/supabase';

interface FinancialData {
  accounts: Account[];
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  currency: string;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function fetchFinancialAdvice(userFinancialData?: FinancialData): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a professional financial advisor. Based on the client's current financial data (all values in ${userFinancialData?.currency || 'USD'}), perform a concise and insightful financial analysis.

### Account Balances:
${userFinancialData?.accounts.map((acc: Account) => `- ${acc.account_name}: ${formatCurrency(Number(acc.balance), userFinancialData.currency)}`).join('\n') || 'No accounts found'}

### Recent Transactions (latest 5):
${userFinancialData?.transactions.slice(0, 5).map((t: Transaction) => 
  `- ${t.date}: ${t.transaction_type} of ${formatCurrency(Number(t.amount), userFinancialData.currency)} for ${t.source}`
).join('\n') || 'No recent transactions'}

### Summary:
- Total Income: ${formatCurrency(userFinancialData?.totalIncome || 0, userFinancialData?.currency || 'USD')}
- Total Expenses: ${formatCurrency(userFinancialData?.totalExpenses || 0, userFinancialData?.currency || 'USD')}
- Net Balance: ${formatCurrency(userFinancialData?.netBalance || 0, userFinancialData?.currency || 'USD')}

---

Based on this information, provide the following:

1. **Current Financial Analysis**: A brief overview of the client's financial health.
2. **Actionable Recommendations**: 2–3 specific and practical steps to improve finances.
3. **Smart Money Tips**: General guidance for better financial habits or systems.
4. **Red Flags or Concerns**: Highlight any issues or areas that need urgent attention.

Be concise, professional, and insightful. Tailor your advice to the numbers provided. Always refer to amounts in ${userFinancialData?.currency || 'USD'}.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get financial advice');
  }
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}