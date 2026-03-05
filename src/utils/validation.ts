import type { FormErrors } from '../types';

interface ValidationInput {
  miles: string;
  liters: string;
  pricePence: string;
  date: string;
  distanceUnit?: 'miles' | 'km';
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

  // Validate liters
  const liters = parseFloat(input.liters);
  if (!input.liters || input.liters.trim() === '') {
    errors.liters = 'Liters is required';
  } else if (isNaN(liters) || liters <= 0) {
    errors.liters = 'Liters must be a positive number';
  } else if (liters > 200) {
    errors.liters = 'Liters seems too high. Please check.';
  }

  // Validate price
  const pricePence = parseFloat(input.pricePence);
  if (!input.pricePence || input.pricePence.trim() === '') {
    errors.pricePence = 'Price is required';
  } else if (isNaN(pricePence) || pricePence <= 0) {
    errors.pricePence = 'Price must be a positive number';
  } else if (pricePence > 500) {
    errors.pricePence = 'Price per liter seems too high';
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

