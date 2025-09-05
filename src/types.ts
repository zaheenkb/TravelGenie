export interface TripInputs {
  from: string;
  destination: string;
  travelers: number;
  startDate: string;
  endDate: string;
  budget: 'low' | 'medium' | 'high';
  pace: 'relaxed' | 'standard' | 'intense';
  interests: string[];
}

export interface Activity {
  id: string;
  name: string;
  type: string;
  time: string;
  duration: string;
  description: string;
  neighborhood: string;
  cost: string;
  travelNote?: string;
}

export interface DayPlan {
  date: string;
  dayNumber: number;
  weather?: {
    condition: string;
    temperature: string;
    note: string;
  };
  activities: Activity[];
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  travelers: number;
  startDate: string;
  endDate: string;
  budget: string;
  pace: string;
  interests: string[];
  itinerary: DayPlan[];
  createdAt: string;
}