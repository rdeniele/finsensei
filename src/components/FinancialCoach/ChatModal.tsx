'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { sendChatMessage, ChatMessage } from '@/services/gemini';
import { Account, Transaction } from '@/lib/api';
import { saveChatMessage, getChatHistory, clearChatHistory } from '@/services/chatService';
import BaseModal from '@/components/ui/BaseModal';
import { TextInput } from '@/components/ui/FormInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  transactions: Transaction[];
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, accounts, transactions }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when modal opens
  useEffect(() => {
    const loadChatHistory = async () => {
      if (isOpen && user) {
        const history = await getChatHistory(user.id);
        if (history.length > 0) {
          setMessages(history);
        } else {
          // Add initial greeting if no history exists
          const greeting = {
            role: 'assistant',
            content: 'Hello! I\'m your financial coach. How can I help you today?'
          };
          const savedGreeting = await saveChatMessage(user.id, 'assistant', greeting.content);
          if (savedGreeting) {
            setMessages([savedGreeting]);
          }
        }
      }
    };

    loadChatHistory();
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !user) return;

    const userMessage = input.trim();
    setInput('');
    
    // Save user message
    const savedUserMessage = await saveChatMessage(user.id, 'user', userMessage);
    if (savedUserMessage) {
      setMessages(prev => [...prev, savedUserMessage]);
    }
    
    setLoading(true);

    try {
      const totalIncome = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const netBalance = totalIncome - totalExpenses;

      const financialData = {
        accounts,
        transactions,
        totalIncome,
        totalExpenses,
        netBalance,
        currency: user?.currency || 'USD'
      };

      const response = await sendChatMessage(
        [...messages, { role: 'user', content: userMessage }],
        financialData
      );

      // Save assistant's response
      const savedAssistantMessage = await saveChatMessage(user.id, 'assistant', response);
      if (savedAssistantMessage) {
        setMessages(prev => [...prev, savedAssistantMessage]);
      }
    } catch (error) {
      console.error('Error getting chat response:', error);
      const errorMessage = 'Sorry, I encountered an error. Please try again.';
      const savedErrorMessage = await saveChatMessage(user.id, 'assistant', errorMessage);
      if (savedErrorMessage) {
        setMessages(prev => [...prev, savedErrorMessage]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!user) return;
    const success = await clearChatHistory(user.id);
    if (success) {
      setMessages([]);
      // Add new greeting
      const greeting = {
        role: 'assistant',
        content: 'Hello! I\'m your financial coach. How can I help you today?'
      };
      const savedGreeting = await saveChatMessage(user.id, 'assistant', greeting.content);
      if (savedGreeting) {
        setMessages([savedGreeting]);
      }
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Chat with Financial Coach">
      <div className="h-[600px] flex flex-col">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleClearHistory}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Clear chat history"
          >
            🗑️
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <TextInput
            label=""
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
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