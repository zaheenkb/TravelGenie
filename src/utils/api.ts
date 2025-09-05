import { TripInputs, Trip } from '../types';

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL 
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : '/api';

export async function generateItinerary(inputs: TripInputs): Promise<Trip> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-itinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(import.meta.env.VITE_SUPABASE_ANON_KEY && {
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