import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { formatDate, formatPrice, formatPricePerLiter, formatMileage } from '../utils/formatters';
import type { MileageEntry } from '../types';

// Pastel color schemes for alternating cards
const colorSchemes = [
  { bg: 'var(--color-pastel-blue)', text: 'var(--color-pastel-blue-text)' },
  { bg: 'var(--color-pastel-green)', text: 'var(--color-pastel-green-text)' },
  { bg: 'var(--color-pastel-purple)', text: 'var(--color-pastel-purple-text)' },
  { bg: 'var(--color-pastel-orange)', text: 'var(--color-pastel-orange-text)' },
  { bg: 'var(--color-pastel-pink)', text: 'var(--color-pastel-pink-text)' },
  { bg: 'var(--color-pastel-teal)', text: 'var(--color-pastel-teal-text)' },
];

interface MileageCardProps {
  entry: MileageEntry;
  onDelete?: (id: string) => void;
  colorIndex?: number;
}

export default function MileageCard({ entry, onDelete, colorIndex = 0 }: MileageCardProps) {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const mileageValue = settings.mileageUnit === 'km/l'
    ? entry.mileageKmPerL
    : entry.mileageMilesPerGallon;

  const colorScheme = colorSchemes[colorIndex % colorSchemes.length];

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this entry?')) {
      onDelete(entry.id);
    }
  };

  return (
    <div
      className="mb-4 rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm"
      style={{ backgroundColor: colorScheme.bg }}
    >
      <div className="flex">
        {/* Image thumbnail */}
        {entry.image && (
          <div className="w-24 h-full min-h-[120px] flex-shrink-0">
            <img
              src={entry.image}
              alt="Receipt"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <span
              className="text-sm font-medium"
              style={{ color: colorScheme.text }}
            >
              {formatDate(entry.date)}
            </span>
            <div className="flex gap-1">
              {/* Edit button */}
              <button
                onClick={() => navigate(`/entries/edit/${entry.id}`)}
                className="p-1 rounded transition-colors hover:bg-white/30"
                style={{ color: colorScheme.text }}
                aria-label="Edit entry"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              {/* Delete button */}
              <button
                onClick={handleDelete}
                className="text-[var(--color-error)] hover:bg-[var(--color-error)]/20 p-1 rounded transition-colors"
                aria-label="Delete entry"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-xs opacity-70" style={{ color: colorScheme.text }}>Miles</p>
              <p className="font-semibold" style={{ color: colorScheme.text }}>{entry.miles}</p>
            </div>
            <div>
              <p className="text-xs opacity-70" style={{ color: colorScheme.text }}>Liters</p>
              <p className="font-semibold" style={{ color: colorScheme.text }}>{entry.liters}</p>
            </div>
            <div>
              <p className="text-xs opacity-70" style={{ color: colorScheme.text }}>Price</p>
              <p className="font-semibold" style={{ color: colorScheme.text }}>{formatPricePerLiter(entry.pricePence)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70" style={{ color: colorScheme.text }}>Total Cost</p>
              <p className="font-semibold" style={{ color: colorScheme.text }}>{formatPrice(entry.pricePence * entry.liters)}</p>
            </div>
          </div>

          {/* Mileage badge */}
          <div
            className="rounded-lg px-3 py-2 inline-flex items-center gap-2"
            style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: colorScheme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-bold" style={{ color: colorScheme.text }}>
              {formatMileage(mileageValue, settings.mileageUnit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

