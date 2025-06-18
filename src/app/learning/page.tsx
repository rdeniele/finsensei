'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import { useAuth } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { learningContentService, type LearningContent } from '@/services/learningContentService';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  PlayIcon,
  ChevronDownIcon,
  BanknotesIcon,
  ChartBarIcon,
  WalletIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Course modules data
const COURSE_MODULES = [
  {
    id: 1,
    title: "The Foundation of Personal Finance",
    icon: BanknotesIcon,
    sections: [
      {
        id: '1.1',
        title: 'What is Personal Finance?',
        content: `Personal finance is the art and science of managing your money throughout your life. It includes everything from how much you earn, spend, save, invest, and protect. It is personal because your goals, income, expenses, and values shape the plan that works best for you.

Whether you're trying to escape paycheck-to-paycheck living or planning long-term wealth, personal finance provides the roadmap.`,
        source: 'Investopedia',
        sourceUrl: 'https://www.investopedia.com/terms/p/personalfinance.asp'
      },
      {
        id: '1.2',
        title: 'The Five Pillars of Personal Finance',
        content: `• Income — Money you earn from jobs, business, investments, etc.
• Spending — How and where you allocate that money.
• Saving — Setting aside money for future needs.
• Investing — Using money to generate more money.
• Protection — Safeguarding your finances through insurance and legal tools.

These pillars help you manage risk and build financial resilience.`,
        source: 'Investopedia',
        sourceUrl: 'https://www.investopedia.com/terms/p/personalfinance.asp'
      }
    ]
  },
  {
    id: 2,
    title: "Budgeting — Your Money Gameplan",
    icon: ChartBarIcon,
    sections: [
      {
        id: '2.1',
        title: 'The 50/30/20 Budget Rule',
        content: `An easy starter formula:

• 50% Needs (rent, utilities, groceries)
• 30% Wants (eating out, hobbies, subscriptions)
• 20% Savings & Debt Repayment

It's flexible and can be adjusted to fit your lifestyle.`,
        source: 'Consumer.gov',
        sourceUrl: 'https://consumer.gov/your-money/making-budget'
      },
      {
        id: '2.2',
        title: 'Track Your Spending',
        content: `Awareness is the first step to change. Whether through apps like YNAB, Excel sheets, or a simple notebook, logging every expense gives clarity on your money behavior.`,
        source: 'Consumer.gov',
        sourceUrl: 'https://consumer.gov/your-money/making-budget'
      },
      {
        id: '2.3',
        title: 'Conscious Spending Plan',
        content: `Ask before every purchase:

• Does this align with my goals?
• Do I really need this?
• Will I regret this later?

Intentional spending brings joy, not guilt.`,
        source: 'Dave Ramsey',
        sourceUrl: 'https://www.ramseysolutions.com/dave-ramsey-7-baby-steps'
      }
    ]
  },
  {
    id: 3,
    title: "Saving — Pay Yourself First",
    icon: WalletIcon,
    sections: [
      {
        id: '3.1',
        title: 'Emergency Fund',
        content: `Save 3 to 6 months of living expenses in a high-yield savings account. It cushions you from job loss, health issues, or sudden expenses.

Start with a goal of 1 month and build up.`,
        source: 'Fidelity',
        sourceUrl: 'https://www.fidelity.com/learning-center/personal-finance/emergency-fund'
      },
      {
        id: '3.2',
        title: 'Automate Savings',
        content: `Set a fixed amount to transfer right after payday into savings. Automation makes saving consistent and removes emotion from the decision.`,
        source: 'Fidelity',
        sourceUrl: 'https://www.fidelity.com/learning-center/personal-finance/emergency-fund'
      },
      {
        id: '3.3',
        title: 'Short vs. Long-Term Savings',
        content: `Short-term (0–2 years): Travel, emergency car repair
Long-term (3+ years): House, education, business capital

Label your savings ("Laptop Fund", "Vacation 2025") to stay motivated.`,
        source: 'Fidelity',
        sourceUrl: 'https://www.fidelity.com/learning-center/personal-finance/emergency-fund'
      }
    ]
  },
  {
    id: 4,
    title: "Debt — Friend or Foe?",
    icon: ShieldCheckIcon,
    sections: [
      {
        id: '4.1',
        title: 'Good vs. Bad Debt',
        content: `Good debt helps you earn more in the future (education, real estate).
Bad debt funds things that lose value or aren't urgent (luxury gadgets on credit).

Not all debt is bad, but uncontrolled debt traps you in stress and limits freedom.`,
        source: 'CNBC',
        sourceUrl: 'https://www.cnbc.com/select/good-debt-vs-bad-debt/'
      },
      {
        id: '4.2',
        title: 'Snowball vs. Avalanche Methods',
        content: `Snowball: Pay off smallest balance first. Motivating.
Avalanche: Pay off highest interest first. Saves more money.

Pick the one you'll stick with.`,
        source: 'Dave Ramsey',
        sourceUrl: 'https://www.ramseysolutions.com/dave-ramsey-7-baby-steps'
      },
      {
        id: '4.3',
        title: 'Avoid Debt Traps',
        content: `Avoid these unless absolutely necessary:

• Payday loans
• Buy-now-pay-later
• Store cards with hidden fees

They come with fine print, interest spikes, and long-term risk.`,
        source: 'CNBC',
        sourceUrl: 'https://www.cnbc.com/select/good-debt-vs-bad-debt/'
      }
    ]
  },
  {
    id: 5,
    title: "Investing — Grow Your Wealth",
    icon: ArrowTrendingUpIcon,
    sections: [
      {
        id: '5.1',
        title: 'Start Early, Compound Often',
        content: `The earlier you invest, the more your money compounds. That means you earn interest on your interest. Start small, but start early.

Example: Investing $100/month at 8% interest from age 20 can turn into over $300,000 by retirement.`,
        source: 'Investopedia',
        sourceUrl: 'https://www.investopedia.com/terms/c/compoundinterest.asp'
      },
      {
        id: '5.2',
        title: 'Investment Types',
        content: `• Stocks: Shares of companies
• Bonds: Loans to governments or companies
• Index Funds/ETFs: Diversified bundles of investments
• Real Estate/REITs: Rental income or appreciation
• Mutual Funds: Managed pools of investments
• Crypto: High risk, only with stable base

Diversification reduces risk. Don't bet on a single investment.`,
        source: 'Investopedia',
        sourceUrl: 'https://www.investopedia.com/terms/p/personalfinance.asp'
      },
      {
        id: '5.3',
        title: 'Know the Risks',
        content: `Investments can rise or fall in value. Manage risk by spreading your money across types, and avoid emotional decisions.

Learn before you leap. Don't invest in what you don't understand.`,
        source: 'Investopedia',
        sourceUrl: 'https://www.investopedia.com/terms/p/personalfinance.asp'
      }
    ]
  }
];

// Khan Academy course tutorial data
const KHAN_ACADEMY_COURSE = {
  title: "Personal Finance Course",
  description: "A comprehensive course covering everything from saving and budgeting to investing and retirement planning. Perfect for beginners and those looking to strengthen their financial knowledge.",
  url: "https://www.khanacademy.org/college-careers-more/personal-finance",
  is_featured: true
};

// Default video tutorials
const DEFAULT_VIDEOS = [
  {
    title: "How to Build Wealth from Scratch",
    description: "Learn the fundamental principles of building wealth and achieving financial freedom. This comprehensive guide covers everything from saving strategies to investment basics.",
    url: "https://youtu.be/DwoDXfv_-G0"
  },
  {
    title: "Mastering Personal Finance",
    description: "Discover essential personal finance skills and strategies to take control of your financial future. Learn about budgeting, saving, and smart money management.",
    url: "https://youtu.be/tZazCRkiZPE"
  },
  {
    title: "Investment Strategies for Beginners",
    description: "A beginner-friendly guide to understanding investment strategies and making your money work for you. Learn about different investment options and risk management.",
    url: "https://youtu.be/NBSy9GrFagE"
  },
  {
    title: "Smart Money Management",
    description: "Learn practical strategies for managing your money effectively, including budgeting, saving, and making informed financial decisions.",
    url: "https://youtu.be/bVAhk3m4FBE"
  },
  {
    title: "Financial Planning Essentials",
    description: "Discover the key elements of financial planning and how to create a solid foundation for your financial future.",
    url: "https://youtu.be/4FZLr5P2AAg"
  },
  {
    title: "Wealth Building Strategies",
    description: "Explore proven strategies for building wealth over time, including investment approaches and long-term financial planning.",
    url: "https://youtu.be/xUGxTXuM0YA"
  }
];

export default function LearningPage() {
  const [content, setContent] = useState<LearningContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await learningContentService.getActiveContent();
      setContent(data);
    } catch (error) {
      setError('Failed to load learning content');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
    setExpandedSection(null);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Hub</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Expand your financial knowledge with our curated collection of educational resources
            </p>
          </div>

          {/* Mini Course */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <BookOpenIcon className="h-8 w-8 text-white mr-3" />
                  <h2 className="text-2xl font-bold text-white">Personal Finance 101: Master Your Money</h2>
                </div>
                <p className="text-purple-100 mb-6">
                  Your complete guide to budgeting, saving, debt, investing, and building financial freedom — backed by research.
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-lg text-white text-sm">
                  5 Modules • Self-paced • Free
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {COURSE_MODULES.map((module) => (
                <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg mr-4">
                        <module.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Module {module.id}: {module.title}
                        </h3>
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedModule === module.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedModule === module.id && (
                    <div className="px-6 pb-4">
                      <div className="space-y-3">
                        {module.sections.map((section) => (
                          <div key={section.id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleSection(section.id)}
                              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {section.id} {section.title}
                              </span>
                              <ChevronDownIcon
                                className={`w-4 h-4 text-gray-500 transition-transform ${
                                  expandedSection === section.id ? 'transform rotate-180' : ''
                                }`}
                              />
                            </button>
                            {expandedSection === section.id && (
                              <div className="px-4 pb-4">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                  <div className="whitespace-pre-line text-gray-600 dark:text-gray-300">
                                    {section.content}
                                  </div>
                                  {section.source && (
                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                      Source: {section.source}
                                    </div>
                                  )}
                                  {section.sourceUrl && (
                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                      <a
                                        href={section.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                      >
                                        Learn more
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Featured Course */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-white mr-3" />
                  <h2 className="text-2xl font-bold text-white">Featured Course</h2>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{KHAN_ACADEMY_COURSE.title}</h3>
                <p className="text-blue-100 mb-6">{KHAN_ACADEMY_COURSE.description}</p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={KHAN_ACADEMY_COURSE.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                  >
                    Start Learning
                  </a>
                  <span className="inline-flex items-center px-4 py-2 text-sm text-blue-100">
                    Free • Self-paced • Comprehensive
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Content */}
          {content.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {item.description}
                    </p>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Learn More →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Tutorials */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Video Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {DEFAULT_VIDEOS.map((video, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="aspect-video">
                    <iframe
                      src={video.url.replace('youtu.be', 'youtube.com/embed')}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                        <PlayIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {video.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {video.description}
                    </p>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Watch on YouTube →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 