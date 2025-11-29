import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardBody } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import ImageUpload from '../components/ImageUpload';
import { useEntries } from '../context/EntriesContext';
import { validateMileageEntry, hasErrors } from '../utils/validation';
import { getTodayDate } from '../utils/formatters';
import type { FormErrors } from '../types';

export default function AddEntry() {
  const navigate = useNavigate();
  const { addEntry } = useEntries();
  
  const [miles, setMiles] = useState('');
  const [liters, setLiters] = useState('');
  const [pricePence, setPricePence] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [image, setImage] = useState<string | undefined>();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateMileageEntry({ miles, liters, pricePence, date });
    setErrors(validationErrors);
    
    if (hasErrors(validationErrors)) {
      return;
    }

    try {
      setIsSubmitting(true);
      await addEntry({
        miles: parseFloat(miles),
        liters: parseFloat(liters),
        pricePence: parseFloat(pricePence),
        date,
        image
      });
      
      // Show success animation
      setShowSuccess(true);
      
      // Reset form
      setMiles('');
      setLiters('');
      setPricePence('');
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
              label="Miles Driven"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g., 250"
              value={miles}
              onChange={(e) => setMiles(e.target.value)}
              error={errors.miles}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />

            <Input
              label="Liters Filled"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 45.5"
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
              label="Price per Liter (pence)"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g., 145.9"
              value={pricePence}
              onChange={(e) => setPricePence(e.target.value)}
              error={errors.pricePence}
              helperText="Enter price in pence (e.g., 145.9p)"
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

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isSubmitting}
              className="mt-6"
            >
              Save Entry
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

