import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 max-w-lg">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}

