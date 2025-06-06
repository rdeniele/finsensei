import React from 'react';

interface AdviceDisplayProps {
  advice: string;
  isLoading?: boolean;
  error?: string | null;
}

export default function AdviceDisplay({ advice, isLoading = false, error = null }: AdviceDisplayProps) {
  if (isLoading) {
    return <div className="animate-pulse">Loading advice...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Financial Advice</h3>
      <p className="text-gray-700">{advice}</p>
    </div>
  );
}