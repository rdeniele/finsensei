import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  XMarkIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Finfluencers vs. Real Financial Wisdom: What Gen Z Needs to Know - FinSensei',
  description: 'TikTok told you to invest in crypto, skip Starbucks, and cash stuff like your life depends on it. Which ones are actually smart? Learn to filter noise from truth.',
  keywords: 'finfluencers, financial advice, Gen Z finance, TikTok finance, financial literacy, investment advice, crypto',
  openGraph: {
    title: 'Finfluencers vs. Real Financial Wisdom: What Gen Z Needs to Know',
    description: 'TikTok told you to invest in crypto, skip Starbucks, and cash stuff like your life depends on it. Which ones are actually smart?',
    type: 'article',
    images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
  },
};

export default function FinfluencersBlog() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Back to Homepage
            </Link>
          </div>
          
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Financial Education
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Finfluencers vs. Real Financial Wisdom: What Gen Z Needs to Know
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <UserIcon className="h-4 w-4 mr-1" />
            <span className="mr-4">FinSensei Team</span>
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span className="mr-4">March 5, 2024</span>
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>6 min read</span>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl mb-8">
            <Image
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Social Media Financial Advice"
              width={800}
              height={400}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="prose prose-lg max-w-none">
          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg mb-8">
            <p className="text-lg text-purple-900 font-medium mb-2">
              <ExclamationTriangleIcon className="h-5 w-5 inline mr-2" />
              The Social Media Reality
            </p>
            <p className="text-purple-800">
              TikTok told you to invest in crypto, skip Starbucks, and cash stuff like your life depends on it. 
              Which ones are actually smart? Learn to filter noise from truth in the age of financial influencers.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">What the Data Says</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-red-600 mb-2">76%</div>
                <h3 className="text-xl font-bold text-gray-900">Use TikTok/YouTube for Finance Advice</h3>
              </div>
              <p className="text-red-800 text-center">
                The majority of Gen Z turns to social media for financial guidance
              </p>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-orange-600 mb-2">83%</div>
                <h3 className="text-xl font-bold text-gray-900">Followed Bad or Misleading Tips</h3>
              </div>
              <p className="text-orange-800 text-center">
                Most admit to acting on questionable financial advice
              </p>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-8">
            <strong>Source:</strong> Fast Company study on Gen Z financial behavior and social media influence
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Trending Tactics to Watch</h2>

          <div className="space-y-6 mb-8">
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cash Stuffing – A Real, Effective Tool</h3>
                  <p className="text-gray-700 mb-3">
                    This physical budgeting method where you allocate cash into different envelopes for different spending categories is actually effective for visual learners and those who struggle with digital tracking.
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>Verdict:</strong> ✅ Legitimate budgeting technique
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Loud Budgeting – Publicly Declaring Your Goals</h3>
                  <p className="text-gray-700 mb-3">
                    Being vocal about your financial goals and saying &quot;no&quot; to expensive outings. This creates accountability and can help you stick to your budget.
                  </p>
                  <p className="text-sm text-blue-700">
                    <strong>Verdict:</strong> ✅ Psychologically helpful for accountability
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
              <div className="flex items-start">
                <XMarkIcon className="h-6 w-6 text-red-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Fake Hustle Advice – &quot;Just invest in this new crypto!&quot;</h3>
                  <p className="text-gray-700 mb-3">
                    Anyone promising quick riches through &quot;secret&quot; investments or claiming you can get rich without effort is likely selling something or promoting a pyramid scheme.
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>Verdict:</strong> ❌ Run away. There are no shortcuts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Real Financial Wisdom</h2>

          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">The Foundation First Approach</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Build an Emergency Fund First</h4>
                  <p className="text-gray-700 text-sm">Before any investments, secure 3-6 months of expenses</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Budget Weekly, Not Monthly</h4>
                  <p className="text-gray-700 text-sm">Shorter timeframes are easier to manage and stick to</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Use Systems, Not Just Vibes</h4>
                  <p className="text-gray-700 text-sm">FinSensei, Notion, Google Sheets — tools that track and remind</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">FinSensei&apos;s Role in Filtering Truth</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Prompts Reflection</h3>
              <p className="text-gray-600 text-sm">
                AI coach asks questions that make you think about your spending habits
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Tracks Your Goals</h3>
              <p className="text-gray-600 text-sm">
                Visual progress tracking keeps you motivated and on track
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Filters Noise from Truth</h3>
              <p className="text-gray-600 text-sm">
                Data-driven insights help you make informed decisions
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-yellow-900 mb-4">Red Flags to Watch For</h3>
            <ul className="space-y-2 text-yellow-800">
              <li className="flex items-start">
                <XMarkIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>&quot;Get rich quick&quot; promises or guaranteed returns</span>
              </li>
              <li className="flex items-start">
                <XMarkIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Pressure to invest immediately without research</span>
              </li>
              <li className="flex items-start">
                <XMarkIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Advice that contradicts basic financial principles</span>
              </li>
              <li className="flex items-start">
                <XMarkIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Promoters who make money from your participation</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl border border-green-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-3" />
              The Bottom Line
            </h3>
            <p className="text-lg text-gray-700">
              <strong>Don&apos;t follow financial hype. Follow a real plan.</strong> Use FinSensei to build a solid foundation, 
              track your progress, and make informed decisions based on your actual financial data, not social media trends.
            </p>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Build Real Financial Security?</h3>
            <p className="text-blue-100 mb-6">
              Start with a solid foundation and build wealth the right way with FinSensei.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Your Free Trial
            </Link>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">References & Further Reading</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Investopedia: Gen Z Wellbeing Over Wealth</li>
              <li>• GeeksGrow: How Gen Z is Revolutionizing Financial Literacy with Technology</li>
              <li>• Fast Company: Financial Advice Gen Z TikTok Reddit YouTube Influencers</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
} 