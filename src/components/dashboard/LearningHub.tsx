'use client';

import { useState, useEffect } from 'react';
import { learningContentService, type LearningContent } from '@/services/learningContentService';
import { AcademicCapIcon, BookOpenIcon, PlayIcon } from '@heroicons/react/24/outline';

// Khan Academy course tutorial data
const KHAN_ACADEMY_COURSE = {
  title: "Personal Finance Course",
  description: "Learn essential financial concepts through Khan Academy's comprehensive personal finance course. Topics include budgeting, saving, investing, and managing debt.",
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
  }
];

export default function LearningHub() {
  const [content, setContent] = useState<LearningContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await learningContentService.getFeaturedContent();
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
          <AcademicCapIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold dark:text-white">Learning Hub</h2>
      </div>

      <div className="space-y-8">
        {/* Khan Academy Course */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
              <BookOpenIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {KHAN_ACADEMY_COURSE.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recommended Course
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {KHAN_ACADEMY_COURSE.description}
          </p>
          <a
            href={KHAN_ACADEMY_COURSE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Start Learning →
          </a>
        </div>

        {/* Admin Content */}
        {content.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Featured Tips</h3>
            {content.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
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
        )}

        {/* Video Tutorials */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Video Tutorials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEFAULT_VIDEOS.map((video, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
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
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                      <PlayIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {video.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
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
      </div>
    </div>
  );
} 