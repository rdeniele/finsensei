import { randomBytes, createHmac } from 'crypto';

export class CSRFProtection {
  private static readonly SECRET = process.env.CSRF_SECRET || 'your-csrf-secret-key';
  private static readonly TOKEN_LENGTH = 32;

  static generateToken(): string {
    const token = randomBytes(this.TOKEN_LENGTH).toString('hex');
    const timestamp = Date.now().toString();
    const signature = createHmac('sha256', this.SECRET)
      .update(token + timestamp)
      .digest('hex');
    
    return `${token}.${timestamp}.${signature}`;
  }

  static validateToken(token: string): boolean {
    try {
      const [tokenPart, timestamp, signature] = token.split('.');
      
      if (!tokenPart || !timestamp || !signature) {
        return false;
      }

      // Check if token is expired (24 hours)
      const tokenAge = Date.now() - parseInt(timestamp);
      if (tokenAge > 24 * 60 * 60 * 1000) {
        return false;
      }

      // Verify signature
      const expectedSignature = createHmac('sha256', this.SECRET)
        .update(tokenPart + timestamp)
        .digest('hex');

      return signature === expectedSignature;
    } catch {
      return false;
    }
  }

  static getTokenFromRequest(request: Request): string | null {
    const url = new URL(request.url);
    return url.searchParams.get('csrf_token') || 
           request.headers.get('x-csrf-token') ||
           null;
  }
} 