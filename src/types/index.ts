// Type definitions for Car Mileage Tracker

export interface MileageEntry {
  id: string;
  miles: number;          // always stored in miles
  liters: number;
  pricePerLiter: number;  // full currency value (e.g. 1.45 for £1.45/L or 105 for ₹105/L)
  date: string;           // ISO date string
  mileageKmPerL: number;
  mileageMilesPerGallon: number;
  milesPerCurrency: number; // miles per 1 unit of the chosen currency
  image?: string;           // Base64 encoded image
  createdAt: string;
  updatedAt: string;
}

export interface MileageEntryInput {
  miles: number;
  liters: number;
  pricePerLiter: number;
  date: string;
  image?: string;
}

export type DistanceUnit  = 'miles' | 'km';
export type MileageUnit   = 'km/l' | 'mpg';
export type Currency      = 'GBP' | 'USD' | 'INR';
export type ThemeMode     = 'light' | 'dark';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: '£',
  USD: '$',
  INR: '₹',
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  GBP: 'British Pound (£)',
  USD: 'US Dollar ($)',
  INR: 'Indian Rupee (₹)',
};

export interface AppSettings {
  distanceUnit: DistanceUnit;
  mileageUnit: MileageUnit;
  currency: Currency;
  theme: ThemeMode;
}

export interface FormErrors {
  miles?: string;
  liters?: string;
  price?: string;
  date?: string;
  image?: string;
}

// Calculation constants
export const MILES_TO_KM = 1.60934;
export const LITERS_TO_GALLONS = 0.219969;

