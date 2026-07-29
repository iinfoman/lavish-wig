create table if not exists orders (
  id text primary key,
  name text default '',
  phone text default '',
  email text default '',
  service text default '',
  type text default '',
  condition text default '',
  logistic text default '',
  branch text default '',
  eta text default '',
  status text default 'Booked',
  paxi text default '',
  amount integer default 0,
  notes text default '',
  created_at timestamptz default now()
);

create table if not exists settings (
  key text primary key,
  value jsonb
);

alter table orders enable row level security;
alter table settings enable row level security;

create policy "Public orders" on orders
  for all using (true) with check (true);

create policy "Public settings" on settings
  for all using (true) with check (true);
