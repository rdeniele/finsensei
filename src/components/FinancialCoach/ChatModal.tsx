import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, sendChatMessage } from '@/lib/gemini';
import { Account, Transaction } from '@/lib/api';

interface ChatModalProps {
  onClose: () => void;
  accounts: Account[];
  transactions: Transaction[];
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, accounts, transactions }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your financial advisor. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const financialData = {
        accounts,
        transactions,
        totalIncome: transactions
          .filter(t => t.transaction_type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0),
        totalExpenses: transactions
          .filter(t => t.transaction_type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0),
        netBalance: accounts.reduce((sum, a) => sum + Number(a.balance), 0)
      };

      const response = await sendChatMessage([...messages, { role: 'user', content: userMessage }], financialData);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error getting response:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'Gemini API key is not configured. Please check your .env.local file.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 h-[600px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Financial Advisor Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal; 