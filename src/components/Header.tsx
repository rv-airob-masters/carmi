import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Add Entry',
  '/entries': 'Mileage History',
  '/settings': 'Settings'
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Car Mileage Tracker';

  return (
    <header className="bg-[var(--color-primary)] text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 max-w-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold">{title}</h1>
              <p className="text-xs text-white/70">Carmi Tracker</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

