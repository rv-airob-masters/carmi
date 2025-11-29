import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AppSettings, MileageUnit, ThemeMode } from '../types';
import { getSettings, updateSettings as updateDbSettings } from '../db/database';

interface SettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  toggleTheme: () => void;
  toggleUnit: () => void;
  setMileageUnit: (unit: MileageUnit) => void;
  setTheme: (theme: ThemeMode) => void;
}

const defaultSettings: AppSettings = {
  mileageUnit: 'km/l',
  theme: 'light'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from database on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const dbSettings = await getSettings();
        setSettings(dbSettings);
        // Apply theme to document
        applyTheme(dbSettings.theme);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const applyTheme = (theme: ThemeMode) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const updateAndSave = useCallback(async (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    
    if (updates.theme) {
      applyTheme(updates.theme);
    }
    
    try {
      await updateDbSettings(updates);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  const toggleTheme = useCallback(() => {
    const newTheme: ThemeMode = settings.theme === 'light' ? 'dark' : 'light';
    updateAndSave({ theme: newTheme });
  }, [settings.theme, updateAndSave]);

  const toggleUnit = useCallback(() => {
    const newUnit: MileageUnit = settings.mileageUnit === 'km/l' ? 'mpg' : 'km/l';
    updateAndSave({ mileageUnit: newUnit });
  }, [settings.mileageUnit, updateAndSave]);

  const setMileageUnit = useCallback((unit: MileageUnit) => {
    updateAndSave({ mileageUnit: unit });
  }, [updateAndSave]);

  const setTheme = useCallback((theme: ThemeMode) => {
    updateAndSave({ theme });
  }, [updateAndSave]);

  return (
    <SettingsContext.Provider value={{
      settings,
      isLoading,
      toggleTheme,
      toggleUnit,
      setMileageUnit,
      setTheme
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

