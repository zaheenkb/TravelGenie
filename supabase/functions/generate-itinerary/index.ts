interface ItineraryRequest {
  destination: string;
  from?: string;
  travelers: number;
  startDate: string;
  endDate: string;
  budget: 'low' | 'medium' | 'high';
  pace: 'relaxed' | 'standard' | 'intense';
  interests: string[];
}

interface Activity {
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

interface DayPlan {
  date: string;
  dayNumber: number;
  weather?: {
    condition: string;
    temperature: string;
    note: string;
  };
  activities: Activity[];
}

interface ItineraryResponse {
  success: boolean;
  data?: {
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
  };
  error?: string;
}

const activityTemplates = {
  culture: [
    { 
      name: 'Visit Local Museum', 
      type: 'Culture', 
      duration: '2-3 hours', 
      cost: { low: '$10-15', medium: '$15-25', high: '$25-40' },
      neighborhoods: ['Downtown', 'Arts District', 'Historic Center', 'Museum Quarter'],
      openHours: { start: 9, end: 17 }
    },
    { 
      name: 'Explore Historic District', 
      type: 'Culture', 
      duration: '2-4 hours', 
      cost: { low: 'Free', medium: '$5-10', high: '$15-25' },
      neighborhoods: ['Old Town', 'Historic Center', 'Heritage District', 'Colonial Quarter'],
      openHours: { start: 8, end: 20 }
    },
    { 
      name: 'Art Gallery Tour', 
      type: 'Culture', 
      duration: '1-2 hours', 
      cost: { low: '$5-10', medium: '$15-20', high: '$20-35' },
      neighborhoods: ['Arts District', 'Gallery Row', 'Creative Quarter', 'Downtown'],
      openHours: { start: 10, end: 18 }
    },
    { 
      name: 'Local Architecture Walk', 
      type: 'Culture', 
      duration: '1-3 hours', 
      cost: { low: 'Free', medium: '$10-15', high: '$20-30' },
      neighborhoods: ['Downtown', 'Historic Center', 'Financial District', 'Old Town'],
      openHours: { start: 8, end: 19 }
    },
    { 
      name: 'Cultural Workshop', 
      type: 'Culture', 
      duration: '2-3 hours', 
      cost: { low: '$20-30', medium: '$40-60', high: '$80-120' },
      neighborhoods: ['Arts District', 'Cultural Center', 'Community Hub', 'Creative Quarter'],
      openHours: { start: 10, end: 16 }
    }
  ],
  food: [
    { 
      name: 'Street Food Tour', 
      type: 'Food', 
      duration: '2-3 hours', 
      cost: { low: '$15-25', medium: '$30-50', high: '$60-90' },
      neighborhoods: ['Food District', 'Night Market', 'Local Quarter', 'Street Food Hub'],
      openHours: { start: 11, end: 22 }
    },
    { 
      name: 'Local Market Visit', 
      type: 'Food', 
      duration: '1-2 hours', 
      cost: { low: '$10-20', medium: '$20-35', high: '$40-60' },
      neighborhoods: ['Market District', 'Local Market', 'Farmers Market', 'Central Market'],
      openHours: { start: 7, end: 15 }
    },
    { 
      name: 'Cooking Class', 
      type: 'Food', 
      duration: '3-4 hours', 
      cost: { low: '$40-60', medium: '$70-100', high: '$120-180' },
      neighborhoods: ['Culinary District', 'Local Kitchen', 'Food Center', 'Cooking School'],
      openHours: { start: 10, end: 16 }
    },
    { 
      name: 'Wine/Beer Tasting', 
      type: 'Food', 
      duration: '2-3 hours', 
      cost: { low: '$25-40', medium: '$50-80', high: '$100-150' },
      neighborhoods: ['Wine District', 'Brewery Quarter', 'Tasting Room', 'Local Vineyard'],
      openHours: { start: 14, end: 22 }
    },
    { 
      name: 'Traditional Restaurant', 
      type: 'Food', 
      duration: '1-2 hours', 
      cost: { low: '$15-30', medium: '$40-70', high: '$80-150' },
      neighborhoods: ['Restaurant Row', 'Local District', 'Food Quarter', 'Dining District'],
      openHours: { start: 11, end: 23 }
    }
  ],
  nature: [
    { 
      name: 'City Park Exploration', 
      type: 'Nature', 
      duration: '2-3 hours', 
      cost: { low: 'Free', medium: '$5-10', high: '$15-25' },
      neighborhoods: ['Central Park', 'Green District', 'Park Area', 'Nature Reserve'],
      openHours: { start: 6, end: 20 }
    },
    { 
      name: 'Hiking Trail', 
      type: 'Nature', 
      duration: '3-5 hours', 
      cost: { low: 'Free', medium: '$10-20', high: '$30-50' },
      neighborhoods: ['Nature Reserve', 'Trail Head', 'Mountain Area', 'Forest District'],
      openHours: { start: 6, end: 18 }
    },
    { 
      name: 'Botanical Garden Visit', 
      type: 'Nature', 
      duration: '1-2 hours', 
      cost: { low: '$8-15', medium: '$15-25', high: '$25-40' },
      neighborhoods: ['Garden District', 'Botanical Area', 'Green Quarter', 'Nature Center'],
      openHours: { start: 8, end: 17 }
    },
    { 
      name: 'Scenic Viewpoint', 
      type: 'Nature', 
      duration: '1-2 hours', 
      cost: { low: 'Free', medium: '$5-15', high: '$20-35' },
      neighborhoods: ['Viewpoint Area', 'Scenic District', 'Lookout Point', 'Hill District'],
      openHours: { start: 6, end: 21 }
    },
    { 
      name: 'Nature Photography Tour', 
      type: 'Nature', 
      duration: '3-4 hours', 
      cost: { low: '$30-50', medium: '$60-90', high: '$120-180' },
      neighborhoods: ['Nature Reserve', 'Scenic Area', 'Wildlife District', 'Photo Spots'],
      openHours: { start: 7, end: 17 }
    }
  ],
  nightlife: [
    { 
      name: 'Local Bar Crawl', 
      type: 'Nightlife', 
      duration: '3-4 hours', 
      cost: { low: '$30-50', medium: '$60-100', high: '$120-200' },
      neighborhoods: ['Entertainment District', 'Bar Quarter', 'Nightlife Area', 'Party District'],
      openHours: { start: 18, end: 2 }
    },
    { 
      name: 'Live Music Venue', 
      type: 'Nightlife', 
      duration: '2-3 hours', 
      cost: { low: '$15-25', medium: '$30-50', high: '$60-100' },
      neighborhoods: ['Music District', 'Live Venue Area', 'Concert Hall', 'Entertainment Quarter'],
      openHours: { start: 19, end: 1 }
    },
    { 
      name: 'Rooftop Cocktails', 
      type: 'Nightlife', 
      duration: '2-3 hours', 
      cost: { low: '$40-60', medium: '$80-120', high: '$150-250' },
      neighborhoods: ['Rooftop District', 'Sky Bar Area', 'High-rise Quarter', 'View District'],
      openHours: { start: 17, end: 1 }
    },
    { 
      name: 'Night Market', 
      type: 'Nightlife', 
      duration: '2-3 hours', 
      cost: { low: '$10-20', medium: '$25-40', high: '$50-80' },
      neighborhoods: ['Night Market', 'Evening District', 'Street Market', 'Local Night Scene'],
      openHours: { start: 18, end: 24 }
    },
    { 
      name: 'Dance Club', 
      type: 'Nightlife', 
      duration: '3-5 hours', 
      cost: { low: '$20-35', medium: '$40-70', high: '$80-150' },
      neighborhoods: ['Club District', 'Dance Quarter', 'Party Area', 'Nightclub Row'],
      openHours: { start: 21, end: 4 }
    }
  ],
  shopping: [
    { 
      name: 'Local Artisan Markets', 
      type: 'Shopping', 
      duration: '2-3 hours', 
      cost: { low: '$20-40', medium: '$50-100', high: '$150-300' },
      neighborhoods: ['Artisan Quarter', 'Craft Market', 'Local Market', 'Handmade District'],
      openHours: { start: 9, end: 17 }
    },
    { 
      name: 'Vintage Shopping District', 
      type: 'Shopping', 
      duration: '2-4 hours', 
      cost: { low: '$15-50', medium: '$50-150', high: '$200-500' },
      neighborhoods: ['Vintage Quarter', 'Antique District', 'Retro Area', 'Second-hand Row'],
      openHours: { start: 10, end: 18 }
    },
    { 
      name: 'Souvenir Shopping', 
      type: 'Shopping', 
      duration: '1-2 hours', 
      cost: { low: '$10-30', medium: '$30-80', high: '$100-200' },
      neighborhoods: ['Tourist District', 'Souvenir Row', 'Gift Quarter', 'Memorial Area'],
      openHours: { start: 9, end: 19 }
    },
    { 
      name: 'Local Boutiques', 
      type: 'Shopping', 
      duration: '2-3 hours', 
      cost: { low: '$30-80', medium: '$100-250', high: '$300-600' },
      neighborhoods: ['Fashion District', 'Boutique Row', 'Designer Quarter', 'Style Area'],
      openHours: { start: 10, end: 19 }
    },
    { 
      name: 'Shopping Mall', 
      type: 'Shopping', 
      duration: '2-4 hours', 
      cost: { low: '$25-75', medium: '$75-200', high: '$250-500' },
      neighborhoods: ['Shopping Center', 'Mall District', 'Retail Quarter', 'Commercial Area'],
      openHours: { start: 10, end: 21 }
    }
  ],
  'kid-friendly': [
    { 
      name: 'Children\'s Museum', 
      type: 'Family', 
      duration: '2-3 hours', 
      cost: { low: '$10-20', medium: '$20-35', high: '$35-55' },
      neighborhoods: ['Family District', 'Museum Quarter', 'Kids Area', 'Educational Center'],
      openHours: { start: 9, end: 17 }
    },
    { 
      name: 'Zoo or Aquarium', 
      type: 'Family', 
      duration: '3-4 hours', 
      cost: { low: '$15-25', medium: '$25-40', high: '$40-65' },
      neighborhoods: ['Zoo District', 'Animal Park', 'Aquarium Area', 'Wildlife Center'],
      openHours: { start: 9, end: 17 }
    },
    { 
      name: 'Playground & Park', 
      type: 'Family', 
      duration: '1-2 hours', 
      cost: { low: 'Free', medium: '$5-10', high: '$15-25' },
      neighborhoods: ['Family Park', 'Playground Area', 'Kids District', 'Recreation Center'],
      openHours: { start: 6, end: 20 }
    },
    { 
      name: 'Family-Friendly Show', 
      type: 'Family', 
      duration: '1-2 hours', 
      cost: { low: '$20-40', medium: '$40-70', high: '$80-150' },
      neighborhoods: ['Theater District', 'Entertainment Quarter', 'Show Area', 'Performance Center'],
      openHours: { start: 14, end: 20 }
    },
    { 
      name: 'Interactive Science Center', 
      type: 'Family', 
      duration: '2-4 hours', 
      cost: { low: '$15-30', medium: '$30-50', high: '$50-80' },
      neighborhoods: ['Science District', 'Discovery Center', 'Learning Quarter', 'Innovation Hub'],
      openHours: { start: 9, end: 17 }
    }
  ]
};

const travelNotes = [
  'Walking distance (5-10 minutes)',
  'Walking distance (10-15 minutes)',
  'Short walk (15-20 minutes)',
  'Public transport recommended (15-20 minutes)',
  'Public transport recommended (20-30 minutes)',
  'Taxi/rideshare suggested (10-15 minutes)',
  'Taxi/rideshare suggested (15-25 minutes)',
  'Metro/subway (20-25 minutes)',
  'Bus route available (25-35 minutes)'
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function getWeatherData(destination: string, startDate: string, endDate: string) {
  try {
    // Use Open-Meteo API (free, no API key required)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    // Only fetch weather if dates are within next 7 days
    const daysDiff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 7 || daysDiff < -1) {
      return null;
    }

    // For demo purposes, we'll use a generic location (latitude/longitude)
    // In a real app, you'd geocode the destination first
    const lat = 40.7128; // Default to NYC coordinates
    const lon = -74.0060;
    
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&start_date=${startDate}&end_date=${endDate}&timezone=auto`;
    
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // Map weather codes to conditions
    const getWeatherCondition = (code: number) => {
      if (code === 0) return 'Clear';
      if (code <= 3) return 'Partly Cloudy';
      if (code <= 48) return 'Foggy';
      if (code <= 67) return 'Rainy';
      if (code <= 77) return 'Snowy';
      if (code <= 82) return 'Showers';
      if (code <= 99) return 'Thunderstorms';
      return 'Variable';
    };

    return data.daily.time.map((date: string, index: number) => ({
      date,
      condition: getWeatherCondition(data.daily.weathercode[index]),
      maxTemp: Math.round(data.daily.temperature_2m_max[index]),
      minTemp: Math.round(data.daily.temperature_2m_min[index]),
      unit: data.daily_units.temperature_2m_max
    }));
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
}

function generateTimeSlots(pace: string, openHours: { start: number; end: number }) {
  const slots = {
    relaxed: [9, 11.5, 14, 16.5],
    standard: [8.5, 10.5, 13, 15.5, 18],
    intense: [8, 10, 12, 14.5, 17, 19.5]
  };

  const baseSlots = slots[pace as keyof typeof slots];
  
  // Filter slots to respect opening hours
  return baseSlots.filter(slot => slot >= openHours.start && slot <= openHours.end);
}

function formatTime(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
}

function generateDayActivities(
  inputs: ItineraryRequest, 
  dayNumber: number, 
  weather?: any
): Activity[] {
  const activities: Activity[] = [];
  const numActivities = inputs.pace === 'relaxed' ? 3 : inputs.pace === 'standard' ? 4 : 5;
  
  // Get relevant activity templates based on interests
  const relevantTemplates: any[] = [];
  inputs.interests.forEach(interest => {
    if (activityTemplates[interest as keyof typeof activityTemplates]) {
      relevantTemplates.push(...activityTemplates[interest as keyof typeof activityTemplates]);
    }
  });
  
  // Add some general activities if no interests selected
  if (relevantTemplates.length === 0) {
    relevantTemplates.push(...activityTemplates.culture, ...activityTemplates.nature);
  }
  
  // Adjust activities based on weather
  let filteredTemplates = relevantTemplates;
  if (weather && (weather.condition === 'Rainy' || weather.condition === 'Thunderstorms')) {
    // Prefer indoor activities during bad weather
    filteredTemplates = relevantTemplates.filter(t => 
      t.type === 'Culture' || t.type === 'Shopping' || t.type === 'Food'
    );
    if (filteredTemplates.length === 0) {
      filteredTemplates = relevantTemplates; // Fallback
    }
  }
  
  for (let i = 0; i < numActivities; i++) {
    const template = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];
    const timeSlots = generateTimeSlots(inputs.pace, template.openHours);
    
    if (timeSlots.length === 0) continue; // Skip if no valid time slots
    
    const timeSlot = timeSlots[Math.min(i, timeSlots.length - 1)];
    const neighborhood = template.neighborhoods[Math.floor(Math.random() * template.neighborhoods.length)];
    const travelNote = i > 0 ? travelNotes[Math.floor(Math.random() * travelNotes.length)] : undefined;
    
    activities.push({
      id: `${dayNumber}-${i + 1}`,
      name: `${template.name}`,
      type: template.type,
      time: formatTime(timeSlot),
      duration: template.duration,
      description: `Experience authentic ${template.type.toLowerCase()} in ${inputs.destination}'s ${neighborhood}`,
      neighborhood: neighborhood,
      cost: template.cost[inputs.budget],
      travelNote
    });
  }
  
  return activities;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const inputs: ItineraryRequest = await req.json();
    
    // Validate required fields
    if (!inputs.destination || !inputs.startDate || !inputs.endDate) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const startDate = new Date(inputs.startDate);
    const endDate = new Date(inputs.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Get weather data if dates are within next 7 days
    const weatherData = await getWeatherData(inputs.destination, inputs.startDate, inputs.endDate);
    
    const itinerary: DayPlan[] = [];
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayWeather = weatherData ? weatherData[i] : undefined;
      const activities = generateDayActivities(inputs, i + 1, dayWeather);
      
      const dayPlan: DayPlan = {
        date: currentDate.toISOString().split('T')[0],
        dayNumber: i + 1,
        activities
      };

      // Add weather info if available
      if (dayWeather) {
        dayPlan.weather = {
          condition: dayWeather.condition,
          temperature: `${dayWeather.minTemp}°-${dayWeather.maxTemp}°${dayWeather.unit}`,
          note: getWeatherNote(dayWeather.condition, dayWeather.maxTemp)
        };
      }
      
      itinerary.push(dayPlan);
    }
    
    const response: ItineraryResponse = {
      success: true,
      data: {
        id: Date.now().toString(),
        title: inputs.from ? `${inputs.from} to ${inputs.destination} Adventure` : `${inputs.destination} Adventure`,
        destination: inputs.destination,
        travelers: inputs.travelers,
        startDate: inputs.startDate,
        endDate: inputs.endDate,
        budget: inputs.budget,
        pace: inputs.pace,
        interests: inputs.interests,
        itinerary,
        createdAt: new Date().toISOString()
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error generating itinerary:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function getWeatherNote(condition: string, maxTemp: number): string {
  const notes = {
    'Clear': maxTemp > 25 ? 'Perfect weather for outdoor activities!' : 'Great day for sightseeing!',
    'Partly Cloudy': 'Nice weather with some clouds - ideal for walking tours!',
    'Foggy': 'Atmospheric weather - great for cozy indoor activities!',
    'Rainy': 'Pack an umbrella - perfect day for museums and indoor attractions!',
    'Snowy': 'Bundle up! Great weather for winter activities and warm cafes!',
    'Showers': 'Light rain expected - indoor activities recommended!',
    'Thunderstorms': 'Stay indoors - perfect day for shopping and cultural sites!',
    'Variable': 'Weather may change - pack layers and stay flexible!'
  };
  
  return notes[condition as keyof typeof notes] || 'Check local weather for updates!';
}