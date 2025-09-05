import { supabase } from '../lib/supabase';
import { Trip, TripInputs } from '../types';

export async function saveTrip(trip: Trip, userId: string): Promise<void> {
  const { error } = await supabase
    .from('trips')
    .insert({
      user_id: userId,
      destination: trip.destination,
      start_date: trip.startDate,
      end_date: trip.endDate,
      params_json: {
        from: trip.from,
        travelers: trip.travelers,
        budget: trip.budget,
        pace: trip.pace,
        interests: trip.interests,
        title: trip.title
      },
      itinerary_json: {
        itinerary: trip.itinerary
      }
    });

  if (error) {
    throw new Error(`Failed to save trip: ${error.message}`);
  }
}

export async function fetchUserTrips(userId: string): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch trips: ${error.message}`);
  }

  return data.map(row => ({
    id: row.id,
    title: row.params_json.title || `${row.destination} Adventure`,
    destination: row.destination,
    from: row.params_json.from || '',
    travelers: row.params_json.travelers || 2,
    startDate: row.start_date,
    endDate: row.end_date,
    budget: row.params_json.budget || 'medium',
    pace: row.params_json.pace || 'standard',
    interests: row.params_json.interests || [],
    itinerary: row.itinerary_json.itinerary || [],
    createdAt: row.created_at
  }));
}

export async function deleteTrip(tripId: string): Promise<void> {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId);

  if (error) {
    throw new Error(`Failed to delete trip: ${error.message}`);
  }
}