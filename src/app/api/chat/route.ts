import { NextRequest, NextResponse } from 'next/server';
import { sendChatMessage } from '@/services/gemini';

export async function POST(request: NextRequest) {
  try {
    const { message, context, history } = await request.json();

    // Prepare financial data from context
    const financialData = {
      accounts: context.accounts || [],
      transactions: context.recentTransactions || [],
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
      currency: 'USD'
    };

    // Calculate financial metrics
    financialData.totalIncome = financialData.transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    financialData.totalExpenses = financialData.transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + Math.abs(Number(t.amount)), 0);

    financialData.netBalance = financialData.accounts
      .reduce((sum: number, account: any) => sum + Number(account.balance), 0);

    // Prepare chat messages
    const messages = [
      ...history,
      { role: 'user' as const, content: message }
    ];

    // Use the existing chat service
    const response = await sendChatMessage(messages, financialData);

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 