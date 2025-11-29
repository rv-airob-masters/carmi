// Type definitions for Car Mileage Tracker

export interface MileageEntry {
  id: string;
  miles: number;
  liters: number;
  pricePence: number;
  date: string; // ISO date string
  mileageKmPerL: number;
  mileageMilesPerGallon: number;
  image?: string; // Base64 encoded image
  createdAt: string;
  updatedAt: string;
}

export interface MileageEntryInput {
  miles: number;
  liters: number;
  pricePence: number;
  date: string;
  image?: string;
}

export type MileageUnit = 'km/l' | 'mpg';

export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
  mileageUnit: MileageUnit;
  theme: ThemeMode;
}

export interface FormErrors {
  miles?: string;
  liters?: string;
  pricePence?: string;
  date?: string;
  image?: string;
}

// Calculation constants
export const MILES_TO_KM = 1.60934;
export const LITERS_TO_GALLONS = 0.219969;

