import React, { useRef, useState } from 'react';
import { fileToBase64, validateImageFile, compressImage } from '../utils/formatters';

interface ImageUploadProps {
  value?: string;
  onChange: (base64: string | undefined) => void;
  error?: string;
}

export default function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      setIsProcessing(true);
      const base64 = await fileToBase64(file);
      const compressed = await compressImage(base64);
      onChange(compressed);
    } catch (err) {
      console.error('Failed to process image:', err);
      alert('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
        Receipt/Odometer Photo (Optional)
      </label>

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-[var(--color-border)]">
          <img
            src={value}
            alt="Uploaded receipt"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-[var(--color-error)] text-white p-2 rounded-full shadow-lg hover:opacity-90 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center
            cursor-pointer transition-all duration-200
            hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5
            ${error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}
            ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]" />
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[var(--color-text-muted)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-[var(--color-text-muted)]">
                Tap to upload image
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                JPEG or PNG, max 5MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="mt-1 text-sm text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}

