import { createClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

// Supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// User store
export const user = writable(null);
