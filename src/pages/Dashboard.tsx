import { useEntries } from '../context/EntriesContext';
import { useSettings } from '../context/SettingsContext';
import Card, { CardBody, CardHeader } from '../components/Card';
import Button from '../components/Button';
import MileageChart from '../components/MileageChart';
import { formatCurrency } from '../utils/formatters';
import { exportToCSV, exportToPDF } from '../utils/export';
import { MILES_TO_KM, CURRENCY_SYMBOLS, CURRENCY_PRICE_CONFIG, LITERS_PER_US_GALLON } from '../types';

export default function Dashboard() {
  const { entries, isLoading } = useEntries();
  const { settings } = useSettings();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
        <p className="mt-4 text-[var(--color-text-muted)]">Loading dashboard...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-20 h-20 bg-[var(--color-pastel-purple)] rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[var(--color-pastel-purple-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">No Data Yet</h2>
        <p className="text-[var(--color-text-muted)]">
          Add some entries to see your dashboard!
        </p>
      </div>
    );
  }

  // Calculate statistics
  const totalMilesRaw = entries.reduce((sum, e) => sum + e.miles, 0);
  const totalDistance = settings.distanceUnit === 'km' ? totalMilesRaw * MILES_TO_KM : totalMilesRaw;
  const distanceLabel = settings.distanceUnit === 'km' ? 'Total km' : 'Total Miles';

  const totalLiters = entries.reduce((sum, e) => sum + e.liters, 0);
  const isGallons = CURRENCY_PRICE_CONFIG[settings.currency].volumeUnit === 'gal';
  const totalVolumeDisplay = isGallons ? totalLiters / LITERS_PER_US_GALLON : totalLiters;
  const volumeLabel = isGallons ? 'Total Gallons' : 'Total Liters';
  const totalCost = entries.reduce((sum, e) => sum + (e.pricePerLiter * e.liters), 0);

  const avgMileage = settings.mileageUnit === 'km/l'
    ? entries.reduce((sum, e) => sum + e.mileageKmPerL, 0) / entries.length
    : entries.reduce((sum, e) => sum + e.mileageMilesPerGallon, 0) / entries.length;

  const avgDistPerCurrencyRaw = entries.reduce((sum, e) => sum + (e.milesPerCurrency || 0), 0) / entries.length;
  const avgDistPerCurrency = settings.distanceUnit === 'km'
    ? avgDistPerCurrencyRaw * MILES_TO_KM
    : avgDistPerCurrencyRaw;
  const currencySymbol = CURRENCY_SYMBOLS[settings.currency];
  const distUnit = settings.distanceUnit === 'km' ? 'km' : 'mi';
  const efficiencyLabel = `${distUnit}/${currencySymbol}`;

  const bestEntry = entries.reduce((best, e) => {
    const currentValue = settings.mileageUnit === 'km/l' ? e.mileageKmPerL : e.mileageMilesPerGallon;
    const bestValue = settings.mileageUnit === 'km/l' ? best.mileageKmPerL : best.mileageMilesPerGallon;
    return currentValue > bestValue ? e : best;
  });

  const worstEntry = entries.reduce((worst, e) => {
    const currentValue = settings.mileageUnit === 'km/l' ? e.mileageKmPerL : e.mileageMilesPerGallon;
    const worstValue = settings.mileageUnit === 'km/l' ? worst.mileageKmPerL : worst.mileageMilesPerGallon;
    return currentValue < worstValue ? e : worst;
  });

  const bestMileage = settings.mileageUnit === 'km/l' ? bestEntry.mileageKmPerL : bestEntry.mileageMilesPerGallon;
  const worstMileage = settings.mileageUnit === 'km/l' ? worstEntry.mileageKmPerL : worstEntry.mileageMilesPerGallon;

  return (
    <div className="animate-fade-in space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Distance */}
        <div className="rounded-xl p-4 bg-[var(--color-pastel-blue)]">
          <p className="text-xs font-medium text-[var(--color-pastel-blue-text)] opacity-80">{distanceLabel}</p>
          <p className="text-2xl font-bold text-[var(--color-pastel-blue-text)]">{totalDistance.toFixed(0)}</p>
        </div>

        {/* Total Volume */}
        <div className="rounded-xl p-4 bg-[var(--color-pastel-green)]">
          <p className="text-xs font-medium text-[var(--color-pastel-green-text)] opacity-80">{volumeLabel}</p>
          <p className="text-2xl font-bold text-[var(--color-pastel-green-text)]">{totalVolumeDisplay.toFixed(1)}</p>
        </div>

        {/* Total Cost */}
        <div className="rounded-xl p-4 bg-[var(--color-pastel-orange)]">
          <p className="text-xs font-medium text-[var(--color-pastel-orange-text)] opacity-80">Total Spent</p>
          <p className="text-2xl font-bold text-[var(--color-pastel-orange-text)]">{formatCurrency(totalCost, settings.currency)}</p>
        </div>

        {/* Average Mileage */}
        <div className="rounded-xl p-4 bg-[var(--color-pastel-purple)]">
          <p className="text-xs font-medium text-[var(--color-pastel-purple-text)] opacity-80">Average</p>
          <p className="text-2xl font-bold text-[var(--color-pastel-purple-text)]">{avgMileage.toFixed(1)} <span className="text-sm">{settings.mileageUnit}</span></p>
        </div>
      </div>

      {/* Cost efficiency - Full width */}
      <div className="rounded-xl p-4 bg-gradient-to-r from-[var(--color-pastel-teal)] to-[var(--color-pastel-green)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--color-pastel-teal-text)] opacity-80">Average {efficiencyLabel}</p>
            <p className="text-3xl font-bold text-[var(--color-pastel-teal-text)]">{avgDistPerCurrency.toFixed(2)} <span className="text-lg">{efficiencyLabel}</span></p>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center">
            <span className="text-2xl font-bold text-[var(--color-pastel-teal-text)]">{currencySymbol}</span>
          </div>
        </div>
      </div>

      {/* Best & Worst */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4 bg-[var(--color-pastel-teal)]">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-pastel-teal-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <p className="text-xs font-medium text-[var(--color-pastel-teal-text)] opacity-80">Best</p>
          </div>
          <p className="text-xl font-bold text-[var(--color-pastel-teal-text)]">{bestMileage.toFixed(1)} <span className="text-sm">{settings.mileageUnit}</span></p>
        </div>
        
        <div className="rounded-xl p-4 bg-[var(--color-pastel-pink)]">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-pastel-pink-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <p className="text-xs font-medium text-[var(--color-pastel-pink-text)] opacity-80">Worst</p>
          </div>
          <p className="text-xl font-bold text-[var(--color-pastel-pink-text)]">{worstMileage.toFixed(1)} <span className="text-sm">{settings.mileageUnit}</span></p>
        </div>
      </div>

      {/* Mileage Chart */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-[var(--color-text)]">Recent Mileage Trend</h2>
          <p className="text-xs text-[var(--color-text-muted)]">Last 10 entries</p>
        </CardHeader>
        <CardBody>
          <MileageChart entries={entries} maxEntries={10} />
        </CardBody>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-[var(--color-text)]">Export Data</h2>
          <p className="text-xs text-[var(--color-text-muted)]">Download your mileage history</p>
        </CardHeader>
        <CardBody>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => exportToCSV(entries, settings)}
              className="flex-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CSV
            </Button>
            <Button
              variant="primary"
              onClick={() => exportToPDF(entries, settings)}
              className="flex-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              PDF
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

