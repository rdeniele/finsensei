import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Account } from '@/lib/supabase';
import type { Transaction } from '@/lib/supabase';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export interface FinancialData {
  accounts: Account[];
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  currency: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Helper function to format currency
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Get configured model
const getModel = () => {
  return genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  });
};

export interface LearningTip {
  title: string;
  content: string;
  source: string;
  type: 'tip' | 'video';
  url?: string;
  lastUpdated: string;
}

// Validated video sources and their creators
const VALID_VIDEO_SOURCES = [
  {
    title: "How to Build an Emergency Fund",
    creator: "Khan Academy",
    url: "https://www.youtube.com/watch?v=GxO3f7w3Jqg",
    verified: true
  },
  {
    title: "Basic Budgeting for Beginners",
    creator: "Khan Academy",
    url: "https://www.youtube.com/watch?v=HhX9WvXzXvY",
    verified: true
  },
  {
    title: "Understanding Credit Scores",
    creator: "Khan Academy",
    url: "https://www.youtube.com/watch?v=HhX9WvXzXvY",
    verified: true
  },
  {
    title: "Saving Money and Budgeting",
    creator: "Khan Academy",
    url: "https://www.youtube.com/watch?v=HhX9WvXzXvY",
    verified: true
  },
  {
    title: "Managing Debt",
    creator: "Khan Academy",
    url: "https://www.youtube.com/watch?v=HhX9WvXzXvY",
    verified: true
  },
  {
    title: "Financial Planning Basics",
    creator: "Khan Academy",
    url: "https://www.youtube.com/watch?v=HhX9WvXzXvY",
    verified: true
  }
];

// Validated financial education sources
const VALID_SOURCES = [
  {
    name: "Khan Academy",
    url: "https://www.khanacademy.org/college-careers-more/personal-finance",
    verified: true
  },
  {
    name: "Consumer Financial Protection Bureau",
    url: "https://www.consumerfinance.gov/consumer-tools/",
    verified: true
  },
  {
    name: "Federal Trade Commission",
    url: "https://www.consumer.ftc.gov/topics/money-credit",
    verified: true
  },
  {
    name: "MyMoney.gov",
    url: "https://www.mymoney.gov/",
    verified: true
  },
  {
    name: "FDIC Money Smart",
    url: "https://www.fdic.gov/resources/consumers/money-smart/",
    verified: true
  }
];

export async function fetchFinancialAdvice(financialData: FinancialData): Promise<LearningTip[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `As a financial advisor specializing in helping lower to middle-income individuals, provide practical, actionable financial advice that is:
    1. Realistic for people with limited resources
    2. Focused on building financial stability
    3. Based on proven strategies from successful developing countries
    4. Free from bias towards high-income countries
    5. Include specific examples and success stories
    6. Only use verified sources from the following list:
       ${VALID_SOURCES.map(s => `- ${s.name} (${s.url})`).join('\n')}
    7. For videos, only use verified content from:
       ${VALID_VIDEO_SOURCES.map(v => `- ${v.title} by ${v.creator} (${v.url})`).join('\n')}

    Format the response as a JSON array of tips, each containing:
    - title: string
    - content: string (max 200 characters)
    - source: string (must be from the verified sources list)
    - type: "tip" or "video"
    - url: string (if type is "video", must be from the verified videos list)
    - lastUpdated: string (current date in ISO format)

    Focus on practical topics like:
    - Emergency fund building
    - Basic budgeting
    - Debt management
    - Saving strategies
    - Income generation
    - Financial education resources

    Ensure all content is:
    1. Actionable and specific
    2. Culturally sensitive
    3. Accessible to people with limited resources
    4. Based on verified sources
    5. Includes working links for videos`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const tips = JSON.parse(text);
      
      // Validate and filter tips
      return tips.filter((tip: LearningTip) => {
        // Validate source
        const validSource = VALID_SOURCES.find(s => s.name === tip.source);
        if (!validSource) return false;

        // Validate video if present
        if (tip.type === 'video') {
          const validVideo = VALID_VIDEO_SOURCES.find(v => v.url === tip.url);
          if (!validVideo) return false;
        }

        // Validate content length
        if (tip.content.length > 200) return false;

        // Add lastUpdated if not present
        if (!tip.lastUpdated) {
          tip.lastUpdated = new Date().toISOString();
        }

        return true;
      });
    } catch (e) {
      console.error('Error parsing Gemini response:', e);
      return [];
    }
  } catch (error) {
    console.error('Error fetching financial advice:', error);
    return [];
  }
}

export async function sendChatMessage(messages: ChatMessage[], financialData: FinancialData): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.');
    throw new Error('Gemini API key is not configured');
  }

  try {
    const model = getModel();

    const context = `
      You are a financial advisor assistant. Here is the user's current financial situation (all amounts in ${financialData.currency}):
      
      Accounts:
      ${financialData.accounts.map(acc => `- ${acc.account_name}: ${formatCurrency(Number(acc.balance), financialData.currency)}`).join('\n')}
      
      Recent Transactions:
      ${financialData.transactions.slice(0, 5).map(t => 
        `- ${t.date}: ${t.transaction_type} of ${formatCurrency(Number(t.amount), financialData.currency)} for ${t.source}`
      ).join('\n')}
      
      Summary:
      - Total Income: ${formatCurrency(financialData.totalIncome, financialData.currency)}
      - Total Expenses: ${formatCurrency(financialData.totalExpenses, financialData.currency)}
      - Net Balance: ${formatCurrency(financialData.netBalance, financialData.currency)}

      Previous conversation:
      ${messages.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}

      Please provide a helpful and concise response to the user's latest message. All monetary values should be in ${financialData.currency}.
    `;

    const result = await model.generateContent(context);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Gemini API key is not configured correctly. Please check your .env.local file.');
      }
      throw new Error(`Failed to get response: ${error.message}`);
    }
    throw new Error('Failed to get response. Please try again later.');
  }
}