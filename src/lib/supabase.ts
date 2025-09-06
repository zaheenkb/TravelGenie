import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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