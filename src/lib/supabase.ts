import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ievjfhlsvjvwrbvyiajp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldmpmaGxzdmp2d3JidnlpYWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NTA4ODksImV4cCI6MjA4MDAyNjg4OX0.gYyjnBuPLNUMpkPGhsjTIlE-74zPcyewzS9EZEv223M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface SupabaseMileageEntry {
  id: string;
  user_id: string;
  date: string;
  miles: number;
  liters: number;
  price_per_liter: number;
  mileage_km_per_l: number;
  mileage_mpg: number;
  image: string | null;
  created_at: string;
  updated_at: string;
}

// Helper functions for Supabase operations
export const supabaseEntries = {
  // Fetch all entries from Supabase
  async getAll(): Promise<SupabaseMileageEntry[]> {
    const { data, error } = await supabase
      .from('mileage_entries')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching entries from Supabase:', error);
      throw error;
    }

    return data || [];
  },

  // Add a new entry to Supabase
  async add(entry: Omit<SupabaseMileageEntry, 'created_at' | 'updated_at'>): Promise<SupabaseMileageEntry> {
    const { data, error } = await supabase
      .from('mileage_entries')
      .insert([entry])
      .select()
      .single();

    if (error) {
      console.error('Error adding entry to Supabase:', error);
      throw error;
    }

    return data;
  },

  // Update an entry in Supabase
  async update(id: string, updates: Partial<Omit<SupabaseMileageEntry, 'id' | 'created_at'>>): Promise<SupabaseMileageEntry> {
    const { data, error } = await supabase
      .from('mileage_entries')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating entry in Supabase:', error);
      throw error;
    }

    return data;
  },

  // Delete an entry from Supabase
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('mileage_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting entry from Supabase:', error);
      throw error;
    }
  }
};

