'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AdviceDisplayProps {
  advice: string | null;
  isLoading: boolean;
  error: string | null;
}

export default function AdviceDisplay({ advice, isLoading, error }: AdviceDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!advice && !isLoading && !error) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Financial Advice</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {isExpanded ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-red-500 dark:text-red-400">{error}</div>
      ) : (
        <div className={`prose dark:prose-invert max-w-none ${isExpanded ? '' : 'line-clamp-3'}`}>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{advice}</p>
        </div>
      )}
    </Card>
  );
}