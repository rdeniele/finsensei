import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}