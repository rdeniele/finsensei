import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FinancialChartProps {
  labels: string[];
  incomeData: number[];
  expenseData: number[];
}

export default function FinancialChart({ labels, incomeData, expenseData }: FinancialChartProps) {
  const data = {
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
        text: 'Income vs Expenses',
        font: { size: 16 },
        padding: { top: 8, bottom: 8 },
      },
    },
    layout: {
      padding: 0,
    },
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow-sm" style={{ height: 220 }}>
      <Line options={options} data={data} />
    </div>
  );
} 