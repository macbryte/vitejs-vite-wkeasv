import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add validation to ensure URL is properly formatted
if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  console.error('Invalid or missing Supabase URL. Please check your .env file.');
  throw new Error('Invalid Supabase configuration');
}

if (!supabaseKey) {
  console.error('Missing Supabase anonymous key. Please check your .env file.');
  throw new Error('Invalid Supabase configuration');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Connection test function
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('assets').select('count').single();
    if (error) throw error;
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}