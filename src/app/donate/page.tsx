'use client';

import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import { HeartIcon, SparklesIcon, UserGroupIcon, CodeBracketIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface DonationOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  paymentMethods: {
    name: string;
    details: string;
    instructions: string[];
  }[];
}

const donationOptions: DonationOption[] = [
  {
    id: 'stray-animals',
    title: 'Stray Animals',
    description: 'Help feed and care for our furry friends on the streets. Every peso counts in making their lives better!',
    icon: HeartIcon,
    paymentMethods: [
      {
        name: 'GCash',
        details: 'Click to reveal number',
        instructions: [
          'Click the "Show Number" button below',
          'Copy the GCash number',
          'Open your GCash app',
          'Send money to the copied number',
          'Add "Stray Animals" in the message',
          'Take a screenshot of the receipt (optional)',
        ],
      },
    ],
  },
  {
    id: 'nature',
    title: 'Nature Conservation',
    description: 'Support local tree planting initiatives and beach cleanups. Let&apos;s keep our planet green and clean!',
    icon: SparklesIcon,
    paymentMethods: [
      {
        name: 'GCash',
        details: 'Click to reveal number',
        instructions: [
          'Click the "Show Number" button below',
          'Copy the GCash number',
          'Open your GCash app',
          'Send money to the copied number',
          'Add "Nature" in the message',
          'Take a screenshot of the receipt (optional)',
        ],
      },
    ],
  },
  {
    id: 'people',
    title: 'People in Need',
    description: 'Help provide food, shelter, and education to those who need it most. Together we can make a difference!',
    icon: UserGroupIcon,
    paymentMethods: [
      {
        name: 'GCash',
        details: 'Click to reveal number',
        instructions: [
          'Click the "Show Number" button below',
          'Copy the GCash number',
          'Open your GCash app',
          'Send money to the copied number',
          'Add "People in Need" in the message',
          'Take a screenshot of the receipt (optional)',
        ],
      },
    ],
  },
  {
    id: 'developer',
    title: 'Support the Developer',
    description: 'Help me keep FinSensei running for free and accessible to everyone. Your support helps maintain the platform and enables more people to learn about financial management.',
    icon: CodeBracketIcon,
    paymentMethods: [
      {
        name: 'GCash',
        details: 'Click to reveal number',
        instructions: [
          'Click the "Show Number" button below',
          'Copy the GCash number',
          'Open your GCash app',
          'Send money to the copied number',
          'Add "Dev Support" in the message',
          'Take a screenshot of the receipt (optional)',
        ],
      },
      {
        name: 'PayPal',
        details: '@rdeniele',
        instructions: [
          'Click the PayPal button below',
          'Send any amount you&apos;re comfortable with',
          'Add a note if you&apos;d like to be featured in our supporters list',
        ],
      },
    ],
  },
];

export default function DonatePage() {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showNumber, setShowNumber] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDonate = (optionId: string) => {
    setSelectedOption(optionId);
    setSelectedMethod(null);
    setShowNumber(false);
    setShowForm(true);
  };

  const handleMethodSelect = (methodName: string) => {
    setSelectedMethod(methodName);
    if (methodName === 'GCash') {
      setShowNumber(false);
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('+639159427791');
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!selectedOption) {
      setError('Please select a cause');
      return;
    }
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }
    if (!donationAmount || isNaN(parseFloat(donationAmount)) || parseFloat(donationAmount) <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: submissionError } = await supabase
        .from('donations')
        .insert([
          {
            user_id: user?.id,
            user_email: user?.email,
            cause: selectedOption,
            amount: parseFloat(donationAmount),
            payment_method: selectedMethod,
            status: 'pending',
          },
        ]);

      if (submissionError) throw submissionError;

      setShowThankYou(true);
      setDonationAmount('');
      setSelectedOption(null);
      setSelectedMethod(null);
      setShowNumber(false);
      setShowForm(false);
    } catch (err: any) {
      console.error('Error submitting donation:', err);
      setError(err.message || 'Failed to submit donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Support a Cause
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose a cause you care about and make a difference today!
          </p>
        </div>

        {/* Developer Support Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 mb-12 text-white shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Support FinSensei&apos;s Mission</h2>
            <p className="text-lg mb-6">
              Your support helps keep FinSensei free and accessible to everyone. Together, we can help more people learn about financial management and achieve their financial goals.
            </p>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-lg mb-4">
                Looking for professional web development services?
              </p>
              <Link 
                href="https://ronparagoso.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Visit My Portfolio
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
            <ShieldCheckIcon className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Privacy & Security</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Your privacy and security are important to us. The GCash number is hidden by default and only revealed when you choose to donate. 
            We recommend copying the number directly rather than sharing it. Thank you for your support!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {donationOptions.map((option) => (
            <div
              key={option.id}
              className={`rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow text-white ${
                option.id === 'stray-animals'
                  ? 'bg-gradient-to-br from-pink-500 to-rose-500'
                  : option.id === 'nature'
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                  : option.id === 'people'
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-white/20">
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="ml-3 text-lg font-semibold">{option.title}</h3>
              </div>
              <p className="mb-6 text-white/90">{option.description}</p>
              <button
                onClick={() => handleDonate(option.id)}
                className="w-full py-2 px-4 rounded-md bg-white/20 hover:bg-white/30 font-medium transition-colors"
              >
                Donate Now
              </button>
            </div>
          ))}
        </div>

        {/* Donation Form Modal */}
        {showForm && selectedOption && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl ${
              selectedOption === 'stray-animals'
                ? 'border-t-4 border-pink-500'
                : selectedOption === 'nature'
                ? 'border-t-4 border-green-500'
                : selectedOption === 'people'
                ? 'border-t-4 border-purple-500'
                : 'border-t-4 border-blue-500'
            }`}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Make a Donation
              </h3>
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
                  {error}
                </div>
              )}
              <form onSubmit={handleDonationSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {donationOptions
                      .find((opt) => opt.id === selectedOption)
                      ?.paymentMethods.map((method) => (
                        <button
                          key={method.name}
                          type="button"
                          onClick={() => handleMethodSelect(method.name)}
                          className={`w-full p-3 rounded-lg border transition-colors ${
                            selectedMethod === method.name
                              ? selectedOption === 'stray-animals'
                                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                                : selectedOption === 'nature'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : selectedOption === 'people'
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {method.name}
                        </button>
                      ))}
                  </div>
                </div>

                {selectedMethod === 'GCash' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GCash Number
                    </label>
                    {showNumber ? (
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                          +639159427791
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyNumber}
                          className={`px-3 py-2 rounded-md text-white ${
                            selectedOption === 'stray-animals'
                              ? 'bg-pink-500 hover:bg-pink-600'
                              : selectedOption === 'nature'
                              ? 'bg-green-500 hover:bg-green-600'
                              : selectedOption === 'people'
                              ? 'bg-purple-500 hover:bg-purple-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          Copy
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowNumber(true)}
                        className={`w-full py-2 px-4 rounded-md text-white ${
                          selectedOption === 'stray-animals'
                            ? 'bg-pink-500 hover:bg-pink-600'
                            : selectedOption === 'nature'
                            ? 'bg-green-500 hover:bg-green-600'
                            : selectedOption === 'people'
                            ? 'bg-purple-500 hover:bg-purple-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        Show Number
                      </button>
                    )}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                      selectedOption === 'stray-animals'
                        ? 'border-pink-300 focus:border-pink-500 focus:ring-pink-500/20'
                        : selectedOption === 'nature'
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
                        : selectedOption === 'people'
                        ? 'border-purple-300 focus:border-purple-500 focus:ring-purple-500/20'
                        : 'border-blue-300 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-2 px-4 text-white rounded-md ${
                      selectedOption === 'stray-animals'
                        ? 'bg-pink-500 hover:bg-pink-600'
                        : selectedOption === 'nature'
                        ? 'bg-green-500 hover:bg-green-600'
                        : selectedOption === 'people'
                        ? 'bg-purple-500 hover:bg-purple-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } disabled:opacity-50`}
                  >
                    {isSubmitting ? 'Processing...' : 'Donate'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Thank You Modal */}
        {showThankYou && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full text-center">
              <div className="mb-4">
                <span className="inline-block p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Thank You for Your Donation!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your support means a lot to us. We&apos;ll make sure your donation goes to the cause you selected.
              </p>
              <button
                onClick={() => setShowThankYou(false)}
                className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 