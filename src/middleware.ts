import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/auth/verify'];
const isPublicRoute = (path: string) => publicRoutes.some(route => path.startsWith(route));

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

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
      // Redirect authenticated users away from auth pages to dashboard
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

      // Only allow work.rparagoso@gmail.com to access admin routes
      if (session.user.email !== 'work.rparagoso@gmail.com') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Check if the user is trying to access protected routes
    if (req.nextUrl.pathname.startsWith('/dashboard') || 
        req.nextUrl.pathname.startsWith('/settings') ||
        req.nextUrl.pathname.startsWith('/goals') ||
        req.nextUrl.pathname.startsWith('/transactions') ||
        req.nextUrl.pathname.startsWith('/accounts')) {
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