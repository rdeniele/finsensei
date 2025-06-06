'use client';

import React, { useState } from 'react';

interface CoachModalProps {
  onClose: () => void;
  onGetAdvice: () => Promise<string>;
}

const CoachModal: React.FC<CoachModalProps> = ({ onClose, onGetAdvice }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetAdvice = async () => {
    setLoading(true);
    setAdvice(null);
    setError(null);
    try {
      const response = await onGetAdvice();
      setAdvice(response);
    } catch (error) {
      console.error('Error getting advice:', error);
      setError(error instanceof Error ? error.message : 'Sorry, I encountered an error while getting advice. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Financial Coach</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          {!advice && !loading && !error && (
            <p className="text-gray-600 dark:text-gray-300">
              Click the button below to get personalized financial advice based on your current financial situation.
            </p>
          )}
          
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          {advice && !error && (
            <div className="prose dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br/>') }} />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleGetAdvice}
            disabled={loading}
            className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Getting Advice...' : 'Get Advice'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachModal;