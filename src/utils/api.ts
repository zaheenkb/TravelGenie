import { TripInputs, Trip } from '../types';

// For local development, use localhost:54321 as per supabase/config.toml
const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL 
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : 'http://localhost:54321/functions/v1';

export async function generateItinerary(inputs: TripInputs): Promise<Trip> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-itinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // For local development, we don't need auth headers
        ...(import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.PROD && {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        })
      },
      body: JSON.stringify(inputs)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to generate itinerary');
    }

    return result.data;
  } catch (error) {
    console.error('API Error:', error);
    // Fallback to local generation if API fails
    const { generateTrip } = await import('./tripGenerator');
    return generateTrip(inputs);
  }
}