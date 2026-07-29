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
