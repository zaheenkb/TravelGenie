import React from 'react';
import { Clock, MapPin, DollarSign, Save, ArrowLeft, Users, Cloud, Calendar } from 'lucide-react';
import { Trip } from '../types';
import { downloadICSFile } from '../utils/calendarExport';

interface ItineraryViewProps {
  trip: Trip;
  onSaveTrip: () => void;
  onBack: () => void;
  isSaved?: boolean;
}

export default function ItineraryView({ trip, onSaveTrip, onBack, isSaved }: ItineraryViewProps) {
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
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={onBack}
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Planning
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{trip.title}</h1>
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
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Export to Calendar
            </button>
            
            {!isSaved && (
              <button
                onClick={onSaveTrip}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
              className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
            >
              {interest.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Itinerary */}
      <div className="space-y-6">
        {trip.itinerary.map((day) => (
          <div key={day.date} className="bg-white rounded-2xl shadow-xl p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Day {day.dayNumber}
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">{formatDate(day.date)}</p>
                {day.weather && (
                  <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                    <Cloud className="w-4 h-4 mr-1" />
                    {day.weather.condition} • {day.weather.temperature}
                  </div>
                )}
              </div>
              {day.weather?.note && (
                <p className="text-sm text-blue-600 mt-1 italic">{day.weather.note}</p>
              )}
            </div>

            <div className="space-y-4">
              {day.activities.map((activity, index) => (
                <div key={activity.id} className="relative">
                  {/* Timeline connector */}
                  {index < day.activities.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-16 bg-gradient-to-b from-teal-300 to-teal-200"></div>
                  )}
                  
                  <div className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                    
                    {/* Activity card */}
                    <div className="flex-grow bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {activity.name}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {activity.time}
                            </span>
                            <span>Duration: {activity.duration}</span>
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {activity.cost}
                            </span>
                          </div>
                        </div>
                        <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-medium">
                          {activity.type}
                          <span className="text-teal-600">
                            📍 {activity.neighborhood}
                          </span>
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-2">{activity.description}</p>
                      
                      {activity.travelNote && (
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs inline-flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {activity.travelNote}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}