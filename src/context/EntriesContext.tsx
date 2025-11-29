import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { MileageEntry, MileageEntryInput } from '../types';
import { getAllEntries, addEntry as dbAddEntry, deleteEntry as dbDeleteEntry, updateEntry as dbUpdateEntry } from '../db/database';

interface EntriesContextType {
  entries: MileageEntry[];
  isLoading: boolean;
  error: string | null;
  addEntry: (input: MileageEntryInput) => Promise<MileageEntry>;
  deleteEntry: (id: string) => Promise<void>;
  updateEntry: (id: string, input: Partial<MileageEntryInput>) => Promise<MileageEntry | undefined>;
  refreshEntries: () => Promise<void>;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<MileageEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllEntries();
      setEntries(data);
    } catch (err) {
      setError('Failed to load entries');
      console.error('Failed to load entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshEntries();
  }, [refreshEntries]);

  const addEntry = useCallback(async (input: MileageEntryInput): Promise<MileageEntry> => {
    const newEntry = await dbAddEntry(input);
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    await dbDeleteEntry(id);
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const updateEntry = useCallback(async (id: string, input: Partial<MileageEntryInput>) => {
    const updated = await dbUpdateEntry(id, input);
    if (updated) {
      setEntries(prev => prev.map(entry => entry.id === id ? updated : entry));
    }
    return updated;
  }, []);

  return (
    <EntriesContext.Provider value={{
      entries,
      isLoading,
      error,
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

