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
  // Log environment variables in development for debugging
  if (import.meta.env.DEV) {
    console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('ANON_KEY defined:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  }

  // Validate required environment variables
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('Missing Supabase environment variables, falling back to local generation');
    return fallbackToLocalGeneration(inputs);
  }

  try {
    console.log('Calling Edge Function: generate-itinerary');
    
    // Use Supabase client to invoke the Edge Function
    // This handles CORS and authentication automatically
    const { data, error } = await supabase.functions.invoke('generate-itinerary', {
      body: inputs
    });

    // Log the response for debugging
    console.log('Edge Function response:', { data, error });

    if (error) {
      throw new Error(`Edge Function error: ${error.message || 'Unknown error'}`);
    }

    // Parse the response from the Edge Function
    const response = data as EdgeFunctionResponse;
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate itinerary');
    }

    if (!response.data) {
      throw new Error('No data returned from Edge Function');
    }

    // Ensure the trip has a unique ID
    const trip = response.data;
    if (!trip.id) {
      trip.id = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    return trip;

  } catch (error: any) {
    console.error('API Error Details:', {
      functionName: 'generate-itinerary',
      method: 'POST',
      error: error.message,
      stack: error.stack
    });

    // If the Edge Function fails, fall back to local generation
    console.warn('Edge Function failed, falling back to local generation');
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