import { createClient } from '@supabase/supabase-js';

// Read environment variables - these must be prefixed with VITE_ to be accessible in the browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback to local development values if env vars are not set
const defaultUrl = 'http://localhost:54321';
const defaultAnonKey = 'your-anon-key';

// Configure auth URL for local development
export const supabase = createClient(
  supabaseUrl || defaultUrl, 
  supabaseAnonKey || defaultAnonKey, 
  {
    auth: {
      url: import.meta.env.VITE_SUPABASE_URL ? undefined : 'http://localhost:54326'
    }
  }
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