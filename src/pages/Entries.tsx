import { useEntries } from '../context/EntriesContext';
import { useSettings } from '../context/SettingsContext';
import MileageCard from '../components/MileageCard';
import { MILES_TO_KM, CURRENCY_SYMBOLS } from '../types';

export default function Entries() {
  const { entries, isLoading, error, deleteEntry } = useEntries();
  const { settings } = useSettings();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
        <p className="mt-4 text-[var(--color-text-muted)]">Loading entries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-[var(--color-error)]/10 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">Error</h2>
        <p className="text-[var(--color-text-muted)]">{error}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">No Entries Yet</h2>
        <p className="text-[var(--color-text-muted)]">
          Start tracking your fuel efficiency by adding your first entry!
        </p>
      </div>
    );
  }

  // Calculate summary stats
  const totalDistanceRaw = entries.reduce((sum, e) => sum + e.miles, 0);
  const totalDistance = settings.distanceUnit === 'km'
    ? totalDistanceRaw * MILES_TO_KM
    : totalDistanceRaw;
  const distanceLabel = settings.distanceUnit === 'km' ? 'Total km' : 'Total Miles';

  const avgMileage = settings.mileageUnit === 'km/l'
    ? entries.reduce((sum, e) => sum + e.mileageKmPerL, 0) / entries.length
    : entries.reduce((sum, e) => sum + e.mileageMilesPerGallon, 0) / entries.length;

  const avgDistPerCurrency = entries.reduce((sum, e) => sum + (e.milesPerCurrency || 0), 0) / entries.length;
  const avgDistPerCurrencyDisplay = settings.distanceUnit === 'km'
    ? avgDistPerCurrency * MILES_TO_KM
    : avgDistPerCurrency;
  const currencySymbol = CURRENCY_SYMBOLS[settings.currency];
  const distUnit = settings.distanceUnit === 'km' ? 'km' : 'mi';
  const efficiencyLabel = `Avg ${distUnit}/${currencySymbol}`;

  // Sort entries by date descending (latest first)
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="animate-fade-in">
      {/* Summary with pastel tiles */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3 px-1">SUMMARY</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Entries tile - Blue */}
          <div className="rounded-xl p-4 text-center bg-[var(--color-pastel-blue)]">
            <p className="text-2xl font-bold text-[var(--color-pastel-blue-text)]">{entries.length}</p>
            <p className="text-xs font-medium text-[var(--color-pastel-blue-text)] opacity-80">Entries</p>
          </div>
          {/* Distance tile - Green */}
          <div className="rounded-xl p-4 text-center bg-[var(--color-pastel-green)]">
            <p className="text-2xl font-bold text-[var(--color-pastel-green-text)]">{totalDistance.toFixed(0)}</p>
            <p className="text-xs font-medium text-[var(--color-pastel-green-text)] opacity-80">{distanceLabel}</p>
          </div>
          {/* Average efficiency tile - Purple */}
          <div className="rounded-xl p-4 text-center bg-[var(--color-pastel-purple)]">
            <p className="text-2xl font-bold text-[var(--color-pastel-purple-text)]">{avgMileage.toFixed(1)}</p>
            <p className="text-xs font-medium text-[var(--color-pastel-purple-text)] opacity-80">Avg {settings.mileageUnit}</p>
          </div>
          {/* Cost efficiency tile - Orange */}
          <div className="rounded-xl p-4 text-center bg-[var(--color-pastel-orange)]">
            <p className="text-2xl font-bold text-[var(--color-pastel-orange-text)]">{avgDistPerCurrencyDisplay.toFixed(2)}</p>
            <p className="text-xs font-medium text-[var(--color-pastel-orange-text)] opacity-80">{efficiencyLabel}</p>
          </div>
        </div>
      </div>

      {/* Entries list */}
      <div>
        {sortedEntries.map((entry, index) => (
          <MileageCard
            key={entry.id}
            entry={entry}
            onDelete={deleteEntry}
            colorIndex={index}
          />
        ))}
      </div>
    </div>
  );
}

