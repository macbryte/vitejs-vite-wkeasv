export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string;
          created_at: string;
          category: string;
          description: string;
          value: number;
        };
        Insert: Omit<Database['public']['Tables']['assets']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['assets']['Insert']>;
      };
      liabilities: {
        Row: {
          id: string;
          created_at: string;
          category: string;
          description: string;
          amount: number;
        };
        Insert: Omit<Database['public']['Tables']['liabilities']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['liabilities']['Insert']>;
      };
      net_worth_history: {
        Row: {
          date: string;
          created_at: string;
          total_assets: number;
          total_liabilities: number;
          net_worth: number;
        };
        Insert: Omit<Database['public']['Tables']['net_worth_history']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['net_worth_history']['Insert']>;
      };
    };
  };
}