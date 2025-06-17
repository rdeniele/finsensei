import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface FinancialChartProps {
  labels: string[];
  incomeData: number[];
  expenseData: number[];
  accounts: { account_name: string; balance: number }[];
  transactions: { source: string; amount: number; transaction_type: string }[];
}

type ChartType = 'line' | 'accounts' | 'expenses' | 'income';

export default function FinancialChart({ labels, incomeData, expenseData, accounts, transactions }: FinancialChartProps) {
  const [currentChart, setCurrentChart] = useState<ChartType>('line');

  // Prepare data for different chart types
  const lineData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  const accountsData = {
    labels: accounts.map(acc => acc.account_name),
    datasets: [{
      data: accounts.map(acc => acc.balance),
      backgroundColor: [
        'rgba(34, 197, 94, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(168, 85, 247, 0.7)',
        'rgba(236, 72, 153, 0.7)',
        'rgba(234, 179, 8, 0.7)',
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(59, 130, 246)',
        'rgb(168, 85, 247)',
        'rgb(236, 72, 153)',
        'rgb(234, 179, 8)',
      ],
      borderWidth: 1,
    }],
  };

  // Group transactions by source
  const expenseSources = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((acc, t) => {
      acc[t.source] = (acc[t.source] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomeSources = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((acc, t) => {
      acc[t.source] = (acc[t.source] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const expensesData = {
    labels: Object.keys(expenseSources),
    datasets: [{
      data: Object.values(expenseSources),
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(249, 115, 22, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(34, 197, 94, 0.7)',
        'rgba(59, 130, 246, 0.7)',
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(249, 115, 22)',
        'rgb(234, 179, 8)',
        'rgb(34, 197, 94)',
        'rgb(59, 130, 246)',
      ],
      borderWidth: 1,
    }],
  };

  const incomeSourcesData = {
    labels: Object.keys(incomeSources),
    datasets: [{
      data: Object.values(incomeSources),
      backgroundColor: [
        'rgba(34, 197, 94, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(168, 85, 247, 0.7)',
        'rgba(236, 72, 153, 0.7)',
        'rgba(234, 179, 8, 0.7)',
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(59, 130, 246)',
        'rgb(168, 85, 247)',
        'rgb(236, 72, 153)',
        'rgb(234, 179, 8)',
      ],
      borderWidth: 1,
    }],
  };

  const chartTitles = {
    line: 'Income vs Expenses Over Time',
    accounts: 'Account Balances Distribution',
    expenses: 'Expenses by Category',
    income: 'Income Sources',
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 16,
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: chartTitles[currentChart],
        font: { size: 16 },
        padding: { top: 8, bottom: 8 },
      },
    },
    layout: {
      padding: 0,
    },
  };

  const renderChart = () => {
    switch (currentChart) {
      case 'line':
        return <Line options={options} data={lineData} />;
      case 'accounts':
        return <Pie options={options} data={accountsData} />;
      case 'expenses':
        return <Pie options={options} data={expensesData} />;
      case 'income':
        return <Pie options={options} data={incomeSourcesData} />;
      default:
        return <Line options={options} data={lineData} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => setCurrentChart('line')}
          className={`px-3 py-1 rounded-full text-sm ${
            currentChart === 'line'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Timeline
        </button>
        <button
          onClick={() => setCurrentChart('accounts')}
          className={`px-3 py-1 rounded-full text-sm ${
            currentChart === 'accounts'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Accounts
        </button>
        <button
          onClick={() => setCurrentChart('expenses')}
          className={`px-3 py-1 rounded-full text-sm ${
            currentChart === 'expenses'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setCurrentChart('income')}
          className={`px-3 py-1 rounded-full text-sm ${
            currentChart === 'income'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Income
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm" style={{ height: 300 }}>
        {renderChart()}
      </div>
    </div>
  );
} 