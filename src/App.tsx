import React, { useState, useEffect } from 'react';
import { Luggage, User, LogOut } from 'lucide-react';
import TripPlannerForm from './components/TripPlannerForm';
import ItineraryView from './components/ItineraryView';
import SavedTrips from './components/SavedTrips';
import AuthModal from './components/AuthModal';
import { TripInputs, Trip } from './types';
import { generateItinerary } from './utils/api';
import { useAuth } from './hooks/useAuth';
import { saveTrip, fetchUserTrips, deleteTrip } from './utils/tripsApi';

type ViewState = 'planning' | 'itinerary' | 'saved';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('planning');
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [tripsLoading, setTripsLoading] = useState(false);

  // Load user trips when user signs in
  useEffect(() => {
    if (user) {
      loadUserTrips();
    } else {
      setSavedTrips([]);
    }
  }, [user]);

  const loadUserTrips = async () => {
    if (!user) return;
    
    setTripsLoading(true);
    try {
      const trips = await fetchUserTrips(user.id);
      setSavedTrips(trips);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setTripsLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!currentTrip || !user) {
      setShowAuthModal(true);
      return;
    }

    try {
      await saveTrip(currentTrip, user.id);
      await loadUserTrips(); // Refresh the trips list
    } catch (error) {
      console.error('Error saving trip:', error);
      // Could show a toast notification here
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!user) return;
    
    if (confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(tripId);
        setSavedTrips(prev => prev.filter(trip => trip.id !== tripId));
        
        // If we're currently viewing the deleted trip, go back to planning
        if (currentTrip && currentTrip.id === tripId) {
          setCurrentTrip(null);
          setCurrentView('planning');
        }
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

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

  const handleViewSavedTrip = (trip: Trip) => {
    setCurrentTrip(trip);
    setCurrentView('itinerary');
  };

  const handleBackToPlanning = () => {
    setCurrentView('planning');
    setCurrentTrip(null);
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentView('planning');
    setCurrentTrip(null);
  };

  const isTripSaved = currentTrip && savedTrips.some(trip => trip.id === currentTrip.id);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-50 via-white to-sage-50 font-travel">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-travel-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={handleBackToPlanning}
              className="flex items-center space-x-3 text-travel-600 hover:text-travel-700 transition-colors group"
            >
              {/* Logo Placeholder */}
              <div className="w-10 h-10 bg-travel-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <Luggage className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-heading font-bold text-gray-800">Travel Genie</span>
                <span className="text-xs text-travel-600 -mt-1">Your AI Travel Companion</span>
              </div>
                <Luggage className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-heading font-bold text-gray-800">Travel Genie</span>
                <span className="text-xs text-travel-600 -mt-1">Your AI Travel Companion</span>
              </div>
            </button>
            
            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={() => setCurrentView('saved')}
                  className="bg-sunset-gradient text-white px-4 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  Saved Trips ({savedTrips.length})
                </button>
              )}
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-1" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-travel-gradient text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-8rem)]">
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
            loading={tripsLoading}
            onBack={handleBackToPlanning}
            onViewTrip={handleViewSavedTrip}
            onDeleteTrip={handleDeleteTrip}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 font-medium">
            Proudly Mentored <span className="text-travel-600 font-semibold">Outskill</span>
          </p>
        </div>
      </footer>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 font-medium">
            Proudly Mentored <span className="text-travel-600 font-semibold">Outskill</span>
          </p>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          // Trips will be loaded automatically via useEffect
        }}
      />
    </div>
  );
}

export default App;