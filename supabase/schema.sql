-- Create tables with proper timestamps and relationships
create table public.assets (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  category text not null,
  description text not null,
  value decimal not null check (value >= 0)
);

create table public.liabilities (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  category text not null,
  description text not null,
  amount decimal not null check (amount >= 0)
);

create table public.net_worth_history (
  date date primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  total_assets decimal not null,
  total_liabilities decimal not null,
  net_worth decimal not null
);

-- Set up row level security (RLS)
alter table public.assets enable row level security;
alter table public.liabilities enable row level security;
alter table public.net_worth_history enable row level security;

-- Create policies
create policy "Enable read access for all users" on public.assets
  for select using (true);

create policy "Enable insert access for all users" on public.assets
  for insert with check (true);

create policy "Enable delete access for all users" on public.assets
  for delete using (true);

create policy "Enable read access for all users" on public.liabilities
  for select using (true);

create policy "Enable insert access for all users" on public.liabilities
  for insert with check (true);

create policy "Enable delete access for all users" on public.liabilities
  for delete using (true);

create policy "Enable read access for all users" on public.net_worth_history
  for select using (true);

create policy "Enable insert access for all users" on public.net_worth_history
  for insert with check (true);