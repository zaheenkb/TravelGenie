import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your-supabase-url' && 
  supabaseAnonKey === 'your-supabase-anon-key' &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co');

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables are not properly configured. Please connect to Supabase using the "Connect to Supabase" button.');
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-anon-key'
);

export type Database = {
  public: {
    Tables: {
      trips: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          destination: string;
          start_date: string;
          end_date: string;
          params_json: any;
          itinerary_json: any;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          destination: string;
          start_date: string;
          end_date: string;
          params_json: any;
          itinerary_json: any;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          destination?: string;
          start_date?: string;
          end_date?: string;
          params_json?: any;
          itinerary_json?: any;
        };
      };
    };
  };
};