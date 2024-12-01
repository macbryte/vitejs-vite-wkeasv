import { supabase } from '../lib/supabase';
import type { Asset, Liability, NetWorthEntry } from '../types/finance';

export async function getAllAssets(): Promise<Asset[]> {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllLiabilities(): Promise<Liability[]> {
  const { data, error } = await supabase
    .from('liabilities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllHistory(): Promise<NetWorthEntry[]> {
  const { data, error } = await supabase
    .from('net_worth_history')
    .select('*')
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addAsset(asset: Omit<Asset, 'id' | 'created_at'>): Promise<Asset> {
  const { data, error } = await supabase
    .from('assets')
    .insert([asset])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addLiability(liability: Omit<Liability, 'id' | 'created_at'>): Promise<Liability> {
  const { data, error } = await supabase
    .from('liabilities')
    .insert([liability])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addHistoryEntry(entry: Omit<NetWorthEntry, 'created_at'>): Promise<NetWorthEntry> {
  const { data, error } = await supabase
    .from('net_worth_history')
    .insert([{
      date: entry.date,
      total_assets: entry.totalAssets,
      total_liabilities: entry.totalLiabilities,
      net_worth: entry.netWorth
    }])
    .select()
    .single();

  if (error) throw error;
  return {
    date: data.date,
    totalAssets: data.total_assets,
    totalLiabilities: data.total_liabilities,
    netWorth: data.net_worth
  };
}

export async function removeAsset(id: string): Promise<void> {
  const { error } = await supabase
    .from('assets')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function removeLiability(id: string): Promise<void> {
  const { error } = await supabase
    .from('liabilities')
    .delete()
    .eq('id', id);

  if (error) throw error;
}