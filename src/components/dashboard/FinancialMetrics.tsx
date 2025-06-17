import { Card } from '@/components/ui/Card';

// Helper function to format currency
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

interface FinancialMetricsProps {
  income: number;
  expenses: number;
  netBalance: number;
  currency: string;
}

export default function FinancialMetrics({ income, expenses, netBalance, currency }: FinancialMetricsProps) {
  const savingsRate = income > 0 ? ((netBalance / income) * 100) : 0;
  const expenseRate = income > 0 ? ((expenses / income) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Income</h3>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
          {formatCurrency(income, currency)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {income > 0 ? 'Your monthly income' : 'No income recorded'}
        </p>
      </Card>
      <Card className="p-6 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Expenses</h3>
        <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
          {formatCurrency(expenses, currency)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {expenses > 0 ? `${expenseRate.toFixed(1)}% of your income` : 'No expenses recorded'}
        </p>
      </Card>
      <Card className="p-6 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Net Balance</h3>
        <p className={`text-2xl font-bold mt-2 ${
          netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {formatCurrency(netBalance, currency)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {netBalance >= 0 
            ? `You saved ${savingsRate.toFixed(1)}% of your income`
            : 'Your expenses exceed your income'}
        </p>
      </Card>
    </div>
  );
} 