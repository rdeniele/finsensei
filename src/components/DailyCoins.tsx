'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getDailyRefreshStatus, refreshDailyCoins } from '@/services/coinService';
import { SparklesIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DailyCoins() {
  const [canRefresh, setCanRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkDailyRefreshStatus();
    }
  }, [user]);

  const checkDailyRefreshStatus = async () => {
    try {
      const status = await getDailyRefreshStatus();
      if (status) {
        setLastRefresh(status.last_refresh);
        setCanRefresh(status.can_refresh);
      }
    } catch (error) {
      console.error('Error checking daily refresh status:', error);
    }
  };

  const handleRefresh = async () => {
    if (!user || !canRefresh) return;

    setIsRefreshing(true);
    setError(null);

    try {
      const newBalance = await refreshDailyCoins();
      if (newBalance !== null) {
        setCanRefresh(false);
        setLastRefresh(new Date().toISOString());
        
        // Show success message
        alert('Successfully claimed your daily 20 coins!');
        
        // Refresh the page to update coin balance
        window.location.reload();
      }
    } catch (error) {
      console.error('Error refreshing daily coins:', error);
      setError('Failed to claim daily coins. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastRefresh = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeUntilNextRefresh = () => {
    if (!lastRefresh) return null;
    
    const lastRefreshDate = new Date(lastRefresh);
    const nextRefreshDate = new Date(lastRefreshDate.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const timeDiff = nextRefreshDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return null;
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <SparklesIcon className="h-6 w-6 mr-2" />
          <div>
            <h3 className="font-semibold text-lg">Daily Coins</h3>
            <p className="text-yellow-100 text-sm">
              Claim your free 20 coins every 24 hours!
            </p>
          </div>
        </div>
        
        <div className="text-right">
          {canRefresh ? (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white text-yellow-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isRefreshing ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Claiming...</span>
                </>
              ) : (
                'Claim 20 Coins'
              )}
            </button>
          ) : (
            <div className="text-yellow-100">
              <div className="text-sm">Next refresh in:</div>
              <div className="font-semibold">{getTimeUntilNextRefresh()}</div>
            </div>
          )}
        </div>
      </div>
      
      {lastRefresh && (
        <div className="mt-3 text-yellow-100 text-sm">
          Last claimed: {formatLastRefresh(lastRefresh)}
        </div>
      )}
      
      {error && (
        <div className="mt-3 p-2 bg-red-500 bg-opacity-20 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 