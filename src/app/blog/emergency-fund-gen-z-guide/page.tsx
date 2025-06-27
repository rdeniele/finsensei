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
  HomeIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Start Your Emergency Fund: A Gen Z Guide to Real Security - FinSensei',
  description: 'Learn how to create an emergency fund starting with just ₱50. Most Gen Z Filipinos live paycheck to paycheck — not because they\'re careless, but because no one taught them how to build financial security.',
  keywords: 'emergency fund, Gen Z finance, financial security, savings, Filipino finance, financial planning',
  openGraph: {
    title: 'Start Your Emergency Fund: A Gen Z Guide to Real Security',
    description: 'Learn how to create an emergency fund starting with just ₱50.',
    type: 'article',
    images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
  },
};

export default function EmergencyFundBlog() {
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
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Emergency Fund
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Start Your Emergency Fund: A Gen Z Guide to Real Security
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <UserIcon className="h-4 w-4 mr-1" />
            <span className="mr-4">FinSensei Team</span>
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span className="mr-4">March 15, 2024</span>
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>5 min read</span>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl mb-8">
            <Image
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Emergency Fund Security"
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
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
            <p className="text-lg text-blue-900 font-medium mb-2">
              <ExclamationTriangleIcon className="h-5 w-5 inline mr-2" />
              The Reality Check
            </p>
            <p className="text-blue-800">
              Most Gen Z Filipinos live paycheck to paycheck — not because they&apos;re careless, but because no one taught them how to build financial security. This blog will show you how to create an emergency fund in a way that&apos;s simple, actionable, and realistic even if you&apos;re starting with just ₱50.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Emergency Funds Matter</h2>
          
          <p className="text-lg text-gray-700 mb-6">
            Think of an emergency fund as a personal financial safety net — your defense against layoffs, medical emergencies, or unexpected bills. Studies show that <strong>60% of Gen Z have less than $1,000 saved</strong>.
          </p>

          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What Counts as an Emergency?</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Medical emergencies and unexpected health expenses</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Job loss or reduced income</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Car repairs or essential transportation costs</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Home repairs (if you own or rent)</span>
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Start Yours</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Open a Separate Account</h3>
              </div>
              <p className="text-gray-700">
                Use a digital bank like Tonik, CIMB, or Maya. Keep it separate from your main account to avoid temptation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Automate Your Savings</h3>
              </div>
              <p className="text-gray-700">
                Set up automatic transfers of ₱200/month (or whatever you can afford). Consistency beats perfection.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Name It Right</h3>
              </div>
              <p className="text-gray-700">
                Label it &quot;Emergency Only&quot; in your banking app. This psychological trick helps you resist the urge to spend it.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Set Your Goal</h3>
              </div>
              <p className="text-gray-700">
                Aim for ₱25,000 (1–2 months of survival expenses). Start small, but have a clear target.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Tools That Help</h2>

          <p className="text-lg text-gray-700 mb-6">
            FinSensei&apos;s Budget Tracker makes this easier:
          </p>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Categorize all income/expenses to see where your money goes</span>
            </li>
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Track savings growth visually with progress charts</span>
            </li>
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Get AI-powered insights on how to save more effectively</span>
            </li>
          </ul>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl border border-green-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600 mr-3" />
              Final Tip
            </h3>
            <p className="text-lg text-gray-700">
              <strong>Don&apos;t wait for your next job to start.</strong> Begin with whatever&apos;s in your wallet now. 
              <span className="text-green-600 font-semibold"> Momentum &gt; Amount.</span>
            </p>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Build Your Emergency Fund?</h3>
            <p className="text-blue-100 mb-6">
              Start tracking your finances and building wealth with FinSensei today.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Your Free Trial
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
} 