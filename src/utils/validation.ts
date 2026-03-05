import type { FormErrors, Currency, DistanceUnit } from '../types';
import { CURRENCY_PRICE_CONFIG } from '../types';

// Max price in INPUT units per currency (what the user types)
const PRICE_MAX: Record<Currency, number> = {
  GBP: 1000,    // 1000 pence/L  = £10/L
  USD: 15,      // $15/gallon
  INR: 500,     // ₹500/L
};

// Max volume in INPUT units per currency
const VOLUME_MAX: Record<Currency, number> = {
  GBP: 200,     // 200 liters
  USD: 50,      // 50 gallons (~189 liters)
  INR: 200,     // 200 liters
};

interface ValidationInput {
  miles: string;
  liters: string;
  price: string;
  date: string;
  distanceUnit?: DistanceUnit;
  currency?: Currency;
}

/**
 * Validate form input for mileage entry
 */
export function validateMileageEntry(input: ValidationInput): FormErrors {
  const errors: FormErrors = {};

  // Validate distance (miles or km)
  const distanceUnit = input.distanceUnit ?? 'miles';
  const distanceLabel = distanceUnit === 'km' ? 'Kilometers' : 'Miles';
  const distanceMax = distanceUnit === 'km' ? 16093 : 10000;
  const miles = parseFloat(input.miles);
  if (!input.miles || input.miles.trim() === '') {
    errors.miles = `${distanceLabel} driven is required`;
  } else if (isNaN(miles) || miles <= 0) {
    errors.miles = `${distanceLabel} must be a positive number`;
  } else if (miles > distanceMax) {
    errors.miles = `${distanceLabel} seems too high. Please check.`;
  }

  // Validate volume (liters for GBP/INR, gallons for USD)
  const currency = input.currency ?? 'GBP';
  const config = CURRENCY_PRICE_CONFIG[currency];
  const maxVolume = VOLUME_MAX[currency];
  const volumeLabel = config.volumeUnit === 'gal' ? 'Gallons' : 'Liters';
  const volume = parseFloat(input.liters);
  if (!input.liters || input.liters.trim() === '') {
    errors.liters = `${volumeLabel} is required`;
  } else if (isNaN(volume) || volume <= 0) {
    errors.liters = `${volumeLabel} must be a positive number`;
  } else if (volume > maxVolume) {
    errors.liters = `${volumeLabel} seems too high. Please check.`;
  }

  // Validate price (in user's input convention per currency)
  const maxPrice = PRICE_MAX[currency];
  const price = parseFloat(input.price);
  if (!input.price || input.price.trim() === '') {
    errors.price = 'Price is required';
  } else if (isNaN(price) || price <= 0) {
    errors.price = 'Price must be a positive number';
  } else if (price > maxPrice) {
    errors.price = `Price seems too high (max ${maxPrice})`;
  }

  // Validate date
  if (!input.date || input.date.trim() === '') {
    errors.date = 'Date is required';
  } else {
    const date = new Date(input.date);
    const today = new Date();
    if (isNaN(date.getTime())) {
      errors.date = 'Invalid date format';
    } else if (date > today) {
      errors.date = 'Date cannot be in the future';
    }
  }

  return errors;
}

/**
 * Check if form has any errors
 */
export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

