import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'app-session',
    flowType: 'pkce',
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'Cache-Control': 'public, max-age=300', // Cache responses for 5 minutes
    },
  },
});

// Implement session cleanup
const clearSession = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.localStorage.removeItem('app-session');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

// Enhanced auth state management
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
    clearSession();
  }
  
  // Update service worker if available
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.controller?.postMessage({
      type: 'AUTH_STATE_CHANGE',
      event,
      session,
    });
  }
});

export default supabase;