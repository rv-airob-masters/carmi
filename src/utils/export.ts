import type { MileageEntry, AppSettings } from '../types';
import { MILES_TO_KM, CURRENCY_SYMBOLS, CURRENCY_PRICE_CONFIG, LITERS_PER_US_GALLON } from '../types';
import { formatDate, formatCurrency, formatPricePerLiter } from './formatters';

/**
 * Export entries to CSV format
 */
export function exportToCSV(entries: MileageEntry[], settings: AppSettings): void {
  const { mileageUnit, distanceUnit, currency } = settings;
  const distLabel = distanceUnit === 'km' ? 'km' : 'miles';
  const currSymbol = CURRENCY_SYMBOLS[currency];
  const volConfig = CURRENCY_PRICE_CONFIG[currency];
  const isGal = volConfig.volumeUnit === 'gal';
  const volLabel = isGal ? 'Gallons' : 'Liters';
  const priceColLabel = isGal ? `Price/gal (${currSymbol})` : `Price/L (${currSymbol})`;

  // Sort by date descending
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // CSV headers
  const headers = [
    'Date',
    `Distance (${distLabel})`,
    volLabel,
    priceColLabel,
    `Total Cost (${currSymbol})`,
    mileageUnit === 'km/l' ? 'Mileage (km/L)' : 'Mileage (mpg)',
    `${distLabel}/${currSymbol}`,
  ];

  // CSV rows
  const rows = sortedEntries.map(entry => {
    const dist = distanceUnit === 'km'
      ? (entry.miles * MILES_TO_KM).toFixed(1)
      : entry.miles.toFixed(1);
    const totalCost = (entry.pricePerLiter * entry.liters).toFixed(2);
    const distPerCurrency = distanceUnit === 'km'
      ? (entry.milesPerCurrency * MILES_TO_KM).toFixed(2)
      : entry.milesPerCurrency.toFixed(2);
    const vol = isGal ? (entry.liters / LITERS_PER_US_GALLON).toFixed(2) : entry.liters.toFixed(2);
    const priceDisplay = isGal
      ? (entry.pricePerLiter * LITERS_PER_US_GALLON).toFixed(3)
      : entry.pricePerLiter.toFixed(2);

    return [
      entry.date,
      dist,
      vol,
      priceDisplay,
      totalCost,
      mileageUnit === 'km/l'
        ? entry.mileageKmPerL.toFixed(2)
        : entry.mileageMilesPerGallon.toFixed(2),
      distPerCurrency,
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and download file
  downloadFile(csvContent, 'mileage-data.csv', 'text/csv');
}

/**
 * Export entries to PDF format (simple HTML-based PDF)
 */
export function exportToPDF(entries: MileageEntry[], settings: AppSettings): void {
  const { mileageUnit, distanceUnit, currency } = settings;
  const distLabel = distanceUnit === 'km' ? 'km' : 'miles';
  const currSymbol = CURRENCY_SYMBOLS[currency];
  const effLabel = `${distLabel}/${currSymbol}`;
  const pdfVolConfig = CURRENCY_PRICE_CONFIG[currency];
  const pdfIsGal = pdfVolConfig.volumeUnit === 'gal';
  const pdfVolLabel = pdfIsGal ? 'Gallons' : 'Liters';
  const pdfPriceColLabel = pdfIsGal ? `Price/gal (${currSymbol})` : `Price/L (${currSymbol})`;

  // Sort by date descending
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate summary stats
  const totalDistRaw = entries.reduce((sum, e) => sum + e.miles, 0);
  const totalDist = distanceUnit === 'km' ? totalDistRaw * MILES_TO_KM : totalDistRaw;
  const totalLiters = entries.reduce((sum, e) => sum + e.liters, 0);
  const totalVolDisplay = pdfIsGal ? totalLiters / LITERS_PER_US_GALLON : totalLiters;
  const totalCost = entries.reduce((sum, e) => sum + (e.pricePerLiter * e.liters), 0);
  const avgMileage = mileageUnit === 'km/l'
    ? entries.reduce((sum, e) => sum + e.mileageKmPerL, 0) / entries.length
    : entries.reduce((sum, e) => sum + e.mileageMilesPerGallon, 0) / entries.length;

  // Generate HTML content
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Car Mileage Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
    h1 { color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    .summary { display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; }
    .stat { background: #f0f9ff; padding: 15px; border-radius: 8px; min-width: 120px; }
    .stat-label { font-size: 12px; color: #666; }
    .stat-value { font-size: 24px; font-weight: bold; color: #1e40af; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #3b82f6; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>🚗 Car Mileage Report</h1>
  <p>Generated: ${new Date().toLocaleDateString()}</p>

  <div class="summary">
    <div class="stat">
      <div class="stat-label">Total Entries</div>
      <div class="stat-value">${entries.length}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Total ${distLabel}</div>
      <div class="stat-value">${totalDist.toFixed(0)}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Total ${pdfVolLabel}</div>
      <div class="stat-value">${totalVolDisplay.toFixed(1)}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Total Spent</div>
      <div class="stat-value">${formatCurrency(totalCost, currency)}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Avg ${mileageUnit}</div>
      <div class="stat-value">${avgMileage.toFixed(1)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>${distLabel}</th>
        <th>${pdfVolLabel}</th>
        <th>${pdfPriceColLabel}</th>
        <th>Cost</th>
        <th>${mileageUnit}</th>
        <th>${effLabel}</th>
      </tr>
    </thead>
    <tbody>
      ${sortedEntries.map(entry => {
        const dist = distanceUnit === 'km'
          ? (entry.miles * MILES_TO_KM).toFixed(1)
          : entry.miles.toFixed(1);
        const distPerCurr = distanceUnit === 'km'
          ? (entry.milesPerCurrency * MILES_TO_KM).toFixed(2)
          : entry.milesPerCurrency.toFixed(2);
        return `
        <tr>
          <td>${formatDate(entry.date)}</td>
          <td>${dist}</td>
          <td>${pdfIsGal ? (entry.liters / LITERS_PER_US_GALLON).toFixed(2) : entry.liters.toFixed(2)}</td>
          <td>${formatPricePerLiter(entry.pricePerLiter, currency)}</td>
          <td>${formatCurrency(entry.pricePerLiter * entry.liters, currency)}</td>
          <td>${(mileageUnit === 'km/l' ? entry.mileageKmPerL : entry.mileageMilesPerGallon).toFixed(2)}</td>
          <td>${distPerCurr}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Generated by Carmi - Car Mileage Tracker</p>
  </div>
</body>
</html>
  `;

  // Open print dialog
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Helper to download a file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

