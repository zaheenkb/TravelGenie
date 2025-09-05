import { TripInputs, Trip, DayPlan, Activity } from '../types';

const activityTemplates = {
  culture: [
    { name: 'Visit Local Museum', type: 'Culture', duration: '2-3 hours', cost: { low: '$10-15', medium: '$15-25', high: '$25-40' } },
    { name: 'Explore Historic District', type: 'Culture', duration: '2-4 hours', cost: { low: 'Free', medium: '$5-10', high: '$15-25' } },
    { name: 'Art Gallery Tour', type: 'Culture', duration: '1-2 hours', cost: { low: '$5-10', medium: '$15-20', high: '$20-35' } },
    { name: 'Local Architecture Walk', type: 'Culture', duration: '1-3 hours', cost: { low: 'Free', medium: '$10-15', high: '$20-30' } },
    { name: 'Cultural Workshop', type: 'Culture', duration: '2-3 hours', cost: { low: '$20-30', medium: '$40-60', high: '$80-120' } }
  ],
  food: [
    { name: 'Street Food Tour', type: 'Food', duration: '2-3 hours', cost: { low: '$15-25', medium: '$30-50', high: '$60-90' } },
    { name: 'Local Market Visit', type: 'Food', duration: '1-2 hours', cost: { low: '$10-20', medium: '$20-35', high: '$40-60' } },
    { name: 'Cooking Class', type: 'Food', duration: '3-4 hours', cost: { low: '$40-60', medium: '$70-100', high: '$120-180' } },
    { name: 'Wine/Beer Tasting', type: 'Food', duration: '2-3 hours', cost: { low: '$25-40', medium: '$50-80', high: '$100-150' } },
    { name: 'Traditional Restaurant', type: 'Food', duration: '1-2 hours', cost: { low: '$15-30', medium: '$40-70', high: '$80-150' } }
  ],
  nature: [
    { name: 'City Park Exploration', type: 'Nature', duration: '2-3 hours', cost: { low: 'Free', medium: '$5-10', high: '$15-25' } },
    { name: 'Hiking Trail', type: 'Nature', duration: '3-5 hours', cost: { low: 'Free', medium: '$10-20', high: '$30-50' } },
    { name: 'Botanical Garden Visit', type: 'Nature', duration: '1-2 hours', cost: { low: '$8-15', medium: '$15-25', high: '$25-40' } },
    { name: 'Scenic Viewpoint', type: 'Nature', duration: '1-2 hours', cost: { low: 'Free', medium: '$5-15', high: '$20-35' } },
    { name: 'Nature Photography Tour', type: 'Nature', duration: '3-4 hours', cost: { low: '$30-50', medium: '$60-90', high: '$120-180' } }
  ],
  nightlife: [
    { name: 'Local Bar Crawl', type: 'Nightlife', duration: '3-4 hours', cost: { low: '$30-50', medium: '$60-100', high: '$120-200' } },
    { name: 'Live Music Venue', type: 'Nightlife', duration: '2-3 hours', cost: { low: '$15-25', medium: '$30-50', high: '$60-100' } },
    { name: 'Rooftop Cocktails', type: 'Nightlife', duration: '2-3 hours', cost: { low: '$40-60', medium: '$80-120', high: '$150-250' } },
    { name: 'Night Market', type: 'Nightlife', duration: '2-3 hours', cost: { low: '$10-20', medium: '$25-40', high: '$50-80' } },
    { name: 'Dance Club', type: 'Nightlife', duration: '3-5 hours', cost: { low: '$20-35', medium: '$40-70', high: '$80-150' } }
  ],
  shopping: [
    { name: 'Local Artisan Markets', type: 'Shopping', duration: '2-3 hours', cost: { low: '$20-40', medium: '$50-100', high: '$150-300' } },
    { name: 'Vintage Shopping District', type: 'Shopping', duration: '2-4 hours', cost: { low: '$15-50', medium: '$50-150', high: '$200-500' } },
    { name: 'Souvenir Shopping', type: 'Shopping', duration: '1-2 hours', cost: { low: '$10-30', medium: '$30-80', high: '$100-200' } },
    { name: 'Local Boutiques', type: 'Shopping', duration: '2-3 hours', cost: { low: '$30-80', medium: '$100-250', high: '$300-600' } },
    { name: 'Shopping Mall', type: 'Shopping', duration: '2-4 hours', cost: { low: '$25-75', medium: '$75-200', high: '$250-500' } }
  ],
  'kid-friendly': [
    { name: 'Children\'s Museum', type: 'Family', duration: '2-3 hours', cost: { low: '$10-20', medium: '$20-35', high: '$35-55' } },
    { name: 'Zoo or Aquarium', type: 'Family', duration: '3-4 hours', cost: { low: '$15-25', medium: '$25-40', high: '$40-65' } },
    { name: 'Playground & Park', type: 'Family', duration: '1-2 hours', cost: { low: 'Free', medium: '$5-10', high: '$15-25' } },
    { name: 'Family-Friendly Show', type: 'Family', duration: '1-2 hours', cost: { low: '$20-40', medium: '$40-70', high: '$80-150' } },
    { name: 'Interactive Science Center', type: 'Family', duration: '2-4 hours', cost: { low: '$15-30', medium: '$30-50', high: '$50-80' } }
  ]
};

const transportOptions = [
  'Walking (5-10 minutes)',
  'Walking (10-15 minutes)',
  'Public transport (15-20 minutes)',
  'Public transport (20-30 minutes)',
  'Taxi/Uber (10-15 minutes)',
  'Taxi/Uber (15-25 minutes)'
];

const timeSlots = {
  relaxed: ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'],
  standard: ['8:30 AM', '10:30 AM', '1:00 PM', '3:30 PM', '6:00 PM'],
  intense: ['8:00 AM', '10:00 AM', '12:00 PM', '2:30 PM', '5:00 PM', '7:30 PM']
};

export function generateTrip(inputs: TripInputs): Trip {
  const startDate = new Date(inputs.startDate);
  const endDate = new Date(inputs.endDate);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const itinerary: DayPlan[] = [];
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const activities = generateDayActivities(inputs, i + 1);
    
    itinerary.push({
      date: currentDate.toISOString().split('T')[0],
      dayNumber: i + 1,
      activities
    });
  }
  
  return {
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
  };
}

function generateDayActivities(inputs: TripInputs, dayNumber: number): Activity[] {
  const activities: Activity[] = [];
  const slots = timeSlots[inputs.pace];
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
  
  for (let i = 0; i < Math.min(numActivities, slots.length); i++) {
    const template = relevantTemplates[Math.floor(Math.random() * relevantTemplates.length)];
    const transport = i > 0 ? transportOptions[Math.floor(Math.random() * transportOptions.length)] : undefined;
    
    activities.push({
      id: `${dayNumber}-${i + 1}`,
      name: `${template.name} in ${inputs.destination}`,
      type: template.type,
      time: slots[i],
      duration: template.duration,
      description: `Experience authentic ${template.type.toLowerCase()} in ${inputs.destination}`,
      cost: template.cost[inputs.budget],
      transport
    });
  }
  
  return activities;
}