import { TripInputs, Trip } from '../types';
import { supabase } from '../lib/supabase';

// Type definitions for better error handling
interface ApiError {
  status?: number;
  message: string;
  details?: string;
}

interface EdgeFunctionResponse {
  success: boolean;
  data?: Trip;
  error?: string;
}

export async function generateItinerary(inputs: TripInputs): Promise<Trip> {
  // Check if Supabase is properly configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'your-supabase-url' || 
      supabaseAnonKey === 'your-supabase-anon-key') {
    console.warn('Supabase not configured, using local generation');
    return fallbackToLocalGeneration(inputs);
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-itinerary', {
      body: inputs
    });

    if (error) {
      console.warn('Edge Function failed, falling back to local generation:', error);
      return fallbackToLocalGeneration(inputs);
    }

    const response = data as EdgeFunctionResponse;
    
    if (!response.success) {
      console.warn('Edge Function returned error, falling back to local generation:', response.error);
      return fallbackToLocalGeneration(inputs);
    }

    if (!response.data) {
      console.warn('No data from Edge Function, falling back to local generation');
      return fallbackToLocalGeneration(inputs);
    }

    const trip = response.data;
    if (!trip.id) {
      trip.id = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    return trip;

  } catch (error: any) {
    console.warn('Edge Function error, falling back to local generation:', error.message);
    return fallbackToLocalGeneration(inputs);
  }
}

// Fallback function that generates trips locally if Edge Function fails
async function fallbackToLocalGeneration(inputs: TripInputs): Promise<Trip> {
  try {
    const { generateTrip } = await import('./tripGenerator');
    const trip = generateTrip(inputs);
    
    // Ensure fallback trip also has a unique ID
    if (!trip.id) {
      trip.id = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    console.log('Generated trip locally as fallback');
    return trip;
  } catch (fallbackError) {
    console.error('Fallback generation also failed:', fallbackError);
    throw new Error('Both Edge Function and local generation failed');
  }
}

/*
Test checklist:
1. Confirm VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined and accessible (check console.log in dev)
2. Submit the form and open DevTools → Network. Verify an OPTIONS preflight succeeds, followed by a 200/4xx from the function
3. Confirm the function now produces logs in Supabase (which proves the request reached the server)
4. If it still fails, the function will fall back to local generation automatically

Commands to deploy and test:
- supabase functions deploy generate-itinerary
- supabase functions list
*/