import React, { useState, useEffect } from 'react';
import { Luggage } from 'lucide-react';
import TripPlannerForm from './components/TripPlannerForm';
import ItineraryView from './components/ItineraryView';
import SavedTrips from './components/SavedTrips';
import { TripInputs, Trip } from './types';
import { generateItinerary } from './utils/api';

type ViewState = 'planning' | 'itinerary' | 'saved';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('planning');
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved trips from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('travelGenieTrips');
    if (saved) {
      setSavedTrips(JSON.parse(saved));
    }
  }, []);

  // Save trips to localStorage whenever savedTrips changes
  useEffect(() => {
    localStorage.setItem('travelGenieTrips', JSON.stringify(savedTrips));
  }, [savedTrips]);

  const handlePlanTrip = async (inputs: TripInputs) => {
    setIsGenerating(true);
    
    try {
      const trip = await generateItinerary(inputs);
      setCurrentTrip(trip);
      setCurrentView('itinerary');
    } catch (error) {
      console.error('Failed to generate trip:', error);
      // Handle error - could show a toast notification
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTrip = () => {
    if (currentTrip) {
      setSavedTrips(prev => [currentTrip, ...prev]);
    }
  };

  const handleViewSavedTrip = (trip: Trip) => {
    setCurrentTrip(trip);
    setCurrentView('itinerary');
  };

  const handleDeleteTrip = (tripId: string) => {
    setSavedTrips(prev => prev.filter(trip => trip.id !== tripId));
  };

  const handleBackToPlanning = () => {
    setCurrentView('planning');
    setCurrentTrip(null);
  };

  const isTripSaved = currentTrip && savedTrips.some(trip => trip.id === currentTrip.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={handleBackToPlanning}
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors"
            >
              <Luggage className="h-8 w-8" />
              <span className="text-xl font-bold">Travel Genie</span>
            </button>
            
            <button
              onClick={() => setCurrentView('saved')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Saved Trips ({savedTrips.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'planning' && (
          <TripPlannerForm 
            onPlanTrip={handlePlanTrip} 
            isGenerating={isGenerating}
          />
        )}
        
        {currentView === 'itinerary' && currentTrip && (
          <ItineraryView
            trip={currentTrip}
            onSaveTrip={handleSaveTrip}
            onBack={handleBackToPlanning}
            isSaved={isTripSaved}
          />
        )}
        
        {currentView === 'saved' && (
          <SavedTrips
            trips={savedTrips}
            onBack={handleBackToPlanning}
            onViewTrip={handleViewSavedTrip}
            onDeleteTrip={handleDeleteTrip}
          />
        )}
      </main>
    </div>
  );
}

export default App;