'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import { useAuth } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { learningContentService, type LearningContent } from '@/services/learningContentService';
import { AcademicCapIcon, BookOpenIcon, PlayIcon } from '@heroicons/react/24/outline';

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