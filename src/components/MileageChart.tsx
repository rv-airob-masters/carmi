import { useState, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import type { MileageEntry } from '../types';

interface MileageChartProps {
  entries: MileageEntry[];
  maxEntries?: number;
}

export default function MileageChart({ entries, maxEntries = 10 }: MileageChartProps) {
  const { settings } = useSettings();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  // Sort by date ascending for chart display, take last N entries
  const sortedEntries = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-maxEntries);

  if (sortedEntries.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-[var(--color-text-muted)]">
        No data to display
      </div>
    );
  }

  // Get mileage values based on unit preference
  const values = sortedEntries.map(e =>
    settings.mileageUnit === 'km/l' ? e.mileageKmPerL : e.mileageMilesPerGallon
  );

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  // Chart dimensions
  const chartHeight = 140;
  const topPadding = 20;
  const bottomPadding = 15;
  const leftPadding = 5;
  const rightPadding = 5;

  // Format date for label
  const formatLabel = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  // Calculate Y position as percentage (0-100)
  const getYPercent = (value: number) => {
    const normalized = (value - minValue) / range;
    const chartArea = 100 - ((topPadding + bottomPadding) / chartHeight * 100);
    const topPercent = (topPadding / chartHeight) * 100;
    return topPercent + (1 - normalized) * chartArea;
  };

  // Calculate X position as percentage (0-100)
  const getXPercent = (index: number) => {
    if (sortedEntries.length === 1) return 50;
    return leftPadding + (index / (sortedEntries.length - 1)) * (100 - leftPadding - rightPadding);
  };

  // Handle mouse enter with delay clear
  const handleMouseEnter = (index: number) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setActiveIndex(index);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    hideTimeoutRef.current = window.setTimeout(() => {
      setActiveIndex(null);
    }, 150);
  };

  // Generate SVG path points
  const svgTopPadding = topPadding;
  const svgBottomPadding = bottomPadding;
  const svgChartArea = chartHeight - svgTopPadding - svgBottomPadding;

  const getSvgY = (value: number) => {
    const normalized = (value - minValue) / range;
    return svgTopPadding + (1 - normalized) * svgChartArea;
  };

  const getSvgX = (index: number) => {
    if (sortedEntries.length === 1) return 50;
    return leftPadding + (index / (sortedEntries.length - 1)) * (100 - leftPadding - rightPadding);
  };

  const linePath = sortedEntries.map((_, index) => {
    const x = getSvgX(index);
    const y = getSvgY(values[index]);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const areaPath = `${linePath} L ${getSvgX(sortedEntries.length - 1)} ${chartHeight - svgBottomPadding} L ${getSvgX(0)} ${chartHeight - svgBottomPadding} Z`;

  return (
    <div className="w-full">
      {/* Y-axis labels */}
      <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1 px-1">
        <span>{maxValue.toFixed(1)} {settings.mileageUnit}</span>
        <span>{minValue.toFixed(1)} {settings.mileageUnit}</span>
      </div>

      {/* Chart container */}
      <div className="relative bg-[var(--color-background)] rounded-lg" style={{ height: chartHeight }}>
        {/* SVG Chart */}
        <svg
          viewBox={`0 0 100 ${chartHeight}`}
          className="w-full h-full absolute inset-0"
          preserveAspectRatio="none"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.5, 1].map((ratio) => (
            <line
              key={ratio}
              x1={leftPadding}
              y1={svgTopPadding + ratio * svgChartArea}
              x2={100 - rightPadding}
              y2={svgTopPadding + ratio * svgChartArea}
              stroke="var(--color-border)"
              strokeWidth="0.3"
              strokeDasharray="1,1"
            />
          ))}

          {/* Area fill under the line */}
          <path d={areaPath} fill="url(#lineGradient)" />

          {/* Main line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points in SVG */}
          {sortedEntries.map((entry, index) => {
            const x = getSvgX(index);
            const y = getSvgY(values[index]);
            const isHighest = values[index] === maxValue;
            const isLowest = values[index] === minValue;
            const isActive = activeIndex === index;

            return (
              <circle
                key={entry.id}
                cx={x}
                cy={y}
                r={isActive ? "3.5" : "2.5"}
                fill={isHighest ? 'var(--color-pastel-green-text)' : isLowest ? 'var(--color-pastel-orange-text)' : 'var(--color-primary)'}
                stroke="var(--color-surface)"
                strokeWidth={isActive ? "2" : "1"}
                vectorEffect="non-scaling-stroke"
                style={{ transition: 'r 0.15s, stroke-width 0.15s' }}
              />
            );
          })}
        </svg>

        {/* HTML overlay for hover zones - positioned absolutely over SVG */}
        {sortedEntries.map((entry, index) => {
          const xPercent = getXPercent(index);
          const yPercent = getYPercent(values[index]);

          return (
            <div
              key={`hover-${entry.id}`}
              className="absolute cursor-pointer"
              style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform: 'translate(-50%, -50%)',
                width: '30px',
                height: '30px',
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleMouseEnter(index)}
              onTouchEnd={handleMouseLeave}
            />
          );
        })}

        {/* Tooltip - HTML element */}
        {activeIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none"
            style={{
              left: `${getXPercent(activeIndex)}%`,
              top: `${getYPercent(values[activeIndex])}%`,
              transform: 'translate(-50%, -100%) translateY(-12px)',
            }}
          >
            <div
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 shadow-lg"
              style={{ minWidth: '80px' }}
            >
              <p className="text-sm font-bold text-[var(--color-text)] text-center whitespace-nowrap">
                {values[activeIndex].toFixed(2)} {settings.mileageUnit}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] text-center">
                {formatLabel(sortedEntries[activeIndex].date)}
              </p>
            </div>
            {/* Arrow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid var(--color-border)',
              }}
            />
          </div>
        )}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 px-1">
        {sortedEntries.length <= 5 ? (
          sortedEntries.map((entry) => (
            <span
              key={entry.id}
              className="text-xs text-[var(--color-text-muted)] text-center flex-1"
            >
              {formatLabel(entry.date)}
            </span>
          ))
        ) : (
          <>
            <span className="text-xs text-[var(--color-text-muted)]">
              {formatLabel(sortedEntries[0].date)}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {formatLabel(sortedEntries[Math.floor(sortedEntries.length / 2)].date)}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {formatLabel(sortedEntries[sortedEntries.length - 1].date)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

