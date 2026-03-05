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
export type Region        = 'UK' | 'US' | 'India';

/** Maps each region to its default currency and distance unit */
export const REGION_DEFAULTS: Record<Region, { currency: Currency; distanceUnit: DistanceUnit }> = {
  UK:    { currency: 'GBP', distanceUnit: 'miles' },
  US:    { currency: 'USD', distanceUnit: 'miles' },
  India: { currency: 'INR', distanceUnit: 'km' },
};

export const REGION_NAMES: Record<Region, string> = {
  UK: '🇬🇧 United Kingdom',
  US: '🇺🇸 United States',
  India: '🇮🇳 India',
};

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

/** Currency-specific price & volume configuration for input, storage, and display */
export const CURRENCY_PRICE_CONFIG: Record<Currency, {
  priceLabel: string;
  volumeLabel: string;
  volumeUnit: string;       // 'L' or 'gal'
  pricePlaceholder: string;
  priceStep: string;
  priceHelperText: string;
  /** Multiply user input price by this to get stored pricePerLiter (major-unit/L) */
  priceToStorage: number;
  /** Multiply user input volume by this to get stored liters */
  volumeToStorage: number;
}> = {
  GBP: {
    priceLabel: 'Price per Liter (pence)',
    volumeLabel: 'Liters Filled',
    volumeUnit: 'L',
    pricePlaceholder: 'e.g., 145.9',
    priceStep: '0.1',
    priceHelperText: 'Enter price in pence per liter',
    priceToStorage: 0.01,      // pence → pounds/L
    volumeToStorage: 1,        // liters → liters
  },
  USD: {
    priceLabel: 'Price per Gallon ($)',
    volumeLabel: 'Gallons Filled',
    volumeUnit: 'gal',
    pricePlaceholder: 'e.g., 3.459',
    priceStep: '0.001',
    priceHelperText: 'Enter price in dollars per gallon',
    priceToStorage: 1 / 3.78541,  // $/gal → $/L
    volumeToStorage: 3.78541,     // gallons → liters
  },
  INR: {
    priceLabel: 'Price per Liter (₹)',
    volumeLabel: 'Liters Filled',
    volumeUnit: 'L',
    pricePlaceholder: 'e.g., 105.50',
    priceStep: '0.01',
    priceHelperText: 'Enter price in rupees per liter',
    priceToStorage: 1,         // ₹/L → ₹/L
    volumeToStorage: 1,        // liters → liters
  },
};

export interface AppSettings {
  region?: Region;           // undefined = not yet chosen (triggers onboarding)
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
export const LITERS_TO_GALLONS = 0.219969;      // 1 L = 0.219969 UK gallons (used for mpg calc)
export const LITERS_PER_US_GALLON = 3.78541;     // 1 US gallon = 3.78541 liters

