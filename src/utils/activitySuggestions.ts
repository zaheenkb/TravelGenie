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

interface ActivityTemplate {
  name: string;
  type: string;
  duration: string;
  cost: { low: string; medium: string; high: string };
  neighborhoods: string[];
  description: string;
}

const activityTemplatesByType: { [key: string]: ActivityTemplate[] } = {
  Culture: [
    {
      name: 'Local History Museum',
      type: 'Culture',
      duration: '2-3 hours',
      cost: { low: '$8-12', medium: '$15-20', high: '$25-35' },
      neighborhoods: ['Historic District', 'Museum Quarter', 'Cultural Center'],
      description: 'Discover the rich local history and heritage'
    },
    {
      name: 'Art Gallery Walk',
      type: 'Culture',
      duration: '1-2 hours',
      cost: { low: '$5-8', medium: '$12-18', high: '$20-30' },
      neighborhoods: ['Arts District', 'Gallery Row', 'Creative Quarter'],
      description: 'Explore contemporary and traditional local art'
    },
    {
      name: 'Heritage Building Tour',
      type: 'Culture',
      duration: '2-3 hours',
      cost: { low: 'Free', medium: '$8-15', high: '$18-25' },
      neighborhoods: ['Old Town', 'Historic Center', 'Heritage District'],
      description: 'Guided tour of architectural landmarks and historic buildings'
    },
    {
      name: 'Cultural Workshop',
      type: 'Culture',
      duration: '2-4 hours',
      cost: { low: '$25-35', medium: '$45-65', high: '$80-120' },
      neighborhoods: ['Cultural Center', 'Arts District', 'Community Hub'],
      description: 'Hands-on experience with local crafts and traditions'
    },
    {
      name: 'Local Library & Archives',
      type: 'Culture',
      duration: '1-2 hours',
      cost: { low: 'Free', medium: '$5-10', high: '$15-20' },
      neighborhoods: ['Downtown', 'Academic Quarter', 'Historic Center'],
      description: 'Explore rare books, documents, and local archives'
    }
  ],
  Food: [
    {
      name: 'Local Food Market',
      type: 'Food',
      duration: '1-2 hours',
      cost: { low: '$8-15', medium: '$18-30', high: '$35-50' },
      neighborhoods: ['Market District', 'Food Quarter', 'Local Market'],
      description: 'Sample fresh local produce and artisanal foods'
    },
    {
      name: 'Traditional Cooking Class',
      type: 'Food',
      duration: '3-4 hours',
      cost: { low: '$35-50', medium: '$65-85', high: '$110-150' },
      neighborhoods: ['Culinary District', 'Local Kitchen', 'Food Center'],
      description: 'Learn to prepare authentic local dishes'
    },
    {
      name: 'Food Walking Tour',
      type: 'Food',
      duration: '2-3 hours',
      cost: { low: '$20-30', medium: '$40-60', high: '$70-100' },
      neighborhoods: ['Food District', 'Restaurant Row', 'Culinary Quarter'],
      description: 'Guided tour of the best local eateries and specialties'
    },
    {
      name: 'Local Brewery/Winery',
      type: 'Food',
      duration: '2-3 hours',
      cost: { low: '$20-35', medium: '$45-70', high: '$80-120' },
      neighborhoods: ['Brewery District', 'Wine Quarter', 'Craft District'],
      description: 'Tasting of locally produced beverages with expert guidance'
    },
    {
      name: 'Farm-to-Table Restaurant',
      type: 'Food',
      duration: '1-2 hours',
      cost: { low: '$18-30', medium: '$45-75', high: '$90-150' },
      neighborhoods: ['Farm District', 'Organic Quarter', 'Local Dining'],
      description: 'Fresh, seasonal cuisine from local farms and producers'
    }
  ],
  Nature: [
    {
      name: 'Botanical Gardens',
      type: 'Nature',
      duration: '2-3 hours',
      cost: { low: '$6-12', medium: '$15-25', high: '$30-45' },
      neighborhoods: ['Garden District', 'Green Quarter', 'Nature Center'],
      description: 'Peaceful walk through diverse plant collections and themed gardens'
    },
    {
      name: 'Nature Trail Hike',
      type: 'Nature',
      duration: '2-4 hours',
      cost: { low: 'Free', medium: '$8-15', high: '$25-40' },
      neighborhoods: ['Nature Reserve', 'Trail Head', 'Forest District'],
      description: 'Scenic hiking trail with local flora and fauna'
    },
    {
      name: 'Waterfront Walk',
      type: 'Nature',
      duration: '1-2 hours',
      cost: { low: 'Free', medium: '$5-10', high: '$15-25' },
      neighborhoods: ['Waterfront', 'Harbor District', 'Coastal Area'],
      description: 'Relaxing stroll along the water with scenic views'
    },
    {
      name: 'Wildlife Observation',
      type: 'Nature',
      duration: '2-3 hours',
      cost: { low: '$10-20', medium: '$25-40', high: '$50-80' },
      neighborhoods: ['Wildlife Reserve', 'Nature Park', 'Conservation Area'],
      description: 'Guided wildlife watching with binoculars and expert commentary'
    },
    {
      name: 'Scenic Overlook',
      type: 'Nature',
      duration: '1-2 hours',
      cost: { low: 'Free', medium: '$8-15', high: '$20-35' },
      neighborhoods: ['Viewpoint Area', 'Hill District', 'Scenic Route'],
      description: 'Panoramic views of the surrounding landscape'
    }
  ],
  Nightlife: [
    {
      name: 'Local Jazz Club',
      type: 'Nightlife',
      duration: '2-3 hours',
      cost: { low: '$15-25', medium: '$30-50', high: '$60-100' },
      neighborhoods: ['Music District', 'Entertainment Quarter', 'Jazz Row'],
      description: 'Live jazz performances in an intimate setting'
    },
    {
      name: 'Craft Cocktail Bar',
      type: 'Nightlife',
      duration: '2-3 hours',
      cost: { low: '$25-40', medium: '$50-80', high: '$100-150' },
      neighborhoods: ['Cocktail District', 'Upscale Quarter', 'Bar Row'],
      description: 'Artisanal cocktails with local ingredients and expert mixology'
    },
    {
      name: 'Night Food Market',
      type: 'Nightlife',
      duration: '2-3 hours',
      cost: { low: '$12-20', medium: '$25-40', high: '$50-80' },
      neighborhoods: ['Night Market', 'Food Quarter', 'Evening District'],
      description: 'Late-night street food and local specialties'
    },
    {
      name: 'Comedy Club',
      type: 'Nightlife',
      duration: '2-3 hours',
      cost: { low: '$12-20', medium: '$25-40', high: '$45-70' },
      neighborhoods: ['Comedy District', 'Entertainment Area', 'Theater Quarter'],
      description: 'Local and touring comedians in a fun, relaxed atmosphere'
    },
    {
      name: 'Wine Bar',
      type: 'Nightlife',
      duration: '2-3 hours',
      cost: { low: '$20-35', medium: '$45-70', high: '$80-120' },
      neighborhoods: ['Wine District', 'Sophisticated Quarter', 'Tasting Room'],
      description: 'Curated selection of local and international wines'
    }
  ],
  Shopping: [
    {
      name: 'Antique Market',
      type: 'Shopping',
      duration: '2-3 hours',
      cost: { low: '$15-40', medium: '$50-120', high: '$150-300' },
      neighborhoods: ['Antique Quarter', 'Vintage District', 'Collectors Row'],
      description: 'Unique vintage finds and collectible treasures'
    },
    {
      name: 'Local Craft Fair',
      type: 'Shopping',
      duration: '1-3 hours',
      cost: { low: '$10-30', medium: '$35-80', high: '$100-200' },
      neighborhoods: ['Craft District', 'Artisan Quarter', 'Makers Market'],
      description: 'Handmade goods from local artisans and craftspeople'
    },
    {
      name: 'Designer Boutiques',
      type: 'Shopping',
      duration: '2-4 hours',
      cost: { low: '$40-100', medium: '$120-300', high: '$400-800' },
      neighborhoods: ['Fashion District', 'Designer Row', 'Luxury Quarter'],
      description: 'High-end fashion and unique designer pieces'
    },
    {
      name: 'Local Bookstore',
      type: 'Shopping',
      duration: '1-2 hours',
      cost: { low: '$8-25', medium: '$25-60', high: '$60-120' },
      neighborhoods: ['Literary Quarter', 'Academic District', 'Book Row'],
      description: 'Independent bookstore with local authors and rare finds'
    },
    {
      name: 'Specialty Food Shop',
      type: 'Shopping',
      duration: '1-2 hours',
      cost: { low: '$15-35', medium: '$40-80', high: '$100-200' },
      neighborhoods: ['Gourmet District', 'Food Quarter', 'Specialty Row'],
      description: 'Local delicacies, spices, and gourmet ingredients'
    }
  ],
  Family: [
    {
      name: 'Interactive Science Museum',
      type: 'Family',
      duration: '2-4 hours',
      cost: { low: '$12-20', medium: '$25-40', high: '$45-70' },
      neighborhoods: ['Science District', 'Family Quarter', 'Discovery Center'],
      description: 'Hands-on exhibits and educational activities for all ages'
    },
    {
      name: 'Local Playground & Park',
      type: 'Family',
      duration: '1-3 hours',
      cost: { low: 'Free', medium: '$5-12', high: '$15-25' },
      neighborhoods: ['Family Park', 'Recreation Area', 'Kids District'],
      description: 'Safe play area with equipment and open spaces for children'
    },
    {
      name: 'Mini Golf Course',
      type: 'Family',
      duration: '1-2 hours',
      cost: { low: '$8-15', medium: '$15-25', high: '$25-40' },
      neighborhoods: ['Recreation District', 'Family Fun', 'Activity Center'],
      description: 'Fun miniature golf course with themed obstacles'
    },
    {
      name: 'Puppet Theater',
      type: 'Family',
      duration: '1-2 hours',
      cost: { low: '$10-18', medium: '$20-35', high: '$40-60' },
      neighborhoods: ['Theater District', 'Family Entertainment', 'Arts Quarter'],
      description: 'Engaging puppet shows and interactive performances for children'
    },
    {
      name: 'Petting Zoo',
      type: 'Family',
      duration: '1-2 hours',
      cost: { low: '$8-15', medium: '$18-30', high: '$35-55' },
      neighborhoods: ['Animal Park', 'Family Farm', 'Petting Zoo'],
      description: 'Gentle animals that children can pet and learn about'
    }
  ]
};

export async function generateAlternativeActivities(
  currentActivity: Activity,
  destination: string,
  budget: 'low' | 'medium' | 'high'
): Promise<Activity[]> {
  // Get templates for the same activity type
  const templates = activityTemplatesByType[currentActivity.type] || [];
  
  // Filter out the current activity and get 2 alternatives
  const alternatives = templates
    .filter(template => !currentActivity.name.includes(template.name))
    .slice(0, 2);
  
  // Convert templates to activities
  return alternatives.map((template, index) => ({
    id: `${currentActivity.id}-alt-${index}`,
    name: template.name,
    type: template.type,
    time: currentActivity.time, // Keep the same time slot
    duration: template.duration,
    description: `${template.description} in ${destination}`,
    neighborhood: currentActivity.neighborhood, // Try to keep same neighborhood
    cost: template.cost[budget],
    travelNote: currentActivity.travelNote
  }));
}