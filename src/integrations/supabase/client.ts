import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zkyxwdtycbuaxowmvzqe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpreXh3ZHR5Y2J1YXhvd212enFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMzIzODYsImV4cCI6MjA0OTcwODM4Nn0.BMXzMmVbfKnbsgabadZ2AAxrJiljoklQFLUhjyiiGfM";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);