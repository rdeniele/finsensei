import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authRateLimiter, apiRateLimiter, createRateLimitMiddleware } from '@/lib/rateLimit';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/auth/verify'];
const isPublicRoute = (path: string) => publicRoutes.some(route => path.startsWith(route));

// Admin configuration - use environment variable for better security
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || ['work.rparagoso@gmail.com'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Rate limiting
  const clientIP = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const identifier = `${clientIP}-${userAgent}`;

  // Apply rate limiting based on route
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    if (authRateLimiter.isRateLimited(identifier)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  } else if (req.nextUrl.pathname.startsWith('/api')) {
    if (apiRateLimiter.isRateLimited(identifier)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  try {
    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession();

    // Handle session refresh errors
    if (error) {
      console.error('Session refresh error:', error);
      if (!isPublicRoute(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      return res;
    }

    // If user is on a public route
    if (isPublicRoute(req.nextUrl.pathname)) {
      // Only redirect authenticated users away from auth pages to dashboard
      if (session && (req.nextUrl.pathname === '/auth/signin' || req.nextUrl.pathname === '/auth/signup')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return res;
    }

    // Check if the user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!session) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }

      // Check if user is in admin emails list
      if (!ADMIN_EMAILS.includes(session.user.email || '')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Check if the user is trying to access protected routes
    if (req.nextUrl.pathname.startsWith('/dashboard') || 
        req.nextUrl.pathname.startsWith('/settings') ||
        req.nextUrl.pathname.startsWith('/goals') ||
        req.nextUrl.pathname.startsWith('/transactions') ||
        req.nextUrl.pathname.startsWith('/accounts') ||
        req.nextUrl.pathname.startsWith('/coins') ||
        req.nextUrl.pathname.startsWith('/coach')) {
      if (!session) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    if (!isPublicRoute(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    return res;
  }
}

// Specify which routes should be protected
export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/goals/:path*',
    '/transactions/:path*',
    '/accounts/:path*',
    '/settings/:path*',
    '/coins/:path*',
    '/coach/:path*',
    '/api/:path*',
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 