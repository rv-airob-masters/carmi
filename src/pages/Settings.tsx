import { useState, useEffect } from 'react';
import Card, { CardBody, CardHeader } from '../components/Card';
import Toggle from '../components/Toggle';
import { useSettings } from '../context/SettingsContext';
import { getDatabaseInfo } from '../db/database';

interface DbInfo {
  entryCount: number;
  dbName: string;
  version: number;
}

export default function Settings() {
  const { settings, toggleTheme, toggleUnit } = useSettings();
  const [dbInfo, setDbInfo] = useState<DbInfo | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    async function loadDbInfo() {
      const info = await getDatabaseInfo();
      setDbInfo(info);
    }
    loadDbInfo();
  }, []);

  return (
    <div className="animate-fade-in space-y-4">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-[var(--color-text)]">Appearance</h2>
        </CardHeader>
        <CardBody>
          <Toggle
            enabled={settings.theme === 'dark'}
            onChange={toggleTheme}
            label="Dark Mode"
            description="Switch between light and dark theme"
          />
        </CardBody>
      </Card>

      {/* Units */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-[var(--color-text)]">Units</h2>
        </CardHeader>
        <CardBody>
          <Toggle
            enabled={settings.mileageUnit === 'mpg'}
            onChange={toggleUnit}
            label="Miles per Gallon"
            description={`Currently showing: ${settings.mileageUnit === 'km/l' ? 'Kilometers per Liter' : 'Miles per Gallon'}`}
          />
        </CardBody>
      </Card>

      {/* Storage Info */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-[var(--color-text)]">Storage</h2>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              {showDebug ? 'Hide Debug' : 'Show Debug'}
            </button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-muted)]">Total Entries</span>
              <span className="font-semibold text-[var(--color-text)]">
                {dbInfo?.entryCount ?? '...'}
              </span>
            </div>
            
            {showDebug && dbInfo && (
              <div className="mt-4 p-3 bg-[var(--color-background)] rounded-lg font-mono text-xs">
                <p className="text-[var(--color-text-muted)]">Database: {dbInfo.dbName}</p>
                <p className="text-[var(--color-text-muted)]">Version: {dbInfo.version}</p>
                <p className="text-[var(--color-text-muted)]">Storage: IndexedDB</p>
                <p className="text-[var(--color-text-muted)]">Theme: {settings.theme}</p>
                <p className="text-[var(--color-text-muted)]">Unit: {settings.mileageUnit}</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-[var(--color-text)]">About</h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-[var(--color-text)]">Carmi Tracker</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Version 1.0.0</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Track your car mileage and fuel efficiency with ease.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* PWA Install hint */}
      <div className="text-center text-sm text-[var(--color-text-muted)] py-4">
        <p>💡 Install this app on your device for offline access!</p>
        <p className="text-xs mt-1">Use your browser's "Add to Home Screen" option</p>
      </div>
    </div>
  );
}

