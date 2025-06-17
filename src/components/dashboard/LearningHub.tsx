import { useState, useEffect } from 'react';
import { fetchFinancialAdvice } from '@/services/gemini';
import { PlayIcon } from '@heroicons/react/24/outline';

interface LearningTip {
  title: string;
  content: string;
  source: string;
  sourceUrl: string;
  type: 'tip' | 'video';
  videoUrl?: string;
  lastUpdated: string;
}

// Default tips to show while loading or if API fails
const DEFAULT_TIPS: LearningTip[] = [
  {
    title: "Emergency Fund Basics",
    content: "Start with saving $500, then aim for 3-6 months of expenses. Keep it in a separate savings account.",
    source: "Khan Academy",
    sourceUrl: "https://www.khanacademy.org/college-careers-more/personal-finance",
    type: "tip",
    lastUpdated: new Date().toISOString()
  },
  {
    title: "Budgeting for Beginners",
    content: "Use the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings and debt repayment.",
    source: "Khan Academy",
    sourceUrl: "https://www.khanacademy.org/college-careers-more/personal-finance",
    type: "tip",
    lastUpdated: new Date().toISOString()
  },
  {
    title: "Understanding Credit Scores",
    content: "Learn how credit scores work and how to improve yours with these simple steps.",
    source: "Khan Academy",
    sourceUrl: "https://www.khanacademy.org/college-careers-more/personal-finance",
    type: "video",
    videoUrl: "https://www.youtube.com/watch?v=HhX9WvXzXvY",
    lastUpdated: new Date().toISOString()
  },
  {
    title: "Saving Money and Budgeting",
    content: "Practical tips for saving money and creating a budget that works for you.",
    source: "Khan Academy",
    sourceUrl: "https://www.khanacademy.org/college-careers-more/personal-finance",
    type: "video",
    videoUrl: "https://www.youtube.com/watch?v=HhX9WvXzXvY",
    lastUpdated: new Date().toISOString()
  }
];

// Source URLs mapping
const SOURCE_URLS: { [key: string]: string } = {
  "Financial Peace University": "https://www.ramseysolutions.com",
  "Money Management International": "https://www.moneymanagement.org",
  "Consumer Financial Protection Bureau": "https://www.consumerfinance.gov",
  "The Financial Diet": "https://www.youtube.com/c/TheFinancialDiet",
  "Two Cents": "https://www.youtube.com/c/TwoCentsPBS",
  "NerdWallet": "https://www.nerdwallet.com"
};

export default function LearningHub() {
  const [tips, setTips] = useState<LearningTip[]>(DEFAULT_TIPS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  const fetchTips = async () => {
    try {
      const response = await fetchFinancialAdvice();
      if (Array.isArray(response)) {
        const formattedTips: LearningTip[] = response.map(tip => ({
          ...tip,
          sourceUrl: SOURCE_URLS[tip.source] || 'https://www.khanacademy.org/college-careers-more/personal-finance',
          videoUrl: tip.type === 'video' ? tip.url : undefined
        }));
        setTips(formattedTips);
        localStorage.setItem('cachedTips', JSON.stringify(formattedTips));
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
      // Keep using default tips if fetch fails
    }
  };

  useEffect(() => {
    const checkAndFetchTips = async () => {
      const lastFetchedDate = localStorage.getItem('lastFetchedTips');
      const today = new Date().toISOString().split('T')[0];

      // Load cached tips immediately if available
      const cachedTips = localStorage.getItem('cachedTips');
      if (cachedTips) {
        const parsedTips = JSON.parse(cachedTips);
        if (Array.isArray(parsedTips) && parsedTips.length > 0) {
          setTips(parsedTips);
          setLastFetched(lastFetchedDate);
        }
      }

      // Fetch new tips in the background if needed
      if (!lastFetchedDate || lastFetchedDate.split('T')[0] !== today) {
        setIsLoading(true);
        fetchTips();
      }
    };

    checkAndFetchTips();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Learning Hub</h2>
          {lastFetched && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {new Date(lastFetched).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <a
                href={tip.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {tip.title}
              </a>
              {tip.type === 'video' && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  Video
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {tip.content}
            </p>
            <div className="flex justify-between items-center">
              <a
                href={SOURCE_URLS[tip.source] || tip.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Source: {tip.source}
              </a>
              {tip.type === 'video' && tip.videoUrl && (
                <a
                  href={tip.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  <PlayIcon className="h-4 w-4 mr-1" />
                  Watch Video
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Updating content...
          </p>
        </div>
      )}
    </div>
  );
} 