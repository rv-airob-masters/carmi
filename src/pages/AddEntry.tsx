import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardBody } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import ImageUpload from '../components/ImageUpload';
import { useEntries } from '../context/EntriesContext';
import { useSettings } from '../context/SettingsContext';
import { validateMileageEntry, hasErrors } from '../utils/validation';
import { getTodayDate } from '../utils/formatters';
import type { FormErrors, DistanceUnit } from '../types';
import { MILES_TO_KM, CURRENCY_PRICE_CONFIG } from '../types';

export default function AddEntry() {
  const navigate = useNavigate();
  const { addEntry } = useEntries();
  const { settings } = useSettings();

  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('miles');
  const [liters, setLiters] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [image, setImage] = useState<string | undefined>();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Init distanceUnit from global settings once on mount
  const initialised = useRef(false);
  useEffect(() => {
    if (!initialised.current) {
      setDistanceUnit(settings.distanceUnit);
      initialised.current = true;
    }
  }, [settings.distanceUnit]);

  const handleUnitToggle = (unit: DistanceUnit) => {
    if (unit === distanceUnit) return;
    setDistanceUnit(unit);
    setErrors((prev) => ({ ...prev, miles: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateMileageEntry({
      miles: distance,
      liters,
      price,
      date,
      distanceUnit,
      currency: settings.currency,
    });
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    // Convert km → miles before storing (DB always stores miles)
    const milesValue = distanceUnit === 'km'
      ? parseFloat(distance) / MILES_TO_KM
      : parseFloat(distance);

    const currConfig = CURRENCY_PRICE_CONFIG[settings.currency];

    try {
      setIsSubmitting(true);
      await addEntry({
        miles: milesValue,
        liters: parseFloat(liters) * currConfig.volumeToStorage,
        pricePerLiter: parseFloat(price) * currConfig.priceToStorage,
        date,
        image
      });

      // Show success animation
      setShowSuccess(true);

      // Reset form (keep global distanceUnit as default)
      setDistance('');
      setDistanceUnit(settings.distanceUnit);
      setLiters('');
      setPrice('');
      setDate(getTodayDate());
      setImage(undefined);
      
      // Navigate to entries after delay
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/entries');
      }, 1500);
    } catch (error) {
      console.error('Failed to add entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-20 h-20 bg-[var(--color-success)] rounded-full flex items-center justify-center mb-4 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">Entry Saved!</h2>
        <p className="text-[var(--color-text-muted)]">Redirecting to history...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Input
              label={distanceUnit === 'km' ? 'Kilometers Driven' : 'Miles Driven'}
              type="number"
              step="0.1"
              min="0"
              placeholder={distanceUnit === 'km' ? 'e.g., 400' : 'e.g., 250'}
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              error={errors.miles}
              labelAction={
                <div className="flex items-center rounded-full border border-[var(--color-border)] overflow-hidden text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => handleUnitToggle('miles')}
                    className={`px-3 py-1 transition-colors duration-150 ${
                      distanceUnit === 'miles'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
                    }`}
                  >
                    mi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnitToggle('km')}
                    className={`px-3 py-1 transition-colors duration-150 ${
                      distanceUnit === 'km'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
                    }`}
                  >
                    km
                  </button>
                </div>
              }
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />

            <Input
              label={CURRENCY_PRICE_CONFIG[settings.currency].volumeLabel}
              type="number"
              step="0.01"
              min="0"
              placeholder={settings.currency === 'USD' ? 'e.g., 12.0' : 'e.g., 45.5'}
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
              error={errors.liters}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
            />

            <Input
              label={CURRENCY_PRICE_CONFIG[settings.currency].priceLabel}
              type="number"
              step={CURRENCY_PRICE_CONFIG[settings.currency].priceStep}
              min="0"
              placeholder={CURRENCY_PRICE_CONFIG[settings.currency].pricePlaceholder}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={errors.price}
              helperText={CURRENCY_PRICE_CONFIG[settings.currency].priceHelperText}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={errors.date}
              max={getTodayDate()}
            />

            <ImageUpload
              value={image}
              onChange={setImage}
              error={errors.image}
            />

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="ghost"
                fullWidth
                size="lg"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isSubmitting}
              >
                Save Entry
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

