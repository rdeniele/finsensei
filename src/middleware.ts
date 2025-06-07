import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next();
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              path: '/',
            });
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              path: '/',
              maxAge: 0,
            });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/callback'];
    const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (session && isPublicRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!session && !isPublicRoute) {
      const redirectUrl = new URL('/auth/signin', request.url);
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
}; 