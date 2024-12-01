export interface Asset {
  id: string;
  category: string;
  description: string;
  value: number;
}

export interface Liability {
  id: string;
  category: string;
  description: string;
  amount: number;
}

export interface NetWorthEntry {
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}