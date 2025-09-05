import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Clock, Heart } from 'lucide-react';
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
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Travel Genie</h1>
        <p className="text-gray-600">Let us create your perfect adventure</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* From and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <MapPin className="w-4 h-4 mr-2 text-teal-600" />
              From
            </label>
            <input
              type="text"
              value={inputs.from}
              onChange={(e) => setInputs(prev => ({ ...prev, from: e.target.value }))}
              placeholder="Where are you starting from?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <MapPin className="w-4 h-4 mr-2 text-teal-600" />
              Destination
            </label>
            <input
              type="text"
              value={inputs.destination}
              onChange={(e) => setInputs(prev => ({ ...prev, destination: e.target.value }))}
              placeholder="Where would you like to go?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-teal-600" />
              Start Date
            </label>
            <input
              type="date"
              value={inputs.startDate}
              onChange={(e) => setInputs(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-teal-600" />
              End Date
            </label>
            <input
              type="date"
              value={inputs.endDate}
              onChange={(e) => setInputs(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            <DollarSign className="w-4 h-4 mr-2 text-teal-600" />
            Budget Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['low', 'medium', 'high'].map(budget => (
              <button
                key={budget}
                type="button"
                onClick={() => setInputs(prev => ({ ...prev, budget: budget as any }))}
                className={`px-4 py-3 rounded-lg border transition-all duration-200 ${
                  inputs.budget === budget
                    ? 'bg-teal-600 text-white border-teal-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                {budget.charAt(0).toUpperCase() + budget.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Pace */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            <Clock className="w-4 h-4 mr-2 text-teal-600" />
            Travel Pace
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['relaxed', 'standard', 'intense'].map(pace => (
              <button
                key={pace}
                type="button"
                onClick={() => setInputs(prev => ({ ...prev, pace: pace as any }))}
                className={`px-4 py-3 rounded-lg border transition-all duration-200 ${
                  inputs.pace === pace
                    ? 'bg-teal-600 text-white border-teal-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                {pace.charAt(0).toUpperCase() + pace.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            <Heart className="w-4 h-4 mr-2 text-teal-600" />
            Interests
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interests.map(interest => (
              <button
                key={interest.id}
                type="button"
                onClick={() => handleInterestChange(interest.id)}
                className={`px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                  inputs.interests.includes(interest.id)
                    ? 'bg-teal-600 text-white border-teal-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300 hover:bg-teal-50'
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
          className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isFormValid && !isGenerating
              ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
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