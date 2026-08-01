-- Tightens access control. Before this migration, both tables were fully
-- publicly readable and writable via the anon key that ships in the site's
-- JavaScript. After it:
--
--   orders:   anyone may CREATE a booking; only the signed-in owner may
--             read, update, or delete them (protects customer names/phones).
--   settings: anyone may READ site content (the public site needs it);
--             only the signed-in owner may change it.
--   tracking: customers look up a single order through the track_order()
--             function below instead of reading the whole table.
--
-- REQUIRED SETUP (do these together with running this file):
--   1. Supabase Dashboard -> Authentication -> Users -> Add user:
--      email = iinfoworks@gmail.com, choose a strong password,
--      tick "Auto Confirm User".
--   2. Authentication -> Sign In / Up -> disable "Allow new users to sign up".
--   3. If you change the owner email, update it in the policies below AND in
--      OWNER_EMAIL in src/App.jsx.

drop policy if exists "Public orders" on orders;
drop policy if exists "Public settings" on settings;

-- The owner is the authenticated Supabase user with this email.
create or replace function is_owner()
returns boolean
language sql
stable
as $$
  select auth.role() = 'authenticated'
     and auth.email() = 'iinfoworks@gmail.com';
$$;

-- orders
create policy "Anyone can create a booking" on orders
  for insert with check (true);

create policy "Owner reads orders" on orders
  for select using (is_owner());

create policy "Owner updates orders" on orders
  for update using (is_owner()) with check (is_owner());

create policy "Owner deletes orders" on orders
  for delete using (is_owner());

-- settings
create policy "Public reads settings" on settings
  for select using (true);

create policy "Owner inserts settings" on settings
  for insert with check (is_owner());

create policy "Owner updates settings" on settings
  for update using (is_owner()) with check (is_owner());

create policy "Owner deletes settings" on settings
  for delete using (is_owner());

-- The old client-side password hash is superseded by Supabase Auth and must
-- not remain publicly readable.
delete from settings where key = 'admin_pw_hash';

-- Public order tracking: returns at most one exact match by order ID or the
-- phone number used at booking, exposing only the fields the tracking page
-- shows. SECURITY DEFINER lets it bypass RLS for this narrow lookup.
create or replace function track_order(q text)
returns table(id text, name text, service text, status text, paxi text,
              eta text, logistic text, branch text)
language sql
security definer
set search_path = public
as $$
  select id, name, service, status, paxi, eta, logistic, branch
  from orders
  where upper(id) = upper(trim(q))
     or replace(phone, ' ', '') = replace(trim(q), ' ', '')
  limit 1;
$$;

revoke all on function track_order(text) from public;
grant execute on function track_order(text) to anon, authenticated;
