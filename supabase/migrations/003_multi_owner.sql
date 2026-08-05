-- Allows more than one Supabase Auth account to count as "owner" — the
-- agency (support/admin access) and the actual Lavish Wig business owner
-- each get their own login and their own password, rather than sharing one
-- account. Add or remove emails from this list as access needs change.
create or replace function is_owner()
returns boolean
language sql
stable
set search_path = public
as $$
  select auth.role() = 'authenticated'
     and auth.email() = any(array[
       'iinfoworks@gmail.com',
       'lavishwigsa@gmail.com'
     ]);
$$;
