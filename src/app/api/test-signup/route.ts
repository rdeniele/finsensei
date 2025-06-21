import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('Attempting signup with:', { email, password });

    // Attempt signup with more specific options
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/auth/signin`,
        data: {
          email: email,
          name: email.split('@')[0] // Use email prefix as name
        }
      }
    });

    console.log('Signup response:', { data, error });

    if (error) {
      console.error('Signup error:', error);
      
      // Handle specific error cases
      if (error.message.includes('Anonymous sign-ins are disabled')) {
        return NextResponse.json({ 
          error: 'Signup is currently disabled. Please check your Supabase authentication settings.',
          code: 'ANONYMOUS_SIGNINS_DISABLED',
          details: 'Go to Supabase Dashboard > Authentication > Settings and ensure "Enable email signups" is ON'
        }, { status: 400 });
      }
      
      if (error.message.includes('already registered')) {
        return NextResponse.json({ 
          error: 'This email is already registered. Please sign in instead.',
          code: 'USER_EXISTS'
        }, { status: 400 });
      }

      return NextResponse.json({ 
        error: error.message,
        code: error.status,
        details: error
      }, { status: 400 });
    }

    // Check if we need to manually create a profile
    if (data.user && !data.session) {
      try {
        // Manually create profile if trigger didn't work
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: data.user.id,
              name: email.split('@')[0],
              email: email,
              coins: 100,
              last_daily_refresh: new Date().toISOString().split('T')[0]
            }
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't fail the signup if profile creation fails
        }
      } catch (profileError) {
        console.error('Profile creation failed:', profileError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Please check your email to verify your account',
      data,
      requiresConfirmation: !data.session
    });

  } catch (error: any) {
    console.error('Unexpected error during signup:', error);
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred',
      details: error
    }, { status: 500 });
  }
} 