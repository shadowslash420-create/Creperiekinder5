import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from backend config endpoint
let supabaseClient: ReturnType<typeof createClient> | null = null;

export async function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      console.error('Missing Supabase configuration from server');
      throw new Error('Supabase configuration not available');
    }

    supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey);
    return supabaseClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw error;
  }
}

// For convenience, export a promise that resolves to the client
export const supabasePromise = getSupabaseClient();
