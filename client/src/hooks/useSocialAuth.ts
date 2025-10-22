import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import type { Provider } from '@supabase/supabase-js';

export function useSocialAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithProvider = async (provider: Provider) => {
    setLoading(true);
    setError(null);

    try {
      const supabase = await getSupabaseClient();
      
      // Get the current window location for redirect
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (signInError) {
        throw signInError;
      }

      // Browser will redirect to OAuth provider
      return data;
    } catch (err: any) {
      console.error('Social auth error:', err);
      setError(err.message || 'Failed to sign in with provider');
      setLoading(false);
      throw err;
    }
  };

  return {
    signInWithProvider,
    loading,
    error,
  };
}
