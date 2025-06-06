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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-600">Total Income</h3>
        <p className="text-2xl font-bold text-green-600 mt-2">
          {formatCurrency(income, currency)}
        </p>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-600">Total Expenses</h3>
        <p className="text-2xl font-bold text-red-600 mt-2">
          {formatCurrency(expenses, currency)}
        </p>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-600">Net Balance</h3>
        <p className={`text-2xl font-bold mt-2 ${
          netBalance >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatCurrency(netBalance, currency)}
        </p>
      </Card>
    </div>
  );
} 