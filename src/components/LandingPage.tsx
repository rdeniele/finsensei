'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { 
  ChartBarIcon, 
  WalletIcon, 
  FlagIcon, 
  SparklesIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  ClockIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  const features = [
    {
      icon: ChartBarIcon,
      title: 'Smart Analytics',
      description: 'Get AI-powered insights into your spending patterns and financial health.'
    },
    {
      icon: WalletIcon,
      title: 'Expense Tracking',
      description: 'Easily track all your expenses and income in one centralized location.'
    },
    {
      icon: FlagIcon,
      title: 'Goal Setting',
      description: 'Set and track financial goals with progress monitoring and milestones.'
    },
    {
      icon: SparklesIcon,
      title: 'AI Financial Coach',
      description: 'Get personalized financial advice and recommendations from our AI coach.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Private',
      description: 'Bank-level security to keep your financial data safe and confidential.'
    },
    {
      icon: UserGroupIcon,
      title: 'Learning Resources',
      description: 'Access educational content to improve your financial literacy.'
    }
  ];

  const testimonials = [
    {
      name: 'S. J.',
      role: 'Small Business Owner',
      content: 'FinSensei helped me understand my spending habits and save 30% more each month.',
      rating: 5
    },
    {
      name: 'M. C.',
      role: 'Software Engineer',
      content: 'The AI coach feature is incredible. It gives me personalized advice that actually works.',
      rating: 5
    },
    {
      name: 'E. R.',
      role: 'Graduate Student',
      content: 'Finally, a finance app that is both powerful and easy to use. Love the goal tracking!',
      rating: 5
    }
  ];

  const statistics = [
    {
      icon: ArrowTrendingUpIcon,
      value: '47%',
      label: 'Average Savings Increase',
      description: 'Users save 47% more money within 3 months'
    },
    {
      icon: CurrencyDollarIcon,
      value: '$2,847',
      label: 'Average Annual Savings',
      description: 'Typical user saves $2,847 per year'
    },
    {
      icon: ChartPieIcon,
      value: '89%',
      label: 'Better Budget Control',
      description: 'Users report improved spending awareness'
    }
  ];

  const blogs = [
    {
      id: 1,
      title: "Start Your Emergency Fund: A Gen Z Guide to Real Security",
      excerpt: "Most Gen Z Filipinos live paycheck to paycheck — not because they&apos;re careless, but because no one taught them how to build financial security. Learn how to create an emergency fund starting with just ₱50.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "FinSensei Team",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Emergency Fund",
      slug: "emergency-fund-gen-z-guide"
    },
    {
      id: 2,
      title: "Maximize Your First Paycheck: Smart Moves for Young Professionals",
      excerpt: "First job? First real paycheck? Don&apos;t blow it. Here&apos;s how to make it work for your future, not just for your cravings. Master the 50/30/20 rule and start building wealth from day one.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "FinSensei Team",
      date: "March 10, 2024",
      readTime: "4 min read",
      category: "Budgeting",
      slug: "maximize-first-paycheck"
    },
    {
      id: 3,
      title: "Finfluencers vs. Real Financial Wisdom: What Gen Z Needs to Know",
      excerpt: "TikTok told you to invest in crypto, skip Starbucks, and cash stuff like your life depends on it. Which ones are actually smart? Learn to filter noise from truth in the age of financial influencers.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "FinSensei Team",
      date: "March 5, 2024",
      readTime: "6 min read",
      category: "Financial Education",
      slug: "finfluencers-vs-real-wisdom"
    }
  ];

  const charts = [
    {
      title: 'Spending Categories',
      content: (
        <div className="h-64">
          <Pie
            data={{
              labels: ['Food & Dining', 'Transportation', 'Entertainment', 'Shopping', 'Utilities'],
              datasets: [{
                data: [450, 320, 280, 200, 180],
                backgroundColor: [
                  'rgba(239, 68, 68, 0.7)',
                  'rgba(59, 130, 246, 0.7)',
                  'rgba(34, 197, 94, 0.7)',
                  'rgba(168, 85, 247, 0.7)',
                  'rgba(249, 115, 22, 0.7)',
                ],
                borderColor: [
                  'rgb(239, 68, 68)',
                  'rgb(59, 130, 246)',
                  'rgb(34, 197, 94)',
                  'rgb(168, 85, 247)',
                  'rgb(249, 115, 22)',
                ],
                borderWidth: 2,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    boxWidth: 12,
                    font: { size: 11 },
                  },
                },
                title: {
                  display: false,
                },
              },
            }}
          />
        </div>
      )
    },
    {
      title: 'Monthly Savings Trend',
      content: (
        <div className="h-64">
          <Bar
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Monthly Savings',
                data: [0, 450, 1200, 1800, 2400, 2847],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2,
                borderRadius: 4,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }}
          />
        </div>
      )
    },
    {
      title: 'Income vs Expenses',
      content: (
        <div className="h-64">
          <Bar
            data={{
              labels: ['Income', 'Expenses', 'Net Savings'],
              datasets: [{
                label: 'Amount ($)',
                data: [4500, 2800, 1700],
                backgroundColor: [
                  'rgba(34, 197, 94, 0.7)',
                  'rgba(239, 68, 68, 0.7)',
                  'rgba(59, 130, 246, 0.7)',
                ],
                borderColor: [
                  'rgb(34, 197, 94)',
                  'rgb(239, 68, 68)',
                  'rgb(59, 130, 246)',
                ],
                borderWidth: 2,
                borderRadius: 4,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }}
          />
        </div>
      )
    },
    {
      title: 'Financial Goals Progress',
      content: (
        <div className="h-64">
          <Bar
            data={{
              labels: ['Emergency Fund', 'Vacation Fund', 'Investment Portfolio', 'Debt Payoff'],
              datasets: [{
                label: 'Progress (%)',
                data: [75, 45, 30, 60],
                backgroundColor: [
                  'rgba(34, 197, 94, 0.7)',
                  'rgba(59, 130, 246, 0.7)',
                  'rgba(168, 85, 247, 0.7)',
                  'rgba(249, 115, 22, 0.7)',
                ],
                borderColor: [
                  'rgb(34, 197, 94)',
                  'rgb(59, 130, 246)',
                  'rgb(168, 85, 247)',
                  'rgb(249, 115, 22)',
                ],
                borderWidth: 2,
                borderRadius: 4,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                }
              }
            }}
          />
        </div>
      )
    },
    {
      title: 'Weekly Spending Pattern',
      content: (
        <div className="h-64">
          <Line
            data={{
              labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              datasets: [{
                label: 'Daily Spending',
                data: [120, 180, 100, 240, 300, 200, 160],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value;
                    }
                  }
                }
              }
            }}
          />
        </div>
      )
    },
    {
      title: 'Investment Performance',
      content: (
        <div className="h-64">
          <Pie
            data={{
              labels: ['Stocks', 'Bonds', 'Crypto', 'Real Estate'],
              datasets: [{
                data: [65, 25, 8, 2],
                backgroundColor: [
                  'rgba(34, 197, 94, 0.7)',
                  'rgba(59, 130, 246, 0.7)',
                  'rgba(168, 85, 247, 0.7)',
                  'rgba(249, 115, 22, 0.7)',
                ],
                borderColor: [
                  'rgb(34, 197, 94)',
                  'rgb(59, 130, 246)',
                  'rgb(168, 85, 247)',
                  'rgb(249, 115, 22)',
                ],
                borderWidth: 2,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    boxWidth: 12,
                    font: { size: 11 },
                  },
                },
                title: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.parsed;
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      return `${label}: ${percentage}%`;
                    }
                  }
                }
              },
            }}
          />
        </div>
      )
    }
  ];

  const nextChart = () => {
    setCurrentChartIndex((prev) => (prev + 1) % charts.length);
  };

  const prevChart = () => {
    setCurrentChartIndex((prev) => (prev - 1 + charts.length) % charts.length);
  };

  const goToChart = (index: number) => {
    setCurrentChartIndex(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Image
                src="/finsensei.png"
                alt="FinSensei Logo"
                width={40}
                height={40}
                className="rounded-xl shadow-sm"
              />
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FinSensei
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#blog" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Blog
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Testimonials
              </a>
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <a href="#features" className="block px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                Features
              </a>
              <a href="#blog" className="block px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                Blog
              </a>
              <a href="#testimonials" className="block px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                Testimonials
              </a>
              <Link
                href="/auth/signin"
                className="block px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg mx-4 transition-all duration-300 font-semibold text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <SparklesIcon className="h-4 w-4 mr-2" />
              AI-Powered Financial Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Take Control of Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Financial Future</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              FinSensei combines AI-powered insights with intuitive tools to help you track expenses, 
              set goals, and build wealth with confidence. Start your journey to financial freedom today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Start Your Free Trial
                <ArrowRightIcon className="ml-3 h-6 w-6" />
              </Link>
              <Link
                href="/auth/signin"
                className="border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                Instant access
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                Secure & private
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Master Your Finances
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Powerful features designed to give you complete control over your financial life with AI-powered insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Proven Results That Transform Your Finances
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              See how FinSensei users have dramatically improved their financial health
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-3">
                    {stat.value}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {stat.label}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Visual Chart Section */}
          <div className="mt-20 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Monthly Savings Progress
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Month 1</span>
                    <span className="font-bold text-gray-900">$0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000" style={{ width: '0%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Month 2</span>
                    <span className="font-bold text-gray-900">$450</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000" style={{ width: '25%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Month 3</span>
                    <span className="font-bold text-gray-900">$1,200</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000" style={{ width: '50%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Month 6</span>
                    <span className="font-bold text-gray-900">$2,847</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-left">
                <h4 className="text-2xl font-bold text-gray-900 mb-6">
                  Key Insights
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">47% average savings increase</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">89% better budget control</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">AI-powered insights</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Personalized recommendations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visualize Your Financial Journey
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Interactive charts and insights that help you understand your money better
            </p>
          </div>
          
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentChartIndex * 100}%)` }}
              >
                {charts.map((chart, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 max-w-2xl mx-auto">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                        {chart.title}
                      </h3>
                      <div className="max-w-md mx-auto">
                        {chart.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevChart}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-700 p-3 rounded-full shadow-lg border border-gray-200 transition-colors"
              aria-label="Previous chart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextChart}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-700 p-3 rounded-full shadow-lg border border-gray-200 transition-colors"
              aria-label="Next chart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {charts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToChart(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentChartIndex 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300 hover:bg-blue-400'
                }`}
                aria-label={`Go to chart ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Chart Counter */}
          <div className="text-center mt-4">
            <p className="text-gray-700">
              {currentChartIndex + 1} of {charts.length} charts
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by Thousands of Users
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              See what our users are saying about their financial transformation with FinSensei
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Financial Education
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Smart Money Moves for Gen Z
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Practical financial advice that actually works. No fluff, just real strategies to build wealth and achieve financial freedom.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <article key={blog.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {blog.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <UserIcon className="h-4 w-4 mr-1" />
                    <span className="mr-4">{blog.author}</span>
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span className="mr-4">{blog.date}</span>
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{blog.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group-hover:underline"
                    >
                      Read More
                      <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Free</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All Articles
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-xl md:text-2xl text-blue-50 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who are already taking control of their finances with FinSensei. 
            Start your journey to financial freedom today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/auth/signup"
              className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/signin"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-8 text-blue-50 text-sm">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Instant access
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Secure & private
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-900 py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <Image
                  src="/finsensei.png"
                  alt="FinSensei Logo"
                  width={48}
                  height={48}
                  className="rounded-xl shadow-sm"
                />
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FinSensei
                </span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Your AI-powered personal finance assistant helping you build wealth and achieve financial freedom.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-6">Product</h3>
              <ul className="space-y-4 text-gray-600">
                <li><a href="#features" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#blog" className="hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-6">Support</h3>
              <ul className="space-y-4 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2024 FinSensei. All rights reserved. Made with love for your financial future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 