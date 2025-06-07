import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

if (!process.env.SUPABASE_URL) throw new Error('Missing env.SUPABASE_URL');
if (!process.env.SUPABASE_ANON_KEY) throw new Error('Missing env.SUPABASE_ANON_KEY');

export async function GET() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', options);
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  return NextResponse.json({ session });
} 