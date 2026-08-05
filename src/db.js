import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Null when the env vars aren't set — the app then runs in
// localStorage-only mode instead of crashing.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

const warn = (op, error) => console.warn(`Supabase ${op} failed:`, error.message || error);

// ─── orders ───

export async function dbFetchOrders() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { warn("fetch orders", error); return null; }
  return data;
}

export function dbInsertOrder(order) {
  if (!supabase) return;
  supabase.from("orders").insert(order)
    .then(({ error }) => { if (error) warn("insert order", error); });
}

export function dbUpdateOrder(id, changes) {
  if (!supabase) return;
  supabase.from("orders").update(changes).eq("id", id)
    .then(({ error }) => { if (error) warn("update order", error); });
}

export function dbDeleteOrder(id) {
  if (!supabase) return;
  supabase.from("orders").delete().eq("id", id)
    .then(({ error }) => { if (error) warn("delete order", error); });
}

// ─── owner auth (Supabase Auth) ───

export async function dbSignIn(email, password) {
  if (!supabase) return "no-supabase";
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? (error.message || "sign-in failed") : null;
}

export async function dbHasSession() {
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return !!data?.session;
}

// The email of whoever is currently signed in — used so "change password"
// re-verifies against the real logged-in account rather than one hardcoded
// owner, now that more than one person can hold their own login.
export async function dbCurrentEmail() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user?.email || null;
}

export async function dbUpdatePassword(newPassword) {
  if (!supabase) return "no-supabase";
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return error ? (error.message || "update failed") : null;
}

// Public order tracking through the track_order() RPC — returns one order's
// public fields, or null when nothing matched / the RPC isn't installed yet.
export async function dbTrackOrder(q) {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("track_order", { q });
  if (error) { warn("track order", error); return null; }
  return data && data.length ? data[0] : null;
}

// ─── settings (key → jsonb value) ───

export async function dbFetchSettings() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("settings").select("key,value");
  if (error) { warn("fetch settings", error); return null; }
  return Object.fromEntries(data.map(r => [r.key, r.value]));
}

export function dbSaveSetting(key, value) {
  if (!supabase) return;
  supabase.from("settings").upsert({ key, value })
    .then(({ error }) => { if (error) warn(`save setting "${key}"`, error); });
}
