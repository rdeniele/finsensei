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

const CACHE_KEY = 'learning_hub_tips';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function LearningHub() {
  const [tips, setTips] = useState<LearningTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  const fetchTips = async () => {
    try {
      const response = await fetchFinancialAdvice({
        accounts: [],
        transactions: [],
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        currency: 'USD'
      });
      if (Array.isArray(response)) {
        const formattedTips: LearningTip[] = response.map(tip => ({
          ...tip,
          sourceUrl: SOURCE_URLS[tip.source] || 'https://www.khanacademy.org/college-careers-more/personal-finance',
          videoUrl: tip.type === 'video' ? tip.url : undefined
        }));
        
        // Cache the tips with timestamp
        const cacheData = {
          tips: formattedTips,
          timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        
        setTips(formattedTips);
        setLastFetched(new Date().toISOString());
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
      setTips(DEFAULT_TIPS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadTips = async () => {
      try {
        // Try to load from cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { tips: cachedTips, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > CACHE_EXPIRY;

          if (!isExpired && Array.isArray(cachedTips) && cachedTips.length > 0) {
            setTips(cachedTips);
            setLastFetched(new Date(timestamp).toISOString());
            setIsLoading(false);
            return;
          }
        }

        // If no cache or expired, fetch new tips
        await fetchTips();
      } catch (error) {
        console.error('Error loading tips:', error);
        setTips(DEFAULT_TIPS);
        setIsLoading(false);
      }
    };

    loadTips();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold dark:text-white">Learning Hub</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEFAULT_TIPS.map((tip, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 animate-pulse"
            >
              <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
    </div>
  );
} 