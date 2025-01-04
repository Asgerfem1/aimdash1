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

// Implement request interceptor for performance monitoring
supabase.rest.interceptors.request.use(async (config) => {
  config.headers = {
    ...config.headers,
    'X-Request-Start': Date.now().toString(),
  };
  return config;
});

// Implement response interceptor for performance monitoring
supabase.rest.interceptors.response.use(
  (response) => {
    const requestStart = parseInt(response.headers.get('X-Request-Start') || '0');
    const requestDuration = Date.now() - requestStart;
    
    // Log slow requests (over 1000ms)
    if (requestDuration > 1000) {
      console.warn(`Slow request detected: ${requestDuration}ms`, {
        url: response.url,
        duration: requestDuration,
      });
    }
    
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default supabase;