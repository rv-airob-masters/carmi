// Utility functions for formatting values
import type { Currency } from '../types';
import { CURRENCY_SYMBOLS } from '../types';

/**
 * Format a number with specified decimal places
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Format a total cost amount with the correct currency symbol
 * value is the full currency amount (e.g. 65.25 for £65.25)
 */
export function formatCurrency(value: number, currency: Currency = 'GBP'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  return `${symbol}${value.toFixed(2)}`;
}

/**
 * Format price per liter with currency symbol
 * pricePerLiter is the full value (e.g. 1.45 for £1.45/L, 105 for ₹105/L)
 */
export function formatPricePerLiter(pricePerLiter: number, currency: Currency = 'GBP'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  return `${symbol}${pricePerLiter.toFixed(2)}/L`;
}

/**
 * @deprecated Use formatCurrency instead
 * Kept for any legacy callers — treats input as pence
 */
export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format date for display in cards
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
}

/**
 * Format mileage with unit
 */
export function formatMileage(value: number, unit: 'km/l' | 'mpg'): string {
  return `${formatNumber(value)} ${unit}`;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Convert image file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file (type and size)
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a JPEG or PNG image' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be less than 5MB' };
  }

  return { valid: true };
}

/**
 * Compress image to reduce storage size
 */
export async function compressImage(base64: string, maxWidth: number = 800): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = base64;
  });
}

