import { toast } from 'react-hot-toast';

interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2
  } = config;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if it's a rate limit error
      if (error instanceof RateLimitError || 
          (error instanceof Error && error.message.includes('rate limit'))) {
        if (attempt === maxRetries) {
          toast.error('Rate limit reached. Please try again later.');
          throw new RateLimitError('Rate limit reached. Please try again later.');
        }
        
        // Show toast for rate limit
        toast.error(`Rate limit reached. Retrying in ${Math.round(delay/1000)} seconds...`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Increase delay for next attempt
        delay = Math.min(delay * backoffFactor, maxDelay);
        continue;
      }
      
      // For other errors, throw immediately
      throw error;
    }
  }

  throw lastError!;
} 