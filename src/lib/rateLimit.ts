import { toast } from 'react-hot-toast';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitRecord> = new Map();

  constructor(public config: RateLimitConfig) {}

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return false;
    }

    if (record.count >= this.config.maxRequests) {
      return true;
    }

    record.count++;
    return false;
  }

  getRemainingTime(identifier: string): number {
    const record = this.requests.get(identifier);
    if (!record) return 0;
    return Math.max(0, record.resetTime - Date.now());
  }

  getRemainingRequests(identifier: string): number {
    const record = this.requests.get(identifier);
    if (!record) return this.config.maxRequests;
    return Math.max(0, this.config.maxRequests - record.count);
  }
}

// Create rate limiters for different endpoints
export const authRateLimiter = new RateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000 }); // 5 requests per 15 minutes
export const apiRateLimiter = new RateLimiter({ maxRequests: 100, windowMs: 60 * 1000 }); // 100 requests per minute
export const chatRateLimiter = new RateLimiter({ maxRequests: 10, windowMs: 60 * 1000 }); // 10 requests per minute
export const signupRateLimiter = new RateLimiter({ maxRequests: 3, windowMs: 60 * 60 * 1000 }); // 3 signups per hour

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
  } = {}
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
      
      if (error instanceof RateLimitError || 
          (error instanceof Error && error.message.includes('rate limit'))) {
        if (attempt === maxRetries) {
          toast.error('Rate limit reached. Please try again later.');
          throw new RateLimitError('Rate limit reached. Please try again later.');
        }
        
        toast.error(`Rate limit reached. Retrying in ${Math.round(delay/1000)} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * backoffFactor, maxDelay);
        continue;
      }
      
      throw error;
    }
  }

  throw lastError!;
}

// Rate limiting middleware for API routes
export function createRateLimitMiddleware(limiter: RateLimiter) {
  return (request: Request) => {
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const identifier = `${clientIP}-${userAgent}`;

    if (limiter.isRateLimited(identifier)) {
      const remainingTime = limiter.getRemainingTime(identifier);
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil(remainingTime / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(remainingTime / 1000).toString(),
            'X-RateLimit-Limit': limiter.config.maxRequests.toString(),
            'X-RateLimit-Remaining': limiter.getRemainingRequests(identifier).toString(),
            'X-RateLimit-Reset': new Date(Date.now() + remainingTime).toISOString()
          }
        }
      );
    }

    return null; // Continue with the request
  };
} 