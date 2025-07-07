'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { coinService } from '@/services/coinService';
import { UserCoinBalance } from '@/types/coin';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ChatModal from './ChatModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface CoachButtonProps {
  accounts: any[];
  transactions: any[];
}

export default function CoachButton({ accounts, transactions }: CoachButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coinBalance, setCoinBalance] = useState<UserCoinBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCoinBalance();
    }
  }, [user]);

  const loadCoinBalance = async () => {
    try {
      const balance = await coinService.getUserCoins(user?.id || '');
      setCoinBalance(balance);
    } catch (error) {
      console.error('Error loading coin balance:', error);
    }
  };

  const handleOpenChat = () => {
    setIsModalOpen(true);
  };

  const handleCloseChat = () => {
    setIsModalOpen(false);
    // Reload coin balance when chat is closed
    loadCoinBalance();
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={handleOpenChat}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        title="Chat with FinSensei AI Coach"
      >
        <div className="flex items-center space-x-2">
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
          <div className="text-left">
            <div className="font-semibold text-sm">AI Coach</div>
            <div className="text-xs opacity-90">
              {coinBalance ? `${coinBalance.coins} coins` : 'Loading...'}
            </div>
          </div>
        </div>
      </button>

      <ChatModal
        isOpen={isModalOpen}
        onClose={handleCloseChat}
        accounts={accounts}
        transactions={transactions}
      />
    </>
  );
}