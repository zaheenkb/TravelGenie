import React, { useState, useEffect } from 'react';
import { Clock, MapPin, DollarSign, Save, ArrowLeft, Users, Cloud, Calendar, ChevronDown, ChevronUp, RefreshCw, X, Check } from 'lucide-react';
import { Trip } from '../types';
import { downloadICSFile } from '../utils/calendarExport';
import { generateAlternativeActivities } from '../utils/activitySuggestions';

interface ItineraryViewProps {
  trip: Trip;
  onSaveTrip: () => void;
  onBack: () => void;
  isSaved?: boolean;
}

export default function ItineraryView({ trip, onSaveTrip, onBack, isSaved }: ItineraryViewProps) {
  const [collapsedDays, setCollapsedDays] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [swapSuggestions, setSwapSuggestions] = useState<{[key: string]: any[]}>({});
  const [loadingSuggestions, setLoadingSuggestions] = useState<Set<string>>(new Set());

  // Check if mobile and set initial collapsed state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On mobile, collapse all days by default
      if (mobile) {
        setCollapsedDays(new Set(trip.itinerary.map(day => day.dayNumber)));
      } else {
        setCollapsedDays(new Set());
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [trip.itinerary]);

  const toggleDay = (dayNumber: number) => {
    setCollapsedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber);
      } else {
        newSet.add(dayNumber);
      }
      return newSet;
    });
  };

  const handleSwapSuggestion = async (activityId: string, currentActivity: any) => {
    setLoadingSuggestions(prev => new Set(prev).add(activityId));
    
    try {
      const suggestions = await generateAlternativeActivities(
        currentActivity,
        trip.destination,
        trip.budget as 'low' | 'medium' | 'high'
      );
      setSwapSuggestions(prev => ({
        ...prev,
        [activityId]: suggestions
      }));
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setLoadingSuggestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(activityId);
        return newSet;
      });
    }
  };

  const handleAcceptSuggestion = (activityId: string, newActivity: any) => {
    // Update the trip with the new activity
    const updatedTrip = { ...trip };
    updatedTrip.itinerary = updatedTrip.itinerary.map(day => ({
      ...day,
      activities: day.activities.map(activity => 
        activity.id === activityId ? { ...newActivity, id: activityId } : activity
      )
    }));
    
    // Clear suggestions for this activity
    setSwapSuggestions(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[activityId];
      return newSuggestions;
    });
    
    // You might want to trigger a re-render or update the parent component here
    // For now, we'll just update the local state
    Object.assign(trip, updatedTrip);
  };

  const handleCancelSuggestions = (activityId: string) => {
    setSwapSuggestions(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[activityId];
      return newSuggestions;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDurationInDays = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-travel-100">
        <button
          onClick={onBack}
          className="flex items-center text-travel-600 hover:text-travel-700 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Planning
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">🗺️</span>
              <h1 className="text-3xl font-heading font-bold text-gray-800">{trip.title}</h1>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {trip.destination}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {getDurationInDays()} days
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {trip.budget} budget
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <button
              onClick={() => downloadICSFile(trip)}
              className="bg-travel-gradient text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 flex items-center transform hover:-translate-y-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Export to Calendar
            </button>
            
            {!isSaved && (
              <button
                onClick={onSaveTrip}
                className="bg-sunset-gradient text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 flex items-center transform hover:-translate-y-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Trip
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {trip.interests.map(interest => (
            <span
              key={interest}
              className="px-3 py-1 bg-travel-100 text-travel-700 rounded-full text-sm font-medium"
            >
              {interest.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Main Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-travel-300 via-travel-400 to-travel-300"></div>

        {/* Days */}
        <div className="space-y-0">
          {trip.itinerary.map((day, dayIndex) => {
            const isCollapsed = collapsedDays.has(day.dayNumber);
            const isLastDay = dayIndex === trip.itinerary.length - 1;

            return (
              <div key={day.date} className="relative">
                {/* Sticky Day Header */}
                <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-travel-100">
                  <button
                    onClick={() => toggleDay(day.dayNumber)}
                    className="w-full text-left p-6 hover:bg-travel-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {/* Day Number Circle */}
                        <div className="relative z-10 w-16 h-16 bg-travel-gradient rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mr-6">
                          {day.dayNumber}
                        </div>
                        
                        <div>
                          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-1">
                            Day {day.dayNumber}
                          </h2>
                          <div className="flex items-center gap-4">
                            <p className="text-gray-600 font-medium">{formatDate(day.date)}</p>
                            {day.weather && (
                              <div className="flex items-center text-sm text-gray-600 bg-travel-50 px-3 py-1 rounded-full">
                                <Cloud className="w-4 h-4 mr-1" />
                                {day.weather.condition} • {day.weather.temperature}
                              </div>
                            )}
                          </div>
                          {day.weather?.note && (
                            <p className="text-sm text-travel-600 mt-1 italic">{day.weather.note}</p>
                          )}
                        </div>
                      </div>

                      {/* Collapse/Expand Icon */}
                      <div className="flex items-center text-gray-400">
                        <span className="text-sm mr-2">
                          {day.activities.length} activities
                        </span>
                        {isCollapsed ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronUp className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Activities */}
                {!isCollapsed && (
                  <div className="pl-24 pr-6 pb-8">
                    <div className="space-y-6">
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activity.id} className="relative">
                          {/* Activity Timeline Dot */}
                          <div className="absolute -left-20 top-4 w-4 h-4 bg-white border-4 border-travel-400 rounded-full shadow-sm"></div>
                          
                          {/* Activity Connector Line */}
                          {activityIndex < day.activities.length - 1 && (
                            <div className="absolute -left-18 top-8 w-0.5 h-16 bg-travel-200"></div>
                          )}
                          
                          {/* Activity Card */}
                          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-travel-100">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4 relative">
                              <div className="flex-grow">
                                <div className="flex items-start justify-between mb-3">
                                  <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2">
                                    {activity.name}
                                  </h3>
                                  <div className="flex items-center gap-2 ml-4">
                                    <span className="bg-travel-100 text-travel-700 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                                      {activity.type}
                                    </span>
                                    <button
                                      onClick={() => handleSwapSuggestion(activity.id, activity)}
                                      disabled={loadingSuggestions.has(activity.id)}
                                      className="p-2 text-gray-400 hover:text-travel-600 hover:bg-travel-50 rounded-lg transition-colors disabled:opacity-50"
                                      title="Get alternative suggestions"
                                    >
                                      <RefreshCw className={`w-4 h-4 ${loadingSuggestions.has(activity.id) ? 'animate-spin' : ''}`} />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                  <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full font-medium">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {activity.time}
                                  </span>
                                  <span className="bg-gray-50 px-3 py-1 rounded-full font-medium">
                                    Duration: {activity.duration}
                                  </span>
                                  <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full font-medium">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    {activity.cost}
                                  </span>
                                </div>
                                
                                <p className="text-gray-700 mb-3 leading-relaxed">{activity.description}</p>
                                
                                <div className="flex flex-wrap gap-2">
                                  <div className="flex items-center text-sm text-gray-600 bg-travel-50 px-3 py-1 rounded-full font-medium">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {activity.neighborhood}
                                  </div>
                                  
                                  {activity.travelNote && (
                                    <div className="bg-sunset-50 text-sunset-700 px-3 py-1 rounded-full text-sm font-medium">
                                      🚶 {activity.travelNote}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Swap Suggestions */}
                            {swapSuggestions[activity.id] && (
                              <div className="mt-4 p-4 bg-travel-50 rounded-xl border border-travel-200">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-travel-800">Alternative Suggestions</h4>
                                  <button
                                    onClick={() => handleCancelSuggestions(activity.id)}
                                    className="text-travel-600 hover:text-travel-800 p-1"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  {swapSuggestions[activity.id].map((suggestion: any, index: number) => (
                                    <div key={index} className="bg-white p-3 rounded-xl border border-travel-100">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-grow">
                                          <h5 className="font-semibold text-gray-800 mb-1">{suggestion.name}</h5>
                                          <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                                          <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                                              {suggestion.duration}
                                            </span>
                                            <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                                              {suggestion.cost}
                                            </span>
                                            <span className="bg-travel-100 text-travel-700 px-2 py-1 rounded font-medium">
                                              {suggestion.neighborhood}
                                            </span>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleAcceptSuggestion(activity.id, suggestion)}
                                          className="ml-3 p-2 text-sage-600 hover:text-sage-800 hover:bg-sage-50 rounded-lg transition-colors"
                                          title="Use this suggestion"
                                        >
                                          <Check className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Day Separator */}
                {!isLastDay && (
                  <div className="relative py-4">
                    <div className="absolute left-6 w-8 h-8 bg-gradient-to-r from-travel-300 to-travel-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}