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
  ChartBarIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Maximize Your First Paycheck: Smart Moves for Young Professionals - FinSensei',
  description: 'First job? First real paycheck? Don\'t blow it. Here\'s how to make it work for your future, not just for your cravings. Master the 50/30/20 rule.',
  keywords: 'first paycheck, budgeting, 50/30/20 rule, young professionals, financial planning, money management',
  openGraph: {
    title: 'Maximize Your First Paycheck: Smart Moves for Young Professionals',
    description: 'First job? First real paycheck? Don\'t blow it. Here\'s how to make it work for your future.',
    type: 'article',
    images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
  },
};

export default function FirstPaycheckBlog() {
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
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Budgeting
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Maximize Your First Paycheck: Smart Moves for Young Professionals
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <UserIcon className="h-4 w-4 mr-1" />
            <span className="mr-4">FinSensei Team</span>
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span className="mr-4">March 10, 2024</span>
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>4 min read</span>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl mb-8">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="First Paycheck Planning"
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
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8">
            <p className="text-lg text-green-900 font-medium mb-2">
              <ExclamationTriangleIcon className="h-5 w-5 inline mr-2" />
              The First Paycheck Reality
            </p>
            <p className="text-green-800">
              First job? First real paycheck? Don&apos;t blow it. Here&apos;s how to make it work for your future, not just for your cravings.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">The 50/30/20 Rule</h2>
          
          <p className="text-lg text-gray-700 mb-6">
            Break down your income like this to create a sustainable financial foundation:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 font-bold text-2xl">50%</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Needs</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Rent/Mortgage</li>
                <li>• Food & Groceries</li>
                <li>• Utilities</li>
                <li>• Transportation</li>
                <li>• Insurance</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-yellow-600 font-bold text-2xl">30%</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Wants</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Dining Out</li>
                <li>• Entertainment</li>
                <li>• Shopping</li>
                <li>• Hobbies</li>
                <li>• Travel</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold text-2xl">20%</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Savings</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Emergency Fund</li>
                <li>• Retirement</li>
                <li>• Investments</li>
                <li>• Debt Payoff</li>
                <li>• Future Goals</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Example: ₱25,000 Monthly Salary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600 mb-2">₱12,500</div>
                <div className="text-sm text-gray-600">Needs (50%)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600 mb-2">₱7,500</div>
                <div className="text-sm text-gray-600">Wants (30%)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">₱5,000</div>
                <div className="text-sm text-gray-600">Savings (20%)</div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Pro Tips for Success</h2>

          <div className="space-y-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Automate the 20% Immediately</h3>
                  <p className="text-gray-700">
                    Set up automatic transfers to GCash AutoSave, Tonik, or Maya before you even see the money. 
                    Out of sight, out of mind.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <ChartBarIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Use FinSensei to Track Your Categories</h3>
                  <p className="text-gray-700">
                    Get spending alerts and visual breakdowns of where your money goes. 
                    Knowledge is power when it comes to budgeting.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Download a Free Paycheck Breakdown Template</h3>
                  <p className="text-gray-700">
                    Use FinSensei&apos;s built-in templates to plan your paycheck allocation before it hits your account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Common First Paycheck Mistakes</h2>

          <div className="bg-red-50 border border-red-200 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-red-900 mb-4">What NOT to Do</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-3">✗</span>
                <span className="text-red-800">Spend it all on lifestyle upgrades (new phone, expensive clothes)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-3">✗</span>
                <span className="text-red-800">Ignore taxes and deductions in your planning</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-3">✗</span>
                <span className="text-red-800">Skip building an emergency fund</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-3">✗</span>
                <span className="text-red-800">Forget to track your spending</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl border border-green-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600 mr-3" />
              Your Future Self Will Thank You
            </h3>
            <p className="text-lg text-gray-700">
              Instead of wondering where your money went — start telling it where to go. 
              <span className="text-green-600 font-semibold"> The 50/30/20 rule is your roadmap to financial freedom.</span>
            </p>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Master Your Money?</h3>
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