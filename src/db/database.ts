import Dexie, { type EntityTable } from 'dexie';
import type { MileageEntry, MileageEntryInput, AppSettings } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { MILES_TO_KM, LITERS_TO_GALLONS } from '../types';

// Database schema
const db = new Dexie('CarMileageDB') as Dexie & {
  entries: EntityTable<MileageEntry, 'id'>;
  settings: EntityTable<AppSettings & { id: string }, 'id'>;
};

db.version(1).stores({
  entries: 'id, date, createdAt',
  settings: 'id'
});

// Calculate mileage values
export function calculateMileage(miles: number, liters: number) {
  const km = miles * MILES_TO_KM;
  const kmPerL = km / liters;
  const mpg = miles / (liters * LITERS_TO_GALLONS);
  
  return {
    mileageKmPerL: Math.round(kmPerL * 100) / 100,
    mileageMilesPerGallon: Math.round(mpg * 100) / 100
  };
}

// Entry CRUD operations
export async function addEntry(input: MileageEntryInput): Promise<MileageEntry> {
  const now = new Date().toISOString();
  const mileage = calculateMileage(input.miles, input.liters);
  
  const entry: MileageEntry = {
    id: uuidv4(),
    ...input,
    ...mileage,
    createdAt: now,
    updatedAt: now
  };
  
  await db.entries.add(entry);
  return entry;
}

export async function getAllEntries(): Promise<MileageEntry[]> {
  return db.entries.orderBy('date').reverse().toArray();
}

export async function getEntryById(id: string): Promise<MileageEntry | undefined> {
  return db.entries.get(id);
}

export async function updateEntry(id: string, input: Partial<MileageEntryInput>): Promise<MileageEntry | undefined> {
  const existing = await db.entries.get(id);
  if (!existing) return undefined;
  
  const miles = input.miles ?? existing.miles;
  const liters = input.liters ?? existing.liters;
  const mileage = calculateMileage(miles, liters);
  
  const updates = {
    ...input,
    ...mileage,
    updatedAt: new Date().toISOString()
  };
  
  await db.entries.update(id, updates);
  return { ...existing, ...updates };
}

export async function deleteEntry(id: string): Promise<void> {
  await db.entries.delete(id);
}

// Settings operations
const SETTINGS_ID = 'app-settings';

export async function getSettings(): Promise<AppSettings> {
  const settings = await db.settings.get(SETTINGS_ID);
  return settings ?? { mileageUnit: 'km/l', theme: 'light' };
}

export async function updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const newSettings = { ...current, ...updates, id: SETTINGS_ID };
  await db.settings.put(newSettings);
  return newSettings;
}

// Database info for debugging
export async function getDatabaseInfo() {
  const entryCount = await db.entries.count();
  const settings = await getSettings();
  return {
    entryCount,
    settings,
    dbName: db.name,
    version: db.verno
  };
}

export { db };

