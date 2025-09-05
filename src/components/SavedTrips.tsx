import React from 'react';
import { ArrowLeft, MapPin, Calendar, DollarSign, Trash2, Users, Search, X } from 'lucide-react';
import { Trip } from '../types';

interface SavedTripsProps {
  trips: Trip[];
  onBack: () => void;
  onViewTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
}

export default function SavedTrips({ trips, onBack, onViewTrip, onDeleteTrip }: SavedTripsProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Filter trips based on search query
  const filteredTrips = trips.filter(trip =>
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (trip.from && trip.from.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    
    if (start.getFullYear() !== end.getFullYear()) {
      return `${start.toLocaleDateString('en-US', { ...options, year: 'numeric' })} - ${end.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
    } else if (start.getMonth() !== end.getMonth()) {
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
    } else {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.getDate()}, ${end.getFullYear()}`;
    }
  };

  const getDurationInDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <button
          onClick={onBack}
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Planning
        </button>

        <div className="py-12">
          <div className="text-6xl mb-4">🧳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Saved Trips Yet</h2>
          <p className="text-gray-600 mb-6">
            Start planning your next adventure and save it to see it here!
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Plan Your First Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={onBack}
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Planning
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Saved Trips</h1>
            <p className="text-gray-600">
              {filteredTrips.length} of {trips.length} trips
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          <div className="text-4xl">🗺️</div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search trips by destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* No Results Message */}
      {filteredTrips.length === 0 && searchQuery && (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No trips found</h3>
          <p className="text-gray-600 mb-4">
            No trips match your search for "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            Clear search
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {trip.title}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {trip.destination}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {trip.budget} budget • {getDurationInDays(trip.startDate, trip.endDate)} days
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTrip(trip.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                  title="Delete trip"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {trip.interests.slice(0, 3).map(interest => (
                  <span
                    key={interest}
                    className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium"
                  >
                    {interest.replace('-', ' ')}
                  </span>
                ))}
                {trip.interests.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    +{trip.interests.length - 3} more
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Saved {new Date(trip.createdAt).toLocaleDateString()}
              </div>

              <button
                onClick={() => onViewTrip(trip)}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2 rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-200"
              >
                View Itinerary
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}