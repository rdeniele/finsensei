import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRightIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  DocumentTextIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Financial Education Blog - FinSensei',
  description: 'Smart money moves for Gen Z. Practical financial advice that actually works. Learn about emergency funds, budgeting, and building wealth.',
  keywords: 'financial education, Gen Z finance, emergency fund, budgeting, financial literacy, money management',
  openGraph: {
    title: 'Financial Education Blog - FinSensei',
    description: 'Smart money moves for Gen Z. Practical financial advice that actually works.',
    type: 'website',
  },
};

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

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-end mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Back to Homepage
            </Link>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Financial Education
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Smart Money Moves for Gen Z
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Practical financial advice that actually works. No fluff, just real strategies to build wealth and achieve financial freedom.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
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
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span className="mr-4">{blog.author}</span>
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span className="mr-4">{blog.date}</span>
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{blog.readTime}</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
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
                    <span className="text-sm text-gray-500">Free</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of users who are already building wealth with FinSensei
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Your Free Trial
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 