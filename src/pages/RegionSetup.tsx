import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import type { Region } from '../types';
import { REGION_NAMES, REGION_DEFAULTS, CURRENCY_SYMBOLS } from '../types';

const regions: Region[] = ['UK', 'US', 'India'];

export default function RegionSetup() {
  const [selected, setSelected] = useState<Region | null>(null);
  const { setRegion } = useSettings();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selected) return;
    setRegion(selected);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to CARMI</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Select your region to set up currency, distance, and fuel pricing defaults.
          </p>
        </div>

        {/* Region cards */}
        <div className="space-y-3 mb-8">
          {regions.map((region) => {
            const defaults = REGION_DEFAULTS[region];
            const isSelected = selected === region;
            return (
              <button
                key={region}
                onClick={() => setSelected(region)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold text-lg ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-white'}`}>
                      {REGION_NAMES[region]}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Currency: {CURRENCY_SYMBOLS[defaults.currency]} · 
                      Distance: {defaults.distanceUnit === 'miles' ? 'Miles' : 'Kilometers'}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-150 ${
            selected
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
          You can change this later in Settings.
        </p>
      </div>
    </div>
  );
}

