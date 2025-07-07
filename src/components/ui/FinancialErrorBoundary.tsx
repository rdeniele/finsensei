'use client';

import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface FinancialErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface FinancialErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  feature?: string; // e.g., 'transactions', 'accounts', 'goals', 'chat'
}

class FinancialErrorBoundary extends React.Component<FinancialErrorBoundaryProps, FinancialErrorBoundaryState> {
  constructor(props: FinancialErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): FinancialErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`FinancialErrorBoundary caught an error in ${this.props.feature || 'unknown feature'}:`, error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback;
      if (Fallback) {
        return (
          <Fallback 
            error={this.state.error!} 
            reset={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })} 
          />
        );
      }

      return <DefaultFinancialErrorFallback 
        error={this.state.error!}
        feature={this.props.feature}
        reset={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
      />;
    }

    return this.props.children;
  }
}

const DefaultFinancialErrorFallback: React.FC<{ error: Error; feature?: string; reset: () => void }> = ({ 
  error, 
  feature, 
  reset 
}) => {
  const router = useRouter();

  const getErrorMessage = () => {
    if (error.message.includes('Database error')) {
      return 'There was a problem connecting to the database. Please check your internet connection and try again.';
    }
    if (error.message.includes('Insufficient balance')) {
      return 'Insufficient account balance for this transaction.';
    }
    if (error.message.includes('User not authenticated')) {
      return 'Your session has expired. Please sign in again.';
    }
    if (error.message.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    return error.message || 'An unexpected error occurred';
  };

  const getActionSuggestion = () => {
    if (error.message.includes('User not authenticated')) {
      return 'Sign in again';
    }
    if (error.message.includes('Insufficient balance')) {
      return 'Check your account balance';
    }
    return 'Try again';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {feature ? `${feature.charAt(0).toUpperCase() + feature.slice(1)} Error` : 'Something went wrong!'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {getErrorMessage()}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                {getActionSuggestion()}
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Go to Dashboard
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-gray-500 cursor-pointer">Technical Details</summary>
                <pre className="mt-2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialErrorBoundary;
