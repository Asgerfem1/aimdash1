import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zkyxwdtycbuaxowmvzqe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpreXh3ZHR5Y2J1YXhvd212enFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMzIzODYsImV4cCI6MjA0OTcwODM4Nn0.BMXzMmVbfKnbsgabadZ2AAxrJiljoklQFLUhjyiiGfM";

if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_ANON_KEY');

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
    },
  }
);

// Clear any potentially corrupted session data
const clearSession = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

// If there's a session error, clear it
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
    clearSession();
  }
});