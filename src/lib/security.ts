import { NextRequest, NextResponse } from 'next/server';
import { createRateLimitMiddleware, signupRateLimiter } from './rateLimit';
import { CSRFProtection } from './csrf';
import { validateAndSanitizeInput, sanitizeHtml, sanitizeSql } from './validation';

// Security middleware for API routes
export function withSecurity(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    rateLimit?: boolean;
    csrfProtection?: boolean;
    inputValidation?: boolean;
  } = {}
) {
  return async (req: NextRequest) => {
    try {
      // Rate limiting
      if (options.rateLimit) {
        const rateLimitResponse = createRateLimitMiddleware(signupRateLimiter)(req);
        if (rateLimitResponse) {
          return rateLimitResponse;
        }
      }

      // CSRF protection
      if (options.csrfProtection) {
        const token = CSRFProtection.getTokenFromRequest(req);
        if (!token || !CSRFProtection.validateToken(token)) {
          return NextResponse.json(
            { error: 'Invalid or missing CSRF token' },
            { status: 403 }
          );
        }
      }

      // Input validation and sanitization
      if (options.inputValidation) {
        const body = await req.json().catch(() => ({}));
        const sanitizedBody = sanitizeRequestBody(body);
        
        // Create a new request with sanitized body
        const sanitizedReq = new NextRequest(req.url, {
          method: req.method,
          headers: req.headers,
          body: JSON.stringify(sanitizedBody)
        });

        return handler(sanitizedReq);
      }

      return handler(req);
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Sanitize request body
export function sanitizeRequestBody(body: any): any {
  if (typeof body !== 'object' || body === null) {
    return body;
  }

  const sanitized: any = {};

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(sanitizeSql(value));
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeRequestBody(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// Validate API request headers
export function validateHeaders(req: NextRequest): { valid: boolean; error?: string } {
  const contentType = req.headers.get('content-type');
  const userAgent = req.headers.get('user-agent');

  if (!userAgent) {
    return { valid: false, error: 'Missing User-Agent header' };
  }

  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!contentType || !contentType.includes('application/json')) {
      return { valid: false, error: 'Invalid Content-Type header' };
    }
  }

  return { valid: true };
}

// Generate secure random string
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomArray[i] % chars.length);
  }
  
  return result;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Prevent timing attacks by using constant-time comparison
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

// Sanitize file uploads
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace invalid characters with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .substring(0, 255); // Limit length
}

// Validate file type
export function isValidFileType(fileName: string, allowedTypes: string[]): boolean {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
} 