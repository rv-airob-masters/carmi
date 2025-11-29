import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { MileageEntry, MileageEntryInput } from '../types';
import { getAllEntries, addEntry as dbAddEntry, deleteEntry as dbDeleteEntry, updateEntry as dbUpdateEntry, db } from '../db/database';
import { supabaseEntries, type SupabaseMileageEntry } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface EntriesContextType {
  entries: MileageEntry[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  isOnline: boolean;
  addEntry: (input: MileageEntryInput) => Promise<MileageEntry>;
  deleteEntry: (id: string) => Promise<void>;
  updateEntry: (id: string, input: Partial<MileageEntryInput>) => Promise<MileageEntry | undefined>;
  refreshEntries: () => Promise<void>;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

// Convert Supabase entry to local MileageEntry format
const supabaseToLocal = (entry: SupabaseMileageEntry): MileageEntry => ({
  id: entry.id,
  date: entry.date,
  miles: entry.miles,
  liters: entry.liters,
  pricePence: entry.price_per_liter,
  mileageKmPerL: entry.mileage_km_per_l,
  mileageMilesPerGallon: entry.mileage_mpg,
  image: entry.image || undefined,
  createdAt: entry.created_at,
  updatedAt: entry.updated_at
});

// Convert local MileageEntry to Supabase format (with user_id)
const localToSupabase = (entry: MileageEntry, userId: string): Omit<SupabaseMileageEntry, 'created_at' | 'updated_at'> => ({
  id: entry.id,
  user_id: userId,
  date: entry.date,
  miles: entry.miles,
  liters: entry.liters,
  price_per_liter: entry.pricePence,
  mileage_km_per_l: entry.mileageKmPerL,
  mileage_mpg: entry.mileageMilesPerGallon,
  image: entry.image || null
});

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<MileageEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { user } = useAuth();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync with Supabase when coming back online or user changes
  useEffect(() => {
    if (isOnline && !isLoading && user) {
      syncWithCloud();
    }
  }, [isOnline, user]);

  const syncWithCloud = async () => {
    if (!isOnline || !user) return;

    try {
      setIsSyncing(true);

      // Fetch from Supabase (RLS ensures only user's entries)
      const cloudEntries = await supabaseEntries.getAll();
      const localEntries = await getAllEntries();

      // Create maps for easier lookup
      const cloudMap = new Map(cloudEntries.map(e => [e.id, e]));
      const localMap = new Map(localEntries.map(e => [e.id, e]));

      // Sync local entries to cloud (entries that exist locally but not in cloud)
      for (const localEntry of localEntries) {
        if (!cloudMap.has(localEntry.id)) {
          try {
            await supabaseEntries.add(localToSupabase(localEntry, user.id));
          } catch (err) {
            console.error('Failed to sync local entry to cloud:', err);
          }
        }
      }

      // Sync cloud entries to local (entries that exist in cloud but not locally)
      for (const cloudEntry of cloudEntries) {
        if (!localMap.has(cloudEntry.id)) {
          const localEntry = supabaseToLocal(cloudEntry);
          await db.entries.add(localEntry);
        }
      }

      // Refresh entries from local DB (now synced)
      const syncedEntries = await getAllEntries();
      setEntries(syncedEntries);

    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const refreshEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isOnline) {
        // Try to fetch from Supabase first
        try {
          const cloudEntries = await supabaseEntries.getAll();
          const localEntries = cloudEntries.map(supabaseToLocal);

          // Update local IndexedDB with cloud data
          await db.entries.clear();
          await db.entries.bulkAdd(localEntries);

          setEntries(localEntries);
        } catch (err) {
          console.error('Failed to fetch from cloud, falling back to local:', err);
          const data = await getAllEntries();
          setEntries(data);
        }
      } else {
        // Offline: use local IndexedDB
        const data = await getAllEntries();
        setEntries(data);
      }
    } catch (err) {
      setError('Failed to load entries');
      console.error('Failed to load entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isOnline]);

  useEffect(() => {
    refreshEntries();
  }, [refreshEntries]);

  const addEntry = useCallback(async (input: MileageEntryInput): Promise<MileageEntry> => {
    // Add to local IndexedDB first
    const newEntry = await dbAddEntry(input);
    setEntries(prev => [newEntry, ...prev]);

    // Sync to Supabase if online and user is authenticated
    if (isOnline && user) {
      try {
        await supabaseEntries.add(localToSupabase(newEntry, user.id));
      } catch (err) {
        console.error('Failed to sync new entry to cloud:', err);
        // Entry is still saved locally, will sync later
      }
    }

    return newEntry;
  }, [isOnline, user]);

  const deleteEntry = useCallback(async (id: string) => {
    // Delete from local IndexedDB first
    await dbDeleteEntry(id);
    setEntries(prev => prev.filter(entry => entry.id !== id));

    // Sync to Supabase if online
    if (isOnline) {
      try {
        await supabaseEntries.delete(id);
      } catch (err) {
        console.error('Failed to sync delete to cloud:', err);
      }
    }
  }, [isOnline]);

  const updateEntry = useCallback(async (id: string, input: Partial<MileageEntryInput>) => {
    // Update local IndexedDB first
    const updated = await dbUpdateEntry(id, input);
    if (updated) {
      setEntries(prev => prev.map(entry => entry.id === id ? updated : entry));

      // Sync to Supabase if online
      if (isOnline) {
        try {
          await supabaseEntries.update(id, {
            date: updated.date,
            miles: updated.miles,
            liters: updated.liters,
            price_per_liter: updated.pricePence,
            mileage_km_per_l: updated.mileageKmPerL,
            mileage_mpg: updated.mileageMilesPerGallon,
            image: updated.image || null
          });
        } catch (err) {
          console.error('Failed to sync update to cloud:', err);
        }
      }
    }
    return updated;
  }, [isOnline]);

  return (
    <EntriesContext.Provider value={{
      entries,
      isLoading,
      isSyncing,
      error,
      isOnline,
      addEntry,
      deleteEntry,
      updateEntry,
      refreshEntries
    }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const context = useContext(EntriesContext);
  if (context === undefined) {
    throw new Error('useEntries must be used within an EntriesProvider');
  }
  return context;
}

