
import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key missing from environment variables.');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
