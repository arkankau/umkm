import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';

export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey);
};

export const createServerClientWithAuth = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookieStore = await cookies();
  const authToken = cookieStore.get('sb-access-token')?.value;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });

  if (authToken) {
    await client.auth.setSession({
      access_token: authToken,
      refresh_token: cookieStore.get('sb-refresh-token')?.value || '',
    });
  }

  return client;
};