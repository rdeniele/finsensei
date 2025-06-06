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
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Financial Coach</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          {!advice && !loading && !error && (
            <p className="text-gray-600">
              Click the button below to get personalized financial advice based on your current financial situation.
            </p>
          )}
          
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          {advice && !error && (
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br/>') }} />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleGetAdvice}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Getting Advice...' : 'Get Advice'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachModal;