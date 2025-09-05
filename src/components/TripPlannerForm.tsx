import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Clock, Heart, Users } from 'lucide-react';
import { TripInputs } from '../types';

interface TripPlannerFormProps {
  onPlanTrip: (inputs: TripInputs) => void;
  isGenerating: boolean;
}

const interests = [
  { id: 'culture', label: 'Culture', icon: '🏛️' },
  { id: 'food', label: 'Food', icon: '🍕' },
  { id: 'nature', label: 'Nature', icon: '🌲' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'kid-friendly', label: 'Kid-Friendly', icon: '👨‍👩‍👧‍👦' }
];

export default function TripPlannerForm({ onPlanTrip, isGenerating }: TripPlannerFormProps) {
  const [inputs, setInputs] = useState<TripInputs>({
    from: '',
    destination: '',
    travelers: 2,
    startDate: '',
    endDate: '',
    budget: 'medium',
    pace: 'standard',
    interests: []
  });

  const handleInterestChange = (interestId: string) => {
    setInputs(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlanTrip(inputs);
  };

  const isFormValid = inputs.destination && inputs.startDate && inputs.endDate;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-travel-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-travel-gradient rounded-2xl mb-4 shadow-lg">
          <span className="text-2xl">✈️</span>
        </div>
        <h1 className="text-4xl font-heading font-bold text-gray-800 mb-2">Plan Your Journey</h1>
        <p className="text-travel-600 text-lg">Let us create your perfect adventure</p>
        </div>
        <h1 className="text-4xl font-heading font-bold text-gray-800 mb-2">Plan Your Journey</h1>
        <p className="text-travel-600 text-lg">Let us create your perfect adventure</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* From and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <MapPin className="w-4 h-4 mr-2 text-travel-600" />
              From
            </label>
            <input
              type="text"
              value={inputs.from}
              onChange={(e) => setInputs(prev => ({ ...prev, from: e.target.value }))}
              placeholder="Where are you starting from?"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-travel-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <MapPin className="w-4 h-4 mr-2 text-travel-600" />
              Destination
            </label>
            <input
              type="text"
              value={inputs.destination}
              onChange={(e) => setInputs(prev => ({ ...prev, destination: e.target.value }))}
              placeholder="Where would you like to go?"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-travel-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              required
            />
          </div>
        </div>

        {/* Number of Travelers */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-800">
            <Users className="w-4 h-4 mr-2 text-travel-600" />
            Number of Travelers
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={inputs.travelers}
            onChange={(e) => setInputs(prev => ({ ...prev, travelers: parseInt(e.target.value) || 1 }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-travel-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <Calendar className="w-4 h-4 mr-2 text-travel-600" />
              Start Date
            </label>
            <input
              type="date"
              value={inputs.startDate}
              onChange={(e) => setInputs(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-travel-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <Calendar className="w-4 h-4 mr-2 text-travel-600" />
              End Date
            </label>
            <input
              type="date"
              value={inputs.endDate}
              onChange={(e) => setInputs(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-travel-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              required
            />
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-800">
            <DollarSign className="w-4 h-4 mr-2 text-travel-600" />
            Budget Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['low', 'medium', 'high'].map(budget => (
              <button
                key={budget}
                type="button"
                onClick={() => setInputs(prev => ({ ...prev, budget: budget as any }))}
                className={`px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
                  inputs.budget === budget
                    ? 'bg-travel-gradient text-white border-travel-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-travel-300 hover:bg-travel-50'
                }`}
              >
                {budget.charAt(0).toUpperCase() + budget.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Pace */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-800">
            <Clock className="w-4 h-4 mr-2 text-travel-600" />
            Travel Pace
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['relaxed', 'standard', 'intense'].map(pace => (
              <button
                key={pace}
                type="button"
                onClick={() => setInputs(prev => ({ ...prev, pace: pace as any }))}
                className={`px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
                  inputs.pace === pace
                    ? 'bg-travel-gradient text-white border-travel-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-travel-300 hover:bg-travel-50'
                }`}
              >
                {pace.charAt(0).toUpperCase() + pace.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-800">
            <Heart className="w-4 h-4 mr-2 text-travel-600" />
            Interests
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interests.map(interest => (
              <button
                key={interest.id}
                type="button"
                onClick={() => handleInterestChange(interest.id)}
                className={`px-4 py-3 rounded-xl border transition-all duration-200 text-left font-medium ${
                  inputs.interests.includes(interest.id)
                    ? 'bg-travel-gradient text-white border-travel-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-travel-300 hover:bg-travel-50'
                }`}
              >
                <span className="text-lg mr-2">{interest.icon}</span>
                {interest.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isGenerating}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
            isFormValid && !isGenerating
              ? 'bg-travel-gradient text-white hover:shadow-xl transform hover:-translate-y-1'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Creating Your Perfect Trip...
            </div>
          ) : (
            '🧞‍♂️ Plan My Trip'
          )}
        </button>
      </form>
    </div>
  );
}