'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { sendChatMessage, ChatMessage } from '@/services/gemini';
import { Account, Transaction } from '@/lib/api';
import { saveChatMessage, getChatHistory, clearChatHistory } from '@/services/chatService';
import { coinService } from '@/services/coinService';
import BaseModal from '@/components/ui/BaseModal';
import { TextInput } from '@/components/ui/FormInput';
import { CurrencyDollarIcon, ExclamationTriangleIcon, TrashIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { UserCoinBalance } from '@/types/coin';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  transactions: Transaction[];
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, accounts, transactions }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coinBalance, setCoinBalance] = useState<UserCoinBalance | null>(null);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      loadCoinBalance();
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCoinBalance = async () => {
    try {
      const balance = await coinService.getUserCoins(user?.id || '');
      setCoinBalance(balance);
    } catch (error) {
      console.error('Error loading coin balance:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Check if user has enough coins before sending
      const currentBalance = await coinService.getUserCoins(user?.id || '');
      
      if (!currentBalance || currentBalance.coins < 20) {
        setShowPaymentPrompt(true);
        setIsLoading(false);
        return;
      }

      // Deduct coins first
      const deductionResult = await coinService.useCoinsForChat(user?.id || '');
      
      if (!deductionResult) {
        setShowPaymentPrompt(true);
        setIsLoading(false);
        return;
      }

      // Update local balance
      setCoinBalance(prev => prev ? { ...prev, coins: prev.coins - 20 } : null);

      // Prepare context for the AI
      const context = {
        accounts: accounts.map(acc => ({
          name: acc.account_name,
          balance: acc.balance,
          type: acc.account_type
        })),
        recentTransactions: transactions.slice(0, 10).map(t => ({
          description: t.source,
          amount: t.amount,
          type: t.transaction_type,
          date: t.date
        }))
      };

      // Send message to AI service
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: context,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: data.response,
        timestamp: new Date()
      } satisfies Message;

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please try again or contact support if the problem persists.',
        timestamp: new Date()
      } satisfies Message;

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = async () => {
    if (!user) return;
    const success = await clearChatHistory(user.id);
    if (success) {
      setMessages([]);
      // Add new greeting
      const greeting = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: 'Hello! I\'m your financial coach. How can I help you today?',
        timestamp: new Date()
      } satisfies Message;
      setMessages([greeting]);
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Chat with Financial Coach">
      <div className="h-[600px] flex flex-col">
        {/* Coin Balance Display */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Coins: {coinBalance?.coins || 0}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {coinBalance?.chats_remaining || 0} chats remaining
          </div>
          <button
            onClick={() => window.open('/coins', '_blank')}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Buy More
          </button>
        </div>

        {/* Coin Warning */}
        {showPaymentPrompt && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  You need 20 coins to chat with FinSensei. You currently have {coinBalance?.coins || 0} coins.
                </p>
                <button
                  onClick={() => window.open('/coins', '_blank')}
                  className="text-sm text-yellow-800 dark:text-yellow-200 underline hover:no-underline mt-1"
                >
                  Buy more coins
                </button>
              </div>
              <button
                onClick={() => setShowPaymentPrompt(false)}
                className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end mb-4">
          <button
            onClick={handleClearHistory}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title="Clear chat history"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <div className="mb-4 flex justify-center">
                <ChatBubbleOvalLeftEllipsisIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-lg font-medium mb-2">Welcome to FinSensei AI Coach!</p>
              <p className="text-sm">
                Ask me anything about your finances, budgeting, or financial goals.
                Each message costs 20 coins.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <LoadingSpinner />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    FinSensei is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          {showPaymentPrompt && (
            <div className="flex justify-start">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-3 max-w-md">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                      Out of Coins
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
                      You need more coins to continue chatting. Each message costs 20 coins.
                    </p>
                    <div className="flex space-x-2">
                      <Link
                        href="/coins"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Buy Coins
                      </Link>
                      <button
                        onClick={() => setShowPaymentPrompt(false)}
                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 text-sm font-medium"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
          <TextInput
            label=""
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me about your finances..."
            disabled={isLoading}
            className="flex-1"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </BaseModal>
  );
};

export default ChatModal; 