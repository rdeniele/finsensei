'use client';

import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import { HeartIcon, SparklesIcon, UserGroupIcon, CodeBracketIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

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
    description: 'Support local tree planting initiatives and beach cleanups. Let\'s keep our planet green and clean!',
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
    title: 'Developer Support',
    description: 'Help keep the coffee flowing and the code coming! Your support helps maintain and improve FinSensei.',
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
          'Send any amount you\'re comfortable with',
          'Add a note if you\'d like to be featured in our supporters list',
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

        {showThankYou ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Thank You for Your Donation!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your generosity makes a difference. We'll verify your donation and update you soon.
            </p>
            <button
              onClick={() => setShowThankYou(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Donate Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {donationOptions.map((option) => (
                <div
                  key={option.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 ${
                    selectedOption === option.id
                      ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleDonate(option.id)}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                    <option.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>

            {showForm && (
              <form onSubmit={handleDonationSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Complete Your Donation
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Method Selection */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Choose Payment Method
                    </h3>
                    <div className="space-y-4">
                      {donationOptions
                        .find((opt) => opt.id === selectedOption)
                        ?.paymentMethods.map((method) => (
                          <div
                            key={method.name}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedMethod === method.name
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                            }`}
                            onClick={() => handleMethodSelect(method.name)}
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {method.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {method.name === 'GCash' && !showNumber ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowNumber(true);
                                  }}
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  Click to reveal number
                                </button>
                              ) : method.name === 'GCash' ? (
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono">+639159427791</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyNumber();
                                    }}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    Copy
                                  </button>
                                </div>
                              ) : (
                                method.details
                              )}
                            </p>
                            <ul className="mt-4 space-y-2">
                              {method.instructions.map((instruction, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-600 dark:text-gray-300 flex items-start"
                                >
                                  <span className="mr-2 text-blue-600 dark:text-blue-400">{index + 1}.</span>
                                  {instruction}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Donation Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Donation Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Amount (₱)
                        </label>
                        <input
                          type="number"
                          id="amount"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Enter amount"
                          min="1"
                          step="0.01"
                          required
                        />
                      </div>

                      {selectedMethod === 'GCash' && (
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => setShowNumber(!showNumber)}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {showNumber ? 'Hide Number' : 'Show Number'}
                          </button>
                          {showNumber && (
                            <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="text-gray-900 dark:text-white font-mono">
                                +639159427791
                              </p>
                              <button
                                type="button"
                                onClick={handleCopyNumber}
                                className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                Copy Number
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedOption(null);
                      setSelectedMethod(null);
                      setDonationAmount('');
                      setError(null);
                    }}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Donation'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </main>
    </div>
  );
} 