import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { EntriesProvider } from './context/EntriesContext';
import Layout from './components/Layout';
import AddEntry from './pages/AddEntry';
import Entries from './pages/Entries';
import EditEntry from './pages/EditEntry';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function App() {
  return (
    <SettingsProvider>
      <EntriesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<AddEntry />} />
              <Route path="entries" element={<Entries />} />
              <Route path="entries/edit/:id" element={<EditEntry />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </EntriesProvider>
    </SettingsProvider>
  );
}

export default App;
