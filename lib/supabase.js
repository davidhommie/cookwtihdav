import { createClient } from '@supabase/supabase-js';

// Never let a mistyped variable crash the build: trim it, check its shape, and fall back to demo mode.
const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

let client = null;
try {
  if (/^https?:\/\/[^\s/]+$/i.test(url) && key) client = createClient(url, key);
} catch (e) {
  client = null;
}

export const supabase = client;
export const hasSupabase = Boolean(client);
